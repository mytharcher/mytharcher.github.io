---
layout: post
title: Cookie获取深层路径值错误
category: experience
tags: [cookie, 路径]
---

描述：对cookie在不同路径设置同一个键，在深层路径下会存在多个该键及对应的值，所有浏览器表现一致。即获取到的值可能出现如下情况：

	'c=1; c=2; c=3;'

解决：规避使用cookie是在不同路径下设置同一个键。

-EOF-

{% include references.md %}
