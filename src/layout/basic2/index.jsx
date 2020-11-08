import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb, Select } from 'antd'
import { Link, withRouter, Switch, Route } from 'react-router-dom'
import Home from '@/page/home'
import project from '@/page/project'
import Logo from './img/logo.svg'
import './index.less'


const { Header, Content, Footer } = Layout
export default withRouter((props) => (
  <Layout className="layout">
    {renderHeader(props)}
    {renderContent(props)}
    {/* <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">Content</div>
    </Content> */}
    <Footer style={{ textAlign: 'center' }}>PANSHI ©2020 - Now Created by shushu.pro</Footer>
  </Layout>
))


function renderHeader (props) {
  const [ apiList, setApiList ] = useState([])
  return (
    <Header>
      <h1 className="logo">
        <Link to="/">
          <img src={Logo} alt="" width="32" height="32" />
          磐石
        </Link>
      </h1>

      <Menu className="menu" theme="light" mode="horizontal" defaultSelectedKeys={[ '2' ]}>
        <Menu.Item key="1">项目</Menu.Item>
        <Menu.Item key="2">信息管理</Menu.Item>
      </Menu>

      <div className="search-box">
        <Select
          showSearch
          options={apiList}
          placeholder="搜索接口"
          style={{ width: '200px' }}
          onSearch={onSearch}
        >
          ss
        </Select>
      </div>
    </Header>
  )

  function onSearch (value) {
    if (!value) {
      setApiList([])
    }

    console.info(props.match.query, props.match.params)
    // const { projectId } = this.$route.params
    // this.$api.searchAPI({ projectId, value }).then((list) => {
    //   this.searchList = list
    // })
  }
}

function renderContent (props) {
  return (
    <Content>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/project/:projectId" component={project} />
      </Switch>
    </Content>
  )
}
