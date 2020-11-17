import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Spin } from 'antd';
import originRoutes from './routes';

const [ routes, routesJSX ] = transformRoutes(originRoutes);

export default Router;

function Router () {
  return routesJSX;
}

function loadable (loader) {
  const result = loader();
  if (result instanceof Promise) {
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
  return () => result;
}

function transformRoutes (originRoutes) {
  const routes = {};
  const routesTree = transformRoute({ children: originRoutes }, []);
  const routesJSX = makeJSX(routesTree);

  return [ routes, routesJSX ];

  function transformRoute ({ path, redirect, layout, page, children }, parentPaths, ParentLayout) {
    // console.info({ path, redirect, layout, page, children }, parentPaths, ParentLayout);
    const fullPaths = parentPaths.concat([ path ]);
    const fullPathsText = fullPaths.join('/');
    const node = {};

    // <Switch>...</Switch>
    if (children) {
      node.type = 'switch';
      node.path = fullPathsText;
      node.children = children.map((route) => transformRoute(route, fullPaths, layout || ParentLayout));
    }

    // <Route exact path="/">
    //   <Redirect to="/home" />
    // </Route>;
    if (typeof redirect === 'string') {
      node.type = 'redirect';
      node.path = fullPathsText;
      node.redirect = redirect;
    }

    // <Route exact path="/home">
    //     <BlankLaout>
    //         <Home />
    //     </BlankLaout>
    // </Route>
    if (typeof page === 'function') {
      node.type = 'route';
      node.path = path ? fullPathsText : null;
      node.Page = loadable(page);
      node.Layout = layout || (layout === false ? null : ParentLayout);
    }

    return node;
  }

  function makeJSX ({ type, children, path, redirect, Page, Layout }) {
    if (type === 'switch') {
      return (
        <Route path={path} key={path}>
          <Switch>
            {children.map((item) => makeJSX(item))}
          </Switch>
        </Route>
      );
    }

    if (type === 'redirect') {
      return (
        <Route exact path={path} key={path}>
          <Redirect to={redirect} />
        </Route>
      );
    }

    if (type === 'route') {
      if (path == null) {
        return (
          <Route key="unpath">
            {Layout ? (<Layout><Page /></Layout>) : <Page />}
          </Route>
        );
      }
      return (
        <Route exact path={path} key={path}>
          {Layout ? (<Layout><Page /></Layout>) : <Page />}
        </Route>
      );
    }
  }
}
