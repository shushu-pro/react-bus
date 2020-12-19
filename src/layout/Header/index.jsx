import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';
import Logo from './img/logo.svg';


export default Header;

function Header () {
  return (
    <div className={styles.Header}>
      {renderLogo()}
    </div>
  );

  function renderLogo () {
    return (
      <div style={{ display: 'flex' }}>
        <h1 className={styles.logo}>
          <Link to="/">
            <img src={Logo} alt="logo" />
            筑基
          </Link>


        </h1>

        <Link to="/page2">页面2</Link>
        <Link to="/lab">测试</Link>
      </div>

    );
  }
}
