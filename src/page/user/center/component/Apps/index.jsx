import React from 'react'
import { List, Card } from 'antd'
import { SMForm, SMDialog } from '@/package/shanmao'
import { mockJSON } from '@/util/'
import { useHistory } from 'react-router-dom'
import cover1 from './img/cover/gLaIAoVWTtLbBWZNYEMg.png'
import cover2 from './img/cover/iXjVmWVHbCJAyqvDxdtx.png'
import cover3 from './img/cover/iZBVOIhGJiAnhplqjvZW.png'
import cover4 from './img/cover/uMfMFlvUuceEyPpotzlq.png'
import styles from './index.less'

export default Apps

function Apps ({ hook }) {
  const list = [
  ]

  for (let i = 0; i < 20; i++) {
    list.push({
      id: i,
      title: '一朵云运营平台',
      cover: [ cover1, cover2, cover3, cover4 ][Math.floor(Math.random() * 4)],
      description: '那是一种内在的东西， 他们到达不了，也无法触及的',
    })
  }

  const hookCreateDialog = useHookCreateDialog()
  const hookModifyDialog = useHookModifyDialog()
  const history = useHistory()

  bindExports()

  return (
    <div className={styles.content}>
      {list.length > 0 ? (
        <List
          rowKey="id"
          //  loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <Card hoverable cover={<img alt={item.title} src={item.cover} />} onClick={() => history.push(`/app?id=${item.id}`)}>
                <Card.Meta
                  title={<h3>{item.title}</h3>}
                  description={
                    <div>{item.description}</div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div>
          暂无应用，请联系平台管理添加
        </div>
      )}
      <SMDialog hook={hookCreateDialog} />
      {/* <SMDialog hook={hookModifyDialog} /> */}
    </div>
  )

  function bindExports () {
    hook.openCreateDialog = () => hookCreateDialog.open()
  }

  function useHookCreateDialog () {
    const hookCreateForm = {
      values: {
        name: 'xxx',
      },
      fields: [
        { label: '应用名称', name: 'name', maxlength: 20, rules: [ { required: true, message: '请输入应用名称' } ] },
        { label: '应用描述', name: 'description', maxlength: 40, rules: [ ] },
      ],
    }
    const hookCreateDialog = {
      title: '创建应用',
      render: () => (<SMForm hook={hookCreateForm} />),
      onSubmit ({ setLoading }) {
        return hookCreateForm.validate()
          .then((values) => {

          })
          .finally(() => {
            setLoading(false)
          })
      },
      afterClose () {
        hookCreateForm.resetFields()
      },
    }
    return hookCreateDialog
  }

  function useHookModifyDialog () {
    const hookForm = {
      values: {
        name: 'xxx',
      },
      fields: [
        { label: '应用名称', name: 'name', maxlength: 20, rules: [ { required: true, message: '请输入应用名称' } ] },
        { label: '应用描述', name: 'description', maxlength: 40, rules: [ ] },
        {
          label: '应用成员',
          name: 'members',
          type: 'select',

          options: mockJSON(`
            @options(20)[
              @label #name
              @value 100++
            ]
        `).options,
          props: {
            mode: 'multiple',
            onSearch (...args) {
              console.info({ args })
            },
            filterOption (input, option) {
              return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
          },
        },
      ],
    }
    const hookDialog = {
      title: '编辑应用',
      render: () => (<SMForm hook={hookForm} />),
      onSubmit ({ setLoading }) {
        return hookForm.validate()
          .then((values) => {

          })
          .finally(() => {
            setLoading(false)
          })
      },
      afterClose () {
        hookForm.resetFields()
      },
    }
    return hookDialog
  }
}
