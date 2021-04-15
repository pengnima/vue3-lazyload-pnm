import { DirectiveBinding } from 'vue'

export interface LazyOptions {
  loading: string
  lifeCycle: LifeCycleType
}

export interface ImageListType {
  el: HTMLElement
  binding: DirectiveBinding<any>
}

export enum LifeCycleEnum {
  mounted = 'mounted',
  error = 'error'
}
export type LifeCycleType = {
  [x in LifeCycleEnum]?: (el?: HTMLElement, binding?: DirectiveBinding<any>) => {}
}

export enum LifeAttrEnum {
  LAZYING = 'lazying',
  LAZYED = 'lazyed',
  ERROR = 'error'
}
