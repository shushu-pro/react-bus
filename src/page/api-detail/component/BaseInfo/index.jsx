import { api, mockapi } from '@/api'
import { SMDialog, SMForm } from '@/package/shanmao'
import { Button, Card, Modal, Input, Descriptions } from 'antd'
import React, { useState } from 'react'
import JSONEditor from '../JSONEditor'

import './index.less'

export default BaseInfo

const { message } = Modal

function BaseInfo ({ projectId, apiDetail }) {
  const hookMockDialog = getHookMockDialog()
  const hookEditDialog = getHookEditDialog()

  return (
    <Card
      className="BaseInfo"
      title="基础信息"
      extra={(
        <>
          <Button type="primary" style={{ marginRight: '8px' }} onClick={() => hookMockDialog.open()}>MOCK接口</Button>
          <Button type="primary" style={{ marginRight: '8px' }} onClick={() => hookEditDialog.open()}>编辑</Button>
        </>
      )}
    >
      <Descriptions>
        <Descriptions.Item label="接口名称" span="3">{ apiDetail.name }</Descriptions.Item>
        <Descriptions.Item label="接口地址" span="3">{ apiDetail.path }</Descriptions.Item>
        <Descriptions.Item label="请求方式">{ apiDetail.methodText }</Descriptions.Item>
        <Descriptions.Item label="接口描述">{ apiDetail.description || '-' }</Descriptions.Item>
      </Descriptions>
      <SMDialog hook={hookMockDialog} />
      <SMDialog hook={hookEditDialog} />
    </Card>
  )

  function getHookMockDialog () {
    const [ MOCKData, MOCKDataSet ] = useState(0)
    const hookParamsJSONEditor = {
      value: JSON.stringify(apiDetail.mockReqData),
      format: true,
      height: 190,
    }
    const hookResponseJSONEditor = {
      value: MOCKData,
      format: true,
    }
    return {
      title: 'MOCK接口',
      width: 800,
      props: {
        okText: '发起请求',
      },
      render () {
        let content = null
        if (typeof MOCKData === 'string') {
          content = <JSONEditor hook={hookResponseJSONEditor} />
        } else {
          content = <div style={{ height: '260px' }}>{[ '等待请求...', '数据请求中...' ][MOCKData]}</div>
        }
        return (
          <div>
            <h4>请求参数：</h4>
            <JSONEditor hook={hookParamsJSONEditor} />
            <h4 style={{ marginTop: '8px' }}>响应数据：</h4>
            {content}
          </div>
        )
      },
      onOpen () {
        MOCKDataSet(0)
      },
      onSubmit ({ setLoading }) {
        return new Promise((resolve) => {
          let sendData
          try {
            sendData = JSON.parse(hookParamsJSONEditor.getValue())
          } catch (err) {
            return message.error('请求参数错误，请检查输入的是否符合JSON格式')
          }
          mockapi.send(sendData, { method: apiDetail.methodText, url: `${projectId}/${apiDetail.path}` })
            .then((data) => {
              MOCKDataSet(JSON.stringify(data))
            })
            .finally(() => [
              setLoading(false),
            ])
        })
      },
    }
  }

  function getHookEditDialog () {
    const hookEditForm = {
      data: {
        name: apiDetail.name,
        path: apiDetail.path,
        method: apiDetail.method,
        description: apiDetail.description,
      },
      gridLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
      fields: [
        [
          '接口名称',
          'name',
          {
            maxlength: 20,
            rules: [ { required: true, message: '请输入接口名称' } ],
          },
        ],
        [
          '接口路径',
          'path',
          {
            maxlength: 100,
            rules: [ { required: true, message: '请输入接口路径' } ],
          },
        ],
        [
          '请求方式',
          'method',
          {
            type: 'select',
            options: [
              { label: 'GET', value: 0 },
              { label: 'POST', value: 1 },
            ],
            rules: [ { required: true, message: '请选择请求方式' } ],
          },
        ],
        [
          '接口描述', 'description', {
            maxlength: 256,
            customRender: () => (<Input.TextArea maxLength={256} />),
          },
        ],
      ],
    }

    return {
      title: '修改基础信息',
      render: () => (<SMForm hook={hookEditForm} />),
      onSubmit ({ setLoading }) {
        return hookEditForm
          .validate()
          .then((values) => api.api.modify({ ...values, path: values.path.replace(/^\/+/, ''), id: apiDetail.id }))
          .then((data) => {
            // 更新成功
          })
          .finally(() => {
            setLoading(false)
          })
      },
    }
  }
}
