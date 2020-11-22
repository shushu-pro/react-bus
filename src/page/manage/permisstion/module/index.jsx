import React, { useState, useEffect } from 'react';
import { Card, Button, message, Popconfirm, notification, Space, Row, Col, Tree, Tabs, Tooltip, Modal } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao/';
import { api } from '@/api/';
import { textCopy, mockJSON } from '@/util';
import { PlusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
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
          label: '分类名称',
          name: 'label',
          maxlength: 32,
          rules: [ { required: true } ],
        },
        {
          label: '分类标识',
          name: 'symbol',
          maxlength: 128,
          rules: [ { required: true } ],
        },
      ],
    };
    const [ activeTabKey, activeTabKeySet ] = useState('index');
    const [ loading, loadingSet ] = useState(false);
    const { moduleId } = moduleInfo;
    const [ functionGroupData, functionGroupDataSet ] = useState();
    const [ functionData, functionDataSet ] = useState();

    // 拉取权限组和权限值
    useEffect(() => {
      if (moduleId) {
        fetchModulePermission();
        // console.info('fetch module group');
      }
    }, [ moduleId ]);

    // 转化生成权限树
    useEffect(() => {
      if (functionGroupData && functionData) {
        treeDataSet(transformPermissionTree(functionGroupData, functionData));
      }
    }, [ functionGroupData, functionData ]);

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
              <Tabs type="card" activeKey={activeTabKey}>
                <Tabs.TabPane tab="提示" key="index" disabled>
                  <div style={{ padding: '20px' }}>
                    点击左侧进行操作
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="添加分类" key="groupEditor" disabled>
                  <div style={{ padding: '20px' }}>
                    <SMForm hook={hookGroupEditorForm} />
                    <div style={{ textAlign: 'center' }}><Button onClick={submitGroup}>提交</Button></div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="添加权限" key="permissionEditor" disabled>
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

    function fetchModulePermission () {
      loadingSet(true);

      Promise.all([
        api.module.functionGroup.list({ id: moduleId }),
        api.module.function.list({ id: moduleId }),
      ]).then(([ functionGroupData, functionData ]) => {
        loadingSet(false);
        functionGroupDataSet(functionGroupData);
        functionDataSet(functionData);
      });
    }

    function submitGroup () {
      hookGroupEditorForm.validate()
        .then(({ label, symbol }) => {
          const { id, parentId } = groupEditorValues;
          if (id) {
            return api.module.functionGroup.modify({ id, label, symbol });
          }
          return api.module.functionGroup.create({ moduleId, parentId, label, symbol });
        })
        .then(() => {
          activeTabKeySet('index');
          fetchModulePermission();
        });
    }

    // 转化权限树
    function transformPermissionTree (functionGroupData, functionData) {
      const groupMap = {
        0: {
          label: moduleInfo.label,
          key: '0',
          title,
          children: [],
        },
      };
      const rootChildren = groupMap[0].children;


      console.info({ rootChildren });

      functionGroupData.forEach(({ id, label, symbol, parentId }) => {
        let groupItem = groupMap[id];
        if (!groupItem) {
          groupItem = groupMap[id] = { children: [] };
        }
        Object.assign(groupItem, { id, label, symbol, parentId, title });

        if (parentId) {
          let parentGroupItem = groupMap[parentId];
          if (!parentGroupItem) {
            parentGroupItem = groupMap[parentId] = { children: [] };
          }
          parentGroupItem.children.push(groupItem);
        } else {
          rootChildren.push(groupItem);
        }
      });
      makeKey(groupMap[0].children, '0');

      return [ groupMap[0] ];

      function title ({ id, label, key, parentId, groupId, isLeaf }) {
        return (
          <div className={styles.treeItem} key={key}>
            {label}
            <div className={styles.treeButtonBox}>
              {isLeaf
                ? (<Space>xx</Space>)
                : (
                  <Space>
                    {id && (
                      <Tooltip placement="top" title="添加权限">
                        <span onClick={(e) => {
                          activeTabKeySet('permissionEditor');

                          e.stopPropagation();
                        }}
                        ><PlusCircleOutlined />
                        </span>
                      </Tooltip>
                    )}
                    <Tooltip placement="top" title="添加子分组">
                      <span onClick={(e) => {
                        activeTabKeySet('groupEditor');
                        groupEditorValuesSet({
                          parentId: id,
                          label: '',
                          symbol: '',
                        });
                        e.stopPropagation();
                      }}
                      ><PlusOutlined />
                      </span>
                    </Tooltip>

                    {id && (
                      <>
                        <Tooltip placement="top" title="修改分组">
                          <span onClick={(e) => {
                            activeTabKeySet('groupEditor');
                            e.stopPropagation();
                          }}
                          ><EditOutlined />
                          </span>
                        </Tooltip>
                        <Tooltip placement="top" title="删除分组">
                          <span onClick={(e) => {
                            Modal.confirm({
                              title: '确定删除该分组？',
                              content: '只允许删除空分组',
                              onOk: () => api.module.functionGroup
                                .delete({ id })
                                .then(() => {
                                  fetchModulePermission();
                                }),
                            });
                            e.stopPropagation();
                          }}
                          ><DeleteOutlined />
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </Space>
                )}
              {/* 添加分类|添加权限|编辑|删除 */}
              {/* 编辑|删除 */}
            </div>
          </div>
        );
      }

      function makeKey (children, parentKey) {
        children.forEach((item) => {
          item.key = `${parentKey}-${item.id}`;
          if (item.children && item.children.length) {
            makeKey(item.children, item.key);
          }
        });
      }
    }
  }
}
