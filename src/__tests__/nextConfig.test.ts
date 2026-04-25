import { describe, expect, it } from 'vitest';

import packageJson from '../../package.json';
import nextConfig from '../../next.config';

type NextConfigShape = {
  experimental?: {
    turbo?: unknown;
  };
  turbopack?: Record<string, unknown>;
};

describe('Next.js build configuration', () => {
  it('deprecated experimental.turbo 대신 turbopack 설정을 사용한다', () => {
    const config = nextConfig as NextConfigShape;

    // Vercel 빌드 로그 경고를 다시 만들지 않도록 deprecated 설정이 없는지 확인한다.
    expect(config.experimental?.turbo).toBeUndefined();
    expect(config.turbopack).toBeDefined();
  });

  it('보안 패치된 Next.js 버전과 고정된 Node.js major를 사용한다', () => {
    // 배포 환경에서 예기치 않게 다른 major Node.js로 올라가지 않도록 명시적으로 고정한다.
    expect(packageJson.dependencies.next).toBe('15.5.15');
    expect(packageJson.dependencies.axios).toBe('1.15.0');
    expect(packageJson.devDependencies['eslint-config-next']).toBe('15.5.15');
    expect(packageJson.devDependencies['@eslint/eslintrc']).toBe('3.3.1');
    expect(packageJson.engines.node).toBe('22.x');
    expect(packageJson.overrides['follow-redirects']).toBe('1.16.0');
    expect(packageJson.overrides.postcss).toBe('8.5.10');
  });
});
