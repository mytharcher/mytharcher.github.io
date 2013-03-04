---
layout: post
date: 2012-09-17 17:13:57
title: IE8下window.postMessage的参数类型差异
category: experience
tags:
- IE8
- postMessage
---

项目中要开发一个供多产品线共用的iframe页面插件，在新的Chrome中使用`document.domain`方式允许跨域调用后总是会在控制台报一个unsafe...的安全警告，于是想到用新的HTML5跨域通信接口`postMessage`来针对新的浏览器实现。而且通过特性侦测到IE8也已经支持了`postMessage`接口，于是就确定了使用新技术的方案，当然对于旧的浏览器（IE6，IE7）也会自动fallback回直接`parent.xxx`调用的方式。

之后在对IE8测试时，始终iframe调用有问题，而且报的一个错误又是另一个产品线广告位展现更深层iframe的一个JS错。刚好在此之前了解到是这个产品线上线了一个针对多级iframe调用进行限制的策略，并只在白名单里添加了我们的线上域名，而且被告知过IE8下可能有问题，所以一直怀疑是别人的问题。

但最后都要上线了，觉得这事不对，FF其他浏览器都可以展示，这应该跟策略没关系，才开始仔细分析自己代码的问题。最终跟到跨域消息发送的代码里，发现IE8下`postMessage`方法发出的消息对象上的属性总是取不到，折腾了半天才搞明白原来IE8下窗口接收到消息的事件数据属性是字符串类型，而不是自定义的对象。

Google了一下找到来自微软官方的说明[IE postMessage method](http://msdn.microsoft.com/en-us/library/ie/cc197015(v=vs.85).aspx)：

> Syntax
> 
> 	var retval = window.postMessage(msg, targetOrigin);
> 
> Parameters
> 
> msg [in]
> :	Type: *BSTR*
> :	A **String** that contains the message data.
> 
> ...

这个String类型让哥忍不住要吐槽，在IE更老的浏览器里的直接跨域调用都可以传递任意类型的数据，这新实现的HTML5接口却反而倒退了！难道是怕开发者传递一个函数类型的参数么？那为什么其他浏览器都可以正常传递数据对象？于是去翻了[W3C HTML5草案的Communication](http://www.w3.org/TR/html5/comms.html)部分，其中包括事件定义部分，和草案描述都说明了事件的`data`参数类型是不限的。

事件对象定义：

> 	interface MessageEvent : Event {
> 	  readonly attribute any data;
> 	  ...
> 	}

发送消息的过程描述：

> 1. ...
> 2. Let *message clone* be the result of obtaining a [structured clone](http://www.w3.org/TR/html5/infrastructure.html#structured-clone) of the message argument. If this throws an exception, then throw that exception and abort these steps.
> 3. ...

好吧，我只能针对IE8再做一次适配，用JSON把数据对象编码成字符串，传递到另一个窗口后再解码出数据值来。

	/**
	 * 跨域消息组件
	 * @type {Object}
	 */
	var Messager = {
		/**
		 * 发送消息给父层页面
		 * @param  {Sting} label 消息标识（方法名）
		 * @param  {any} data 消息数据
		 */
		postToParent: window.postMessage ? function (label, data) {
			parent.postMessage(JSON.stringify({
				label: label,
				data: data
			}), '*');
		} : function (label, data) {
			parent[label] && parent[label](data);
		},
		
		/**
		 * 接收消息的内部处理
		 * @private
		 * @param  {Event} ev 消息事件对象
		 */
		receive: function (ev) {
			var e = ev || window.event;
			var message = JSON.parse(e.data);
			var handler = MainAction[message.label];
			
			if (handler) {
				handler(message.data);
			}
		}
	};

附另外两个搜出来的IE8问题链接：

* [window.postMessage Problems and Workarounds for IE8](http://www.felocity.com/article/window_postmessage_problems_and_workarounds_for_ie8)
* [Test postMessage](http://stevesouders.com/misc/test-postmessage.php)

-EOF-
