---
layout: post
title: 发布npm包Rainbow
category: thinking
tags: [npm, rainbow, express, middleware, route, rest, restful]
---

在用[Express][]开发node做RESTful的API设计时，首先就觉得Express里的HTTP请求路由配置特别不舒服。原因是习惯了静态文件和PHP都默认直接使用系统目录进行URL映射，而到node里居然要自己写！但了解了更多语言后发现更多的也是需要自己写的，比如Java/Python/Ruby等。那么难道直接使用URL的路径指向文件很不正常么？可是这看上去就天生的应该是这样的啊！设计思想中有一个很重要的原则就是**约定大于配置**，但是别人都是用一个配置文件来写的，那好吧，我自己来改造一下。

在Java的SSH和PHP的CI等MVC框架中，都通过controllers这层来控制URL指向的具体Action。还看到很多node的web开发者也有用`controllers/`文件夹来存放这一层的文件，我也就沿用了。

具体的设计思路是，根据`controllers/`所有的文件路径来绑定Express的路由（最早一版是任意访问`'*'`都路由到该目录下）。同时最好还加上Structs里过滤器的概念，可以在真正处理之前做各种验证和拦截，比如某个资源要登录后才能访问，那么在拦截器上发现没登陆就先返回`403`了，参数错误也可以加入拦截返回`400`等。总的来说做一些分层是必要的。

Stackoverflow刚好也有人问用户验证的拦截器怎么设计，我也根据他们的回答研究了[HTTP状态码401](/blog/posts/http-401)的问题。其实我想说的是Express原本的路由设计就非常好，以至于留出了很方便扩展的接口。最核心的改造只需要在绑定路由的时候把拦截器放在真正处理函数之前组成多处理队列，并搜索固定目录下的文件进行分发配置就可以了。

花了一早上把最开始的分发代码重构了三次完成，虽然没几行代码，但想到一个很好的名字，就干脆把这个中间件作为一个npm包发布吧。于是又去看了一堆npm的资料，整理文档以后，我第一个npm包[Rainbow](https://github.com/mytharcher/rainbow)就发布了。

## Rainbow ##

这是node下Express开发的一个中间件，可以直接使用文件路径映射来简化RESTful的路由配置。

使用Rainbow后所有的路由配置只需要往`controllers/`目录里扔文件就可以了。

### 安装 ###

该组件已发布为npm包，通过以下命令直接安装：

	$ npm install rainbow

### 在基于Express的app中使用 ###

在应用的主文件`app.js`中：

	var express = require('express');
	var rainbow = require('rainbow');
	
	var app = express();
	
	// 加入这句话初始化app的所有路由
	app.use(rainbow());
	
	app.listen(6060);

### Controllers ###

在Rainbow里，默认`controllers/`目录就是网站动态程序的根目录，所有请求的路径基于此目录和URL完全同构，当然静态资源请在路由初始化之前调用`use`。

这个例子假设在你的应用目录有这样一个文件`controllers/something.js`：

	exports.GET = function (req, res, next) {
		res.send(200, 'Simple getting.');
	};

如果需要在客户端使用`GET`方式请求`http://yourapp/something`的时，先使用`filters/authorization.js`进行验证检查，可以简单的定义一个过滤器：

	var authorization = require('../filters/authorization');

	exports.GET = function (req, res, next) {
		res.send(200, 'Got you!');
	};
	// 添加过滤器
	exports.GET.filters = [authorization];

这样当过滤器`authorization`通过后会继续正常处返回`200`成功状态，并在页面上显示`Got you!`。

对于每个RESTful的资源，由于同一个URL只映射一个文件，所有增删改查都定义在一个文件中，例如：

	exports.GET = function (req, res, next) {
		User.find({where: req.query.name}).success(function (user) {
			res.send(200, user);
		});
	};
	
	exports.PUT = function (req, res, next) {
		User.create(req.body).success(function (user) {
			res.send(201, user.id);
		});
	};
	
	// 你可以定义其他`POST`和`DELETE`的路由处理
	// ...

如果不想使用`GET`/`POST`/`PUT`/`DELETE`定义，那么可以直接`exports`一个函数，处理所有方法在这个URL上的请求：

	module.exports = function (req, res, next) {
		// all your process
	};

#### Params ####

Rainbow从0.1.0版本开始支持基于参数优化的URL（类似`/path/user/:id`）。现在你可以使用`params`这个属性来扩展定义当前controller的参数部分，之后就可以和Express原生定义一样在处理中使用参数部分，例如：

	exports.GET = function (req, res, next) {
		var id = req.params.id;
		// your business
	};

	exports.GET.params = ':id?';

对，你只需添加当前controller代表的URL之后的内容。你也可以使用正则表达式来进行参数自动分析，同样也只需添加controller代表的URL之后的规则：

	exports.GET = function (req, res, next) {
		console.log(req.params);
	}

	exports.GET.params = /(\d+)(?:\.\.(\d+))?/;

但是使用正则的时候请务必注意，**不要**使用作为起始判定的`^`和作为结束判定的`$`，这会导致rainbow无法解析这个参数。不过用在集合取反判定里的`^`是没有问题的，例如：`[^a-z]`。

### Filters ###

路由控制器中可以配置`filters`队列，这是一个由路由中间件函数的数组，可以为空，在该请求被路由到时会顺序执行。例如在介绍Controllers最开始的例子里，如果要做一个基于登录权限的拦截器，就可以在`filters/`目录添加一个`authorization.js`：

	module.exports = function (req, res, next) {
		console.log('processing authorization...');
		var session = req.session;
		
		if (session.userId) {
			console.log('user(%d) in session', session.userId);
			next();
		} else {
			console.log('out of session');
			// 异步过滤器
			db.User.find().success(function (user) {
				if (!user) {
					res.send(403);
					res.end();
				}
			});
		}
	};

这时当访问配置了过滤器的地址`http://yourapp/something`时，如果用户没有登录验证过，那么浏览器就会收到`403`禁止下一步访问。而如果验证正确的话，在过滤处理中调用`next()`方法继续后续处理。

可以看到这个函数是一个标准的Express路由处理函数，对，Rainbow正是利用这个特性做的配置扩展。**注意**，要是不调用`next()`，请求是不会返回的！

### 修改默认目录 ###

Rainbow会默认使用应用目录下的`controllers/`目录寻找路由控制器。如果不希望是这个目录可以在初始化的时候传入一个配置对象进行修改：

	app.use(rainbow({
		controllers: '/your/controllers/path'
	}));

**注意**：这里配置的路径必须是绝对路径。

### 有问题？ ###

0. 给我发邮件
0. 提交[issue](https://github.com/mytharcher/rainbow/issues)
0. 直接发pull request

### MIT Licensed ###

其实就20行的代码，结果写了近10000个Byte的文档。真正要发布一个可以给别人用的东西很不容易。当然我还没告诉你我一行单测代码都没写！（直到五年以后我才添加了测试用例的代码 Updated at 2017-09-11）

-EOF-

{% include references.md %}
