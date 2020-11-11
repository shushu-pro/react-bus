import React, { useEffect, useState } from 'react'
import * as monaco from 'monaco-editor'
import './index.less'

export default JSONEditor

function JSONEditor (props) {
  const { hook } = props
  const [ editorValue, editorValueSet ] = useState(hook.value)
  const [ editorBox, editorBoxSet ] = useState(null)
  const [ editor, editorSet ] = useState(null)

  const { height = 305, readOnly, format } = hook

  createExports()

  useEffect(() => {
    if (!editorBox) {
      return
    }

    const editor = monaco.editor.create(editorBox, {
      value: editorValue,
      theme: 'vs-dark',
      language: 'json',
      scrollBeyondLastLine: false,
      readOnly,
      // lineNumbers: 'off',
    })
    // eslint-disable-next-line no-bitwise
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => onSave(editor.getValue()))
    editor.onDidChangeModelContent((e) => {
      editorValueSet(editor.getValue())
    })
    if (format) {
      setTimeout(() => {
        console.info('初始化格式化')
        editor.trigger('格式化json', 'editor.action.formatDocument')
      })
    }
    editorSet(editor)
    console.info('initEditor')

    return () => {

    }
  }, [ editorBox ])

  useEffect(() => {
    if (!editor) {
      return
    }
    editor.setValue(editorValue)
  }, [ editorValue ])

  return (
    <div className="JSONEditor">
      <div ref={(target) => editorBoxSet(target)} style={{ height: `${height}px`, border: '1px solid #666' }} />
    </div>
  )

  function onSave (value) {
    console.info('save', { value })
  }

  function createExports () {
    hook.setValue = (value) => {
      editorValueSet(value)
    }

    hook.getValue = () => editorValue
  }
}
