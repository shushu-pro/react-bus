import home from '@/page/Home';

export default [

  {
    path: '',
    redirect: '/user/center/apps',
  },

  // {
  //   title: 'ts测试页面',
  //   path: 'ts',
  //   page: () => import('@/page/ppk-ts'),
  // },

  // {
  //   title: '首页',
  //   path: 'home',
  //   page: home, // () => import('@/page/home'),
  //   keepAlive: [ '/manage/user' ],
  // },

  {
    path: 'editor',
    lazy: () => import('@/page/editor'),
  },

  {
    path: 'login',
    lazy: () => import('@/page/login'),
    layout: null,
  },

  {
    path: 'app',
    lazy: () => import('@/page/appDetail'),
  },
  {
    path: 'page04',
    lazy: () => import('@/page/404'),
  },

];
