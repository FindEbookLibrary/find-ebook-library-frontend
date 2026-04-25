/**
 * Next.js 15 설정 파일
 * https://nextjs.org/docs/app/api-reference/config/next-config-js
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * 엄격 모드 활성화
   * React의 잠재적 문제를 감지하는 개발 모드 도구
   */
  reactStrictMode: true,

  /**
   * TypeScript 설정
   * 빌드 시 타입 에러가 있어도 빌드를 계속할지 여부
   */
  typescript: {
    // 프로덕션 빌드 시 타입 에러 무시 (개발 중에는 false 권장)
    ignoreBuildErrors: false,
  },

  /**
   * ESLint 설정
   */
  eslint: {
    // 빌드 시 린트 에러가 있어도 빌드를 계속할지 여부
    ignoreDuringBuilds: false,
  },

  /**
   * 이미지 최적화 설정
   * Next.js Image 컴포넌트에서 사용할 외부 이미지 도메인 허용
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.yes24.com', // YES24 책 표지 이미지
      },
      {
        protocol: 'https',
        hostname: 'contents.kyobobook.co.kr', // 교보문고 책 표지 이미지
      },
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr', // 알라딘 책 표지 이미지
      },
    ],
  },

  /**
   * 환경 변수 설정
   * 클라이언트에서 접근 가능한 환경 변수는 NEXT_PUBLIC_ 접두사 필요
   */
  env: {
    // 백엔드 API URL (서버 사이드에서만 접근 가능)
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080/api',
  },

  /**
   * Turbopack 설정
   * Next.js 15.3+에서는 experimental.turbo가 deprecated 되었기 때문에
   * 최상위 turbopack 키로 옮겨야 Vercel 빌드 경고가 사라진다.
   *
   * 현재는 커스텀 로더가 없어서 빈 객체만 유지한다.
   * 나중에 파일 변환 규칙이 필요해지면 이 블록 안에 추가하면 된다.
   */
  turbopack: {},

  /**
   * Rewrites 설정
   * API 프록시 - CORS 문제 해결
   * /api/* 요청을 백엔드 서버로 전달
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // 백엔드 서버
      },
    ];
  },

  /**
   * Headers 설정
   * CORS, 보안 헤더 등 설정
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
