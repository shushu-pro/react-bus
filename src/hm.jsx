import React from 'react'
import { connect } from '@/package/redux-hoop'
import { Form, Input } from 'antd'
import xx from './xx'
import MyInput from './MyInput'

const inputs = Array(4).join(',').split(',')


function Hm (props) {
  const { count } = props
  // eslint-disable-next-line no-console
  // console.info({ props, count, timeStamp: Date.now() })
  return (
    <div>
      2222aaaaaaaaaaasssssssssss
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
          props.setDoubleIncrease(nextValue)
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
    biz,
  }),
  (dispatch, ownProps) => ({
    increase: () => dispatch({ type: 'app.increase' }),
    setCount: (count) => dispatch('app.setCount', count),
    setDoubleIncrease: (count) => dispatch('app.setDoubleIncrease', count),
  })
)(Hm)
