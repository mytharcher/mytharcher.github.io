---
layout: post
title: 发布npm包MustLayout
category: thinking
tags: [npm, mustlayout, express, mustache, layout, inheritance, 模板, 继承, 布局]
---

{% raw %}

[Express][] 3.0以后不再原生支持布局模板继承，而转由其他模板引擎分别实现，并可以选择使用[consolidate.js](https://github.com/visionmedia/consolidate.js)来代理接口调用。这对 express 框架是件好事，但对部分模板引擎的使用者造成了比较大的问题，比如我倾向使用的[mustache][]系列轻逻辑的模板引擎。

在[mustache的规范](http://mustache.github.io/mustache.5.html)里并没有关于布局模板继承的指导，就连比较常用的 include 语法也是通过用户自己提前寻找模板内容实现。虽然[Hogan.js][]和[handlebars][]中有了一部分增强的实现，但在实际使用中总还是不能完全的自动化。

于是我想在 express 中实现类似 Smarty 之于 PHP 的模板继承方式，最好又基本不改变目前的书写规则。初步的思路就是在 app 服务启动时，预先处理好所有模板的继承和嵌套关系，并直接生成为可供其他引擎调用的目标模板文件，同时将 express 的 views 目录指向预编译的结果目录，就可以让任意模板引擎无缝的在运行时按自己的方式处理了。

当然其中我没有做复杂的 token 流分析，只是按照简单的规则切分开了嵌套和包含所用的语法，完成首次拼接和生成，具体用法参见下面的说明。

## MustLayout ##

这个 npm 包针对在 express 3.0 以上版本中使用类 mustache 模板引擎开发者，只通过非常简单的配置就可以方便的使用模板继承和包含嵌套的功能。

几个特性：

* 调用模板渲染的方式和使用 MustLayout 之前完全相同。
* 不需要在渲染的时候在程序中处理`layout`和`partials`相关配置。
* 兼容所有 mustache 引擎。

### 安装 ###

	$ npm install --save mustlayout

### 使用方式 ###

在 express 应用的主文件`app.js`中：

	var express = require('express');

	var app = express();

	require('mustlayout').engine(app, {
	    engine: require('hogan'),
	    ext: '.tpl',
	    views: '/views',
	    partials: '/views/partials', // 可选, 默认指向'/views'
	    layouts: '/views/layouts', // 可选, 默认指向'/views'
	    cache: '/views/cache' // 可选, 默认指向'/views/cache'
	});

	app.get('/', function (req, res, next) {
	    res.render('index');
	});

	app.listen(6060);

在使用 MustLayout 后，不用再写 express 原生的视图引擎配置。

#### 模板语法 ####

MustLayout 使用了 handlebars 的模板继承定义语法`{{!<layoutName}}`，通常情况，请将此内容放置在任意一个需要继承的模板文件中的第一行。

之后在模板中使用`{{+blockName}}...{{/blockName}}`的语句块像在 dust.js/Smarty 中一样定义一个可继承的模板内容片断。

例如`index.tpl`要继承自`page.tpl`：

	{{!<page}}
	{{+header}}
	<h1>My Title</h1>
	{{/header}}

	{{+body}}
	...
	{{/body}}

而在要继承的`page.tpl`中：

	<!DOCTYPE html>
	<html>
	<head>
	<title>MustLayout</title>
	</head>
	<body>
		<div id="header">
		{{+header}}Just Header{{/header}}
		</div>
		<div id="main">
		{{+body}}Nothing{{/body}}
		</div>
		{{> footer }}
	</body>
	</html>

之后当你在任何控制器中调用`res.render('index')`渲染模板时，在浏览器中就可以得到下面的结果：

	<!DOCTYPE html>
	<html>
	<head>
	<title>MustLayout</title>
	</head>
	<body>
		<div id="header">
		<h1>My Title</h1>
		</div>
		<div id="main">
		...
		</div>
		<!-- something in footer.tpl -->
	</body>
	</html>

更多的例子可以参照`example`文件夹中的内容。

#### 缓存 ####

因为 MustLayout 会将所有模板都预编译到`views/`的一个目标缓存文件夹中（默认是`cache`），所以请确保`views/`目录的权限是所有人可写：

	$ chmod 777 views/

并且所有脚本会在服务启动前就预编译为普通的 mustache 模板，所以在运行时的模板渲染性能只依赖于你具体使用的模板引擎。

### 问题反馈 ###

1. 给我发邮件
2. 提交[issue](https://github.com/mytharcher/mustlayout/issues)
3. 直接发pull request

### MIT Licensed ###

我依旧懒得写测试用例，但是集成在[express-bootstrap](https://github.com/mytharcher/express-bootstrap)中已经可用了。

-EOF-

{% endraw %}

{% include references.md %}
