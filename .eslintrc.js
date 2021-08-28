module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'airbnb-base',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'no-multi-assign': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
    'quote-props': ['error', 'consistent'],
    'func-names': 'off',
  },
};
