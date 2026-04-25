import { buildLibraryAvailabilityRows } from '@lib/utils/bookStats';
import { getLibraryTypeLabel } from '@lib/utils/libraryUi';
import { EBook } from '@/types/book.types';
import { Library } from '@/types/library.types';
import { getMockPlatformById } from '@lib/mock/data';
import { PlatformDot, StatusBadge } from '@components/ui';

interface LibraryAvailabilityListProps {
  book: EBook;
  libraries: Library[];
  myLibCodes: string[];
  limit?: number | null;
}

function AvailabilityRow({
  lib,
  status,
  detailUrl,
  myLibCodes,
}: ReturnType<typeof buildLibraryAvailabilityRows>[number] & {
  myLibCodes: string[];
}) {
  const isMine = myLibCodes.includes(lib.libCode);
  const platform = getMockPlatformById(lib.platform);
  const canOpen = (isMine || !lib.authNeeded) && status !== 'none' && Boolean(detailUrl);

  return (
    <div
      className={`grid grid-cols-[16px_1fr_auto] items-center gap-3 border-t border-ink-100 px-3 py-3 md:px-4 ${
        isMine ? 'bg-brand-50/40' : ''
      }`}
    >
      <div
        className={`h-6 w-1 rounded-full ${isMine ? 'bg-brand-600' : 'bg-transparent'}`}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[13px] font-medium text-ink-900">
            {lib.libName}
          </span>
          {isMine ? (
            <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
              MY
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-500">
          <span>{getLibraryTypeLabel(lib.type)}</span>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <span>{lib.region}</span>
          {platform ? (
            <>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span className="inline-flex items-center gap-1">
                <PlatformDot p={platform} size={12} />
                {platform.name}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-[12.5px] font-semibold text-ink-700">
            {status === 'available'
              ? '대출 가능'
              : status === 'reserve'
                ? '예약 가능'
                : status === 'held'
                  ? '보유 / 대출중'
                  : '미보유'}
          </div>
          <div className="mt-0.5 text-[10.5px] text-ink-400">
            {isMine || !lib.authNeeded ? '바로 이용 가능' : '소속 인증 필요'}
          </div>
        </div>
        <div className="sm:hidden">
          <StatusBadge status={status} size="xs" />
        </div>
        <button
          type="button"
          disabled={!canOpen}
          className={`inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[12px] font-medium ${
            canOpen
              ? 'bg-ink-900 text-white hover:bg-ink-800'
              : 'cursor-not-allowed bg-ink-100 text-ink-400'
          }`}
        >
          {canOpen ? '바로가기' : isMine || !lib.authNeeded ? '미보유' : '인증'}
        </button>
      </div>
    </div>
  );
}

export default function LibraryAvailabilityList({
  book,
  libraries,
  myLibCodes,
  limit = null,
}: LibraryAvailabilityListProps) {
  const rows = buildLibraryAvailabilityRows(libraries, book.availableLibraries).sort(
    (left, right) => {
      const leftMine = myLibCodes.includes(left.lib.libCode) ? 0 : 1;
      const rightMine = myLibCodes.includes(right.lib.libCode) ? 0 : 1;

      if (leftMine !== rightMine) {
        return leftMine - rightMine;
      }

      const priority = { available: 0, reserve: 1, held: 2, none: 3 };
      return priority[left.status] - priority[right.status];
    }
  );

  const visibleRows = limit ? rows.slice(0, limit) : rows;
  const mineRows = visibleRows.filter((row) => myLibCodes.includes(row.lib.libCode));
  const otherRows = visibleRows.filter((row) => !myLibCodes.includes(row.lib.libCode));

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      {mineRows.length > 0 ? (
        <>
          <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              <span className="text-[11.5px] font-semibold tracking-wide text-brand-700">
                내가 이용 가능한 도서관
              </span>
            </div>
            <span className="mono text-[10.5px] text-brand-700">{mineRows.length}곳</span>
          </div>
          {mineRows.map((row) => (
            <AvailabilityRow key={row.lib.libCode} {...row} myLibCodes={myLibCodes} />
          ))}
        </>
      ) : null}

      {otherRows.length > 0 ? (
        <>
          <div className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
              <span className="text-[11.5px] font-semibold tracking-wide text-ink-700">
                다른 전자도서관
              </span>
            </div>
            <span className="mono text-[10.5px] text-ink-500">{otherRows.length}곳</span>
          </div>
          {otherRows.map((row) => (
            <AvailabilityRow key={row.lib.libCode} {...row} myLibCodes={myLibCodes} />
          ))}
        </>
      ) : null}
    </div>
  );
}
