import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Dropdown, List, Spin, Tabs } from 'antd';

import { BellOutlined } from '@ant-design/icons';
import HeaderStyles from '../../index.less';
import styles from './index.less';

export default Message;

function Message () {
  const [ visible, visibleSet ] = useState(false);
  const [ messageList, messageListSet ] = useState([]);
  return (
    <div className={HeaderStyles.action}>
      <Dropdown overlay={<Overlay />} placement="bottomCenter" visible={visible} onVisibleChange={onVisibleChange}>
        <Badge
          count={2}
          style={{
            boxShadow: 'none',
          }}
        >
          <BellOutlined />
        </Badge>
      </Dropdown>
    </div>
  );

  function Overlay () {
    const [ loading, loadingSet ] = useState(false);
    return (
      <div className={styles.dropbox}>
        <Spin spinning={loading} delay={300}>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="通知" key="1">
              <List className={styles.list}>

                {messageList.length > 0 ? (
                  messageList.map(({ id, path, text }) => (
                    <List.Item key={id}>
                      <Link to={path}>{text}</Link>
                    </List.Item>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '8px' }}>暂无信息...</div>
                )}
              </List>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }

  function onVisibleChange (visible) {
    visibleSet(visible);
    if (visible) {
      messageListSet([
        { id: '1', path: '/prject/1/api/1', text: 'API1已更新' },
        { id: '2', path: '/prject/1/api/2', text: 'API2已更新' },
        { id: '3', path: '/prject/1/api/3', text: 'API3已更新' },
      ]);
    }
  }
}
