---
layout: post
title: 记下最近碰到的几个数组问题
category: experience
tags: [JavaScript, Array, 数组]
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

### 可继承性

在设计[jslib][]时考虑数组扩展与继承的问题，参考了一些数组继承的文章，并实验得出下面的判断逻辑：

	/**
	 * 数组是否可继承
	 * 用于IE<8时继承的数组长度始终为0的判断
	 * @property js.client.Features.arrayInheritable
	 * @type {Boolean}
	 */
	js.client.Features.arrayInheritable = (function () {
		function XArray() {
			Array.prototype.push.apply(this, arguments);
		}
		XArray.prototype = [];
		XArray.prototype.constructor = XArray;

		// 创建数组
		var testArr = new XArray(1);
		// 测试长度是否自增
		var lengthTest = testArr.length == 1;
		// 设置长度为0，即清空数组
		testArr.length = 0;
		// 清空检查
		var lengthSetTest = typeof testArr[1] == 'undefined';
		// 实例继承检查
		var instanceTest = testArr instanceof Array && testArr instanceof XArray;
		// 三项检查通过则返回true
		return lengthTest && lengthSetTest && instanceTest;
	})();

参考：

0. [How ECMAScript 5 still does not allow to subclass an array](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/)
0. [How To Subclass The JavaScript Array Object](http://dean.edwards.name/weblog/2006/11/hooray/)

-EOF-

{% include references.md %}
