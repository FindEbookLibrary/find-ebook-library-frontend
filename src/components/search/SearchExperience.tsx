'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import BookResultCard from '@components/search/BookResultCard';
import FilterPanel from '@components/search/FilterPanel';
import {
  Button,
  EmptyState,
  IconClose,
  IconFilter,
  IconSearch,
  Skel,
} from '@components/ui';
import { libraryService } from '@lib/services/library.service';
import { getMockPlatformById } from '@lib/mock/data';
import { bookStats } from '@lib/utils/bookStats';
import { getLibraryTypeLabel } from '@lib/utils/libraryUi';
import { ReadStatus } from '@/types/bookmark.types';
import { SearchFilters } from '@/types/ui.types';
import { useBookSearch } from '@hooks/useBookSearch';
import { useBookmarkStore } from '@stores/bookmarkStore';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';

const DEFAULT_FILTERS: SearchFilters = {
  avail: 'all',
  libTypes: [],
  platforms: [],
  sort: 'avail-first',
};

function MobileFilterSheet({
  open,
  onClose,
  filters,
  setFilters,
  activeCount,
  libraries,
}: {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  activeCount: number;
  libraries: ReturnType<typeof useUserStore.getState>['accessibleLibraries'];
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fade-in fixed inset-0 z-40 lg:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/40" />
      <div
        onClick={(event) => event.stopPropagation()}
        className="pop-in absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-paper shadow-pop"
      >
        <div className="flex items-center justify-between border-b border-ink-200 p-4">
          <h3 className="font-semibold text-ink-900">
            필터 {activeCount > 0 ? <span className="num text-brand-600">({activeCount})</span> : null}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-ink-100"
          >
            <IconClose size={16} />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-4">
          <FilterPanel filters={filters} setFilters={setFilters} libraries={libraries} />
        </div>
        <div className="border-t border-ink-200 bg-white p-4">
          <Button onClick={onClose} className="w-full" size="lg">
            결과 보기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SearchExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  const {
    results,
    keyword,
    isLoading,
    error,
    search,
    updateKeyword,
    setCurrentPage,
    reset,
  } = useBookSearch();
  const libraries = useUserStore((state) => state.accessibleLibraries);
  const setAccessibleLibraries = useUserStore((state) => state.setAccessibleLibraries);
  const myLibCodes = useUserStore((state) => state.interestLibraryCodes);
  const setOpenBook = useUIStore((state) => state.setOpenBook);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

  const [inputValue, setInputValue] = useState(query);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setInputValue(query);
    updateKeyword(query);
    setCurrentPage(1);

    if (query) {
      void search(query, 1);
      return;
    }

    reset();
  }, [query, reset, search, setCurrentPage, updateKeyword]);

  useEffect(() => {
    if (libraries.length > 0) {
      return;
    }

    const loadLibraries = async () => {
      const nextLibraries = await libraryService.getAccessibleLibraries();
      setAccessibleLibraries(nextLibraries as never);
    };

    void loadLibraries();
  }, [libraries.length, setAccessibleLibraries]);

  const filteredResults = useMemo(() => {
    return results.filter((book) => {
      const stats = bookStats(book.availableLibraries, myLibCodes);
      let matchingEntries = stats.owned;

      if (filters.libTypes.length > 0) {
        matchingEntries = matchingEntries.filter((entry) => {
          const library = libraries.find((item) => item.libCode === entry.libCode);
          return library ? filters.libTypes.includes(getLibraryTypeLabel(library.type)) : false;
        });
      }

      if (filters.platforms.length > 0) {
        matchingEntries = matchingEntries.filter((entry) => {
          const library = libraries.find((item) => item.libCode === entry.libCode);
          return library?.platform ? filters.platforms.includes(library.platform) : false;
        });
      }

      if (filters.avail === 'mine') {
        matchingEntries = matchingEntries.filter((entry) => myLibCodes.includes(entry.libCode));
      }

      if (filters.avail === 'avail') {
        matchingEntries = matchingEntries.filter((entry) => entry.status === 'available');
      }

      if (filters.avail === 'reserve') {
        matchingEntries = matchingEntries.filter((entry) => entry.status === 'reserve');
      }

      return (
        matchingEntries.length > 0 ||
        (filters.avail === 'all' &&
          filters.libTypes.length === 0 &&
          filters.platforms.length === 0)
      );
    });
  }, [filters, libraries, myLibCodes, results]);

  const sortedResults = useMemo(() => {
    const nextResults = [...filteredResults];

    nextResults.sort((left, right) => {
      const leftStats = bookStats(left.availableLibraries, myLibCodes);
      const rightStats = bookStats(right.availableLibraries, myLibCodes);

      if (filters.sort === 'mine-first') {
        return rightStats.mine.length - leftStats.mine.length;
      }

      if (filters.sort === 'most-owned') {
        return rightStats.owned.length - leftStats.owned.length;
      }

      if (filters.sort === 'newest') {
        return Number(right.publicationYear ?? 0) - Number(left.publicationYear ?? 0);
      }

      const leftHasAvailable = leftStats.entries.some((entry) => entry.status === 'available') ? 1 : 0;
      const rightHasAvailable = rightStats.entries.some((entry) => entry.status === 'available') ? 1 : 0;

      if (leftHasAvailable !== rightHasAvailable) {
        return rightHasAvailable - leftHasAvailable;
      }

      return rightStats.owned.length - leftStats.owned.length;
    });

    return nextResults;
  }, [filteredResults, filters.sort, myLibCodes]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.avail !== 'all') {
      const labelMap = {
        mine: '내가 이용 가능',
        avail: '대출 가능',
        reserve: '예약 가능',
      };

      chips.push({
        key: 'avail',
        label: labelMap[filters.avail],
        onRemove: () => setFilters({ ...filters, avail: 'all' }),
      });
    }

    filters.libTypes.forEach((typeLabel) => {
      chips.push({
        key: `type:${typeLabel}`,
        label: typeLabel,
        onRemove: () =>
          setFilters({
            ...filters,
            libTypes: filters.libTypes.filter((item) => item !== typeLabel),
          }),
      });
    });

    filters.platforms.forEach((platformId) => {
      const platform = getMockPlatformById(platformId);
      chips.push({
        key: `platform:${platformId}`,
        label: platform?.name ?? platformId,
        onRemove: () =>
          setFilters({
            ...filters,
            platforms: filters.platforms.filter((item) => item !== platformId),
          }),
      });
    });

    return chips;
  }, [filters]);

  const totalMineMatch = sortedResults.filter(
    (book) => bookStats(book.availableLibraries, myLibCodes).mine.length > 0
  ).length;
  const totalImmediate = sortedResults.filter((book) =>
    bookStats(book.availableLibraries, myLibCodes).mine.some(
      (entry) => entry.status === 'available'
    )
  ).length;

  const submitSearch = () => {
    const nextKeyword = inputValue.trim();

    if (!nextKeyword) {
      return;
    }

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(nextKeyword)}`);
    });
  };

  const toggleBookmark = (book: (typeof results)[number]) => {
    if (isBookmarked(book.isbn)) {
      removeBookmark(book.isbn);
      return;
    }

    addBookmark({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      coverImage: book.coverImage,
      readStatus: ReadStatus.WANT_TO_READ,
    });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-5 md:px-8 md:py-8">
      <div className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-card">
        <div className="pl-3 text-ink-500">
          <IconSearch size={18} />
        </div>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitSearch();
            }
          }}
          className="h-11 min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none"
          placeholder="책 제목, 저자, ISBN, 키워드"
        />
        <Button onClick={submitSearch} size="md" className="!px-4 sm:!px-5">
          검색
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 md:mt-6">
        <div>
          <div className="mono mb-1 text-[11px] uppercase tracking-wider text-brand-600">
            Search results
          </div>
          <h2 className="text-[20px] font-bold leading-tight text-ink-900 md:text-[24px]">
            “{query || keyword || '전자책'}”
          </h2>
          <p className="mt-1 text-[13px] text-ink-600">
            <span className="num font-semibold text-ink-900">{libraries.length}</span>개 전자도서관 ·
            <span className="mx-1 num font-semibold text-ink-900">{sortedResults.length}</span>건 매칭 ·
            <span className="font-semibold text-brand-700">
              내 도서관 보유 <span className="num">{totalMineMatch}</span>건 ({totalImmediate}건 즉시 대출)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-[13px] lg:hidden"
          >
            <IconFilter size={14} />
            필터
            {activeChips.length > 0 ? (
              <span className="num text-brand-600">({activeChips.length})</span>
            ) : null}
          </button>
          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters({
                ...filters,
                sort: event.target.value as SearchFilters['sort'],
              })
            }
            className="h-9 rounded-lg border border-ink-200 bg-white px-3 text-[13px]"
          >
            <option value="avail-first">대출 가능 우선</option>
            <option value="mine-first">내 이용 가능 도서관 우선</option>
            <option value="most-owned">보유 도서관 많은 순</option>
            <option value="newest">최신순</option>
          </select>
        </div>
      </div>

      {activeChips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 py-1 pl-2.5 pr-1.5 text-[12px] text-brand-700"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand-100"
              >
                <IconClose size={10} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex gap-6 md:mt-6">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-[80px] rounded-2xl border border-ink-200 bg-white p-4">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              libraries={libraries}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="space-y-3 md:space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skel-${index}`}
                  className="rounded-2xl border border-ink-200 bg-white p-4 md:p-5"
                >
                  <div className="flex gap-4 md:gap-5">
                    <Skel className="h-[120px] w-[84px]" />
                    <div className="flex-1 space-y-3">
                      <Skel className="h-5 w-36" />
                      <Skel className="h-7 w-2/3" />
                      <Skel className="h-4 w-1/2" />
                      <Skel className="h-28 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState title="검색 중 오류가 발생했습니다" sub={error} />
          ) : sortedResults.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다"
              sub="다른 키워드로 검색하거나 필터를 줄여보세요."
            />
          ) : (
            <div className="space-y-3 md:space-y-4">
              {sortedResults.map((book) => (
                <BookResultCard
                  key={book.isbn}
                  book={book}
                  libraries={libraries}
                  myLibCodes={myLibCodes}
                  saved={isBookmarked(book.isbn)}
                  onToggleSave={toggleBookmark}
                  onOpen={setOpenBook}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        activeCount={activeChips.length}
        libraries={libraries}
      />
    </div>
  );
}
