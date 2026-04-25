import { describe, expect, it } from 'vitest';

import { MOCK_BOOKS, MOCK_LIBRARIES } from '@lib/mock/data';
import { bookStats, buildLibraryAvailabilityRows } from '@lib/utils/bookStats';

describe('bookStats', () => {
  it('내 도서관에서 바로 대출 가능한 경우 mineAvailable을 반환한다', () => {
    const book = MOCK_BOOKS.find((item) => item.id === 'b1');
    expect(book).toBeDefined();

    const stats = bookStats(book?.availableLibraries, ['seoul-edu']);

    expect(stats.primary).toBe('mineAvailable');
    expect(stats.mine.some((entry) => entry.libCode === 'seoul-edu')).toBe(true);
  });

  it('보유 정보가 없는 책은 none으로 계산한다', () => {
    const stats = bookStats([], ['seoul-edu']);

    expect(stats.primary).toBe('none');
    expect(stats.owned).toHaveLength(0);
  });
});

describe('buildLibraryAvailabilityRows', () => {
  it('전체 도서관 기준으로 미보유 상태까지 포함한 행을 만든다', () => {
    const rows = buildLibraryAvailabilityRows(
      MOCK_LIBRARIES,
      MOCK_BOOKS[0].availableLibraries
    );

    expect(rows).toHaveLength(MOCK_LIBRARIES.length);
    expect(rows.some((row) => row.status === 'none')).toBe(true);
    expect(rows.some((row) => row.status === 'available')).toBe(true);
  });
});
