

import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { SMTable } from '@/package/shanmao'
import { Button, Card } from 'antd'
import './index.less'
import { api } from '@/api'

export default project


function project () {
  return (
    <>
      {renderAPIList()}
    </>
  )

  // 渲染API列表
  function renderAPIList () {
    const { params: { projectId } } = useRouteMatch()
    const hookAPIList = {
      title: () => <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '6px' }}>接口列表</div>,
      bordered: false,
      scrollX: 880,
      columns: [
        [ '接口名称', 'name', {
          width: 240,
          render: (value, { id }) => (
            <Link to={`/project/${projectId}/api/${id}`}>{value}</Link>
          ),
        } ],
        [ '接口地址', 'path', {
          width: 400,
          render: (value, { method }) => (
            <div className={`icon-method-${method}`}>{value}</div>
          ),
        } ],
        [ '接口状态', 'status', { width: 120 } ],
        [ '更新时间', 'updateTime' ],
      ],
      dataSource (params) {
        return api.project.apisInfo({ ...params, projectId })
      },
    }
    return (
      <div className="apiList">
        <SMTable hook={hookAPIList} />
      </div>
    )
  }
}
