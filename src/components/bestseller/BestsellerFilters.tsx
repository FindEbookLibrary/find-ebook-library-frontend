'use client';

import { BESTSELLER_CATEGORIES } from '@lib/mock/data';
import { BookStore } from '@/types/bestseller.types';
import { Button, Chip, IconRefresh } from '@components/ui';

const STORE_LABEL: Record<BookStore, string> = {
  [BookStore.YES24]: 'YES24',
  [BookStore.KYOBO]: '교보문고',
  [BookStore.ALADIN]: '알라딘',
};

interface BestsellerFiltersProps {
  selectedStore: BookStore;
  selectedCategory: string;
  criterion: 'all' | 'mine' | 'avail';
  onStoreChange: (store: BookStore) => void;
  onCategoryChange: (category: string) => void;
  onCriterionChange: (criterion: 'all' | 'mine' | 'avail') => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function BestsellerFilters({
  selectedStore,
  selectedCategory,
  criterion,
  onStoreChange,
  onCategoryChange,
  onCriterionChange,
  onRefresh,
  isLoading,
}: BestsellerFiltersProps) {
  return (
    <div className="sticky top-[64px] z-20 rounded-2xl border border-ink-200 bg-white p-3 shadow-card md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-[11px] uppercase tracking-wider text-ink-500 md:inline">
            서점
          </span>
          <div className="inline-flex rounded-lg bg-ink-50 p-0.5">
            {Object.values(BookStore).map((store) => (
              <button
                key={store}
                type="button"
                onClick={() => onStoreChange(store)}
                className={`h-8 rounded-md px-3 text-[12.5px] font-medium transition-colors ${
                  selectedStore === store
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {STORE_LABEL[store]}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden h-6 w-px bg-ink-200 md:block" />

        <div className="scrollbar-thin -mx-1 flex items-center gap-1.5 overflow-x-auto px-1">
          <span className="mr-1 shrink-0 text-[11px] uppercase tracking-wider text-ink-500">
            카테고리
          </span>
          {BESTSELLER_CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Chip>
          ))}
        </div>

        <div className="md:flex-1" />

        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] uppercase tracking-wider text-ink-500 sm:inline">
            기준
          </span>
          <select
            value={criterion}
            onChange={(event) =>
              onCriterionChange(event.target.value as 'all' | 'mine' | 'avail')
            }
            className="h-9 min-w-0 rounded-lg border border-ink-200 bg-white px-3 text-[13px]"
          >
            <option value="all">전체 도서관</option>
            <option value="mine">내가 이용 가능한 도서관</option>
            <option value="avail">대출 가능한 책만</option>
          </select>
          <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isLoading}>
            <IconRefresh size={14} />
            새로고침
          </Button>
        </div>
      </div>
    </div>
  );
}
