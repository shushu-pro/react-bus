
import { createStore } from 'redux'

export default createStore((state = { count: 0 }, action) => {
  const { count } = state
  switch (action.type) {
    case 'increase':
      return { count: count + 1 }
    case 'setCount':
      return { count: action.count }
    default:
      return state
  }
})
