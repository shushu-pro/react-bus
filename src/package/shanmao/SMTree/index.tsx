import React, { useState, useEffect } from 'react';
import { Modal, Space, Spin, Tooltip, Tree } from 'antd';
import { TreeProps, AntTreeNodeProps } from 'antd/lib/tree/Tree';
import styles from './index.less';

interface SMTreeInterface {
  (): JSX.Element;
  readonly reload?: () => void;
}

type TreeNodeConfig = AntTreeNodeProps & {
  label?: string;
  HoverButtons?: () => JSX.Element;
};

type ButtonConfig = {
  label?: string;
  icon?: JSX.Element | ((node) => JSX.Element);
  onClick?: (config: TreeNodeConfig) => void;
  tips?: string | ((config: TreeNodeConfig) => JSX.Element);
};

export type SMTreeProps = {
  title?: (row: any) => void;
  dataSource: (params: any) => void;
  props?: TreeProps; // 传递组件的原生props
  hoverButtons?: {
    buttons: Array<ButtonConfig>;
  };
  icon?: () => JSX.Element;
  visible?: (config) => boolean;
  disabled?: (config) => boolean;
};

const propsKey = Symbol('propsKey');

function useSMTree(props: SMTreeProps) {
  const SMTreeFactory: SMTreeInterface = () => {
    const {
      props = {},
      dataSource,
      title,
      hoverButtons,
      icon,
      visible,
      disabled,
    } = SMTree[propsKey];

    const [params, paramsSet] = useState({});
    const [loading, loadingSet] = useState(false);
    const [treeData, treeDataSet] = useState([]);
    const adapterOption = {
      title,
      hoverButtons,
      icon,
      visible,
      disabled,
    };

    useEffect(fetchDataSource, [params]);

    exportAPI();

    return (
      <Spin spinning={loading}>
        <Tree {...props} treeData={treeData} />
      </Spin>
    );

    function exportAPI() {
      Object.assign(SMTree, {
        reload() {
          if (loading) {
            return;
          }
          paramsSet({ ...params });
        },
      });
    }

    function createExternalProps(innerAPI) {
      const externalProps: { [k: string]: unknown } = {};
      return externalProps;
    }

    // 拉取数据
    function fetchDataSource() {
      const result = dataSource(params);
      if (result instanceof Promise) {
        loadingSet(true);
        result
          .then((data) => {
            treeDataSet(treeDataAdapter(data, adapterOption));
          })
          .catch(() => {
            // ...
          })
          .finally(() => {
            loadingSet(false);
          });
      } else {
        treeDataSet(treeDataAdapter(result, adapterOption));
      }
    }
  };

  const [SMTree] = useState(() => SMTreeFactory);

  SMTree[propsKey] = props;

  return SMTree;
}

export default useSMTree;

function treeDataAdapter(
  originTreeData,
  { disabled, title, hoverButtons, icon, visible }
) {
  const treeData = [];

  walkNodes(originTreeData, treeData);

  return treeData;

  function walkNodes(nodes, dataOutput) {
    nodes.forEach((node) => {
      // 没有visible配置项，或者visible()返回值为true
      if (!visible || visible(node) === true) {
        const { title, id, children, ...rest } = node;
        const normalizeNode: TreeNodeConfig = {
          ...rest,
          label: title,
          id,
          key: id,
          children: [],
        };

        // 有配置hoverButtons，则在hover的时候显示按钮
        if (hoverButtons) {
          normalizeNode.HoverButtons = hoverButtonsFactory(
            normalizeNode,
            hoverButtons
          );
        }

        normalizeNode.title = defaultTitleFactory(normalizeNode);
        normalizeNode.disabled = disabled
          ? disabled(normalizeNode)
          : normalizeNode.disabled || false;

        if (Array.isArray(children)) {
          walkNodes(children, normalizeNode.children);
        }

        dataOutput.push(normalizeNode);
      }
    });
  }

  function defaultTitleFactory(normalizeNode) {
    return (
      <span className={styles.treeNode}>
        <span className={styles.treeTitle}>{normalizeNode.label}</span>
        {normalizeNode.HoverButtons && <normalizeNode.HoverButtons />}
      </span>
    );
  }

  function hoverButtonsFactory(normalizeNode, hoverButtons) {
    return () => {
      return (
        <span className={styles.hoverButtons}>
          <Space>
            {hoverButtons.buttons.map((button) => {
              return (
                <Tooltip
                  key={button.icon}
                  placement="top"
                  title={button.tips || button.label || ''}
                >
                  <span
                    onClick={(e) => {
                      button.onClick && button.onClick(normalizeNode);
                      e.stopPropagation();
                    }}
                  >
                    <button.icon />
                    <span className={styles.buttonLabel}>
                      {button.label ? button.label : null}
                    </span>
                  </span>
                </Tooltip>
              );
            })}
          </Space>
        </span>
      );
    };
  }
}
