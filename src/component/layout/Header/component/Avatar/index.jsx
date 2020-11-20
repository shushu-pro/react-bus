import React from 'react';
import { connect } from '@/package/haima';
import { Avatar, Dropdown, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

import HeaderStyles from '../../index.less';
import styles from './index.less';

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch('user.logout'),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAvatar);

function MyAvatar ({ user, logout }) {
  return (
    <div className={HeaderStyles.action}>
      <Dropdown overlay={<Overlay />}>
        <div>
          <Avatar size="small" className={styles.avatar} src={user.avatar} alt="avatar" />
          <span>{user.name}</span>
        </div>
      </Dropdown>
    </div>
  );

  function Overlay () {
    const history = useHistory();
    return (
      <div className={styles.dropMenu}>
        <Menu onClick={onMenuClick}>
          <Menu.Item key="center">  <UserOutlined /> 个人中心 </Menu.Item>
          <Menu.Item key="settings"> <SettingOutlined /> 个人设置 </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout"> <LogoutOutlined />退出登录 </Menu.Item>
        </Menu>
      </div>
    );

    function onMenuClick ({ key }) {
      if (key === 'logout') {
        return logout().then(() => {
          history.push('/login');
        });
      }

      history.push(`/user/${key}`);
    }
  }
}
