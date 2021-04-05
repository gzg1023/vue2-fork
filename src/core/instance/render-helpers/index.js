/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-scoped-slots'
import { bindDynamicKeys, prependModifier } from './bind-dynamic-keys'
// render内置函数
export function installRenderHelpers(target: any) {
  // 处理v-once的渲染函数
  target._o = markOnce
  // 将字符串转化为数字，如果转换失败会返回原字符串
  target._n = toNumber
  // _s转为文本
  target._s = toString
  // 处理v-for列表渲染
  target._l = renderList
  // 处理slot的渲染
  target._t = renderSlot
  // 检测两个变量是否相等
  target._q = looseEqual
  // 检测arr数组中是否包含与val变量相等的项
  target._i = looseIndexOf
  // 处理static树的渲染
  target._m = renderStatic
  // 处理filters
  target._f = resolveFilter
  // 从config配置中检查eventKeyCode是否存在
  target._k = checkKeyCodes
  // 合并v-bind指令到VNode中
  target._b = bindObjectProps
  // _v创建空白文本节点/包括换行
  target._v = createTextVNode
  // 创建一个空VNode节点
  target._e = createEmptyVNode
  // 处理ScopedSlots*
  target._u = resolveScopedSlots
  // 处理动态绑定对象的on事件。动态继承添加
  target._g = bindObjectListeners
  // _d优化指令的key
  target._d = bindDynamicKeys
  // _p 将修饰符运行时标记附加到事件名称
  target._p = prependModifier
}
