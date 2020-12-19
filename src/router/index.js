import React from 'react';
import Layout from '@/layout/index';
import { Redirect } from 'react-router-dom';
import { user } from '@/api';
import createRouter, { useRoute } from './core/index';
import routes from './routes';

export default createRouter({
  routes,
  Layout,
  async beforeRoute (router) {
    if (router.notFound()) {
      return <Redirect to="/page404" />;
    }

    // // 登录拦截
    // if (!await user.isLogin()) {
    //   return <Redirect to="/login" />;
    // }

    // // 授权拦截
    // if (!await user.hasAuth(router.route.auths)) {
    //   return <Redirect to="/noauth" />;
    // }

    try {
      // await user.login();
    } catch (err) {
      // ...
    }


    document.title = router.title();
  },
});

export {
  useRoute,
};
