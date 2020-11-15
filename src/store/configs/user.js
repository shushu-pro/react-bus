export default {
  state: {
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    name: '磐石',
  },

  reducer: {
    setInfo (info) {
      return info
    },
  },

  effect: {
    async setInfo (payload, context) {
      context.dispatch('user.setInfo', payload)
    },
    async login (payload, context) {
      context.dispatch('user.setInfo', payload)
    },
    async logout () {
      console.info('logout')
    },
  },
}
