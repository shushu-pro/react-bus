import { api, mockapi } from '@/api';
import { SMDialog, SMForm } from '@/package/shanmao';
import { Button, Card, Modal, Input, Descriptions, message, Space, Timeline } from 'antd';
import React, { useState, useEffect } from 'react';
import JSONEditor from '@/component/Editor/JSONEditor';
import { ClockCircleOutlined } from '@ant-design/icons';
import 'jsondiffpatch/dist/formatters-styles/annotated.css';
import 'jsondiffpatch/dist/formatters-styles/html.css';
import './index.less';

import * as jsondiffpatch from 'jsondiffpatch';

const formattersHtml = jsondiffpatch.formatters.html;


export default BaseInfo;


function BaseInfo ({ appId, apiDetail, updateAPI }) {
  const hookMockDialog = getHookMockDialog();
  const hookEditDialog = getHookEditDialog();
  const hookHistoryDialog = getHookHistoryDialog();
  const [ isFavorite, isFavoriteSet ] = useState(false);
  const [ html, htmlSet ] = useState('');

  const hookDiffDialog = {
    title: '修改信息',
    render (hook) {
      // eslint-disable-next-line react/no-danger
      return (<di dangerouslySetInnerHTML={{ __html: html }} />);
    },
  };
  const apiId = apiDetail.id;

  useEffect(() => {
    if (apiId) {
      fetchFavoriteState();
    }
  }, [ apiId ]);

  return (
    <Card
      className="BaseInfo"
      title="基础信息"
      extra={(
        <Space>
          <Button type="primary" onClick={() => hookMockDialog.open()}>MOCK</Button>
          <Button type="primary" onClick={() => hookEditDialog.open()}>编辑</Button>
          <Button type={isFavorite ? 'default' : 'primary'} onClick={favoriteToggle}>关注</Button>
          <Button type="primary" onClick={() => hookHistoryDialog.open()}>操作记录</Button>
        </Space>
      )}
    >
      <Descriptions>
        <Descriptions.Item label="接口名称" span="3">{ apiDetail.name }</Descriptions.Item>
        <Descriptions.Item label="接口地址" span="3">{ apiDetail.path }</Descriptions.Item>
        <Descriptions.Item label="请求方式">{ apiDetail.methodText }</Descriptions.Item>
        <Descriptions.Item label="接口描述">{ apiDetail.description || '-' }</Descriptions.Item>
      </Descriptions>
      <SMDialog hook={hookMockDialog} />
      <SMDialog hook={hookEditDialog} />
      <SMDialog hook={hookHistoryDialog} />
      <SMDialog hook={hookDiffDialog} />
    </Card>
  );

  function getHookMockDialog () {
    const [ MOCKData, MOCKDataSet ] = useState(0);
    const hookParamsJSONEditor = {
      value: JSON.stringify(apiDetail.mockReqData),
      format: true,
      height: 190,
    };
    const hookResponseJSONEditor = {
      value: MOCKData,
      format: true,
    };
    return {
      title: 'MOCK接口',
      width: 800,
      props: {
        okText: '发起请求',
      },
      render () {
        let content = null;
        if (typeof MOCKData === 'string') {
          content = <JSONEditor hook={hookResponseJSONEditor} />;
        } else {
          content = <div style={{ height: '260px' }}>{[ '等待请求...', '数据请求中...' ][MOCKData]}</div>;
        }
        return (
          <div>
            <h4>请求参数：</h4>
            <JSONEditor hook={hookParamsJSONEditor} />
            <h4 style={{ marginTop: '8px' }}>响应数据：</h4>
            {content}
          </div>
        );
      },
      onOpen () {
        MOCKDataSet(0);
      },
      onSubmit ({ setLoading }) {
        return new Promise((resolve) => {
          let sendData;
          try {
            sendData = JSON.parse(hookParamsJSONEditor.getValue());
          } catch (err) {
            return message.error('请求参数错误，请检查输入的是否符合JSON格式');
          }

          console.info(apiDetail);

          mockapi.send(sendData, { method: apiDetail.methodText, url: `${appId}/${apiDetail.path}` })
            .then((data) => {
              MOCKDataSet(JSON.stringify(data));
            })
            .finally(() => [
              setLoading(false),
            ]);
        });
      },
    };
  }

  function getHookEditDialog () {
    const hookEditForm = {
      data: {
        name: apiDetail.name,
        path: apiDetail.path,
        method: apiDetail.method,
        description: apiDetail.description,
      },
      gridLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
      fields: [
        [
          '接口名称',
          'name',
          {
            maxlength: 20,
            rules: [ { required: true, message: '请输入接口名称' } ],
          },
        ],
        [
          '接口路径',
          'path',
          {
            maxlength: 100,
            rules: [ { required: true, message: '请输入接口路径' } ],
          },
        ],
        [
          '请求方式',
          'method',
          {
            type: 'select',
            options: [
              { label: 'GET', value: 0 },
              { label: 'POST', value: 1 },
              { label: 'PUT', value: 2 },
              { label: 'DELETE', value: 3 },
              { label: 'OPTION', value: 4 },
            ],
            rules: [ { required: true, message: '请选择请求方式' } ],
          },
        ],
        [
          '接口描述', 'description', {
            maxlength: 256,
            customRender: () => (<Input.TextArea maxLength={256} />),
          },
        ],
      ],
    };

    return {
      title: '修改基础信息',
      render: () => (<SMForm hook={hookEditForm} />),
      onSubmit ({ setLoading }) {
        return hookEditForm
          .validate()
          .then((values) => api.app.api.modify({ ...values, path: values.path.replace(/^\/+/, ''), id: apiDetail.id }))
          .then((data) => {
            // 更新成功
            updateAPI(true);
          })
          .finally(() => {
            setLoading(false);
          });
      },
    };
  }

  function getHookHistoryDialog () {
    const [ params, paramsSet ] = useState({
      page: 1,
    });
    const [ loading, loadingSet ] = useState(false);
    const [ TimelineJSX, TimelineJSXSet ] = useState(null);


    useEffect(() => {
      if (params.apiId) {
        fetchHistory();
      }
    }, [ params ]);

    return {
      title: '操作记录',
      width: 800,
      loading,
      render () {
        return (
          <div style={{ maxHeight: '600px', overflowY: 'scroll', paddingTop: '10px' }}>
            {TimelineJSX}
          </div>
        );
      },
      onOpen (hook) {
        loadingSet(true);
        paramsSet({ page: 1, apiId });
      },
    };

    function fetchHistory () {
      api.history.api.list(params)
        .then(({ list }) => {
          const timelineItems = [];

          list.forEach(({ createTime, operatorId, historyId, nick, type }) => {
            const color = ({ 'api.create': 'green', 'api.modify': 'blue' })[type];
            timelineItems.push(
              {
                color,
                dot: <ClockCircleOutlined />,
                content: createTime,
              },
              {
                color,
                content: ({
                  'api.create': `"${nick}"创建了接口`,
                  'api.modify': (
                    <>
                      <span style={{ marginRight: '8px' }}>"{nick}"修改了接口</span>
                      <span
                        style={{ color: '#40a9ff', cursor: 'pointer' }}
                        onClick={() => {
                          api.history.api.data({ historyId }).then(({ left, right }) => {
                            // const left = { left: 12 };
                            const delta = jsondiffpatch.diff(left, right);
                            const html = jsondiffpatch.formatters.html.format(delta, left);
                            htmlSet(html);
                            hookDiffDialog.open(html);
                          });
                        }}
                      >查看详情
                      </span>

                    </>
                  ),
                  'api.move': (
                    <>
                      <span style={{ marginRight: '8px' }}>"{nick}"移动了接口</span>
                      <span style={{ color: '#40a9ff', cursor: 'pointer' }} onClick={() => {}}>查看详情</span>
                    </>
                  ),
                })[type],
              }
            );
          });

          TimelineJSXSet(
            <Timeline>{
              timelineItems.map(({ color, dot, content }) => (
                <Timeline.Item color={color} dot={dot}>{content}</Timeline.Item>
              ))
            }
            </Timeline>
          );
        })
        .finally(() => {
          loadingSet(false);
        });
    }
  }

  function favoriteToggle () {
    api.user.favorite.api[isFavorite ? 'remove' : 'add']({ apiId })
      .then(() => {
        fetchFavoriteState();
      });
  }

  function fetchFavoriteState () {
    api.user.favorite.api.enabled({ apiId })
      .then((state) => {
        isFavoriteSet(state);
      });
  }
}
