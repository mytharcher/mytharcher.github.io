---
layout: post
title: window.open返回值为null
category: experience
tags:
- window.open
- null
- 安全策略
---

项目中需要用户点击一个按钮在新窗口预览广告内容时，我用`window.open`来打开一个新窗口并在其中用`document.write`内容来实现预览，企图减少一个页面文件。但是在测试中发现有的浏览器，特别是同事电脑上的IE6总是报JS错误，由于上线前一直紧张的修各种IE6兼容性问题，完全没有仔细考虑就换成写了一个新页面来弹窗解决了。

现在空下来整理问题时经过反复的测试终于找到问题所在：`window.open`在用户未信任授权的域名下调用时返回值会是`null`，其中的特例是Chrome，虽然禁止了弹窗窗口，但仍可以返回类型为`Window`的窗口对象引用。

这段代码的[DEMO](/demo/window-open-return-null/)可以用来测试：

	<p><button type="Button" onclick="openWindow()">点击在新窗口打开elfjs.com</button></p>
	<script type="text/javascript">
	function openWindow() {
		var win = window.open('http://elfjs.com/');
		alert(win);
	}

	var win = window.open('http://elfjs.com/');
	alert(win);
	</script>

可以看到其中一个区别是用户触发的事件函数里弹出窗口不会被禁止，而页面直接调用弹出就会被安全策略限制。

之前一直没有找出问题根源的原因可能是我本地用于测试的域名早已被设置过信任弹出窗口，其他同事也是用FF/Chrome测试较多，可能也在先前设置过弹出窗口信任。而最少使用IE6测试，所以没设置过，就导致现象是IE6下报JS错误。另外IETester下完全无法设置，所以总是错的。

-EOF-

{% include references.md %}
