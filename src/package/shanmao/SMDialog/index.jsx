import React, { useState } from 'react'
import { Modal } from 'antd'

function SMDialog ({
  hook,
  ...props
}) {
  const {
    title,
    render = () => (<div />),
    width,
    footer,

    onOpen,
    onClose,
    onSubmit,
  } = hook

  const [ visible, visibleSet ] = useState(false)
  const [ loading, loadingSet ] = useState(false)

  bindExports()

  return (
    <Modal
      {...props}
      {...createHookProps()}
    >
      {render(hook)}
    </Modal>
  )

  function show () {
    visibleSet(true)
  }

  function hide (result) {
    if (result instanceof Promise) {
      loadingSet(true)
      result.then(() => {
        loadingSet(false)
        visibleSet(false)
      })
    } else {
      visibleSet(false)
    }
  }

  function createHookProps () {
    const hookProps = {
      visible,
    }

    if (title) {
      hookProps.title = title
    }

    if (width) {
      hookProps.width = width
    }

    if (footer === null) {
      hookProps.footer = null
    }

    if (onSubmit) {
      hookProps.onOk = () => hook.submit()
    }

    if (onClose || !props.onCancel) {
      hookProps.onCancel = () => hook.close()
    }

    hookProps.okButtonProps = {
      ...props.okButtonProps,
      ...hook.okButtonProps,
      loading,
    }
    hookProps.cancelButtonProps = {
      ...props.cancelButtonProps,
      ...hook.cancelButtonProps,
      loading,
    }
    return hookProps
  }

  function bindExports () {
    hook.open = (...args) => {
      show()
      setTimeout(() => {
        onOpen && onOpen(hook, ...args)
      })
    }

    hook.close = (...args) => {
      hide(onClose && onClose(hook, ...args))
    }

    hook.submit = () => {
      hide(onSubmit && onSubmit(hook))
    }

    hook.setLoading = (nextLoading) => {
      loadingSet(nextLoading)
    }
  }
}

export default SMDialog
