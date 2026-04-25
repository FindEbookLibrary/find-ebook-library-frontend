/**
 * API 설정 파일
 * axios 인스턴스 설정 및 공통 설정을 관리합니다.
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * API 기본 URL
 * Next.js 환경 변수에서 가져오거나 기본값 사용
 * Next.js에서는 import.meta.env 대신 process.env 사용
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * 도서관 정보나루 API URL
 * 공공 API 서버 주소
 */
const LIBRARY_API_URL = 'http://data4library.kr/api';

/**
 * axios 인스턴스 생성 함수
 * 공통 설정을 적용한 axios 인스턴스를 생성합니다.
 *
 * @param baseURL - API 기본 URL
 * @param timeout - 요청 타임아웃 시간 (ms)
 * @returns 설정된 axios 인스턴스
 */
const createApiInstance = (baseURL: string, timeout: number = 10000): AxiosInstance => {
  // axios 인스턴스 생성
  const instance = axios.create({
    baseURL,           // API 기본 URL 설정
    timeout,           // 요청 타임아웃 설정 (10초)
    headers: {
      'Content-Type': 'application/json',  // JSON 형식으로 요청
    },
  });

  /**
   * 요청 인터셉터
   * 모든 요청 전에 실행되어 헤더에 인증 토큰 등을 추가합니다.
   */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 로컬 스토리지에서 액세스 토큰 가져오기
      const token = localStorage.getItem('accessToken');

      // 토큰이 있으면 Authorization 헤더에 추가
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 요청 로그 출력 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
      }

      return config;
    },
    (error: AxiosError) => {
      // 요청 오류 처리
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  /**
   * 응답 인터셉터
   * 모든 응답을 받은 후 실행되어 에러 처리 및 데이터 변환을 수행합니다.
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 성공 응답 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response:', response.status, response.config.url);
      }

      return response;
    },
    async (error: AxiosError) => {
      // 응답 오류 처리
      const originalRequest = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      // 401 에러 (인증 실패) 처리
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 리프레시 토큰으로 새 액세스 토큰 발급 시도
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data;

            // 새 토큰 저장
            localStorage.setItem('accessToken', accessToken);

            // 원래 요청 재시도 (새 토큰 사용)
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return instance(originalRequest);
          }
        } catch (refreshError) {
          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      }

      // 기타 에러 로그
      console.error('API Error:', error.response?.status, error.message);

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * 백엔드 API 인스턴스
 * 우리 백엔드 서버와 통신할 때 사용
 */
export const apiClient = createApiInstance(API_BASE_URL);

/**
 * 도서관 정보나루 API 인스턴스
 * 공공 도서관 API와 통신할 때 사용
 */
export const libraryApiClient = createApiInstance(LIBRARY_API_URL, 15000);

/**
 * API 응답 공통 인터페이스
 * 백엔드에서 반환하는 응답의 공통 구조
 */
export interface ApiResponse<T = unknown> {
  /** 성공 여부 */
  success: boolean;

  /** 응답 데이터 */
  data?: T;

  /** 메시지 */
  message?: string;

  /** 에러 발생 시각 */
  timestamp?: string;
}

/**
 * Spring Data 페이지네이션 응답 인터페이스
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
