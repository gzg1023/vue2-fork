/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'
// 实例的唯一标识
let uid = 0

export function initMixin(Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    // 性能测试相关代码
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // 标识是vue实例，不需要被响应式处理
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        // vue本身的选项，如全局api，vue内置组件等
        resolveConstructorOptions(vm.constructor),
        // 用户传入的option，如el，data，template等
        options || {},
        vm
      )
    }
     //  _render函数执行中，提供更友好的错误检测能力，不支持Proxy属性就不执行了（🐶）
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      // 生产环境渲染对象就是自己
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化vue实例的各种东西
    // 初始化配置及生命周期相关变量
    initLifecycle(vm)
    // 初始化当前组件的事件监听器等内容
    initEvents(vm)
    // 初始化slot $attrs $listeners 相关属性
    initRender(vm)
    // 触发beforeCreate生命周期钩子函数
    callHook(vm, 'beforeCreate')
    // 初始化依赖注入的 注入（inject）
    initInjections(vm) // resolve injections before data/props
    // 初始化props methods data computed watch
    initState(vm)
    // 初始化依赖注入的 依赖（provide）
    initProvide(vm) // resolve provide after data/props
    // 触发created生命周期钩子函数
    callHook(vm, 'created')

    /* istanbul ignore if */
    // 全局的Vue.config.performance配置。设置为true可以开启性能追踪
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 调用渲染DOM的函数，对实例进行挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent(vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
// 解析构造者的 options
export function resolveConstructorOptions(Ctor: Class<Component>) {
  // Ctor 就是 vm.constructor 可能随着实例创建的对象而修改并非一直是vue可能是vue子类
  let options = Ctor.options
  // 如果是子类才会包含super，如通过Vue.extend创建的内容
  if (Ctor.super) {
    // 递归的处理子类
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions(Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
