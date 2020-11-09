import React from 'react'
import { BrowserRouter, Redirect, Route, Switch, Link, withRouter } from 'react-router-dom'
import router from '@/router'

import Home from '@/page/root/home'
import Login from '@/page/root/login'
import Project from '@/page/project'
import ApiDetail from '@/page/api-detail'
import BlankLaout from './Blank'
import ProjectLayout from './Project'

export default layout

function layout () {
  const routes = router.routes()
  return (
    <BrowserRouter>
      <ul>
        <li> <Link to="/">home</Link></li>
        <li> <Link to="/login?a=12">login</Link></li>
        <li> <Link to="/project/1?a=12">project</Link></li>
        <li> <Link to="/project/1/api/2">apiDetail</Link></li>
      </ul>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>

        <Route exact path="/home">
          <BlankLaout>
            <Home />
          </BlankLaout>
        </Route>

        <Route exact path="/login">
          <BlankLaout>
            <Login />
          </BlankLaout>
        </Route>

        <Route path="/project">
          <ProjectLayout>
            <Switch>
              <Route exact path="/project/:projectId">
                <Project />
              </Route>
              <Route exact path="/project/:projectId/api/:apiId">
                <ApiDetail />
              </Route>
              <Route>
                Page404
              </Route>
            </Switch>
          </ProjectLayout>
        </Route>


      </Switch>


      {/* {
        routes.map((route, i) => (
          <Route key={i}>
            xxx:
            {route.path}
            {i}
          </Route>
        ))
      } */}
    </BrowserRouter>
  )
}
