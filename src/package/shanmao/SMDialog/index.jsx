import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';

function SMDialog ({ hook, ...props }) {
  const {
    title,
    render = () => (<div />),
    width,
    footer,

    onOpen,
    onClose,
    onSubmit,
    afterClose,
  } = hook;
  const [ contentLoading, contentLoadingSet ] = useState(false);
  const [ visible, visibleSet ] = useState(false);
  const [ loading, loadingSet ] = useState(false);
  const [ isUpdate, isUpdateSet ] = useState(false);
  useEffect(() => {
    isUpdateSet(true);
  }, []);

  useEffect(() => {
    contentLoadingSet(hook.loading || false);
  }, [ hook.loading ]);

  useEffect(() => {
    if (!visible && isUpdate) {
      setTimeout(() => {
        afterClose && afterClose();
      }, 100);
    }
  }, [ visible ]);

  bindExports();

  return (
    <Modal
      maskClosable={false}
      {...props}
      {...createHookProps()}
    >
      <Spin spinning={contentLoading}>
        {render(hook)}
      </Spin>
    </Modal>
  );

  function show () {
    visibleSet(true);
  }

  function hide (result) {
    if (result instanceof Promise) {
      loadingSet(true);
      result.then(() => {
        loadingSet(false);
        visibleSet(false);
      });
    } else if (result !== false) {
      visibleSet(false);
    }
  }

  function createHookProps () {
    const hookProps = {
      ...hook.props,
      visible,
    };

    if (title) {
      hookProps.title = title;
    }

    if (width) {
      hookProps.width = width;
    }

    if (footer === null) {
      hookProps.footer = null;
    }

    if (onSubmit) {
      hookProps.onOk = () => hook.submit();
    }

    if (onClose || !props.onCancel) {
      hookProps.onCancel = () => hook.close();
    }

    hookProps.okButtonProps = {
      ...props.okButtonProps,
      ...hook.okButtonProps,
      loading,
    };
    hookProps.cancelButtonProps = {
      ...props.cancelButtonProps,
      ...hook.cancelButtonProps,
      loading,
    };
    return hookProps;
  }

  function bindExports () {
    hook.open = (...args) => {
      show();
      setTimeout(() => {
        onOpen && onOpen(hook, ...args);
      });
    };

    hook.close = (...args) => {
      hide(onClose && onClose(hook, ...args));
    };

    hook.submit = () => {
      hide(onSubmit && onSubmit(hook));
    };

    hook.setLoading = (nextLoading) => {
      loadingSet(nextLoading);
    };
  }
}

export default SMDialog;
