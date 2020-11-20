import React, { useEffect } from 'react';
import styles from './index.less';
import Header from './Header';

export default function Layout ({ router }) {
  const { layout } = router.route;
  console.info(router);
  useEffect(() => {
    console.info('Layout.init');
  }, []);

  return (
    <div className={styles.layout}>
      {layout.header && <Header /> }
      <div className={styles.content}>

        {router.render()}
      </div>
    </div>
  );
}
