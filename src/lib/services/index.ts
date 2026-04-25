/**
 * 서비스 모듈 통합 export 파일
 * 모든 API 서비스를 한 곳에서 import 할 수 있도록 합니다.
 */

// API 설정 및 공통 타입
export { apiClient, libraryApiClient } from './api.config';
export type { ApiResponse, PageResponse } from './api.config';

// 인증 서비스
export { authService } from './auth.service';
export type { default as AuthService } from './auth.service';

// 도서 서비스
export { bookService } from './book.service';
export type { default as BookService } from './book.service';

// 도서관 서비스
export { libraryService } from './library.service';
export type { default as LibraryService } from './library.service';

// 조직 서비스
export { organizationService } from './organization.service';
export type { default as OrganizationService } from './organization.service';

// 사용자-조직 서비스
export { userOrganizationService } from './user-organization.service';
export type { default as UserOrganizationService } from './user-organization.service';
