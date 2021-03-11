/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++
    this.subs = []
  }
  // 添加依赖对象
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  // 移除依赖
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }
  // 收集依赖的方法，添加target数组中
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 通知依赖的方法
  notify() {
    // stabilize the subscriber list first
    // 克隆一个新数组
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 以此调用订阅者的更新方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// 重置为null 不影响下次搜集
Dep.target = null
const targetStack = []
// 入栈，并把传入的watcher复制到当前Dep的目标中
// 父组件会先入栈，然后子组件入栈，执行完出栈，在执行父组件的watcher
export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
// 观察者依赖出栈
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
