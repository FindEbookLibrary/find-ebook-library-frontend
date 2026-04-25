import path from 'node:path';

import { defineConfig } from 'vitest/config';

const resolveFromRoot = (...segments: string[]) => path.resolve(__dirname, ...segments);

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': resolveFromRoot('src'),
      '@app': resolveFromRoot('src/app'),
      '@components': resolveFromRoot('src/components'),
      '@hooks': resolveFromRoot('src/hooks'),
      '@lib': resolveFromRoot('src/lib'),
      '@stores': resolveFromRoot('src/stores'),
    },
  },
});
