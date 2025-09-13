import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',                  // use fs/path for data validation
    include: ['src/tests/**/*.test.ts'],
    globals: false,
    passWithNoTests: false,
  },
});