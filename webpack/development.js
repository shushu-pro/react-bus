const path = require('path');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const base = require('./base');

const cwd = process.cwd();
const resolve = (dir) => path.resolve(cwd, dir);

module.exports = base.extends({
  devServer: {
    contentBase: [ './dist', './cdn' ],
    progress: true,
    hot: true,
    inline: true,
    // hotOnly: true,
    open: true,
    clientLogLevel: 'error', // none, warn, error, info
    before (app) {
      app.get('/favicon.ico', (req, res) => {
        res.end();
        // res.json({ custom: 'response' });
      });
    },
    historyApiFallback: true,
    proxy: {
      // port: 80,
      '/openapi/': {
        target: 'http://localhost:444/', // 开发环境
        changeOrigin: true,
        pathRewrite: {
          '/openapi/': '/openapi/',
        },
      },
      '/mockapi/': {
        target: 'http://localhost:444/', // 开发环境
        changeOrigin: true,
        pathRewrite: {
          '/mockapi/': '/mockapi/',
        },
      },
    },
  },
  devtool: 'eval-source-map',
  externals: {
    lodash: '_',
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    'monaco-editor': 'monaco',
    '@ant-design/icons': 'icons',
  },
  CDN: [
    'lodash@4.17.20/lodash.js',
    'react@17.0.1/react.development.js',
    'react-dom@17.0.1/react-dom.development.js',
    'antd@4.8.3/antd.js',
    'antd@4.8.3/antd.css',
    'ant-design-icons@4.2.2/index.umd.js',

    'monaco-editor@0.21.2/min/vs/loader.js',
    'monaco-editor@0.21.2/config.js',
    'monaco-editor@0.21.2/min/vs/editor/editor.main.nls.js',
    'monaco-editor@0.21.2/min/vs/editor/editor.main.js',
    // 'monaco-editor@0.21.2/min/vs/language/json/jsonMode.js',
    // 'monaco-editor@0.21.2/min/vs/basic-languages/javascript/javascript.js',

  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        // exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
        include: resolve('src'),
        loader: 'babel-loader', // loader的名称（必须）
        options: {
          presets: [
            [ '@babel/preset-env', {
              useBuiltIns: 'entry', // or "usage"
              corejs: 3,
            } ],
            '@babel/preset-react',
          ],
          plugins: [
            // [ 'import', { libraryName: 'antd', style: true } ],
            'lodash',
          ],
        },
      },
      {
        test: /\.css$/,
        exclude: [ /node_modules/ ],
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader', // 转换css
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: [ /node_modules/ ],
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader', // 转换css
            options: {
              modules: false,
            },
          },
        ],
      },

      // 业务代码，less开启modules
      {
        test: /\.less$/,
        exclude: [ /node_modules/ ],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
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

      // 第三方库。关闭modules
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
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
    // new HardSourceWebpackPlugin(),
    // new MonacoWebpackPlugin({
    //   languages: [ 'json', 'javascript', 'html', 'xml' ],
    // }),
  ],
});
