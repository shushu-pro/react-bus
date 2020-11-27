import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default SMTable;

function SMTable ({
  hook,
  ...props
}) {
  const [ params, paramsSet ] = useState({
    page: hook.page || (props.pagination ? props.pagination.page : 1),
    pageSize: hook.pageSize || (props.pagination ? props.pagination.pageSize : 10),
  });
  const [ loading, loadingSet ] = useState(false);

  const dataSource = Array.isArray(hook.dataSource) ? hook.dataSource : (props.dataSource || []);
  const [ tableData, tableDataSet ] = useState({
    dataSource,
    total: dataSource.length,
  });
  let loadData = null;

  // console.info('SMTable.render')

  useEffect(() => {
    if (loadData) {
      loadData();
    } else {
      tableDataSet({ dataSource, total: dataSource.length });
    }
  }, [ params ]);

  bindExports();

  const noPagination = props.pagination === false || hook.pagination === false;

  return (
    <Table
      className="SMTable"
      {...props}
      {...createHookProps()}
      loading={loading}
      dataSource={tableData.dataSource}
      pagination={noPagination ? false : {
        ...props.pagination,
        ...hook.pagination,
        current: params.page,
        pageSize: params.pageSize,
        total: tableData.total,
      }}
      onChange={onChange}
    />
  );

  function bindExports () {
    hook.reload = () => {
      if (loading) {
        return;
      }
      paramsSet({ ...params });
    };
  }

  function createHookProps () {
    const { rowKey, columns, scrollX, scrollY, dataSource, ...restHook } = hook;
    const hookProps = {
      ...restHook,
    };

    if (columns) {
      hookProps.columns = transformColumns(columns);
    }

    const scroll = props.scroll || {};
    if (scrollX) {
      scroll.x = scrollX;
    }
    if (scrollY) {
      scroll.y = scrollY;
    }
    if (scrollX || scrollY) {
      hookProps.scroll = scroll;
    }

    if (rowKey) {
      hookProps.rowKey = rowKey;
    } else if (!props.rowKey) {
      hookProps.rowKey = (record) => record.id;
    }

    if (typeof dataSource === 'function') {
      loadData = () => {
        loadingSet(true);
        const result = dataSource(params);
        if (result instanceof Promise) {
          result
            .then(loadDataSuccess)
            .catch(loadDataError)
            .finally(() => {
              loadingSet(false);
            });
        } else {
          loadDataSuccess(result);
          loadingSet(false);
        }
      };
    }

    return hookProps;
  }

  function loadDataSuccess (data) {
    const { list, total } = data;
    tableDataSet({ dataSource: list, total });
  }

  function loadDataError () {
    // console.info(error)
    // ...
  }

  function onChange (pagination, filters, sorter) {
    paramsSet({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  }
}

function transformColumns (columns) {
  const columnsNext = columns
    .map((column) => {
      if (Array.isArray(column)) {
        const [ title, dataIndex, option ] = column;
        const columnNext = { title };

        if (dataIndex) {
          columnNext.dataIndex = dataIndex;
        }

        if (option) {
          Object.assign(columnNext, option);
        }

        return columnNext;
      }
      return column;
    })
    .filter((column) => {
      const { disabled } = column;
      // disabled配置项为非false或者为函数并且返回值非false
      if (!disabled || typeof disabled === 'function' && !disabled()) {
        return true;
      }
      return false;
    });

  return columnsNext;
}
