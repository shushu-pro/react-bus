

export default {
  login: {
    method: 'post',
    url: 'user/login',
  },

  info: {
    url: 'user/info',
  },

  list: {
    url: 'user/list',
  },

  role: {
    list: {
      url: 'user/role/list',
    },
  },

  favorite: {
    api: {
      enabled: {
        url: 'user/favorite/api/enabled',
      },
      add: {
        method: 'post',
        url: 'user/favorite/api/add',
      },
      remove: {
        method: 'post',
        url: 'user/favorite/api/remove',
      },
    },
  },

  message: {
    api: {
      list: {
        url: 'user/message/api/list',
      },
      delete: {
        method: 'post',
        url: 'user/message/api/delete',
      },
    },
  },
};
