'use client';

import { BookStats, EBook } from '@/types/book.types';
import { BookCover, IconArrowRight, IconBookmark, IconBookmarkFill } from '@components/ui';

import { MatchBadge, matchKind } from './ListRow';

interface FeaturedCardProps {
  rank: number;
  book: EBook;
  stats: BookStats;
  storeName: string;
  category: string;
  saved: boolean;
  onOpen: (book: EBook) => void;
  onToggleSave: (book: EBook) => void;
}

export default function FeaturedCard({
  rank,
  book,
  stats,
  storeName,
  category,
  saved,
  onOpen,
  onToggleSave,
}: FeaturedCardProps) {
  const kind = matchKind(stats);
  const accent = rank === 1 ? '#B8932E' : rank === 2 ? '#7B8194' : '#A47148';

  return (
    <article className="group overflow-hidden rounded-2xl border border-ink-200 bg-white transition-shadow hover:shadow-cardHover">
      <div className="relative h-2" style={{ background: accent }} />
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <button type="button" onClick={() => onOpen(book)}>
              <BookCover book={book} w={84} h={120} />
            </button>
            <div
              className="absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-card"
              style={{ background: accent }}
            >
              <span className="num text-[15px] font-bold">{rank}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mono text-[10.5px] text-ink-500">
              {storeName} · {category}
            </div>
            <h3
              onClick={() => onOpen(book)}
              className="mt-1 line-clamp-2 cursor-pointer text-[16px] font-bold leading-snug text-ink-900 hover:text-brand-700 md:text-[17px]"
            >
              {book.title}
            </h3>
            <div className="mt-0.5 text-[12px] text-ink-600">{book.author}</div>
            <button
              type="button"
              onClick={() => onToggleSave(book)}
              className={`mt-2 inline-flex items-center gap-1 text-[11px] ${
                saved ? 'text-brand-700' : 'text-ink-500 hover:text-brand-700'
              }`}
            >
              {saved ? <IconBookmarkFill size={12} /> : <IconBookmark size={12} />}
              {saved ? '저장됨' : '관심'}
            </button>
          </div>
        </div>

        <div className="mt-3.5">
          <MatchBadge kind={kind} size="lg" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-brand-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
              내 이용
            </div>
            <div className="num mt-0.5 text-[18px] font-bold text-brand-700">
              {stats.mine.length}
              <span className="ml-1 text-[11px] font-normal text-brand-500">곳</span>
            </div>
          </div>
          <div className="rounded-lg bg-ink-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
              전체
            </div>
            <div className="num mt-0.5 text-[18px] font-bold text-ink-900">
              {stats.owned.length}
              <span className="ml-1 text-[11px] font-normal text-ink-500">곳</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(book)}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-ink-900 text-[12.5px] font-medium text-white hover:bg-ink-800"
        >
          전자도서관에서 보기
          <IconArrowRight size={13} />
        </button>
      </div>
    </article>
  );
}
