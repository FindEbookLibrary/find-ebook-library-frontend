import { useSearchStore } from '@stores/searchStore';
import { useUserStore } from '@stores/userStore';
import { bookService } from '@lib/services/book.service';
import { getMockSearchResults, shouldUseMockData } from '@lib/mock/data';
import { bookStats } from '@lib/utils/bookStats';
import { mapApiBookToEBook } from '@lib/utils/ebook';

/**
 * 전자책 검색 훅
 * 검색 상태 관리와 API 호출을 처리합니다.
 *
 * @returns 검색 상태와 검색 함수
 *
 * @example
 * function SearchComponent() {
 *   const { search, results, isLoading, error } = useBookSearch();
 *
 *   const handleSearch = () => {
 *     search('해리포터');
 *   };
 *
 *   return (
 *     <div>
 *       {isLoading && <p>검색 중...</p>}
 *       {error && <p>에러: {error}</p>}
 *       {results.map(book => <div key={book.id}>{book.title}</div>)}
 *     </div>
 *   );
 * }
 */
export const useBookSearch = () => {
  // 검색 Store에서 필요한 상태와 액션 가져오기
  const {
    keyword,
    results,
    searchType,
    currentPage,
    pageSize,
    totalResults,
    selectedLibraryCodes,
    isLoading,
    error,
    setKeyword,
    setResults,
    setCurrentPage,
    setLoading,
    setError,
    addRecentKeyword,
    reset,
  } = useSearchStore();

  // 사용자 Store에서 관심 도서관 정보 가져오기
  const {
    interestLibraryCodes,
    isInterestFilterEnabled,
  } = useUserStore();

  /**
   * 검색 실행 함수
   *
   * @param searchKeyword - 검색 키워드 (선택, 없으면 store의 keyword 사용)
   * @param page - 페이지 번호 (선택, 없으면 store의 currentPage 사용)
   */
  const search = async (searchKeyword?: string, page?: number) => {
    // 검색 키워드가 없으면 리턴
    const finalKeyword = searchKeyword || keyword;
    if (!finalKeyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    // 로딩 시작
    setLoading(true);
    setError(null);

    try {
      const finalPage = page !== undefined ? page : currentPage;
      let books;
      let totalResultsCount = 0;

      if (shouldUseMockData()) {
        books = getMockSearchResults(finalKeyword);
        totalResultsCount = books.length;
      } else {
        const response = await bookService.searchBooks(
          finalKeyword,
          Math.max(finalPage - 1, 0),
          pageSize
        );

        if (!response.success || !response.data) {
          setError(response.message || '검색 결과가 없습니다.');
          setResults([], 0);
          return;
        }

        books = response.data.content.map(mapApiBookToEBook);
        totalResultsCount = response.data.totalElements;
      }

      // "내 도서관만 보기"는 화면 상태이지만,
      // 검색 결과 수와 카드 배지도 이 필터를 같이 기준으로 삼는 편이 자연스러워서 여기서 잘라줍니다.
      const filteredBooks =
        isInterestFilterEnabled && interestLibraryCodes.length > 0
          ? books.filter(
              (book) => bookStats(book.availableLibraries, interestLibraryCodes).mine.length > 0
            )
          : books;

      setResults(filteredBooks, shouldUseMockData() ? filteredBooks.length : totalResultsCount);
      addRecentKeyword(finalKeyword);
    } catch (err) {
      console.error('검색 오류:', err);

      if (!shouldUseMockData()) {
        const fallbackBooks = getMockSearchResults(finalKeyword);
        setResults(fallbackBooks, fallbackBooks.length);
        setError('백엔드 응답이 없어 mock 검색 결과를 표시합니다.');
        addRecentKeyword(finalKeyword);
        return;
      }

      setError('검색 중 오류가 발생했습니다.');
      setResults([], 0);
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };

  /**
   * 페이지 변경 시 자동으로 검색
   */
  const changePage = (page: number) => {
    setCurrentPage(page);
    search(undefined, page);
  };

  /**
   * 검색어 변경 함수
   *
   * @param newKeyword - 새 검색어
   */
  const updateKeyword = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  return {
    // 상태
    keyword,
    results,
    searchType,
    currentPage,
    pageSize,
    totalResults,
    selectedLibraryCodes,
    isLoading,
    error,

    // 액션
    search,
    changePage,
    updateKeyword,
    setKeyword,
    setCurrentPage,
    reset,
  };
};
