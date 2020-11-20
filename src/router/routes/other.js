export default [

  {
    path: '',
    redirect: '/home',
  },

  {
    title: 'ts测试页面',
    path: 'ts',
    page: () => import('@/page/ppk-ts'),
  },

  {
    title: '首页',
    path: 'home',
    page: () => import('@/page/home'),
    keepAlive: [ '/manage/user' ],
  },

  {
    path: 'editor',
    page: () => import('@/page/editor'),
  },

  {
    path: 'login',
    page: () => import('@/page/login'),
    layout: null,
  },

  {
    path: 'app',
    page: () => import('@/page/appDetail'),
  },
];
