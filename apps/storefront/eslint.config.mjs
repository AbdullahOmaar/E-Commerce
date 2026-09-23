import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

const firebaseImports = ['firebase', 'firebase/*', '@angular/fire', '@angular/fire/*'];

export default tseslint.config(
  { ignores: ['dist/**', '.angular/**', 'coverage/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: [
      'src/app/features/**/ui/**/*.ts',
      'src/app/layouts/**/*.ts',
      'src/app/shared/components/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: firebaseImports,
              message: 'Presentation must use a domain contract, never a Firebase SDK.',
            },
            {
              group: ['**/data-access/**'],
              message: 'Presentation must use a domain contract, never a concrete adapter.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/features/**/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [...firebaseImports, '**/data-access/**'],
              message: 'Domain contracts must not depend on their storage adapters.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
