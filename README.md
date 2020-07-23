# web-marker

### 介绍
主要用于在静态网页上做标记(高亮), 当然前提是网页上的内容不会发生变化, 一旦发生变化之前做的标记将会错乱;
暂不支持夸多节点标记内容;

可根据需求添加想要的操作按钮,具体使用方法参考:
dist/index.html

样式也可自定义, 写法参考:
dist/web-marker.css

### 演示地址
[点我查看](http://180.76.54.31:83 "web-marker demo")
(抱歉, 没有域名)


### 安装
npm install -D web-marker

### 使用
```javascript
const webMarker = new WebMarker({
  defaultMarkers: {}, // 默认标记数据 (选填), 数据格式为 getAllMarkes 返回结果
  selectedClassName: '_temp_marker', // 选中后样式名 (必填)
  markedClassName: '_web_marker',  // 标记样式名 (必填)
  focusMarkedClassName: '_focus_web_marker', // 选中已标记样式名 (必填)
  btnWrapperID: 'webMarkerBtnBox', // 弹框节点 ID (必填)
  btnMarkID: 'webMarker_btn_mark', // 标记(高亮) ID (必填)
  btnDeleteID: 'webMarker_btn_delete' // 删除标记 ID (必填)
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
