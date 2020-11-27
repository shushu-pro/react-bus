
export default [
  {
    path: 'app',
    layout: {
      header: true,
    },


    children: [
      {
        title: '应用',
        path: '',
        redirect: {
          path: '/app/api',
          query: (query) => ({ appId: query.id }),
        },
      },
      {
        title: '应用接口中心',
        path: 'api',
        lazy: () => import('@/page/app/api'),
      },
      {
        title: '应用基础信息',
        path: 'info',
        lazy: () => import('@/page/app/index'),
      },
      {
        title: '应用用户管理',
        path: 'member',
        lazy: () => import('@/page/app/index'),
      },

    ],
  },
];
