import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Checkbox, Select, Col, Row, Space, Button, DatePicker } from 'antd';
import { Rule } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';
import { DatePickerProps } from 'antd/lib/date-picker';


interface SMFilterInterface {
  (): JSX.Element;
  readonly reset?: () => void;
  readonly submit?: () => Promise<unknown>;
  readonly lockSubmit?: () => void;
  readonly unlockSubmit?: () => void;
  readonly setValue?: (value) => void;
  readonly getValue?: () => any;
}

type CommonFieldConfig = {
  visible?: boolean | ((option) => boolean);
  type?: 'input'| 'select'| 'text' |'radio'| 'custom'|'password' | 'checkbox' | 'hidden' | 'dateRange' | 'date';
  options?: Array<{
    label: string;
    value: unknown;
  }>;

  render?(fieldConfig): React.ReactNode;
  trim?: boolean;
  rules?: Array<Rule>;
  dependencies?: Array<string>;
  disabled?: boolean | ((option) => boolean);

  props?: SelectProps<unknown> | DatePickerProps;
  maxlength?: number;
  placeholder?: string;
}

type FieldConfig = CommonFieldConfig & {
  name: string;
  label: string;
} | [string, string, CommonFieldConfig]

export type SMFilterProps = {
  props?: Record<string, unknown>; // 传递组件的原生props
  initialValue?: Record<string, unknown>; // 组件的默认值
  value?: Record<string, unknown>; // 组件的值
  fields: Array<FieldConfig>;
  gridLayout?: {
    labelCol?: Record<string, unknown>;
    wrapperCol?: Record<string, unknown>;
  };
  onSubmit?: (values) => void;
}

const propsKey = Symbol('propsKey');
const prevValueKey = Symbol('prevValueKey');
const valueLockKey = Symbol('valueLockKey');

function useSMFilter (props: SMFilterProps) {
  const SMFilterFactory: SMFilterInterface = () => {
    const {
      props = {},
      fields,
      initialValue = {},
      value = {},
      gridLayout = {},
      footer,
      onSubmit,
    } = SMFilter[propsKey];
    const innerAPI = SMFilter;

    const [ form ] = Form.useForm();
    const [ submitLoading, submitLoadingSet ] = useState(false);

    // const [ initialValue ] = useState(initialValue);
    // const [ formValue, formValueSet ] = useState(value);


    // 渲染的字段配置
    const viewFields = [];

    // 需要被trim的字段
    const trimFields = {};

    fields.forEach((field) => {
      let label;
      let name;
      let option: CommonFieldConfig;

      if (Array.isArray(field)) {
        [ label, name, option = {} ] = field;
      } else {
        let rest;
        ({ label, name, ...rest } = field);
        option = rest;
      }

      const { visible } = option;

      // 不可见，或者返回值不可见，该字段直接过滤
      if (visible === false || typeof visible === 'function' && visible(option) === false) {
        return;
      }

      const { type, options, render } = option;

      const viewField: {
        [key: string]: unknown;
        // options?: Array<{ label:string; value:unknown; }>;
      } = {
        ...option,
        label,
        name,
        type,
      };

      // 设置默认type
      if (!type) {
        viewField.type = viewField.options ? 'select' : 'input';
      }

      if (viewField.type === 'input' && option.trim) {
        trimFields[name] = true;
      }

      if (initialValue[name] !== undefined) {
        viewField.initialValue = initialValue[name];
      }

      if (option.render) {
        viewField.type = 'custom';
        viewField.render = () => render(viewField);
      }

      if (/^(select|radio|checkbox|custom)$/.test(String(viewField.type))) {
        viewField.options = options || [];
      }

      viewFields.push(viewField);
    });

    let labelCol = gridLayout.labelCol || { span: 8 };
    let wrapperCol = gridLayout.wrapperCol || { span: 16 };

    const onBlur = (event) => {
      const { id, value } = event.target;
      if (trimFields[id]) {
        form.setFieldsValue({ [id]: value.trim() });
      }
    };

    useEffect(() => {
      if (!SMFilter[valueLockKey] && SMFilter[prevValueKey] !== value) {
        SMFilter[prevValueKey] = value;
        SMFilter.setValue(value);
        SMFilter[valueLockKey] = false;
      }
    }, [ value ]);

    exportAPI();

    return (
      <Form form={form} colon={false} {...props} {...createExternalProps()} onBlur={onBlur} onValuesChange={onValuesChange}>
        <Row>
          {viewFields.map((field) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, width, maxlength, disabled, options, render, placeholder, visible, props, ...formItemProps } = field;
            const itemDisabled = typeof disabled === 'function' ? disabled(field) : disabled;

            if (type === 'dateRange') {
              labelCol = { span: 8 };
              wrapperCol = { span: 16 };
            }

            let content = null;
            switch (type) {
              case 'input':
                content = (<Input allowClear disabled={itemDisabled} maxLength={maxlength} placeholder={placeholder} />);
                break;
              case 'password':
                content = (<Input.Password allowClear disabled={itemDisabled} maxLength={maxlength} placeholder={placeholder} />);
                break;
              case 'radio':
                content = (<Radio.Group disabled={itemDisabled} options={options} />);
                break;
              case 'checkbox':
                content = (<Checkbox.Group disabled={itemDisabled} options={options} />);
                break;
              case 'select':
                content = (<Select allowClear disabled={itemDisabled} options={options} {...props} />);
                break;
              case 'custom':
                content = render(field.initialValue, field);
                break;
              case 'text':
                content = <div>{field.initialValue}</div>;
                break;
              case 'hidden':
                content = <Input type="hidden" />;
                break;
              case 'dateRange':
                content = <DatePicker.RangePicker allowClear disabled={itemDisabled} {...props} />;
                break;
              case 'date':
                content = <DatePicker style={{ width: '100%' }} allowClear disabled={itemDisabled} {...props} />;
                break;
              default:
                content = null;
                break;
            }

            return (
              <Col key={field.name} style={{ display: type === 'hidden' ? 'none' : '', width: type === 'dateRange' ? 360 : 360, marginRight: 10 }}>
                <Form.Item
                  {...formItemProps}
                  style={{ width: 'auto' }}
                  labelCol={labelCol}
                  wrapperCol={wrapperCol}
                >
                  {content}
                </Form.Item>
              </Col>
            );
          })}
          <Col style={{ paddingLeft: 120 }}>
            <Space>
              <Button type="primary" onClick={() => innerAPI.submit()}>确定</Button>
              <Button onClick={() => innerAPI.reset()}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );

    function exportAPI () {
      Object.assign(SMFilter, {
        reset () {
          innerAPI[valueLockKey] = true;
          form.resetFields();
        },
        submit () {
          const result = form.validateFields();
          if (onSubmit) {
            result
              .then((values) => {
                onSubmit(values);
              });
          }
          return result;
        },
        lockSubmit () {
          submitLoadingSet(true);
        },
        unlockSubmit () {
          submitLoadingSet(false);
        },
        setValue (value) {
          SMFilter[valueLockKey] = true;
          form.setFieldsValue(value);
        },
        getValue () {
          return form.getFieldsValue();
        },
      });
    }

    function createExternalProps () {
      const externalProps: { [k: string]: unknown } = {

      };
      return externalProps;
    }

    function onValuesChange (changeValues, allValues) {
      SMFilter[valueLockKey] = true;
    }
  };

  const [ SMFilter ] = useState(() => {
    SMFilterFactory[valueLockKey] = false;
    return SMFilterFactory;
  });

  SMFilter[propsKey] = props;

  return SMFilter;
}

export default useSMFilter;
