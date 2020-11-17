import React from 'react';
import { Card, Table } from 'antd';
import { mockJSON } from '@/util';

export default Home;

function Home () {
  const dataList = mockJSON(`
        @list(200)[
            @id 1000++
            @title #text
            @name #name
            @email #email
        ]
    `).list;
  const columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '标题', dataIndex: 'title' },
    { title: '名称', dataIndex: 'name' },
    { title: '邮件', dataIndex: 'email' },
  ];
  return (
    <div>
      <Card>
        <Table rowKey="id" dataSource={dataList} columns={columns} />
      </Card>
    </div>
  );
}
