## 安装
npm install  

## 编译
npm run watch  
监听文件变化并编译到 dist 目录下

## 打包
npm run build  
生成 bundle.js 到 dist 目录, 最后就是拷贝这个文件的内容到 app 里

## 运行
serve -s dist  
启动一个本地服务, 可能没有 serve 命令, 别的方法也是可以, 能启动一个类似 localhost:5000 的运行环境就行

## src文件夹结构说明
├─ src
   ├── app.ts: 入口文件, 初始化相关信息  
   ├── copy.js: 复制插件  
   ├── createBtnDom.ts: 创建弹框DOM  
   ├── interface.ts: 接口声明文件  
   ├── utils.ts: 工具  
   └── webTextMarker.ts: 标记功能核心文件  

dist 文件夹的内容不用太关注, 只要晓得 bundle.js 就行了






