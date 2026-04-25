import { Platform } from '@/types/library.types';

interface PlatformDotProps {
  p: Platform;
  size?: number;
}

export default function PlatformDot({ p, size = 22 }: PlatformDotProps) {
  return (
    <div
      className="mono flex items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: p.tone,
        fontSize: size * 0.36,
      }}
      title={p.name}
    >
      {p.short}
    </div>
  );
}
