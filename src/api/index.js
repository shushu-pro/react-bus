import easyapi from '@shushu.pro/easyapi'
import adapter from '@shushu.pro/adapter'
import {
  message,
} from 'antd'

const api = easyapi({
  env: 'development',
  baseURL: '/openapi/',
  configs: {

    project: {
      alls: {
        url: 'project/list',
      },
      create: {
        method: 'post',
        url: 'project/create',
      },
      apisInfo: {
        url: 'api/list',
        responseData: {
          $strict: false,
          data: 'list',
        },
      },
      apisTree: {
        url: 'project/apis',
        responseData: {
          id: [ true, 'key' ],
          name: 'title',
          categoryId: 'parentId',
          $increase: {
            $key: 'isLeaf',
            $value: () => true,
          },
        },
      },
      detail: {
        url: 'project/detail',
      },
      modify: {
        method: 'post',
        url: 'project/modify',
      },
      categorys: {
        url: 'category/list',
        responseData: {
          id: [ true, 'key' ],
          name: 'title',
          parentId: true,
        },
      },
    },


    user: {
      favoriteProjects: {
        url: 'user/project/list',
      },
      addProjectFavorite: {
        method: 'post',
        url: 'user/favorite/project/add',
      },
      removeProjectFavorite: {
        method: 'post',
        url: 'user/favorite/project/remove',
      },
      searchAPI: {
        url: 'api/search',
      },
    },

    category: {
      move: {
        method: 'post',
        url: 'category/move',
      },
      create: {
        method: 'post',
        url: 'category/create',
      },
      modify: {
        method: 'post',
        url: 'category/modify',
      },
      delete: {
        method: 'post',
        url: 'category/delete',
      },
    },

    login: {
      method: 'post',
      url: 'login',
    },


    api: {
      create: {
        method: 'post',
        url: 'api/create',
      },
      modify: {
        method: 'post',
        url: 'api/modify',
      },
      delete: {
        method: 'post',
        url: 'api/delete',
        errorIgnore: false,
      },
      detail: {
        url: 'api/detail',
        responseData: {
          $strict: false,
          method: [ true, {
            $key: 'methodText',
            $enum: [ 'GET', 'POST' ],
          } ],
          mockReqDoc: {
            key: [ true, 'name' ],
            types: [ {
              $value: (value) => value.filter((item) => item !== 'null'),
            },
            {
              $key: 'required',
              $value: (value) => (value.includes('null') ? '否' : '是'),
            },
            ],
            $increase: {
              $key: 'defaultValue',
              $value: () => '-',
            },
            description: true,
          },
          mockResDoc: true,
        },
        mock2 (data) {
          return {
            code: 0,
            data: {
              apiId: data.apiId,
              name: '接口名称',
              path: 'jjhjhj',
              method: 0,
              methodText: 'GET',
            },
          }
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
    } = config.meta
    if (typeof request === 'function') {
      config.sendData = requestData(config.sendData)
    } else if (requestData && typeof requestData === 'object') {
      config.sendData = adapter(requestData, config.sendData)
    }
  },
  response (config) {
    // 二进制数据，直接返回
    if (config.responseObject.responseType === 'arraybuffer') {
      return
    }

    // 对响应的数据做处理
    const {
      data,
    } = config.responseObject
    const {
      code,
    } = data

    if (code === 1008) {
      throw Error('NO-LOGIN')
    }

    if (code !== 0) {
      throw Error(data.message)
    }
  },
  success (config) { // 正确响应处理器
    const {
      data,
    } = config.responseObject
    const {
      responseData,
    } = config.meta
    // 响应数据转化
    if (data.data) {
      const bizData = data.data
      if (typeof responseData === 'function') {
        data.data = responseData(bizData)
      } else if (responseData && typeof responseData === 'object') {
        data.data = adapter(responseData, bizData)
      }
    }
  },
  failure (config) { // 错误响应处理器
    if (config.meta.preventDefaultError) {
      return
    }

    if (config.error.message === 'NO-LOGIN') {
      return window.alert('登录失效')
    }
    if (!config.meta.errorMessageIgnore) {
      message.error(config.error.message)
    }
  },
})
const mockapi = easyapi({
  baseURL: '/mockapi/',
  configs: {
    send: {
      url: '',
    },
  },
  resolve: (responseObject) => responseObject.data,
  request (data, config) {

  },
})

export {
  api,
  mockapi,
}
