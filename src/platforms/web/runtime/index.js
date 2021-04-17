/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'
// 覆盖默认导出的 config 对象的属性
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components 
// 把web相关功能都合并到Vue.options中
// 注册 v-model v-show指令
extend(Vue.options.directives, platformDirectives)
// 注册 Transition, TransitionGroup组件  
extend(Vue.options.components, platformComponents)

// install platform patch function 
// inBrowser  typeof window !== 'undefined'
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
// 渲染DOM的函数
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
// 配合vue的浏览器开发者工具
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}


// /src/platforms/web/runtime/index.js 文件作用
// 设置平台化的 Vue.config。
// 在 Vue.options 上混合了两个指令(directives)，分别是 model 和 show。
// 在 Vue.options 上混合了两个组件(components)，分别是 Transition 和 TransitionGroup。
// 在 Vue.prototype 上添加了两个方法：__patch__ 和 $mount

export default Vue
