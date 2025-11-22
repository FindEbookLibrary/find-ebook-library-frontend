/**
 * 베스트셀러 커스텀 훅
 * 베스트셀러 조회 및 도서관 매칭 로직을 처리합니다.
 */

import { useEffect } from 'react';
import { useBestsellerStore } from '@stores/bestsellerStore';
import { bestsellerService } from '@lib/services/bestseller.service';
import { BookStore } from '@types/bestseller.types';

/**
 * 베스트셀러 훅
 *
 * @param autoLoad - 컴포넌트 마운트 시 자동으로 베스트셀러 로드 여부 (기본값: false)
 * @returns 베스트셀러 상태와 함수들
 *
 * @example
 * function BestsellerComponent() {
 *   const {
 *     bestsellers,
 *     isLoading,
 *     loadBestsellers,
 *     changeBookStore
 *   } = useBestseller(true); // 자동 로드
 *
 *   return (
 *     <div>
 *       {bestsellers.map(book => (
 *         <div key={book.isbn}>{book.rank}. {book.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */
export const useBestseller = (autoLoad: boolean = false) => {
  // Zustand store에서 상태와 액션 가져오기
  const {
    selectedBookStore,
    selectedCategory,
    bestsellers,
    timestamp,
    isLoading,
    error,
    selectedLibraryCodes,
    setBookStore,
    setCategory,
    setBestsellers,
    setSelectedLibraries,
    setLoading,
    setError,
  } = useBestsellerStore();

  /**
   * 베스트셀러 로드 함수
   *
   * @param bookStore - 서점 (선택, 기본값은 현재 선택된 서점)
   * @param category - 카테고리 (선택)
   */
  const loadBestsellers = async (
    bookStore?: BookStore,
    category?: string | null
  ) => {
    // 로딩 시작
    setLoading(true);
    setError(null);

    try {
      const targetBookStore = bookStore || selectedBookStore;
      const targetCategory = category !== undefined ? category : selectedCategory;

      // API 호출
      const response = await bestsellerService.getBestsellers({
        bookStore: targetBookStore,
        category: targetCategory || undefined,
        count: 20, // 베스트셀러 20개 조회
        libraryCodes: selectedLibraryCodes,
      });

      if (response.result === 'RESULT' && response.bestsellers) {
        // 성공
        setBestsellers(response.bestsellers, response.timestamp);
      } else {
        // 실패
        setError(response.errorMessage || '베스트셀러 조회 실패');
        setBestsellers([], new Date().toISOString());
      }
    } catch (err) {
      console.error('베스트셀러 조회 오류:', err);
      setError('베스트셀러 조회 중 오류가 발생했습니다.');
      setBestsellers([], new Date().toISOString());
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };

  /**
   * 서점 변경 함수
   *
   * @param bookStore - 새 서점
   */
  const changeBookStore = (bookStore: BookStore) => {
    setBookStore(bookStore);
    // 서점 변경 후 새로 로드
    loadBestsellers(bookStore);
  };

  /**
   * 카테고리 변경 함수
   *
   * @param category - 새 카테고리 (null이면 전체)
   */
  const changeCategory = (category: string | null) => {
    setCategory(category);
    // 카테고리 변경 후 새로 로드
    loadBestsellers(undefined, category);
  };

  /**
   * 베스트셀러 새로고침 함수
   * 캐시를 무시하고 최신 데이터를 가져옵니다.
   */
  const refresh = async () => {
    // 백엔드 캐시 갱신 요청
    await bestsellerService.refreshBestsellers(selectedBookStore);

    // 새로 로드
    await loadBestsellers();
  };

  /**
   * 컴포넌트 마운트 시 자동 로드 (autoLoad가 true일 때)
   */
  useEffect(() => {
    if (autoLoad && bestsellers.length === 0) {
      loadBestsellers();
    }
  }, [autoLoad]);

  /**
   * 선택된 도서관이 변경되면 베스트셀러 재로드
   * (도서관 매칭 정보가 변경되므로)
   */
  useEffect(() => {
    if (bestsellers.length > 0 && selectedLibraryCodes.length > 0) {
      loadBestsellers();
    }
  }, [selectedLibraryCodes]);

  return {
    // 상태
    selectedBookStore,
    selectedCategory,
    bestsellers,
    timestamp,
    isLoading,
    error,
    selectedLibraryCodes,

    // 액션
    loadBestsellers,
    changeBookStore,
    changeCategory,
    refresh,
    setSelectedLibraries,
  };
};
