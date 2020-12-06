import home from '@/page/Home';

export default [

  // {
  //   path: '',
  //   redirect: '/user/center/apps',
  // },
  {
    path: '',
    // redirect: '/oc/product',
    lazy: () => import('@/page/lab'),
  },

  {
    path: 'oc',
    children: [
      {
        path: 'product',
        lazy: () => import('@/page/oc/product'),
      },
    ],
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
    loginIgnore: true,
  },

  {
    path: 'app',
    lazy: () => import('@/page/appDetail'),
  },
  {
    path: 'page404',
    lazy: () => import('@/page/404'),
    loginIgnore: true,
  },

];
