import React, {useState, useEffect} from "react";
import styles from './style/detail.module.less'
import { customAlphabet } from 'nanoid'

export default function Detail() {
  // 存放内容节点
  const [nodeOptions, setNodeOptions] = useState(new Map())
  const [nodeKeys, setNodeKeys] = useState([])

  useEffect(() => {
  }, [nodeOptions])

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
      console.log(event)
      // 自动添加一行dom
      addElement('editor-content', 'div', 'max-width: 100%; width: 100%; white-space: pre-wrap; word-break: break-word; caret-color: rgb(55, 53, 47); padding: 3px 2px; min-height: 1em; color: rgb(55, 53, 47); -webkit-text-fill-color: rgba(55, 53, 47, 0.5);')
      // 禁止换行
      event.preventDefault()
    }
  }

  /**
   * @description 文章内容按键事件处理
   * @param {*} event 
   */
  const onKeyDownContent = (event) => {
    const {keyCode} = event
    // Backspace
    if (keyCode === 8) {
      // 当内容为空时，删除当前节点
      if (!event.target.innerHTML) {
        const currentDataBlockId = event.target.getAttribute('data-block-id')
        // 删除节点数据
        nodeOptions.delete(currentDataBlockId)
        // 如果是第一个元素节点，光标将移动到标题的末尾
        const currentDataIndex = nodeKeys.findIndex(key => key === currentDataBlockId)
        // 获取上一个节点，如果不是第一个节点则获取，否则不存在
        const preNode = currentDataIndex ? nodeOptions.get(nodeKeys[currentDataIndex - 1]) : null
        // 删除当前节点key
        nodeKeys.splice(currentDataIndex, 1)
        // 删除节点
        event.target.remove()
        // 是否存上一节点
        if (preNode) {
          preNode.focus()
          // 获取光标范围
          var range = document.createRange();
          range.selectNodeContents(preNode);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          // 阻止删除行为
          event.preventDefault()
        } else {
          // 第一个节点，添加标题光标
          const titleNode = document.getElementById('editor-title')
          titleNode.focus()
        }
      }
    }
    // Enter
    if (keyCode === 13) {
      // 生成随机模块ID
      const dataBlockId = generateRandomModuleId()
      let elementToAdd = document.createElement('div'); 
      elementToAdd.setAttribute('data-block-id', dataBlockId)
      elementToAdd.setAttribute('style', 'max-width: 100%; width: 100%; white-space: pre-wrap; word-break: break-word; caret-color: rgb(55, 53, 47); padding: 3px 2px; min-height: 1em; color: rgb(55, 53, 47); -webkit-text-fill-color: rgba(55, 53, 47, 0.5);'); 
      elementToAdd.setAttribute('contenteditable', 'true'); 
      elementToAdd.setAttribute('spellcheck', 'true'); 
      elementToAdd.setAttribute('placeholder', '输入“/”发起指令'); 
      elementToAdd.setAttribute('data-content-editable-leaf', 'true'); 
      // insertAdjacentElement 在当前节点后面追加node
      event.target.insertAdjacentElement("afterend", elementToAdd); 
      elementToAdd.focus()
      // 存入节点数据
      setNodeOptions(new Map([...nodeOptions, [dataBlockId, elementToAdd]]))
      setNodeKeys([...nodeKeys, dataBlockId])
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
     childNodes.forEach(item => {
       // 判断光标是否停留在该元素
       const isActiveElement = document.activeElement === item
       // 内容为空，光标不在该元素则取消placeholder
       if (!item.innerHTML && !isActiveElement)  item.setAttribute('placeholder', ' ')
       // 内容为空，光标停留在该元素，则显示placeholder内容
       else if (!item.innerHTML && isActiveElement) item.setAttribute('placeholder', '输入“/”发起指令')
     })
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
    const dataBlockId = generateRandomModuleId()
    elementToAdd.setAttribute('data-block-id', dataBlockId)
    elementToAdd.setAttribute('style', style); 
    elementToAdd.setAttribute('contenteditable', 'true'); 
    elementToAdd.setAttribute('spellcheck', 'true'); 
    elementToAdd.setAttribute('placeholder', '输入“/”发起指令'); 
    elementToAdd.setAttribute('data-content-editable-leaf', 'true'); 
    parentElement.prepend(elementToAdd); 
    elementToAdd.focus()
    // 存入节点数据
    setNodeOptions(new Map([...nodeOptions, [dataBlockId, elementToAdd]]))
    setNodeKeys([...nodeKeys, dataBlockId])
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
    <div className={styles['editor-content']} id="editor-content" onKeyDown={onKeyDownContent}>
    </div>
  </div>;
}
