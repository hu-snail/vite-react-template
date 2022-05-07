import React, {useEffect} from "react";
import styles from './style/detail.module.less'

export default function Detail() {
  /**
   * @description 标题鼠标按键事件处理
   * @param {*} event 
   */
  const onKeyDownTitle = (event) => {
    const {keyCode} = event
    console.log('键盘值：' + keyCode)
    // Enter换行
    if (keyCode === 13) {
      console.log(event)
      // 自动添加一行dom
      addElement('editor-content', 'div', 'max-width: 100%; width: 100%; white-space: pre-wrap; word-break: break-word; caret-color: rgb(55, 53, 47); padding: 3px 2px; min-height: 1em; color: rgb(55, 53, 47); -webkit-text-fill-color: rgba(55, 53, 47, 0.5);')
      // 禁止换行
      event.preventDefault()
    }
  }

  const onKeyDownContent = (event) => {
    const {keyCode} = event
    console.log(keyCode)
    // Backspace
    if (keyCode === 8) {
      // 当内容为空时，删除当前节点
      if (!event.target.innerHTML) {
        event.target.remove()
        // 如果是第一个元素节点，光标将移动到标题的末尾
        const dataIndex = parseInt(event.target.getAttribute('data-index'))
        // 除内容节点第一个以外
        if (dataIndex) {
          // 获取上一个节点，并添加光标
          const preNode = getElementByDataIndex(dataIndex - 1)
          if (preNode) preNode.focus()
        } else {
          // 第一个节点，添加标题光标
          const titleNode = document.getElementById('editor-title')
// if(titleNode.selectionStart){//非IE浏览器
// oTa2.selectionStart=i;
// oTa2.selectionEnd=i;
// }else{//IE
// var range = oTa2.createTextRange();
// range.move("character",i);
// range.select();
// }
          titleNode.focus()
        }
      }
    }
    // Enter
    if (keyCode === 13) {
      let elementToAdd = document.createElement('div'); 
      elementToAdd.setAttribute('style', 'max-width: 100%; width: 100%; white-space: pre-wrap; word-break: break-word; caret-color: rgb(55, 53, 47); padding: 3px 2px; min-height: 1em; color: rgb(55, 53, 47); -webkit-text-fill-color: rgba(55, 53, 47, 0.5);'); 
      elementToAdd.setAttribute('contenteditable', 'true'); 
      elementToAdd.setAttribute('spellcheck', 'true'); 
      elementToAdd.setAttribute('placeholder', '输入“/”发起指令'); 
      elementToAdd.setAttribute('data-content-editable-leaf', 'true'); 
      event.target.insertAdjacentElement("afterend", elementToAdd); 
      elementToAdd.focus()
      onContentChange()
      elementToAdd.onfocus = function(e) {
        onContentChange()
      }
      // 禁止换行
      event.preventDefault()
    }
  }

  // 监听内容变化
  const onContentChange = () => {
     let parentElement = document.getElementById('editor-content'); 
     const childNodes = parentElement.childNodes
     childNodes.forEach((item, index) => {
       // 添加节点下标
       item.setAttribute('data-index', index)

       // 判断光标是否停留在该元素
       const isActiveElement = document.activeElement === item
       // 内容为空，光标不在该元素则取消placeholder
       if (!item.innerHTML && !isActiveElement)  item.setAttribute('placeholder', ' ')
       // 内容为空，光标停留在该元素，则显示placeholder内容
       else if (!item.innerHTML && isActiveElement) item.setAttribute('placeholder', '输入“/”发起指令')
     })
  }

  // 根据data-index返回节点
  const getElementByDataIndex = (dataIndex) => {
    let parentElement = document.getElementById('editor-content'); 
    const childNodes = parentElement.childNodes
    for (let i = 0; i < childNodes.length; i ++) {
      const itemDataIndex = parseInt(childNodes[i].getAttribute('data-index'))
      if (dataIndex === itemDataIndex) return childNodes[i]
    }
  }

  /**
   * @description 添加dom
   * @param {*} parentId 父级Id
   * @param {*} elementTag 元素标签
   * @param {*} style 样式
   */
  const addElement = (parentId, elementTag, style) => { 
    let parentElement = document.getElementById(parentId); 
    let elementToAdd = document.createElement(elementTag); 
    elementToAdd.setAttribute('style', style); 
    elementToAdd.setAttribute('contenteditable', 'true'); 
    elementToAdd.setAttribute('spellcheck', 'true'); 
    elementToAdd.setAttribute('placeholder', '输入“/”发起指令'); 
    elementToAdd.setAttribute('data-content-editable-leaf', 'true'); 
    parentElement.prepend(elementToAdd); 
    elementToAdd.focus()
    onContentChange()
    elementToAdd.onfocus = function(e) {
      onContentChange()
    }

} 

  return <div className="hu-editor">
      <div className={styles['editor-head']} onKeyDown={onKeyDownTitle}>
        <div id="editor-title" className={styles['editor-head-title']}  spellCheck="true"  datacontenteditableleaf="true" contentEditable="true" placeholder="无标题">
        </div>
      </div>
    <div className="editor-content" id="editor-content" onKeyDown={onKeyDownContent}>
    </div>
  </div>;
}
