/**
 * 조직 관련 API 서비스
 * Fine EBook Library 백엔드와 통신하여 조직 관리 기능을 제공합니다.
 */

import { apiClient, ApiResponse } from './api.config';
import type { Organization, OrganizationRequest, OrganizationType } from '@/types/api.types';

/**
 * 조직 서비스 클래스
 */
class OrganizationService {
  /**
   * 조직 목록 조회
   * @param type - 조직 유형 필터 (선택)
   * @param search - 조직 이름 검색 (선택)
   * @returns 조직 목록
   */
  async getOrganizations(type?: OrganizationType, search?: string): Promise<ApiResponse<Organization[]>> {
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (search) params.search = search;

    const response = await apiClient.get<ApiResponse<Organization[]>>('/organizations', { params });
    return response.data;
  }

  /**
   * 조직 생성 (관리자 전용)
   * @param data - 조직 정보
   * @returns 생성된 조직 정보
   */
  async createOrganization(data: OrganizationRequest): Promise<ApiResponse<Organization>> {
    const response = await apiClient.post<ApiResponse<Organization>>('/organizations', data);
    return response.data;
  }

  /**
   * 조직 수정 (관리자 전용)
   * @param id - 조직 ID
   * @param data - 수정할 조직 정보
   * @returns 수정된 조직 정보
   */
  async updateOrganization(id: number, data: OrganizationRequest): Promise<ApiResponse<Organization>> {
    const response = await apiClient.put<ApiResponse<Organization>>(`/organizations/${id}`, data);
    return response.data;
  }

  /**
   * 조직 삭제 (관리자 전용)
   * @param id - 조직 ID
   * @returns 성공 여부
   */
  async deleteOrganization(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/organizations/${id}`);
    return response.data;
  }
}

// 싱글톤 인스턴스 생성 및 export
export const organizationService = new OrganizationService();
export default organizationService;
