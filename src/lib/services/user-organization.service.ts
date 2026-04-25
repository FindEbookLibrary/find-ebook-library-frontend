/**
 * 사용자-조직 연결 API 서비스
 * Fine EBook Library 백엔드와 통신하여 사용자의 조직 연결을 관리합니다.
 */

import { apiClient, ApiResponse } from './api.config';
import type { UserOrganization, UserOrganizationRequest } from '@/types/api.types';

/**
 * 사용자-조직 서비스 클래스
 */
class UserOrganizationService {
  /**
   * 내 조직 목록 조회
   * 로그인한 사용자가 소속된 조직 목록을 조회합니다.
   * @returns 사용자-조직 연결 목록
   */
  async getMyOrganizations(): Promise<ApiResponse<UserOrganization[]>> {
    const response = await apiClient.get<ApiResponse<UserOrganization[]>>('/user-organizations');
    return response.data;
  }

  /**
   * 조직 연결 요청
   * 사용자가 조직에 연결을 요청합니다.
   * @param data - 조직 연결 요청 정보
   * @returns 생성된 사용자-조직 연결 정보
   */
  async requestOrganizationConnection(data: UserOrganizationRequest): Promise<ApiResponse<UserOrganization>> {
    const response = await apiClient.post<ApiResponse<UserOrganization>>('/user-organizations', data);
    return response.data;
  }

  /**
   * 조직 연결 인증 (관리자 전용)
   * 사용자의 조직 연결을 승인합니다.
   * @param id - 사용자-조직 연결 ID
   * @param verificationInfo - 추가 인증 정보 (선택)
   * @returns 인증된 사용자-조직 연결 정보
   */
  async verifyOrganizationConnection(
    id: number,
    verificationInfo?: string
  ): Promise<ApiResponse<UserOrganization>> {
    const params = verificationInfo ? { verificationInfo } : {};
    const response = await apiClient.patch<ApiResponse<UserOrganization>>(
      `/user-organizations/${id}/verify`,
      null,
      { params }
    );
    return response.data;
  }

  /**
   * 조직 연결 삭제
   * 사용자의 조직 연결을 삭제합니다.
   * @param id - 사용자-조직 연결 ID
   * @returns 성공 여부
   */
  async deleteOrganizationConnection(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/user-organizations/${id}`);
    return response.data;
  }
}

// 싱글톤 인스턴스 생성 및 export
export const userOrganizationService = new UserOrganizationService();
export default userOrganizationService;
