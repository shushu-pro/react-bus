export default {
  list: {
    url: 'app/list',
  },
  detail: {
    url: 'app/detail',
  },
  create: {
    method: 'post',
    url: 'app/create',
  },

  modify: {
    method: 'post',
    url: 'app/modify',
  },

  delete: {
    method: 'post',
    url: 'app/delete',
  },

  member: {
    list: {
      url: 'app/member/list',
    },

    add: {
      method: 'post',
      url: 'app/member/add',
    },

    remove: {
      method: 'post',
      url: 'app/member/remove',
    },

  },
};
