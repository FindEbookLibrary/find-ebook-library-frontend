/**
 * 전자책 관련 API 서비스
 * 전자책 검색, 상세 조회, 도서관별 보유 정보 조회 등의 API 호출 함수를 제공합니다.
 */

import { apiClient } from './api.config';
import {
  EBook,
  BookSearchParams,
  BookSearchApiResponse,
  LibraryBookInfo,
} from '@types/book.types';

/**
 * 전자책 서비스 클래스
 * 모든 전자책 관련 API 호출을 담당합니다.
 */
class BookService {
  /**
   * 전자책 통합 검색
   * 여러 전자도서관의 전자책을 한 번에 검색합니다.
   *
   * @param params - 검색 파라미터 (키워드, 도서관, 페이지 등)
   * @returns 전자책 검색 결과
   *
   * @example
   * const result = await bookService.searchBooks({
   *   keyword: '해리포터',
   *   pageNo: 1,
   *   pageSize: 20,
   *   libraryCodes: ['LIB001', 'LIB002']
   * });
   */
  async searchBooks(params: BookSearchParams): Promise<BookSearchApiResponse> {
    try {
      // API 요청 파라미터 구성
      const requestParams = {
        keyword: params.keyword,
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 10,
        libraryCodes: params.libraryCodes || [],
        searchType: params.searchType || 'ALL',
        category: params.category,
        publicationYearFrom: params.publicationYearFrom,
        publicationYearTo: params.publicationYearTo,
      };

      // 우리 백엔드 API 호출
      // 백엔드에서 여러 도서관 API를 병렬로 호출하고 결과를 통합
      const response = await apiClient.post('/books/search', requestParams);

      if (response.data.success) {
        const data = response.data.data;

        return {
          result: 'RESULT',
          totalResults: data.totalResults,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          books: data.books,
        };
      }

      return {
        result: 'ERROR',
        errorMessage: response.data.message || '검색 실패',
      };
    } catch (error) {
      console.error('전자책 검색 실패:', error);

      return {
        result: 'ERROR',
        errorMessage: '전자책 검색 중 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 전자책 상세 정보 조회
   * ISBN으로 특정 전자책의 상세 정보를 가져옵니다.
   *
   * @param isbn - 책 ISBN
   * @param libraryCodes - 조회할 도서관 코드 목록 (선택)
   * @returns 전자책 상세 정보
   *
   * @example
   * const book = await bookService.getBookDetail('9788932917245');
   */
  async getBookDetail(isbn: string, libraryCodes?: string[]): Promise<EBook | null> {
    try {
      // API 요청 파라미터
      const params = libraryCodes ? { libraryCodes } : {};

      // 우리 백엔드 API 호출
      const response = await apiClient.get(`/books/${isbn}`, { params });

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('전자책 상세 조회 실패:', error);
      return null;
    }
  }

  /**
   * 특정 책의 도서관별 보유 현황 조회
   *
   * @param isbn - 책 ISBN
   * @param libraryCodes - 조회할 도서관 코드 목록
   * @returns 도서관별 보유 정보 목록
   *
   * @example
   * const availability = await bookService.getBookAvailability(
   *   '9788932917245',
   *   ['LIB001', 'LIB002']
   * );
   */
  async getBookAvailability(
    isbn: string,
    libraryCodes: string[]
  ): Promise<LibraryBookInfo[]> {
    try {
      // 우리 백엔드 API 호출
      const response = await apiClient.post('/books/availability', {
        isbn,
        libraryCodes,
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('책 보유 현황 조회 실패:', error);
      return [];
    }
  }

  /**
   * 최근 검색한 책 목록 조회
   *
   * @param limit - 조회할 개수 (기본값: 10)
   * @returns 최근 검색한 책 목록
   */
  async getRecentSearches(limit: number = 10): Promise<EBook[]> {
    try {
      const response = await apiClient.get('/books/recent', {
        params: { limit },
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('최근 검색 조회 실패:', error);
      return [];
    }
  }

  /**
   * 책 검색 기록 저장
   * 사용자가 검색한 책을 기록합니다.
   *
   * @param isbn - 책 ISBN
   * @returns 성공 여부
   */
  async saveSearchHistory(isbn: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/books/search-history', {
        isbn,
      });

      return response.data.success;
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
      return false;
    }
  }

  /**
   * 인기 검색어 조회
   *
   * @param limit - 조회할 개수 (기본값: 10)
   * @returns 인기 검색어 목록
   */
  async getPopularKeywords(limit: number = 10): Promise<string[]> {
    try {
      const response = await apiClient.get('/books/popular-keywords', {
        params: { limit },
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('인기 검색어 조회 실패:', error);
      return [];
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const bookService = new BookService();
