import { getMockPlatformById } from '@lib/mock/data';

import PlatformDot from './PlatformDot';

interface PlatformStackProps {
  platformIds: string[];
  max?: number;
  size?: number;
}

export default function PlatformStack({
  platformIds,
  max = 4,
  size = 22,
}: PlatformStackProps) {
  const ids = [...new Set(platformIds)];
  const visibleIds = ids.slice(0, max);
  const remainingCount = ids.length - visibleIds.length;

  return (
    <div className="flex items-center">
      {visibleIds.map((platformId, index) => {
        const platform = getMockPlatformById(platformId);

        if (!platform) {
          return null;
        }

        return (
          <div
            key={platform.id}
            className="rounded-full ring-2 ring-white"
            style={{ marginLeft: index === 0 ? 0 : -6, zIndex: 10 - index }}
          >
            <PlatformDot p={platform} size={size} />
          </div>
        );
      })}
      {remainingCount > 0 ? (
        <div className="mono ml-1 text-[11px] text-ink-500">+{remainingCount}</div>
      ) : null}
    </div>
  );
}
