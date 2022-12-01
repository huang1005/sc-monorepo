module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    NodeJS: true,
    defineOptions: true,
    __DEV__: true,
    __NAME__: true,
    // admin
    AppRouteRecordRaw: true,
    AppCustomRouteRecordRaw: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json', // 自动引入后需要绕过eslint
    './.eslintrc-vue-types.json',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/multi-word-component-names': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
      env: {
        'vue/setup-compiler-macros': true,
      },
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
