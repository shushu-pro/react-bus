
import { Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default BlankLayout;


function BlankLayout (props) {
  return (
    <div className="BlankLayout">
      <Space style={{ margin: '10px' }}>
        <Link to="/home">首页</Link>
        <Link to="/login">登录</Link>
        <Link to="/user/center">用户中心</Link>
        <Link to="/user/center/projects">项目管理</Link>
        <Link to="/editor">编辑器</Link>
      </Space>

      {props.children}
    </div>
  );
}
