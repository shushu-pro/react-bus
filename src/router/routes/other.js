
export default [

  {
    path: '',
    redirect: { path: '/home', query: true },
  },

  {
    title: '首页',
    path: 'home',
    lazy: () => import('@/page/home'),
    keepAlive: [ '/page2', '/' ],
  },
  {
    title: '首页2',
    path: 'page2',
    lazy: () => import('@/page/page2'),
  },
  {
    title: '测试',
    path: 'lab',
    lazy: () => import('@/page/lab'),
    keepAlive: [ '/home' ],
  },

  {
    title: '页面未找到',
    path: 'page404',
    lazy: () => import('@/page/etc/page404'),
    loginIgnore: true,
  },

];
