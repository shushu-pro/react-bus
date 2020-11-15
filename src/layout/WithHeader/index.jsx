import React from 'react'
import Header from '@/layout/Header'
import './index.less'

export default WithHeaderLayout

function WithHeaderLayout (props) {
  return (
    <div className="WithHeaderLayout">
      <Header />
      <div className="content">
        {props.children}
      </div>

    </div>
  )
}
