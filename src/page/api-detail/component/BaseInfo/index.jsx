import { mockapi } from '@/api'
import { SMDialog, SMForm } from '@/package/shanmao'
import { Button, Card, Modal } from 'antd'
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
          <Button
            type="primary"
            style={{ marginRight: '8px' }}
            onClick={() => hookMockDialog.open()}
          >MOCK接口
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '8px' }}
            onClick={() => hookEditDialog.open()}
          >编辑
          </Button>
        </>
      )}
    >
      xxx
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

    }
    return {
      title: '修改基础信息',
      render: () => (<SMForm hook={hookEditForm} />),
    }
  }
}
