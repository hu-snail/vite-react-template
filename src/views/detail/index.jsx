import React, { useReducer } from "react";
import ReactDom from 'react-dom' 
import styles from './style/detail.module.less'
import { customAlphabet } from 'nanoid'
import reducer from './reducer'

const initialState = {
  nodeOptions: new Map(),
  currentNodeKey: null
};


export default function Detail() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * @description 生成随机模块ID标识
   * @param {*} event 
   */
  const generateRandomModuleId = () => {
    const randomStr = '1234567890abcdefghijklmnopqrstuvwxyz'
    const nanoid1 = customAlphabet(randomStr, 8)
    const nanoid2 = customAlphabet(randomStr, 4)
    const nanoid3 = customAlphabet(randomStr, 4)
    const nanoid4 = customAlphabet(randomStr, 4)
    const nanoid5 = customAlphabet(randomStr, 12)
    return `${nanoid1()}-${nanoid2()}-${nanoid3()}-${nanoid4()}-${nanoid5()}`
  }

  /**
   * @description 标题鼠标按键事件处理
   * @param {*} event 
   */
  const onKeyDownTitle = (event) => {
    const {keyCode} = event
    event.target.oninput = function(e) {
      const style = 'max-width: 100%; width: 100%;white-space: pre-wrap;word-break: break-word;caret-color: rgb(55, 53, 47);padding: 3px 2px;'
      if (e.target.innerHTML) e.target.setAttribute('style', style)
      else e.target.setAttribute('style', style + '-webkit-text-fill-color: rgba(55, 53, 47, 0.15);')
    }
    // Enter换行
    if (keyCode === 13) {
      const {rootNode, editNode} = createBlockElement()
      const contentRootNode = document.getElementById('editor-content')
      contentRootNode.prepend(rootNode)
      editNode.focus()
      // 禁止换行
      event.preventDefault()
    }
  }

  /**
   * @description 获取父级元素
   * @param {*} currentDom
   * @returns 
   */
  const getRootParent = (currentDom) => {
    var root = currentDom;
    // data-block-id不为空即可
    if(root.parentNode && !root.getAttribute('data-block-id')){
      root = getRootParent(root.parentNode);
    }
    return root;
}

/**
 * @description 获取输入框节点
 * @param {*} currentParentDom 
 */
const getEditNode = (currentParentDom) => {
  var editNode = currentParentDom;
  if(editNode.childNodes.length && !editNode.getAttribute('contentEditable')){
    editNode = getEditNode(editNode.childNodes[0]);
  }
  return editNode;
}


  /**
   * 
   * @description 文章内容按键事件处理
   * @param {*} event 
   */
  const onKeyDownContent = (event) => {
    const currentRoot = getRootParent(event.target)
    const titleNode = document.getElementById('editor-title')
    const {keyCode} = event
    // Backspace
    if (keyCode === 8) {
      // 无内容删除节点和对应节点数据及节点焦点处理
      if (!event.target.innerHTML) {
        handleNoContentFallBack(titleNode, currentRoot)
      } else {
        var sel = window.getSelection();
        // 光标位置，光标在内容区域则删除，否则执行回退
        const focusOffset = sel.baseOffset
        if (focusOffset) return
        // 有内容则携带内容退回上一节点，同时删除当前节点和节点数据
        const currentHtml = event.target.innerHTML
        let preNode = currentRoot.previousElementSibling
        if (preNode) {
          // 内容节点回退处理
          const preKeyNode = preNode.getAttribute('data-block-id')
          handleContentFallBack(preNode, currentHtml, currentRoot, preKeyNode)
        } else {
          // 回退至标题
          handleContentFallBack(titleNode, currentHtml, currentRoot, null)
        }
      }
    }
    // Enter
    if (keyCode === 13) {
      const hasText = event.target.innerHTML
      if (!hasText) event.target.setAttribute('placeholder', ''); 
      const {rootNode, editNode} = createBlockElement()
      currentRoot.insertAdjacentElement("afterend", rootNode); 
      editNode.focus()
      // 禁止换行
      event.preventDefault()
    }
  }

  /**
   * @description 有内容回车键处理事件
   * @param {*} preNode 上一节点
   * @param {*} currentHtml 当前节点数据
   * @param {*} currentRoot 当前节点根节点
   * @param {*} newNodeKey 新节点key
   */
  const handleContentFallBack = (preNode, currentHtml, currentRoot, newNodeKey) => {
    dispatch({type: 'setCurrentNodeKey',payload: {
      currentNodeKey: newNodeKey
    }})
    let preNodeEdit = getEditNode(preNode)
    const hasPreHtml = preNodeEdit.innerHTML
    preNodeEdit.innerHTML += currentHtml
    // 上一节点内容为空时，则修改节点style, 改为有内容
    if (!hasPreHtml) {
      const style = 'max-width: 100%; width: 100%;white-space: pre-wrap;word-break: break-word;caret-color: rgb(55, 53, 47);padding: 3px 2px;'
      preNodeEdit.setAttribute('style', style)
    }
    // 删除当前节点
    const currentDataBlockId = currentRoot.getAttribute('data-block-id')
    state.nodeOptions.delete(currentDataBlockId)
    currentRoot.remove()
    setFocus(preNode)
  }

  /**
   * @description 节点无内容事件处理
   * @param {*} titleNode 标题节点
   * @param {*} currentRoot 当前节点根目录
   */
  const handleNoContentFallBack = (titleNode, currentRoot) => {
    dispatch({type: 'setCurrentNodeKey',payload: {
      currentNodeKey: null
    }})
    const currentDataBlockId = currentRoot.getAttribute('data-block-id')
    state.nodeOptions.delete(currentDataBlockId)
    const preNode = currentRoot.previousElementSibling
    currentRoot.remove()
    if (preNode) setFocus(preNode)
    else setFocus(titleNode)
  }
  /**
   * @description 节点数据处理
   * @param {*} dataBlockId
   * @param {*} element 
   */
  const setNodeKeyData =  (dataBlockId, element) => {
    dispatch({type: 'setNodeOptions',payload: {
      nodeOptions: new Map([...state.nodeOptions, [dataBlockId, element]])
    } })
    dispatch({type: 'setCurrentNodeKey',payload: {
      currentNodeKey: dataBlockId
    } })
  }

  /**
   * @description 获取焦点
   * @param {*} node 
   */
  const setFocus = (node)  => {
    const editNode = getEditNode(node)
    editNode.focus()
    // 获取光标范围
    var range = document.createRange();
    range.selectNodeContents(editNode);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    // 阻止删除行为
    window.event.preventDefault()
  }


  /**
   * @description 创建模块dom
   * @returns {*} rootNode:模块根节点 editNode：输入模块节点
   */
  const createBlockElement = () => {
    // 生成随机模块ID
    const dataBlockId = generateRandomModuleId()
    let rootNode = document.createElement('div'); 
    rootNode.setAttribute('data-block-id', dataBlockId)
    rootNode.setAttribute('class', 'editor-selectable')
    rootNode.setAttribute('style', 'width: 100%;max-width: 1691px; margin-top: 1px;margin-bottom: 1px;')
    const rootNodeChild = document.createElement('div');
    rootNodeChild.setAttribute('style', 'color: inherit;fill:inherit')
    rootNode.append(rootNodeChild)

    const childNode = document.createElement('div');
    childNode.setAttribute('style', 'display: flex;')
    rootNodeChild.append(childNode)

    const style = 'max-width: 100%; width: 100%;white-space: pre-wrap;word-break: break-word;caret-color: rgb(55, 53, 47);padding: 3px 2px;'
    const editNode = document.createElement('div');
    editNode.setAttribute('placeholder', '输入“/”发起指令');
    editNode.setAttribute('spellCheck', true)
    editNode.setAttribute('data-content-editable-leaf', true)
    editNode.setAttribute('contentEditable', true)
    editNode.setAttribute('style', style + '-webkit-text-fill-color: rgba(55, 53, 47, 0.15);')
    childNode.append(editNode)
   
    bandEditNodeEvent(editNode, style)
    setNodeKeyData(dataBlockId, rootNode)

    return {rootNode, editNode}
  }

  /**
   * @description 绑定输入框事件
   * @param {*} editNode 输入框节点
   * @param {*} style 输入框样式
   */
  const bandEditNodeEvent = (editNode, style) => {
    editNode.oninput = function(e) {
      if (e.target.innerHTML) e.target.setAttribute('style', style)
      else e.target.setAttribute('style', style + '-webkit-text-fill-color: rgba(55, 53, 47, 0.15);')
    }
    editNode.onfocus = function(e) {
      if (state.currentNodeKey) {
        const editNode = getEditNode(state.nodeOptions.get(state.currentNodeKey))
        editNode.setAttribute('placeholder', ''); 
      }
      if (!e.target.innerHTML) e.target.setAttribute('placeholder', '输入“/”发起指令');
      const currentNode = getRootParent(e.target)
      dispatch({type: 'setCurrentNodeKey',payload: {
        currentNodeKey: currentNode.getAttribute('data-block-id') 
      }})
    }
  }

  return <div className="hu-editor">
      <div className={styles['editor-head']} onKeyDown={onKeyDownTitle}>
        <div id="editor-title" style={{ 
          maxWidth: '100%',
          width: '100%',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          caretColor: 'rgb(55, 53, 47)',
          padding: '3px 2px',
          minHeight: '1em',
          color: 'rgb(55, 53, 47)',
          WebkitTextFillColor: 'rgba(55, 53, 47, 0.15)',
          cursor: 'text'
        }}
        spellCheck="true"
        datacontenteditableleaf="true"
        contentEditable="true"
        placeholder="无标题">
        </div>
      </div>
    <div className={styles['editor-content']} id="editor-content" onKeyDown={onKeyDownContent}>
    </div>
  </div>;
}
