import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary:
    'border border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:text-brand-700',
  ghost: 'text-ink-700 hover:bg-ink-100',
  quiet: 'bg-ink-50 text-ink-800 hover:bg-ink-100',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
};

const SIZE_CLASS: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 rounded-lg px-3 text-[12.5px]',
  md: 'h-10 rounded-lg px-4 text-[13.5px]',
  lg: 'h-12 rounded-xl px-5 text-[14.5px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {children}
    </button>
  );
}
