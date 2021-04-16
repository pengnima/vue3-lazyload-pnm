import { DirectiveBinding } from 'vue'
import { LazyOptions, ImageListType, LifeAttrEnum } from './types'

class Lazy {
  public options: LazyOptions = {
    loading: '',
    lifeCycle: {}
  }
  private _imgList: Array<ImageListType>
  private _io: IntersectionObserver

  constructor(options: LazyOptions) {
    // console.log({ options })
    this.options = Object.assign(this.options, options)

    this._imgList = [] // 包含所有挂载了 v-lazy 的列表

    // 创建一个 IntersectionObserver 去监听
    this._io = new IntersectionObserver((entries) => {
      // console.log(entries)
      Array.prototype.forEach.call(entries, (entrie) => {
        if (entrie.intersectionRatio > 0) {
          for (let i = this._imgList.length - 1; i >= 0; i--) {
            const v = this._imgList[i]
            // console.log(v)

            // 元素相同，那么加载 真正的地址
            if (v.el === entrie.target) {
              // console.log('加载')
              v.el.onload = this._newImgLoadEvent.bind(this, v.el, v.binding)

              // this._setImgSrc(v.el, v.binding.value, LifeAttrEnum.LAZYED)
              v.el.setAttribute('src', v.binding.value)

              this._io.unobserve(v.el) // 移除监听
              this._imgList.splice(i, 1) // 删除元素
            }
          }
        }

        // console.log(this._imgList)
      })
    })
  }

  private _setImgSrc(el: HTMLElement, src: string, lifeAttr: LifeAttrEnum) {
    el.setAttribute('src', src)
    el.setAttribute('lazy', lifeAttr)
  }

  /**
   * 图片load事件
   */
  private _imgLoadEvent(el: HTMLElement, binding: DirectiveBinding<any>) {
    // console.log('进入load事件，移出 el.onload 事件')
    // 1. 进入此，说明 loading图片 加载完成，马上取消 onload事件
    el.onload = null

    // 2. 检测是否在可视区范围内，如果在，马上替换成 真正的图片
    const _scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    this._imgInScreenCheck(el, binding, _scrollTop)
  }

  /**
   * 新图片load事件
   */
  private _newImgLoadEvent(el: HTMLElement, binding: DirectiveBinding<any>) {
    // console.log('进入new load事件，移出 el.onload 事件')
    el.onload = null
    el.setAttribute('lazy', LifeAttrEnum.LAZYED)

    // 2. 检测是否有 mouted 函数
    if (this.options.lifeCycle?.mounted) {
      this.options.lifeCycle.mounted(el, binding)
    }
  }

  /**
   * 图片的Error事件
   */
  private _imgErrorEvent(el: HTMLElement, binding: DirectiveBinding<any>) {
    // 移除 _imgList 里的图片
    let index = this._imgList.findIndex((v) => v.el === el)
    this._imgList.splice(index, 1)

    if (this.options.lifeCycle?.error) {
      // 调用 error
      this.options.lifeCycle.error(el, binding)
    }
  }

  /**
   *
   * @param el
   * @param binding
   * @param _scrollTop 滚轮滚动的高度
   */
  private _imgInScreenCheck(el: HTMLElement, binding: DirectiveBinding<any>, _scrollTop: number) {
    // 1. 如果在 可视区 范围内，那么替换其 src 和 lazy 属性
    let vh = window.innerHeight
    if (_scrollTop + vh > el.offsetTop) {
      // 滚动高度 + 当前window的显示区高度 > 该dom距离顶部的高度
      el.onload = this._newImgLoadEvent.bind(this, el, binding)

      // this._setImgSrc(el, binding.value, LifeAttrEnum.LAZYED)
      el.setAttribute('src', binding.value)

      // 移除 _imgList 里的图片
      let index = this._imgList.findIndex((v) => v.el === el)
      return this._imgList.splice(index, 1)
    }

    // 2. 不在 可视区， 挂上 observe 监听其变化
    this._io.observe(el)
  }

  /**
   *
   * @param el img的dom
   * @param binding vue指令的，一般用来获取 .value值
   */
  public init(el: HTMLElement, binding: DirectiveBinding<any>) {
    // 1. 先给图片添加 load 事件。当 默认的loading图片 加载完成后执行 _imgLoadEvent(el,binding)
    el.onload = this._imgLoadEvent.bind(this, el, binding)
    el.onerror = this._imgErrorEvent.bind(this, el, binding)

    // 2. 将 el 存放进 imgList
    this._imgList.push({ el, binding })

    // 3. 赋上 初始属性， 当 src 加载完之后进入 load 事件
    this._setImgSrc(el, this.options.loading, LifeAttrEnum.LAZYING)
  }
}

export default Lazy
