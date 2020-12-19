// 接口反向代理配置项

module.exports = {

  // mock环境
  '/mockapi/': {
    target: 'http://location/',
    changeOrigin: true,
    pathRewrite: {
      '/mockapi/': '/panshi/mockapi/2/',
    },
  },
};
