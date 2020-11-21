
export default [
  {
    path: 'manage',
    children: [
      {
        title: '用户管理',
        path: 'user',
        lazy: () => import('@/page/manage/user'),
      },
      {
        title: '权限管理',
        path: 'permisstion',
        keepAlive: [ '/manage/user' ],
        lazy: () => import('@/page/manage/permisstion'),
      },

    ],
  },
];
