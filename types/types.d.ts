import { DirectiveBinding } from 'vue'

export interface LazyOptions {
  loading: string
  lifeCycle: LifeCycleType
}

export interface ImageListType {
  el: HTMLElement
  binding: DirectiveBinding<any>
}

export declare enum LifeCycleEnum {
  mounted = 'mounted',
  error = 'error'
}
export declare type LifeCycleType = {
  [x in LifeCycleEnum]?: (el?: HTMLElement, binding?: DirectiveBinding<any>) => {}
}

export declare enum LifeAttrEnum {
  LAZYING = 'lazying',
  LAZYED = 'lazyed',
  ERROR = 'error'
}
