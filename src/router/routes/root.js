import BlankLayout from '@/layout/Blank'
import home from '@/page/root/home'
import login from '@/page/root/login'

export default [
  {
    path: '',
    component: BlankLayout,
    children: [
      {
        title: '首页',
        path: 'home',
        component: home,
      },
      {
        title: '登录页',
        path: 'login',
        component: login,
      },
    ],
  },
]


// const routes = [
//   {
//     path: '',
//     redirect: '/home',
//   },
//   {
//     path: '/kkkk',
//     redirect: '/aaa',
//   },
//   {
//     path: '',
//     component: 'BlankLayout',
//     children: [
//       {
//         title: '首页',
//         path: 'home',
//         component: 'home',
//         auths: [ PERMISSION1, PERMISSION2 ],
//       },
//       {
//         title: '登录',
//         path: 'login',
//         component: 'login',
//         auths: [ PERMISSION_ALL ],
//       },
//     ],
//   },
//   {
//     title: '项目',
//     path: 'project',
//     component: 'ProjectLayout',
//     children: [
//       {
//         title: '项目',
//         path: ':projectId',
//         component: 'projectDetail',
//       },
//       {
//         title: '接口',
//         path: ':projectId/api/:apiId',
//         component: 'apiDetail',
//       },
//     ],
//   },
// ]

// project/
