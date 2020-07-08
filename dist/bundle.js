(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else {("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).copyToClipboard=e();}}(function(){return function(){return function e(t,n,o){function r(a,i){if(!n[a]){if(!t[a]){var u="function"==typeof require&&require;if(!i&&u)return u(a,!0);if(c)return c(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var s=n[a]={exports:{}};t[a][0].call(s.exports,function(e){return r(t[a][1][e]||e)},s,s.exports,e,t,n,o);}return n[a].exports}for(var c="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}}()({1:[function(e,t,n){var o=e("toggle-selection"),r="Copy to clipboard: #{key}, Enter";t.exports=function(e,t){var n,c,a,i,u,l,s=!1;t||(t={}),n=t.debug||!1;try{if(a=o(),i=document.createRange(),u=document.getSelection(),(l=document.createElement("span")).textContent=e,l.style.all="unset",l.style.position="fixed",l.style.top=0,l.style.clip="rect(0, 0, 0, 0)",l.style.whiteSpace="pre",l.style.webkitUserSelect="text",l.style.MozUserSelect="text",l.style.msUserSelect="text",l.style.userSelect="text",document.body.appendChild(l),i.selectNode(l),u.addRange(i),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");s=!0;}catch(o){n&&console.error("unable to copy using execCommand: ",o),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData("text",e),s=!0;}catch(o){n&&console.error("unable to copy using clipboardData: ",o),n&&console.error("falling back to prompt"),c=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"鈱�":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:r),window.prompt(c,e);}}finally{u&&("function"==typeof u.removeRange?u.removeRange(i):u.removeAllRanges()),l&&document.body.removeChild(l),a();}return s};},{"toggle-selection":2}],2:[function(e,t,n){t.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null;}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t);}),t&&t.focus();}};},{}]},{},[1])(1)});

  var copyToClipboard = window.copyToClipboard;

  var createBtnDom = function () {
      var btnBox = document.createElement('div');
      btnBox.id = 'webMarkerBtnBox';
      btnBox.style.display = 'none';
      btnBox.innerHTML = "<div>\n        <div id=\"webMarker_arrow\"></div>\n        <div id=\"webMarker_btn_mark\">\u9AD8\u4EAE</div>\n        <div id=\"webMarker_btn_notes\">\u7B14\u8BB0</div>\n        <div id=\"webMarker_btn_discuss\">\u8BA8\u8BBA</div>\n        <div id=\"webMarker_btn_baike\">\u767E\u79D1</div>\n        <div id=\"webMarker_btn_dictionary\">\u5B57\u5178</div>\n        <div id=\"webMarker_btn_copy\">\u62F7\u8D1D</div>\n        <div id=\"webMarker_btn_delete\">\u79FB\u9664</div>\n      </div>\n    ";
      // <div id="webMarker_btn_save">保存</div>
      document.body.appendChild(btnBox);
  };

  var setDomDisplay = function (dom, value) {
      if (!dom)
          return;
      dom.style.display = value;
  };
  var setuuid = function () {
      return new Date().getTime().toString();
  };
  var setTextSelected = function (className, text, id) {
      var span = document.createElement('span');
      span.className = className;
      span.id = id;
      span.innerHTML = text;
      return span;
  };
  var getUserAgent = function () {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var isPC = (isAndroid || isiOS) ? false : true;
      var eventName = {
          mousedown: isPC ? 'mousedown' : 'touchstart',
          mouseup: isPC ? 'mouseup' : 'touchend',
          mousemove: isPC ? 'mousemove' : 'touchmove'
      };
      var userAgent = {
          isAndroid: isAndroid,
          isiOS: isiOS,
          isPC: isPC,
          eventName: eventName
      };
      return userAgent;
  };
  var setMarkClassName = function (dom, index) {
      if (index === void 0) { index = '1'; }
      if (dom === document.body) {
          dom.className = '_WM-0';
      }
      if (dom.childNodes) {
          for (var i = 0; i < dom.childNodes.length; i++) {
              var childNode = dom.childNodes[i];
              if (childNode.nodeType === 1) {
                  var ingoreNodes = ['BR', 'HR', 'SCRIPT', 'BUTTON'];
                  if (!ingoreNodes.includes(childNode.nodeName)) {
                      childNode.className = childNode.className ? childNode.className + (" _WM-" + index + "-" + i) : "_WM-" + index + "-" + i;
                  }
                  if (childNode.childNodes.length > 0) {
                      setMarkClassName(childNode, index + 1 + ("-" + i));
                  }
              }
          }
      }
  };
  var mergeTextNode = function (dom) {
      var parentNode = dom.parentNode;
      if (!parentNode)
          return;
      var text = dom.innerText;
      var replaceTextNode = document.createTextNode(text);
      parentNode.replaceChild(replaceTextNode, dom);
      var preDom = replaceTextNode.previousSibling;
      var nextDom = replaceTextNode.nextSibling;
      // 合并文本节点
      if (preDom && preDom.nodeType === 3) {
          preDom.textContent = preDom.textContent + text;
          parentNode.removeChild(replaceTextNode);
          if (nextDom && nextDom.nodeType === 3) {
              preDom.textContent = preDom.textContent + nextDom.textContent;
              parentNode.removeChild(nextDom);
          }
      }
      else {
          if (nextDom && nextDom.nodeType === 3) {
              replaceTextNode.textContent = replaceTextNode.textContent + nextDom.textContent;
              parentNode.removeChild(nextDom);
          }
      }
  };
  var loadStyles = function (url) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(link);
  };
  var getElementById = function (id) { return document.getElementById(id); };

  // 选中下面标签时不处理, 可自由添加
  var disabledElement = ['BUTTON', 'H1', 'H2', 'IMG'];
  /**
   * @class Marker, 单个标记 信息
   * @param id: id, setuuid() 生成, 一个简单的按当前时间生成的字符串, 不需要太专业
   * @param parentClassName: 父节点className, 对应 selectedMarkers 中的 key,
   * @param childIndex: 在父节点中的索引
   * @param start: 标记开始位置
   * @param end: 标记结束位置
   */
  var Marker = /** @class */ (function () {
      function Marker(id, parentClassName, childIndex, start, end) {
          this.id = id;
          this.childIndex = childIndex;
          this.start = start;
          this.end = end;
          this.parentClassName = parentClassName || '';
      }
      return Marker;
  }());
  /**
   * @class WebTextMarker
   * @param options.defaultMarkers: 初始标记数据
   * @param options.markedClassName: 标记 className
   * @param options.focusMarkedClassName: 选中已经标记 className
   * @param options.selectedClassName: 选中后 className
   * @param options.btnWrapperID: 弹框 ID
   * @param options.btnArrowID: 弹框下方的箭头 ID
   * @param options.btnMarkID: 标记按钮 ID, 主要用于隐藏和显示, 删除按钮一样, 其实应该提到外面去处理
   * @param options.btnDeleteID: 删除按钮 ID
   */
  var WebTextMarker = /** @class */ (function () {
      function WebTextMarker(options) {
          this.MARKED_CLASSNAME = options.markedClassName;
          this.TEMP_MARKED_CLASSNAME = options.selectedClassName;
          this.FOUCE_MARKED_CLASSNAME = options.focusMarkedClassName;
          this.options = options;
          // 弹框节点
          this.btnWrapper = null;
          // 选中文本对象, 从 window.getSelection() 中拿
          this.selectedText = {};
          // 临时标记节点, 主要是 PC 端用
          this.tempMarkDom = null;
          // 所有标记数据
          this.selectedMarkers = {};
          // 当前是否有临时选中的文本
          this.hasTempDom = false;
          // 要删除的标记 id
          this.currentId = null;
          // 是否已标记
          this.isMarked = false;
          // 弹框顶部位置
          this.pageY = 0;
          // 移动端获取点击坐标, touchs[0]
          this.touch = null;
          this.init();
      }
      WebTextMarker.prototype.init = function () {
          var defaultMarkers = this.options.defaultMarkers;
          // 获取浏览器环境
          this.userAgent = getUserAgent();
          // 给每个节点加上特殊标识, 方便后面操作
          setMarkClassName(document.body);
          // 当有默认数据时, 设置标记状态, defaultMarkers 格式 this.selectedMarkers 
          if (defaultMarkers && Object.keys(defaultMarkers).length > 0) {
              this.selectedMarkers = defaultMarkers;
              this.setDefaultMarkers();
          }
          // 监听事件{}
          document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
          document.addEventListener(this.userAgent.eventName.mousedown, this.handleMouseDown.bind(this));
          // 移动端在选择文本的时候无法监听移动事件, 所以分开处理, 移动端直接在 selectionchange 事件中控制流程
          // PC 端的优势在于选中文本后先添加一个临时节点, 方便定位, 鼠标抬起后再执行后续, 移动端暂不能做到
          if (this.userAgent.isPC) {
              document.addEventListener(this.userAgent.eventName.mouseup, this.handleMouseUp.bind(this));
          }
      };
      // 选中文本事件
      WebTextMarker.prototype.handleSelectionChange = function () {
          if (window.getSelection()) {
              this.selectedText = window.getSelection();
              // 没有选中文本时隐藏弹框
              if (this.isMarked) {
                  return;
              }
              if (this.userAgent.isPC) {
                  return;
              }
              /*** 下面是移动端的处理 ***/
              var commonAncestorContainer = this.selectedText.getRangeAt(0).commonAncestorContainer;
              if (this.checkNoSelectionText() && !this.isMarked || !this.checkSelectionCount() || disabledElement.includes(commonAncestorContainer.parentNode.nodeName)) {
                  this.hide();
                  return;
              }
              // 这里模拟走 PC 端的 mouseup 事件
              if (this.selectedText.toString().length > 0) {
                  this.handleMouseUp();
              }
          }
          else {
              throw new Error('不支持 window.getSelection 属性');
          }
      };
      // 鼠标按下
      WebTextMarker.prototype.handleMouseDown = function (e) {
          var _this = this;
          if (this.userAgent.isPC) {
              this.pageY = e.pageY;
          }
          else {
              this.touch = e.touches[0];
          }
          var tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0];
          if (tempDom) {
              mergeTextNode(tempDom);
              this.hide();
          }
          var target = e.target;
          // 当选中的文本已经标记时的处理, 隐藏 "标记" 按钮, 显示 "删除" 按钮
          if (target.className.indexOf(this.MARKED_CLASSNAME) > -1) {
              this.removeFocusStyle();
              target.className = this.MARKED_CLASSNAME + " " + this.FOUCE_MARKED_CLASSNAME;
              setDomDisplay(document.getElementById(this.options.btnMarkID), 'none');
              setDomDisplay(document.getElementById(this.options.btnDeleteID), 'block');
              this.currentId = e.target.id;
              this.isMarked = true;
              this.tempMarkDom = target;
              // 利用事件循环机制处理延后显示徐弹框
              setTimeout(function () {
                  _this.show();
              }, 0);
              return;
          }
          this.tempMarkDom = null;
          this.isMarked = false;
          this.hide();
      };
      // 鼠标抬起事件, 在移动端是由 handleSelectionChange 触发
      WebTextMarker.prototype.handleMouseUp = function () {
          var _this = this;
          if (this.userAgent.isPC) {
              // 没选中, 或者选中了多个节点 不处理
              if (this.checkNoSelectionText() || !this.checkSelectionCount()) {
                  return;
              }
              // 处理一些鼠标事件引起的冲突
              setTimeout(function () {
                  if (_this.checkNoSelectionText() && !_this.isMarked && !_this.hasTempDom) {
                      _this.hide();
                  }
              }, 0);
              var commonAncestorContainer_1 = this.selectedText.getRangeAt(0).commonAncestorContainer;
              if (disabledElement.includes(commonAncestorContainer_1.parentNode.nodeName)) {
                  return;
              }
          }
          var commonAncestorContainer = this.selectedText.getRangeAt(0).commonAncestorContainer;
          setDomDisplay(document.getElementById(this.options.btnMarkID), 'block');
          setDomDisplay(document.getElementById(this.options.btnDeleteID), 'none');
          var _a = this.selectedText, anchorOffset = _a.anchorOffset, focusOffset = _a.focusOffset;
          var startIndex = Math.min(anchorOffset, focusOffset);
          var endIndex = Math.max(anchorOffset, focusOffset);
          var className = commonAncestorContainer.parentNode.className.split(' ');
          var parentClassName = className[className.length - 1];
          this.tempMarkerInfo = new Marker(setuuid(), parentClassName, 0, startIndex, endIndex);
          this.hasTempDom = true;
          if (this.userAgent.isPC) {
              var text = this.selectedText.toString();
              var rang = this.selectedText.getRangeAt(0);
              // 这里可以查看 rang 信息, 要实现选中多个节点可以在这里做文章
              // console.log(rang)
              var span = setTextSelected(this.TEMP_MARKED_CLASSNAME, text, this.tempMarkerInfo.id);
              rang.surroundContents(span);
          }
          this.show();
      };
      WebTextMarker.prototype.hide = function () {
          setDomDisplay(this.btnWrapper, 'none');
          this.removeFocusStyle();
          if (this.userAgent.isPC) {
              var tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0];
              if (!tempDom || tempDom.className.indexOf(this.MARKED_CLASSNAME) > -1)
                  return;
              mergeTextNode(tempDom);
              this.hasTempDom = false;
          }
          else {
              this.tempMarkDom = null;
          }
      };
      // 显示操作按钮
      WebTextMarker.prototype.show = function () {
          if (!this.btnWrapper) {
              this.btnWrapper = document.getElementById(this.options.btnWrapperID);
          }
          if (!this.arrow) {
              this.arrow = document.getElementById(this.options.btnArrowID);
          }
          setDomDisplay(this.btnWrapper, 'flex');
          var tempDomAttr = null;
          var left = 0;
          var top = 0;
          var tempDom = null;
          if (this.tempMarkDom) {
              tempDom = this.tempMarkDom;
          }
          else {
              tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0];
          }
          // 控制弹框显示动画
          if (tempDom) {
              tempDomAttr = tempDom.getBoundingClientRect();
              left = tempDomAttr.left + tempDom.offsetWidth / 2;
              if (tempDomAttr.width + tempDomAttr.left > window.innerWidth) {
                  left = tempDomAttr.left + 5;
              }
              top = tempDomAttr.top;
          }
          left = Math.min(window.innerWidth - 30, Math.max(10, left - 15));
          if (this.userAgent.isPC) {
              this.btnWrapper.style.top = top + window.scrollY - 50 + 'px';
              this.arrow.style.left = left + 'px';
          }
          else {
              top = tempDom ? top + window.scrollY - 50 : this.touch.pageY - 80;
              left = tempDom ? left : this.touch.pageX;
              this.btnWrapper.style.top = top + 'px';
              this.arrow.style.left = left + 'px';
          }
      };
      // 重新设置当前节点标记信息, domClassName 为当前节点 className
      WebTextMarker.prototype.resetMarker = function (domClassName) {
          var dom = document.getElementsByClassName(domClassName)[0];
          var newMarkerArr = [];
          var preNodeLength = 0;
          var _loop_1 = function (i) {
              var node = dom.childNodes[i];
              if (node.nodeName === '#text') {
                  preNodeLength = node.textContent.length;
              }
              // childIndex 为什么是 i - 1 ? 根据当前已经标记节点索引, 在后面反序列的时候才能找到正确位置
              // 比如当前节点内容为"xxx <标记节点>ooo</标记节点>", i 就是 1, 反序列的时候其实他是处于 0 的位置 
              var childIndex = i - 1;
              this_1.selectedMarkers[domClassName].forEach(function (marker) {
                  var child = dom.childNodes[i];
                  if (child.id == marker.id) {
                      newMarkerArr.push(new Marker(marker.id, '', childIndex, preNodeLength, preNodeLength + node.textContent.length));
                  }
              });
          };
          var this_1 = this;
          for (var i = 0; i < dom.childNodes.length; i++) {
              _loop_1(i);
          }
          if (newMarkerArr.length > 0) {
              this.selectedMarkers[domClassName] = newMarkerArr;
          }
          else {
              delete this.selectedMarkers[domClassName];
          }
      };
      // 设置默认选中数据
      WebTextMarker.prototype.setDefaultMarkers = function () {
          var _this = this;
          var defaultMarkers = this.selectedMarkers;
          Object.keys(defaultMarkers).forEach(function (className) {
              var dom = document.getElementsByClassName(className)[0];
              if (!dom)
                  return;
              defaultMarkers[className].forEach(function (marker) {
                  var currentNode = dom.childNodes[marker.childIndex];
                  currentNode.splitText(marker.start);
                  var nextNode = currentNode.nextSibling;
                  nextNode.splitText(marker.end - marker.start);
                  var markedNode = setTextSelected(_this.MARKED_CLASSNAME, nextNode.textContent, marker.id);
                  dom.replaceChild(markedNode, nextNode);
              });
          });
      };
      // 判断当前选中内容所包含的节点数量
      /**
       * 划重点, 这里是判断当前选中的内容节点数量, 本来超过一个节点就不处理, 如果要实现选中多个;
       * 那就在这里作文章,
       */
      WebTextMarker.prototype.checkSelectionCount = function () {
          // 判断是否选中了多个， 如果只选中了一个节点 nodeType === 3
          // 还有一种判断方式, getRangeAt(0).endContainer !== getRangeAt(0).startContainer 意味着选中了多个节点
          return this.selectedText.getRangeAt(0).endContainer === this.selectedText.getRangeAt(0).startContainer;
      };
      // 判断当前是否有选中文本
      WebTextMarker.prototype.checkNoSelectionText = function () {
          return this.selectedText.toString().length === 0 || !this.selectedText.getRangeAt;
      };
      // 移除焦点样式
      WebTextMarker.prototype.removeFocusStyle = function () {
          var focusMarker = document.getElementsByClassName(this.FOUCE_MARKED_CLASSNAME)[0];
          if (focusMarker) {
              focusMarker.className = this.MARKED_CLASSNAME;
          }
      };
      // 标记选中文本
      WebTextMarker.prototype.mark = function () {
          if (!this.tempMarkerInfo)
              return;
          var parentClassName = this.tempMarkerInfo.parentClassName;
          if (this.userAgent.isPC) {
              var tempMarkDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0];
              tempMarkDom.className = this.MARKED_CLASSNAME;
          }
          else {
              var text = this.selectedText.toString();
              var rang = this.selectedText.getRangeAt(0);
              var span = setTextSelected(this.MARKED_CLASSNAME, text, this.tempMarkerInfo.id);
              rang.surroundContents(span);
          }
          if (!this.selectedMarkers[parentClassName]) {
              this.selectedMarkers[parentClassName] = [this.tempMarkerInfo];
          }
          else {
              this.selectedMarkers[parentClassName].push(this.tempMarkerInfo);
          }
          this.currentId = this.tempMarkerInfo.id;
          this.tempMarkerInfo = null;
          this.resetMarker(parentClassName);
          this.selectedText.removeAllRanges();
          this.hide();
      };
      // 删除当前标记
      WebTextMarker.prototype.del = function () {
          if (!this.currentId)
              return;
          this.tempMarkDom = null;
          var dom = document.getElementById(this.currentId);
          var className = dom.parentNode.className.split(' ');
          var parentClassName = className[className.length - 1];
          mergeTextNode(dom);
          this.resetMarker(parentClassName);
      };
      // 返回当前选中标记ID
      WebTextMarker.prototype.getCurrentId = function () {
          return this.currentId;
      };
      // 返回当前页所有已标记数据
      WebTextMarker.prototype.getAllMarkes = function () {
          return this.selectedMarkers;
      };
      // 返回当前选中的文本内容, 用于百科, 字典, 拷贝等操作
      WebTextMarker.prototype.getSelectedText = function () {
          return this.selectedText.toString();
      };
      return WebTextMarker;
  }());

  window.addEventListener('load', function () {
      createBtnDom();
      // 获取样式, 路径是根据课程实际路径来配的
      loadStyles('../META-INF/css/web-marker.css');
      // 创建调试节点, 临时调试用, 后面要删
      function debugText(text) {
          var debug = document.getElementById('debug');
          if (!debug) {
              debug = document.createElement('div');
              debug.style.position = 'fixed';
              debug.style.bottom = '0';
              debug.style.width = '100%';
              debug.style.left = '0';
              debug.style.background = '#000';
              debug.style.color = '#fff';
              debug.style.zIndex = '9999',
                  debug.style.padding = '10px';
              debug.style.fontSize = '12px';
              debug.innerHTML = '调试信息';
              document.body.appendChild(debug);
          }
          debug.innerHTML = debug.innerHTML + '<br />' + text + '...';
      }
      // 返回文本内容, 百科, 字典, 复制等使用
      function getText() {
          var str = webMarker.getSelectedText();
          if (!str) {
              var id = webMarker.getCurrentId();
              str = document.getElementById(id.toString()).innerHTML;
          }
          return str;
      }
      // 默认标记数据
      var defaultMarkers = null;
      var userAgent = getUserAgent();
      var webMarker;
      // 实例化 webMarker
      function initMarkers() {
          webMarker = new WebTextMarker({
              defaultMarkers: defaultMarkers,
              markedClassName: '_web_marker',
              focusMarkedClassName: '_focus_web_marker',
              selectedClassName: '_temp_marker',
              btnWrapperID: 'webMarkerBtnBox',
              btnArrowID: 'webMarker_arrow',
              btnMarkID: 'webMarker_btn_mark',
              btnDeleteID: 'webMarker_btn_delete'
          });
      }
      // IOS环境
      if (userAgent.isiOS) {
          window.initView = function (json) {
              debugText('initView: 调用成功, 返回数据:' + json);
              if (json.length > 0) {
                  defaultMarkers = JSON.parse(json);
              }
              initMarkers();
              debugText('初始化 WebMarker 成功');
          };
      }
      else {
          // 安卓和PC环境
          if (window.jsObject && window.jsObject.getCallBack) {
              if (window.jsObject.getCallBack().length > 0) {
                  defaultMarkers = JSON.parse(window.jsObject.getCallBack());
              }
          }
          else {
              defaultMarkers = JSON.parse(localStorage.getItem('markers'));
              // document.getElementById('windowobject').innerHTML = '没有 getCallBack 对象'
          }
          initMarkers();
      }
      // app 操作成功回调
      window.handleMarkSuccess = function () {
          handleSave();
      };
      // 标记
      var handleMark = function () {
          webMarker.mark();
          handleSave();
      };
      // 保存
      var handleSave = function () {
          var markersJson = JSON.stringify(webMarker.getAllMarkes());
          if (webMarker.userAgent.isAndroid && window.jsObject) {
              window.jsObject.save(markersJson);
              return;
          }
          if (webMarker.userAgent.isiOS) {
              debugText('调用 Save 方法');
              window.webkit.messageHandlers.Save.postMessage(markersJson);
              debugText('调用 Save 成功');
              return;
          }
          localStorage.setItem('markers', markersJson);
      };
      // 删除
      var handleDelete = function () {
          webMarker.del();
          handleSave();
      };
      // 笔记
      var handleNotes = function () {
          webMarker.mark();
          var id = webMarker.getCurrentId();
          if (webMarker.userAgent.isAndroid && window.jsObject) {
              window.jsObject.note(id);
              return;
          }
          if (webMarker.userAgent.isiOS) {
              debugText('调用 Note 方法');
              window.webkit.messageHandlers.Note.postMessage(id);
              debugText('调用 Note 成功');
              return;
          }
      };
      // 讨论
      var handleDiscuss = function () {
          webMarker.mark();
          var id = webMarker.getCurrentId();
          if (webMarker.userAgent.isAndroid && window.jsObject) {
              window.jsObject.discussion(id);
              return;
          }
          if (webMarker.userAgent.isiOS) {
              debugText('调用 Discuss 方法');
              window.webkit.messageHandlers.Discuss.postMessage(id);
              debugText('调用 Discuss 成功');
              return;
          }
      };
      // 百科
      var handleToBaike = function () {
          window.location.href = "https://baike.baidu.com/item/" + getText();
      };
      // 字典
      var handleToDictionary = function () {
          window.location.href = "https://dict.baidu.com/s?wd=" + getText();
      };
      // 拷贝
      var handleCopy = function () {
          copyToClipboard(getText());
      };
      window.webMarker = webMarker;
      window.webMarker.save = handleSave;
      // 给各按钮绑定对应事件
      var btn_mark = getElementById('webMarker_btn_mark');
      var btn_delete = getElementById('webMarker_btn_delete');
      var btn_notes = getElementById('webMarker_btn_notes');
      var btn_discuss = getElementById('webMarker_btn_discuss');
      var btn_baike = getElementById('webMarker_btn_baike');
      var btn_dictionary = getElementById('webMarker_btn_dictionary');
      var btn_copy = getElementById('webMarker_btn_copy');
      // const btn_save = getElementById('webMarker_btn_save')
      var mousedown = getUserAgent().eventName.mousedown;
      btn_mark.addEventListener(mousedown, handleMark);
      btn_delete.addEventListener(mousedown, handleDelete);
      btn_notes.addEventListener(mousedown, handleNotes);
      btn_discuss.addEventListener(mousedown, handleDiscuss);
      btn_baike.addEventListener(mousedown, handleToBaike);
      btn_dictionary.addEventListener(mousedown, handleToDictionary);
      btn_copy.addEventListener(mousedown, handleCopy);
      // btn_save.addEventListener(mousedown, handleSave)
      debugText('等待APP调用 initView');
      // window.getIOSData('123')
  });

})));
