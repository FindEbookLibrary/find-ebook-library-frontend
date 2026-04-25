/**
 * 인증 서비스
 * 회원가입, 로그인, 사용자 정보 조회 등 인증 관련 API를 처리합니다.
 */

import { apiClient, ApiResponse } from './api.config';
import type {
  User,
  RegisterRequest,
  LoginRequest,
  LoginResponse
} from '@/types/api.types';

/**
 * 인증 서비스 클래스
 */
class AuthService {
  /**
   * 회원가입
   * @param data - 회원가입 정보 (email, password, username)
   * @returns 생성된 사용자 정보
   */
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  }

  /**
   * 로그인
   * @param data - 로그인 정보 (email, password)
   * @returns 토큰 및 사용자 정보
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);

    // 로그인 성공 시 토큰을 로컬 스토리지에 저장
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      this.setTokens(accessToken, refreshToken);
    }

    return response.data;
  }

  /**
   * 로그아웃
   * 로컬 스토리지에서 토큰을 제거합니다.
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   * @returns 사용자 정보
   */
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    const response = await apiClient.get<ApiResponse<User | null>>('/auth/me');
    return response.data;
  }

  /**
   * 토큰 저장
   * @param accessToken - 액세스 토큰
   * @param refreshToken - 리프레시 토큰
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * 토큰 제거
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * 액세스 토큰 조회
   * @returns 액세스 토큰 또는 null
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * 리프레시 토큰 조회
   * @returns 리프레시 토큰 또는 null
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * 로그인 여부 확인
   * @returns 로그인 여부
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// 싱글톤 인스턴스 생성 및 export
export const authService = new AuthService();
export default authService;
