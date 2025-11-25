import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import playwrightFixers from './eslint/plugins/playwright-fixers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...tseslint.configs.recommended,

  {
    plugins: {
      prettier,
      jsxA11y,
    },
    rules: {
      'prettier/prettier': 'error',
      // TS: 미사용 변수/인자는 오류, 단 '_' 접두는 허용
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  // JS/MJS(설정 파일 포함)에서도 미사용 변수 에러 처리
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      noUnusedVars: 'off',
      'no-unused-vars': 'error',
    },
  },
  // e2e 테스트 전용: 미사용 Playwright `request` 파라미터 자동 제거
  {
    files: ['e2e/**/*.spec.ts', 'e2e/**/*.test.ts'],
    plugins: {
      'playwright-fixers': playwrightFixers,
    },
    rules: {
      'playwright-fixers/remove-unused-request-param': 'error',
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
