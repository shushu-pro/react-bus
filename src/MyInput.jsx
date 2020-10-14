import React, { useEffect, useState } from 'react'
import { InputNumber } from 'antd'


function MyInput ({
  onStepChange,
  ...props
}) {
  let [ stepChangeTimer ] = useState(null)
  let onChange = null
  if (typeof onStepChange === 'function') {
    clearTimeout(stepChangeTimer)
    onChange = (...args) => {
      clearTimeout(stepChangeTimer)
      stepChangeTimer = setTimeout(() => {
        onStepChange(...args)
      }, 16)
    }
  }
  useEffect(() => {
    console.info('componentWillMount')
    return componentWillUnmount
  }, [])

  return (<InputNumber onChange={onChange} {...props} />)

  function componentWillUnmount () {
    console.info('componentWillUnmount')
    clearTimeout(stepChangeTimer)
  }
}


export default MyInput
