import React, { useState, useEffect } from 'react';
import { Card, Button, message, Table } from 'antd';
import { mockJSON } from '@/util';
import { SMDialog, SMForm, SMTable } from '@/package/shanmao';

export default Home;

function Home () {
  const [ formData, formDataSet ] = useState({});
  const hookDetailForm = {
    values: formData,
    fields: [
      { label: '名称', name: 'name', rules: [ { required: true } ] },
      { label: '邮件', name: 'email' },
    ],
  };
  const hookDetailDialog = {
    title: '编辑数据详情',
    render () {
      return (
        <SMForm hook={hookDetailForm} />
      );
    },
    onOpen (hook, row) {
      formDataSet(row);
    },
    onSubmit ({ setLoading }) {
      // return hookDetailForm.validate()
      //   .then((values) => {
      //     message.info(JSON.stringify(values));
      //     // console.info({ values });
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
      // // return false;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
          setLoading(false);
        }, 1000);
      });
    },
  };
  const hookTable = {
    columns: [
      { title: '编号', dataIndex: 'id' },
      { title: '标题', dataIndex: 'title' },
      { title: '名称', dataIndex: 'name', disabled: !true },
      {
        title: '年龄',
        dataIndex: 'age',
        sorter: (a, b) => a.age - b.age,

      },
      { title: '邮件', dataIndex: 'email' },
      {
        title: '操作',
        render (row) {
          return (
            <>
              <Button onClick={() => {
                hookDetailDialog.open(row);
              }}
              >编辑
              </Button>
            </>
          );
        },
      },

    ],
    // dataSource: tableData({ page: 1, pageSize: 20 }),
    dataSource: getTableData,
    pagination: { limit: 20 },
  };

  useEffect(() => {
    console.info('create home ');
  }, []);
  return (
    <div>
      <Card>
        <br />axxxaaaaaaahhhh
        <br />a
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />s
        <br />
        <Button onClick={() => hookTable.reload()}>重新加载</Button>
        <SMTable props hook={hookTable} />
        {/* <Table columns={hookTable.columns} dataSource={hookTable.dataSource} /> */}
        <SMDialog hook={hookDetailDialog} />
      </Card>
    </div>
  );
}

function getTableData ({ page, pageSize = 20 }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJSON(`
        const total = 2000
        @page page
        @pageSize pageSize
        @total total
        @list(total)[
          @id 1000++
          @title #text
          @name #name
          @age #integer(1,100)
          @email #email
        ]
      `, { page, pageSize }));
    }, 1000);
  });
}

function tableData () {
  return mockJSON(`
    @list(10)[
      @id 1000++
      @title #text
      @name #name
      @age #integer(1,100)
      @email #email
    ]
  `).list;
}
