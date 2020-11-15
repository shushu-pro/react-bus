/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const webpack = require('webpack')
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const rootPath = process.cwd()
function resolve (dir) {
  return path.resolve(rootPath, dir)
}

exports.initConfig = function initConfig (config) {
  const {
    mode = 'development',
    plugins = [],
    module = {},
    optimization,
    ...rest
  } = config

  const { rules } = module

  return {
    mode,
    resolve: {
      extensions: [ '.js', '.jsx', '.json' ], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
      alias: {
        '@': path.join(__dirname, '..', 'src'), // 在项目中使用@符号代替src路径，导入文件路径更方便
      },
    },

    entry: {
      app: './index',
    },

    output: {
      publicPath: '/',
      path: resolve('./dist'),
      filename: `js/[name].[${mode === 'production' ? 'contenthash' : 'hash'}].js`,

    },

    module: {
      rules: [

        {
          test: /\.(js|jsx)$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
          // exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
          include: resolve('./src'),
          loader: 'babel-loader', // loader的名称（必须）
        },


        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
            name: 'static/img/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.svg(\?.*)?$/,
          use: [ '@svgr/webpack', 'url-loader' ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
            name: 'static/fonts/[name].[hash:7].[ext]',
          },
        },
        ...rules,
      ],
    },

    // 提取公共模块，包括第三方库和自定义工具库等
    optimization: {
      // 找到chunk中共享的模块,取出来生成单独的chunk
      splitChunks: {
        chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
        cacheGroups: {
          vendors: { // 抽离第三方插件
            test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
            name: 'vendors',
            priority: -10, // 抽取优先级
          },
          utilCommon: { // 抽离自定义工具库
            name: 'common',
            minSize: 0, // 将引用模块分离成新代码文件的最小体积
            minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
            priority: -20,
          },
        },
      },
      // 为 webpack 运行时代码创建单独的chunk
      runtimeChunk: {
        name: 'manifest',
      },
      ...optimization,
    },

    plugins: [
      new HtmlWebpackPlugin({
        publicPath: '/',
        filename: resolve('./dist/index.html'), // html模板的生成路径
        template: './src/index.ejs', // html模板
        inject: true, // true：默认值，script标签位于html文件的 body 底部
        // hash: true, // 在打包的资源插入html会加上hash
        //  html 文件进行压缩
        minify: {
          removeComments: true, // 去注释
          collapseWhitespace: true, // 压缩空格
          removeAttributeQuotes: true, // 去除属性 标签的 引号  例如 <p id="test" /> 输出 <p id=test/>
        },
        mode,
      }),
      // new MonacoWebpackPlugin({
      //   languages: [ 'json', 'javascript', 'html', 'xml' ],
      // }),
      // new CleanWebpackPlugin(),
      ...plugins,
    ],

    ...rest,

  }
}
