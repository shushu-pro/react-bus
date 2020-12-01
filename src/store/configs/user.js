import { api } from '@/api';

export default {
  state: {
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: '张三',
    auths: [],
  },

  reducer: {
    setAuths (state, auths) {
      return { auths };
    },
    setInfo (state, payload) {
      console.info({ payload });
      return { ...payload };
    },
  },

  effect: {
    async getAuths (params, ctx) {
      return api.user.auths(params)
        .then(({ list }) => {
          ctx.dispatch('user.setAuths', list);
        });
    },
    // async setInfo (payload, context) {
    //   context.dispatch('user.setInfo', payload);
    // },
    async login (payload, context) {
      api.user.login().then((data) => {
        context.dispatch('user.setInfo', payload);
      });
    },
    async logout () {
      console.info('logout');
    },

    async fetch (payload, ctx) {
      return api.user.info()
        .then(({ auths, info: { user, nick } }) => {
          ctx.dispatch('user.setInfo', { auths, user, nick });
        });
    },
  },
};
