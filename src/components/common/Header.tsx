'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUserStore } from '@stores/userStore';
import { IconShield } from '@components/ui';

const NAV_ITEMS = [
  { href: '/', label: '통합 검색', id: 'search' },
  { href: '/library', label: '내 도서관', id: 'library' },
  { href: '/bestseller', label: '베스트셀러 매칭', id: 'bestseller' },
  { href: '/guide', label: '이용 가이드', id: 'guide' },
];

const getActiveSection = (pathname: string): string => {
  if (pathname === '/' || pathname.startsWith('/search')) {
    return 'search';
  }

  if (pathname.startsWith('/library')) {
    return 'library';
  }

  if (pathname.startsWith('/bestseller')) {
    return 'bestseller';
  }

  if (pathname.startsWith('/guide')) {
    return 'guide';
  }

  return '';
};

export default function Header() {
  const pathname = usePathname();
  const interestLibraryCount = useUserStore(
    (state) => state.interestLibraryCodes.length
  );
  const userName = useUserStore((state) => state.user?.name ?? '정수');
  const activeSection = getActiveSection(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="LibMatch 홈">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-brand-600">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%)',
              }}
            />
            <div className="grid h-4 w-4 grid-cols-2 grid-rows-2 gap-[2px]">
              <div className="bg-white/95" />
              <div className="bg-white/55" />
              <div className="bg-white/55" />
              <div className="bg-white/95" />
            </div>
          </div>
          <div className="text-[17px] font-bold tracking-tight text-ink-900">
            Lib<span className="text-brand-600">Match</span>
          </div>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex h-9 items-center rounded-lg px-3 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Link
            href="/library"
            className="hidden h-9 items-center gap-2 rounded-lg px-3 text-[12.5px] text-ink-700 hover:bg-ink-100 sm:inline-flex"
            title="내 소속 / 도서관 설정"
          >
            <IconShield size={16} />
            <span className="hidden md:inline">
              {interestLibraryCount > 0
                ? `내 도서관 ${interestLibraryCount}곳`
                : '내 도서관 설정'}
            </span>
          </Link>
          <div className="hidden h-5 w-px bg-ink-200 sm:block" />
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12.5px] text-ink-700 hover:bg-ink-100"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[12px] font-semibold text-brand-700">
              {userName.slice(0, 1)}
            </div>
            <span className="hidden md:inline">{userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
