# Vue3-lazyload-pnm
适用于Vue3.x的图片懒加载插件

### 简介
公司项目用的是 vue3，当时用了某大佬`木荣 <admin@imuboy.cn>`的lazyload，功能很完善，可遇到一个很尴尬的bug，我用v-for去循环的时候，只有最后一个图片的 `lazy属性` 才变成了 `lazyed`，因为我们 loading图太大，我当时想法是直接改 css的样式， `lazy='loading'` 时，图片缩小。可因为这个bug，图片即使加载完了，也没变回`lazyed`。
于是就想自己搞搞。。

