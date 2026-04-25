'use client';

import { BookStats, EBook } from '@/types/book.types';
import {
  BookCover,
  IconArrowRight,
  IconBookmark,
  IconBookmarkFill,
  IconCheckCircle,
  IconClock,
} from '@components/ui';

export const matchKind = (stats: BookStats): 'mine-avail' | 'mine-reserve' | 'other' | 'none' => {
  if (stats.mine.some((entry) => entry.status === 'available')) {
    return 'mine-avail';
  }

  if (stats.mine.some((entry) => entry.status === 'reserve' || entry.status === 'held')) {
    return 'mine-reserve';
  }

  if (stats.owned.length > 0) {
    return 'other';
  }

  return 'none';
};

export function MatchBadge({
  kind,
  size = 'sm',
}: {
  kind: ReturnType<typeof matchKind>;
  size?: 'sm' | 'lg';
}) {
  const tone = {
    'mine-avail': {
      label: '내 도서관에서 대출 가능',
      className: 'bg-accent-ok text-white',
      icon: <IconCheckCircle size={11} />,
    },
    'mine-reserve': {
      label: '보유 중, 예약 필요',
      className: 'bg-accent-warnBg text-accent-warn',
      icon: <IconClock size={11} />,
    },
    other: {
      label: '다른 도서관에만 있음',
      className: 'bg-accent-infoBg text-accent-info',
      icon: null,
    },
    none: {
      label: '전자도서관 미보유',
      className: 'bg-ink-100 text-ink-600',
      icon: null,
    },
  }[kind];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${tone.className} ${
        size === 'lg' ? 'px-2.5 py-1 text-[12px]' : 'px-2 py-0.5 text-[11px]'
      }`}
    >
      {tone.icon}
      {tone.label}
    </span>
  );
}

interface ListRowProps {
  rank: number;
  book: EBook;
  stats: BookStats;
  storeName: string;
  category: string;
  saved: boolean;
  myLibCount: number;
  totalLibCount: number;
  onOpen: (book: EBook) => void;
  onToggleSave: (book: EBook) => void;
}

export default function ListRow({
  rank,
  book,
  stats,
  storeName,
  category,
  saved,
  myLibCount,
  totalLibCount,
  onOpen,
  onToggleSave,
}: ListRowProps) {
  const kind = matchKind(stats);

  return (
    <div className="flex items-center gap-3 p-4 transition-colors hover:bg-ink-50/50 md:gap-5 md:p-5">
      <div className="num w-7 shrink-0 text-center text-[18px] font-bold text-ink-700 md:w-9 md:text-[20px]">
        {rank}
      </div>
      <button type="button" onClick={() => onOpen(book)} className="shrink-0">
        <BookCover book={book} w={52} h={74} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <MatchBadge kind={kind} />
          <span className="mono hidden text-[10px] text-ink-400 sm:inline">
            {storeName} · {category}
          </span>
        </div>
        <h3
          onClick={() => onOpen(book)}
          className="mt-1.5 line-clamp-1 cursor-pointer text-[14.5px] font-semibold leading-snug text-ink-900 hover:text-brand-700 md:text-[15px]"
        >
          {book.title}
        </h3>
        <div className="mt-0.5 text-[11.5px] text-ink-600">{book.author}</div>
      </div>

      <div className="hidden shrink-0 items-center gap-4 sm:flex">
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
            내 이용
          </div>
          <div className="num text-[15px] font-bold leading-tight text-brand-700">
            {stats.mine.length}
            <span className="text-[10px] font-normal text-ink-400">/{myLibCount}</span>
          </div>
        </div>
        <div className="h-7 w-px bg-ink-200" />
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
            전체
          </div>
          <div className="num text-[15px] font-bold leading-tight text-ink-900">
            {stats.owned.length}
            <span className="text-[10px] font-normal text-ink-400">/{totalLibCount}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onToggleSave(book)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            saved
              ? 'bg-brand-50 text-brand-700'
              : 'text-ink-400 hover:bg-ink-100 hover:text-brand-700'
          }`}
        >
          {saved ? <IconBookmarkFill size={14} /> : <IconBookmark size={14} />}
        </button>
        <button
          type="button"
          onClick={() => onOpen(book)}
          className="hidden h-8 items-center gap-1 rounded-lg bg-ink-100 px-3 text-[12px] font-medium text-ink-800 hover:bg-ink-200 md:inline-flex"
        >
          상세
          <IconArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
