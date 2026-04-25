interface CoverageBarProps {
  mineCount: number;
  ownedCount: number;
  totalLibs: number;
}

export default function CoverageBar({
  mineCount,
  ownedCount,
  totalLibs,
}: CoverageBarProps) {
  const minePercentage = totalLibs > 0 ? (mineCount / totalLibs) * 100 : 0;
  const ownedPercentage = totalLibs > 0 ? (ownedCount / totalLibs) * 100 : 0;

  return (
    <div className="relative h-1.5 overflow-hidden rounded-full bg-ink-100">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-ink-300"
        style={{ width: `${ownedPercentage}%` }}
      />
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-brand-600"
        style={{ width: `${minePercentage}%` }}
      />
    </div>
  );
}
