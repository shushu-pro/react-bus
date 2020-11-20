import React from 'react';
import { Input } from 'antd';
// import { connect } from '@/package/haima';
import { connect } from 'react-redux';

const mapStateToProps = ({ example }) => ({
  formData: example.formData,
});

export default connect(mapStateToProps)(mod1);

function mod1 (props) {
  return (
    <div>
      表单： <Input value={props.formData.xo} />
    </div>
  );
}
