module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:aspida/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'aspida'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'camelcase': [
      'error',
      {
        'properties': 'always',
      },
    ],
    'quotes': [
      'error',
      'single',
      'avoid-escape',
    ],
    'key-spacing': [
      'error',
      {
        'singleLine': {
          'beforeColon': false,
          'afterColon': true,
        },
        'multiLine': {
          'beforeColon': false,
          'afterColon': true,
        },
      },
    ],
    // "no-magic-numbers": [
    //   "error",
    //   {
    //     "ignoreArrayIndexes": true
    //   }
    // ],
    'eqeqeq': 'error',
    'block-scoped-var': 'error',
    'complexity': [
      'error',
      {
        'maximum': 20,
      },
    ],
    'curly': 'error',
    'default-case': 'error',
    'dot-location': [
      'error',
      'property',
    ],
    'guard-for-in': 'error',
    'no-eval': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true,
      },
    ],
    'id-length': [
      'error',
      {
        'min': 2,
        'properties': 'never',
        'exceptions': [
          '$',
          'e',
          '_',
        ],
      },
    ],
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'space-before-function-paren': [
      'error',
      'never',
    ],
    'space-before-blocks': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'arrow-body-style': 'off',
    'arrow-spacing': 'error',
    'strict': [
      'error',
    ],
    'no-warning-comments': [
      'warn',
      {
        'terms': [
          'todo',
          'fixme',
          'hack',
        ],
        'location': 'anywhere',
      },
    ],
    'semi': [
      'error',
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'extendDefaults': true,
        'types': {
          '{}': false,
        },
      },
    ],
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { '@typescript-eslint/no-var-requires': ['off'] },
    },
  ],
};
