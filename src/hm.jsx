import React from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'antd'
import xx from './xx'
import MyInput from './MyInput'

const inputs = Array(100).join(',').split(',')

const tr = null

function Hm (props) {
  const { count } = props
  console.info({ props, count, timeStamp: Date.now() })
  return (
    <div>
      iioiiiii
      传入数据：
      {xx}
      {inputs.map(() => (
        <Form.Item>
          <Input
            onChange={() => {
              props.increase()
            }}
            placeholder="Username"
          />
        </Form.Item>
      ))}

      <MyInput
        onStepChange={(nextValue) => {
          props.setCount(nextValue)
        }}
        value={count}
        placeholder="优化后的input"
      />

      <Form.Item label="count">
        {props.count}
      </Form.Item>
    </div>
  )
}

export default connect(
  ({ app, biz }) => ({
    count: app.count,
  }),
  (dispatch, ownProps) => ({
    increase: () => dispatch({ type: 'increase' }),
    setCount: (count) => dispatch({ type: 'setCount', count }),
  })
)(Hm)
