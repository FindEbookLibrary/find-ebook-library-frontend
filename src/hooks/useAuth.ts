/**
 * 인증 관련 커스텀 훅
 * 로그인, 로그아웃, 회원가입 등 사용자 인증 로직을 처리합니다.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@stores/userStore';
import { apiClient } from '@lib/services/api.config';
import { libraryService } from '@lib/services/library.service';
import { LoginParams, SignupParams } from '@types/user.types';

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
  const login = async (params: LoginParams): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 로그인 API 호출
      const response = await apiClient.post('/auth/login', params);

      if (response.data.success) {
        const { user, tokens } = response.data.data;

        // 사용자 정보와 토큰 저장
        setUser(user, tokens);

        // 접근 가능한 도서관 목록 로드
        await loadAccessibleLibraries();

        // 홈 페이지로 이동
        router.push('/');

        return true;
      } else {
        setError(response.data.message || '로그인 실패');
        return false;
      }
    } catch (err: any) {
      console.error('로그인 오류:', err);
      setError(
        err.response?.data?.message || '로그인 중 오류가 발생했습니다.'
      );
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
  const signup = async (params: SignupParams): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 회원가입 API 호출
      const response = await apiClient.post('/auth/signup', params);

      if (response.data.success) {
        const { user, tokens } = response.data.data;

        // 사용자 정보와 토큰 저장
        setUser(user, tokens);

        // 접근 가능한 도서관 목록 로드
        await loadAccessibleLibraries();

        // 홈 페이지로 이동
        router.push('/');

        return true;
      } else {
        setError(response.data.message || '회원가입 실패');
        return false;
      }
    } catch (err: any) {
      console.error('회원가입 오류:', err);
      setError(
        err.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    // 백엔드에 로그아웃 요청 (실패해도 무시)
    apiClient.post('/auth/logout').catch(() => {
      // 로그아웃 실패는 무시
    });

    // 로컬 상태 초기화
    logoutAction();

    // 로그인 페이지로 이동
    router.push('/login');
  };

  /**
   * 접근 가능한 도서관 목록 로드
   */
  const loadAccessibleLibraries = async () => {
    try {
      const libraries = await libraryService.getAccessibleLibraries();
      setAccessibleLibraries(libraries);
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
      const response = await apiClient.get('/auth/me');

      if (response.data.success) {
        updateUser(response.data.data);
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
   * 토큰 만료 확인
   */
  const isTokenExpired = () => {
    if (!tokens) return true;

    // 만료 시간이 현재 시간보다 이전이면 만료
    return tokens.expiresAt < Date.now();
  };

  /**
   * 컴포넌트 마운트 시 토큰 유효성 확인
   */
  useEffect(() => {
    if (isAuthenticated && isTokenExpired()) {
      // 토큰이 만료되었으면 로그아웃
      logout();
    }
  }, []);

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
