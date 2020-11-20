import React from 'react';
import MonacoEditor from '../MonacoEditor';
import './language';
import './index.less';

export default DataXEditor;

function DataXEditor (props) {
  const nextProps = {
    ...props,
    hook: {
      ...props.hook,
      language: 'datax',
      theme: 'datax',
    },
  };
  return (<MonacoEditor {...nextProps} />);
}
