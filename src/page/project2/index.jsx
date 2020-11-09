import React, { useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from '@/layout/sidebar'
// import { Row, Col, Card, Button, List, Skeleton, Avatar, message, Layout } from 'antd'
// import { Link } from 'react-router-dom'
// import { api } from '@/api'
// import { SMDialog, SMForm } from '@/package/shanmao'
// import Sidebar from '@/layout/sidebar'
import './index.less'

export default function home () {
  // const [ allProjectList, setAllProjectList ] = useState([])


  useEffect(() => {

  }, [])

  return (
    <Layout className="page-project">
      <Sidebar />
      <Layout.Content>
        xxx
      </Layout.Content>
    </Layout>
  )
}
