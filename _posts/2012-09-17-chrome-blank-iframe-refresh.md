---
date: 2012-09-17 15:21:43
layout: post
title: Chrome下对空src的iframe刷新问题
category: experience
tags:
- Chrome
- iframe
- 刷新
---

这个问题最初的现象是在Chome下修改iframe广告展示参数时，多调整几个选项后广告就无法展示开天窗了。经过多次尝试后发现在第三次修改选项后产生这个问题，非常诡异！正好在进入这个页面时由于存在与广告为代码互相跨域的引用，新版的Chrome下面会报一个跨域安全问题，我随即猜想是否因为在短时间或一定次数内的跨域调用导致另一个域名下的JS彻底被屏蔽执行？想到这基本上已经有点无厘头了，因为线上的老代码并不存在这个问题。

但当我向广告位产品线的同事描述这个情况后，被告知广告展示有一个策略是同一个页面内一个广告不能展示超过3次，跟我说的很像。但是我只有一个广告预览位置，同事再跟下去看DOM被操作的标记表示的确是触发了这条策略。

回想代码我把原来要用一个模板文件嵌入的iframe区域改成了空iframe，然后用脚本写入内容，应该和这有关。

	iframe.src = 'about:blank';
	iframe.contentWindow.document.write('<script src="http://another.domain.com/c.js"></script>');
	iframe.contentWindow.document.close();

从这猜测很有可能Chrome下设置空src不会导致刷新。于是把代码改成连iframe标签的HTML都一起重新生成后innerHTML到上层容器中，果然就好了！基本可以肯定Chrome这时又是好心做了坏事，想在src没改变的情况下缓存住iframe的内容不刷新，结果导致悲剧！

在最小化问题后，写了个[demo](/demo/iframe-same-src-refresh/)，总结出会触发这个问题的几个条件：

0. Chrome版本21
0. 通过设置一个iframe的src为`about:blank`，并使用`document.write`写入iframe的内容
0. 写入的内容包含用`<script>`外链的JavaScript脚本

此时外链的脚本执行的上下文环境不会刷新，导致已存在的变量继续累加产生问题。IE8和FF15没有此问题。

-EOF-

{% include references.md %}
