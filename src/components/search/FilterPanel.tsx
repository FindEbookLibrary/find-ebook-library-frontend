'use client';

import { useState } from 'react';

import { PLATFORMS } from '@lib/mock/data';
import { getLibraryTypeLabel } from '@lib/utils/libraryUi';
import { Library } from '@/types/library.types';
import { SearchFilters } from '@/types/ui.types';
import { IconCheck, IconChevDown } from '@components/ui';

interface FilterPanelProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  libraries: Library[];
}

const DEFAULT_FILTERS: SearchFilters = {
  avail: 'all',
  libTypes: [],
  platforms: [],
  sort: 'avail-first',
};

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[12.5px] font-semibold tracking-wide text-ink-800">
          {title}
        </span>
        <span
          className={`text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <IconChevDown size={16} />
        </span>
      </button>
      {open ? <div className="mt-3 space-y-1.5">{children}</div> : null}
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between py-1">
      <span className="flex items-center gap-2 text-[13px] text-ink-700 group-hover:text-ink-900">
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
            checked ? 'border-brand-600' : 'border-ink-300'
          }`}
        >
          {checked ? <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> : null}
        </span>
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        {label}
      </span>
    </label>
  );
}

function FilterCheck({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between py-1">
      <span className="flex items-center gap-2 text-[13px] text-ink-700 group-hover:text-ink-900">
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border ${
            checked
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-ink-300 bg-white'
          }`}
        >
          {checked ? <IconCheck size={10} sw={3} /> : null}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        {label}
      </span>
      {count !== undefined ? <span className="mono text-[11px] text-ink-400">{count}</span> : null}
    </label>
  );
}

export default function FilterPanel({
  filters,
  setFilters,
  libraries,
}: FilterPanelProps) {
  const setFilter = <Key extends keyof SearchFilters>(
    key: Key,
    value: SearchFilters[Key]
  ) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: 'libTypes' | 'platforms', value: string) => {
    const nextValue = new Set(filters[key]);
    if (nextValue.has(value)) {
      nextValue.delete(value);
    } else {
      nextValue.add(value);
    }

    setFilter(key, [...nextValue]);
  };

  const libraryTypeCounts = ['대학교', '회사/기관', '공공도서관', '시/군/구'].reduce<
    Record<string, number>
  >((counts, typeLabel) => {
    counts[typeLabel] = libraries.filter(
      (library) => getLibraryTypeLabel(library.type) === typeLabel
    ).length;
    return counts;
  }, {});

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-ink-900">필터</h3>
        <button
          type="button"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-[12px] text-ink-500 hover:text-brand-700"
        >
          초기화
        </button>
      </div>

      <FilterGroup title="이용 가능 여부">
        {[
          { value: 'all', label: '전체' },
          { value: 'mine', label: '내가 이용 가능' },
          { value: 'avail', label: '대출 가능' },
          { value: 'reserve', label: '예약 가능' },
        ].map((option) => (
          <FilterRadio
            key={option.value}
            label={option.label}
            checked={filters.avail === option.value}
            onChange={() => setFilter('avail', option.value as SearchFilters['avail'])}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="도서관 유형">
        {['대학교', '회사/기관', '공공도서관', '시/군/구'].map((typeLabel) => (
          <FilterCheck
            key={typeLabel}
            label={typeLabel}
            count={libraryTypeCounts[typeLabel]}
            checked={filters.libTypes.includes(typeLabel)}
            onChange={() => toggleArrayFilter('libTypes', typeLabel)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="전자책 플랫폼">
        {PLATFORMS.map((platform) => (
          <FilterCheck
            key={platform.id}
            label={platform.name}
            checked={filters.platforms.includes(platform.id)}
            onChange={() => toggleArrayFilter('platforms', platform.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="정렬">
        {[
          { value: 'avail-first', label: '대출 가능 우선' },
          { value: 'mine-first', label: '내 이용 가능 도서관 우선' },
          { value: 'most-owned', label: '보유 도서관 많은 순' },
          { value: 'newest', label: '최신순' },
        ].map((option) => (
          <FilterRadio
            key={option.value}
            label={option.label}
            checked={filters.sort === option.value}
            onChange={() => setFilter('sort', option.value as SearchFilters['sort'])}
          />
        ))}
      </FilterGroup>
    </>
  );
}
