// 借鉴san-router, 实现UMD模块化
(function (global, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        //define("Router", [], factory);
        define([], factory);
    else if (typeof exports === 'object')
        exports["Router"] = factory();
    else
        global["Router"] = factory();
}(this, (function () {
    'use strict';
    //构造函数
    function Router() {
        this.version = '1.0.0';
    }
    //内部变量
    var routes = [],
        mode = null,
        root = window.location.pathname;
    //原型继承
    Router.prototype = {
        // 配置
        config: function (options) {
            mode = options && options.mode && options.mode == 'history' &&
                !!(history.pushState) ? 'history' : 'hash';
            //root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
            // 支持对具体文件的路由如, 如/test/router/a.html
            root = options && options.root ? options.root : root;
            root = '/' + this.clearSlashes(root) + '/';
            return this;
        },
        // 获取当前URL, 含查询内容
        getFragment: function () {
            var fragment = '';
            if (mode === 'history') {
                fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
                //删除?以后(含)的内容
                fragment = fragment.replace(/\?(.*)$/, '');
                //root会自动增加前后的'/'符号, 所以fragment也需要加, 然后替换
                fragment = '/' + fragment + '/'
                fragment = root != '/' ? fragment.replace(root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return this.clearSlashes(fragment);
        },
        // 清除前后/字符
        clearSlashes: function (path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        // 增加路由
        add: function (re, handler) {
            if (typeof re == 'function') {
                handler = re;
                re = '';
            }
            routes.push({
                re: re,
                handler: handler
            });
            return this;
        },
        // 删除路由
        remove: function (param) {
            for (var i = 0, r; i < routes.length, r = routes[i]; i++) {
                if (r.handler === param || r.re.toString() === param.toString()) {
                    routes.splice(i, 1);
                    return this;
                }
            }
            return this;
        },
        // 清除路由, 系统初始化
        flush: function () {
            routes = [];
            mode = null;
            //root = '/';
            root = window.location.pathname;
            return this;
        },
        // 检测入口并处理URL
        check: function (f) {
            var fragment = f || this.getFragment();
            for (var i = 0; i < routes.length; i++) {
                var match = fragment.match(routes[i].re);
                if (match) {
                    match.shift();
                    routes[i].handler.apply({}, match);
                    return this;
                }
            }
            return this;
        },
        // 监控变化：使用这种方式可以支持到ie6, 用事件方式只能支持ie8+
        listen: function () {
            var self = this;
            var current = self.getFragment();
            var fn = function () {
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            };
            clearInterval(this.interval);
            this.interval = setInterval(fn, 50);
            return this;
        },
        // 改变当前URL以及触发处理
        navigate: function (path) {
            path = path ? path : '';
            if (mode === 'history') {
                history.pushState(null, null, root + this.clearSlashes(path));
            } else {
                //window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
                window.location.href = root + '#' + path;
            }
            return this;
        }
    };
    //原型构造函数修改
    Router.prototype.constructor = Router;
    //实例化
    return new Router();
})));

