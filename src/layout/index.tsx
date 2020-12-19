import React from 'react';
import Header from './Header';

import styles from './index.less';


export default function Layout ({ layout, render }) {
  return (
    <div className={styles.layout}>
      {layout.header && <Header /> }
      <div className={styles.content}>
        {render()}
      </div>
    </div>
  );
}
