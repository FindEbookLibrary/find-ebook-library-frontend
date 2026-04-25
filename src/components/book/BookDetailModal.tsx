'use client';

import { useEffect, useMemo } from 'react';

import { MOCK_BOOKS, MOCK_LIBRARIES, PLATFORMS } from '@lib/mock/data';
import {
  bookStats,
  buildLibraryAvailabilityRows,
} from '@lib/utils/bookStats';
import { getLibraryTypeLabel } from '@lib/utils/libraryUi';
import { useBookmarkStore } from '@stores/bookmarkStore';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';
import {
  BookCover,
  IconBookmark,
  IconBookmarkFill,
  IconClose,
  IconExternal,
  PlatformDot,
  StatusBadge,
} from '@components/ui';
import { ReadStatus } from '@/types/bookmark.types';

export default function BookDetailModal() {
  const openBook = useUIStore((state) => state.openBook);
  const setOpenBook = useUIStore((state) => state.setOpenBook);
  const myLibCodes = useUserStore((state) => state.interestLibraryCodes);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

  useEffect(() => {
    if (!openBook) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenBook(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [openBook, setOpenBook]);

  const availabilityRows = useMemo(
    () =>
      buildLibraryAvailabilityRows(MOCK_LIBRARIES, openBook?.availableLibraries).sort(
        (left, right) => {
          const leftMine = myLibCodes.includes(left.lib.libCode) ? 0 : 1;
          const rightMine = myLibCodes.includes(right.lib.libCode) ? 0 : 1;

          if (leftMine !== rightMine) {
            return leftMine - rightMine;
          }

          const rank = { available: 0, reserve: 1, held: 2, none: 3 };
          return rank[left.status] - rank[right.status];
        }
      ),
    [myLibCodes, openBook?.availableLibraries]
  );

  const stats = useMemo(
    () => bookStats(openBook?.availableLibraries, myLibCodes),
    [myLibCodes, openBook?.availableLibraries]
  );
  const similarBooks = useMemo(
    () =>
      MOCK_BOOKS.filter(
        (book) =>
          book.category === openBook?.category &&
          book.isbn !== openBook?.isbn
      ).slice(0, 3),
    [openBook?.category, openBook?.isbn]
  );

  if (!openBook) {
    return null;
  }

  const bookmarked = isBookmarked(openBook.isbn);
  const canBorrowNow = stats.entries.some((entry) => entry.status === 'available');

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(openBook.isbn);
      return;
    }

    addBookmark({
      isbn: openBook.isbn,
      title: openBook.title,
      author: openBook.author,
      publisher: openBook.publisher,
      coverImage: openBook.coverImage,
      readStatus: ReadStatus.WANT_TO_READ,
    });
  };

  return (
    <div className="fixed inset-0 z-50 fade-in" onClick={() => setOpenBook(null)}>
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" />
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute inset-x-4 bottom-8 top-8 flex flex-col overflow-hidden rounded-2xl bg-paper shadow-pop pop-in md:bottom-12 md:left-1/2 md:top-12 md:w-[920px] md:-translate-x-1/2"
      >
        <div className="flex items-center justify-between border-b border-ink-200 bg-white p-4">
          <div className="mono text-[11px] tracking-wider text-ink-500">
            BOOK / {openBook.category}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleBookmark}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] ${
                bookmarked
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {bookmarked ? <IconBookmarkFill size={14} /> : <IconBookmark size={14} />}
              {bookmarked ? '저장됨' : '관심 도서'}
            </button>
            <button
              type="button"
              onClick={() => setOpenBook(null)}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-ink-100"
              aria-label="닫기"
            >
              <IconClose size={16} />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 border-b border-ink-200 bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
            <BookCover book={openBook} w={160} h={228} />
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {stats.mine.length > 0 ? <StatusBadge status="mine" /> : null}
                <StatusBadge status={canBorrowNow ? 'available' : stats.owned.length > 0 ? 'held' : 'none'} />
              </div>
              <h2 className="text-[24px] font-bold leading-tight tracking-tight text-ink-900 md:text-[28px]">
                {openBook.title}
              </h2>
              <div className="mt-2 text-[13.5px] text-ink-700">{openBook.author}</div>
              <div className="mono mt-1 text-[11.5px] text-ink-500">
                {openBook.publisher} · {openBook.publicationYear} · ISBN {openBook.isbn}
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
                {openBook.description}
              </p>

              <div className="mt-5 grid max-w-[420px] grid-cols-3 gap-2">
                <ModalStat
                  label="보유 도서관"
                  big={stats.owned.length}
                  suffix={`/ ${MOCK_LIBRARIES.length}`}
                />
                <ModalStat
                  label="내 이용 가능"
                  big={stats.mine.length}
                  suffix="곳"
                  tone="brand"
                />
                <ModalStat
                  label="대출 가능"
                  big={stats.entries.filter((entry) => entry.status === 'available').length}
                  suffix="곳"
                  tone="ok"
                />
              </div>
            </div>
          </div>

          {openBook.toc?.length ? (
            <div className="border-b border-ink-200 p-6 md:p-8">
              <h3 className="mb-3 text-[14px] font-semibold text-ink-900">목차 일부</h3>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 md:grid-cols-2">
                {openBook.toc.map((toc, index) => (
                  <li
                    key={`${toc}-${index}`}
                    className="flex items-baseline gap-2 text-[13px] text-ink-700"
                  >
                    <span className="mono text-[10.5px] text-ink-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{toc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-b border-ink-200 p-6 md:p-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-ink-900">
                전자도서관별 보유 / 대출 상태
              </h3>
              <span className="mono text-[11px] text-ink-500">
                총 {MOCK_LIBRARIES.length}개
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
              {availabilityRows.map((row) => {
                const isMine = myLibCodes.includes(row.lib.libCode);

                return (
                  <div
                    key={row.lib.libCode}
                    className={`grid grid-cols-[16px_1fr_auto] items-center gap-3 border-t border-ink-100 px-3 py-3 first:border-t-0 md:px-4 ${
                      isMine ? 'bg-brand-50/40' : ''
                    }`}
                  >
                    <div
                      className={`h-6 w-1 rounded-full ${
                        isMine ? 'bg-brand-600' : 'bg-transparent'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[13px] font-medium text-ink-900">
                          {row.lib.libName}
                        </span>
                        {isMine ? (
                          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                            MY
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-500">
                        <span>{getLibraryTypeLabel(row.lib.type)}</span>
                        <span className="h-1 w-1 rounded-full bg-ink-300" />
                        <span>{row.lib.region}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={row.status} size="xs" />
                      <button
                        type="button"
                        disabled={!row.detailUrl || row.status === 'none'}
                        className={`inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[12px] font-medium ${
                          row.detailUrl && row.status !== 'none'
                            ? 'bg-ink-900 text-white hover:bg-ink-800'
                            : 'cursor-not-allowed bg-ink-100 text-ink-400'
                        }`}
                      >
                        바로가기
                        {row.detailUrl && row.status !== 'none' ? (
                          <IconExternal size={11} />
                        ) : null}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-b border-ink-200 p-6 md:p-8">
            <h3 className="mb-3 text-[14px] font-semibold text-ink-900">
              플랫폼별 바로가기
            </h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-left hover:border-brand-300"
                >
                  <PlatformDot p={platform} size={22} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium text-ink-900">
                      {platform.name}
                    </div>
                  </div>
                  <IconExternal size={14} className="text-ink-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="mb-3 text-[14px] font-semibold text-ink-900">
              비슷한 책 추천
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {similarBooks.map((book) => (
                <button
                  key={book.isbn}
                  type="button"
                  onClick={() => setOpenBook(book)}
                  className="flex gap-3 rounded-lg border border-ink-200 bg-white p-3 text-left hover:border-brand-300"
                >
                  <BookCover book={book} w={48} h={68} />
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-ink-900">
                      {book.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-500">{book.author}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalStat({
  label,
  big,
  suffix,
  tone = 'default',
}: {
  label: string;
  big: number;
  suffix: string;
  tone?: 'default' | 'brand' | 'ok';
}) {
  const toneClass = {
    default: 'bg-ink-50 text-ink-900',
    brand: 'bg-brand-50 text-brand-700',
    ok: 'bg-accent-okBg text-accent-ok',
  }[tone];

  return (
    <div className={`rounded-lg px-3 py-2.5 ${toneClass}`}>
      <div className="text-[11px] text-ink-500">{label}</div>
      <div className="mt-0.5">
        <span className="num text-[18px] font-semibold">{big}</span>
        <span className="ml-1 text-[11px] opacity-70">{suffix}</span>
      </div>
    </div>
  );
}
