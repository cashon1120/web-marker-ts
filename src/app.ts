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


  let defaultMarkers = null
  if (window.jsObject && window.jsObject.getCallBack) {
    if(window.jsObject.getCallBack().length > 0){
      defaultMarkers = JSON.parse(window.jsObject.getCallBack())
    }
    
    // document.getElementById('windowobject').innerHTML = window.jsObject.getCallBack().length
  } else {
  
    defaultMarkers = JSON.parse(localStorage.getItem('markers'))
    // document.getElementById('windowobject').innerHTML = '没有 getCallBack 对象'
  }

  const webMarker = new WebTextMarker({
    defaultMarkers,
    markedClassName: '_web_marker',
    focusMarkedClassName: '_focus_web_marker',
    selectedClassName: '_temp_marker',
    btnWrapperID: 'webMarkerBtnBox',
    btnArrowID: 'webMarker_arrow',
    btnMarkID: 'webMarker_btn_mark',
    btnDeleteID: 'webMarker_btn_delete'
  })

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
      // window.webkit.messageHandlers.notes.postMessage(id)
      // window.webkit.jsObject.callBack.postMessage(this.selectedMarkers)
      return
    }

    localStorage.setItem('markers', markersJson)
  }

  const handleDelete = () => {
    webMarker.del()
    handleSave()
  }

  const handleNotes = () => {
    // debug.innerHTML = ''
    webMarker.mark()
    const id = webMarker.getCurrentId()
    if (webMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.note(id)
      return
    }

    if (webMarker.userAgent.isiOS) {
      window.webkit.messageHandlers.notes.postMessage(id)
      // window.webkit.jsObject.callBack.postMessage(this.selectedMarkers)
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
      window.webkit.messageHandlers.notes.postMessage(id)
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



  // const debug = document.getElementById('debug')
  // debug.innerHTML = webMarker.userAgent.isAndroid && window.jsObject

})

