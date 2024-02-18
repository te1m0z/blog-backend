module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    //project: "./server/tsconfig.json",
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'max-len': [
      'warn',
      {
        code: 200,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'no-prototype-builtins': 'off',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
      },
    ],
    'no-console': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     checksVoidReturn: { attributes: false },
    //   },
    // ],
    '@typescript-eslint/consistent-type-imports': 'warn',
    //"@typescript-eslint/prefer-nullish-coalescing": "warn",
  },
}

