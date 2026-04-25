/**
 * 백엔드 API 타입 정의
 * Fine EBook Library 백엔드 API와 통신하기 위한 타입들을 정의합니다.
 */

// ==================== 공통 타입 ====================

/**
 * API 공통 응답 인터페이스
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
}

/**
 * 페이지네이션 응답 인터페이스 (Spring Data 형식)
 */
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// ==================== 사용자 관련 타입 ====================

/**
 * 사용자 역할
 */
export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

/**
 * 사용자 정보
 */
export interface User {
  id: number;
  email: string;
  username: string;
  enabled: boolean;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 회원가입 요청
 */
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ==================== 도서 관련 타입 ====================

/**
 * 전자책 정보
 */
export interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  publishedDate?: string;
  coverImageUrl?: string;
  description?: string;
  category?: string;
  language?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
  availableLibraries?: LibraryBookInfo[];
}

/**
 * 도서관별 책 정보
 */
export interface LibraryBookInfo {
  libraryId: number;
  libraryName: string;
  available: boolean;
  bookUrl: string;
  availableCopies?: number;
  totalCopies?: number;
  waitingCount?: number;
  lastCheckedAt?: string;
}

// ==================== 도서관 관련 타입 ====================

/**
 * 도서관 유형
 */
export enum LibraryType {
  UNIVERSITY = 'UNIVERSITY',
  CORPORATE = 'CORPORATE',
  PUBLIC = 'PUBLIC',
  REGIONAL = 'REGIONAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
  OTHER = 'OTHER'
}

/**
 * 도서관 정보
 */
export interface Library {
  id: number;
  name: string;
  type: LibraryType;
  url: string;
  logoUrl?: string;
  description?: string;
  provider: string;
  apiEndpoint?: string;
  active: boolean;
  crawlable: boolean;
  priority: number;
  requiredOrganization?: Organization;
  createdAt: string;
  updatedAt: string;
}

/**
 * 도서관 생성/수정 요청
 */
export interface LibraryRequest {
  name: string;
  type: LibraryType;
  url: string;
  logoUrl?: string;
  description?: string;
  provider: string;
  apiEndpoint?: string;
  organizationId?: number;
  active: boolean;
  crawlable: boolean;
  priority: number;
}

// ==================== 조직 관련 타입 ====================

/**
 * 조직 유형
 */
export enum OrganizationType {
  UNIVERSITY = 'UNIVERSITY',
  COMPANY = 'COMPANY',
  PUBLIC_INSTITUTION = 'PUBLIC_INSTITUTION',
  LOCAL_GOVERNMENT = 'LOCAL_GOVERNMENT',
  OTHER = 'OTHER'
}

/**
 * 조직 정보
 */
export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 조직 생성/수정 요청
 */
export interface OrganizationRequest {
  name: string;
  type: OrganizationType;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  active: boolean;
}

// ==================== 사용자-조직 연결 관련 타입 ====================

/**
 * 사용자-조직 연결 정보
 */
export interface UserOrganization {
  id: number;
  userId: number;
  organization: Organization;
  verified: boolean;
  verificationInfo?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 조직 연결 요청
 */
export interface UserOrganizationRequest {
  organizationId: number;
  verificationInfo?: string;
}
