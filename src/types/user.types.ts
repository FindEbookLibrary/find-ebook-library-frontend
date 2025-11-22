/**
 * 사용자 관련 타입 정의
 * 사용자 정보, 소속, 접근 가능한 도서관 정보 등을 정의합니다.
 */

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  /** 사용자 고유 ID */
  id: string;

  /** 사용자 이름 */
  name: string;

  /** 이메일 */
  email: string;

  /** 사용자 소속 정보 목록 (여러 소속 가능: 대학생이면서 회사원 등) */
  affiliations: UserAffiliation[];

  /** 사용자가 접근 가능한 도서관 코드 목록 */
  accessibleLibraryCodes: string[];

  /** 선호하는 도서관 코드 목록 (즐겨찾기) */
  favoriteLibraryCodes?: string[];

  /** 프로필 이미지 URL */
  profileImage?: string;
}

/**
 * 사용자 소속 정보
 */
export interface UserAffiliation {
  /** 소속 타입 */
  type: AffiliationType;

  /** 소속 기관 이름 (예: "서울대학교", "삼성전자", "서울특별시") */
  institutionName: string;

  /** 소속 기관 코드 */
  institutionCode?: string;

  /** 인증 여부 */
  verified: boolean;

  /** 인증 일시 */
  verifiedAt?: string;

  /** 이 소속으로 접근 가능한 도서관 코드 목록 */
  accessibleLibraryCodes: string[];
}

/**
 * 소속 타입 열거형
 */
export enum AffiliationType {
  UNIVERSITY = 'UNIVERSITY',      // 대학교 (재학생, 교직원)
  COMPANY = 'COMPANY',            // 회사 (직원)
  CITY = 'CITY',                  // 시/군 (거주민)
  DISTRICT = 'DISTRICT',          // 구 (거주민)
  ORGANIZATION = 'ORGANIZATION',  // 기타 조직/단체
}

/**
 * 사용자 설정 정보
 */
export interface UserPreferences {
  /** 검색 시 기본으로 사용할 도서관 코드 목록 */
  defaultLibraryCodes?: string[];

  /** 검색 결과 페이지당 표시 개수 */
  resultsPerPage: number;

  /** 다크 모드 사용 여부 */
  darkMode: boolean;

  /** 베스트셀러 기본 서점 */
  defaultBookStore?: string;

  /** 알림 수신 동의 여부 */
  notificationEnabled: boolean;
}

/**
 * 사용자 인증 요청 파라미터
 */
export interface LoginParams {
  /** 이메일 */
  email: string;

  /** 비밀번호 */
  password: string;
}

/**
 * 사용자 회원가입 요청 파라미터
 */
export interface SignupParams {
  /** 이메일 */
  email: string;

  /** 비밀번호 */
  password: string;

  /** 이름 */
  name: string;

  /** 초기 소속 정보 (선택사항) */
  affiliations?: Omit<UserAffiliation, 'verified' | 'verifiedAt' | 'accessibleLibraryCodes'>[];
}

/**
 * 인증 토큰 정보
 */
export interface AuthTokens {
  /** 액세스 토큰 (API 요청에 사용) */
  accessToken: string;

  /** 리프레시 토큰 (액세스 토큰 갱신에 사용) */
  refreshToken: string;

  /** 토큰 만료 시간 (Unix timestamp) */
  expiresAt: number;
}
