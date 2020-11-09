/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack')
const common = require('./common')
const manifest = require('../dll/vendor-manifest.json')

module.exports = common.initConfig({
  devServer: {
    contentBase: [ './dist', './dll' ],
    progress: true,
    hot: true,
    inline: true,
    // hotOnly: true,
    open: true,
    clientLogLevel: 'warn', // none, warn, error, info
    before (app) {
      app.get('/favicon.ico', (req, res) => {
        res.end()
        // res.json({ custom: 'response' });
      })
    },
    historyApiFallback: true,
    proxy: {
      // port: 80,
      '/openapi/': {
        target: 'http://localhost:666/', // 开发环境
        changeOrigin: true,
        // pathRewrite: {
        //   '^/panshi/openapi/': '/openapi/',
        // },
      },
      '/mockapi/': {
        target: 'http://localhost:666/', // 开发环境
        changeOrigin: true,
        // pathRewrite: {
        //   '^/panshi/mockapi/': '/mockapi/',
        // },
      },
    },
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader', // 转换css
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader', // 编译 Less -> CSS
            options: {
              lessOptions: {
                // modifyVars: { '@primary-color': '#1DA57A' },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      manifest,
    }),
  ],
})
