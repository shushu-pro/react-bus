import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Select,
  Col,
  Row,
  Space,
  Button,
  Switch,
  DatePicker,
} from 'antd';
import { Rule } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';
import { InputProps } from 'antd/lib/input';

interface SMFormInterface {
  (): JSX.Element;
  readonly reset?: () => void;
  readonly submit?: () => Promise<unknown>;
  readonly lockSubmit?: () => void;
  readonly unlockSubmit?: () => void;
  readonly setValue?: (value) => void;
}

type CommonFieldConfig = {
  visible?: boolean | ((option) => boolean); // 是否可见
  type?:
    | 'input'
    | 'select'
    | 'text'
    | 'textarea'
    | 'radio'
    | 'custom'
    | 'password'
    | 'checkbox'
    | 'hidden'
    | 'switch'
    | 'date'
    | 'dateRange'; // 表单类型
  options?: Array<{
    label: string;
    value: unknown;
    disabled?: boolean;
  }>;

  width?: number; // 内容宽度

  render?(fieldConfig): React.ReactNode; // 自定义渲染
  trim?: boolean; // 是否去除首尾空格
  rules?: Array<Rule>; // 表单校验，同官方
  dependencies?: Array<string>; // 表单联系，同官方
  disabled?: boolean | ((option) => boolean); // 是否禁用表单

  props?: SelectProps<unknown> | InputProps; // 官方额外的props配置项
  maxlength?: number; // 最大长度，同官方
  placeholder?: string; // 输入框提示文案，同官方
  // width?: number;
  tips?: string | ((fieldConfig) => JSX.Element | string); // 额外提示文案
};

type GroupConfig = {
  title: string | (() => JSX.Element | string); // 分组标题
  fields: Array<FieldConfig>; // 分组子级配置项
  column?: 1 | 2 | 3 | 4; // 几列布局
};

type FieldConfig =
  | (CommonFieldConfig & {
      name: string;
      label: string;
    })
  | [string, string, CommonFieldConfig]
  | GroupConfig;

export type SMFormProps = {
  props?: Record<string, unknown>; // 传递组件的原生props
  initialValue?: Record<string, unknown>; // 组件的默认值
  value?: Record<string, unknown>; // 组件的值
  fields: Array<FieldConfig>; // 组件字段配置项
  gridLayout?: {
    labelCol?: Record<string, unknown>;
    wrapperCol?: Record<string, unknown>;
  };
  footer?: JSX.Element; // 自定义提交按钮组，null为关闭
  onSubmit?: (error, values) => void;
  onChange?: (error, values) => void;
  throttle?: number; // 节流阀，默认300ms
  minWidth?: number; // 最小宽度
};

const propsKey = Symbol('propsKey');
const prevValueKey = Symbol('prevValueKey');
const valueLockKey = Symbol('valueLockKey');

function useSMForm(props: SMFormProps) {
  const SMFormFactory: SMFormInterface = () => {
    const {
      props = {},
      fields,
      initialValue = {},
      value = {},
      gridLayout = {},
      footer,
      onSubmit,
      onChange,
      throttle = 300,
      minWidth = 400,
    } = SMForm[propsKey];
    const innerAPI = SMForm;

    const [form] = Form.useForm();
    const [submitLoading, submitLoadingSet] = useState(false);

    // const [ initialValue ] = useState(initialValue);
    // const [ formValue, formValueSet ] = useState(value);

    // 渲染的字段配置
    const viewFields = [];

    // 需要被trim的字段
    const trimFields = {};

    // maxColumn 最大列配置项，用于运算每个单元格占用的网格大小
    const globalConfig: { maxColumn: number } = { maxColumn: 1 };

    transformConfigs({
      fields,
      viewFields,
      trimFields,
      initialValue,
      globalConfig,
    });

    const labelCol = gridLayout.labelCol || { span: 6 };
    const wrapperCol = gridLayout.wrapperCol || { span: 16 };

    const onBlur = (event) => {
      const { id, value } = event.target;
      if (trimFields[id]) {
        form.setFieldsValue({ [id]: value.trim() });
      }
    };

    useEffect(() => {
      if (!SMForm[valueLockKey] && SMForm[prevValueKey] !== value) {
        SMForm[prevValueKey] = value;
        SMForm.setValue(value);
        SMForm[valueLockKey] = false;
      }
    }, [value]);

    exportAPI();

    return (
      <Form
        form={form}
        colon={false}
        {...props}
        {...createExternalProps()}
        onBlur={onBlur}
        onValuesChange={throttleFactory(onValuesChange, throttle)}
      >
        {renderFormItems({
          viewFields,
          labelCol,
          wrapperCol,
          maxColumn: globalConfig.maxColumn,
          minWidth,
        })}
        {footer === undefined ? (
          <Row>
            <Col {...labelCol} />
            <Col {...wrapperCol}>
              <Space>
                <Button
                  onClick={() => innerAPI.reset()}
                  loading={submitLoading}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => innerAPI.submit()}
                  loading={submitLoading}
                >
                  提交
                </Button>
              </Space>
            </Col>
          </Row>
        ) : (
          footer
        )}
      </Form>
    );

    function exportAPI() {
      Object.assign(SMForm, {
        reset() {
          innerAPI[valueLockKey] = true;
          form.resetFields();
        },
        submit() {
          const result = form.validateFields();
          if (onSubmit) {
            result
              .then((values) => {
                onSubmit(null, values);
              })
              .catch((error) => {
                onSubmit(error, null);
              });
          }
          return result;
        },
        lockSubmit() {
          submitLoadingSet(true);
        },
        unlockSubmit() {
          submitLoadingSet(false);
        },
        setValue(value) {
          SMForm[valueLockKey] = true;
          form.setFieldsValue(value);
        },
      });
    }

    function createExternalProps() {
      const externalProps: { [k: string]: unknown } = {};
      return externalProps;
    }

    function onValuesChange(changeValues, allValues) {
      SMForm[valueLockKey] = true;
      onChange && onChange(changeValues, allValues);
      props.onValuesChange && props.onValuesChange(changeValues, allValues);
    }
  };

  const [SMForm] = useState(() => {
    SMFormFactory[valueLockKey] = false;
    return SMFormFactory;
  });

  SMForm[propsKey] = props;

  return SMForm;
}

export default useSMForm;

function transformConfigs({
  fields,
  viewFields,
  trimFields,
  initialValue,
  globalConfig,
}) {
  fields.forEach((config) => {
    if (config.title !== undefined) {
      const title =
        typeof config.title === 'function' ? config.title() : config.title;
      // 分组配置项
      const groupViewFields = [];
      const group = {
        ...config,
        title,
        type: 'group',
        fields: groupViewFields,
      };

      if (config.column > globalConfig.maxColumn) {
        globalConfig.maxColumn = config.column;
      }

      transformConfigs({
        fields: config.fields,
        viewFields: groupViewFields,
        trimFields,
        initialValue,
        globalConfig,
      });
      viewFields.push(group);
    } else {
      // 表单配置项
      const field = {};
      let label;
      let name;
      let option: CommonFieldConfig;

      if (Array.isArray(field)) {
        [label, name, option = {}] = config;
      } else {
        let rest;
        ({ label, name, ...rest } = config);
        option = rest;
      }

      const { visible } = option;

      // 不可见，或者返回值不可见，该字段直接过滤
      if (
        visible === false ||
        (typeof visible === 'function' && visible(option) === false)
      ) {
        return;
      }

      const { type, options, render } = option;

      const viewField: { [key: string]: unknown } = {
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

      if (option.tips) {
        viewField.tips =
          typeof option.tips === 'function'
            ? option.tips(viewField)
            : option.tips;
      }

      viewFields.push(viewField);
    }
  });
}

function renderFormItems({
  viewFields,
  labelCol,
  wrapperCol,
  maxColumn,
  minWidth,
}) {
  const span = 24 / maxColumn;
  return viewFields.map((config) => {
    if (config.type === 'group') {
      return renderGroup({ config, labelCol, wrapperCol, span, minWidth });
    }
    return (
      <Row key={config.name}>
        {renderItem({ config, labelCol, wrapperCol, minWidth, span })}
      </Row>
    );
  });
}

function renderGroup({ config, labelCol, wrapperCol, span, minWidth }) {
  const { title, column = 1, fields } = config;
  const fieldsClone = fields.slice();

  const fieldsAllJSX = [];
  let fieldConfig;
  while (true) {
    const fieldsJSX = [];
    let key;
    for (let i = 0; i < column; i++) {
      fieldConfig = fieldsClone.shift();
      if (fieldConfig) {
        key = fieldConfig.name;
        fieldsJSX.push(
          renderItem({
            config: fieldConfig,
            labelCol,
            wrapperCol,
            minWidth,
            span,
          })
        );
      }
    }

    if (fieldsJSX.length) {
      fieldsAllJSX.push(<Row key={key}>{fieldsJSX.map((item) => item)}</Row>);
    }

    if (!fieldConfig) {
      break;
    }
  }

  return (
    <div style={{ paddingBottom: 24 }} key={title}>
      <h3>{title}</h3>
      {fieldsAllJSX.map((item) => item)}
    </div>
  );
}

function renderItem({ config, labelCol, wrapperCol, minWidth, span }) {
  const {
    type,
    width,
    maxlength,
    disabled,
    options,
    render,
    placeholder,
    visible,
    props,
    tips,
    ...restConfig
  } = config;
  const itemDisabled =
    typeof disabled === 'function' ? disabled(config) : disabled;

  let content = null;
  switch (type) {
    case 'input':
      content = (
        <Input
          style={{ width: width ? `${width}px` : '' }}
          disabled={itemDisabled}
          maxLength={maxlength}
          placeholder={placeholder}
        />
      );
      break;
    case 'password':
      content = (
        <Input.Password
          style={{ width: width ? `${width}px` : '' }}
          disabled={itemDisabled}
          maxLength={maxlength}
          placeholder={placeholder}
        />
      );
      break;
    case 'radio':
      content = (
        <Radio.Group
          style={{ width: width ? `${width}px` : '' }}
          disabled={itemDisabled}
          options={options}
        />
      );
      break;
    case 'checkbox':
      content = (
        <Checkbox.Group
          style={{ width: width ? `${width}px` : '' }}
          disabled={itemDisabled}
          options={options}
        />
      );
      break;
    case 'select':
      content = (
        <Select
          style={{ width: width ? `${width}px` : '' }}
          disabled={itemDisabled}
          options={options}
          {...props}
        />
      );
      break;
    case 'custom':
      content = render(config.initialValue, config);
      break;
    case 'text':
      content = (
        <div style={{ width: width ? `${width}px` : '' }}>
          {config.initialValue}
        </div>
      );
      break;
    case 'textarea':
      content = (
        <Input.TextArea
          disabled={itemDisabled}
          showCount
          maxLength={maxlength}
          placeholder={placeholder}
        />
      );
      break;
    case 'hidden':
      content = <Input type="hidden" />;
      break;
    case 'switch':
      content = <Switch disabled={itemDisabled} {...props} />;
      break;
    case 'dateRange':
      content = (
        <DatePicker.RangePicker
          style={{ width: width ? `${width}px` : '100%' }}
          disabled={itemDisabled}
          {...props}
        />
      );
      break;
    case 'date':
      content = (
        <DatePicker
          style={{ width: width ? `${width}px` : '100%' }}
          disabled={itemDisabled}
          {...props}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  const formItemProps = { ...restConfig };
  if (tips) {
    formItemProps.extra = tips;
  }
  if (type === 'switch') {
    formItemProps.valuePropName = 'checked';
  }

  return (
    <Col
      span={span}
      key={config.name}
      style={{ minWidth, display: type === 'hidden' ? 'none' : '' }}
    >
      <Form.Item {...formItemProps} labelCol={labelCol} wrapperCol={wrapperCol}>
        {content}
      </Form.Item>
    </Col>
  );
}

// 节流阀
function throttleFactory(fn, interval = 333) {
  let nowPrev;
  let isListen = false; // 有待触发的函数

  return (...args) => {
    const now = Date.now();
    // 第一次或者时间满足间隔了，直接触发
    if (!nowPrev || now - nowPrev > interval) {
      nowPrev = now;
      fn(...args);
      return;
    }

    // 还不能满足触发条件的，放入监听
    if (!isListen) {
      isListen = true;
      setTimeout(() => {
        isListen = false;
        nowPrev = Date.now();
        try {
          // 当组件被释放了，处理异常
          fn(...args);
        } catch (err) {
          // ...
        }
      }, interval - (now - nowPrev));
    }
  };
}
