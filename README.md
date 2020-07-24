# web-marker

### 介绍

* 获取选中文本信息;
* 主要用于在静态网页上做标记(高亮), 当然前提是网页上的内容不会发生变化, 一旦发生变化之前做的标记将会错乱;
* 暂不支持跨多节点标记内容;
* 支持移动端, 但因在移动端选中文字后系统会有默认的弹框操作, 所以得让小伙伴在webView里把这个系统功能禁用掉;
* 可根据需求添加想要的操作按钮,具体使用方法参考: dist/index.html;
* 样式可自定义, 写法参考: dist/web-marker.css;

### 效果演示
![demo image](http://180.76.54.31/images/code.png@w=300)

demo地址: [点我查看](http://180.76.54.31:83 "web-marker demo")

### 安装
npm i web-marker

### 使用
```javascript
const webMarker = new WebMarker({
  selectedClassName: '_temp_marker',          // 选中后样式名 (必填)
  markedClassName: '_web_marker',             // 标记样式名 (必填)
  focusMarkedClassName: '_focus_web_marker',  // 选中已标记样式名 (必填)
  btnWrapperID: 'webMarkerBtn_Wrapper',       // 弹框节点 ID (必填)
  btnMarkID: 'webMarkerBtn_Mark',             // 标记(高亮) ID (必填)
  btnDeleteID: 'webMarkerBtn_Delete',         // 删除标记 ID (必填)
  defaultMarkers: {},                         // 默认标记数据 (选填), 数据格式为 getAllMarkes 返回结果
  disabledDom: ['H1', 'H2']                   // 禁用此功能标签 (选填), 这里用的 nodeName 属性, 注意大写
})

// 标记当前选中区域
webMarker.mark()

// 获取当前选中区域文本内容
webMarker.getSelectedText()

// 获取当前选中区域ID
webMarker.getCurrentId()

// 获取当前页面所有标记信息
webMarker.getAllMarkes()

// 删除当前标记
webMarker.del()

```
