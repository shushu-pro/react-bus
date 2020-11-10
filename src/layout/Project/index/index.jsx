// 项目页布局

import React from 'react'
import { Layout } from 'antd'
import LayoutHeader from '@/layout/Header'
import ProjectSideBar from '../Sidebar'
import './index.less'

export default function ProjectLayout (props) {
  const { children } = props
  return (
    <Layout className="ProjectLayout">
      <LayoutHeader />
      <Layout>
        <ProjectSideBar />
        <Layout className="ProjectContent">
          {children}
        </Layout>
      </Layout>
    </Layout>
  )
}
