import React from 'react';
import { Card, Tabs } from 'antd';
// import Mod1 from './mod1';
// import Mod2 from './mod2';
import Module from './module';
import Role from './role';

export default managePermission;

function managePermission () {
  return (
    <>
      <Tabs style={{ margin: '20px' }}>
        <Tabs.TabPane tab="角色管理" key="role">
          <Role />
        </Tabs.TabPane>
        <Tabs.TabPane tab="模块管理" key="module">
          <Module />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
