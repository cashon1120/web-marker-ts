import {Styles, UserAgaent, EventName, Button, IWebMarker} from './interface'

export const setDomDisplay = (dom: HTMLElement, value: string) => {
  if(!dom) return
  dom.style.display = value
}

export const setuuid = () => {
  return new Date().getTime().toString()
}

export const setTextSelected = (className: string, text: string, id: string) => {
  const span = document.createElement('span')
  span.className = className
  span.id = id
  span.innerHTML = text
  return span
}

export const getUserAgent = () => {
  const u = navigator.userAgent
  const isAndroid: boolean = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  const isiOS: boolean = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const isPC: boolean = (isAndroid || isiOS) ? false : true
  const eventName: EventName = {
    mousedown: isPC ? 'mousedown' : 'touchstart',
    mouseup: isPC ? 'mouseup' : 'touchend',
    mousemove: isPC ? 'mousemove': 'touchmove'
  }
  const userAgent: UserAgaent = {
    isAndroid,
    isiOS,
    isPC,
    eventName
  }
  return userAgent
}

export const setMarkClassName = (dom: HTMLElement, index:string = '1') => {
  if(dom === document.body){
    dom.className = '_WM-0'
  }
  if (dom.childNodes) {
    for (let i = 0; i < dom.childNodes.length; i++) {
      const childNode = dom.childNodes[i] as HTMLElement
      if (childNode.nodeType === 1) {
        const ingoreNodes = ['BR', 'HR', 'SCRIPT', 'BUTTON']
        if (!ingoreNodes.includes(childNode.nodeName)) {
          childNode.className = childNode.className ? childNode.className + ` _WM-${index}-${i}` : `_WM-${index}-${i}`
        }
        if (childNode.childNodes.length > 0) {
          setMarkClassName(childNode, index + 1 + `-${i}`)
        }
      }
    }
  }
}

export const mergeTextNode = (dom: HTMLElement) => {
  const parentNode = dom.parentNode
  if(!parentNode) return
  const text = dom.innerText
  const replaceTextNode = document.createTextNode(text)
  parentNode.replaceChild(replaceTextNode, dom)
  const preDom = replaceTextNode.previousSibling
  const nextDom = replaceTextNode.nextSibling

  // 合并文本节点
  if (preDom && preDom.nodeType === 3) {
    preDom.textContent = preDom.textContent + text
    parentNode.removeChild(replaceTextNode)
    if (nextDom && nextDom.nodeType === 3) {
      preDom.textContent = preDom.textContent + nextDom.textContent
      parentNode.removeChild(nextDom)
    }
  } else {
    if (nextDom && nextDom.nodeType === 3) {
      replaceTextNode.textContent = replaceTextNode.textContent + nextDom.textContent
      parentNode.removeChild(nextDom)
    }
  }
}

export const setDomStyles = (dom: HTMLElement, styles: Styles) => {
  Object.keys(styles).forEach((key: any) => {
    dom.style[key] = styles[key]
  })
}

export const loadStyles = (url: string) => {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}

export const getElementById = (id: string) => document.getElementById(id)

export const createBtnDom = (btns: Button[], wrapperClassName: string, context: IWebMarker) => {
  const wrapper = document.createElement('div')
  wrapper.className = `web-marker-wrapper`
  wrapper.id = wrapperClassName
  document.body.appendChild(wrapper)
  for(let i = 0; i < btns.length; i++){
    const btn = document.createElement('div')
    const {label, event} = btns[i]
    btn.className = 'web-marker-btn'
    btn.innerHTML = label
    wrapper.appendChild(btn)
    btn.addEventListener('click', () => {
      event && event()
      context.hide()
    })
  }
  return wrapper
}