/**
 * 인증 관련 커스텀 훅
 * 로그인, 로그아웃, 회원가입 등 사용자 인증 로직을 처리합니다.
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@stores/userStore';
import { authService } from '@lib/services/auth.service';
import { libraryService } from '@lib/services/library.service';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';
import type { Library } from '@/types/library.types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    if (message) {
      return message;
    }
  }

  return fallback;
};

/**
 * 인증 훅
 *
 * @returns 인증 상태와 인증 관련 함수들
 *
 * @example
 * function LoginComponent() {
 *   const { login, isLoading, error } = useAuth();
 *
 *   const handleLogin = async () => {
 *     await login({
 *       email: 'user@example.com',
 *       password: 'password123'
 *     });
 *   };
 *
 *   return <button onClick={handleLogin}>로그인</button>;
 * }
 */
export const useAuth = () => {
  const router = useRouter();

  // Zustand store에서 상태와 액션 가져오기
  const {
    user,
    tokens,
    accessibleLibraries,
    isLoading,
    error,
    setUser,
    updateUser,
    setAccessibleLibraries,
    logout: logoutAction,
    setLoading,
    setError,
  } = useUserStore();

  /**
   * 로그인 함수
   *
   * @param params - 로그인 파라미터 (이메일, 비밀번호)
   * @returns 성공 여부
   */
  const login = async (params: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 로그인 API 호출
      const response = await authService.login(params);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // 사용자 정보와 토큰 저장 (Zustand store에 맞게 변환)
        setUser(
          {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
            affiliations: [],
            accessibleLibraryCodes: [],
          },
          {
            accessToken,
            refreshToken,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24시간 후
          }
        );

        // 접근 가능한 도서관 목록 로드
        await loadAccessibleLibraries();

        // 홈 페이지로 이동
        router.push('/');

        return true;
      } else {
        setError(response.message || '로그인 실패');
        return false;
      }
    } catch (err: unknown) {
      console.error('로그인 오류:', err);
      setError(getErrorMessage(err, '로그인 중 오류가 발생했습니다.'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 회원가입 함수
   *
   * @param params - 회원가입 파라미터
   * @returns 성공 여부
   */
  const signup = async (params: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 회원가입 API 호출
      const response = await authService.register(params);

      if (response.success && response.data) {
        // 회원가입 성공 후 자동 로그인
        return await login({
          email: params.email,
          password: params.password,
        });
      } else {
        setError(response.message || '회원가입 실패');
        return false;
      }
    } catch (err: unknown) {
      console.error('회원가입 오류:', err);
      setError(getErrorMessage(err, '회원가입 중 오류가 발생했습니다.'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = useCallback(() => {
    // 로컬 상태 초기화
    authService.logout();
    logoutAction();

    // 로그인 페이지로 이동
    router.push('/login');
  }, [logoutAction, router]);

  /**
   * 접근 가능한 도서관 목록 로드
   */
  const loadAccessibleLibraries = async () => {
    try {
      const response = await libraryService.getLibraries();

      if (response.success && response.data) {
        const libraries: Library[] = response.data;
        setAccessibleLibraries(libraries);
      }
    } catch (err) {
      console.error('도서관 목록 로드 실패:', err);
    }
  };

  /**
   * 사용자 정보 갱신
   */
  const refreshUserInfo = async () => {
    if (!user) return;

    try {
      const response = await authService.getCurrentUser();

      if (response.success && response.data) {
        updateUser({
          id: response.data.id.toString(),
          name: response.data.username,
          email: response.data.email,
          affiliations: user.affiliations,
          accessibleLibraryCodes: user.accessibleLibraryCodes,
        });
      }
    } catch (err) {
      console.error('사용자 정보 갱신 실패:', err);
    }
  };

  /**
   * 로그인 여부 확인
   */
  const isAuthenticated = !!user && !!tokens;

  /**
   * 컴포넌트 마운트 시 토큰 유효성 확인
   */
  useEffect(() => {
    const tokenExpired = tokens ? tokens.expiresAt < Date.now() : true;

    if (isAuthenticated && tokenExpired) {
      // 토큰이 만료되었으면 로그아웃
      logout();
    }
  }, [isAuthenticated, logout, tokens]);

  return {
    // 상태
    user,
    tokens,
    accessibleLibraries,
    isLoading,
    error,
    isAuthenticated,

    // 액션
    login,
    signup,
    logout,
    loadAccessibleLibraries,
    refreshUserInfo,
  };
};
