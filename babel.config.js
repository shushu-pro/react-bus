module.exports = {
  presets: [
    [ '@babel/preset-env', {
      useBuiltIns: 'entry', // or "usage"
      corejs: 3,
    } ],
    '@babel/preset-react',
  ],
  plugins: [

    [ 'import', { libraryName: 'antd', style: true } ],
    'lodash',
  ],
}
