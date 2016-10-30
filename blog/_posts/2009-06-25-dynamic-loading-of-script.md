---
date: 2009-06-25
layout: post
title: 动态加载脚本方案调研
category: thinking
tags:
- 动态
- 加载
- 脚本
---

## 调研背景

### 需求功能点

一般要在程序中动态的加载并执行js有几种用途：调用远端的数据；按需加载的业务逻辑；组织大型框架的类库动态加载等。经分析，具体要实现的功能点主要如下：

* 调用远端脚本并执行（执行完就可以不管了）；
* 如加载的是一些函数和变量的定义，执行完才能调用这些函数（执行完当前的脚本还要继续）；
* 跨域考虑；

而实现这些具体的功能又有多种方法，本文目的在于研究每种方法的特性和适用场合。

### 程序流程

按照程序的流程，应该分为3个步骤：加载，执行，执行完毕通知。

![加载步骤](http://mbed.qiniudn.com/yanjunyi.com/img/load-script/load-step.jpg)

## 解决方案

### 方案一：通过DOM创建`<script>`标签，然后设置src属性为要加载脚本的地址

#### 程序流程

1. 创建`<script>`标签
2. 设置`<script>`的`src`属性
3. 将`<script>`append进document
4. `<script>`加载并自动执

以上4个步骤中的2和3没有特定的先后顺序，哪个先做都可以。

#### 方案特性

* 加载和执行一体化，当设置了src属性后立即加载，加载完毕立即执行，无需控制；
* 可以跨域加载脚本；
* 对于加载后脚本执行的状态判断有以下方法：
	* IE下，可以用`onstatuschange`来监听标签的加载状态，和DOM的`readyState`一样，有3种状态：`interactive`，`loaded`，`complete`。而加载的js执行在`interactive`和`loaded`之间，所以只需要判断状态是`loaded`或者`complete`就可以知道加载的js已经执行完毕了。
	* FF/Safari下，`<script>`标签有`onload`事件，脚本的执行在`onload`事件之前执行，所以可以用`onload`对执行状态进行判断。
	* Opera下，`onstatuschange`和`onload`在加载脚本执行完毕后都会执行，顺序是：js执行 → `readyState = ’loaded’` → `onload` → `readyState = ‘loaded’`。 

![Script标签加载脚本时各个环节的顺序](http://mbed.qiniudn.com/yanjunyi.com/img/load-script/browsers-diff.jpg)

### 方案二：加载部分使用Ajax，执行部分使用`eval`或创建`<script>`设置文本

方案二又分为两种子方案，但加载部分的流程是一致的，都是使用普通的Ajax获取远端的js文本，获取到以后作为一个字符串变量提供给程序进行下一步处理。而既然是使用Ajax，就有Ajax带来的一个特性——**不可跨域**。

#### 程序流程

![加载程序流程图](http://mbed.qiniudn.com/yanjunyi.com/img/load-script/implement-flow.jpg)

加载js的文本后，可以选择`eval`方式或者script标签文本方式执行。

使用`eval`要注意当前`scope`的问题，直接`eval()`即在当前域执行，如要在全局执行，对于不同的浏览器可使用不同的函数：`window.execScript`（IE）或`window.eval`（FF）。

通过创建`<scirpt>`标签的方式来执行脚本时，不同浏览器也有不同的书写方式，对于一个script标签对象`s`，和加载的脚本文本`text`，有如下的写法：

	s.text = text; //（IE）
	s.innerHTML = text; //（FF/Safari）

#### 方案特性

* 不能跨域加载脚本；
* 加载/执行/后续等流程控制灵活, 如使用eval方式执行代码，则加载的代码与原来的代码执行顺序可控；
* 可以在当前域执行加载的代码；

## 结论

| 对比项\方案 | Script设置src | Ajax & eval |
|-|-|-|
| 是否可跨域 | 是 | 否 |
| 是否可以在当前scope执行 | 否 | 是 |
| 加载的脚本执行完毕后的流程是否可控 | 是 | 是 |

对比两种方案，在跨域问题和当前scope执行两个地方互有优势，且不能互相替代。所以具体在开发的时候我们可以灵活的选择方案。比如加载json数据，则用Ajax比较方便，可以直接在当前scope使用；而如果是需要加载跨域的脚本，则使用script标签设置src属性加载。

`document.write <script src=”xxx”>`的方法由于不属于动态加载，所以不在本文讨论之列。

-EOF-
