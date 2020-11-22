import React, { useState } from 'react';
import { Card, Button, message, Popconfirm, notification } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao/';
import { api } from '@/api/';
import { textCopy } from '@/util';
import styles from './index.less';


export default manageUser;

function manageUser () {
  const hookTable = createHookTable();
  const hookUserModifyDialog = createHookUserModifyDialog();


  return (
    <Card>
      <UserAddDialog />
      <SMTable hook={hookTable} />
      <SMDialog hook={hookUserModifyDialog} />
    </Card>
  );


  function createHookTable () {
    return {
      columns: [
        { title: '用户名', dataIndex: 'name', width: 200 },
        { title: '昵称', dataIndex: 'nick', width: 300 },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        {
          title: '操作',
          render: (row) => (
            <>
              <Button style={{ marginRight: '10px' }} onClick={() => hookUserModifyDialog.open(row)}>编辑</Button>
              <Popconfirm placement="top" title="确定删除" onConfirm={() => deleteUser(row.id)}>
                <Button type="danger" style={{ marginRight: '10px' }}>删除</Button>
              </Popconfirm>
              <Popconfirm placement="top" title="确定重置密码" onConfirm={() => resetPassword(row.id)}>
                <Button type="danger" style={{ marginRight: '10px' }}>重置密码</Button>
              </Popconfirm>
              {row.enabled ? (
                <Button type="danger" onClick={() => setEnabled(row.id, false)}>禁用</Button>
              ) : (
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setEnabled(row.id, true)}>启用</Button>
              )}
            </>
          ),
        },
      ],
      dataSource (params) {
        return api.user.alls(params);
      },
      scroll: { x: 1000 },
    };

    function deleteUser (id) {
      api.user.delete({ id }).then(() => {
        hookTable.reload();
      });
    }

    function resetPassword (id) {
      api.user.resetPassword({ id })
        .then(({ password }) => {
          notification.success({
            placement: 'bottomRight',
            description: `新密码：${password}`,
            onClick () {
              textCopy(password, () => {
                message.success('密码已经复制');
              });
            },
          });
        });
    }

    function setEnabled (id, value) {
      api.user.enabled({ id, enabled: value }).then(() => hookTable.reload());
    }
  }

  function createHookUserModifyDialog () {
    const [ formValues, formValuesSet ] = useState({});
    const hookUserModifyForm = {
      values: formValues,
      fields: [
        { label: '昵称', name: 'nick' },
      ],
    };
    return {
      title: '编辑用户',
      render () {
        return (
          <SMForm hook={hookUserModifyForm} />
        );
      },
      onOpen (hook, data) {
        formValuesSet({ id: data.id, nick: data.nick });
      },
      onSubmit ({ setLoading }) {
        return hookUserModifyForm.validate()
          .then(({ nick }) => api.user.modify({ id: formValues.id, nick }))
          .then(() => {
            hookTable.reload();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };
  }

  function UserAddDialog () {
    const hookUserAddForm = {
      fields: [
        {
          label: '用户名',
          name: 'name',
          rules: [
            { required: true },
          ],
        },
        {
          label: '昵称',
          name: 'nick',
        },
        // {label:'用户名','name':'name'},
      ],
    };
    const [ passwordText, passwordTextSet ] = useState('');
    const hookSuccessDialog = {
      title: '账号创建成功',
      render () {
        return <div>密码：<span onClick={() => textCopy(passwordText, () => message.success('密码已经复制'))}>{passwordText}</span></div>;
      },
      onSubmit () {

      },
    };
    const hookUserAddDialog = {
      title: '添加用户',
      render () {
        return <SMForm hook={hookUserAddForm} />;
      },
      onSubmit ({ setLoading }) {
        return hookUserAddForm.validate()
          .then((values) => api.user.create(values))
          .then((data) => {
            passwordTextSet(data.password);
            hookTable.reload();
            hookSuccessDialog.open();
          })
          .finally(() => {
            setLoading(false);
          });
      },
      afterClose () {
        hookUserAddForm.resetFields();
      },
    };

    return (
      <>
        <div className={styles.buttonBox}>
          <Button type="primary" onClick={() => hookUserAddDialog.open()}>添加用户</Button>
        </div>
        <SMDialog hook={hookUserAddDialog} />
        <SMDialog hook={hookSuccessDialog} />
      </>
    );
  }
}
