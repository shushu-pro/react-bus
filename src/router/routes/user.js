import WithHeaderLayout from '@/component/layout/WithHeader';
import BlankLayout from '@/component/layout/Blank';

export default [
  {
    path: 'user',
    children: [
      {
        path: 'center',
        layout: BlankLayout,
        children: [
          {
            path: '',
            redirect: '/user/center/apps',
          },
          {
            path: ':type',
            page: () => import('@/page/user/center'),
          },
        ],
      },
    ],
  },
];
