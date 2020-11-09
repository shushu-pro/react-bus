import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'

export default withRouter(login)

function login (props) {
  useEffect(() => {
    console.info('login.mouted')
  }, [])

  return (
    <div className="page-login">
      page-login llll
    </div>
  )
}
