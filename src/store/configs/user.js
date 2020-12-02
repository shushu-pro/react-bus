import { api } from '@/api';

export default {
  state: {
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: '张三',
    auths: [],
    hasLogin: false,
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

    // 密码登录
    async login (payload, context) {
      api.user.login(payload).then(({ auths, info: { user, nick } }) => {
        context.dispatch('user.setInfo', {
          auths, user, nick, hasLogin: true,
        });
      });
    },

    // 刷新自动登录
    async autoLogin (nil, ctx) {
      return api.user.info()
        .then(({ auths, info: { user, nick } }) => {
          ctx.dispatch('user.setInfo', { auths, user, nick, hasLogin: true });
        });
    },

    // 退出登录
    async logout (nil, ctx) {
      return api.user.logout()
        .then(() => {
          ctx.dispatch('user.setInfo', { hasLogin: false });
        });
    },

  },
};
