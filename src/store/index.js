
import { createStore } from '@/package/dvax'


// 业务模块化

export default createStore({
  app: {
    state: {
      count: 1,
    },
    reducer: {
      increase ({ count }) {
        return { count: count + 1 }
      },
      setCount (nil, nextCount) {
        return { count: nextCount }
      },
    },
  },
  biz: {
    state: {
      count: 666,
    },
  },
})
