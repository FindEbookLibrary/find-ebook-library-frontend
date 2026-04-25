import type { Metadata, Viewport } from 'next';
import Link from 'next/link';

import './globals.css';
import Providers from './providers';
import BookDetailModal from '@/components/book/BookDetailModal';
import Header from '@/components/common/Header';
import { PLATFORMS } from '@/lib/mock/data';

export const metadata: Metadata = {
  title: {
    default: 'LibMatch',
    template: '%s | LibMatch',
  },
  description:
    '여러 전자도서관의 전자책 보유 여부와 대출 상태를 한 번에 확인하는 LibMatch UI입니다.',
  keywords: ['전자도서관', '전자책', '검색', '베스트셀러', '도서관', 'LibMatch'],
  authors: [{ name: 'LibMatch Team' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'LibMatch',
    description: '여러 전자도서관의 전자책을 한 번에 검색하세요.',
    siteName: 'LibMatch',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head />
      <body
        suppressHydrationWarning
        className="min-h-screen bg-paper font-sans text-ink-900"
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="mt-12 border-t border-ink-200">
              <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 py-10 text-[13px] md:grid-cols-4 md:px-8">
                <div className="md:col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-brand-600" />
                    <span className="font-bold tracking-tight">
                      Lib<span className="text-brand-600">Match</span>
                    </span>
                  </div>
                  <p className="max-w-[420px] text-ink-600">
                    전자도서관 통합 검색 서비스. 흩어진 전자책 보유 정보를 한 곳에서 확인하세요.
                  </p>
                  <p className="mono mt-3 text-[11px] text-ink-400">v1.0 · prototype migration</p>
                </div>
                <div>
                  <div className="mb-2 font-semibold text-ink-900">서비스</div>
                  <ul className="space-y-1.5 text-ink-600">
                    <li>
                      <Link href="/" className="hover:text-brand-700">
                        통합 검색
                      </Link>
                    </li>
                    <li>
                      <Link href="/library" className="hover:text-brand-700">
                        내 도서관
                      </Link>
                    </li>
                    <li>
                      <Link href="/bestseller" className="hover:text-brand-700">
                        베스트셀러 매칭
                      </Link>
                    </li>
                    <li>
                      <Link href="/guide" className="hover:text-brand-700">
                        이용 가이드
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="mb-2 font-semibold text-ink-900">연동 플랫폼</div>
                  <ul className="space-y-1.5 text-ink-600">
                    {PLATFORMS.map((platform) => (
                      <li key={platform.id}>{platform.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </footer>
            <BookDetailModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}
