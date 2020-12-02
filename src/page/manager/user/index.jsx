import React, { useState, useEffect } from 'react';
import { Card, Button, message, Popconfirm, notification, Space, Select } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao/';
import { api } from '@/api/';
import { textCopy } from '@/util';
import adapter from '@shushu.pro/adapter';
import styles from './index.less';


export default manageUser;

function manageUser () {
  const hookTable = createHookTable();
  const hookUserModifyDialog = createHookUserModifyDialog();
  const hookUserRoleSettingDialog = createHookUserRoleSettingDialog();


  return (
    <Card>
      <UserAddDialog />
      <SMTable hook={hookTable} />
      <SMDialog hook={hookUserModifyDialog} />
      <SMDialog hook={hookUserRoleSettingDialog} />
    </Card>
  );


  function createHookTable () {
    return {
      columns: [
        { title: '用户名', dataIndex: 'user', width: 200 },
        { title: '昵称', dataIndex: 'nick', width: 300 },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        {
          title: '操作',
          render: (row) => (
            <Space>
              <Button onClick={() => hookUserModifyDialog.open(row)}>编辑</Button>
              <Button onClick={() => hookUserRoleSettingDialog.open(row.id)}>设置角色</Button>
              <Popconfirm placement="top" title="确定删除" onConfirm={() => deleteUser(row.id)}>
                <Button type="danger">删除</Button>
              </Popconfirm>
              <Popconfirm placement="top" title="确定重置密码" onConfirm={() => resetPassword(row.id)}>
                <Button type="danger">重置密码</Button>
              </Popconfirm>
              {row.enabled ? (
                <Button type="danger" onClick={() => setDisabled(row.id, true)}>禁用</Button>
              ) : (
                <Button type="primary" onClick={() => setDisabled(row.id, false)}>启用</Button>
              )}
            </Space>
          ),
        },
      ],
      dataSource () {
        return api.manager.user.list();
      },
      scroll: { x: 1100 },
      pagination: false,
    };

    function deleteUser (id) {
      api.manager.user.delete({ id }).then(() => {
        hookTable.reload();
      });
    }

    function resetPassword (id) {
      api.manager.user.password.reset({ id })
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

    function setDisabled (id, value) {
      api.manager.user.disabled({ id, state: value }).then(() => hookTable.reload());
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
          .then(({ nick }) => api.manager.user.modify({ id: formValues.id, nick }))
          .then(() => {
            hookTable.reload();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };
  }

  function createHookUserRoleSettingDialog () {
    const [ loading, loadingSet ] = useState(false);
    const [ userId, userIdSet ] = useState(null);
    const [ dialogData, dialogDataSet ] = useState({});
    const [ roleValues, roleValuesSet ] = useState([]);

    useEffect(() => {
      if (userId) {
        fetchData();
      }
    }, [ userId ]);

    return {
      title: '设置角色',
      loading,
      render () {
        return (
          <Select
            mode="multiple"
            placeholder="选择角色"
            options={dialogData.roleList}
            value={roleValues}
            onChange={pickRole}
            style={{ width: '100%' }}
          />
        );
      },
      onOpen (hook, id) {
        userIdSet(id);
      },
      afterClose () {
        userIdSet(null);
      },
      onSubmit ({ setLoading }) {
        return api.manager.user.role.modify({ userId, roles: roleValues })
          .then(() => {

          })
          .finally(() => {
            setLoading(false);
          });
      },
    };

    function pickRole (values) {
      roleValuesSet(values);
      // console.info({ values });
    }

    // 拉取用户角色和角色列表
    function fetchData (params) {
      loadingSet(true);
      Promise.all([
        api.manager.role.list(),
        api.manager.user.role.list({ userId }),
      ])
        .then(([ { list: roleList }, { list: userRoleList } ]) => {
          dialogDataSet({
            roleList: adapter({ id: 'value', label: true }, roleList),
            userRoleList,
          });
          roleValuesSet(userRoleList);
          // console.info({
          //   userRoleList,
          //   roleList: adapter({ id: 'value', label: true }, roleList),
          // });
        })
        .finally(() => {
          loadingSet(false);
        });
    }
  }

  function UserAddDialog () {
    const hookUserAddForm = {
      fields: [
        {
          label: '用户名',
          name: 'user',
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
          .then((values) => api.manager.user.create(values))
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
          <Button type="primary" onClick={() => hookUserAddDialog.open()}>创建用户</Button>
        </div>
        <SMDialog hook={hookUserAddDialog} />
        <SMDialog hook={hookSuccessDialog} />
      </>
    );
  }
}
