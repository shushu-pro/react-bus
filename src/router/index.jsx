import React from 'react';
import Layout from '@/layout';
import createRouter, { useRoute } from './core';
import routes from './routes';

export default createRouter({
  baseURL: process.env.baseURL,
  routes,
  Layout,
  beforeRouter: {
    notFound (router) {
      return <div>xxx</div>;
    },
    notLogin () {

    },
    notAuth () {

    },
    default (router) {
      document.title = router.title() || '磐石系统';
    },
  },
});

export {
  useRoute,
};
