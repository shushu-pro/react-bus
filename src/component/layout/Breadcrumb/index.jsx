import React from 'react'
import { Breadcrumb } from 'antd'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'

import styles from './index.less'

export default LayoutBreadcrumb

function LayoutBreadcrumb ({ type }) {
  return (
    <Breadcrumb className={styles.Breadcrumb}>
      <Breadcrumb.Item>
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <UserOutlined />
        <span>用户中心</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>应用详情</Breadcrumb.Item>
    </Breadcrumb>
  )
}
