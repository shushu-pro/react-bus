import React, { useEffect, useState } from 'react'
// import * as monaco from 'monaco-editor'
import './language'
import './index.less'

export default DataXEditor

function DataXEditor (props) {
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

    // console.info('initEditor')

    const nextEditor = monaco.editor.create(editorBox, {
      value: editorValue,
      theme: 'datax',
      language: 'datax',
      autoIndent: 'brackets',
      scrollBeyondLastLine: false,
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
    if (!editor) {
      return
    }
    editor.setValue(nextValue.value)
    editorValueSet(nextValue.value)
  }, [ nextValue ])

  return (
    <div className="DataXEditor">
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
}
