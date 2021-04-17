import { inBrowser } from './env'
// vue进行性能测试的工具函数，具有如下场景
// 1、组件初始化(component init)
// 2、编译(compile)，将模板(template)编译成渲染函数
// 3、渲染(render)，其实就是渲染函数的性能，或者说渲染函数执行且生成虚拟DOM(vnode)的性能
// 4、打补丁(patch)，将虚拟DOM渲染为真实DOM的性能
export let mark
export let measure

if (process.env.NODE_ENV !== 'production') {
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      // perf.clearMeasures(name)
    }
  }
}
