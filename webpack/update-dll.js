/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    vendor: [ 'react', 'react-dom', 'react-router-dom', 'antd', 'redux', 'react-redux', 'lodash' ],
  },
  output: {
    publicPath: '/',
    path: path.resolve('./dll'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dll', '[name]-manifest.json'),
      name: '[name]_library',
    }),
  ],
  module: {
    rules: [
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
                modifyVars: { '@primary-color': '#1DA57A' },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  devtool: 'none', // 'eval-source-map',
}
