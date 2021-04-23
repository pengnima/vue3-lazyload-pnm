/*!
 * Vue3-Lazyload.js v0.0.6
 * A Vue3.x image lazyload plugin
 * (c) 2021 PengNima 
 * Released under the MIT License.
 */
var LifeCycleEnum;
(function (LifeCycleEnum) {
    LifeCycleEnum["mounted"] = "mounted";
    LifeCycleEnum["error"] = "error";
})(LifeCycleEnum || (LifeCycleEnum = {}));
var LifeAttrEnum;
(function (LifeAttrEnum) {
    LifeAttrEnum["LAZYING"] = "lazying";
    LifeAttrEnum["LAZYED"] = "lazyed";
    LifeAttrEnum["ERROR"] = "error";
})(LifeAttrEnum || (LifeAttrEnum = {}));

var Lazy = /** @class */ (function () {
    function Lazy(options) {
        var _this = this;
        this.options = {
            loading: '',
            lifeCycle: {}
        };
        // console.log({ options })
        this.options = Object.assign(this.options, options);
        this._imgList = []; // 包含所有挂载了 v-lazy 的列表
        // 创建一个 IntersectionObserver 去监听
        this._io = new IntersectionObserver(function (entries) {
            // console.log(entries)
            Array.prototype.forEach.call(entries, function (entrie) {
                if (entrie.intersectionRatio > 0) {
                    for (var i = _this._imgList.length - 1; i >= 0; i--) {
                        var v = _this._imgList[i];
                        // console.log(v)
                        // 元素相同，那么加载 真正的地址
                        if (v.el === entrie.target) {
                            // console.log('加载')
                            v.el.onload = _this._newImgLoadEvent.bind(_this, v.el, v.binding);
                            // this._setImgSrc(v.el, v.binding.value, LifeAttrEnum.LAZYED)
                            v.el.setAttribute('src', v.binding.value);
                            _this.destory(v.el);
                        }
                    }
                }
                // console.log(this._imgList)
            });
        });
    }
    Lazy.prototype._setImgSrc = function (el, src, lifeAttr) {
        el.setAttribute('src', src);
        el.setAttribute('lazy', lifeAttr);
    };
    /**
     * 图片load事件
     */
    Lazy.prototype._imgLoadEvent = function (el, binding) {
        // console.log('进入load事件，移出 el.onload 事件')
        // 1. 进入此，说明 loading图片 加载完成，马上取消 onload事件
        el.onload = null;
        // 2. 检测是否在可视区范围内，如果在，马上替换成 真正的图片
        var _scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        this._imgInScreenCheck(el, binding, _scrollTop);
    };
    /**
     * 新图片load事件
     */
    Lazy.prototype._newImgLoadEvent = function (el, binding) {
        var _a;
        // console.log('进入new load事件，移出 el.onload 事件')
        el.onload = null;
        el.setAttribute('lazy', LifeAttrEnum.LAZYED);
        // 2. 检测是否有 mouted 函数
        if ((_a = this.options.lifeCycle) === null || _a === void 0 ? void 0 : _a.mounted) {
            this.options.lifeCycle.mounted(el, binding);
        }
    };
    /**
     * 图片的Error事件
     */
    Lazy.prototype._imgErrorEvent = function (el, binding) {
        var _a;
        // 移除 _imgList 里的图片
        this.destory(el);
        if ((_a = this.options.lifeCycle) === null || _a === void 0 ? void 0 : _a.error) {
            // 调用 error
            this.options.lifeCycle.error(el, binding);
        }
    };
    /**
     *
     * @param el
     * @param binding
     * @param _scrollTop 滚轮滚动的高度
     */
    Lazy.prototype._imgInScreenCheck = function (el, binding, _scrollTop) {
        // 1. 如果在 可视区 范围内，那么替换其 src 和 lazy 属性
        var vh = window.innerHeight;
        if (_scrollTop + vh > el.offsetTop) {
            // 滚动高度 + 当前window的显示区高度 > 该dom距离顶部的高度
            el.onload = this._newImgLoadEvent.bind(this, el, binding);
            // this._setImgSrc(el, binding.value, LifeAttrEnum.LAZYED)
            el.setAttribute('src', binding.value);
            // 移除 _imgList 里的图片
            var index = this._imgList.findIndex(function (v) { return v.el === el; });
            return this._imgList.splice(index, 1);
        }
        // 2. 不在 可视区， 挂上 observe 监听其变化
        this._io.observe(el);
    };
    /**
     *
     * @param el img的dom
     * @param binding vue指令的，一般用来获取 .value值
     */
    Lazy.prototype.init = function (el, binding) {
        // 1. 先给图片添加 load 事件。当 默认的loading图片 加载完成后执行 _imgLoadEvent(el,binding)
        el.onload = this._imgLoadEvent.bind(this, el, binding);
        el.onerror = this._imgErrorEvent.bind(this, el, binding);
        // 2. 将 el 存放进 imgList
        this._imgList.push({ el: el, binding: binding });
        // 3. 赋上 初始属性， 当 src 加载完之后进入 load 事件
        this._setImgSrc(el, this.options.loading, LifeAttrEnum.LAZYING);
    };
    /**
     * 销毁
     */
    Lazy.prototype.destory = function (el) {
        this._io.unobserve(el);
        var index = this._imgList.findIndex(function (v) { return v.el === el; });
        if (index >= 0) {
            this._imgList.splice(index, 1);
        }
    };
    return Lazy;
}());

var index = {
    // app 为 Vue的实例， options 的类型可以自己到时候定义，目前先写个 object
    install: function (app, options) {
        // console.log({ app, options })
        options = Object.assign({}, options);
        // new 一个 Lazy 实例
        var lazy = new Lazy(options);
        // 自定义指令 v-lazy
        app.directive('lazy', {
            // 绑定元素的父组件被挂载时调用
            mounted: function (el, binding) {
                // 1. 检测是否挂载正确
                if (el.nodeName.toLocaleLowerCase() !== 'img') {
                    throw new Error('在非img标签上使用了 v-lazy');
                }
                // 初始 el
                lazy.init(el, binding);
            },
            beforeUpdate: function (el, binding) {
                if (binding.oldValue != binding.value) {
                    // console.log('已改变', binding.oldValue, binding.value)
                    lazy.destory(el);
                    lazy.init(el, binding);
                }
            }
        });
    }
};

export default index;
