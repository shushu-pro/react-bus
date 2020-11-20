import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Router from '@/router';
import withState from './store';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
const App = withState(() => (
  <ConfigProvider locale={zhCN}>
    <Router />
  </ConfigProvider>
));

export default function render () {
  ReactDom.render(<App />, document.getElementById('app'));
}
