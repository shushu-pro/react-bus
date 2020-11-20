import React from 'react';
import MonacoEditor from '../MonacoEditor';

export default JSONEditor;

function JSONEditor (props) {
  const nextProps = {
    ...props,
    hook: {
      ...props.hook,
      language: 'json',
    },
  };
  return (<MonacoEditor {...nextProps} />);
}
