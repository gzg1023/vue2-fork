/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 初始化config对象，不一定用于响应式数据
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 避免使用的api
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 创建options对象，无原型（提高性能）
  // 
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    // 存储全局component/directive/filters
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios
  // 框架内置的基本对象
  Vue.options._base = Vue
  // 以下注册的都是全局api
  // 全局注册keep-alive组件
  extend(Vue.options.components, builtInComponents)
  // 初始化use方法，用于注册组件
  initUse(Vue)
  // 初始化mixin混入功能
  initMixin(Vue)
  // 初始化extend方法
  initExtend(Vue)
  // 初始化Vue.directive  Vue.component Vue.filter 静态方法
  initAssetRegisters(Vue)
}
