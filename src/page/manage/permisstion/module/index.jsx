import React, { useState, useEffect } from 'react';
import { Card, Button, message, Popconfirm, notification, Space, Row, Col, Tree, Tabs } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao/';
import { api } from '@/api/';
import { textCopy, mockJSON } from '@/util';
import styles from './index.less';


export default PermissionModule;


function PermissionModule () {
  const hookModuleList = createHookModuleList();
  const hookPermissionSettingDialog = createHookPermissionSettingDialog();
  return (
    <Card>
      <ButtonBox />
      <SMTable hook={hookModuleList} />
      <SMDialog hook={hookPermissionSettingDialog} />
      {/* <UserAddDialog />
      <SMTable hook={hookTable} />
      <SMDialog hook={hookUserModifyDialog} /> */}
    </Card>
  );


  function ButtonBox () {
    const hookCreateForm = {
      fields: [
        { label: '模块名词', name: 'label', maxlength: 32, rules: [ { required: true } ] },
        { label: '模块标识', name: 'symbol', maxlength: 128, rules: [ { required: true } ] },
      ],
    };
    const hookCreateDialog = {
      title: '添加模块',
      render () {
        return (<SMForm hook={hookCreateForm} />);
      },
      onSubmit ({ setLoading }) {
        return hookCreateForm.validate()
          .then((values) => api.module.create(values))
          .then(() => hookModuleList.reload())
          .finally(() => {
            setLoading(false);
          });
      },
      afterClose () {
        hookCreateForm.resetFields();
      },
    };
    return (
      <>
        <div className={styles.buttonBox}>
          <Button type="primary" onClick={() => hookCreateDialog.open()}>创建模块</Button>
        </div>
        <SMDialog hook={hookCreateDialog} />
      </>
    );
  }

  function createHookModuleList () {
    return {
      columns: [
        { title: '模块名称', dataIndex: 'label', width: 200 },
        { title: '模块标识', dataIndex: 'symbol', width: 200 },
        {
          title: '操作',
          render: (row) => (
            <>
              <Space>
                <Button onClick={() => hookPermissionSettingDialog.open({ moduleId: row.id, label: row.label, symbol: row.symbol })}>设置权限</Button>
                <Popconfirm placement="top" title="确定删除" onConfirm={() => submitDelete(row.id)}>
                  <Button type="danger">删除</Button>
                </Popconfirm>
              </Space>

              {/* <Button style={{ marginRight: '10px' }} onClick={() => hookUserModifyDialog.open(row)}>编辑</Button>

              <Popconfirm placement="top" title="确定重置密码" onConfirm={() => resetPassword(row.id)}>
                <Button type="danger" style={{ marginRight: '10px' }}>重置密码</Button>
              </Popconfirm>
              {row.enabled ? (
                <Button type="danger" onClick={() => setEnabled(row.id, false)}>禁用</Button>
              ) : (
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setEnabled(row.id, true)}>启用</Button>
              )} */}
            </>
          ),
        },

      ],
      dataSource: (params) => api.module.list(params),
      scroll: { x: 600 },
    };

    function submitDelete (id) {
      api.module.delete({ id }).then(() => {
        hookModuleList.reload();
      });
    }
  }

  function createHookPermissionSettingDialog () {
    const [ moduleInfo, moduleInfoSet ] = useState({});
    const [ treeData, treeDataSet ] = useState(mockJSON(`
      @list(1)[
        @title #text
        @key 10000++
        @children(100)[
          @title #name
          @key 1000000++
        ]
      ]
    
    `).list);
    const [ groupEditorValues, groupEditorValuesSet ] = useState({});
    const hookGroupEditorForm = {
      values: groupEditorValues,
      fields: [
        {
          label: '名称',
          name: 'label',
          maxlength: 32,
          rules: [ { required: true } ],
        },
        {
          label: '标识',
          name: 'symbol',
          maxlength: 128,
          rules: [ { required: true } ],
        },
      ],
    };
    const [ loading, loadingSet ] = useState(false);
    const { moduleId } = moduleInfo;

    useEffect(() => {
      if (moduleId) {
        fetchModuleFunctionGroup(moduleId);
        // console.info('fetch module group');
      }
    }, [ moduleId ]);

    return {
      title: '设置权限',
      width: 800,
      footer: null,
      loading,
      render () {
        return (
          <Row style={{ minHeight: '480px' }}>
            <Col span={10}>
              <Tree
                treeData={treeData}
                height={480}
                blockNode
                showLine
              />
            </Col>
            <Col span={14}>
              <Tabs type="card">
                <Tabs.TabPane tab="提示" key="index" disabled>
                  <div style={{ padding: '20px' }}>
                    点击左侧进行操作
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="添加分类" key="groupEditor" disabled2>
                  <div style={{ padding: '20px' }}>
                    <SMForm hook={hookGroupEditorForm} />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="添加权限" key="permissionEditor" disabled2>
                  Content of Tab Pane 2
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        );
      },
      onOpen (hook, moduleInfo) {
        moduleInfoSet(moduleInfo);
      },
    };

    function fetchModuleFunctionGroup (moduleId) {
      loadingSet(true);
      api.module.functionGroup({ id: moduleId })
        .then((list) => {
          loadingSet(false);
          treeDataSet([
            {
              key: '0',
              label: moduleInfo.label,
              title ({ label, key }) {
                // console.info({ label, key });
                return (<div key={key}>{label}</div>);
              },
            },
          ]);
          // console.info({ list });
        });
    }
  }
}
