const createBtnDom = () => {

  const btnBox = document.createElement('div')
  btnBox.id = 'webMarkerBtnBox'
  btnBox.style.display = 'none'
  btnBox.innerHTML = `<div>
        <div id="webMarker_arrow"></div>
        <div id="webMarker_btn_mark">高亮</div>
        <div id="webMarker_btn_notes">笔记</div>
        <div id="webMarker_btn_discuss">讨论</div>
        <div id="webMarker_btn_delete">移除</div>
        <div id="webMarker_btn_save">保存</div>
      </div>
    `
{/* <div style="${divStyle}" id="webMarker_btn_delete">删除选中标记</div> */}
{/* <div style="${divStyle}" id="webMarker_btn_cancel">取消</div> */}

  document.body.appendChild(btnBox)
}

export default createBtnDom