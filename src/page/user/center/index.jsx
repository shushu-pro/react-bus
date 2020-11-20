import React, { useState } from 'react'
import { Tabs, Button } from 'antd'
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Apps from './component/Apps'
import Projects from './component/Projects'
import styles from './index.less'


export default UserCenter

function UserCenter () {
  const match = useRouteMatch()
  const history = useHistory()
  const { params: { type: tabKey } } = match

  // console.info({ type })

  // const [ tabKey, tabKeySet ] = useState(type)

  const hookApps = {}
  const hookProjects = {}

  return (
    <div className={styles.content}>
      <Tabs defaultActiveKey={tabKey} tabBarExtraContent={{ right: <RightButton /> }} onChange={tabChange}>
        <Tabs.TabPane className={styles.space} tab={<div style={{ margin: '4px 16px' }}><AppleOutlined />我的应用</div>} key="apps">
          <Apps hook={hookApps} />
        </Tabs.TabPane>
        <Tabs.TabPane className={styles.space} tab={<div style={{ margin: '4px 16px' }}> <AndroidOutlined />我的项目</div>} key="projects">
          <Projects hook={hookProjects} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )

  function tabChange (tabKey) {
    history.push(`./${tabKey}`)
  }

  function RightButton () {
    const buttonText = ({
      apps: '添加应用',
      projects: '添加项目',
    })[tabKey]

    return (
      <div style={{ marginRight: '10px' }}>
        <Button type="primary" onClick={openCreateDialog}>{buttonText}</Button>
      </div>
    )

    function openCreateDialog () {
      ({
        apps: () => hookApps.openCreateDialog(),
        projects: () => hookProjects.openCreateDialog(),
      })[tabKey]()
    }
  }
}
