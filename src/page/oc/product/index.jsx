
import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Popconfirm, Row, Col, Tree, Tooltip, Modal, Input, Form } from 'antd';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao';
import { api } from '@/api';
import { PlusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, LogoutOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

export default Product;


function Product () {
  const hookTable = initHookTable();
  const hookCreateDialog = initHookCreateDialog();
  const hookSpecTypeSettingDialog = initHookSpecTypeSettingDialog();
  const hookSpecValueSettingDialog = initHookSpecValueSettingDialog();

  useEffect(() => {
    initHookTable();

    setTimeout(() => {
      hookSpecTypeSettingDialog.open({ id: 1, label: 'SLB' });
    }, 300);
  }, []);

  return (
    <Card>
      <div className={styles.buttonBox}>
        <Button type="primary" onClick={() => hookCreateDialog.open()}>添加产品</Button>
      </div>
      <SMTable hook={hookTable} />
      <SMDialog hook={hookCreateDialog} />
      <SMDialog hook={hookSpecTypeSettingDialog} />
      <SMDialog hook={hookSpecValueSettingDialog} />
    </Card>
  );

  function initHookTable () {
    return {
      columns: [
        { title: '产品名称', dataIndex: 'label', width: '200' },
        { title: '产品标识', dataIndex: 'symbol', width: '200' },
        {
          title: '操作',
          render ({ label, id }) {
            return (
              <Space>
                <Button type="primary" onClick={() => hookSpecTypeSettingDialog.open({ label, id })}>设置规格</Button>
                <Button type="primary" onClick={() => hookSpecValueSettingDialog.open({ label, id })}>设置规格值</Button>
                <Button type="primary">修改</Button>
                <Popconfirm
                  placement="top"
                  title="确定删除"
                  onConfirm={
                    () => api.oc.product.delete({ id })
                      .then(() => hookTable.reload())
                  }
                >
                  <Button type="danger">删除</Button>
                </Popconfirm>
              </Space>
            );
          },
        },
      ],
      dataSource () {
        return api.oc.product.list();
      },
    };
  }

  function initHookCreateDialog () {
    const hookForm = {
      fields: [
        { label: '产品名称', name: 'label', rules: [ { required: true } ] },
        { label: '产品标识', name: 'symbol', rules: [ { required: true } ] },
      ],
    };
    return {
      title: '添加产品',
      render () {
        return <SMForm hook={hookForm} />;
      },
      onSubmit ({ setLoading }) {
        return hookForm.validate()
          .then((values) => api.oc.product.create({
            label: values.label,
            symbol: values.symbol,
          }))
          .then(() => {
            hookTable.reload();
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

  function initHookSpecTypeSettingDialog () {
    const [ loading, loadingSet ] = useState(false);
    const [ productInfo, productInfoSet ] = useState({});
    const [ specList, specListSet ] = useState([]);
    const [ treeData, treeDataSet ] = useState([]);
    const [ specTypeEditorValues, specTypeEditorValuesSet ] = useState(null);
    const [ parentId, parentIdSet ] = useState(null);
    const [ specFields, specFieldsSet ] = useState([]);
    const [ specTypeIsValue, specTypeIsValueSet ] = useState(false);

    const hookSpecTypeEditorForm = {
      values: specTypeEditorValues,
      fields: [
        {
          label: '规格类型',
          name: 'type',
          maxlength: 32,
          rules: [ { required: true } ],
          type: 'select',
          options: [
            { label: '级联分组', value: 'GROUP' },
            { label: '值分组', value: 'VALUE' },
          ],
        },
        {
          label: '规格名称',
          name: 'label',
          maxlength: 32,
          rules: [ { required: true } ],
        },
        {
          label: '规格标识',
          name: 'symbol',
          maxlength: 128,
          rules: [ { required: true } ],
        },
        {
          label: '规格字段',
          customRender (...args) {
            console.info({ args, specFields });
            return (
              <div style={{ lineHeight: '36px' }}>

                {/* <Row>
                  <Col span={12}>
                    字段名
                  </Col>
                  <Col span={12}>
                    字段标识
                  </Col>
                </Row> */}

                <Form.List name="fields">

                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Form.Item
                            {...field}
                            name={[ field.name, 'label' ]}
                            fieldKey={[ field.fieldKey, 'label' ]}
                            rules={[ { required: true, message: '请输入字段名称' } ]}
                          >
                            <Input placeholder="字段名称" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[ field.name, 'symbol' ]}
                            fieldKey={[ field.fieldKey, 'symbol' ]}
                            rules={[ { required: true, message: '请输入字段名称' } ]}
                          >
                            <Input placeholder="字段标识" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加字段
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            );
          },
          visible: () => specTypeIsValue,
        },

      ],
    };


    useEffect(() => {
      setTreeData(specList);
    }, [ specList ]);

    return {
      title: `${'设置规格类型 - '}${productInfo.label}`,
      loading,
      width: 900,
      render () {
        return (
          <Row style={{ minHeight: '480px' }}>
            <Col span={14}>
              <Tree
                treeData={treeData}
                height={480}
                blockNode
                showLine
              />
            </Col>
            <Col span={10}>
              <div style={{ padding: '20px' }}>
                {
                  specTypeEditorValues ? (
                    <>
                      <SMForm
                        hook={hookSpecTypeEditorForm}
                        onValuesChange={(changeValues, allValues) => {
                          const { type } = changeValues;
                          // 设置规格节点的类型时，切换是否显示添加字段的表单
                          if (type) {
                            specTypeIsValueSet(type === 'VALUE');
                          }
                        }}
                      />
                      <Space style={{ marginLeft: '100px' }}>
                        <Button type="primary" onClick={submitSpecTypeEditor}>提交</Button>
                        <Button onClick={() => specTypeEditorValuesSet(null)}>取消</Button>
                      </Space>
                    </>
                  ) : (<div>请点击左侧编辑</div>)
                }

              </div>
            </Col>
          </Row>
        );
      },
      onOpen (hook, { id, label, type }) {
        specTypeEditorValuesSet(null);
        productInfoSet({ id, label, type });
        loadingSet(true);
        fetchSpecTypeList(id);
      },
    };

    function fetchSpecTypeList (productId) {
      return api.oc.spec.type.list({ productId })
        .then(({ list }) => {
          specListSet(list);
        })
        .finally(() => {
          loadingSet(false);
        });
    }

    function setTreeData (list) {
      const groupMap = {
        0: {
          label: productInfo.label,
          key: '0',
          title,
          children: [],
          type: 'GROUP',
        },
      };

      const rootChildren = groupMap[0].children;

      list.forEach(({ id, label, type, symbol, parentId }) => {
        let groupItem = groupMap[id];
        if (!groupItem) {
          groupItem = groupMap[id] = { children: [] };
        }
        Object.assign(groupItem, { id, label, type, symbol, parentId, title });

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

      treeDataSet([ groupMap[0] ]);

      function title ({ id, label, type, key, symbol, parentId, groupId, isLeaf }) {
        return (
          <div className={styles.treeItem} key={key}>
            {label}
            <div className={styles.treeButtonBox}>
              {isLeaf
                ? (
                  <Space>
                    <Tooltip placement="top" title="修改权限">
                      <span onClick={(e) => {
                        // activeTabKeySet('permissionEditor');
                        // permissionEditorValuesSet({
                        //   id,
                        //   label,
                        //   symbol,
                        // });
                        e.stopPropagation();
                      }}
                      ><EditOutlined />
                      </span>
                    </Tooltip>
                    <Tooltip placement="top" title="删除权限">
                      <span onClick={(e) => {
                        Modal.confirm({
                          title: '确定删除该权限？',
                          content: '只允许删除未使用的权限',
                          // onOk: () => api.manager.module.function
                          //   .delete({ id })
                          //   .then(() => {
                          //     fetchModulePermission();
                          //   }),
                        });
                        e.stopPropagation();
                      }}
                      ><DeleteOutlined />
                      </span>
                    </Tooltip>
                  </Space>
                )
                : (
                  <Space>
                    {type === 'GROUP' && (
                      <Tooltip placement="top" title="添加子规格">
                        <span onClick={(e) => {
                          specTypeEditorValuesSet({
                            parentId: id,
                            label: '',
                            symbol: '',
                          });
                          e.stopPropagation();
                        }}
                        ><PlusOutlined />
                        </span>
                      </Tooltip>
                    )}
                    {id && (
                      <>
                        <Tooltip placement="top" title="修改规则">
                          <span onClick={(e) => {
                            specTypeEditorValuesSet({
                              specId: id,
                              label,
                              symbol,
                              type,
                            });
                            e.stopPropagation();
                          }}
                          ><EditOutlined />
                          </span>
                        </Tooltip>
                        <Tooltip placement="top" title="删除规格">
                          <span onClick={(e) => {
                            Modal.confirm({
                              title: '确定删除该规格？',
                              content: '只允许删除空规格',
                              onOk: () => api.oc.spec.type
                                .delete({ id })
                                .then(() => {
                                  fetchSpecTypeList(productInfo.id);
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

    function submitSpecTypeEditor () {
      hookSpecTypeEditorForm.validate()
        .then((values) => {
          console.info({ values });
          return values;
        })
        .then(({ type, label, symbol, fields }) => {
          const { parentId, specId } = specTypeEditorValues;

          console.info({ type, label, symbol, fields, specId, productId: productInfo.id, parentId });

          if (specId) {
            return api.oc.spec.type.modify({ specId, type, label, symbol, fields });
          }
          return api.oc.spec.type.create({ type, label, symbol, parentId, productId: productInfo.id, fields });
        })
        .then(() => {
          specTypeEditorValuesSet(null);
          fetchSpecTypeList(productInfo.id);
        });
    }
  }

  function initHookSpecValueSettingDialog () {
    const [ loading, loadingSet ] = useState(false);
    const [ productInfo, productInfoSet ] = useState({});
    const [ specTypeList, specTypeListSet ] = useState([]);
    const [ specValueList, specValueListSet ] = useState([]);
    const [ treeData, treeDataSet ] = useState([]);
    const [ specValueEditorValues, specValueEditorValuesSet ] = useState(null);
    const [ specTypeMap, specTypeMapSet ] = useState({});
    const [ specTypeLabelMap, specTypeLabelMapSet ] = useState({});
    const [ specTypeOptions, specTypeOptionsSet ] = useState([]);

    const hookSpecValueEditorForm = {
      values: specValueEditorValues,
      fields: [
        {
          label: '规格类型',
          name: 'specTypeId',
          type: 'select',
          options: specTypeOptions,
          rules: [ { required: true } ],
          visible: (option) => !specValueEditorValues.specValueId,
        },
        {
          label: '规格名称',
          name: 'label',
          maxlength: 32,
          rules: [ { required: true } ],
        },
      ],
    };

    useEffect(() => {
      setTreeData(specValueList);
    }, [ specValueList ]);

    useEffect(() => {
      const specTypeMap = {};
      const specTypeLabelMap = {};

      specTypeList.forEach(({ id, label, parentId }) => {
        if (!specTypeMap[parentId]) {
          specTypeMap[parentId] = [];
        }

        specTypeLabelMap[id] = label;

        specTypeMap[parentId].push({
          label,
          value: id,
        });
      });

      specTypeMapSet(specTypeMap);
      specTypeLabelMapSet(specTypeLabelMap);
    }, [ specTypeList ]);

    return {
      title: `${'设置规格值 - '}${productInfo.label}`,
      loading,
      width: 900,
      render () {
        console.info({ specTypeOptions });
        return (
          <Row style={{ minHeight: '480px' }}>
            <Col span={14}>
              <Tree
                treeData={treeData}
                height={480}
                blockNode
                showLine
              />
            </Col>
            <Col span={10}>
              <div style={{ padding: '20px' }}>

                <Editor />

                {/* {
                  specValueEditorValues ? (
                    <>
                      <SMForm hook={hookSpecValueEditorForm} />
                      <Space style={{ marginLeft: '100px' }}>
                        <Button type="primary" onClick={submitSpecValueEditor}>提交</Button>
                        <Button onClick={() => specValueEditorValuesSet(null)}>取消</Button>
                      </Space>
                    </>
                  ) : (<div>请点击左侧编辑</div>)
                } */}

              </div>
            </Col>
          </Row>
        );

        function Editor () {
          if (!specValueEditorValues) {
            return (<div>请点击左侧编辑</div>);
          }

          if (specTypeOptions) {
            return <SpecValueEditor />;
          }

          return <SpecGroupEditor />;
        }

        function SpecValueEditor () {
          return (
            <>
              <SMForm hook={hookSpecValueEditorForm} />
              <Space style={{ marginLeft: '100px' }}>
                <Button type="primary" onClick={submitSpecValueEditor}>提交</Button>
                <Button onClick={() => specValueEditorValuesSet(null)}>取消</Button>
              </Space>
            </>
          );
        }

        function SpecGroupEditor () {
          return (
            <>
              <SMForm hook={hookSpecValueEditorForm} />
              <Space style={{ marginLeft: '100px' }}>
                <Button type="primary" onClick={submitSpecValueEditor}>提交</Button>
                <Button onClick={() => specValueEditorValuesSet(null)}>取消</Button>
              </Space>
            </>
          );
        }
      },
      onOpen (hook, { id, label }) {
        productInfoSet({ id, label });
        loadingSet(true);
        Promise.all([
          fetchSpecTypeList(id),
          fetchSpecValueList(id),
        ])
          .then(() => {
            loadingSet(false);
          });
      },
    };

    function fetchSpecTypeList (productId) {
      return api.oc.spec.type.list({ productId })
        .then(({ list }) => {
          specTypeListSet(list);
        });
    }

    function fetchSpecValueList (productId) {
      return api.oc.spec.value.list({ productId })
        .then(({ list }) => {
          specValueListSet(list);
        });
    }

    function submitSpecValueEditor () {
      hookSpecValueEditorForm.validate()
        .then(({ label, specTypeId }) => {
          const { parentId, specValueId } = specValueEditorValues;

          // console.info({ label, symbol, parentId, productId: productInfo.id });

          // 修改
          if (specValueId) {
            return api.oc.spec.value.modify({ specValueId, label });
          }
          return api.oc.spec.value.create({ label, parentId, productId: productInfo.id, specTypeId });
        })
        .then(() => {
          specValueEditorValuesSet(null);
          fetchSpecValueList(productInfo.id);
        });
    }

    function setTreeData (list) {
      const groupMap = {
        0: {
          label: productInfo.label,
          key: '0',
          title,
          children: [],
        },
      };

      const rootChildren = groupMap[0].children;

      list.forEach(({ id, label, symbol, parentId, specTypeId }) => {
        let groupItem = groupMap[id];
        if (!groupItem) {
          groupItem = groupMap[id] = { children: [] };
        }
        Object.assign(groupItem, { id, label, symbol, parentId, title, specTypeId });

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

      treeDataSet([ groupMap[0] ]);

      function title ({ id, label, key, symbol, parentId, groupId, isLeaf, specTypeId }) {
        return (
          <div className={styles.treeItem} key={key}>
            {specTypeLabelMap[specTypeId]} ({label})
            <div className={styles.treeButtonBox}>
              {isLeaf
                ? (
                  <Space>
                    <Tooltip placement="top" title="修改权限">
                      <span onClick={(e) => {
                        // activeTabKeySet('permissionEditor');
                        // permissionEditorValuesSet({
                        //   id,
                        //   label,
                        //   symbol,
                        // });
                        e.stopPropagation();
                      }}
                      ><EditOutlined />
                      </span>
                    </Tooltip>
                    <Tooltip placement="top" title="删除权限">
                      <span onClick={(e) => {
                        Modal.confirm({
                          title: '确定删除该权限？',
                          content: '只允许删除未使用的权限',
                          // onOk: () => api.manager.module.function
                          //   .delete({ id })
                          //   .then(() => {
                          //     fetchModulePermission();
                          //   }),
                        });
                        e.stopPropagation();
                      }}
                      ><DeleteOutlined />
                      </span>
                    </Tooltip>
                  </Space>
                )
                : (
                  <Space>
                    <Tooltip placement="top" title="添加子级规格值">
                      <span onClick={(e) => {
                        specValueEditorValuesSet({
                          parentId: id,
                          label: '',
                          symbol: '',
                        });
                        setSpecTypeOptions(specTypeId);
                        e.stopPropagation();
                      }}
                      ><PlusOutlined />
                      </span>
                    </Tooltip>

                    {id && (
                      <>
                        <Tooltip placement="top" title="修改规则">
                          <span onClick={(e) => {
                            specValueEditorValuesSet({
                              specValueId: id,
                              label,
                              symbol,
                            });
                            e.stopPropagation();
                          }}
                          ><EditOutlined />
                          </span>
                        </Tooltip>
                        <Tooltip placement="top" title="删除规格">
                          <span onClick={(e) => {
                            Modal.confirm({
                              title: '确定删除该规格？',
                              content: '只允许删除空规格',
                              onOk: () => api.oc.spec.type
                                .delete({ id })
                                .then(() => {
                                  fetchSpecTypeList(productInfo.id);
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

    function setSpecTypeOptions (parentId = null) {
      specTypeOptionsSet(specTypeMap[parentId]);
    }
  }
}
