

export default {
  login: {
    method: 'post',
    url: 'user/login',
    mock2 () {
      return {
        code: 0,
        data: {},
      };
    },
  },

  logout: {
    method: 'post',
    url: 'user/logout',
  },

  info: {
    url: 'user/info',
    errorMessageIgnore: true,
  },

};
