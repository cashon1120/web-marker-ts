
import copyToClipboard from './copy.js'
import createBtnDom from './createBtnDom'
import WebTextMarker from './webTextMarker'
import {IWebMarker} from './interface'
import {loadStyles, 
  getElementById, 
  getUserAgent
} from './utils'

window.addEventListener('load', () => {
  createBtnDom()
  // 获取样式, 路径是根据课程实际路径来配的
  loadStyles('../META-INF/css/web-marker.css')

  // 创建调试节点, 临时调试用, 后面要删
  function debugText(text: string) {
    let debug = document.getElementById('debug')
    if(!debug){
      debug = document.createElement('div')
      debug.style.position = 'fixed'
      debug.style.bottom = '0'
      debug.style.width = '100%'
      debug.style.left = '0'
      debug.style.background = '#000'
      debug.style.color = '#fff'
      debug.style.zIndex = '9999',
      debug.style.padding = '10px'
      debug.style.fontSize = '12px'
      debug.innerHTML = '调试信息'
      document.body.appendChild(debug)
    }
    debug.innerHTML = debug.innerHTML + '<br />' + text + '...'
  }

  // 返回文本内容, 百科, 字典, 复制等使用
  function getText(){
    let str = webMarker.getSelectedText()
    if(!str){
      const id = webMarker.getCurrentId()
      str = document.getElementById(id.toString()).innerHTML
    }
    return str
  }

  // 默认标记数据
  let defaultMarkers: any = null
  const userAgent = getUserAgent()

  let webMarker: IWebMarker
  // 实例化 webMarker
  function initMarkers(){
    webMarker = new WebTextMarker({
      defaultMarkers,
      markedClassName: '_web_marker',
      focusMarkedClassName: '_focus_web_marker',
      selectedClassName: '_temp_marker',
      btnWrapperID: 'webMarkerBtnBox',
      btnArrowID: 'webMarker_arrow',
      btnMarkID: 'webMarker_btn_mark',
      btnDeleteID: 'webMarker_btn_delete'
    })
  }

  // IOS环境
  if(userAgent.isiOS){
    window.initView = (json: string) => {
      debugText('initView: 调用成功, 返回数据:' + json)
      if(json.length > 0){
        defaultMarkers = JSON.parse(json)
      }
      initMarkers()
      debugText('初始化 WebMarker 成功')
    }
  }else{
    // 安卓和PC环境
    if (window.jsObject && window.jsObject.getCallBack) {
      if(window.jsObject.getCallBack().length > 0){
        defaultMarkers = JSON.parse(window.jsObject.getCallBack())
      }
      
    } else {
    
      defaultMarkers = JSON.parse(localStorage.getItem('markers'))
      // document.getElementById('windowobject').innerHTML = '没有 getCallBack 对象'
    }
    initMarkers()
  }

  // app 操作成功回调
  window.handleMarkSuccess= () => {
    handleSave()
  }

  // 标记
  const handleMark = () => {
    webMarker.mark()
    handleSave()
  }

  // 保存
  const handleSave = () => {
    const markersJson = JSON.stringify(webMarker.getAllMarkes())
    if (webMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.save(markersJson)
      return
    }
    if (webMarker.userAgent.isiOS) {
      debugText('调用 Save 方法')
      window.webkit.messageHandlers.Save.postMessage(markersJson)
      debugText('调用 Save 成功')
      return
    }
    
    localStorage.setItem('markers', markersJson)
  }

  // 删除
  const handleDelete = () => {
    webMarker.del()
    handleSave()
  }

  // 笔记
  const handleNotes = () => {
    webMarker.mark()
    const id = webMarker.getCurrentId()
    if (webMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.note(id)
      return
    }
    if (webMarker.userAgent.isiOS) {
      debugText('调用 Note 方法')
      window.webkit.messageHandlers.Note.postMessage(id)
      debugText('调用 Note 成功')
      return
    }
  }

  // 讨论
  const handleDiscuss = () => {
    webMarker.mark()
    const id = webMarker.getCurrentId()
    if (webMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.discussion(id)
      return
      
    }
    if (webMarker.userAgent.isiOS) {
      debugText('调用 Discuss 方法')
      window.webkit.messageHandlers.Discuss.postMessage(id)
      debugText('调用 Discuss 成功')
      return
    }
  }

  // 百科
  const handleToBaike = () => {
    window.location.href = `https://baike.baidu.com/item/${getText()}`
  }

  // 字典
  const handleToDictionary = () => {
    window.location.href = `https://dict.baidu.com/s?wd=${getText()}`
  }

  
  // 拷贝
  const handleCopy = () => {
    copyToClipboard(getText())
  }


  window.webMarker = webMarker
  window.webMarker.save = handleSave

  // 给各按钮绑定对应事件
  const btn_mark = getElementById('webMarker_btn_mark')
  const btn_delete = getElementById('webMarker_btn_delete')
  const btn_notes = getElementById('webMarker_btn_notes')
  const btn_discuss = getElementById('webMarker_btn_discuss')
  const btn_baike = getElementById('webMarker_btn_baike')
  const btn_dictionary = getElementById('webMarker_btn_dictionary')
  const btn_copy = getElementById('webMarker_btn_copy')
  // const btn_save = getElementById('webMarker_btn_save')

  const { mousedown } = getUserAgent().eventName
  btn_mark.addEventListener(mousedown, handleMark)
  btn_delete.addEventListener(mousedown, handleDelete)
  btn_notes.addEventListener(mousedown, handleNotes)
  btn_discuss.addEventListener(mousedown, handleDiscuss)
  btn_baike.addEventListener(mousedown, handleToBaike)
  btn_dictionary.addEventListener(mousedown, handleToDictionary)
  btn_copy.addEventListener(mousedown, handleCopy)
  // btn_save.addEventListener(mousedown, handleSave)

  debugText('等待APP调用 initView')
  // window.getIOSData('123')
})

