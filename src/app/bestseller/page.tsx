'use client';

import { useEffect, useMemo, useState } from 'react';

import BestsellerFilters from '@components/bestseller/BestsellerFilters';
import BestsellerHero from '@components/bestseller/BestsellerHero';
import FeaturedCard from '@components/bestseller/FeaturedCard';
import ListRow from '@components/bestseller/ListRow';
import { EmptyState } from '@components/ui';
import { BESTSELLER_CATEGORIES, MOCK_LIBRARIES, getMockBookByIsbn } from '@lib/mock/data';
import { bookStats } from '@lib/utils/bookStats';
import { useBestseller } from '@hooks/useBestseller';
import { ReadStatus } from '@/types/bookmark.types';
import { useBookmarkStore } from '@stores/bookmarkStore';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';
import { EBook } from '@/types/book.types';

export default function BestsellerPage() {
  const myLibCodes = useUserStore((state) => state.interestLibraryCodes);
  const setOpenBook = useUIStore((state) => state.setOpenBook);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  const {
    selectedBookStore,
    selectedCategory,
    bestsellers,
    isLoading,
    error,
    changeBookStore,
    changeCategory,
    refresh,
    setSelectedLibraries,
  } = useBestseller(true);
  const [criterion, setCriterion] = useState<'all' | 'mine' | 'avail'>('all');

  useEffect(() => {
    setSelectedLibraries(myLibCodes);
  }, [myLibCodes, setSelectedLibraries]);

  const activeCategory = selectedCategory ?? BESTSELLER_CATEGORIES[0];
  const storeLabel = {
    YES24: 'YES24',
    KYOBO: '교보문고',
    ALADIN: '알라딘',
  }[selectedBookStore];

  const rankedBooks = useMemo(() => {
    return bestsellers
      .map((bestseller) => {
        const mockBook = getMockBookByIsbn(bestseller.isbn);
        const ebook: EBook = {
          id: mockBook?.id ?? bestseller.isbn,
          isbn: bestseller.isbn,
          title: bestseller.title,
          author: bestseller.author,
          publisher: bestseller.publisher,
          publicationYear: mockBook?.publicationYear,
          category: mockBook?.category ?? activeCategory,
          description: mockBook?.description,
          toc: mockBook?.toc,
          availableLibraries:
            mockBook?.availableLibraries ??
            bestseller.libraryAvailability?.map((library) => ({
              libCode: library.libCode,
              libName: library.libName,
              isAvailable: library.isAvailable,
              status: library.isAvailable
                ? 'available'
                : (library.reservationCount ?? 0) > 0
                  ? 'reserve'
                  : 'held',
              detailUrl: library.detailUrl,
              waitingCount: library.reservationCount,
            })),
        };

        return {
          rank: bestseller.rank,
          book: ebook,
          stats: bookStats(ebook.availableLibraries, myLibCodes),
        };
      })
      .filter((item) => item.book.isbn);
  }, [activeCategory, bestsellers, myLibCodes]);

  const filteredBooks = useMemo(() => {
    return rankedBooks.filter((item) => {
      if (criterion === 'mine') {
        return item.stats.mine.length > 0;
      }

      if (criterion === 'avail') {
        return item.stats.entries.some((entry) => entry.status === 'available');
      }

      return true;
    });
  }, [criterion, rankedBooks]);

  const totalOwnedCount = rankedBooks.filter((item) => item.stats.owned.length > 0).length;
  const myImmediateCount = rankedBooks.filter((item) =>
    item.stats.mine.some((entry) => entry.status === 'available')
  ).length;
  const myAnyCount = rankedBooks.filter((item) => item.stats.mine.length > 0).length;
  const totalMatchPercentage = rankedBooks.length
    ? Math.round((totalOwnedCount / rankedBooks.length) * 100)
    : 0;
  const myMatchPercentage = rankedBooks.length
    ? Math.round((myAnyCount / rankedBooks.length) * 100)
    : 0;

  const topLibrary = useMemo(() => {
    const counts = rankedBooks.reduce<Record<string, number>>((acc, item) => {
      item.stats.owned.forEach((entry) => {
        acc[entry.libCode] = (acc[entry.libCode] ?? 0) + 1;
      });
      return acc;
    }, {});

    const [libCode, count] =
      Object.entries(counts).sort((left, right) => right[1] - left[1])[0] ?? [];

    return {
      name: MOCK_LIBRARIES.find((library) => library.libCode === libCode)?.libName ?? null,
      count: count ?? 0,
    };
  }, [rankedBooks]);

  const toggleBookmark = (book: EBook) => {
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
    <div className="bg-paper">
      <BestsellerHero
        myImmediateCount={myImmediateCount}
        myMatchPercentage={myMatchPercentage}
        myMatchCount={myAnyCount}
        totalMatchPercentage={totalMatchPercentage}
        totalMatchCount={totalOwnedCount}
        totalBooks={rankedBooks.length}
        topLibraryName={topLibrary.name}
        topLibraryCount={topLibrary.count}
        myLibraryCount={myLibCodes.length}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-5 md:px-8 md:py-10">
        <BestsellerFilters
          selectedStore={selectedBookStore}
          selectedCategory={activeCategory}
          criterion={criterion}
          onStoreChange={changeBookStore}
          onCategoryChange={changeCategory}
          onCriterionChange={setCriterion}
          onRefresh={() => {
            void refresh();
          }}
          isLoading={isLoading}
        />

        <div className="mb-4 mt-7 flex items-end justify-between gap-3 md:mb-4 md:mt-8">
          <div>
            <div className="mono mb-1 text-[11px] tracking-wider text-brand-600">
              {storeLabel} · {activeCategory}
            </div>
            <h2 className="text-[20px] font-bold tracking-tight text-ink-900 md:text-[22px]">
              주간 베스트 {rankedBooks.length}
            </h2>
          </div>
          <div className="hidden text-[12px] text-ink-500 sm:block">
            {filteredBooks.length}건 표시
          </div>
        </div>

        {error && !filteredBooks.length ? (
          <div className="mb-4 rounded-xl border border-accent-warn bg-accent-warnBg px-4 py-3 text-[13px] text-accent-warn">
            {error}
          </div>
        ) : null}

        {filteredBooks.length > 0 && criterion !== 'mine' ? (
          <div className="mb-6 grid grid-cols-1 gap-3 md:mb-8 md:grid-cols-3 md:gap-4">
            {filteredBooks.slice(0, 3).map((item) => (
              <FeaturedCard
                key={`${item.book.isbn}-${item.rank}`}
                rank={item.rank}
                book={item.book}
                stats={item.stats}
                storeName={storeLabel}
                category={activeCategory}
                saved={isBookmarked(item.book.isbn)}
                onToggleSave={toggleBookmark}
                onOpen={setOpenBook}
              />
            ))}
          </div>
        ) : null}

        {filteredBooks.length === 0 ? (
          <EmptyState
            title="조건에 맞는 베스트셀러가 없어요"
            sub="기준을 '전체 도서관'으로 바꿔보세요."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100">
            {(criterion !== 'mine' ? filteredBooks.slice(3) : filteredBooks).map((item) => (
              <ListRow
                key={`${item.book.isbn}-${item.rank}`}
                rank={item.rank}
                book={item.book}
                stats={item.stats}
                storeName={storeLabel}
                category={activeCategory}
                saved={isBookmarked(item.book.isbn)}
                myLibCount={myLibCodes.length}
                totalLibCount={MOCK_LIBRARIES.length}
                onToggleSave={toggleBookmark}
                onOpen={setOpenBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
