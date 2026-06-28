const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const reactNativeConfig = require('@react-native/eslint-config/flat');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const jestPlugin = require('eslint-plugin-jest');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const typescriptFiles = ['**/*.{ts,tsx}'];

const validTypeScriptRules = new Set(Object.keys(typescriptPlugin.rules));

const sanitizeTypeScriptRules = rules =>
  Object.fromEntries(
    Object.entries(rules).filter(([ruleName]) => {
      if (!ruleName.startsWith('@typescript-eslint/')) {
        return true;
      }

      return validTypeScriptRules.has(
        ruleName.slice('@typescript-eslint/'.length),
      );
    }),
  );

const scopeToTypeScript = configs =>
  configs.map(config => {
    const { rules, ...rest } = config;
    const nextConfig = {
      ...rest,
      files: typescriptFiles,
    };

    if (rules) {
      nextConfig.rules = sanitizeTypeScriptRules(rules);
    }

    return nextConfig;
  });

const sharedRules = {
  'react/jsx-uses-react': 'error',
  'global-require': 0,
  'react-hooks/exhaustive-deps': 'warn',
  quotes: ['error', 'single'],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'react/require-default-props': 'off',
  'react/default-props-match-prop-types': ['error'],
  'react/sort-prop-types': ['error'],
  'react/no-array-index-key': 'off',
  'no-tabs': 'off',
  'no-void': 'off',
  'react/jsx-props-no-spreading': 'off',
  'import/prefer-default-export': 'off',
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  'import/no-unresolved': ['error', { ignore: ['^@env$'] }],
  'react/display-name': 'off',
  'no-console': ['error', { allow: ['error'] }],
  'import/order': [
    'warn',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
    },
  ],
  'react/function-component-definition': [
    2,
    {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    },
  ],
  'no-param-reassign': 'off',
};

const typeScriptOnlyRules = {
  '@typescript-eslint/no-use-before-define': [0],
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/no-shadow': 'off',
  '@typescript-eslint/no-unsafe-call': 'error',
};

module.exports = [
  {
    ignores: [
      'plugins/**/*',
      'metro.config.js',
      'babel.config.js',
      'jest.config.js',
      '.prettierrc.js',
      'eslint.config.js',
      'gesture-handler.js',
      'gesture-handler.native.js',
      'scripts/**',
    ],
  },
  ...reactNativeConfig,
  ...compat.extends(
    'airbnb',
    'eslint:recommended',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ),
  ...scopeToTypeScript(
    compat.extends(
      'airbnb-typescript',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ),
  ),
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {},
      },
      react: {
        version: '18.x',
      },
    },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    rules: sharedRules,
  },
  {
    files: typescriptFiles,
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    rules: typeScriptOnlyRules,
  },
];
