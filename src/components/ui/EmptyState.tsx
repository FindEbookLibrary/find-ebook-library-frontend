import type { ReactNode } from 'react';

import { IconBook } from './Icons';

interface EmptyStateProps {
  title: string;
  sub?: string;
  icon?: ReactNode;
}

export default function EmptyState({ title, sub, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        {icon ?? <IconBook size={22} />}
      </div>
      <div className="font-semibold text-ink-800">{title}</div>
      {sub ? <div className="mt-1 max-w-sm text-[13px] text-ink-500">{sub}</div> : null}
    </div>
  );
}
