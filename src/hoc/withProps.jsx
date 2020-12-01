
import React from 'react';
import { connect } from '@/package/haima';


const mapStateToProps = ({ user }) => ({
  auths: user.auths,
});

export default withProps;

function withProps ({ auth }) {
  const globalProps = {};

  return (Component) => connect(mapStateToProps)((props) => {
    const localProps = {};

    if (auth) {
      localProps.auth = { has: (symbol) => props.auths.includes(symbol) };
    }

    return <Component {...{ ...globalProps, ...localProps, ...props }} />;
  });
}
