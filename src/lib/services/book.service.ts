/**
 * 전자책 관련 API 서비스
 * Fine EBook Library 백엔드와 통신하여 도서 검색, 상세 조회 등을 처리합니다.
 */

import { apiClient, ApiResponse, PageResponse } from './api.config';
import type { Book } from '@/types/api.types';
import { POPULAR_KEYWORDS, shouldUseMockData } from '@lib/mock/data';

/**
 * 전자책 서비스 클래스
 */
class BookService {
  /**
   * 도서 검색
   * @param keyword - 검색 키워드 (제목, 저자, ISBN)
   * @param page - 페이지 번호 (0부터 시작)
   * @param size - 페이지당 결과 수
   * @returns 검색 결과 (페이지네이션 포함)
   */
  async searchBooks(
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<Book>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<Book>>>('/books/search', {
      params: { keyword, page, size }
    });
    return response.data;
  }

  /**
   * 도서 상세 조회 (ID)
   * @param id - 도서 ID
   * @returns 도서 상세 정보
   */
  async getBookById(id: number): Promise<ApiResponse<Book>> {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data;
  }

  /**
   * 도서 상세 조회 (ISBN)
   * @param isbn - ISBN 번호
   * @returns 도서 상세 정보
   */
  async getBookByIsbn(isbn: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/isbn/${isbn}`);
    return response.data;
  }

  /**
   * 랜딩 화면에서 쓰는 인기 검색어 목록입니다.
   * 백엔드가 아직 준비되지 않았을 때도 UI가 비지 않도록 mock 값을 반환합니다.
   */
  async getPopularKeywords(limit: number = 10): Promise<string[]> {
    if (shouldUseMockData()) {
      return POPULAR_KEYWORDS.slice(0, limit);
    }

    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/books/popular-keywords', {
        params: { limit },
      });

      return response.data.data?.slice(0, limit) ?? POPULAR_KEYWORDS.slice(0, limit);
    } catch (error) {
      console.error('인기 검색어 조회 실패:', error);
      return POPULAR_KEYWORDS.slice(0, limit);
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const bookService = new BookService();
export default bookService;
