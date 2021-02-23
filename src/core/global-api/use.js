/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 判断是否已经注册插件，this是vue构造函数
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 相当于交换参数，把第一个参数改为this，移除原本的第一个
    const args = toArray(arguments, 1)
    args.unshift(this)
    // 调用组件的install方法进行安装
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 存储到已安装插件中
    installedPlugins.push(plugin)
    return this
  }
}
