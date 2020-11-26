import React from 'react';
import { Tabs } from 'antd';
import { useRoute } from '@/router';
import Info from './Info';
import Member from './Member';
import Api from './Api';

export default app;

function app () {
  const { query: { id: projectId } } = useRoute();

  return (
    <>
      <Tabs style={{ margin: '20px' }}>
        <Tabs.TabPane tab="基础信息" key="info">
          <Info projectId={projectId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="用户管理" key="member">
          <Member />
        </Tabs.TabPane>
        <Tabs.TabPane tab="接口管理" key="api">
          <Api />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
