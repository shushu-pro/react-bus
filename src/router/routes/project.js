import ProjectLayout from '@/layout/Project'
import project from '@/page/project'
import apiDetail from '@/page/api-detail'

export default [
  {
    path: 'project/:projectId',
    component: ProjectLayout,
    children: [
      {
        title: '项目',
        path: '',
        component: project,
      },
      {
        title: '接口详情',
        path: 'api/:apiId',
        component: apiDetail,
      },
    ],
  },
]
