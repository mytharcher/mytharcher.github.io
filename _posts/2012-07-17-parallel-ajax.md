---
layout: post
title: 并行加载多个Ajax请求问题
category: experience
tags: [Ajax, 并行]
---

由于需要在一个页面中加载多份互不依赖的异步数据，我写了个简单的异步加载器，原理是同时发起多个请求，在每一个完成时判断其他加载器是否全部完成，如果完成则整个序列完成，并执行后续操作。但在IE中却碰到诡异的问题，看代码：

	for (var i in options) {
		loaders[i] = extend(options[i], {/* ... */});
		ajax(loaders[i]); // 直接在for循环中调用加载
	}

然后在每个`ajax`返回时进行循环判断：

	var allLoaded = true;
	for (var i in loaders) {
		// 只要有一个没完成则继续等待
		if (!(allLoaded = allLoaded && loaders[i].loaded)) {
			return;
		}
	}
	alert(allLoaded);

结果在IE下每个单独的加载器完成都会`alert(true)`，而根本不会走`if`判断后的跳出，极其诡异！

多次尝试后发现可能是在第一次循环中对`loaders`集合进行的赋值操作和发请求同时写在循环中造成，于是把两个操作拆开分别循环：

	for (var i in options) {
		loaders[i] = extend(options[i], {/* ... */});
	}
	for (var i in loaders) {
		ajax(loaders[i]); // 分开循环操作
	}

结果不幸被我猜中，的确分开后没有问题了。那就说明IE本身放在`for`循环中的`ajax`加载可以视为同步行为，完全跟其他浏览器行为不一致——又是一个坑！

此问题详见[demo](/demo/parallel-ajax/)。

在这之后，又引出一个新的问题，如果并行加载完的数据在分别处理过程中互相有依赖，那么处理前就要根据依赖进行一个排序。我姑且把这当做一个面试题吧，并抽象成一个简化的描述方式：

> 现有一个随机生成的无序数组，其中的元素都属于一个有限集合（即确定的元素），同时一些元素之间可能有单向依赖关系（不形成环）。试设计一个数据结构进行描述，并给出一个对该数组的排序算法，要求任何两个相邻项之间排在前面的元素都不依赖后面的元素。

好了，有兴趣的同学可以试试看（想想各大AMD的js库是如何设计的）。

-EOF-

{% include references.md %}
