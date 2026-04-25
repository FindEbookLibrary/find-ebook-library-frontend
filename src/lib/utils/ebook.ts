import type { Book, LibraryBookInfo as ApiLibraryBookInfo } from '@/types/api.types';
import { EBook, LibraryBookInfo } from '@/types/book.types';
import { getMockBookByIsbn } from '@lib/mock/data';

/**
 * 백엔드 Book 타입을 화면용 EBook 타입으로 변환합니다.
 * mock 데이터에 같은 ISBN이 있으면, description/toc 같은 보조 정보도 함께 채웁니다.
 */
export const mapApiBookToEBook = (book: Book): EBook => {
  const mockBook = book.isbn ? getMockBookByIsbn(book.isbn) : undefined;

  return {
    id: mockBook?.id ?? String(book.id),
    isbn: book.isbn || '',
    title: book.title,
    author: book.author,
    publisher: book.publisher || '',
    publicationYear:
      book.publishedDate?.slice(0, 4) || mockBook?.publicationYear,
    coverImage: book.coverImageUrl,
    description: book.description || mockBook?.description,
    category: book.category || mockBook?.category,
    toc: mockBook?.toc,
    availableLibraries: mapApiAvailability(book.availableLibraries, mockBook?.availableLibraries),
  };
};

const mapApiAvailability = (
  apiLibraries?: ApiLibraryBookInfo[],
  fallback?: LibraryBookInfo[]
): LibraryBookInfo[] | undefined => {
  if (!apiLibraries?.length) {
    return fallback;
  }

  return apiLibraries.map((library) => ({
    libCode: String(library.libraryId),
    libName: library.libraryName,
    isAvailable: library.available,
    status: library.available
      ? 'available'
      : (library.waitingCount ?? 0) > 0
        ? 'reserve'
        : 'held',
    detailUrl: library.bookUrl,
    availableCopies: library.availableCopies,
    totalCopies: library.totalCopies,
    waitingCount: library.waitingCount,
  }));
};
