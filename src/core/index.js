import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 注册vue全局的配置和静态成员
initGlobalAPI(Vue)


// 服务端渲染有关代码
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})
// 定义vue版本
Vue.version = '__VERSION__'
// src/core/index.js文件作用
// 首先将核心的 Vue，也就是在 core/instance/index.js 文件中的 Vue，
// 也可以说是原型被包装(添加属性和方法)后的 Vue 导入，然后使用 initGlobalAPI 方法给 Vue 添加静态方法和属性，除此之外，
// 在这个文件里，也对原型进行了修改，为其添加了两个属性：$isServer 和 $ssrContext，最后添加了 Vue.version 属性并导出了 Vue
export default Vue
