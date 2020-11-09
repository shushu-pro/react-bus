import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, List, Skeleton, Avatar, message } from 'antd'
import { Link } from 'react-router-dom'
import { api } from '@/api'
import { SMDialog, SMForm } from '@/package/shanmao'
import './index.less'

export default function home () {
  const [ allProjectList, setAllProjectList ] = useState([])
  const [ projectLoading, projectLoadingSet ] = useState(true)
  const [ myProjectList, myProjectListSet ] = useState([])
  const hookCreateProjectDialog = {
    title: '创建项目',
    onOpen: () => hookCreateProjectForm.resetFields(),

    onSubmit: ({ setLoading }) => hookCreateProjectForm.validate()
      .then((values) => api.project.create(values))
      .then(() => {
        message.success('操作成功')
        getMyProjects()
        getAllProjects()
      })
      .finally(() => {
        setLoading(false)
      }),
    render: () => (
      <SMForm hook={hookCreateProjectForm} />
    ),
  }
  const hookCreateProjectForm = {
    gridLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
    },
    data: {
      name: '',
      description: '',
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

  useEffect(() => {
    getAllProjects()
    getMyProjects()
  }, [])

  return (
    <div className="page-home">
      <Row gutter={[ 20, 40 ]}>
        <Col span={12}>
          <Card
            title="我的项目"
            extra={(
              <Button type="primary" onClick={() => hookCreateProjectDialog.open()}>
                创建项目
              </Button>
            )}
          >
            <List
              item-layout="horizontal"
              dataSource={myProjectList}
              loading={projectLoading}
              renderItem={(project) => (
                <List.Item
                  actions={(
                    [ <Button type="danger" onClick={() => unfollowProject(project)}>取消关注</Button> ]
                  )}
                >
                  <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png" />
                      }
                      title={(
                        <Link to={`/project/${project.id}`}>
                          { project.name }
                        </Link>
                      )}
                      description={project.description}
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="全部项目">
            <List
              item-layout="horizontal"
              dataSource={allProjectListForView()}
              loading={projectLoading}
              renderItem={(project) => (
                <List.Item
                  actions={(
                    [ project.isFollow
                      ? <Button type="danger" onClick={() => unfollowProject(project)}>取消关注</Button>
                      : <Button type="primary" onClick={() => onfollowProject(project)}>添加关注</Button>,
                    ]
                  )}
                >
                  <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png" />
                      }
                      title={(
                        <Link to={`/project/${project.id}`}>
                          { project.name }
                        </Link>
                      )}
                      description={project.description}
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <SMDialog hook={hookCreateProjectDialog} />
    </div>
  )

  function getMyProjects () {
    // 我的项目
    projectLoadingSet(true)
    api.user.favoriteProjects().then((data) => {
      myProjectListSet(data.list)
    }).finally(() => [
      projectLoadingSet(false),
    ])
  }

  function getAllProjects () {
    // 所有项目
    projectLoadingSet(true)
    api.project.alls().then((data) => {
      setAllProjectList(data)
    }).finally(() => [
      projectLoadingSet(false),
    ])
  }

  function allProjectListForView () {
    const myProjectIds = myProjectList.map((project) => project.id)
    return allProjectList.map((project) => {
      project.isFollow = myProjectIds.includes(project.id)
      return project
    })
  }

  function unfollowProject ({ id, name }) {
    api.user.removeProjectFavorite({ id }).then(() => {
      message.success(`项目“${name}”已取消`)
      getMyProjects()
    })
  }

  function onfollowProject ({ id, name }) {
    api.user.addProjectFavorite({ id }).then(() => {
      message.success(`项目“${name}”已关注`)
      getMyProjects()
    })
  }
}
