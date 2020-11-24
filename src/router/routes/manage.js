
export default [
  {
    path: 'manage',
    layout: {
      header: true,
      // breadcrumb: true,
    },
    children: [
      {
        title: '用户管理',
        path: 'user',
        lazy: () => import('@/page/manage/user'),
      },
      {
        path: 'permisstion',
        // keepAlive: [ '/manage/user' ],
        // lazy: () => import('@/page/manage/permisstion'),
        children: [
          {
            title: '权限管理',
            path: '',
            lazy: () => import('@/page/manage/permisstion'),
            // redirect: '/manage/permisstion/module',
          },
          {
            title: '模块管理',
            path: 'module',
            lazy: () => import('@/page/manage/permisstion/module'),
          },

        ],
      },

    ],
  },
];
