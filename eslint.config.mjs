import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Next 15.5.x의 eslint-config-next는 아직 legacy `extends` 형식을 내보낸다.
// ESLint 9 CLI에서 그대로 쓰려면 FlatCompat으로 flat config 형태로 변환해야 한다.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Next.js 기본 ignore 목록에 프로젝트에서 자주 생기는 산출물만 최소한으로 추가한다.
  // 이렇게 두면 `npm run lint`가 빌드 결과물이나 커버리지 파일을 다시 검사하지 않는다.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    '.claude/**',
    '.codex/**',
    'next-env.d.ts',
  ]),
]);
