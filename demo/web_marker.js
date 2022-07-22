(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.web_marker = factory());
})(this, (function () { 'use strict';

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
  var createBtnDom = function (btns, wrapperClassName, context) {
      var wrapper = document.createElement('div');
      wrapper.className = "web-marker-wrapper";
      wrapper.id = wrapperClassName;
      document.body.appendChild(wrapper);
      var _loop_1 = function (i) {
          var btn = document.createElement('div');
          var _a = btns[i], label = _a.label, event_1 = _a.event;
          btn.className = 'web-marker-btn';
          btn.innerHTML = label;
          wrapper.appendChild(btn);
          btn.addEventListener('click', function () {
              event_1 && event_1();
              context.hide();
          });
      };
      for (var i = 0; i < btns.length; i++) {
          _loop_1(i);
      }
      return wrapper;
  };

  // 选中下面标签时不处理, 可自由添加
  var disabledElement = ["BUTTON", "IMG"];
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
          this.parentClassName = parentClassName || "";
      }
      return Marker;
  }());
  /**
   * @class WebMarker
   * @param options.defaultMarkers: 初始标记数据
   * @param options.markedClassName: 标记 className
   * @param options.focusMarkedClassName: 选中已经标记 className
   * @param options.selectedClassName: 选中后 className
   * @param options.btnWrapperID: 弹框 ID
   */
  var WebMarker = /** @class */ (function () {
      function WebMarker(options) {
          if (!options.btns || options.btns.length === 0) {
              throw new Error("请传入按钮选项");
          }
          if (!options.btnWrapperID) {
              throw new Error("请传入按钮节点ID: btnWrapperID");
          }
          // if (!options.btnDeleteID) {
          //   throw new Error("请传入删除按钮节点ID: btnDeleteID");
          // }
          this.MARKED_CLASSNAME = options.markedClassName;
          this.TEMP_MARKED_CLASSNAME = options.selectedClassName;
          this.FOUCE_MARKED_CLASSNAME = options.focusMarkedClassName;
          this.options = options;
          // 弹框节点
          this.btnWrapper = createBtnDom(options.btns, options.btnWrapperID, this);
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
      WebMarker.prototype.init = function () {
          var _a = this.options, defaultMarkers = _a.defaultMarkers; _a.disabledDom;
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
          document.addEventListener("selectionchange", this.handleSelectionChange.bind(this));
          document.addEventListener(this.userAgent.eventName.mousedown, this.handleMouseDown.bind(this));
          // 移动端直接在 selectionchange 事件中控制流程
          // PC端的优势在于选中文本后先添加一个临时节点, 方便定位, 鼠标抬起后再执行后续, 移动端暂不能做到
          if (this.userAgent.isPC) {
              document.addEventListener(this.userAgent.eventName.mouseup, this.handleMouseUp.bind(this));
          }
      };
      // 选中文本事件
      WebMarker.prototype.handleSelectionChange = function () {
          if (window.getSelection()) {
              this.selectedText = window.getSelection();
              // 没有选中文本时隐藏弹框
              if (this.isMarked || this.userAgent.isPC) {
                  return;
              }
              /*** 下面是移动端的处理 ***/
              var commonAncestorContainer = this.selectedText.getRangeAt(0).commonAncestorContainer;
              if ((this.checkNoSelectionText() && !this.isMarked) ||
                  !this.checkSelectionCount() ||
                  disabledElement.includes(commonAncestorContainer.parentNode.nodeName)) {
                  this.hide();
                  return;
              }
              // 这里模拟走 PC 端的 mouseup 事件
              if (this.selectedText.toString().length > 0) {
                  this.handleMouseUp();
              }
          }
          else {
              throw new Error("抱歉, 不支持 window.getSelection 方法");
          }
      };
      // 鼠标按下
      WebMarker.prototype.handleMouseDown = function (e) {
          var _this = this;
          var pageY = e.pageY, touches = e.touches, target = e.target;
          if (this.userAgent.isPC) {
              this.pageY = pageY;
          }
          else {
              this.touch = touches[0];
          }
          if (target.className.indexOf("web-marker-btn") > -1) {
              return;
          }
          var tempDom = document.getElementsByClassName(this.TEMP_MARKED_CLASSNAME)[0];
          if (tempDom) {
              mergeTextNode(tempDom);
              this.hide();
          }
          // 当选中的文本已经标记时的处理, 隐藏 "标记" 按钮, 显示 "删除" 按钮
          if (target.className.indexOf(this.MARKED_CLASSNAME) > -1) {
              this.removeFocusStyle();
              target.className = this.MARKED_CLASSNAME + " " + this.FOUCE_MARKED_CLASSNAME;
              this.currentId = e.target.id;
              this.isMarked = true;
              this.tempMarkDom = target;
              // 利用事件循环, 延后显示弹框
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
      WebMarker.prototype.handleMouseUp = function () {
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
          var _a = this.selectedText, anchorOffset = _a.anchorOffset, focusOffset = _a.focusOffset;
          var startIndex = Math.min(anchorOffset, focusOffset);
          var endIndex = Math.max(anchorOffset, focusOffset);
          var className = commonAncestorContainer.parentNode.className.split(" ");
          var parentClassName = className[className.length - 1];
          this.tempMarkerInfo = new Marker(setuuid(), parentClassName, 0, startIndex, endIndex);
          this.hasTempDom = true;
          if (this.userAgent.isPC) {
              var text = this.selectedText.toString();
              var rang = this.selectedText.getRangeAt(0);
              // 这里可以查看 rang 信息, 要实现选中多个节点可以在这里做文章
              var span = setTextSelected(this.TEMP_MARKED_CLASSNAME, text, this.tempMarkerInfo.id);
              rang.surroundContents(span);
          }
          this.show();
      };
      // 隐藏弹框
      WebMarker.prototype.hide = function () {
          setDomDisplay(this.btnWrapper, "none");
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
      WebMarker.prototype.show = function () {
          if (!this.btnWrapper) {
              this.btnWrapper = document.getElementById(this.options.btnWrapperID);
          }
          setDomDisplay(this.btnWrapper, "flex");
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
          if (window.innerWidth <= 768) {
              left = "1%";
          }
          else {
              left = Math.min(window.innerWidth - 30, Math.max(0, left));
          }
          if (this.userAgent.isPC) {
              this.btnWrapper.style.top = top + window.scrollY - 40 + "px";
              this.btnWrapper.style.left = left + "px";
          }
          else {
              top = tempDom ? top + window.scrollY - 40 : this.touch.pageY - 70;
              left = tempDom ? left : this.touch.pageX;
              this.btnWrapper.style.top = top + "px";
              this.btnWrapper.style.left = "1%";
          }
      };
      // 重新设置当前节点标记信息, domClassName 为当前节点 className
      WebMarker.prototype.resetMarker = function (domClassName) {
          var dom = document.getElementsByClassName(domClassName)[0];
          var newMarkerArr = [];
          var preNodeLength = 0;
          var _loop_1 = function (i) {
              var node = dom.childNodes[i];
              if (node.nodeName === "#text") {
                  preNodeLength = node.textContent.length;
              }
              // childIndex 为什么是 i - 1 ? 根据当前已经标记节点索引, 在后面反序列的时候才能找到正确位置 比如当前节点内容为"xxx
              // <标记节点>ooo</标记节点>", i 就是 1, 反序列的时候其实他是处于 0 的位置
              var childIndex = i - 1;
              this_1.selectedMarkers[domClassName].forEach(function (marker) {
                  var child = dom.childNodes[i];
                  if (child.id == marker.id) {
                      newMarkerArr.push(new Marker(marker.id, "", childIndex, preNodeLength, preNodeLength + node.textContent.length));
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
      WebMarker.prototype.setDefaultMarkers = function () {
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
      WebMarker.prototype.checkSelectionCount = function () {
          // 判断是否选中了多个， 如果只选中了一个节点 nodeType === 3 还有一种判断方式, getRangeAt(0).endContainer !==
          // getRangeAt(0).startContainer 意味着选中了多个节点
          return (this.selectedText.getRangeAt(0).endContainer ===
              this.selectedText.getRangeAt(0).startContainer);
      };
      // 判断当前是否有选中文本
      WebMarker.prototype.checkNoSelectionText = function () {
          return (this.selectedText.toString().length === 0 || !this.selectedText.getRangeAt);
      };
      // 移除焦点样式
      WebMarker.prototype.removeFocusStyle = function () {
          var focusMarker = document.getElementsByClassName(this.FOUCE_MARKED_CLASSNAME)[0];
          if (focusMarker) {
              focusMarker.className = this.MARKED_CLASSNAME;
          }
      };
      // 标记选中文本
      WebMarker.prototype.mark = function () {
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
      WebMarker.prototype.del = function () {
          if (!this.currentId)
              return;
          this.tempMarkDom = null;
          var dom = document.getElementById(this.currentId);
          var className = dom.parentNode.className.split(" ");
          var parentClassName = className[className.length - 1];
          mergeTextNode(dom);
          this.resetMarker(parentClassName);
      };
      // 返回当前选中标记ID
      WebMarker.prototype.getCurrentId = function () {
          return this.currentId;
      };
      // 返回当前页所有已标记数据
      WebMarker.prototype.getAllMarkes = function () {
          return this.selectedMarkers;
      };
      // 返回当前选中的文本内容, 用于百科, 字典, 拷贝等操作
      WebMarker.prototype.getSelectedText = function () {
          var _a;
          var str = this.selectedText.toString();
          if (!str) {
              var id = ((_a = this.tempMarkerInfo) === null || _a === void 0 ? void 0 : _a.id) || this.getCurrentId();
              str = document.getElementById(id.toString()).innerHTML;
          }
          this.tempMarkerInfo = null;
          return str;
      };
      return WebMarker;
  }());
  window.WebMarker = WebMarker;

  return WebMarker;

}));
