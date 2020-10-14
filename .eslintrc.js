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
  },
}
