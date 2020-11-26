import React from 'react';
import { Input, Button } from 'antd';
import { connect } from '@/package/haima';
// import { connect } from 'react-redux';

const mapStateToProps = ({ example }) => ({
  formData: example.formData,
});
const mapStateToDispatch = (dispatch) => ({
  formDataSet1: (value) => dispatch({ type: 'example.formDataSet', payload: { xo: value } }),
  formDataSet2: (value) => dispatch('example.formDataSet', { xo: value }),
  formDataReset: () => dispatch('example.resetFormData'),
});

export default connect(mapStateToProps, mapStateToDispatch)(Mod2);

function Mod2 (props) {
  return (
    <>
      <div>
        表单1： <Input value={props.formData.xo} onChange={(e) => props.formDataSet1(e.target.value)} />
      </div>
      <div>
        表单2： <Input onChange={(e) => props.formDataSet2(e.target.value)} />
      </div>
      <div>
        <Button onClick={() => props.formDataReset()}>重置值</Button>
      </div>
    </>
  );
}
