

import { useEffect } from 'react';
import { connect } from './package/haima';

const mapDispatchToProps = (dispatch) => ({
  fetchUser () {
    dispatch('user.fetch');
  },
});


export default connect(null, mapDispatchToProps)(UseLogin);

function UseLogin ({ fetchUser }) {
  useEffect(() => {
    fetchUser();
  }, []);

  return null;
}
