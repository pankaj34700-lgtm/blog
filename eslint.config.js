import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/data/blogs', '**/data/blogs/*', '@/data/blogs', '@/data/blogs/*'],
              message: 'Import listLatestBlogs from @/data/blogRepository instead of the dummy data module.',
            },
            {
              group: ['firebase/auth'],
              message: 'Use the AuthProvider and useAuth hook instead of importing firebase/auth directly.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/data/**/*.ts', 'src/lib/**/*.ts', 'tests/**/*.{ts,tsx}', 'e2e/**/*.ts', '*.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
