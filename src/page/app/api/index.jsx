import React from 'react';
import { Tabs, Layout } from 'antd';
import { useRoute } from '@/router';
import Sidebar from '../Sidebar';
import ApiDetail from './ApiDetail';

export default app;

function app () {
  const { query: { appId, apiId } } = useRoute();
  return (
    <>
      <Layout>
        <Sidebar />
        <ApiDetail appId={appId} apiId={apiId} />
      </Layout>
    </>
  );
}
