---
layout: post
title: Iframe高度自适应的缺陷
category: experience
tags: [自适应, 高度, iframe, height, scrollHeight]
---

项目开发中再次用到了`iframe`自适应高度的功能，如果要求文档中任意时刻元素显示状态或位置发生改变，甚至是绝对定位的弹出层，使文档总体尺寸发生改变时，都能保持所有内容显示在父页面中而不出现滚动条，那么就必须使用`setInterval`进行实时检测并改变`iframe`的大小。在实现过程中就碰到几个问题：

0.	Chrome获取页面实际高度的元素是`body`，而其他浏览器都是`document.documentElement`（即`html`）。
	
	[2012-08-04 Update]: 除了Chrome外`body.scrollHeight`的值会忽略计算页面内有绝对定位浮层显示隐藏时变化。

0.	只要在设置过`iframe`的高度更高以后，每次获取内嵌页`scrollHeight`属性时，即使内嵌页内容高度变小，这个属性依然不会再还原到更小的值，可以理解为和当前`iframe`的窗口高度保持一致。特别的，当设置`iframe`高度为`0`后，又再次还原可以取到正确的内嵌页`scrollHeight`。

0.	内嵌页的`offsetHeight`属性从来不随内容也不随窗口大小而改变，只为内嵌页加载后的初始文档高度。

这几个诡异的地方导致我希望通过`setInterval`实时检测内嵌页内容高度并只有在变化时再改变`iframe`元素高度的方案直接破产，如果一定要实现实时更新高度，那么只能每次先设置`iframe`高度为`0`，再获取内容的`scrollHeight`来作为`iframe`的新高度。而且如果要保证用户体验，比如点开一个弹出层高度变化时敏感的反馈，检测时差得在300ms以下，这样频繁的更新`iframe`的高度是否会造成重绘过多性能下降还未估计。

在网上搜索后看到蓝色上这个帖子：[iframe自适应高度详解](http://bbs.blueidea.com/thread-2902341-1-1.html)，问题基本跟我一样，也无法解决实时性的问题。

暂时只得到这个[DEMO](/demo/iframe-height/)，还望高人赐教好招。

	setInterval(function () {
		var iframe = document.getElementById('iframe');
		var iDoc = iframe.contentWindow.document;
		iframe.height = 0; // 重设为0后才能保证取到正确的scrollHeight
		iframe.height = Math.max(iDoc.documentElement.scrollHeight, iDoc.body.scrollHeight);
	}, 2000);

PS：事实总在说明每当遇到坑爹的业务逻辑，就会需要坑爹的设计，然后导致坑爹的设计中要去摸索各种极限条件的未知大坑。这充分说明了“上帝喜欢简单”的道理，其实业务逻辑总是可以更简单。无奈程序员的存在就是堵住各种各样对世界观描述的错误后门，对，堵后门多了，就成基友了。

-EOF-

{% include references.md %}
