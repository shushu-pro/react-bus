import React, { useEffect, useState } from 'react'
import * as monaco from 'monaco-editor'
import './index.less'

export default JSONEditor

function JSONEditor (props) {
  const { hook } = props
  const [ editorValue, editorValueSet ] = useState(hook.value)
  const [ nextValue, nextValueSet ] = useState()
  const [ editorBox, editorBoxSet ] = useState(null)
  const [ editor, editorSet ] = useState(null)

  const { height = 305, readOnly, format, onSave } = hook

  createExports()

  useEffect(() => {
    if (!editorBox) {
      return
    }

    const nextEditor = monaco.editor.create(editorBox, {
      value: editorValue,
      theme: 'vs-dark',
      language: 'json',
      scrollBeyondLastLine: false,
      readOnly,
      // lineNumbers: 'off',
    })

    // eslint-disable-next-line no-bitwise
    nextEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => onEditorSave(nextEditor.getValue()))
    nextEditor.onDidChangeModelContent((e) => {
      editorValueSet(nextEditor.getValue())
    })
    if (format) {
      setTimeout(() => {
        nextEditor.trigger('格式化json', 'editor.action.formatDocument')
      })
    }

    // console.info('initEditor')
    editorSet(nextEditor)
    return () => {

    }
  }, [ editorBox ])

  useEffect(() => {
    setEditorValue(nextValue)
  }, [ nextValue ])

  useEffect(() => {
    setEditorValue(hook)
  }, [ hook.value ])

  return (
    <div className="JSONEditor">
      <div ref={(target) => editorBoxSet(target)} style={{ height: `${height}px`, border: '1px solid #666' }} />
    </div>
  )

  function onEditorSave (value) {
    onSave && onSave(value)
    // console.info('save', { value })
  }

  function createExports () {
    hook.setValue = (value) => {
      nextValueSet({ value })
    }

    hook.getValue = () => editorValue
  }

  function setEditorValue (obj) {
    if (!editor) {
      return
    }
    editor.setValue(obj.value)
    editorValueSet(obj.value)
    if (format) {
      setTimeout(() => {
        editor.trigger('格式化json', 'editor.action.formatDocument')
      })
    }
  }
}
