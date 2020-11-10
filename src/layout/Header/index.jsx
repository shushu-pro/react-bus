import React, { useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Menu, Select } from 'antd'
import './index.less'
import { api } from '@/api'
import Logo from './img/logo.svg'

export default Header

let timer = null

function Header () {
  return (
    <div className="LayoutHeader">
      {renderLogo()}
      {renderNavBar()}
      {renderSearchBox()}
    </div>
  )

  function renderLogo () {
    return (
      <h1 className="logo">
        <Link to="/">
          <img src={Logo} alt="logo" />
          模板
        </Link>
      </h1>
    )
  }

  function renderNavBar () {
    const [ menuKey, menuKeySet ] = useState('menu1')
    return (
      <Menu className="navBar" onClick={onMenuClick} selectedKeys={[ menuKey ]} mode="horizontal">
        <Menu.Item key="menu1" icon={<span>@</span>}>
          <Link to="/project">菜单1</Link>
        </Menu.Item>
        <Menu.Item key="menu2" icon={<span>@</span>}>
          <Link to="/use-info">菜单2</Link>
        </Menu.Item>
        <Menu.Item key="menu3" icon={<span>@</span>}>
          菜单3
        </Menu.Item>
      </Menu>
    )

    function onMenuClick ({ key }) {
      if (key === menuKey) {
        return
      }
      menuKeySet(key)
    }
  }

  function renderSearchBox () {
    const { params: { projectId, apiId } } = useRouteMatch()
    if (!projectId) {
      return null
    }
    const history = useHistory()
    const [ apiList, apiListSet ] = useState([])

    return (
      <div className="searchBox">
        <Select
          showSearch
          allowClear
          showArrow={false}
          filterOption={false}
          defaultActiveFirstOption={false}
          placeholder="输入内容进行接口搜索"
          onSearch={onSearch}
          onChange={onChange}
        >
          {apiList.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </div>
    )

    function onSearch (value) {
      if (!value) {
        return apiListSet([])
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        api.user.searchAPI({ projectId, value }).then((list) => {
          apiListSet(list)
        })
      }, 100)
    }

    function onChange (apiIdNext) {
      if (!apiIdNext || apiIdNext === apiId) {
        return
      }
      history.push(`/project/${projectId}/api/${apiIdNext}`)
    }
  }
}
