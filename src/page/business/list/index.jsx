import React from 'react'
import { connect } from 'react-redux'
import { Provider } from './page-redux'
import store from './store'

function index (props) {
  return (
    <Provider store={store}>
      <div>
        List.page
        <mod1 />
      </div>
    </Provider>
  )
}

export default connect(null, null,)(index)
