/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const cssnano = require('cssnano')
const common = require('./common')

const ASYS = process.env.ASYS === 1

module.exports = common.initConfig({
  mode: 'production',
  devtool: 'none',
  plugins: [
  // 开启 BundleAnalyzerPlugin
    ...(ASYS ? [ new BundleAnalyzerPlugin() ] : []),
    new MiniCssExtractPlugin({
      filename: '[name][contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: [ 'default', { discardComments: { removeAll: true } } ],
      },
      canPrint: true,
    }),
    new CleanWebpackPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.ProgressPlugin({
      // activeModules: true,
      // entries: true,
      // modules: true,
      // handler (percentage, message, ...args) {
      //   // custom logic
      // },
      // modulesCount: 5000,
      // profile: false,
      // dependencies: true,
      // dependenciesCount: 10000,
      // percentBy: null,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|less)$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: 'less-loader',
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

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },

})
