/**
 * 베스트셀러 관련 타입 정의
 * 서점별 베스트셀러 정보와 전자도서관 매칭 정보를 정의합니다.
 */

/**
 * 베스트셀러 제공 서점 열거형
 */
export enum BookStore {
  YES24 = 'YES24',              // YES24 서점
  KYOBO = 'KYOBO',              // 교보문고
  ALADIN = 'ALADIN',            // 알라딘
}

/**
 * 베스트셀러 책 정보
 */
export interface BestsellerBook {
  /** 순위 */
  rank: number;

  /** 책 ISBN */
  isbn: string;

  /** 책 제목 */
  title: string;

  /** 저자 */
  author: string;

  /** 출판사 */
  publisher: string;

  /** 책 표지 이미지 URL */
  coverImage?: string;

  /** 서점 상세 페이지 URL */
  bookStoreUrl?: string;

  /** 가격 */
  price?: number;

  /** 순위 변동 (양수: 상승, 음수: 하락, 0: 변동없음) */
  rankChange?: number;

  /** 이 책을 보유한 전자도서관 정보 */
  libraryAvailability?: BestsellerLibraryMatch[];
}

/**
 * 베스트셀러와 전자도서관 매칭 정보
 */
export interface BestsellerLibraryMatch {
  /** 도서관 코드 */
  libCode: string;

  /** 도서관 이름 */
  libName: string;

  /** 전자책 보유 여부 */
  hasEBook: boolean;

  /** 종이책 보유 여부 */
  hasPrintedBook?: boolean;

  /** 대출 가능 여부 */
  isAvailable: boolean;

  /** 도서관 상세 페이지 URL */
  detailUrl?: string;

  /** 예약 대기 인원 (대출 불가 시) */
  reservationCount?: number;
}

/**
 * 베스트셀러 조회 요청 파라미터
 */
export interface BestsellerParams {
  /** 서점 선택 */
  bookStore: BookStore;

  /** 카테고리 (예: 소설, 에세이, 경제/경영 등) */
  category?: string;

  /** 조회할 순위 개수 (기본값: 20) */
  count?: number;

  /** 사용자가 접근 가능한 도서관 코드 목록 (매칭에 사용) */
  libraryCodes?: string[];
}

/**
 * 베스트셀러 API 응답 인터페이스
 */
export interface BestsellerApiResponse {
  /** 요청 결과 (정상: RESULT, 오류: ERROR) */
  result: 'RESULT' | 'ERROR';

  /** 서점 정보 */
  bookStore: BookStore;

  /** 조회 일시 (ISO 8601 형식) */
  timestamp: string;

  /** 베스트셀러 목록 */
  bestsellers?: BestsellerBook[];

  /** 오류 메시지 (오류 발생 시) */
  errorMessage?: string;
}

/**
 * 베스트셀러 카테고리 정보
 */
export interface BestsellerCategory {
  /** 카테고리 코드 */
  code: string;

  /** 카테고리 이름 */
  name: string;

  /** 부모 카테고리 코드 (최상위 카테고리는 null) */
  parentCode?: string;
}
