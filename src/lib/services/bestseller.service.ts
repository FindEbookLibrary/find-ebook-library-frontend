/**
 * 베스트셀러 관련 API 서비스
 * 서점별 베스트셀러 조회 및 전자도서관 매칭 기능을 제공합니다.
 */

import { apiClient } from './api.config';
import {
  BestsellerBook,
  BestsellerParams,
  BestsellerApiResponse,
  BookStore,
  BestsellerCategory,
} from '@types/bestseller.types';

/**
 * 베스트셀러 서비스 클래스
 * 모든 베스트셀러 관련 API 호출을 담당합니다.
 */
class BestsellerService {
  /**
   * 베스트셀러 목록 조회 (전자도서관 매칭 포함)
   * 지정한 서점의 베스트셀러를 조회하고, 각 책이 어떤 전자도서관에 있는지 확인합니다.
   *
   * @param params - 베스트셀러 조회 파라미터
   * @returns 베스트셀러 목록 및 도서관 매칭 정보
   *
   * @example
   * const result = await bestsellerService.getBestsellers({
   *   bookStore: BookStore.YES24,
   *   category: '소설',
   *   count: 20,
   *   libraryCodes: ['LIB001', 'LIB002']
   * });
   */
  async getBestsellers(params: BestsellerParams): Promise<BestsellerApiResponse> {
    try {
      // API 요청 파라미터 구성
      const requestParams = {
        bookStore: params.bookStore,
        category: params.category,
        count: params.count || 20,
        libraryCodes: params.libraryCodes || [],
      };

      // 우리 백엔드 API 호출
      // 백엔드에서:
      // 1. 서점 API에서 베스트셀러 가져오기
      // 2. 각 베스트셀러가 어떤 도서관에 있는지 확인
      // 3. 통합 결과 반환
      const response = await apiClient.post('/bestsellers', requestParams);

      if (response.data.success) {
        const data = response.data.data;

        return {
          result: 'RESULT',
          bookStore: params.bookStore,
          timestamp: new Date().toISOString(),
          bestsellers: data.bestsellers,
        };
      }

      return {
        result: 'ERROR',
        bookStore: params.bookStore,
        timestamp: new Date().toISOString(),
        errorMessage: response.data.message || '베스트셀러 조회 실패',
      };
    } catch (error) {
      console.error('베스트셀러 조회 실패:', error);

      return {
        result: 'ERROR',
        bookStore: params.bookStore,
        timestamp: new Date().toISOString(),
        errorMessage: '베스트셀러 조회 중 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 특정 베스트셀러 책의 도서관 보유 현황 조회
   *
   * @param isbn - 책 ISBN
   * @param libraryCodes - 조회할 도서관 코드 목록
   * @returns 도서관별 보유 현황
   *
   * @example
   * const availability = await bestsellerService.getBookLibraryMatching(
   *   '9788932917245',
   *   ['LIB001', 'LIB002']
   * );
   */
  async getBookLibraryMatching(isbn: string, libraryCodes: string[]) {
    try {
      const response = await apiClient.post('/bestsellers/match', {
        isbn,
        libraryCodes,
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('베스트셀러 도서관 매칭 실패:', error);
      return [];
    }
  }

  /**
   * 서점별 카테고리 목록 조회
   *
   * @param bookStore - 서점
   * @returns 카테고리 목록
   *
   * @example
   * const categories = await bestsellerService.getCategories(BookStore.YES24);
   */
  async getCategories(bookStore: BookStore): Promise<BestsellerCategory[]> {
    try {
      const response = await apiClient.get('/bestsellers/categories', {
        params: { bookStore },
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      return [];
    }
  }

  /**
   * 여러 서점의 베스트셀러를 한 번에 조회
   *
   * @param bookStores - 서점 목록
   * @param category - 카테고리 (선택)
   * @param count - 서점당 조회할 개수
   * @param libraryCodes - 도서관 코드 목록
   * @returns 서점별 베스트셀러 목록
   *
   * @example
   * const results = await bestsellerService.getMultiStoreBestsellers(
   *   [BookStore.YES24, BookStore.KYOBO],
   *   '소설',
   *   20,
   *   ['LIB001']
   * );
   */
  async getMultiStoreBestsellers(
    bookStores: BookStore[],
    category?: string,
    count: number = 20,
    libraryCodes?: string[]
  ): Promise<Record<BookStore, BestsellerApiResponse>> {
    try {
      // 각 서점별로 병렬로 API 호출
      const promises = bookStores.map((bookStore) =>
        this.getBestsellers({
          bookStore,
          category,
          count,
          libraryCodes,
        })
      );

      // 모든 요청이 완료될 때까지 대기
      const results = await Promise.all(promises);

      // 서점을 키로 하는 객체로 변환
      const resultMap: Record<BookStore, BestsellerApiResponse> = {} as Record<
        BookStore,
        BestsellerApiResponse
      >;

      bookStores.forEach((bookStore, index) => {
        resultMap[bookStore] = results[index];
      });

      return resultMap;
    } catch (error) {
      console.error('다중 서점 베스트셀러 조회 실패:', error);

      // 에러 발생 시 빈 응답 반환
      const errorResult: Record<BookStore, BestsellerApiResponse> = {} as Record<
        BookStore,
        BestsellerApiResponse
      >;

      bookStores.forEach((bookStore) => {
        errorResult[bookStore] = {
          result: 'ERROR',
          bookStore,
          timestamp: new Date().toISOString(),
          errorMessage: '베스트셀러 조회 중 오류가 발생했습니다.',
        };
      });

      return errorResult;
    }
  }

  /**
   * 베스트셀러 캐시 갱신 요청
   * 백엔드에 베스트셀러 데이터를 새로 가져오도록 요청합니다.
   *
   * @param bookStore - 서점
   * @returns 성공 여부
   */
  async refreshBestsellers(bookStore: BookStore): Promise<boolean> {
    try {
      const response = await apiClient.post('/bestsellers/refresh', {
        bookStore,
      });

      return response.data.success;
    } catch (error) {
      console.error('베스트셀러 갱신 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const bestsellerService = new BestsellerService();
