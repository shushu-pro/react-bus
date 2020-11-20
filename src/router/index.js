
import Layout from '@/layout';
import createRouter, { useRoute } from './core';
import routes from './routes';

export default createRouter({
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
      document.title = router.title();
    },
  },
});

export {
  useRoute,
};
