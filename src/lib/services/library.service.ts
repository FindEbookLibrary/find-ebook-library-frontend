/**
 * 도서관 관련 API 서비스
 * 도서관 검색, 상세 조회 등의 API 호출 함수를 제공합니다.
 */

import { libraryApiClient, apiClient, PaginatedResponse } from './api.config';
import {
  Library,
  LibrarySearchParams,
  LibraryApiResponse
} from '@types/library.types';

/**
 * 도서관 정보나루 API 인증 키
 * Next.js 환경 변수에서 가져옵니다.
 * .env.local 파일에 NEXT_PUBLIC_LIBRARY_API_KEY=your_key_here 형식으로 저장
 */
const LIBRARY_API_KEY = process.env.NEXT_PUBLIC_LIBRARY_API_KEY;

/**
 * 도서관 서비스 클래스
 * 모든 도서관 관련 API 호출을 담당합니다.
 */
class LibraryService {
  /**
   * 도서관 검색
   * 도서관 정보나루 API를 사용하여 도서관을 검색합니다.
   *
   * @param params - 검색 파라미터 (키워드, 페이지 등)
   * @returns 도서관 검색 결과
   *
   * @example
   * const result = await libraryService.searchLibraries({
   *   keyword: '서울',
   *   pageNo: 1,
   *   pageSize: 10
   * });
   */
  async searchLibraries(params: LibrarySearchParams): Promise<LibraryApiResponse> {
    try {
      // API 요청 파라미터 구성
      const queryParams = {
        authKey: LIBRARY_API_KEY,           // 인증 키 (필수)
        pageNo: params.pageNo || 1,         // 페이지 번호 (기본값: 1)
        pageSize: params.pageSize || 10,    // 페이지당 결과 수 (기본값: 10)
        ...(params.keyword && { keyword: params.keyword }),  // 검색 키워드 (선택)
        format: 'json',                     // 응답 형식 JSON
      };

      // API 호출
      const response = await libraryApiClient.get('/libSrch', {
        params: queryParams,
      });

      // API 응답 데이터 파싱
      const data = response.data;

      // 응답 데이터를 우리 타입으로 변환
      return {
        result: data.response?.resultNum > 0 ? 'RESULT' : 'ERROR',
        totalResults: data.response?.numFound || 0,
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 10,
        libraries: this.parseLibraries(data.response?.libs || []),
      };
    } catch (error) {
      console.error('도서관 검색 실패:', error);

      return {
        result: 'ERROR',
        errorMessage: '도서관 검색 중 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 도서관 상세 정보 조회
   * 도서관 코드로 특정 도서관의 상세 정보를 가져옵니다.
   *
   * @param libCode - 도서관 코드
   * @returns 도서관 상세 정보
   *
   * @example
   * const library = await libraryService.getLibraryDetail('LIB001');
   */
  async getLibraryDetail(libCode: string): Promise<Library | null> {
    try {
      // 우리 백엔드 API 호출 (캐시된 도서관 상세 정보 제공)
      const response = await apiClient.get(`/libraries/${libCode}`);

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('도서관 상세 조회 실패:', error);
      return null;
    }
  }

  /**
   * 사용자가 접근 가능한 도서관 목록 조회
   * 사용자의 소속 정보를 기반으로 접근 가능한 도서관 목록을 가져옵니다.
   *
   * @returns 접근 가능한 도서관 목록
   *
   * @example
   * const libraries = await libraryService.getAccessibleLibraries();
   */
  async getAccessibleLibraries(): Promise<Library[]> {
    try {
      // 우리 백엔드 API 호출 (사용자 인증 필요)
      const response = await apiClient.get('/libraries/accessible');

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('접근 가능한 도서관 조회 실패:', error);
      return [];
    }
  }

  /**
   * 도서관 즐겨찾기 추가
   *
   * @param libCode - 도서관 코드
   * @returns 성공 여부
   */
  async addFavoriteLibrary(libCode: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/libraries/favorites', {
        libCode,
      });

      return response.data.success;
    } catch (error) {
      console.error('즐겨찾기 추가 실패:', error);
      return false;
    }
  }

  /**
   * 도서관 즐겨찾기 제거
   *
   * @param libCode - 도서관 코드
   * @returns 성공 여부
   */
  async removeFavoriteLibrary(libCode: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/libraries/favorites/${libCode}`);

      return response.data.success;
    } catch (error) {
      console.error('즐겨찾기 제거 실패:', error);
      return false;
    }
  }

  /**
   * API 응답 데이터를 Library 타입으로 변환
   * 도서관 정보나루 API의 응답 형식을 우리 타입으로 파싱합니다.
   *
   * @param rawLibraries - API 원본 응답 데이터
   * @returns 파싱된 도서관 목록
   * @private
   */
  private parseLibraries(rawLibraries: any[]): Library[] {
    return rawLibraries.map((lib: any) => ({
      libCode: lib.lib?.libCode || '',
      libName: lib.lib?.libName || '',
      address: lib.lib?.address || undefined,
      tel: lib.lib?.tel || undefined,
      homepage: lib.lib?.homepage || undefined,
      operatingInstitution: lib.lib?.operatingInstitution || undefined,
      latitude: lib.lib?.latitude ? parseFloat(lib.lib.latitude) : undefined,
      longitude: lib.lib?.longitude ? parseFloat(lib.lib.longitude) : undefined,
    }));
  }
}

// 싱글톤 인스턴스 생성 및 export
// 애플리케이션 전체에서 하나의 인스턴스만 사용
export const libraryService = new LibraryService();
