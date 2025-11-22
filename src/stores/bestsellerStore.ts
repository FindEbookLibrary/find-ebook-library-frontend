/**
 * 베스트셀러 상태 관리 Store
 * 베스트셀러 조회 및 도서관 매칭 상태를 관리합니다.
 */

import { create } from 'zustand';
import { BestsellerBook, BookStore } from '@types/bestseller.types';

/**
 * 베스트셀러 Store의 상태 인터페이스
 */
interface BestsellerState {
  /** 현재 선택된 서점 */
  selectedBookStore: BookStore;

  /** 선택된 카테고리 */
  selectedCategory: string | null;

  /** 베스트셀러 목록 */
  bestsellers: BestsellerBook[];

  /** 조회 시간 (캐시 만료 확인용) */
  timestamp: string | null;

  /** 로딩 상태 */
  isLoading: boolean;

  /** 에러 메시지 */
  error: string | null;

  /** 선택된 도서관 코드 목록 (매칭에 사용) */
  selectedLibraryCodes: string[];

  /* ===== Actions ===== */

  /**
   * 서점 선택
   *
   * @param bookStore - 서점
   */
  setBookStore: (bookStore: BookStore) => void;

  /**
   * 카테고리 선택
   *
   * @param category - 카테고리 (null이면 전체)
   */
  setCategory: (category: string | null) => void;

  /**
   * 베스트셀러 목록 설정
   *
   * @param bestsellers - 베스트셀러 목록
   * @param timestamp - 조회 시간
   */
  setBestsellers: (bestsellers: BestsellerBook[], timestamp: string) => void;

  /**
   * 선택된 도서관 설정
   *
   * @param libraryCodes - 도서관 코드 목록
   */
  setSelectedLibraries: (libraryCodes: string[]) => void;

  /**
   * 로딩 상태 설정
   *
   * @param isLoading - 로딩 여부
   */
  setLoading: (isLoading: boolean) => void;

  /**
   * 에러 설정
   *
   * @param error - 에러 메시지
   */
  setError: (error: string | null) => void;

  /**
   * 베스트셀러 초기화
   */
  reset: () => void;
}

/**
 * 베스트셀러 Store 생성
 */
export const useBestsellerStore = create<BestsellerState>((set) => ({
  // 초기 상태
  selectedBookStore: BookStore.YES24, // 기본 서점은 YES24
  selectedCategory: null,
  bestsellers: [],
  timestamp: null,
  isLoading: false,
  error: null,
  selectedLibraryCodes: [],

  // Actions 구현
  setBookStore: (bookStore) => {
    set({
      selectedBookStore: bookStore,
      bestsellers: [], // 서점 변경 시 베스트셀러 목록 초기화
      timestamp: null,
    });
  },

  setCategory: (category) => {
    set({
      selectedCategory: category,
      bestsellers: [], // 카테고리 변경 시 베스트셀러 목록 초기화
      timestamp: null,
    });
  },

  setBestsellers: (bestsellers, timestamp) => {
    set({
      bestsellers,
      timestamp,
      error: null,
      isLoading: false,
    });
  },

  setSelectedLibraries: (libraryCodes) => {
    set({ selectedLibraryCodes: libraryCodes });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  reset: () => {
    set({
      bestsellers: [],
      timestamp: null,
      isLoading: false,
      error: null,
    });
  },
}));
