import { BookStats, EBook, LibraryBookInfo, AvailStatus } from '@/types/book.types';
import { Library } from '@/types/library.types';

export interface LibraryAvailabilityRow {
  lib: Library;
  status: AvailStatus;
  detailUrl?: string;
  isAvailable: boolean;
  waitingCount?: number;
}

/**
 * 백엔드 응답과 mock 데이터가 조금씩 다른 상태 표현을 쓰기 때문에,
 * 화면에서는 이 함수를 거쳐 하나의 상태 값으로 정규화해서 사용합니다.
 */
export const getAvailStatus = (
  availability?: Pick<LibraryBookInfo, 'isAvailable' | 'status' | 'waitingCount'>
): AvailStatus => {
  if (!availability) {
    return 'none';
  }

  if (availability.status) {
    return availability.status;
  }

  if (availability.isAvailable) {
    return 'available';
  }

  if ((availability.waitingCount ?? 0) > 0) {
    return 'reserve';
  }

  return 'held';
};

/**
 * 책 한 권의 보유 현황을 화면에서 반복 사용하기 좋은 형태로 계산합니다.
 * "내 도서관에 있는지", "다른 도서관에서라도 빌릴 수 있는지" 같은 우선순위를
 * 한 번만 계산해 두고 카드/배지/정렬에서 재사용합니다.
 */
export const bookStats = (
  availableLibraries: EBook['availableLibraries'] = [],
  myLibCodes: string[] = []
): BookStats => {
  const entries = availableLibraries.map((library) => ({
    libCode: library.libCode,
    status: getAvailStatus(library),
  }));

  const owned = entries.filter((entry) => entry.status !== 'none');
  const mine = owned.filter((entry) => myLibCodes.includes(entry.libCode));

  let primary: BookStats['primary'] = 'none';

  if (mine.some((entry) => entry.status === 'available')) {
    primary = 'mineAvailable';
  } else if (mine.some((entry) => entry.status === 'reserve')) {
    primary = 'mineReserve';
  } else if (mine.some((entry) => entry.status === 'held')) {
    primary = 'mineHeld';
  } else if (owned.some((entry) => entry.status === 'available')) {
    primary = 'otherAvailable';
  } else if (owned.length > 0) {
    primary = 'otherHeld';
  }

  return { entries, owned, mine, primary };
};

/**
 * 전체 도서관 목록과 특정 책의 보유 정보를 합쳐서,
 * "미보유" 도서관까지 포함한 렌더링용 행 데이터로 변환합니다.
 */
export const buildLibraryAvailabilityRows = (
  libraries: Library[],
  availableLibraries: EBook['availableLibraries'] = []
): LibraryAvailabilityRow[] => {
  const availabilityMap = new Map(
    availableLibraries.map((library) => [library.libCode, library])
  );

  return libraries.map((library) => {
    const availability = availabilityMap.get(library.libCode);

    return {
      lib: library,
      status: getAvailStatus(availability),
      detailUrl: availability?.detailUrl,
      isAvailable: availability?.isAvailable ?? false,
      waitingCount: availability?.waitingCount,
    };
  });
};
