import React, { useEffect } from 'react';
import { Form, Input, Radio, Checkbox, Select } from 'antd';

function SMForm ({
  hook,
  ...props
}) {
  const {
    gridLayout = {},
    fields = [],
    data = {},
    values,
    trim = true,
  } = hook;

  const [ form ] = Form.useForm();
  const initValues = values || data || {};
  const viewFields = [];
  const trimFields = {};
  fields.forEach((field) => {
    let label,
      name,
      option;
    if (Array.isArray(field)) {
      [ label, name, option = {} ] = field;
    } else {
      ({ label, name } = field);
      option = field;
    }

    const { visible } = option;

    // 不可见，或者返回值不可见，该字段直接过滤
    if (visible === false || typeof visible === 'function' && visible(option) === false) {
      return;
    }

    const { type = 'input', options, customRender } = option;

    const viewField = {
      ...option,
      label,
      name,
      type,
    };

    if (type === 'input' && (trim && option.trim !== false || option.trim)) {
      trimFields[name] = true;
    }

    if (initValues[name] !== undefined) {
      viewField.initialValue = initValues[name];
    }

    if (option.customRender) {
      viewField.type = 'custom';
      viewField.customRender = () => customRender(viewField.initialValue, viewField, hook);
    }

    if (/^(select|radio|checkbox|custom)$/.test(viewField.type)) {
      viewField.options = options || [];
    }

    viewFields.push(viewField);
  });

  const labelCol = gridLayout.labelCol || { span: 6 };
  const wrapperCol = gridLayout.wrapperCol || { span: 16 };

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [ initValues ]);

  const onBlur = ({ target }) => {
    const { id, value } = target;

    if (trimFields[id]) {
      form.setFieldsValue({ [id]: value.trim() });
    }
  };

  bindExports();

  return (
    <Form
      className="SMForm"
      form={form}
      {...props}
      {...createHookProps()}
      onBlur={onBlur}
    >

      {viewFields.map((field) => {
        const { type, width, maxlength, disabled, options, customRender, placeholder, mode, onSearch, props, trim, ...formItemProps } = field;
        let content;
        const itemDisabled = typeof disabled === 'function' ? disabled() : disabled;
        switch (type) {
          case 'input':
            content = (<Input disabled={itemDisabled} maxLength={maxlength} placeholder={placeholder} />);
            break;
          case 'password':
            content = (<Input.Password disabled={itemDisabled} maxLength={maxlength} placeholder={placeholder} />);
            break;
          case 'radio':
            content = (<Radio.Group disabled={itemDisabled} options={options} />);
            break;
          case 'checkbox':
            content = (<Checkbox.Group disabled={itemDisabled} options={options} />);
            break;
          case 'select':
            content = (<Select disabled={itemDisabled} options={options} {...props} />);
            break;
          case 'custom':
            content = customRender(field.initialValue, field);
            break;
          case 'text':
            content = <div>{field.initialValue}</div>;
            break;
          default:
            content = null;
            break;
        }
        return (
          <Form.Item
            key={field.name}
            colon={false}
            {...formItemProps}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            style={{ width: width ? `${width}px` : 'auto' }}

          >
            {content}
          </Form.Item>
        );
      })}
    </Form>
  );

  function bindExports () {
    hook.resetFields = () => {
      form.resetFields();
    };

    hook.validate = (callback) => {
      // console.info(JSON.stringify(form.getFieldsValue()))
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
      if (trim) {
        // ...
      }

      return form.validateFields();
    };
  }

  function createHookProps () {
    const hookProps = {

    };

    return hookProps;
  }
}

export default SMForm;
