# Vue3-lazyload-pnm

适用于 Vue3.x 的图片懒加载插件

### Install

```sh
$ npm i vue3-lazyload-pnm
# or
$ yarn add vue3-lazyload-pnm
```

### Use

main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import Lazy from 'vue3-lazyload-pnm'

const app = createApp(App)
app.use(Lazy, {
  // options...
  // 只有 loading 和 lifeCycle 这2个参数。。没写那么完善0.0
  loading:'....loading.xxx' // loading图 （必须加）

  // 生命周期 （可写可不写）
  lifeCycle: {
    // 1. 真正的图片加载完成
    mounted: (el: HTMLElement, binding: DirectiveBinding<any>) => {
      // el 是DOM， binding 是vue指令的，可以获取到 v-lazy 后跟着的值之类的
      // console.log('已加载完成', el, binding)
    },
    // 2. 图片报错
    error: (el: HTMLElement, binding: DirectiveBinding<any>) => {
      // console.log('出错了', el, binding)
    }
  }
})
app.mount('#app')
```

App.vue

```html
<template>
  <img v-lazy="your image url" />
</template>
```

Css

```html
<style>
  img[lazy='lazying'] {
    /*your style here*/
  }
  img[lazy='lazyed'] {
    /*your style here*/
  }
</style>
```

### 声明

公司项目用的是 vue3，当时用了某大佬`木荣 <admin@imuboy.cn>`的 lazyload，功能很完善，可遇到一个很尴尬的 bug，我用 v-for 去循环的时候，只有最后一个图片的 `lazy属性` 才变成了 `lazyed`，因为我们 loading 图太大，我当时想法是直接改 css 的样式， `lazy='loading'` 时，图片缩小。可因为这个 bug，图片即使加载完了，也没变回`lazyed`。
于是就想自己搞搞。。打包这块我没用过`rollup`，是看`木荣 <admin@imuboy.cn>`的`vue3lazyload`。学习到很多，再次感谢~

### 原理实现
通过Vue的自定义指令 + IntersectionObserver，如果要兼容也可以使用 监听 scroll 事件来做，但因为项目是Vue3的，响应号召(doge)，不做兼容