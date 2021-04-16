import Lazy from './lazy'
import { App, DirectiveBinding } from 'vue'
import { LazyOptions } from './types'

export default {
  // app 为 Vue的实例， options 的类型可以自己到时候定义，目前先写个 object
  install: (app: App, options?: LazyOptions): void => {
    // console.log({ app, options })
    options = Object.assign({}, options)
    // new 一个 Lazy 实例
    const lazy = new Lazy(options)

    // 自定义指令 v-lazy
    app.directive('lazy', {
      // 绑定元素的父组件被挂载时调用
      mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
        // 1. 检测是否挂载正确
        if (el.nodeName.toLocaleLowerCase() !== 'img') {
          throw new Error('在非img标签上使用了 v-lazy')
        }

        // 初始 el
        lazy.init(el, binding)
      }
    })
  }
}
