export default [
  {
    path: 'user',
    children: [
      {
        path: 'center',
        children: [
          {
            path: '',
            redirect: '/user/center/apps',
          },
          {
            layout: null,
            title: (route) => {
              if (route.params.type === 'apps') {
                return '我的应用';
              }
              return '我的项目';
            },
            path: ':type',
            page: () => import('@/page/user/center'),
          },
        ],
      },
    ],
  },
];
