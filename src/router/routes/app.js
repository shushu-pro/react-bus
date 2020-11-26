
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
        lazy: () => import('@/page/app/index'),
      },
    ],
  },
];
