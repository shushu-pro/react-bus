import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Space, Menu } from 'antd';
import { QuestionCircleOutlined, DropboxOutlined } from '@ant-design/icons';
import { useRoute } from '@/router';
import styles from './index.less';
import Logo from './img/logo.svg';
import Message from './component/Message';
import Help from './component/Help';
import Avatar from './component/Avatar';

export default Header;

const timer = null;

function Header () {
  return (
    <div className={styles.Header}>
      {renderLogo()}
      {renderNavBar()}
      {renderRight()}
    </div>
  );

  function renderLogo () {
    return (
      <h1 className={styles.logo}>
        <Link to="/">
          <img src={Logo} alt="logo" />
          @=666=@
        </Link>
      </h1>
    );
  }

  function renderRight () {
    return (
      <Space className={styles.right}>
        <Help />
        <Message />
        <Avatar />
      </Space>
    );
  }

  function renderNavBar () {
    const menuKey = useRoute().path;
    console.info({ route: useRoute() });

    useEffect(() => {
      console.info('renderNavBar.mouted');
    }, [ ]);

    // console.info({ menuKey });
    return (
      <Menu className={styles.navBar} selectedKeys={[ menuKey ]} mode="horizontal">
        <Menu.Item key="/manage/user" icon={<QuestionCircleOutlined />}>
          <Link to="/manage/user">用户管理</Link>
        </Menu.Item>
        <Menu.Item key="/manage/permisstion" icon={<DropboxOutlined />}>
          <Link to="/manage/permisstion">权限管理</Link>
        </Menu.Item>
      </Menu>
    );
  }

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
