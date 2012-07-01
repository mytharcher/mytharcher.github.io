---
layout: post
title: 记下最近碰到的几个数组问题
category: knowledge
tags: JavaScript, Array, 数组
---

### 迭代

所有数组迭代方法，`forEach`/`map`等都不迭代值为`undefined`的项。例如：

	(new Array(5)).map(function (item) {return item + 2;});

`map`中的函数根本不会被调用，虽然数组的长度已经是5，但是每个元素都是`undefined`，每次迭代都不会被处理，所以结果还是5个`undefined`值组成的数组。

### 巧妙的数组位置互换

	var arr = ['a', 'b', 'c'];
	arr = arr.concat(arr.splice(1, 1));
	// ['a', 'c', 'b']

这是个灵机一动想出来的方法，结果是互换成功了，当然性能没做过多考虑。

这样也可以：

	var arr = [1, 2, 3, 4, 5];
	arr.splice.apply(arr, [1, 0].concat(arr.splice(3, 2)));
	// [1, 4, 5, 2, 3]

而且还可以置换任意多个元素。

-EOF-
