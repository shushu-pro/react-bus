import React, { useState, useEffect } from 'react'
import { Form, Input, Radio, Checkbox, Select } from 'antd'

function SMForm ({
  hook,
  ...props
}) {
  const {
    gridLayout = {},
    fields = [],
    data = {},
    trim = true,
  } = hook

  const [ form ] = Form.useForm()
  const viewFields = []

  fields.forEach((field) => {
    let label,
      name,
      option
    if (Array.isArray(field)) {
      [ label, name, option = {} ] = field
    } else {
      ({ label, name } = field)
      option = field
    }

    const { visible } = option

    // 不可见，或者返回值不可见，该字段直接过滤
    if (visible === false || typeof visible === 'function' && visible(option) === false) {
      return
    }

    const { type = 'input', options, customRender } = option

    const viewField = {
      ...option,
      label,
      name,
      type,
    }

    if (data[name] !== undefined) {
      viewField.initialValue = data[name]
    }

    if (option.customRender) {
      viewField.type = 'custom'
      viewField.customRender = () => customRender(viewField.initialValue, viewField, hook)
    }

    if (/^(select|radio|checkbox|custom)$/.test(viewField.type)) {
      viewField.options = options || []
    }

    viewFields.push(viewField)
  })

  const labelCol = gridLayout.labelCol || { span: 6 }
  const wrapperCol = gridLayout.wrapperCol || { span: 16 }

  // 以指令方式实现填充
  setTimeout(() => {
    form.setFieldsValue(data)
  })

  bindExports()

  return (
    <Form
      className="SMForm"
      form={form}
      {...props}
      {...createHookProps()}
    >
      {viewFields.map((field) => {
        const { type, width, maxlength, disabled, options, initialValue, customRender, ...formItemProps } = field
        let content
        const itemDisabled = typeof disabled === 'function' ? disabled() : disabled
        switch (type) {
          case 'input':
            content = (<Input defaultValue={initialValue} disabled={itemDisabled} maxLength={maxlength} />)
            break
          case 'radio':
            content = (<Radio.Group defaultValue={initialValue} disabled={itemDisabled} options={options} />)
            break
          case 'checkbox':
            content = (<Checkbox.Group defaultValue={initialValue} disabled={itemDisabled} options={options} />)
            break
          case 'select':
            content = (<Select defaultValue={initialValue} disabled={itemDisabled} options={options} />)
            break
          case 'custom':
            content = customRender(initialValue, field)
            break
          case 'text':
            content = <div>{initialValue}</div>
            break
          default:
            content = null
            break
        }
        return (
          <Form.Item
            key={field.name}
            colon={false}
            {...formItemProps}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <div style={{ width: width ? `${width}px` : 'auto' }}>
              {content}
            </div>
          </Form.Item>
        )
      })}
    </Form>
  )

  function bindExports () {
    hook.resetFields = () => {
      form.resetFields()
    }

    hook.validate = (callback) => {
      console.info(JSON.stringify(form.getFieldsValue()))
      // if (trim) {
      //   const trimValues = {}
      //   viewFields.forEach((field) => {
      //     const { name, trim } = field
      //     if (!name || trim === false) {
      //       return
      //     }
      //     if (field.type === 'input' || trim === true) {
      //       const value = form.getFieldValue(name)
      //       if (typeof value === 'string') {
      //         trimValues[name] = value.trim()
      //       }
      //     }
      //   })
      //   form.setFieldsValue(trimValues)
      // }

      return form.validateFields()
    }
  }

  function createHookProps () {
    const hookProps = {

    }

    return hookProps
  }
}

export default SMForm
