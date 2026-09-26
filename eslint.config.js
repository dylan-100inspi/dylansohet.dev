import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/', '.astro/'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['flat/jsx-a11y-recommended'],
  prettier,
];
