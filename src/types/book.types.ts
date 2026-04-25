/**
 * 전자책 관련 타입 정의
 * 책 정보, 검색 결과, 대출 정보 등을 정의합니다.
 */

/**
 * 전자책 정보를 나타내는 인터페이스
 */
export type AvailStatus = 'available' | 'reserve' | 'held' | 'none';

/**
 * 도서관별 가용 상태를 단순화한 엔트리입니다.
 * UI에서는 이 배열을 기반으로 "내 도서관 우선" 표시를 계산합니다.
 */
export interface BookAvailEntry {
  libCode: string;
  status: AvailStatus;
}

/**
 * 한 권의 책에 대해 화면에서 반복적으로 쓰는 집계 결과입니다.
 * 화면마다 같은 계산을 중복하지 않도록 유틸 함수의 반환 타입으로 사용합니다.
 */
export interface BookStats {
  entries: BookAvailEntry[];
  owned: BookAvailEntry[];
  mine: BookAvailEntry[];
  primary:
    | 'mineAvailable'
    | 'mineReserve'
    | 'mineHeld'
    | 'otherAvailable'
    | 'otherHeld'
    | 'none';
}

export interface EBook {
  /** 프로토타입 mock 데이터에서 사용하는 내부 식별자 */
  id?: string;

  /** 책 고유 ISBN (International Standard Book Number) */
  isbn: string;

  /** 책 제목 */
  title: string;

  /** 저자 */
  author: string;

  /** 출판사 */
  publisher: string;

  /** 출판 연도 */
  publicationYear?: string;

  /** 책 표지 이미지 URL */
  coverImage?: string;

  /** 책 설명 */
  description?: string;

  /** 카테고리/분류 */
  category?: string;

  /** 목차 일부 */
  toc?: string[];

  /** 이 책을 보유한 도서관 목록 */
  availableLibraries?: LibraryBookInfo[];
}

/**
 * 도서관별 책 보유 정보
 */
export interface LibraryBookInfo {
  /** 도서관 코드 */
  libCode: string;

  /** 도서관 이름 */
  libName: string;

  /** 대출 가능 여부 */
  isAvailable: boolean;

  /** 대출 상태를 UI 친화적인 값으로 보관합니다. */
  status?: AvailStatus;

  /** 책 상세 페이지 URL (도서관 웹사이트) */
  detailUrl?: string;

  /** 대출 가능 권수 */
  availableCopies?: number;

  /** 전체 보유 권수 */
  totalCopies?: number;

  /** 예약/대기 인원 */
  waitingCount?: number;
}

/**
 * 전자책 검색 요청 파라미터
 */
export interface BookSearchParams {
  /** 검색 키워드 (제목, 저자, 출판사 등) */
  keyword: string;

  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;

  /** 페이지당 결과 수 (기본값: 10) */
  pageSize?: number;

  /** 검색 대상 도서관 코드 목록 (사용자가 접근 가능한 도서관만) */
  libraryCodes?: string[];

  /** 검색 타입 (제목, 저자, 출판사 등) */
  searchType?: SearchType;

  /** 카테고리 필터 */
  category?: string;

  /** 출판 연도 범위 시작 */
  publicationYearFrom?: number;

  /** 출판 연도 범위 끝 */
  publicationYearTo?: number;
}

/**
 * 검색 타입 열거형
 */
export enum SearchType {
  ALL = 'ALL',              // 전체 검색
  TITLE = 'TITLE',          // 제목 검색
  AUTHOR = 'AUTHOR',        // 저자 검색
  PUBLISHER = 'PUBLISHER',  // 출판사 검색
  ISBN = 'ISBN',            // ISBN 검색
}

/**
 * 전자책 검색 API 응답 인터페이스
 */
export interface BookSearchApiResponse {
  /** 요청 결과 (정상: RESULT, 오류: ERROR) */
  result: 'RESULT' | 'ERROR';

  /** 전체 결과 수 */
  totalResults?: number;

  /** 현재 페이지 번호 */
  pageNo?: number;

  /** 페이지당 결과 수 */
  pageSize?: number;

  /** 전자책 목록 */
  books?: EBook[];

  /** 오류 메시지 (오류 발생 시) */
  errorMessage?: string;
}
