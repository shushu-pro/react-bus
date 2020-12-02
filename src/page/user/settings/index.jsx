import React from 'react';
import { Button, Card, Form, message, Space } from 'antd';
import { SMDialog, SMForm } from '@/package/shanmao';
import { api } from '@/api';

export default UserSettings;

function UserSettings () {
  const hookModifyPasswordDialog = createHookModifyPasswordDialog();
  return (
    <Card>
      <Space>
        <Button type="primary" onClick={() => hookModifyPasswordDialog.open()}>修改密码</Button>
      </Space>
      <SMDialog hook={hookModifyPasswordDialog} />
    </Card>
  );

  function createHookModifyPasswordDialog () {
    const hookForm = {
      fields: [
        {
          label: '原密码',
          name: 'password',
          type: 'password',
          rules: [
            { required: true },
          ],
        },
        {
          label: '新密码',
          name: 'passwordNext',
          type: 'password',
          dependencies: [ 'passwordNext2' ],
          rules: [
            { required: true },
          ],
        },
        {
          label: '确认密码',
          name: 'passwordNext2',
          type: 'password',
          dependencies: [ 'passwordNext' ],
          rules: [
            { required: true },
            ({ getFieldValue }) => ({
              validator (rule, value) {
                if (!value || getFieldValue('passwordNext') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(Error('密码输入不一致'));
              },
            }),
          ],
        },
      ],
    };
    return {
      title: '修改密码',
      render () {
        return (
          <SMForm hook={hookForm} />
        );
      },
      onSubmit ({ setLoading }) {
        return hookForm.validate()
          .then(({ password, passwordNext, passwordNext2 }) => api.user.password.modify({
            password,
            passwordNext,
            passwordNext2,
          }))
          .then(() => {
            message.success('密码修改成功');
          })
          .finally(() => {
            setLoading(false);
          });
      },
      afterClose () {
        hookForm.resetFields();
      },
    };
  }
}
