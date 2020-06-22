import createBtnDom from './createBtnDom'
import WebTextMarker from './index'
import {loadStyles, 
  getElementById, 
  getUserAgent
} from './utils'

window.addEventListener('load', () => {

  createBtnDom()
  loadStyles('../META-INF/css/web-marker.css')
  
  // // localStorage.removeItem('markers')
  // // 获取已有数据

  function debugText(text: string) {
    const debug = document.getElementById('debug')
    debug.innerHTML = debug.innerHTML + '<br />' + text
  }


  let defaultMarkers: any = null
  let webMarker: any = {}
  const userAgent = getUserAgent()
  if(userAgent.isiOS){
    window.initView = (json: string) => {
      debugText('initView: 调用成功, 返回数据:' + json)
      if(json.length > 0){
        defaultMarkers = JSON.parse(json)
      }
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
      debugText('初始化 WebMarker 成功')
    }
  }else{
    if (window.jsObject && window.jsObject.getCallBack) {
      if(window.jsObject.getCallBack().length > 0){
        defaultMarkers = JSON.parse(window.jsObject.getCallBack())
      }
      
    } else {
    
      defaultMarkers = JSON.parse(localStorage.getItem('markers'))
      // document.getElementById('windowobject').innerHTML = '没有 getCallBack 对象'
    }

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

  const handleMark = () => {
    webMarker.mark()
    handleSave()
  }

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

  const handleDelete = () => {
    webMarker.del()
    handleSave()
  }

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
    console.log('笔记', id)
  }

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
    console.log('讨论', id)
  }

  window.handleMarkSuccess= () => {
    handleSave()
  }
  window.webMarker = webMarker
  window.webMarker.save = handleSave

  const btn_mark = getElementById('webMarker_btn_mark')
  const btn_delete = getElementById('webMarker_btn_delete')
  const btn_notes = getElementById('webMarker_btn_notes')
  const btn_discuss = getElementById('webMarker_btn_discuss')
  // const btn_save = getElementById('webMarker_btn_save')

  const { mousedown } = getUserAgent().eventName
  btn_mark.addEventListener(mousedown, handleMark)
  btn_delete.addEventListener(mousedown, handleDelete)
  btn_notes.addEventListener(mousedown, handleNotes)
  btn_discuss.addEventListener(mousedown, handleDiscuss)
  // btn_save.addEventListener(mousedown, handleSave)



  const debug = document.getElementById('debug')
  debugText('等待APP调用 initView')
  // window.getIOSData('123')
})

