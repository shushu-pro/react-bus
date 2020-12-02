import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { api } from '@/api';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';

export default withRouter(login);

function login (props) {
  const formItemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colon: false,
    labelAlign: 'right',
    rules: [
      {
        required: true,
        message: '请输入',
      },
    ],
  };

  const [ form ] = Form.useForm();
  const history = useHistory();
  const [ loading, loadingSet ] = useState(false);

  useEffect(() => {
    console.info('login.mouted');
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.main}>
        <h2>登录磐石</h2>
        <Form className={styles.loginBox} form={form}>
          <Form.Item name="user" label="用户名" {...formItemProps}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>
          <Form.Item name="password" label="密码" {...formItemProps}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
          </Form.Item>
          <div className={styles.buttonBox}>
            <Button type="primary" onClick={submitLogin} loading={loading}>登录</Button>
          </div>
        </Form>
      </div>
    </div>
  );

  function submitLogin () {
    form.validateFields()
      .then(({ user, password }) => {
        loadingSet(true);
        api.user.login({ user, password })
          .then(() => {
            history.push('/');
            window.location.reload();
          })
          .finally(() => [
            loadingSet(false),
          ]);
      });
  }
}
