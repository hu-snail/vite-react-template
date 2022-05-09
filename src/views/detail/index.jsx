import React, { useReducer } from "react";
import ReactDom from 'react-dom' 
import styles from './style/detail.module.less'
import { customAlphabet } from 'nanoid'
import reducer from './reducer'

const initialState = {
  nodeOptions: new Map(),
  currentNodeKey: null,
  nodeKeys: []
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
    console.log('键盘值：' + keyCode)
    // Enter换行
    if (keyCode === 13) {
      const {rootNode, editNode} = createBlockElement()
      const contentRootNode = document.getElementById('editor-content')
      contentRootNode.prepend(rootNode)
      editNode.focus()
      editNode.onfocus = function(e) {
        if (state.currentNodeKey) state.nodeOptions.get(state.currentNodeKey).setAttribute('placeholder', ''); 
        if (!e.target.innerHTML) e.target.setAttribute('placeholder', '输入“/”发起指令');
        const currentNode = getRootParent(e.target)
        dispatch({type: 'setCurrentNodeKey',payload: {
          currentNodeKey: currentNode.getAttribute('data-block-id') 
        } })
      }
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
    const {keyCode} = event
    // Backspace
    if (keyCode === 8) {
      if (!event.target.innerHTML) {
        dispatch({type: 'setCurrentNodeKey',payload: {
          currentNodeKey: null
        } })
        const currentDataBlockId = currentRoot.getAttribute('data-block-id')
        console.log(currentDataBlockId, '====')
        state.nodeOptions.delete(currentDataBlockId)
        const currentDataIndex = state.nodeKeys.findIndex(key => key === currentDataBlockId)
        console.log(currentDataIndex, '----')
        const preNode = currentDataIndex ? state.nodeOptions.get(state.nodeKeys[currentDataIndex - 1]) : null
        const titleNode = document.getElementById('editor-title')
        state.nodeKeys.splice(currentDataIndex, 1)
        currentRoot.remove()
        if (preNode) setFocus(preNode)
        else setFocus(titleNode)
      }
    }
    // Enter
    if (keyCode === 13) {
      const hasText = event.target.innerHTML
      if (!hasText) event.target.setAttribute('placeholder', ''); 
      const {rootNode, editNode} = createBlockElement()
      currentRoot.insertAdjacentElement("afterend", rootNode); 
      editNode.focus()
      editNode.onfocus = function(e) {
        if (state.currentNodeKey) state.nodeOptions.get(state.currentNodeKey).setAttribute('placeholder', ''); 
        if (!e.target.innerHTML) e.target.setAttribute('placeholder', '输入“/”发起指令');
        const currentNode = getRootParent(e.target)
        dispatch({type: 'setCurrentNodeKey',payload: {
          currentNodeKey: currentNode.getAttribute('data-block-id') 
        } })
      }
      // 禁止换行
      event.preventDefault()
    }
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
    dispatch({type: 'setNodeKeys',payload: {
      nodeKeys: [...state.nodeKeys, dataBlockId]
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
    rootNode.setAttribute('style', 'width: 100%;max-width: 1691px; margin-top: 1px;marginBottom: 1px;')
    const rootNodeChild = document.createElement('div');
    rootNodeChild.setAttribute('style', 'color: inherit;fill:inherit')
    rootNode.append(rootNodeChild)

    const childNode = document.createElement('div');
    childNode.setAttribute('style', 'display: flex;')
    rootNodeChild.append(childNode)

    const editNode = document.createElement('div');
    editNode.setAttribute('placeholder', '输入“/”发起指令');
    editNode.setAttribute('spellCheck', true)
    editNode.setAttribute('data-content-editable-leaf', true)
    editNode.setAttribute('contentEditable', true)
    editNode.setAttribute('style', 'max-width: 100%; width: 100%;white-space: pre-wrap;word-break: break-word;caret-color: rgb(55, 53, 47);padding: 3px 2px;')
    childNode.append(editNode)

    setNodeKeyData(dataBlockId, rootNode)

    return {rootNode, editNode}
  }

  return <div className="hu-editor">
      <div className={styles['editor-head']} onKeyDown={onKeyDownTitle}>
        <div id="editor-title" className={styles['editor-head-title']}  spellCheck="true"  datacontenteditableleaf="true" contentEditable="true" placeholder="无标题">
        </div>
      </div>
    <div className={styles['editor-content']} id="editor-content" onKeyDown={onKeyDownContent}>
    </div>
  </div>;
}
