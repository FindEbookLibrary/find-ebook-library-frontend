import type { ReactNode, SVGProps } from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  sw?: number;
}

interface BaseIconProps extends IconProps {
  path?: string;
  fill?: SVGProps<SVGSVGElement>['fill'];
  children?: ReactNode;
}

/**
 * 대부분의 아이콘은 같은 stroke 규칙을 쓰므로, 공통 SVG 래퍼를 둡니다.
 * 개별 아이콘은 path만 바꿔서 정의하면 되게 단순화했습니다.
 */
function BaseIcon({
  path,
  size = 18,
  className,
  fill = 'none',
  sw = 1.6,
  children,
}: BaseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path ? <path d={path} /> : children}
    </svg>
  );
}

export const IconSearch = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </BaseIcon>
);
export const IconFilter = (props: IconProps) => <BaseIcon path="M3 5h18M6 12h12M10 19h4" {...props} />;
export const IconChevDown = (props: IconProps) => <BaseIcon path="M6 9l6 6 6-6" {...props} />;
export const IconChevRight = (props: IconProps) => <BaseIcon path="M9 6l6 6-6 6" {...props} />;
export const IconChevLeft = (props: IconProps) => <BaseIcon path="M15 6l-6 6 6 6" {...props} />;
export const IconClose = (props: IconProps) => <BaseIcon path="M6 6l12 12M18 6l-12 12" {...props} />;
export const IconCheck = (props: IconProps) => <BaseIcon path="M5 12.5L10 17 19 7" {...props} />;
export const IconBookmark = (props: IconProps) => <BaseIcon path="M7 4h10v17l-5-3.5L7 21V4z" {...props} />;
export const IconBookmarkFill = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 4h10v17l-5-3.5L7 21V4z" />
  </svg>
);
export const IconExternal = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </BaseIcon>
);
export const IconUser = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </BaseIcon>
);
export const IconBuilding = (props: IconProps) => (
  <BaseIcon {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
  </BaseIcon>
);
export const IconSchool = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 4l10 5-10 5L2 9l10-5z" />
    <path d="M6 11v5c0 2 3 4 6 4s6-2 6-4v-5" />
  </BaseIcon>
);
export const IconMap = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </BaseIcon>
);
export const IconBook = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 4h7a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
    <path d="M20 4h-7a3 3 0 0 0-3 3v13h7a3 3 0 0 0 3-3V4z" />
  </BaseIcon>
);
export const IconStar = (props: IconProps) => (
  <BaseIcon path="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.6l1.1-6.1L3.4 9.3l6-.8L12 3z" {...props} />
);
export const IconClock = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </BaseIcon>
);
export const IconCheckCircle = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l3 3 5-6" />
  </BaseIcon>
);
export const IconAlert = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v5M12 18v.01" />
  </BaseIcon>
);
export const IconLock = (props: IconProps) => (
  <BaseIcon {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </BaseIcon>
);
export const IconTrash = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </BaseIcon>
);
export const IconRefresh = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 12a8 8 0 0 1 14-5.3L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-14 5.3L4 16" />
    <path d="M4 20v-4h4" />
  </BaseIcon>
);
export const IconSparkle = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
  </BaseIcon>
);
export const IconArrowRight = (props: IconProps) => <BaseIcon path="M5 12h14M13 6l6 6-6 6" {...props} />;
export const IconBars = (props: IconProps) => <BaseIcon path="M4 6h16M4 12h16M4 18h16" {...props} />;
export const IconPlus = (props: IconProps) => <BaseIcon path="M12 5v14M5 12h14" {...props} />;
export const IconShield = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </BaseIcon>
);
