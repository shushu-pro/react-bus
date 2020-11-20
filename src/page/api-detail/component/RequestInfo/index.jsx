import React from 'react'
import { Card, Button } from 'antd'

import './index.less'
import { SMDialog, SMTable } from '@/package/shanmao'
import { api } from '@/api'
import adapter from '@shushu.pro/adapter'
import DataXEditor from '../DataXEditor'

export default RequestInfo

function RequestInfo ({ apiDetail, updateAPI }) {
  const hookDataXEditor = {
    value: apiDetail.reqData || '',
    onSave () {
      // eslint-disable-next-line no-use-before-define
      hookEditDialog.submit()
    },
  }
  const hookEditDialog = {
    title: '请求数据',
    width: 800,
    render: () => <DataXEditor hook={hookDataXEditor} />,
    onSubmit ({ setLoading }) {
      return api.api.modify({ id: apiDetail.id, reqData: hookDataXEditor.getValue() })
        .then(() => {
          // 重新加载
          updateAPI()
        })
        .finally(() => [
          setLoading(false),
        ])
    },
  }

  return (
    <Card
      className="RequestInfo"
      title="请求参数"
      extra={(
        <>
          <Button type="primary" style={{ marginRight: '8px' }} onClick={() => hookEditDialog.open()}>编辑</Button>
        </>
      )}
    >
      {renderRequestData()}
      <SMDialog hook={hookEditDialog} />
    </Card>
  )

  function renderRequestData () {
    const hookRequestData = {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 300,
        },
        {
          title: '类型',
          dataIndex: 'types',
          key: 'types',
          width: 160,
        },
        {
          title: '必选',
          dataIndex: 'required',
          key: 'required',
          width: 60,
        },
        {
          title: '默认值',
          dataIndex: 'defaultValue',
          width: 120,
        },
        {
          title: '描述',
          dataIndex: 'description',
          // width: 320,
        },
      ],
      dataSource: transformData(apiDetail.mockReqDoc),
      rowKey: 'key',
      rowClassName: (record, index) => {
        if (!record) {
          return ''
        }
        return ({
          '-': 'state-remove',
          '+': 'state-add',
          '?': 'state-question',
          '!': 'state-warn',
        })[record.flag]
      },
    }

    return (<SMTable hook={hookRequestData} pagination={false} />)

    function transformData (data, parentKey = '') {
      const newData = adapter({
        key: [ (key) => `${parentKey}-${key}`, 'name' ],
        types: [
          { $value: (value) => value.filter((item) => item !== 'null') },
          { $key: 'required', $value: (value) => (value.includes('null') ? '否' : '是') },
        ],
        flag: true,
        description: true,
        children: (value, { row }) => transformData(value, `${parentKey}-${row.key}`),
      }, data)

      return newData
    }
  }
}
