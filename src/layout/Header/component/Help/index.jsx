import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import HeaderStyles from '@/layout/Header/index.less'

export default Help
function Help () {
  return (
    <Tooltip title="帮助文档">
      <div
        className={HeaderStyles.action}
        onClick={() => {
          window.open('https://shushu.pro/panshi/doc/')
        }}
      >
        <QuestionCircleOutlined />
      </div>
    </Tooltip>
  )
}
