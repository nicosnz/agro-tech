import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import fsd from '@conarti/eslint-plugin-feature-sliced'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { '@conarti/feature-sliced': fsd },
    rules: {
      '@conarti/feature-sliced/layers-slices': 'error',
      '@conarti/feature-sliced/absolute-relative': 'error',
      '@conarti/feature-sliced/public-api': 'error',
    },
  },
])
