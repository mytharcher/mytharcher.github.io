---
layout: post
title: Firebug监控正则结果一直在反转
category: experience
tags: [cookie, 路径]
---

描述：如下代码：

	(/a/g).test('abcd');

放在firebug监控里，每当点击或者任何面板交互，结果的值都在进行翻转，`true`和`false`随时不同，非常离奇。

追查：发现正则中启用了全局模式`g`，去掉后正常。

原因：正则在使用全局模式时，同一个正则对象每次执行匹配时都会记录本次匹配后的索引，同时下一次会从这个索引开始匹配，所以有时能匹配上，有时匹配不上。

解决：分清全局模式使用的场合。

-EOF-

{% include references.md %}
