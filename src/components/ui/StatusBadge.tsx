import { AvailStatus } from '@/types/book.types';

type BadgeStatus = AvailStatus | 'auth' | 'mine';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'xs' | 'sm';
}

const STATUS_MAP: Record<
  BadgeStatus,
  { label: string; background: string; text: string; dot: string }
> = {
  available: {
    label: '대출 가능',
    background: 'bg-accent-okBg',
    text: 'text-accent-ok',
    dot: 'bg-accent-ok',
  },
  reserve: {
    label: '예약 가능',
    background: 'bg-accent-warnBg',
    text: 'text-accent-warn',
    dot: 'bg-accent-warn',
  },
  held: {
    label: '보유중',
    background: 'bg-accent-infoBg',
    text: 'text-accent-info',
    dot: 'bg-accent-info',
  },
  none: {
    label: '이용 불가',
    background: 'bg-ink-100',
    text: 'text-ink-500',
    dot: 'bg-ink-400',
  },
  auth: {
    label: '소속 인증 필요',
    background: 'bg-accent-errBg',
    text: 'text-accent-err',
    dot: 'bg-accent-err',
  },
  mine: {
    label: '내 도서관',
    background: 'bg-brand-50',
    text: 'text-brand-700',
    dot: 'bg-brand-600',
  },
};

export default function StatusBadge({
  status,
  size = 'sm',
}: StatusBadgeProps) {
  const current = STATUS_MAP[status];
  const sizeClass =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[10.5px]'
      : 'px-2 py-0.5 text-[11.5px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${current.background} ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
