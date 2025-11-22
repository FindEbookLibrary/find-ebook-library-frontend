/**
 * 북마크 관련 타입 정의
 * 사용자가 저장한 책과 서재 정보를 정의합니다.
 */

import { EBook } from './book.types';

/**
 * 북마크 정보 인터페이스
 * 사용자가 저장한 책의 메타데이터를 포함합니다.
 */
export interface Bookmark {
  /** 책 ISBN (고유 식별자) */
  isbn: string;

  /** 책 제목 */
  title: string;

  /** 저자 */
  author: string;

  /** 출판사 */
  publisher: string;

  /** 책 표지 이미지 URL */
  coverImage?: string;

  /** 북마크 추가 일시 (ISO 8601 형식) */
  addedAt: string;

  /** 사용자 메모 */
  memo?: string;

  /** 읽음 상태 */
  readStatus: ReadStatus;

  /** 사용자 평점 (1-5) */
  rating?: number;

  /** 태그 목록 */
  tags?: string[];
}

/**
 * 읽음 상태 열거형
 */
export enum ReadStatus {
  /** 읽고 싶음 */
  WANT_TO_READ = 'WANT_TO_READ',

  /** 읽는 중 */
  READING = 'READING',

  /** 읽음 */
  COMPLETED = 'COMPLETED',
}

/**
 * 서재 폴더 인터페이스
 * 사용자가 만든 책 분류 폴더
 */
export interface BookshelfFolder {
  /** 폴더 고유 ID */
  id: string;

  /** 폴더 이름 */
  name: string;

  /** 폴더 설명 */
  description?: string;

  /** 폴더에 속한 책의 ISBN 목록 */
  bookIsbns: string[];

  /** 폴더 생성 일시 */
  createdAt: string;

  /** 폴더 색상 (UI 표시용) */
  color?: string;
}

/**
 * 북마크 필터 옵션
 */
export interface BookmarkFilters {
  /** 읽음 상태 필터 */
  readStatus?: ReadStatus;

  /** 태그 필터 */
  tags?: string[];

  /** 폴더 ID 필터 */
  folderId?: string;

  /** 검색 키워드 */
  keyword?: string;

  /** 정렬 기준 */
  sortBy?: BookmarkSortBy;
}

/**
 * 북마크 정렬 기준 열거형
 */
export enum BookmarkSortBy {
  /** 최근 추가순 */
  RECENTLY_ADDED = 'RECENTLY_ADDED',

  /** 오래된순 */
  OLDEST_FIRST = 'OLDEST_FIRST',

  /** 제목순 (가나다순) */
  TITLE_ASC = 'TITLE_ASC',

  /** 저자순 */
  AUTHOR_ASC = 'AUTHOR_ASC',

  /** 평점 높은순 */
  RATING_DESC = 'RATING_DESC',
}
