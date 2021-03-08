<p align="center"><a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo"></a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/v/vue.svg?sanitize=true" alt="Version">
  </a>
  <img src="https://img.shields.io/badge/vue-源码分析-svg?sanitize=true" >
  </a>
</p>

<h2 align="center">vue2.6 源码分析记录</h2>


<p align="center">本项目是直接clone Vue2.6源码的项目。自己学习原理和源码分析的记录和笔记。</p>

### 整体源码结构


| 文件名 | 作用 |
| - | - |
| .circleci | 持续集成/持续部署(ci/cd)配置[https://circleci.com/](https://circleci.com/) |
| .github | 存放针对项目开发/贡献代码的文档（基于github） |
| benchmarks | vue的一些性能测试文件和demo （好几年没维护了） |
| dist | 打包后的vue源码（多种构建/规范版本） |
| examples | 基于vue的一些demo小项目（好几年没维护） |
| flow | 类型检查工具flow定义的地方（各种内置功能的类型定义） |
| packages | vue插件包，在配合开发工具项目时候按需使用 |
| scripts | vue打包的配置文件及一些自动化脚本 |
| src | 源码目录结构 |
| test | 单元测试/e2e测试用例目录 |
| types | 针对typeScript的类型声明文件及配置 |



### 源码核心模块

```javascript
 src/
```
- compiler：编译源码相关文件夹
- core：核心代码文件夹
- platforms：不同平台支持文件夹
- server：支持服务端渲染文件夹
- sfc：.vue单文件解析文件夹
- shared: 共享代码


### 构建后的版本

打包后会产生很多类型的文件，默认的vue是Runtime +  UMD 版本的构建，也是vue-cli默认导出的版本。

runtime版本是不包含Compiler的版本。其中带min的是压缩版本，适用于线上生产环境。

| 模块类型| UMD 规范 | CommonJS 规范| ES Module 规范 |
| --- | --- | --- | --- |
| **全部** | vue.js | vue.common.js | vue.esm.js |
| **Runtime版本** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
### 入口文件


```javascript
src/platforms/web/entry-runtime-with-compiler.js
```

运行项目生成map文件，进行debug
  
```javascript
yarn debug
```
