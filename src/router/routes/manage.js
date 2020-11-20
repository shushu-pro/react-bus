export default [
  {
    path: 'manage',
    children: [
      {
        title: '用户管理',
        path: 'user',
        page: () => import('@/page/manage/user'),
      },
      {
        title: '权限管理',
        path: 'permisstion',
        keepAlive: [ '/manage/user' ],
        page: () => import('@/page/manage/permisstion'),
      },
    ],
  },
];
