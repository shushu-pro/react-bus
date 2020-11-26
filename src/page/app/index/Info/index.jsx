import React, { useState, useEffect } from 'react';
import { Descriptions, Spin, Space, Button, message, Modal } from 'antd';
import { api } from '@/api';
import { SMDialog, SMForm } from '@/package/shanmao';
import { useHistory } from 'react-router-dom';

export default Info;

function Info ({ appId }) {
  const [ detail, detailSet ] = useState({});
  const [ loading, loadingSet ] = useState(false);
  const hookModifyDialog = createHookModifyDialog();
  const history = useHistory();

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <>
      <Spin spinning={loading} delay={500}>
        <Descriptions
          title="应用详情"
          style={{ marginBottom: 32 }}
          bordered
          extra={(
            <Button type="primary" onClick={() => hookModifyDialog.open()}>修改</Button>
          )}
        >
          <Descriptions.Item label="应用名称">{detail.name}</Descriptions.Item>
          <Descriptions.Item label="应用描述">{detail.description}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{detail.createTime}</Descriptions.Item>
        </Descriptions>
        <SMDialog hook={hookModifyDialog} />

        <Space>
          <Button type="danger" onClick={deleteApp}>删除应用</Button>
        </Space>
      </Spin>

    </>
  );

  function fetchDetail () {
    loadingSet(true);
    api.app.detail({ id: appId })
      .then((detail) => {
        detailSet(detail);
      })
      .finally(() => {
        loadingSet(false);
      });
  }

  function deleteApp () {
    Modal.confirm({
      title: '确定删除该应用？',
      content: '只允许删除空应用',
      onOk: () => api.app
        .delete({ id: appId })
        .then(() => {
          history.push('/user/center/apps');
        }),
    });
  }

  function createHookModifyDialog () {
    const [ formData, formDataSet ] = useState({});
    const hookForm = {
      values: detail,
      fields: [
        { label: '应用名称', name: 'name', rules: [ { required: true } ] },
        { label: '应用描述', name: 'description' },
      ],
    };
    return {
      title: '修改信息',
      render () {
        return (
          <SMForm hook={hookForm} />
        );
      },
      onSubmit ({ setLoading }) {
        return hookForm.validate()
          .then((values) => api.app.modify({
            id: appId,
            ...values,
          }))
          .then(() => {
            fetchDetail();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };
  }
}
