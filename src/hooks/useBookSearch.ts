/**
 * 전자책 검색 커스텀 훅
 * 전자책 검색 로직을 재사용 가능한 훅으로 만듭니다.
 */

import { useEffect } from 'react';
import { useSearchStore } from '@stores/searchStore';
import { bookService } from '@lib/services/book.service';
import { BookSearchParams } from '@types/book.types';

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
 *     search({ keyword: '해리포터' });
 *   };
 *
 *   return (
 *     <div>
 *       {isLoading && <p>검색 중...</p>}
 *       {error && <p>에러: {error}</p>}
 *       {results.map(book => <div key={book.isbn}>{book.title}</div>)}
 *     </div>
 *   );
 * }
 */
export const useBookSearch = () => {
  // Zustand store에서 필요한 상태와 액션 가져오기
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
  } = useSearchStore();

  /**
   * 검색 실행 함수
   *
   * @param params - 검색 파라미터 (키워드, 페이지 등)
   */
  const search = async (params?: Partial<BookSearchParams>) => {
    // 검색 키워드가 없으면 리턴
    const searchKeyword = params?.keyword || keyword;
    if (!searchKeyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    // 로딩 시작
    setLoading(true);
    setError(null);

    try {
      // 검색 파라미터 구성
      const searchParams: BookSearchParams = {
        keyword: searchKeyword,
        pageNo: params?.pageNo || currentPage,
        pageSize: params?.pageSize || pageSize,
        libraryCodes: params?.libraryCodes || selectedLibraryCodes,
        searchType: params?.searchType || searchType,
      };

      // API 호출
      const response = await bookService.searchBooks(searchParams);

      if (response.result === 'RESULT' && response.books) {
        // 검색 성공
        setResults(response.books, response.totalResults || 0);

        // 최근 검색어에 추가
        addRecentKeyword(searchKeyword);

        // 검색 기록 저장 (비동기로 실행, 실패해도 무시)
        if (response.books.length > 0) {
          bookService.saveSearchHistory(response.books[0].isbn).catch(() => {
            // 저장 실패는 무시
          });
        }
      } else {
        // 검색 실패
        setError(response.errorMessage || '검색 결과가 없습니다.');
        setResults([], 0);
      }
    } catch (err) {
      console.error('검색 오류:', err);
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
    search({ pageNo: page });
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
  };
};
