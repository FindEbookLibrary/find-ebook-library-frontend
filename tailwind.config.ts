import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: '#15171C',
          800: '#23262E',
          700: '#3A3F4B',
          600: '#5A6072',
          500: '#7B8194',
          400: '#A0A6B6',
          300: '#C7CCD8',
          200: '#E3E6EE',
          100: '#EFF1F6',
          50: '#F6F7FB',
        },
        paper: {
          DEFAULT: '#FAFAF7',
          card: '#FFFFFF',
          tint: '#F4F2EC',
        },
        brand: {
          50: '#EEF0FA',
          100: '#DCE0F4',
          200: '#B4BCE6',
          300: '#8B96D6',
          400: '#5E6CC2',
          500: '#3B4AAE',
          600: '#2B3A8C',
          700: '#22306F',
          800: '#1A2557',
          900: '#131B40',
        },
        accent: {
          ok: '#1F8A60',
          okBg: '#E5F3EC',
          warn: '#B7791F',
          warnBg: '#FBF1DD',
          err: '#B23A3A',
          errBg: '#F7E2E2',
          info: '#3B6EAE',
          infoBg: '#E3ECF7',
        },
      },
      boxShadow: {
        card: '0 1px 0 rgba(20,24,40,0.04), 0 1px 2px rgba(20,24,40,0.04)',
        cardHover: '0 4px 16px rgba(20,24,40,0.08)',
        pop: '0 12px 40px rgba(20,24,40,0.18)',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
};

export default config;
