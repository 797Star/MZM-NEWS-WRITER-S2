import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'app.js'] }, // Added app.js to ignores
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).filter(([key]) => key.trim() === key)
        ),
        // If the above doesn't work because the key itself is stored with whitespace,
        // and we know the exact problematic key from the error:
        // ...Object.fromEntries(
        //   Object.entries(globals.browser)
        //     .filter(([key]) => key !== 'AudioWorkletGlobalScope ') // Filter out the problematic key
        // ),
        // For a more robust solution, we'd ensure no keys have leading/trailing whitespace.
        // The filter(([key]) => key.trim() === key) should handle all such cases.
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
