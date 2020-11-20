
import React from 'react';
import { Route, BrowserRouter, useHistory } from 'react-router-dom';
import Router from './Router';

let activeRoute = null;

export default function createRouter ({ routes, Layout, beforeRouter }) {
  const router = new Router(routes);
  const props = {
    router,
    Layout,
    beforeRouter,
  };
  return () => (
    <BrowserRouter>
      <Route render={() => <RouteRender {...props} />} />
    </BrowserRouter>
  );
}

function RouteRender ({ router, Layout, beforeRouter }) {
  router.use(useHistory());

  activeRoute = router.route;

  // 拦截器
  if (typeof beforeRouter === 'function') {
    const BeforeRouter = beforeRouter(router);
    if (BeforeRouter !== undefined) {
      return BeforeRouter;
    }
  } else if (typeof beforeRouter === 'object') {
    router.switch(beforeRouter);
  }

  if (!Layout) {
    return router.render();
  }

  return (
    <Layout router={router} />
  );
}

export {
  useRoute,
};

function useRoute () {
  return activeRoute;
}
