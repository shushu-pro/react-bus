import React, { useState, useEffect } from 'react';
import { Card, Button, message, Popconfirm, notification, Space, Row, Col, Tree, Tabs, Tooltip, Modal } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao/';
import { api } from '@/api/';
import { textCopy, mockJSON } from '@/util';
import { PlusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from './index.less';

export default Role;

function Role () {
  const hookDataList = createHookDataList();
  const hookRoleSettingDialog = createHookRoleSettingDialog();
  const hookRoleModifyDialog = createHookRoleModifyDialog();

  return (
    <Card>
      <ButtonBox />
      <SMTable hook={hookDataList} />
      <SMDialog hook={hookRoleSettingDialog} />
      <SMDialog hook={hookRoleModifyDialog} />
    </Card>
  );

  function ButtonBox () {
    const hookCreateForm = {
      fields: [
        { label: '角色名称', name: 'label', maxlength: 32, rules: [ { required: true } ] },
        // { label: '角色标识', name: 'symbol', maxlength: 128, rules: [ { required: true } ] },
      ],
    };
    const hookCreateDialog = {
      title: '创建角色',
      render () {
        return (<SMForm hook={hookCreateForm} />);
      },
      onSubmit ({ setLoading }) {
        return hookCreateForm.validate()
          .then((values) => api.role.create(values))
          .then(() => hookDataList.reload())
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
          <Button type="primary" onClick={() => hookCreateDialog.open()}>创建角色</Button>
        </div>
        <SMDialog hook={hookCreateDialog} />
      </>
    );
  }

  function createHookDataList () {
    return {
      columns: [
        { title: '角色名称', dataIndex: 'label', width: 200 },
        {
          title: '操作',
          render: (row) => (
            <>
              <Space>
                <Button onClick={() => hookRoleSettingDialog.open({ id: row.id })}>设置权限</Button>
                <Button onClick={() => hookRoleModifyDialog.open({ id: row.id, label: row.label })}>修改名称</Button>
                <Popconfirm placement="top" title="确定删除" onConfirm={() => submitDelete(row.id)}>
                  <Button type="danger">删除</Button>
                </Popconfirm>
              </Space>
            </>
          ),
        },

      ],
      dataSource: (params) => api.role.list(params),
      scroll: { x: 600 },
    };

    function submitDelete (id) {
      api.role.delete({ id }).then(() => {
        hookDataList.reload();
      });
    }
  }

  function createHookRoleModifyDialog () {
    const [ formValues, formValuesSet ] = useState({});
    const hookForm = {
      values: formValues,
      fields: [
        { label: '角色名称', name: 'label', maxlength: 32, rules: [ { required: true } ] },
      ],
    };
    return {
      title: '修改角色名称',
      render () {
        return (
          <SMForm hook={hookForm} />
        );
      },
      onOpen (hook, { id, label }) {
        formValuesSet({
          id,
          label,
        });
      },
      onSubmit ({ setLoading }) {
        return hookForm.validate()
          .then(({ label }) => api.role.modify({ id: formValues.id, label }))
          .then(() => {
            hookDataList.reload();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };
  }

  function createHookRoleSettingDialog () {
    const [ roleId, roleIdSet ] = useState();
    const [ loading, loadingSet ] = useState(false);
    const [ roleSettingData, roleSettingDataSet ] = useState({
      moduleList: [], // 模块列表
      moduleFunctionList: [], // 权限因子列表
      moduleFunctionGroupList: [], // 权限分组列表
      rolePermissionList: [], // 角色权限列表
    });
    const [ treeData, treeDataSet ] = useState([]);
    const [ checkedKeys, checkedKeysSet ] = useState([]);

    // 角色发生变化，则重新拉取角色权限
    useEffect(() => {
      if (roleId) {
        fetchRolePermission();
      }
    }, [ roleId ]);

    // 角色数据发生变化，重新生成权限树
    useEffect(() => {
      transformTreeData();
    }, [ roleSettingData ]);
    // console.info({ treeData });
    return {
      title: '设置权限',
      loading,
      height: 480,
      render () {
        return (
          <div style={{ minHeight: '400px' }}>
            <Tree
              treeData={treeData}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              checkable
              showLine
              blockNode
              height={400}
            />
          </div>
        );
      },
      onOpen (hook, { id }) {
        roleIdSet(id);
      },
      onSubmit ({ setLoading }) {
        const { moduleFunctionList, rolePermissionList } = roleSettingData;
        const modifiedFunctionList = [];
        console.info({ moduleFunctionList });
        moduleFunctionList.map((item) => item.id).forEach((id) => {
          // 1. 添加的，选中了并且不在原始权限
          if (checkedKeys.includes(id) && !rolePermissionList.includes(id)) {
            return modifiedFunctionList.push({ id, enabled: true });
          }

          // 2. 移除的，原来的存在，选中的不存在
          if (!checkedKeys.includes(id) && rolePermissionList.includes(id)) {
            modifiedFunctionList.push({ id, enabled: false });
          }
        });

        console.info({ modifiedFunctionList });
        if (modifiedFunctionList.length > 0) {
          return api.role.permission.modify({ id: roleId, functionList: modifiedFunctionList });
        }
      },
      afterClose () {
        roleIdSet(null);
      },
    };

    function fetchRolePermission () {
      // console.info('拉取角色权限');
      loadingSet(true);
      Promise.all([
        api.module.list(),
        api.module.function.list(),
        api.module.functionGroup.list(),
        api.role.permission.list({ id: roleId }),
      ])
        .then(([ { list: moduleList }, moduleFunctionList, moduleFunctionGroupList, rolePermissionList ]) => {
          loadingSet(false);
          roleSettingDataSet({
            moduleList, moduleFunctionList, moduleFunctionGroupList, rolePermissionList: rolePermissionList.map((item) => item.moduleFunctionId),
          });
        });
    }

    function reloadRolePermission () {
      api.role.permission.list({ id: roleId })
        .then((rolePermissionList) => {
          roleSettingDataSet((prevState) => ({
            ...prevState,
            rolePermissionList: rolePermissionList.map((item) => item.moduleFunctionId),
          }));
        });
    }

    function transformTreeData () {
      const { moduleList, moduleFunctionList, moduleFunctionGroupList, rolePermissionList } = roleSettingData;
      const treeData = [];

      // 模块级
      const moduleMap = {};
      moduleList.forEach(({ id, symbol, label }) => {
        treeData.push(moduleMap[id] = {
          id,
          symbol,
          label,
          children: [],
        });
      });


      // 分组级
      const moduleFunctionGroupMap = {};
      moduleFunctionGroupList.forEach(({ id, label, symbol, moduleId, parentId }) => {
        let functionGroupItem = moduleFunctionGroupMap[id];
        if (!functionGroupItem) {
          functionGroupItem = moduleFunctionGroupMap[id] = {
            id, label, symbol, moduleId, parentId, children: [],
          };
        } else {
          Object.assign(functionGroupItem, {
            id, label, symbol, moduleId, parentId,
          });
        }

        if (parentId) {
          let parentFunctionGroupItem = moduleFunctionGroupMap[parentId];
          // 子级分组
          if (!parentFunctionGroupItem) {
            parentFunctionGroupItem = moduleFunctionGroupMap[parentId] = { children: [] };
          }
          parentFunctionGroupItem.children.push(functionGroupItem);
        } else {
          // 模块级分组
          const parentModuleItem = moduleMap[moduleId];
          if (parentModuleItem) {
            parentModuleItem.children.push(functionGroupItem);
          }
        }
        // let parentGroupItem = moduleFunctionGroupMap[parentId]
        // if(parentGroupItem)
      });

      // 权限
      const moduleFunctionMap = {};
      moduleFunctionList.forEach(({ id, label, symbol, groupId }) => {
        const groupItem = moduleFunctionGroupMap[groupId];
        if (!groupItem) {
          return;
        }
        groupItem.children.push({
          id, label, symbol, isLeaf: true,
        });
      });


      treeDataSet(walkTree(treeData));
      checkedKeysSet([ ...rolePermissionList ]);


      //   console.info({ treeData });

      function title ({ label }) {
        return (<div>{label}</div>);
      }

      function walkTree (treeData) {
        makeKey(treeData, '');

        function makeKey (children, parentKey) {
          const nextChildren = children.filter((item) => item.isLeaf || item.children.length > 0);
          //   console.info({ nextChildren });

          nextChildren.forEach((item) => {
            if (item.isLeaf) {
              item.key = item.id;
            } else {
              item.key = `${parentKey}-${item.id}`;
            }

            item.title = title;
            if (item.children) {
              makeKey(item.children, item.key);
            }
          });

          children.length = 0;
          children.push(...nextChildren);
        }
        return treeData;
      }
    }

    function onCheck (checkedKeys, { checkedNodes }) {
      const nextCheckedKeys = checkedNodes.filter((item) => item.isLeaf).map((item) => item.key);
      checkedKeysSet(nextCheckedKeys);
    //   console.info({ checkedKeys, checkedNodes });
    }
  }
}
