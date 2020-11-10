import React, { useEffect, useState } from 'react'
import { Button, Layout, message, Tree, Tooltip } from 'antd'
import './index.less'
import { useRouteMatch, Link } from 'react-router-dom'
import { SMDialog, SMForm } from '@/package/shanmao'
import { api } from '@/api'
import adapter from '@shushu.pro/adapter'
import { PlusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'


export default ProjectSidebar

function ProjectSidebar () {
  const { params: { projectId } } = useRouteMatch()
  const [ sidebarTop, sidebarTopSet ] = useState(65)
  const [ projectInfo, projectInfoSet ] = useState({})
  const [ rawCategorys, rawCategorysSet ] = useState(null)
  const [ apisTree, apisTreeSet ] = useState(null)

  useEffect(() => {
    getProject()
    getProjectCategorys()
    getProjectApis()

    window.addEventListener('scroll', scroll)
    return () => {
      window.removeEventListener('scroll', scroll)
    }
    function scroll () {
      sidebarTopSet(Math.max(0, 65 - Math.round(window.document.documentElement.scrollTop)))
    }
  }, [])

  return (
    <Layout.Sider
      className="projectSidebar"
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
  )

  function renderTopbar () {
    const hookProjectSettingForm = {
      data: projectInfo,
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
    }

    const hookProjectSettingDialog = {
      title: '项目设置',
      okButtonProps: {
        props: {
          loading: false,
        },
      },
      onOpen: () => {
        hookProjectSettingForm.resetFields()
      },
      onClose: () => {

      },
      onSubmit: ({ setLoading }) => hookProjectSettingForm
        .validate()
        .then((values) => api.project.modify({ ...values, id: projectId })
          .then(() => {
            message.success('操作成功')
            getProject()
          }))
        .finally(() => {
          setLoading(false)
        }),
      render: () => (<SMForm hook={hookProjectSettingForm} />),
    }

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
    }

    const hookProjectAddCategoryDialog = {
      title: '添加分类',
      onOpen: (hook, parentId) => {
        hookProjectAddCategoryForm.data.parentId = parentId
        hookProjectAddCategoryForm.resetFields()
      },
      onSubmit: ({ setLoading }) => hookProjectAddCategoryForm
        .validate()
        .then((values) => api.category.create({
          projectId,
          parentId: hookProjectAddCategoryForm.data.parentId,
          name: values.name,
        })
          .then(() => {
            message.success('操作成功')
            getProject()
          }))
        .finally(() => {
          setLoading(false)
        }),
      render: () => (<SMForm hook={hookProjectAddCategoryForm} />),
    }

    return (
      <div className="topbar">
        <h3>
          <span className="projectName" title={projectInfo.name}>{ projectInfo.name || 'loading...' }</span>
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
            onClick={() => hookProjectAddCategoryDialog.open(3)}
          >
            添加分类
          </Button>
        </h3>
        <SMDialog hook={hookProjectSettingDialog} />
        <SMDialog hook={hookProjectAddCategoryDialog} />
      </div>
    )
  }

  function renderAPITree () {
    const { params: { projectId, apiId } } = useRouteMatch()
    const [ treeData, treeDataSet ] = useState([])
    const [ expandedKeys, expandedKeysSet ] = useState(null)

    // const { projectId, apiId } = route.params

    // // 切换接口详情，自动定位展开树
    // if (projectId && apiId) {
    //   const { key } = this.projectApis.find(item => String(item.id) === apiId)
    //   this.expandedKeys = [ key ]
    // }


    useEffect(() => {
      if (!rawCategorys || !apisTree) {
        return
      }

      treeDataSet(transformTreeData(transfromCategorys()))

      console.info('更新菜单')
    }, [ rawCategorys, apisTree ])


    return (
      <Tree.DirectoryTree
        draggable
        autoExpandParent
        treeData={treeData}
        // defaultExpandAll
        // onSelect={onSelect}
        // onExpand={onExpand}
        //
      />
    )

    function transfromCategorys () {
      const categorys = []
      const parentCategorys = {}
      const allCategorys = {}
      rawCategorys.forEach((category) => {
        const { parentId } = category
        if (parentId) {
          parentCategorys[parentId] = parentCategorys[parentId] || []
          parentCategorys[parentId].push(category)
        } else {
          categorys.push(category)
        }

        // 用于挂载API的分类索引
        if (!allCategorys[category.id]) {
          allCategorys[category.id] = category
        }
      })

      rawCategorys.forEach((category) => {
        category.children = parentCategorys[category.id] || []
      })


      const unCategoryApis = []
      const allCategorysIds = Object.keys(allCategorys).map((item) => Number(item))

      apisTree.forEach((apiInfo) => {
        const { parentId } = apiInfo
        if (allCategorysIds.includes(parentId)) {
          allCategorys[parentId].children.push(apiInfo)
          apiInfo.key = `${parentId}-${apiInfo.id}`
        } else {
          unCategoryApis.push(apiInfo)
          apiInfo.key = `#${apiInfo.id}`
        }
      })

      categorys.unshift({
        title: '未分类',
        key: '#',
        children: unCategoryApis,
      })

      // console.info({ categorys })

      return categorys
    }

    function transformTreeData (categorys) {
      const titleFactory = (title, { row: { key, id, parentId, isLeaf } }) => {
        // eslint-disable-next-line no-nested-ternary
        const titleType = isLeaf ? 'api' : (parentId ? 'cat2' : 'cat1')

        let titleContent

        if (titleType === 'api') {
          titleContent = (
            <Link to={`/project/${projectId}/api/${id}`}>
              {title}
              <span className="btns">
                <Tooltip placement="top" title="删除接口">
                  <span onClick={
                    (e) => {
                      // this.openDeleteAPIDialog(id)
                      e.stopPropagation()
                      e.preventDefault()
                    }
                  }
                  ><DeleteOutlined />
                  </span>
                </Tooltip>
              </span>
            </Link>
          )
        } else {
          titleContent = (
            <span>
              {title}
              <span className="btns">
                <Tooltip placement="top" title="添加接口">
                  <span onClick={
                    (e) => {
                      // this.openCreateAPIDialog(id)
                      e.stopPropagation()
                    }
                  }
                  ><PlusCircleOutlined />
                  </span>
                </Tooltip>
                {
                  key !== '#' && titleType === 'cat1' && (
                    <Tooltip
                      placement="top"
                      title="添加子分类"
                    >
                      <span onClick={
                        (e) => {
                          // this.openCreateCatDialog(id)
                          e.stopPropagation()
                        }
                      }
                      ><PlusOutlined />
                      </span>
                    </Tooltip>
                  )
                }
                {key !== '#' && (
                  <Tooltip placement="top" title="修改分类">
                    <span onClick={
                      (e) => {
                        // this.openEditCatDialog({ id, name: title })
                        e.stopPropagation()
                      }
                    }
                    ><EditOutlined />
                    </span>
                  </Tooltip>
                )}
                {key !== '#' && (
                  <Tooltip placement="top" title="删除分类">
                    <span onClick={
                      (e) => {
                        // this.openDeleteCatDialog(id)
                        e.stopPropagation()
                      }
                    }
                    ><DeleteOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            </span>
          )
        }
        // console.info({ titleContent })
        return () => (
          <div className={`${titleType}-title`}>
            {titleContent}
          </div>
        )
      }
      const treeData = adapter({
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
      }, categorys)
      return treeData
    }
  }

  function getProject () {
    api.project.detail({ id: projectId }).then(({ name, description }) => {
      projectInfoSet({ name, description })
    })
  }

  function getProjectCategorys () {
    api.project.categorys({ projectId })
      .then((data) => {
        rawCategorysSet(data)
      })
  }

  function getProjectApis () {
    api.project.apisTree({ projectId }).then((data) => {
      apisTreeSet(data)
    })
  }
}

// :tree-data="treeData"
// draggable
// :expanded-keys="expandedKeys"
// auto-expand-parent
// @dragenter="onTreeItemDragEnter"
// @drop="onTreeItemDrop"
// @expand="onExpand"
// />
