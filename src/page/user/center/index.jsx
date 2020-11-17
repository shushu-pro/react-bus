import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Input } from 'antd';

export default UserCenter;

function UserCenter (props) {
  const { params: { type } } = useRouteMatch();
  return (
    <div>
      <Input defaultValue="x" />
      {type}
    </div>
  );
}
