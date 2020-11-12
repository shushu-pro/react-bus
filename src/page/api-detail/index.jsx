import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Spin } from 'antd'
import { api } from '@/api'
import tower from '@/package/tower'
import BaseInfo from './component/BaseInfo'
import RequestInfo from './component/RequestInfo'
import ResponseInfo from './component/ResponseInfo'
import './index.less'

export default apiDetail

function apiDetail () {
  const { params: { projectId, apiId } } = useRouteMatch()
  const [ loading, loadingSet ] = useState(false)
  const [ apiDetail, apiDetailSet ] = useState({})


  useEffect(() => {
    getAPIDetail()
  }, [ apiId ])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '200px 0' }}>
        <Spin tip="加载中..." />
      </div>
    )
  }

  return (
    <div className="page-apiDetail">
      <BaseInfo projectId={projectId} apiDetail={apiDetail} updateAPI={updateAPI} />
      <RequestInfo apiDetail={apiDetail} updateAPI={updateAPI} />
      <ResponseInfo apiDetail={apiDetail} updateAPI={updateAPI} />
    </div>
  )

  function getAPIDetail () {
    loadingSet(true)
    api.api
      .detail({ apiId }, { logger: true })
      .then((data) => {
        apiDetailSet(data)
      })
      .finally(() => {
        loadingSet(false)
      })
  }

  function updateAPI (API_UPDATE) {
    if (API_UPDATE) {
      tower.send('API_UPDATE')
    }
    getAPIDetail()
  }
}
