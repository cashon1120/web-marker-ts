import {
  setDomDisplay,
  setuuid,
  setTextSelected,
  getUserAgent,
  setMarkClassName,
  mergeTextNode
} from './utils'

import {WebMarkerOptions, SelectedMarkers, UserAgaent, IMarker, IWebMarker} from './interface'

// 选中下面标签时不处理, 可自由添加
const disabledElement = ['BUTTON', 'H1', 'H2', 'IMG']

/**
 * @class Marker, 单个标记 信息
 * @param id: id, setuuid() 生成, 一个简单的按当前时间生成的字符串, 不需要太专业
 * @param parentClassName: 父节点className, 对应 selectedMarkers 中的 key,
 * @param childIndex: 在父节点中的索引
 * @param start: 标记开始位置
 * @param end: 标记结束位置
 */

class Marker implements IMarker {
  id : string;
  childIndex : number;
  start : number;
  end : number;
  parentClassName?: string;

  constructor(id : string, parentClassName : string, childIndex : number, start : number, end : number) {
    this.id = id
    this.childIndex = childIndex
    this.start = start
    this.end = end
    this.parentClassName = parentClassName || ''
  }
}

/**
 * @class WebMarker
 * @param options.defaultMarkers: 初始标记数据
 * @param options.markedClassName: 标记 className
 * @param options.focusMarkedClassName: 选中已经标记 className
 * @param options.selectedClassName: 选中后 className
 * @param options.btnWrapperID: 弹框 ID
 * @param options.btnMarkID: 标记按钮 ID, 主要用于隐藏和显示, 删除按钮一样
 * @param options.btnDeleteID: 删除按钮 ID
 */

class WebMarker implements IWebMarker {
  MARKED_CLASSNAME : string;
  TEMP_MARKED_CLASSNAME : string;
  FOUCE_MARKED_CLASSNAME : string;

  options : WebMarkerOptions;
  userAgent : UserAgaent;
  arrow : HTMLElement;
  btnWrapper : HTMLElement | null;
  selectedMarkers : SelectedMarkers;
  tempMarkerInfo : Marker;
  tempMarkDom : HTMLElement | null;
  selectedText : any;
  hasTempDom : boolean;
  currentId : string | null;
  isMarked : boolean;
  pageY : number;
  touch : any;

  constructor(options : WebMarkerOptions) {

    if (!options.btnWrapperID) {
      throw new Error("请传入按钮节点ID: btnWrapperID");
    }

    if (!options.btnMarkID) {
      throw new Error("请传入高亮节点ID: btnMarkID");
    }

    if (!options.btnDeleteID) {
      throw new Error("请传入删除节点ID: btnDeleteID");
    }

    this.MARKED_CLASSNAME = options.markedClassName
    this.TEMP_MARKED_CLASSNAME = options.selectedClassName
    this.FOUCE_MARKED_CLASSNAME = options.focusMarkedClassName

    this.options = options

    // 弹框节点
    this.btnWrapper = null

    // 选中文本对象, 从 window.getSelection() 中拿
    this.selectedText = {}

    // 临时标记节点, 主要是 PC 端用
    this.tempMarkDom = null

    // 所有标记数据
    this.selectedMarkers = {}

    // 当前是否有临时选中的文本
    this.hasTempDom = false

    // 要删除的标记 id
    this.currentId = null

    // 是否已标记
    this.isMarked = false

    // 弹框顶部位置
    this.pageY = 0

    // 移动端获取点击坐标, touchs[0]
    this.touch = null

    this.init()
  }

  private init() {
    const {defaultMarkers, disabledDom} = this.options
    if(disabledDom && Array.isArray(disabledDom)){
      disabledElement.concat(disabledDom)
    }

    // 获取浏览器环境
    this.userAgent = getUserAgent()

    // 给每个节点加上特殊标识, 方便后面操作
    setMarkClassName(document.body)

    // 当有默认数据时, 设置标记状态, defaultMarkers 格式 this.selectedMarkers
    if (defaultMarkers && Object.keys(defaultMarkers).length > 0) {
      this.selectedMarkers = defaultMarkers
      this.setDefaultMarkers()
    }

    // 监听事件{}
    document.addEventListener('selectionchange', this.handleSelectionChange.bind(this))
    document.addEventListener(this.userAgent.eventName.mousedown, this.handleMouseDown.bind(this))

    // 移动端在选择文本的时候无法监听移动事件, 所以分开处理, 移动端直接在 selectionchange 事件中控制流程 PC
    // 端的优势在于选中文本后先添加一个临时节点, 方便定位, 鼠标抬起后再执行后续, 移动端暂不能做到

    if (this.userAgent.isPC) {
      document.addEventListener(this.userAgent.eventName.mouseup, this.handleMouseUp.bind(this))
    }
  }

  // 选中文本事件
  private handleSelectionChange() {
    if (window.getSelection()) {
      this.selectedText = window.getSelection()
      // 没有选中文本时隐藏弹框
      if (this.isMarked) {
        return
      }

      if (this.userAgent.isPC) {
        return
      }

      /*** 下面是移动端的处理 ***/
      const {commonAncestorContainer} = this
        .selectedText
        .getRangeAt(0)
      if (this.checkNoSelectionText() && !this.isMarked || !this.checkSelectionCount() || disabledElement.includes(commonAncestorContainer.parentNode.nodeName)) {
        this.hide()
        return
      }

      // 这里模拟走 PC 端的 mouseup 事件
   

      if (this.selectedText.toString().length > 0) {
        this.handleMouseUp()
      }

    } else {
      throw new Error('不支持 window.getSelection 属性')
    }
  }

  // 鼠标按下
  private handleMouseDown(e : MouseEvent | TouchEvent | any) {
    if (this.userAgent.isPC) {
      this.pageY = e.pageY

    } else {
      this.touch = e.touches[0]
    }
    const tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0]as HTMLElement
    if (tempDom) {
      mergeTextNode(tempDom)
      this.hide()
    }
    const target = e.target

    // 当选中的文本已经标记时的处理, 隐藏 "标记" 按钮, 显示 "删除" 按钮
    if (target.className.indexOf(this.MARKED_CLASSNAME) > -1) {
      this.removeFocusStyle()
      target.className = `${this.MARKED_CLASSNAME} ${this.FOUCE_MARKED_CLASSNAME}`
      setDomDisplay(document.getElementById(this.options.btnMarkID), 'none')
      setDomDisplay(document.getElementById(this.options.btnDeleteID), 'block')
      this.currentId = e.target.id
      this.isMarked = true
      this.tempMarkDom = target
      // 利用事件循环机制处理延后显示徐弹框
      setTimeout(() => {
        this.show()
      }, 0);
      return
    }
    this.tempMarkDom = null
    this.isMarked = false
    this.hide()
  }

  // 鼠标抬起事件, 在移动端是由 handleSelectionChange 触发
  private handleMouseUp() {
    if (this.userAgent.isPC) {
      // 没选中, 或者选中了多个节点 不处理
      if (this.checkNoSelectionText() || !this.checkSelectionCount()) {
        return
      }

      // 处理一些鼠标事件引起的冲突
      setTimeout(() => {
        if (this.checkNoSelectionText() && !this.isMarked && !this.hasTempDom) {
          this.hide()
        }
      }, 0);

      const {commonAncestorContainer} = this
        .selectedText
        .getRangeAt(0)
      if (disabledElement.includes(commonAncestorContainer.parentNode.nodeName)) {
        return
      }
    }
    const {commonAncestorContainer} = this
      .selectedText
      .getRangeAt(0)
    setDomDisplay(document.getElementById(this.options.btnMarkID), 'block')
    setDomDisplay(document.getElementById(this.options.btnDeleteID), 'none')

    const {anchorOffset, focusOffset} = this.selectedText
    const startIndex = Math.min(anchorOffset, focusOffset)
    const endIndex = Math.max(anchorOffset, focusOffset)
    const className = commonAncestorContainer
      .parentNode
      .className
      .split(' ')
    let parentClassName = className[className.length - 1]
    this.tempMarkerInfo = new Marker(setuuid(), parentClassName, 0, startIndex, endIndex)
    this.hasTempDom = true
    if (this.userAgent.isPC) {
      const text = this
        .selectedText
        .toString()
      const rang = this
        .selectedText
        .getRangeAt(0)
      // 这里可以查看 rang 信息, 要实现选中多个节点可以在这里做文章
      const span = setTextSelected(this.TEMP_MARKED_CLASSNAME, text, this.tempMarkerInfo.id)
      rang.surroundContents(span)
    }
    this.show()
  }

  private hide() {
    setDomDisplay(this.btnWrapper, 'none')
    this.removeFocusStyle()
    if (this.userAgent.isPC) {
      const tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0]as HTMLElement
      if (!tempDom || tempDom.className.indexOf(this.MARKED_CLASSNAME) > -1) 
        return
      mergeTextNode(tempDom)
      this.hasTempDom = false
    } else {
      this.tempMarkDom = null
    }
  }

  // 显示操作按钮
  private show() {
    if (!this.btnWrapper) {
      this.btnWrapper = document.getElementById(this.options.btnWrapperID)
    }
    setDomDisplay(this.btnWrapper, 'flex')
    let tempDomAttr = null
    let left: number | string = 0
    let top = 0
    let tempDom = null
    if (this.tempMarkDom) {
      tempDom = this.tempMarkDom
    } else {
      tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0]as HTMLElement
    }

    // 控制弹框显示动画
    if (tempDom) {
      tempDomAttr = tempDom.getBoundingClientRect()
      left = tempDomAttr.left + tempDom.offsetWidth / 2
      if (tempDomAttr.width + tempDomAttr.left > window.innerWidth) {
        left = tempDomAttr.left + 5
      }
      top = tempDomAttr.top
    }
    if(window.innerWidth <= 768){
      left = '1%'
    }else{
      left = Math.min(window.innerWidth - 30, Math.max(0, left))
    }
    if (this.userAgent.isPC) {
      this.btnWrapper.style.top = top + window.scrollY - 50 + 'px'
      this.btnWrapper.style.left = left + 'px'
    } else {
      top = tempDom
        ? top + window.scrollY - 50
        : this.touch.pageY - 80
      left = tempDom
        ? left
        : this.touch.pageX
      this.btnWrapper.style.top = top + 'px'
      this.btnWrapper.style.left = '1%'
    }
  }

  // 重新设置当前节点标记信息, domClassName 为当前节点 className
  private resetMarker(domClassName : string) {
    const dom = document.getElementsByClassName(domClassName)[0]
    const newMarkerArr : Marker[] = []
    let preNodeLength = 0
    for (let i = 0; i < dom.childNodes.length; i++) {
      const node = dom.childNodes[i]
      if (node.nodeName === '#text') {
        preNodeLength = node.textContent.length
      }
      // childIndex 为什么是 i - 1 ? 根据当前已经标记节点索引, 在后面反序列的时候才能找到正确位置 比如当前节点内容为"xxx
      // <标记节点>ooo</标记节点>", i 就是 1, 反序列的时候其实他是处于 0 的位置
      const childIndex = i - 1
      this
        .selectedMarkers[domClassName]
        .forEach((marker : Marker) => {
          const child = dom.childNodes[i]as HTMLElement
          if (child.id == marker.id) {
            newMarkerArr.push(new Marker(marker.id, '', childIndex, preNodeLength, preNodeLength + node.textContent.length))
          }
        })
    }
    if (newMarkerArr.length > 0) {
      this.selectedMarkers[domClassName] = newMarkerArr
    } else {
      delete this.selectedMarkers[domClassName]
    }
  }

  // 设置默认选中数据
  private setDefaultMarkers() {
    const defaultMarkers = this.selectedMarkers
    Object
      .keys(defaultMarkers)
      .forEach(className => {
        const dom = document.getElementsByClassName(className)[0]
        if (!dom) 
          return
        defaultMarkers[className].forEach((marker : Marker) => {
          const currentNode : Text = dom.childNodes[marker.childIndex]as Text
          currentNode.splitText(marker.start);
          const nextNode = currentNode.nextSibling as Text;
          nextNode.splitText(marker.end - marker.start)
          const markedNode = setTextSelected(this.MARKED_CLASSNAME, nextNode.textContent, marker.id)

          dom.replaceChild(markedNode, nextNode)
        })
      })
  }

  // 判断当前选中内容所包含的节点数量
  /**
   * 划重点, 这里是判断当前选中的内容节点数量, 本来超过一个节点就不处理, 如果要实现选中多个;
   * 那就在这里作文章,
   */
  private checkSelectionCount() {
    // 判断是否选中了多个， 如果只选中了一个节点 nodeType === 3 还有一种判断方式, getRangeAt(0).endContainer !==
    // getRangeAt(0).startContainer 意味着选中了多个节点
    return this
      .selectedText
      .getRangeAt(0)
      .endContainer === this
      .selectedText
      .getRangeAt(0)
      .startContainer
  }

  // 判断当前是否有选中文本
  private checkNoSelectionText() {
    return this
      .selectedText
      .toString()
      .length === 0 || !this.selectedText.getRangeAt
  }

  // 移除焦点样式
  private removeFocusStyle() {
    const focusMarker = document.getElementsByClassName(this.FOUCE_MARKED_CLASSNAME)[0]
    if (focusMarker) {
      focusMarker.className = this.MARKED_CLASSNAME
    }
  }

  // 标记选中文本
  mark() {
    if (!this.tempMarkerInfo) 
      return
    const {parentClassName} = this.tempMarkerInfo
    if (this.userAgent.isPC) {
      const tempMarkDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0]
      tempMarkDom.className = this.MARKED_CLASSNAME
    } else {

      const text = this
        .selectedText
        .toString()
      const rang = this
        .selectedText
        .getRangeAt(0)
      const span = setTextSelected(this.MARKED_CLASSNAME, text, this.tempMarkerInfo.id)
      rang.surroundContents(span);
    }
    if (!this.selectedMarkers[parentClassName]) {
      this.selectedMarkers[parentClassName] = [this.tempMarkerInfo]
    } else {
      this
        .selectedMarkers[parentClassName]
        .push(this.tempMarkerInfo)
    }
    this.currentId = this.tempMarkerInfo.id
    this.tempMarkerInfo = null
    this.resetMarker(parentClassName)
    this
      .selectedText
      .removeAllRanges()
    this.hide()
  }

  // 删除当前标记
  del() {
    if (!this.currentId) 
      return
    this.tempMarkDom = null
    const dom = document.getElementById(this.currentId)as any
    const className = dom
      .parentNode
      .className
      .split(' ')
    const parentClassName = className[className.length - 1]
    mergeTextNode(dom)
    this.resetMarker(parentClassName)
  }

  // 返回当前选中标记ID
  getCurrentId() {
    return this.currentId
  }

  // 返回当前页所有已标记数据
  getAllMarkes() {
    return this.selectedMarkers
  }

  // 返回当前选中的文本内容, 用于百科, 字典, 拷贝等操作
  getSelectedText() {
    return this
      .selectedText
      .toString()
  }

}
window.WebMarker = WebMarker
export default WebMarker
