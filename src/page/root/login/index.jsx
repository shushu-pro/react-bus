import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'

export default withRouter(login)

function login (props) {
  console.info({ props })
  console.info(props.location.query)
  console.info(props.location.search)
  return (
    <div className="page-login">
      page-login llll
    </div>
  )
}
