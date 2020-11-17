module.exports = {
  root: true,
  extends: [
    '@shushu.pro/eslint-config-all/react',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    // browser: true,
    // node: true,
  },
  globals: {
    // 全局变量校验设置
    // jQuery: true,
    // myGlobal: false // 设置为false表示该值不能被重写
  },
  rules: {
    // 自定义规则
    // 自定义规则
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': [ 'off', {
      devDependencies: false,
      optionalDependencies: false,
      peerDependencies: false,
    } ],
    'no-multi-assign': 'off',
    'no-restricted-syntax': [ 'error', 'BinaryExpression[operator="in"]' ],
    camelcase: 'off',
    'no-shadow': 'warn',
    'react/jsx-curly-newline': 'off',
    'react/no-unescaped-entities': [ 'error', { forbid: [ '<', '>', '{', '}' ] } ],
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-use-before-define': [ 'error', { functions: false, classes: true, variables: true } ],
    // 'import/no-unresolved': [ 'error', { ignore: [ '^@/' ] } ],
    'max-len': [ 'warn', { code: 160 } ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          [ '@', './src' ],
        ],
        extensions: [ '.js', '.jsx', '.json ' ],
      },
    },
  },

}
