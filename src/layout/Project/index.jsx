// 项目页布局

import React from 'react'
import { Layout, Alert } from 'antd'

export default function ProjectLayout (props) {
  const { children } = props
  return (
    <Layout className="layout-project">
      <Alert message="PorjectLayout" />
      {children}
    </Layout>
  )
}
