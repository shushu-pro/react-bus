import React from 'react'
import ReactDom from 'react-dom'
import { Button, message } from 'antd'
// import 'antd/dist/antd.less'
import './index.less'
import { Route, BrowserRouter, Link, Switch } from 'react-router-dom'
import imgS2 from './assets/s2.png'
import Hm from './hm'
import withState from './store'

function App () {
  return (

    <div className="green" style={{ color: '#333', fontSize: '36px' }}>
      iii是顶顶顶接口可看看解决酷酷酷
      <Hm />
      <img src={imgS2} alt="" />
      <Button type="primary" onClick={() => { message.info('hhh') }}>66jjjjj6</Button>
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/home">home</Link>
          </li>
          <li><Link to="/blog">blog</Link></li>
          <li><Link to="/resume">resume</Link></li>
          <li><Link to="/user">user</Link></li>
        </ul>
        <div>
          {/* Switch只显示一个组件。加exact表示精确匹配/。如果不加exact，/xxx也会匹配/。  */}
          <Switch>
            {/* exact */}
            <Route
              exact
              path="/home"
              component={(props) => (<div>home</div>)}
            />
            <Route exact path="/blog" component={() => (<div>blog</div>)} />
            <Route exact path="/resume" component={() => (<div>resume</div>)} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

const AppWithState = withState(App)


export default function render () {
  ReactDom.render(<AppWithState />, document.getElementById('app'))
}
