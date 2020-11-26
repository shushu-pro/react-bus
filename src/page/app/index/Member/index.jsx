import React, { useState, useEffect } from 'react';
import { Descriptions, Spin, Space, Button, message, Modal } from 'antd';
import { api } from '@/api';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

export default Member;

function Member ({ projectId }) {
  // const [ detail, detailSet ] = useState({});
  const [ loading, loadingSet ] = useState(false);
  const hookTable = createHookTable();
  // const hookModifyDialog = createHookModifyDialog();
  // const history = useHistory();
  useEffect(() => {
    fetchList();
  }, []);


  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.buttonBox}>
          <h3>成员管理</h3>
          <Button type="primary" className={styles.addButton} onClick={() => {}}>添加成员</Button>
        </div>

        <SMTable hook={hookTable} />
      </Spin>

    </>
  );

  function fetchList (params) {
    // api.app.member.list({ projectId })
    //   .then(({ list }) => {

    //   });
    // console.info('xx');
  }

  function createHookTable () {
    return {
      columns: [
        { title: '成员名称', dataIndex: 'userId' },
        { title: '成员昵称', dataIndex: 'nick' },
        {
          title: '操作',
          render () {
            return (
              <Space>
                <Button type="danger">删除</Button>
              </Space>
            );
          },
        },
      ],
      dataSource (params) {
        console.info('xxx');
        return api.app.member.list({ ...params, projectId });
      },
    };
  }
}
