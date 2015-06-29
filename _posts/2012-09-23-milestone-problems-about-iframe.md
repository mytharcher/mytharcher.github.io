---
layout: post
title: 里程碑项目与iframe有关问题的排查
category: experience
---

这次改版升级中各种与iframe有关的诡异问题，集中在上线前测试中大爆发，各种坑都趟了一遍，雷区大冒险正式开始！

0. [Chrome下对iframe设置同样的src内容（about:blank），不会导致脚本环境刷新](/blog/posts/chrome-blank-iframe-refresh)
0. [IE8（包括以下）for..in无法遍历出对象上自定义的`toString`属性](/blog/posts/tostring-cannot-be-iterated-in-ie)
0. [IE8下window.postMessage的参数类型差异](/blog/posts/message-parameter-of-postmessage-in-ie)
0. [window.open返回值为null](/blog/posts/window-open-return-null)
0. [FF和Chrome等现代浏览器支持字符串变量的中括号取值计算](/blog/posts/use-brackets-to-get-char-in-string)

之前正好这个上游产品线对多级iframe调用做了屏蔽，可能就导致我们正在升级的开发版本出现问题。而正是由于错误的信息没有隔离情况深究自己代码的问题，最终全部排查清楚，于此记录在案，以备后效。

-EOF-

{% include references.md %}
