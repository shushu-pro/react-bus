import BlankLayout from '@/component/layout/Blank';
import WithHeaderLayout from '@/component/layout/WithHeader';

import Home from '@/page/home';

export default [
  {
    path: '',
    redirect: '/home',
  },

  {
    path: 'home',
    layout: BlankLayout,
    page: Home, // () => import('@/page/home'),
  },

  {
    path: 'editor',
    layout: BlankLayout,
    page: () => import('@/page/editor'),
  },

  {
    path: 'login',
    layout: BlankLayout,
    page: () => import('@/page/login'),
  },
  {
    page: () => import('@/page/404'),
  },

];
