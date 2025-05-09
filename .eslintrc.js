module.exports = {
    env: {
        es2020: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Integrates with Prettier for formatting
    ],
    rules: {
        'no-console': 'warn', // Warns against console.log
        'no-unused-vars': 'off', // Turned off in favor of TypeScript's unused variables check
        '@typescript-eslint/no-unused-vars': ['warn'], // Warns about unused variables
        'prettier/prettier': 'warn', // Ensures Prettier rules
    },
};
