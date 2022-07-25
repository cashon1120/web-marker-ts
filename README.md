# web-marker

### 介绍

* 获取选中文本信息;
* 主要用于在静态网页上做标记(高亮), 当然前提是网页上的内容不会发生变化, 一旦发生变化之前做的标记将会错乱;
* 当然也可作为简单的文本选中工具;
* 暂不支持跨多节点标记内容;
* 支持移动端, 但因在移动端选中文字后系统会有默认的弹框操作, 所以得让小伙伴在webView里把这个系统功能禁用掉;
* 可根据需求添加想要的操作按钮,具体使用方法参考: demo/index.html;
* 样式可自定义, 写法参考: demo/web-marker.css;

### 效果演示

<img src="https:webmarker.hi515.cn/demo.png" width="400" title="demo" alt="demo" />

[DEMO](https:webmarker.hi515.cn "web-marker demo")

### 安装
npm i web-marker

### 使用
```javascript
let defaultMarkers = JSON.parse(localStorage.getItem('markers'))
// 创建实例, npm 安装使用的话 直接 new WebMarker({...})
const webMarker = new WebMarker({
  defaultMarkers: defaultMarkers, // 默认标记数据 (选填), 数据格式为 getAllMarkes 返回结果
  selectedClassName: '_temp_marker', // 选中后样式名 (必填)
  markedClassName: '_web_marker', // 标记样式名 (必填)
  focusMarkedClassName: '_focus_web_marker', // 选中已标记样式名 (必填)
  btnWrapperID: 'webMarkerBtn_Wrapper', // 弹框节点 ID (必填)
  disabledDom: ['BUTTON', 'H1', 'H2', 'IMG'], // 禁用此功能标签 (选填)
  btns: [{
    label: '标记',
    event: () => {
      webMarker.mark()
      // 如果需要保存在本地的话可自行处理， 如：
      const markersJson = JSON.stringify(webMarker.getAllMarkes())
      localStorage.setItem('markers', markersJson)
    }
  },{
    label: '百科', 
    event: () => {
      // 获取当前选中的文本内容
      const text = webMarker.getSelectedText()
      window.location.href = `https://baike.baidu.com/search/none?word=${text}`
    }
  },{
    label: '全部标记信息', 
    event: () => {
      const allText = webMarker.getAllMarkes()
      console.log(allText)
    }
  }, {
    label: '当前标记ID', 
    event: () => {
      const id = webMarker.getCurrentId()
      console.log(id)
    }
  },{
    label: '删除', 
    event: () => {
      webMarker.del()
    }
  }]
})
```
