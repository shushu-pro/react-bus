// 项目页布局

import React from 'react'
import { Layout } from 'antd'

export default function ProjectLayout (props) {
  const { children } = props
  console.info({ children })
  return (
    <Layout className="layout-project">
      {children}
    </Layout>
  )
}
