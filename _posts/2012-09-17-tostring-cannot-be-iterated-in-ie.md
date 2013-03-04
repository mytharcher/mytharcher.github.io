---
date: 2012-09-17 20:46:31
layout: post
title: IE8（包括以下）for..in无法遍历出对象上自定义的toString属性
category: experience
tags:
- IE
- for-in
- toString
---

当需要对一个JS类或对象扩展一个自定义的`toString`方法后，在IE下（包括8和以下）在使用`for in`循环遍历这个对象的属性时，自定义的`toString`不会被作为属性遍历出来。

其实这个问题其实很早就碰到过，所以在我自己写[elf+js][]的[`mix`扩展方法](https://github.com/elfjs/jslib/blob/master/src/js/util/Class.js#L106)（其他库多称为`extend`，见[elf+js文档：对象的复制和扩展](http://elfjs.com/docs/intro/class.html#section-2)）时，也解决了这个问题。

这次是公司的项目，考虑到将来传承还是使用了[Tangram][]，但其中没有[elf+js][]中方便的创建和继承类的方法，于是简单针对项目封装了tangram里的方法，没有过多仔细的考虑。

	/**
	 * 声明一个类
	 */
	union.lib.Class = function (proto, Super) {
		var newClass = proto.hasOwnProperty('constructor') ? proto.constructor : new Function();
		newClass.prototype = proto;
		if (Super) {
			baidu.inherits(newClass, Super);
			/* 之前没有写这个if判断
			if (proto.hasOwnProperty('toString')) {
				newClass.prototype.toString = proto.toString;
			}
			*/
			baidu.extend(newClass, Super);
		}
		
		return newClass;
	};

看了[tangram继承方法的源码](https://github.com/BaiduFE/Tangram-base/blob/master/src/baidu/lang/inherits.js#L39)和[extend方法源码](https://github.com/BaiduFE/Tangram-base/blob/master/src/baidu/object/extend.js)发现也都未对此问题做特殊处理。而我项目中创建的一个类扩展了`toString`方法，于是在实际调用的时候转化为字符串的结果悲剧了。

结论正如代码中的，针对IE8及以下浏览器，在使用`for..in`遍历对象属性时，需要判断是否有自定义的`toString`属性，并手动做特殊处理。

-EOF-

{% include references.md %}
