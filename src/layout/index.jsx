import React, { useEffect } from 'react';
import styles from './index.less';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

export default function Layout ({ router }) {
  const { layout } = router.route;

  useEffect(() => {

  }, []);

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
}
