import easyapi from '@shushu.pro/easyapi';
import adapter from '@shushu.pro/adapter';
import './adapter';
import {
  message,
} from 'antd';


const api = easyapi({
  env: 'development',
  baseURL: '/openapi/',
  configs: {

    user: {
      login: {
        url: 'login',
      },
      alls: {
        url: 'user/alls',
        responseData: {
          $strict: false,
          list: {
            createTime: '#time',
          },
        },
      },
      create: {
        method: 'post',
        url: 'user/create',
      },
      delete: {
        method: 'post',
        url: 'user/delete',
      },
      modify: {
        method: 'post',
        url: 'user/modify',
      },
      resetPassword: {
        method: 'post',
        url: 'user/resetPassword',
      },
      enabled: {
        method: 'post',
        url: 'user/enabled',
      },
    },

    module: {
      list: {
        url: 'module/list',
      },
      create: {
        method: 'post',
        url: 'module/create',
      },
      delete: {
        method: 'post',
        url: 'module/delete',
      },
      functionGroup: {
        list: {
          url: 'module/functionGroup/list',
        },
        create: {
          method: 'post',
          url: 'module/functionGroup/create',
        },
        delete: {
          method: 'post',
          url: 'module/functionGroup/delete',
        },

      },
      function: {
        list: {
          url: 'module/function/list',
        },
        create: {
          method: 'post',
          url: 'module/function/create',
        },
      },
    },

  },
  errorIgnore: true,
  resolve: (responseObject) => responseObject.data.data,
  request (config) {
    // 请求数据转化
    const {
      requestData,
    } = config.meta;
    if (typeof request === 'function') {
      config.sendData = requestData(config.sendData);
    } else if (requestData && typeof requestData === 'object') {
      config.sendData = adapter(requestData, config.sendData);
    }
  },
  response (config) {
    // 二进制数据，直接返回
    if (config.responseObject.responseType === 'arraybuffer') {
      return;
    }

    // 对响应的数据做处理
    const {
      data,
    } = config.responseObject;
    const {
      code,
    } = data;

    if (code === 1008) {
      throw Error('NO-LOGIN');
    }

    if (code !== 0) {
      throw Error(data.message);
    }
  },
  success (config) { // 正确响应处理器
    const {
      data,
    } = config.responseObject;
    const {
      responseData,
    } = config.meta;
    // 响应数据转化
    if (data.data) {
      const bizData = data.data;
      if (typeof responseData === 'function') {
        data.data = responseData(bizData);
      } else if (responseData && typeof responseData === 'object') {
        data.data = adapter(responseData, bizData);
      }
    }
  },
  failure (config) { // 错误响应处理器
    if (config.meta.preventDefaultError) {
      return;
    }

    if (config.error.message === 'NO-LOGIN') {
      return window.alert('登录失效');
    }
    if (!config.meta.errorMessageIgnore) {
      message.error(config.error.message);
    }
  },
});

export default { api };

export {
  api,
};
