/**
 * 검색 상태 관리 Store
 * 전자책 검색과 관련된 상태를 관리합니다.
 */

import { create } from 'zustand';
import { EBook, SearchType } from '@/types/book.types';

/**
 * 검색 Store의 상태 인터페이스
 */
interface SearchState {
  /** 검색 키워드 */
  keyword: string;

  /** 검색 결과 목록 */
  results: EBook[];

  /** 검색 타입 (전체, 제목, 저자 등) */
  searchType: SearchType;

  /** 현재 페이지 번호 */
  currentPage: number;

  /** 페이지당 결과 수 */
  pageSize: number;

  /** 전체 결과 수 */
  totalResults: number;

  /** 선택된 도서관 코드 목록 */
  selectedLibraryCodes: string[];

  /** 로딩 상태 */
  isLoading: boolean;

  /** 에러 메시지 */
  error: string | null;

  /** 최근 검색어 목록 */
  recentKeywords: string[];

  /* ===== Actions ===== */

  /**
   * 검색 키워드 설정
   *
   * @param keyword - 검색 키워드
   */
  setKeyword: (keyword: string) => void;

  /**
   * 검색 결과 설정
   *
   * @param results - 검색 결과
   * @param totalResults - 전체 결과 수
   */
  setResults: (results: EBook[], totalResults: number) => void;

  /**
   * 검색 타입 변경
   *
   * @param searchType - 검색 타입
   */
  setSearchType: (searchType: SearchType) => void;

  /**
   * 페이지 변경
   *
   * @param page - 페이지 번호
   */
  setCurrentPage: (page: number) => void;

  /**
   * 페이지 크기 변경
   *
   * @param pageSize - 페이지당 결과 수
   */
  setPageSize: (pageSize: number) => void;

  /**
   * 선택된 도서관 설정
   *
   * @param libraryCodes - 도서관 코드 목록
   */
  setSelectedLibraries: (libraryCodes: string[]) => void;

  /**
   * 도서관 추가
   *
   * @param libraryCode - 추가할 도서관 코드
   */
  addSelectedLibrary: (libraryCode: string) => void;

  /**
   * 도서관 제거
   *
   * @param libraryCode - 제거할 도서관 코드
   */
  removeSelectedLibrary: (libraryCode: string) => void;

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
   * 최근 검색어 추가
   *
   * @param keyword - 검색어
   */
  addRecentKeyword: (keyword: string) => void;

  /**
   * 검색 상태 초기화
   */
  reset: () => void;
}

const canUseStorage = (): boolean => typeof window !== 'undefined';

/**
 * 로컬 스토리지에서 최근 검색어 불러오기
 */
const loadRecentKeywords = (): string[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const saved = localStorage.getItem('recentKeywords');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('최근 검색어 로드 실패:', error);
    return [];
  }
};

/**
 * 로컬 스토리지에 최근 검색어 저장
 *
 * @param keywords - 검색어 목록
 */
const saveRecentKeywords = (keywords: string[]): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.setItem('recentKeywords', JSON.stringify(keywords));
  } catch (error) {
    console.error('최근 검색어 저장 실패:', error);
  }
};

/**
 * 검색 Store 생성
 */
export const useSearchStore = create<SearchState>((set, get) => ({
  // 초기 상태
  keyword: '',
  results: [],
  searchType: SearchType.ALL,
  currentPage: 1,
  pageSize: 20,
  totalResults: 0,
  selectedLibraryCodes: [],
  isLoading: false,
  error: null,
  recentKeywords: loadRecentKeywords(),

  // Actions 구현
  setKeyword: (keyword) => {
    set({ keyword });
  },

  setResults: (results, totalResults) => {
    set({ results, totalResults, error: null });
  },

  setSearchType: (searchType) => {
    set({ searchType, currentPage: 1 }); // 검색 타입 변경 시 페이지 초기화
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setPageSize: (pageSize) => {
    set({ pageSize, currentPage: 1 }); // 페이지 크기 변경 시 페이지 초기화
  },

  setSelectedLibraries: (libraryCodes) => {
    set({ selectedLibraryCodes: libraryCodes });
  },

  addSelectedLibrary: (libraryCode) => {
    const { selectedLibraryCodes } = get();

    // 이미 추가된 도서관이 아니면 추가
    if (!selectedLibraryCodes.includes(libraryCode)) {
      set({
        selectedLibraryCodes: [...selectedLibraryCodes, libraryCode],
      });
    }
  },

  removeSelectedLibrary: (libraryCode) => {
    const { selectedLibraryCodes } = get();

    set({
      selectedLibraryCodes: selectedLibraryCodes.filter(
        (code) => code !== libraryCode
      ),
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  addRecentKeyword: (keyword) => {
    const { recentKeywords } = get();

    // 빈 키워드는 추가하지 않음
    if (!keyword.trim()) return;

    // 이미 있는 키워드면 제거 (최신순으로 다시 추가하기 위해)
    const filtered = recentKeywords.filter((k) => k !== keyword);

    // 최신 키워드를 맨 앞에 추가 (최대 10개까지만 유지)
    const updated = [keyword, ...filtered].slice(0, 10);

    saveRecentKeywords(updated);
    set({ recentKeywords: updated });
  },

  reset: () => {
    set({
      keyword: '',
      results: [],
      searchType: SearchType.ALL,
      currentPage: 1,
      totalResults: 0,
      isLoading: false,
      error: null,
    });
  },
}));
