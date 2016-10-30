---
layout: post
title: Picasa翻墙之路（2）
category: experience
tags: [Google, Picasa, GFW, 翻墙, node]
---

忍无可忍之后，开始尝试自己开发一个web应用来解决Picasa的翻墙问题。基本思路是类似GoAgent一个部署在云服务器上的代理程序，通过Google API从服务端获取数据和图片文件，再代理给真正的用户访问。

由于PHP版本实在看不下去，所以转向node，之前使用Heroku来部署node应用已经很简单，那么最主要的问题就是在node中调用Google API。但不巧的是Google没有提供node的开发包，于是在GitHub上找到这几个看似有用的仓库：

*	[node-gdata](https://github.com/ammmir/node-gdata)
	
	用这个包始终没有成功，即使我深入源码以及更深被引用的[oauth](https://github.com/ciaranj/node-oauth)源码进行调试，并且参考[Google官方Picasa API的PHP文档](https://developers.google.com/picasa-web/docs/1.0/developers_guide_php#AuthSub)来构造连接，但为什么验证完账号后无法获取数据的原因。
	
	不过有趣的是，另一个该仓库的fork版本[node-gdata-oauth2](https://github.com/paav-o/node-gdata-oauth2)作者演进了分支，并且在npm上注册了[gdata](https://npmjs.org/package/gdata)的名字发布。当然，我也使用了这个版本。
	
*	[google-oauth](https://github.com/berryboy/google-oauth)
	
	这个仓库作者（[berryboy](https://github.com/berryboy)）还写了一个基于google-oauth日历的例子：[google-calendar](https://github.com/berryboy/google-calendar)。
	
	使用这个仓库的OAuth验证基本成功，按照标准来说不同写法的`access_token`结果上应该是通用的。使用这个库的前提是你要去[Google API控制台][]申请一个APPID（免费）。

但到这里还不算完，虽然通过了Google的OAuth验证，但还是拿不到数据，本地测试由于加代理太麻烦返回总是超时，于是还是一次一次提交到heroku上测试，但返回却是`403 Forbidden`。找了半天才发现原来现在调用Google Data API需要申请开通，并且免费版本是有每天的数量限制的。详细的应用列表在[Google API控制台][]中选`Services`菜单查看，这里面看Google大部分应用都统一API化了，这才是一个云平台最为牛逼的一点。

之后还找到Google自家的[OAuth试验场](https://developers.google.com/oauthplayground/)，这里模拟了几乎大部分Google可以通过OAuth调用的应用接口，是非常好的Demo学习场所。

可是API控制台里找了半天却没有Picasa的，Group里的讨论查到原来Picasa还没升级到最新的接口，仍可以依据老的接口文档进行开发。

最后在我结合了前面两个仓库的调用之后，终于整合通过成功调用出了我的相册列表。但到这我又才发现，原来保存在`*.ggpht.com`域名下的所有Picasa照片又不用翻墙就可以访问了！而被墙的是`picasaweb.google.com`这个域名以及之上服务端的API！这尼玛兜了一大个圈子过来居然又没有必要继续了，和墙做斗争真是极度的纠结和痛苦！

于是我设计的[Pixus](https://github.com/mytharcher/pixus)翻墙应用被我半途而废的抛弃了，以后要是Google再被抽风墙掉的话，我再回来继续开发吧。

-EOF-

[Google API控制台]: https://code.google.com/apis/console/
