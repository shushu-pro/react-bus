import React, { useEffect, useState } from 'react';
import withProps from '@/hoc/withProps';
import Login from '@/page/login';
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

  useEffect(() => {
    if (!hasLogin) {
      autoLogin();
    }
  }, []);

  // 登录拦截
  if (!hasLogin) {
    // 登录白名单
    if (router.route.origin?.loginIgnore) {
      return <>{router.render()}</>;
    }
    return null;
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
