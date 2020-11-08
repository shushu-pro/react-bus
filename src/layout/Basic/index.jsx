
import React from 'react'
import { Switch, Route } from 'react-router-dom'

function BasicLayout () {
  return (
    <div className="BasicLayout">

      <Switch>
        <Route to="aaa" />
      </Switch>

    </div>
  )
}

export default BasicLayout
