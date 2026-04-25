'use client';

import { useMemo, useState } from 'react';

import { bookStats } from '@lib/utils/bookStats';
import { EBook } from '@/types/book.types';
import { Library } from '@/types/library.types';
import {
  BookCover,
  Button,
  CoverageBar,
  IconArrowRight,
  IconBookmark,
  IconBookmarkFill,
  IconCheckCircle,
  IconChevDown,
  IconClock,
  PlatformStack,
} from '@components/ui';

import LibraryAvailabilityList from './LibraryAvailabilityList';

interface BookResultCardProps {
  book: EBook;
  libraries: Library[];
  myLibCodes: string[];
  saved: boolean;
  onOpen: (book: EBook) => void;
  onToggleSave: (book: EBook) => void;
}

const HEADLINE_CLASS = {
  ok: 'bg-accent-ok text-white',
  warn: 'bg-accent-warn text-white',
  info: 'bg-accent-info text-white',
  infoSoft: 'bg-accent-infoBg text-accent-info',
  neutral: 'bg-ink-100 text-ink-700',
  off: 'bg-ink-100 text-ink-500',
} as const;

export default function BookResultCard({
  book,
  libraries,
  myLibCodes,
  saved,
  onOpen,
  onToggleSave,
}: BookResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const stats = useMemo(
    () => bookStats(book.availableLibraries, myLibCodes),
    [book.availableLibraries, myLibCodes]
  );

  const ownedCount = stats.owned.length;
  const mineCount = stats.mine.length;
  const mineAvailableCount = stats.mine.filter(
    (entry) => entry.status === 'available'
  ).length;

  const headline = (() => {
    if (stats.mine.some((entry) => entry.status === 'available')) {
      return { label: '내 도서관에서 바로 대출 가능', tone: 'ok' as const };
    }

    if (stats.mine.some((entry) => entry.status === 'reserve')) {
      return { label: '내 도서관에서 예약 가능', tone: 'warn' as const };
    }

    if (mineCount > 0) {
      return { label: '내 도서관 보유 (대출중)', tone: 'info' as const };
    }

    if (stats.entries.some((entry) => entry.status === 'available')) {
      return { label: '다른 도서관에서 대출 가능', tone: 'infoSoft' as const };
    }

    if (ownedCount > 0) {
      return { label: '다른 도서관 보유', tone: 'neutral' as const };
    }

    return { label: '전자도서관 미보유', tone: 'off' as const };
  })();

  const ownedPlatformIds = [
    ...new Set(
      stats.owned
        .map((entry) => libraries.find((library) => library.libCode === entry.libCode)?.platform)
        .filter((platform): platform is string => Boolean(platform))
    ),
  ];

  return (
    <article
      className={`rounded-2xl border bg-white transition-shadow ${
        stats.mine.some((entry) => entry.status === 'available')
          ? 'border-accent-ok/30 shadow-card hover:shadow-cardHover'
          : 'border-ink-200 hover:shadow-cardHover'
      }`}
    >
      <div className="flex gap-4 p-4 md:gap-5 md:p-5">
        <button type="button" onClick={() => onOpen(book)} className="shrink-0 self-start">
          <BookCover book={book} w={84} h={120} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${HEADLINE_CLASS[headline.tone]}`}
            >
              {headline.tone === 'ok' ? <IconCheckCircle size={12} /> : null}
              {headline.tone === 'warn' ? <IconClock size={12} /> : null}
              {headline.label}
            </span>
            <span className="mono text-[10.5px] uppercase tracking-wider text-ink-400">
              {book.category}
            </span>
          </div>

          <h3
            onClick={() => onOpen(book)}
            className="mt-2 cursor-pointer text-[17px] font-bold leading-snug text-ink-900 hover:text-brand-700 md:text-[19px]"
          >
            {book.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-600">
            <span>{book.author}</span>
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span>{book.publisher}</span>
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span className="num">{book.publicationYear}</span>
          </div>

          {book.description ? (
            <p className="mt-2.5 hidden line-clamp-2 text-[13px] leading-relaxed text-ink-600 md:block">
              {book.description}
            </p>
          ) : null}

          <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/70 p-3 md:p-3.5">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="border-r border-ink-200 pr-3 md:pr-4">
                <div className="flex items-baseline justify-between">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-brand-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                    내 이용 가능
                  </span>
                  <span className="mono text-[10px] text-ink-400">/ {myLibCodes.length}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span
                    className={`num text-[26px] font-bold leading-none ${
                      mineCount > 0 ? 'text-brand-700' : 'text-ink-400'
                    }`}
                  >
                    {mineCount}
                  </span>
                  <span className="text-[12px] text-ink-500">곳 보유</span>
                </div>
                <div className="mt-1 text-[11px] text-ink-600">
                  <span
                    className={`font-semibold ${
                      mineAvailableCount > 0 ? 'text-accent-ok' : 'text-ink-500'
                    }`}
                  >
                    {mineAvailableCount}곳 즉시 대출
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
                    전체 보유
                  </span>
                  <span className="mono text-[10px] text-ink-400">/ {libraries.length}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="num text-[26px] font-bold leading-none text-ink-900">
                    {ownedCount}
                  </span>
                  <span className="text-[12px] text-ink-500">개 도서관</span>
                </div>
                <div className="mt-1.5">
                  <PlatformStack platformIds={ownedPlatformIds} size={16} />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <CoverageBar
                mineCount={mineCount}
                ownedCount={ownedCount}
                totalLibs={libraries.length}
              />
              <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-brand-600" />
                  내 도서관
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-ink-300" />
                  전체 보유
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setExpanded((current) => !current)}>
              <IconChevDown
                size={14}
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
              {expanded ? '접기' : `도서관별 보기 (${libraries.length})`}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpen(book)}>
              상세 정보 <IconArrowRight size={13} />
            </Button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => onToggleSave(book)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                saved
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-ink-200 text-ink-500 hover:border-brand-300 hover:text-brand-700'
              }`}
              title="관심 도서 추가"
            >
              {saved ? <IconBookmarkFill size={14} /> : <IconBookmark size={14} />}
            </button>
          </div>
        </div>
      </div>

      {expanded ? (
        <div className="fade-in px-4 pb-4 md:px-5 md:pb-5">
          <LibraryAvailabilityList
            book={book}
            libraries={libraries}
            myLibCodes={myLibCodes}
          />
        </div>
      ) : null}
    </article>
  );
}
