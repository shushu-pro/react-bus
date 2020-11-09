import { Alert } from 'antd'
import React from 'react'

import './index.less'

function BlankLaout (props) {
  return (
    <div className="BlankLayout">
      <Alert message="BlankLayout" />
      {props.children}
    </div>
  )
}

export default BlankLaout
