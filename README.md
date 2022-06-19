# 单页路由Router

## 1. 介绍

这是一个纯JS路由, 不依赖第三方库。

支持ie5+

点子来源链接:

- [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
- [中文版](https://clarkdo.js.org/javascript/2014/09/04/22/)

## 1.1 优化

- 使用UMD封装实现
- root默认使用`window.location.pathname`
- 修改和优化部分代码

## 2. 开始使用

### 2.1 一个简单页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Router Test</title>
</head>

<body>
  <h1 id="id">我是空白</h1>
</body>
</html>
```

### 2.2 使用步骤

- 加载(支持UMD), 简单script加载如: `<script src="./router.js"></script>`
- (可选)配置路由模式, 默认为hash模式, 设置history如`Router.config({ mode: 'history'})`
- 添加路由, 如

  ```js
  Router.add(/^([\w]+)[/]?([^/]+)?[/]?$/, function() {
    console.log('regex: first=[' + arguments[0] + '], second=[' + arguments[1] + ']');
    document.getElementById('id').innerHTML = Router.getFragment()
  })
  ```

- 监听路由: `Router.listen()`
- (可选)对url支持重新路由: `Router.check()`
- 在html元素中增加事件进行导航: `Router.navigate('/about')`

路由使用代码例子如下:

```html
<script src="./router.js"></script>
<script>
  // configuration
  // Router.config({ mode: 'history', root: '/test/router'});

  // adding routes
  Router
  // fix route
  .add(/about/, function() {
    console.log('about');
    document.getElementById('id').innerHTML = Router.getFragment()
  })
  // regex route
  .add(/^([\w]+)[/]?([^/]+)?$/, function() {
    console.log('regex: first=[' + arguments[0] + '], second=[' + arguments[1] + ']');
    document.getElementById('id').innerHTML = Router.getFragment()
  })
  // default route
  .add(function() {
    console.log('default');
    var fragment = Router.getFragment();
    if (fragment === '') {
      fragment = '我是默认';
    }
    document.getElementById('id').innerHTML = fragment;
  })
  .listen();

  // reload
  Router.check()
</script>
```

增加按纽来进行导航的代码例子:

```html
  <button onclick="Router.navigate('/home')">home</button>
  <button onclick="Router.navigate('/about')">about</button>
  <button onclick="Router.navigate('/risk/5')">risk/5</button>
```

### 2.3 完整的测试页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Router Test</title>
</head>

<body>
  <h1 id="id">我是空白</h1>
  <button onclick="Router.navigate('/home')">home</button>
  <button onclick="Router.navigate('/about')">about</button>
  <button onclick="Router.navigate('/risk/5')">risk/5</button>
</body>
<script src="./router.js"></script>
<script>
  // Router.config({ mode: 'history', root: '/test/router'});
  Router
  .add(/about/, function() {
    console.log('about');
    document.getElementById('id').innerHTML = Router.getFragment()
  })
  .add(/^([\w]+)[/]?([^/]+)?$/, function() {
    console.log('regex: first=[' + arguments[0] + '], second=[' + arguments[1] + ']');
    document.getElementById('id').innerHTML = Router.getFragment()
  })
  .add(function() {
    console.log('default');
    var fragment = Router.getFragment();
    if (fragment === '') {
      fragment = '我是默认';
    }
    document.getElementById('id').innerHTML = fragment;
  }).listen();
  Router.check();
</script>
</html>
```

## 3. API指南

### 3.1 `config(options)`

配置接口, 默认为hash模式。

而且还会进行智能判断, 如果浏览器不支持, 即使设置成history模式, 会自动改为hash模式

- 参数：options为object，里面有两个值
  - mode: 两种路由模式(history和hash)
  - root: 默认使用window.location.pathname
- 返回: Router对象

### 3.2 `getFragment()`

获取路由值，不管是使用hash或history模式，都有效。

- 返回类型是字符串, 即router值, 如`risk/5`

### 3.3 `add(re, handle)`

添加路由。

- 参数
  - re: 类型字符串, 可以是固定如`/about/`, 也可以使用正则表达式如`/product\/(\d+)/`，若为空, 默认为''
  - handle: 类型函数, 将被apply方式调用，参数数组为正则匹配出来的实际结果
- 返回: Router对象

### 3.4 `remove(param)`

删除路由, 严格判断是否与路由表中的re或handle一致。

- 参数
  - param 类型可以是字符串或函数
- 返回: Router对象

### 3.5 `flush()`

初始化路由，恢复路由的默认设置，并设置为空路由。

- 返回: Router对象

### 3.6 `check(f)`

检测入口，按顺序匹配路由，根据第一个匹配到的路由规则来调用相应的handle函数处理。

也适合在重新刷新当前URL时，找到相应的路由处理。

- 参数
  - f: 类型字符串或空, 为空则取当前URL处理
- 返回: Router对象

### 3.7 `listen()`

对浏览器的URL进行监控，如有变化，而调用`check()`函数进行处理。

### 3.8 `navigate(path)`

修改URL，触发路由的处理，实现导航功能。

- 参数
  - path: 类型字符串或空
- 返回: Router对象

## 4. history模式的后端集成配置

### 4.1 nginx配置例子

```conf
  location / {
    # 单文件配置
    rewrite ^/example/router.html(.+) /example/router.html break;
    # 目录配置
    rewrite ^/example/(.+) /example/router.html break;
    # ...
  }
```
