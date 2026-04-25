import type { ElementType, ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  as?: ElementType;
}

export default function Chip({
  children,
  active = false,
  onClick,
  as: Component = 'button',
}: ChipProps) {
  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700'
      }`}
    >
      {children}
    </Component>
  );
}
