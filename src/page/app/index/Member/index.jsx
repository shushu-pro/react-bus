import React, { useState, useEffect } from 'react';
import { Descriptions, Spin, Space, Button, message, Modal, Select, Popconfirm } from 'antd';
import { api } from '@/api';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

export default Member;

function Member ({ appId }) {
  // const [ detail, detailSet ] = useState({});
  const [ loading, loadingSet ] = useState(false);
  const hookTable = createHookTable();
  const hookAddDialog = createHookAddDialog();
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
          <Button type="primary" className={styles.addButton} onClick={() => hookAddDialog.open()}>添加成员</Button>
        </div>

        <SMTable hook={hookTable} />
        <SMDialog hook={hookAddDialog} />
      </Spin>

    </>
  );

  function fetchList (params) {
    // api.app.member.list({ appId })
    //   .then(({ list }) => {

    //   });
    // console.info('xx');
  }

  function createHookTable () {
    return {
      columns: [
        { title: '成员名称', dataIndex: 'user' },
        { title: '成员昵称', dataIndex: 'nick' },
        {
          title: '操作',
          render (row) {
            return (
              <Space>
                <Popconfirm placement="top" title="确定移除" onConfirm={() => removeMember(row.id)}>
                  <Button type="danger">移除</Button>
                </Popconfirm>
              </Space>
            );
          },
        },
      ],
      dataSource (params) {
        console.info('xxx');
        return api.app.member.list({ ...params, id: appId });
      },
    };

    function removeMember (id) {
      api.app.member.remove({ id }).then(() => hookTable.reload());
    }
  }

  function createHookAddDialog () {
    const [ userList, userListSet ] = useState([]);
    const [ memberList, memberListSet ] = useState([]);
    const [ loading, loadingSet ] = useState(false);
    return {
      title: '添加成员',
      loading,
      render () {
        return (
          <Select
            mode="multiple"
            placeholder="选择角色"
            options={userList}
            value={memberList}
            onChange={onChange}
            style={{ width: '100%' }}
          />
        );
      },
      onOpen (hook) {
        loadingSet(true);
        Promise.all([
          api.app.user.list(),
          api.app.member.list({ id: appId }),
        ])
          .then(([ { list: userList }, { list: memberList } ]) => {
            userListSet(userList);
            memberListSet(memberList.map((item) => item.id));
          })
          .finally(() => {
            loadingSet(false);
          });
      },
      afterClose () {
        // userIdSet(null);
      },
      onSubmit ({ setLoading }) {
        return api.app.member
          .modify({ appId, memberList })
          .then(() => {
            hookTable.reload();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };

    function onChange (value) {
      memberListSet(value);
    }
  }
}
