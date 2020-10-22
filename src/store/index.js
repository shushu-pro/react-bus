
import { createStore, combineReducers } from 'redux'


// export default createStore((state = { count: 0 }, action) => {
//   const { count } = state
//   switch (action.type) {
//     case 'increase':
//       return { count: count + 1 }
//     case 'setCount':
//       return { count: action.count }
//     default:
//       return state
//   }
// })

function app (state = { count: 0 }, action) {
  const { count } = state
  switch (action.type) {
    case 'increase':
      return { count: count + 1 }
    case 'setCount':
      return { count: action.count }
    default:
      return state
  }
}

function biz (state = { name: 'xxx' }, action) {
  return state
}

export default createStore(
  combineReducers({
    app,
    biz,
  })
)

// 业务模块化


const appX = {
  state: {
    count: 0,
  },
  reducer: {
    increase (payload, prevState) {
      return {
        count: prevState.count + 1,
      }
    },
  },
  effect: {
    async doubleIncrease (payload, { reducer }) {
      reducer.increase()
      reducer.increase()
    },
  },
}

function meCreateStore (configs) {
  const initailState = {}
  const reducer = {}
  const keys = Object.keys(configs)
  keys.forEach((key) => {
    const config = configs[key]
    initailState[key] = config.state || {}
    reducer
  })

  return createStore(reducer, initailState)
}
