/**
 * 사용자 상태 관리 Store
 * Zustand를 사용하여 사용자 정보, 인증 상태 등을 전역으로 관리합니다.
 */

import { create } from 'zustand';
import { User, AuthTokens } from '@types/user.types';
import { Library } from '@types/library.types';

/**
 * 사용자 Store의 상태 인터페이스
 */
interface UserState {
  /** 현재 로그인한 사용자 정보 (로그인 안 했으면 null) */
  user: User | null;

  /** 인증 토큰 정보 */
  tokens: AuthTokens | null;

  /** 사용자가 접근 가능한 도서관 목록 */
  accessibleLibraries: Library[];

  /** 로딩 상태 */
  isLoading: boolean;

  /** 에러 메시지 */
  error: string | null;

  /* ===== Actions (상태를 변경하는 함수들) ===== */

  /**
   * 사용자 정보 설정
   * 로그인 성공 후 사용자 정보를 저장합니다.
   *
   * @param user - 사용자 정보
   * @param tokens - 인증 토큰
   */
  setUser: (user: User, tokens: AuthTokens) => void;

  /**
   * 사용자 정보 업데이트
   * 부분적으로 사용자 정보를 업데이트합니다.
   *
   * @param updates - 업데이트할 사용자 정보
   */
  updateUser: (updates: Partial<User>) => void;

  /**
   * 접근 가능한 도서관 목록 설정
   *
   * @param libraries - 도서관 목록
   */
  setAccessibleLibraries: (libraries: Library[]) => void;

  /**
   * 로그아웃
   * 사용자 정보와 토큰을 모두 제거합니다.
   */
  logout: () => void;

  /**
   * 로딩 상태 설정
   *
   * @param isLoading - 로딩 여부
   */
  setLoading: (isLoading: boolean) => void;

  /**
   * 에러 메시지 설정
   *
   * @param error - 에러 메시지
   */
  setError: (error: string | null) => void;

  /**
   * 토큰 갱신
   *
   * @param tokens - 새 토큰 정보
   */
  refreshTokens: (tokens: AuthTokens) => void;
}

/**
 * 로컬 스토리지에서 저장된 토큰 불러오기
 * 페이지 새로고침 시에도 로그인 상태 유지를 위해 사용
 */
const loadTokensFromStorage = (): AuthTokens | null => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresAt = localStorage.getItem('expiresAt');

    if (accessToken && refreshToken && expiresAt) {
      return {
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAt, 10),
      };
    }

    return null;
  } catch (error) {
    console.error('토큰 로드 실패:', error);
    return null;
  }
};

/**
 * 로컬 스토리지에 토큰 저장
 *
 * @param tokens - 저장할 토큰 정보
 */
const saveTokensToStorage = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('expiresAt', tokens.expiresAt.toString());
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

/**
 * 로컬 스토리지에서 토큰 제거
 */
const removeTokensFromStorage = (): void => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
  } catch (error) {
    console.error('토큰 제거 실패:', error);
  }
};

/**
 * 사용자 Store 생성
 * create 함수는 Zustand의 store를 생성하는 함수입니다.
 * set 함수로 상태를 변경하고, get 함수로 현재 상태를 가져올 수 있습니다.
 */
export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태
  user: null,
  tokens: loadTokensFromStorage(), // 로컬 스토리지에서 토큰 불러오기
  accessibleLibraries: [],
  isLoading: false,
  error: null,

  // Actions 구현
  setUser: (user, tokens) => {
    saveTokensToStorage(tokens); // 토큰을 로컬 스토리지에 저장

    set({
      user,
      tokens,
      error: null,
    });
  },

  updateUser: (updates) => {
    const currentUser = get().user;

    if (currentUser) {
      set({
        user: { ...currentUser, ...updates },
      });
    }
  },

  setAccessibleLibraries: (libraries) => {
    set({ accessibleLibraries: libraries });
  },

  logout: () => {
    removeTokensFromStorage(); // 로컬 스토리지에서 토큰 제거

    set({
      user: null,
      tokens: null,
      accessibleLibraries: [],
      error: null,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  refreshTokens: (tokens) => {
    saveTokensToStorage(tokens); // 새 토큰 저장

    set({ tokens });
  },
}));
