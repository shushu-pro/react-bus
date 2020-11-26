import React from 'react';
import { match } from 'path-to-regexp';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Spin } from 'antd';

function Router (routes) {
  let route = null;
  const staticRoutes = {};
  const dynamicRoutes = [];
  let keepAliveRoutes = [];
  let params = null;
  const routerSwitchs = {};
  const router = this;

  initRoutes(routes);

  this.use = use;
  this.isRedirect = isRedirect;
  this.notFound = notFound;
  this.notLogin = notLogin;
  this.notAuth = notAuth;
  this.render = render;
  this.title = title;
  this.switch = useSwitch;

  function use (history) {
    const { location } = history;
    const { pathname } = location;
    // 直接匹配
    route = staticRoutes[pathname];
    params = {};

    // 尝试从动态路由中进行匹配
    if (!route) {
      dynamicRoutes.some((item) => {
        const result = item.pathMatch(pathname);

        if (result) {
          route = item;
          params = result.params;
          return true;
        }
        return false;
      });
    }

    const query = {};

    // 解析查询参数
    if (location.search) {
      location.search.substr(1).split(/&/).forEach((item) => {
        const [ key, value ] = item.split('=');
        query[key] = value;
      });
    }

    if (route) {
      this.route = {
        path: route.routePath,
        layout: route.routeLayout,
        title: route.title,
        params,
        query,
      };
    } else {
      this.route = {
        path: pathname,
        layout: {},
        params,
        query,
      };
    }

    return this;
  }

  function isRedirect () {
    return route && typeof route.redirect === 'string';
  }

  function notFound () {
    return !route;
  }

  function notLogin () {
    return !true;
  }

  function notAuth () {
    return !true;
  }

  function render () {
    if (isRedirect()) {
      return renderRoutes(keepAliveRoutes, (<Redirect to={route.redirect} />));
    }

    const { onNotFound, onNotLogin, onNotAuth, onDefault } = routerSwitchs;

    if (notFound()) {
      if (onNotFound) {
        const NotFoundPage = onNotFound(router);
        if (NotFoundPage !== undefined) {
          return renderRoutes(keepAliveRoutes, NotFoundPage);
        }
      }
      return renderRoutes(keepAliveRoutes, <div>PAGE404</div>);
    }

    if (notLogin()) {
      if (onNotLogin) {
        const NoLoginPage = onNotLogin(router);
        if (NoLoginPage !== undefined) {
          return renderRoutes(keepAliveRoutes, NoLoginPage);
        }
      }
      return renderRoutes(keepAliveRoutes, <div>PAGE-NOLOGIN</div>);
    }

    if (notAuth()) {
      if (onNotAuth) {
        const NoAuthPage = onNotAuth(router);
        if (NoAuthPage !== undefined) {
          return renderRoutes(keepAliveRoutes, NoAuthPage);
        }
      }
      return renderRoutes(keepAliveRoutes, <div>PAGE-NOAUTH</div>);
    }

    keepAliveRoutes = keepAliveRoutes.filter((item) => {
      if (route === item) {
        return false;
      }

      // 符合keepAlive的组件继续保持
      return item.keepAliveMatchs.some((match) => match(route.routePath));
    });

    const childrenRoutes = [ ...keepAliveRoutes ];
    // 存在默认的拦截器
    if (onDefault) {
      const DefaultResult = onDefault(router);
      if (typeof DefaultResult !== 'undefined') {
        return renderRoutes(childrenRoutes, <div key={`${route.path}#DEFAULT`}><DefaultResult /></div>);
      }
    }

    // 不是从拦截器中返回的节点，则进行保存
    if (route.keepAliveMatchs) {
      keepAliveRoutes.push(route);
    }

    childrenRoutes.push(route);

    return renderRoutes(childrenRoutes);
  }

  function renderRoutes (childrenRoutes, ActiveJSX = null) {
    return (
      <>
        {ActiveJSX}
        {childrenRoutes.map((item) => (<div key={item.routePath} style={{ display: item === route ? '' : 'none' }}>{item.routeRender()}</div>))}
      </>
    );
  }

  function title () {
    return typeof route.title === 'function' ? route.title(this.route) : route.title;
  }

  function useSwitch ({ notFound, notLogin, notAuth, default: defaultCall }) {
    routerSwitchs.onNotFound = notFound;
    routerSwitchs.onNotLogin = notLogin;
    routerSwitchs.onNotAuth = notAuth;
    routerSwitchs.onDefault = defaultCall;
  }

  function initRoutes (routes) {
    walkRoutes(routes, [ '' ], null);

    function walkRoutes (routes, paths, parentLayout) {
      routes.forEach((route) => {
        const { path } = route;
        const pathsNext = paths.concat([ path ]);
        const pathsNextText = pathsNext.join('/').replace(/\/+/g, '/').replace(/(.+)\/$/, '$1');

        const layout = route.layout === null ? null : (route.layout || parentLayout);

        route.routeLayout = layout || {};
        if (route.children) {
          walkRoutes(route.children, pathsNext, layout);
        }

        // 非页面级别的路由配置项
        if (typeof route.redirect === 'undefined' && !route.page && !route.render && !route.lazy) {
          return;
        }

        // 生产路由地址
        route.routePath = pathsNextText;

        // 判断是动态还是静态路径的路由
        if (/:/.test(pathsNextText)) {
          dynamicRoutes.push(route);
          route.pathMatch = match(route.routePath);
        } else {
          staticRoutes[pathsNextText] = route;
        }

        // 路由缓存
        const { keepAlive } = route;
        if (keepAlive) {
          route.keepAliveMatchs = (Array.isArray(keepAlive) ? keepAlive : [ keepAlive ]).map((item) => match(item));
        }

        if (route.lazy) {
          route.RoutePage = loadable(route.lazy);
        } else if (route.page) {
          route.RoutePage = route.page;
        }

        route.routeRender = route.render || (() => <route.RoutePage />);
      });
    }
  }
}

export default Router;

// 懒加载
function loadable (loader) {
  return Loadable({
    loader: () => new Promise((resolve) => {
      setTimeout(() => {
        loader().then(resolve);
      }, 600);
    }),
    loading () {
      return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Spin size="large" />
        </div>
      );
    },
  });
}
