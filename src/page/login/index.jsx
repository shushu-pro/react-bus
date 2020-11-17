import React, { useState } from 'react';
import { Input, Card, Form, Button } from 'antd';
import api from '@/api';
import mockValue from '@shushu.pro/mockv';
import { connect } from '@/package/haima';

const mapStateToProps = ({ user }) => ({
  user,
});

export default connect(mapStateToProps)(Login);

function Login (props) {
  const [ loading, loadingSet ] = useState(false);
  return (
    <div>
      <Card>
        上课考试了卡买买买看看
        <Form>
          <Form.Item label="用户名">
            <Input value={props.user.name} />
          </Form.Item>
          <Form.Item label="密码">
            <Input />
          </Form.Item>
          <img src={props.user.avatar} alt="" />
          <Button type="primary" loading={loading} onClick={doLogin}>登录</Button>
        </Form>
      </Card>
    </div>
  );

  function doLogin () {
    loadingSet(true);
    api.user.login().finally(() => {
      props.dispatch({ type: 'user.setInfo', payload: { name: mockValue.name() } });
      loadingSet(false);
    });
  }
}
