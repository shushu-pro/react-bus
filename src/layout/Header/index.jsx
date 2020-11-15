import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip, Space } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import styles from './index.less'
import Logo from './img/logo.svg'
import Message from './component/Message'
import Help from './component/Help'
import Avatar from './component/Avatar'

export default Header

const timer = null

function Header () {
  return (
    <div className={styles.Header}>
      {renderLogo()}
      {renderRight()}
    </div>
  )

  function renderLogo () {
    return (
      <h1 className={styles.logo}>
        <Link to="/">
          <img src={Logo} alt="logo" />
          磐石
        </Link>
      </h1>
    )
  }

  function renderRight () {
    return (
      <Space className={styles.right}>
        <Help />
        <Message />
        <Avatar />
      </Space>
    )
  }

  // function renderNavBar () {
  //   const [ menuKey, menuKeySet ] = useState('user-manage')
  //   return (
  //     <Menu className="navBar" onClick={onMenuClick} selectedKeys={[ menuKey ]} mode="horizontal">
  //       <Menu.Item key="user-manage" icon={<DropboxOutlined />}>
  //         <Link to="/user-manage">用户管理</Link>
  //       </Menu.Item>
  //       <Menu.Item key="permission-manage" icon={<DropboxOutlined />}>
  //         <Link to="/permission-manage">权限管理</Link>
  //       </Menu.Item>
  //       <Menu.Item key="menu3" icon={<DropboxOutlined />}>
  //         <Link to="/permission-manage">应用管理</Link>
  //       </Menu.Item>
  //       <Menu.Item key="menu3" icon={<DropboxOutlined />}>
  //         <Link to="/permission-manage">系统设置</Link>
  //       </Menu.Item>
  //       <Menu.Item key="menu3" icon={<DropboxOutlined />}>
  //         <Link to="/permission-manage">用户设置</Link>
  //       </Menu.Item>
  //     </Menu>
  //   )

  //   function onMenuClick ({ key }) {
  //     if (key === menuKey) {
  //       return
  //     }
  //     menuKeySet(key)
  //   }
  // }

  // function renderSearchBox () {
  //   const { params: { projectId, apiId } } = useRouteMatch()
  //   if (!projectId) {
  //     return null
  //   }
  //   const history = useHistory()
  //   const [ apiList, apiListSet ] = useState([])

  //   return (
  //     <div className="searchBox">
  //       <Select
  //         showSearch
  //         allowClear
  //         showArrow={false}
  //         filterOption={false}
  //         defaultActiveFirstOption={false}
  //         placeholder="输入内容进行接口搜索"
  //         onSearch={onSearch}
  //         onChange={onChange}
  //       >
  //         {apiList.map(({ id, name }) => (
  //           <Select.Option key={id} value={id}>
  //             {name}
  //           </Select.Option>
  //         ))}
  //       </Select>
  //     </div>
  //   )

  //   function onSearch (value) {
  //     if (!value) {
  //       return apiListSet([])
  //     }
  //     clearTimeout(timer)
  //     timer = setTimeout(() => {
  //       api.user.searchAPI({ projectId, value }).then((list) => {
  //         apiListSet(list)
  //       })
  //     }, 100)
  //   }

  //   function onChange (apiIdNext) {
  //     if (!apiIdNext || apiIdNext === apiId) {
  //       return
  //     }
  //     history.push(`/project/${projectId}/api/${apiIdNext}`)
  //   }
  // }
}
