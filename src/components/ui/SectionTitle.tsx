import type { ReactNode } from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}

export default function SectionTitle({
  eyebrow,
  title,
  sub,
  action,
}: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <div className="mono mb-1 text-[11px] uppercase tracking-wider text-brand-600">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-[20px] font-bold tracking-tight text-ink-900 md:text-[22px]">
          {title}
        </h2>
        {sub ? <p className="mt-1 text-[13.5px] text-ink-600">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}
