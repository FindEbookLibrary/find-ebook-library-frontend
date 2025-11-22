/**
 * 전자도서관 관련 타입 정의
 * 도서관 정보, 검색 결과 등을 정의합니다.
 */

/**
 * 전자도서관 정보를 나타내는 인터페이스
 */
export interface Library {
  /** 도서관 고유 코드 */
  libCode: string;

  /** 도서관 이름 */
  libName: string;

  /** 도서관 주소 */
  address?: string;

  /** 도서관 전화번호 */
  tel?: string;

  /** 도서관 홈페이지 URL */
  homepage?: string;

  /** 도서관 운영 기관 (대학교, 공공도서관, 기업 등) */
  operatingInstitution?: string;

  /** 도서관 타입 (대학도서관, 공공도서관, 전문도서관 등) */
  type?: LibraryType;

  /** 위도 */
  latitude?: number;

  /** 경도 */
  longitude?: number;
}

/**
 * 도서관 타입 열거형
 */
export enum LibraryType {
  UNIVERSITY = 'UNIVERSITY',        // 대학도서관
  PUBLIC = 'PUBLIC',                // 공공도서관
  CORPORATE = 'CORPORATE',          // 기업도서관
  SPECIALIZED = 'SPECIALIZED',      // 전문도서관
}

/**
 * 도서관 검색 요청 파라미터
 */
export interface LibrarySearchParams {
  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;

  /** 페이지당 결과 수 (기본값: 10) */
  pageSize?: number;

  /** 검색 키워드 */
  keyword?: string;

  /** 지역 필터 */
  region?: string;

  /** 도서관 타입 필터 */
  type?: LibraryType;
}

/**
 * 도서관 API 응답 인터페이스
 */
export interface LibraryApiResponse {
  /** 요청 결과 (정상: RESULT, 오류: ERROR) */
  result: 'RESULT' | 'ERROR';

  /** 전체 결과 수 */
  totalResults?: number;

  /** 현재 페이지 번호 */
  pageNo?: number;

  /** 페이지당 결과 수 */
  pageSize?: number;

  /** 도서관 목록 */
  libraries?: Library[];

  /** 오류 메시지 (오류 발생 시) */
  errorMessage?: string;
}
