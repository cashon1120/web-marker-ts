import createBtnDom from './createBtnDom'
import WebTextMarker from './index'
import {loadStyles, 
  getElementById, 
  getUserAgent
} from './utils'

window.addEventListener('load', () => {

  createBtnDom()
  loadStyles('./style.css')
  
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

  const myTextMarker = new WebTextMarker({
    defaultMarkers,
    markedClassName: '_web_marker',
    focusMarkedClassName: '_focus_web_marker',
    selectedClassName: '_temp_marker',
    btnWrapperID: 'webMarkerBtnBox',
    btnArrowID: 'webMarker_arrow',
    btnMarkID: 'webMarker_btn_mark',
    btnDeleteID: 'webMarker_btn_delete'
  })

  const handleSave = () => {
    const markersJson = JSON.stringify(myTextMarker.getAllMarkes())
    if (myTextMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.save(markersJson)
      return
    }

    if (myTextMarker.userAgent.isiOS) {
      // window.webkit.jsObject.callBack.postMessage(this.selectedMarkers)
      return
    }

    localStorage.setItem('markers', markersJson)
  }

  const handleDelete = () => {
    myTextMarker.del()
  }

  const handleNotes = () => {
    myTextMarker.mark()
    const id = myTextMarker.getCurrentId()
    if (myTextMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.save(id)
      return
    }

    if (myTextMarker.userAgent.isiOS) {
      // window.webkit.jsObject.callBack.postMessage(this.selectedMarkers)
      return
    }

    console.log('笔记', id)
  }

  const handleDiscuss = () => {
    myTextMarker.mark()
    const id = myTextMarker.getCurrentId()
    if (myTextMarker.userAgent.isAndroid && window.jsObject) {
      window.jsObject.save(id)
      return
    }

    if (myTextMarker.userAgent.isiOS) {
      // window.webkit.jsObject.callBack.postMessage(this.selectedMarkers)
      return
    }

    console.log('讨论', id)
  }

  const btn_mark = getElementById('webMarker_btn_mark')
  const btn_delete = getElementById('webMarker_btn_delete')
  const btn_notes = getElementById('webMarker_btn_notes')
  const btn_discuss = getElementById('webMarker_btn_discuss')
  const btn_save = getElementById('webMarker_btn_save')

  const { mousedown } = getUserAgent().eventName
  btn_mark.addEventListener(mousedown, () => myTextMarker.mark())
  btn_delete.addEventListener(mousedown, handleDelete)
  btn_save.addEventListener(mousedown, handleSave)
  btn_notes.addEventListener(mousedown, handleNotes)
  btn_discuss.addEventListener(mousedown, handleDiscuss)

})

