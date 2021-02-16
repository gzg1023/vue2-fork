import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
// 构造函数类
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// 通过mixin混入添加方法，都是通过prototype来添加，
// 这样可以分别管理不同的方法
// 初始化vm
initMixin(Vue)
// 初始化data props set delete watch
stateMixin(Vue)
// 初始化@on @once @off @emit方法
eventsMixin(Vue)
// 初始化生命周期 update destory
lifecycleMixin(Vue)
// 处理$nextTick和render
renderMixin(Vue)

export default Vue
