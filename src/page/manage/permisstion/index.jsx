import React from 'react';
import { Card } from 'antd';
import Mod1 from './mod1';
import Mod2 from './mod2';

export default managePermission;

function managePermission () {
  return (
    <>
      <Card>
        <Mod1 />
      </Card>

      <hr />jjjjiiiuuuuuuu

      <Card>
        <Mod2 />
      </Card>
    </>
  );
}
