import React, { useEffect, useState } from 'react';
import { Button, Layout, message, Tree, Tooltip, Modal } from 'antd';

import { useRouteMatch, Link } from 'react-router-dom';
import { SMDialog, SMForm } from '@/package/shanmao';
import { api } from '@/api';
import adapter from '@shushu.pro/adapter';
import { PlusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import tower from '@/package/tower';

import { useRoute } from '@/router';
import styles from './index.less';

export default AppSidebar;

function AppSidebar () {
  const { query: { appId } } = useRoute();
  const [ sidebarTop, sidebarTopSet ] = useState(65);
  const [ appDetail, appDetailSet ] = useState({});
  const [ rawCategorys, rawCategorysSet ] = useState(null);
  const [ appApiList, appApiListSet ] = useState(null);
  const [ parentId, parentIdSet ] = useState();
  const hookProjectAddCategoryForm = {
    data: {
      name: '',
    },
    gridLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
    },
    fields: [
      [ '分类名称', 'name', {
        placeholder: '请输入分类名称',
        maxlength: 10,
        rules: [
          { required: true, message: '请输入分类名称' },
        ],
      } ],
    ],
  };

  const hookProjectAddCategoryDialog = {
    title: '添加分类',
    onOpen: (hook, parentId) => {
      parentIdSet(parentId);
    },
    onSubmit: ({ setLoading }) => hookProjectAddCategoryForm
      .validate()
      .then((values) => api.app.category.create({
        appId,
        parentId,
        name: values.name,
      })
        .then(() => {
          message.success('操作成功');
          fetchAppCategoryList();
        }))
      .finally(() => {
        setLoading(false);
      }),
    afterClose () {
      hookProjectAddCategoryForm.resetFields();
    },
    render: () => (<SMForm hook={hookProjectAddCategoryForm} />),
  };

  useEffect(() => {
    fetchAppDetail();
    fetchAppCategoryList();
    fetchAppApiList();

    const who = Symbol('this');
    tower.listen('API_UPDATE', () => {
      fetchAppApiList();
    }, who);

    window.addEventListener('scroll', scroll);
    return () => {
      tower.leave(who);
      window.removeEventListener('scroll', scroll);
    };
    function scroll () {
      sidebarTopSet(Math.max(0, 65 - Math.round(window.document.documentElement.scrollTop)));
    }
  }, []);

  return (
    <Layout.Sider
      className={styles.sidebar}
      theme="light"
      width={360}
      style={{
        overflow: 'auto',
        height: `calc(100vh - ${sidebarTop}px)`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }}
    >
      {renderTopbar()}
      {renderAPITree()}
    </Layout.Sider>
  );

  function renderTopbar () {
    const hookProjectSettingForm = {
      data: appDetail,
      gridLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
      fields: [
        [ '项目名称', 'name', {
          maxlength: 10,
          rules: [
            { required: true, message: '请输入项目名称' },
          ],
        } ],
        [ '项目描述', 'description', {
          maxlength: 40,
        } ],
      ],
    };

    const hookProjectSettingDialog = {
      title: '项目设置',
      okButtonProps: {
        props: {
          loading: false,
        },
      },
      onOpen: () => {
        hookProjectSettingForm.resetFields();
      },
      onClose: () => {

      },
      onSubmit: ({ setLoading }) => hookProjectSettingForm
        .validate()
        .then((values) => api.app
          .modify({ ...values, id: appId })
          .then(() => {
            message.success('操作成功');
            fetchAppDetail();
          }))
        .finally(() => {
          setLoading(false);
        }),
      render: () => (<SMForm hook={hookProjectSettingForm} />),
    };


    return (
      <div className={styles.topbar}>
        <h3>
          <span className={styles.appName} title={appDetail.name}>{ appDetail.name || 'loading...' }</span>
          <Button
            type="primary"
            style={{ float: 'right' }}
            onClick={() => hookProjectSettingDialog.open()}
          >
            项目设置
          </Button>
          <Button
            type="primary"
            style={{ float: 'right', marginRight: '8px' }}
            onClick={() => hookProjectAddCategoryDialog.open()}
          >
            添加分类
          </Button>
        </h3>
        <SMDialog hook={hookProjectSettingDialog} />
        <SMDialog hook={hookProjectAddCategoryDialog} />
      </div>
    );
  }

  function renderAPITree () {
    const [ treeData, treeDataSet ] = useState([]);

    const [ hookCreateAPIFormData, hookCreateAPIFormDataSet ] = useState({
      appId,
      name: '',
      path: '',
      method: 0,
      // reqDataFormat: 0,
      categoryId: null,
    });
    const hookCreateAPIForm = {
      data: hookCreateAPIFormData,
      gridLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
      fields: [
        [ '接口名称', 'name', {
          maxlength: 20,
          rules: [
            { required: true, message: '请输入接口名称' },
          ],
        } ],
        [ '接口地址', 'path', {
          maxlength: 64,
          rules: [
            { required: true, message: '请输入接口地址' },
          ],
        } ],
        [ '请求方式', 'method', {
          type: 'select',
          options: [
            { label: 'GET', value: 0 },
            { label: 'POST', value: 1 },
          ],
          rules: [
            { required: true, message: '请选择请求方式' },
          ],
        } ],
      ],
    };
    const hookCreateAPIDialog = {
      title: '创建API',
      onOpen: (hook, categoryId) => {
        hookCreateAPIFormDataSet((data) => ({
          ...data,
          categoryId,
        }));
      },
      onSubmit: ({ setLoading }) => hookCreateAPIForm
        .validate()
        .then((values) => api.app.api.create({ ...hookCreateAPIForm.data, ...values, path: values.path.replace(/^\/+/, '') })
          .then(() => {
            message.success('操作成功');
            fetchAppApiList();
          }))
        .finally(() => {
          setLoading(false);
        }),
      afterClose () {
        hookCreateAPIForm.resetFields();
      },
      render: () => <SMForm hook={hookCreateAPIForm} kl={hookCreateAPIFormData} />,
    };

    const [ hookModifyCategoryFormData, hookModifyCategoryFormDataSet ] = useState({});
    const hookModifyCategoryForm = {
      data: hookModifyCategoryFormData,
      gridLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
      fields: [
        [ '分类名称', 'name', {
          maxlength: 10,
          rules: [
            { required: true, message: '请输入分类名称' },
          ],
        } ],
      ],
    };
    const hookModifyCategoryDialog = {
      title: '分类设置',
      onOpen: (hook, { name, id }) => {
        hookModifyCategoryFormDataSet({ id, name });
      },
      afterClose: () => {
        hookModifyCategoryForm.resetFields();
      },
      onSubmit: ({ setLoading }) => hookModifyCategoryForm.validate()
        .then((values) => api.app.category.modify({ ...values, id: hookModifyCategoryFormData.id }))
        .then(() => {
          message.success('操作成功');
          fetchAppCategoryList();
        })
        .finally(() => {
          setLoading(false);
        }),
      render: () => <SMForm hook={hookModifyCategoryForm} />,
    };

    useEffect(() => {
      if (!rawCategorys || !appApiList) {
        return;
      }

      treeDataSet(transformTreeData(transfromCategorys()));
    }, [ rawCategorys, appApiList ]);

    return (
      <>
        <Tree.DirectoryTree
          draggable
          autoExpandParent
          treeData={treeData}
          onDrop={onDrop}
        />
        <SMDialog hook={hookCreateAPIDialog} />
        <SMDialog hook={hookModifyCategoryDialog} />
      </>
    );

    function transfromCategorys () {
      const categorys = [];
      const parentCategorys = {};
      const allCategorys = {};
      rawCategorys.forEach((category) => {
        const { parentId } = category;
        if (parentId) {
          parentCategorys[parentId] = parentCategorys[parentId] || [];
          parentCategorys[parentId].push(category);
        } else {
          categorys.push(category);
        }

        // 用于挂载API的分类索引
        if (!allCategorys[category.id]) {
          allCategorys[category.id] = category;
        }
      });

      rawCategorys.forEach((category) => {
        category.children = parentCategorys[category.id] || [];
      });


      const unCategoryApis = [];
      const allCategorysIds = Object.keys(allCategorys).map((item) => Number(item));

      appApiList.forEach((apiInfo) => {
        const { parentId } = apiInfo;
        if (allCategorysIds.includes(parentId)) {
          allCategorys[parentId].children.push(apiInfo);
          apiInfo.key = `${parentId}-${apiInfo.id}`;
        } else {
          unCategoryApis.push(apiInfo);
          apiInfo.key = `#${apiInfo.id}`;
        }
      });

      categorys.unshift({
        title: '未分类',
        key: '#',
        children: unCategoryApis,
      });

      // console.info({ categorys })

      return categorys;
    }

    function transformTreeData (categorys) {
      const titleFactory = (title, { row: { key, id, parentId, isLeaf } }) => {
        // eslint-disable-next-line no-nested-ternary
        const titleType = isLeaf ? 'api' : (parentId ? 'cat2' : 'cat1');

        let titleContent;

        if (titleType === 'api') {
          titleContent = (
            <Link to={`/app/api?appId=${appId}&apiId=${id}`} style={{ display: 'block' }}>
              {title}
              <span className={styles.btns}>
                <Tooltip placement="top" title="删除接口">
                  <span onClick={(e) => {
                    Modal.confirm({
                      title: '确定删除该接口？',
                      content: '注意：删除后不可恢复！',
                      onOk: () => api.app.api
                        .delete({ id })
                        .then(() => {
                          fetchAppApiList();
                        }),
                      onCancel () {},
                    });
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  ><DeleteOutlined />
                  </span>
                </Tooltip>
              </span>
            </Link>
          );
        } else {
          titleContent = (
            <span>
              {title}
              <span className={styles.btns}>
                <Tooltip placement="top" title="添加接口">
                  <span onClick={(e) => {
                    hookCreateAPIDialog.open(id);
                    e.stopPropagation();
                  }}
                  ><PlusCircleOutlined />
                  </span>
                </Tooltip>
                {
                  key !== '#' && titleType === 'cat1' && (
                    <Tooltip
                      placement="top"
                      title="添加子分类"
                    >
                      <span onClick={(e) => {
                        hookProjectAddCategoryDialog.open(id);
                        e.stopPropagation();
                      }}
                      ><PlusOutlined />
                      </span>
                    </Tooltip>
                  )
                }
                {key !== '#' && (
                  <Tooltip placement="top" title="修改分类">
                    <span onClick={(e) => {
                      hookModifyCategoryDialog.open({ id, name: title });
                      e.stopPropagation();
                    }}
                    ><EditOutlined />
                    </span>
                  </Tooltip>
                )}
                {key !== '#' && (
                  <Tooltip placement="top" title="删除分类">
                    <span onClick={(e) => {
                      Modal.confirm({
                        title: '确定删除该分类？',
                        content: '删除分类不会删除存在的接口',
                        onOk: () => api.app.category
                          .delete({ appId, id })
                          .then(() => {
                            fetchAppCategoryList();
                          }),
                      });
                      e.stopPropagation();
                    }}
                    ><DeleteOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            </span>
          );
        }
        // console.info({ titleContent })
        return () => (
          <div className={styles[`${titleType}-title`]}>
            {titleContent}
          </div>
        );
      };
      return adapter({
        key: String,
        isLeaf: true,
        title: titleFactory,
        children: {
          key: String,
          isLeaf: true,
          title: titleFactory,
          children: {
            key: String,
            isLeaf: true,
            title: titleFactory,
          },
        },
      }, categorys);
    }

    function onDrop (info) {
      const dropKey = String(info.node.props.eventKey);
      const dragKey = String(info.dragNode.props.eventKey);

      // 分类类目不能移动到未分类
      if (dropKey.indexOf('#') !== -1 && /^(\d+)$/.test(dragKey)) {
        return;
      }

      api.app.category
        .move({
          appId, selfId: dragKey, targetId: dropKey,
        })
        .then(() => {
          fetchAppCategoryList();
          fetchAppApiList();
        });
    }
  }

  function fetchAppDetail () {
    api.app.detail({ id: appId })
      .then((detail) => {
        appDetailSet(detail);
      });
  }

  function fetchAppCategoryList () {
    api.app.category.list({ appId })
      .then(({ list: data }) => {
        rawCategorysSet(data);
      });
  }

  function fetchAppApiList () {
    api.app.api.list({ appId })
      .then(({ list: data }) => {
        appApiListSet(data);
      });
  }
}
