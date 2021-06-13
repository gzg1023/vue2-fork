/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving(value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
// 响应式数据基类
export class Observer {
  // 观察的对象
  value: any;
  // 依赖对象
  dep: Dep;
  // 实例计数
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 定于__ob__属性
    def(value, '__ob__', this)
    // 针对数组做响应式分析
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      // 处理对象，转为getter/setter
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    // 把对象中每一个key-value都设置为响应式
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  // 针对数组，把每每一项转成响应式数据
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
// 创建观察者实例，如果成功观察到，则返回新的观察者，没有就创建
export function observe(value: any, asRootData: ?boolean): Observer | void {
  console.log('observe -start',value)
  // 当前对象不需要进行响应式处理
  if (!isObject(value) || value instanceof VNode) {
    console.log('observe -center',value)
    return
  }
  console.log('observe -end',value)
  let ob: Observer | void
  // 如果存在__ob__对象则直接返回
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
    // 条件为：需要设置为响应式对象 且 不是ssr环境，且是对象或者数组，而且该对象是可扩展的
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  // 如果是跟节点数据，则vmCount++
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 * 给对象定于响应式的函数方法，重写get/set方法
 * 为一个对象定义一个响应式的属性，
 * 每一个属性对应一个 dep 对象 如果该属性的值是对象，
 * 继续调用 observe 如果给属性赋新值，继续调用 observe 如果数据更新发送通知
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  console.log(`defineReactive--[[[[[${key}]]]]]=>${obj}`)

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 处理依赖搜集和返回本身的值
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // 当前属性收集依赖
        dep.depend()
        if (childOb) {
          // 数组对象的子元素收集依赖。类型可能是对象或者数组
          childOb.dep.depend()
          // 如果是数组深拷贝一份数据，并且把每个子元素进行依赖搜集
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      // 返回本身属性值
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 如果没有 setter 直接返回，有的话就调用。或者设置新增
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      //  如果新值是对象，观察子对象并返回 子的 observer 对象
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
// vm.$set 和 Vue.set的实现基于本方法，作用是响应式修改数组或对象的值
export function set(target: Array<any> | Object, key: any, val: any): any {
  // 如果是undefined或者null或者是原始类型的值，触发一个警告
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 处理数组，且是合法的索引（参数大于0且不是浮点数，且是有限数字）
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 如果越界的索引，那么改变数组长度
    target.length = Math.max(target.length, key)
    // 通过splice来修改数组，splice是改造过的响应式方法
    target.splice(key, 1, val)
    return val
  }
  // 处理对象,当前key在对象中，且不在对象的原型中
  if (key in target && !(key in Object.prototype)) {
    // 直接通过交换值的方式触发响应式
    target[key] = val
    return val
  }
  // 获取 target 中的 observer 对象
  const ob = (target: any).__ob__
  // 如果已经是vue的实例，直接返回该值
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 如果不存在ob，说明不是响应式对象，直接返回该值
  if (!ob) {
    target[key] = val
    return val
  }
  // 把ob的可以设置为响应式对象
  defineReactive(ob.value, key, val)
  // 发送通知
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
// vm.$delete 和 Vue.delete的实现基于本方法，作用是删除对象的 property
export function del(target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 原理同set
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  // 通过delete关键字删除该对象的值
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    // 对数组子元素进行依赖搜集
    e && e.__ob__ && e.__ob__.dep.depend()
    // 处理嵌套数组
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
