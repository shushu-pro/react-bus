import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import JSONEditor from './JSONEditor';
import DataXEditor from './DataXEditor';
import MonacoEditor from './MonacoEditor';


export default RequestInfo;

let timer = null;

function RequestInfo ({ apiDetail, updateAPI }) {
  const hookDataXEditor = {
    value: 'ls;dls',
    // language: 'javascript',
    // readOnly: true,
    onSave () {
      // eslint-disable-next-line no-use-before-define
    //   hookEditDialog.submit();
    },
  };


  useEffect(() => {
    timer = setInterval(() => {
      if (typeof monaco === 'object') {
        clearInterval(timer);

        // hasMonacoSet(true);
      }

      // console.info(typeof monaco);
    }, 1000);
  }, []);

  return (
    <Card>
      <div style={{ border: '10px solid #000', padding: '20px' }}>
        jsaljsaljsssdddd
        <DataXEditor hook={hookDataXEditor} />
      </div>

    </Card>

  );
}
