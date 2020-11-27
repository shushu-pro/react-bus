

export default {
  login: {
    method: 'post',
    url: 'user/login',
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
};
