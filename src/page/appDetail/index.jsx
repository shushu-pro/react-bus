import React from 'react'
import LayoutBreadcrumb from '@/layout/Breadcrumb'
import { Card, Descriptions, Divider, Button } from 'antd'
import { SMTable } from '@/package/shanmao'
import styles from './index.less'


export default AppDetail

function AppDetail () {
  return (
    <div className="AppDetail">
      <LayoutBreadcrumb type="app" />
      <Card style={{ margin: '20px' }}>
        <BaseInfo />
        <Divider style={{ marginBottom: 32 }} />
        <Projects />
      </Card>
    </div>
  )

  function BaseInfo () {
    return (
      <Descriptions
        title="应用详情"
        style={{
          marginBottom: 32,
        }}
        bordered
      >
        <Descriptions.Item label="应用名称">一朵云运营平台</Descriptions.Item>
        <Descriptions.Item label="应用描述">一朵云运营平台是很好的平台，多云治理，一朵云运营平台是很好的平台，多云治理一朵云运营平台是很好的平台，多云治理</Descriptions.Item>
        <Descriptions.Item label="销售单号">1234123421</Descriptions.Item>
      </Descriptions>
    )
  }

  function Projects () {
    const hookTable = {
      columns: [
        [ '编号', 'id' ],
        [ '名称', 'name' ],
        [ '创建时间', 'createTime' ],
        [ '状态', 'statusText' ],
        [ '操作', 'id', {
          width: 120,
          render () {
            return (
              <div>
                <Button type="primary">编辑</Button>
              </div>
            )
          },
        } ],
      ],
      dataSource (params) {
        return {
          page: 1,
          pageSize: 12,
          total: 12,
          list: [
            { id: 1, title: 'xx', num: 12 },
            { id: 2, title: 'xx', num: 12 },
            { id: 3, title: 'xx', num: 12 },
            { id: 4, title: 'xx', num: 12 },
          ],
        }
      },
    }
    return (
      <>
        <h3 className={styles.title}>项目列表<Button type="primary" className={styles.buttonAddProject}>添加项目</Button></h3>
        <SMTable hook={hookTable} />
      </>
    )
  }
}
