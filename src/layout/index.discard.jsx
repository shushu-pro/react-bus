import React, { useEffect, useState } from 'react';
import withProps from '@/hoc/withProps';
import { Redirect } from 'react-router-dom';
import styles from './index.less';
import Header from './Header';
import Breadcrumb from './Breadcrumb';


const mapState = ({ user }) => ({
  hasLogin: user.hasLogin,
});

const mapDispatch = (dispatch) => ({
  autoLogin: () => dispatch('user.autoLogin'),
});

export default withProps({ mapState, mapDispatch })(({ hasLogin, router, autoLogin }) => {
  const { layout } = router.route;
  const [ loading, loadingSet ] = useState(true);

  useEffect(() => {
    if (!hasLogin) {
      autoLogin()
        .finally(() => {
          loadingSet(false);
        });
    }
  }, []);

  console.info({ hasLogin });

  // 登录拦截
  if (!hasLogin) {
    // 登录白名单
    if (router.route.origin?.loginIgnore) {
      return <>{router.render()}</>;
    }

    if (loading) {
      return null;
    }

    return <Redirect to="/login" />;
  } if (router.route.path === '/login') {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.layout}>
      {layout.header && <Header /> }
      {layout.breadcrumb && <Breadcrumb />}
      <div className={styles.content}>
        {/* {layout.sidebar} */}

        {router.render()}
      </div>
    </div>
  );
});
