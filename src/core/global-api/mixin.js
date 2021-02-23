/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  // 注册全局mixin
  Vue.mixin = function (mixin: Object) {
    // 合并options
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
