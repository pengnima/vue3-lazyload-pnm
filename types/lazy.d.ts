import { DirectiveBinding } from 'vue'
import { LazyOptions, ImageListType, LifeAttrEnum } from './types'

export default class Lazy {
  options: LazyOptions
  private _imgList:Array<ImageListType>
  private _io

  constructor(options?: LazyOptions)

  private _setImgSrc(el: HTMLElement, src: string, lifeAttr: LifeAttrEnum): void

  /**
   * 图片load事件
   */
  private _imgLoadEvent(el: HTMLElement, binding: DirectiveBinding<any>):void

  /**
   * 新图片load事件
   */
  private _newImgLoadEvent(el: HTMLElement, binding: DirectiveBinding<any>):void
  /**
   * 图片的Error事件
   */
  private _imgErrorEvent(el: HTMLElement, binding: DirectiveBinding<any>):void

  /**
   *
   * @param el
   * @param binding
   * @param _scrollTop 滚轮滚动的高度
   */
  private _imgInScreenCheck(el: HTMLElement, binding: DirectiveBinding<any>, _scrollTop: number) :void

  /**
   *
   * @param el img的dom
   * @param binding vue指令的，一般用来获取 .value值
   */
  public init(el: HTMLElement, binding: DirectiveBinding<any>):void
}
 
