/**
 * Root Layout
 * Next.js 15 App Router의 최상위 레이아웃
 * 모든 페이지에 공통으로 적용되는 레이아웃을 정의합니다.
 *
 * Server Component (기본값)
 * - 서버에서 렌더링됩니다.
 * - 클라이언트로 전송되는 JavaScript 번들 크기가 작습니다.
 * - 데이터베이스나 파일 시스템에 직접 접근 가능합니다.
 */

import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/common/Navbar';

/**
 * Metadata
 * Next.js 15의 Metadata API
 * SEO를 위한 메타데이터를 정의합니다.
 *
 * Spring Boot에서 HTML 템플릿의 <head> 태그와 유사
 */
export const metadata: Metadata = {
  title: {
    default: '전자도서관 통합 검색',
    template: '%s | 전자도서관 통합 검색', // 하위 페이지에서 사용
  },
  description: '여러 전자도서관의 전자책을 한 번에 검색하고, 베스트셀러가 어떤 도서관에 있는지 확인하세요.',
  keywords: ['전자도서관', '전자책', '검색', '베스트셀러', '도서관', 'ebook'],
  authors: [{ name: '전자도서관 통합 검색 팀' }],

  /**
   * Open Graph (소셜 미디어 공유 시 표시)
   */
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: '전자도서관 통합 검색',
    description: '여러 전자도서관의 전자책을 한 번에 검색하세요',
    siteName: '전자도서관 통합 검색',
  },

  /**
   * 뷰포트 설정 (반응형 웹)
   */
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

/**
 * RootLayout 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트
 *
 * Next.js에서 layout.tsx는 특별한 파일입니다:
 * - 모든 페이지를 감싸는 공통 레이아웃
 * - children prop으로 하위 페이지를 받습니다
 * - HTML 구조의 기본 틀을 제공합니다
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * <html> 태그
     * lang 속성으로 언어 지정 (SEO 및 접근성)
     */
    <html lang="ko">
      {/**
       * <body> 태그
       * suppressHydrationWarning:
       * - Next.js의 Hydration 경고를 억제
       * - 브라우저 확장 프로그램 등이 HTML을 수정할 때 발생하는 경고 방지
       */}
      <body suppressHydrationWarning>
        {/**
         * Providers 컴포넌트
         * - React Query, Zustand 등의 Provider를 래핑
         * - Client Component로 분리 ('use client' 필요)
         * - Context API를 사용하려면 Client Component여야 함
         */}
        <Providers>
          {/**
           * 전체 앱 구조
           * - Navbar: 상단 네비게이션 바
           * - main: 메인 콘텐츠 영역 (children)
           * - footer: 푸터
           */}
          <div className="app">
            {/* 네비게이션 바 */}
            <Navbar />

            {/* 메인 콘텐츠 (페이지가 렌더링되는 영역) */}
            <main className="main-content">
              {children}
            </main>

            {/* 푸터 */}
            <footer className="footer">
              <div className="footer-content">
                <p>&copy; 2024 전자도서관 통합 검색. All rights reserved.</p>
                <p>
                  전자도서관 데이터는{' '}
                  <a
                    href="http://data4library.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    도서관 정보나루
                  </a>
                  에서 제공받습니다.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
