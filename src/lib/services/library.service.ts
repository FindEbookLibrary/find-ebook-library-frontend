/**
 * 도서관 관련 API 서비스
 * Fine EBook Library 백엔드와 통신하여 도서관 관리 기능을 제공합니다.
 */

import { apiClient, ApiResponse } from './api.config';
import type {
  Library as ApiLibrary,
  LibraryRequest,
  LibraryType,
} from '@/types/api.types';
import type { Library } from '@/types/library.types';
import { MOCK_LIBRARIES, shouldUseMockData } from '@lib/mock/data';

/**
 * 도서관 서비스 클래스
 */
class LibraryService {
  private mapApiLibraryToUiLibrary(library: ApiLibrary): Library {
    return {
      libCode: String(library.id),
      libName: library.name,
      type: library.type as never,
      homepage: library.url,
      operatingInstitution: library.provider,
      description: library.description,
    };
  }

  /**
   * 도서관 목록 조회
   * @param type - 도서관 유형 필터 (선택)
   * @returns 도서관 목록
   */
  async getLibraries(type?: LibraryType): Promise<ApiResponse<Library[]>> {
    if (shouldUseMockData()) {
      return {
        success: true,
        data: MOCK_LIBRARIES,
      };
    }

    try {
      const params = type ? { type } : {};
      const response = await apiClient.get<ApiResponse<ApiLibrary[]>>('/libraries', { params });
      return {
        ...response.data,
        data: response.data.data?.map((library) => this.mapApiLibraryToUiLibrary(library)),
      };
    } catch (error) {
      console.error('도서관 목록 조회 실패:', error);
      return {
        success: true,
        data: MOCK_LIBRARIES,
      };
    }
  }

  async getAccessibleLibraries(): Promise<Library[]> {
    const response = await this.getLibraries();
    return response.data ?? [];
  }

  /**
   * 도서관 생성 (관리자 전용)
   * @param data - 도서관 정보
   * @returns 생성된 도서관 정보
   */
  async createLibrary(data: LibraryRequest): Promise<ApiResponse<Library>> {
    const response = await apiClient.post<ApiResponse<Library>>('/libraries', data);
    return response.data;
  }

  /**
   * 도서관 수정 (관리자 전용)
   * @param id - 도서관 ID
   * @param data - 수정할 도서관 정보
   * @returns 수정된 도서관 정보
   */
  async updateLibrary(id: number, data: LibraryRequest): Promise<ApiResponse<Library>> {
    const response = await apiClient.put<ApiResponse<Library>>(`/libraries/${id}`, data);
    return response.data;
  }

  /**
   * 도서관 삭제 (관리자 전용)
   * @param id - 도서관 ID
   * @returns 성공 여부
   */
  async deleteLibrary(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/libraries/${id}`);
    return response.data;
  }
}

// 싱글톤 인스턴스 생성 및 export
export const libraryService = new LibraryService();
export default libraryService;
