import * as redux from 'redux'

import * as reactRedux from 'react-redux'

const { createStore: reduxCreateStore, combineReducers: reduxCombineReducers } = redux
const { connect: reduxConnect } = reactRedux

const reducers = {}
const effects = {}

function createStore (configs) {
  const keys = Object.keys(configs)
  keys.forEach((key) => {
    const config = configs[key]
    const { reducer } = config
    effects[key] = config.effect
    reducers[key] = (state = config.state || {}, { type, payload }) => {
      const [ modKey, actionType ] = type.split('.')
      if (modKey !== key || !reducer[actionType]) {
        return state
      }
      // console.info({ actionType, payload })
      return { ...state, ...reducer[actionType](state, payload) }
    }
  })

  return reduxCreateStore(reduxCombineReducers(reducers))
}

function connect (mapStateToProps, mapDispatchToProps) {
  return reduxConnect(mapStateToProps, (dispatch, ownProps) => mapDispatchToProps((type, payload) => {
    dispatch(typeof type === 'object' ? type : { type, payload })
  }, ownProps))
}

export {
  createStore,
  connect,
}

export default {}
