---
layout: post
title: 一个分号引发的血案
category: experience
tags: [JavaScript, 分号]
---

Hadson集成CI环境出同一个问题好多次了，原因却各不相同。今天再次碰到，纠结了很长时间依然不明白，为什么版本差异仅仅是提交的JS代码，就导致整个项目编译失败？dulin同学再次仔细的查看日志后发现报错的仍是yuicompressor的压缩步骤，但不同的是居然因为JS检查中syntax error导致无法继续。

	[ERROR] .../src/main/webapp/assets/js/~build.js:line 2931:column 6:missing ; before statement
	}esui.Button.prototype.__createMain = function () {
	[ERROR] .../src/main/webapp/assets/js/~build.js:line 2933:column 1:syntax error
	};

真正跟到这条日志的时候就很明了问题出在什么地方了——**分号**！

我写的前端JS合并打包的过程会按序列拼接所有的JS文件，那么其中可能有的文件就是一整个对象声明，而在最尾忘记了写分号，然后跟下一个文件合并的时候打包脚本又不会自动补一个换行符，这就导致原本开发时都是分散的文件没有任何问题，但合并后就出现了日志中这种情况：

	var a = {}b = 100;

于是yuicompressor的JS语法分析器到这就无法辨别这究竟是一个什么语句，最终报出syntax error。

更详细的原因可以参照ECMA-262语言规范中[分号自动插入规则](http://let-in.blogspot.com/2007/05/ecma-26279-automatic-semicolon.html)（原版地址：<http://bclary.com/2004/11/07/#a-7.9.1>）来解释：

> * 从左到右解析程序时，若遇到不被任何产生式允许的token（被称为/违规token/），于是，在下列情况一个或多个为真的违规token之前自动插入一个分号：
> 	0. 该违规token与前一个token之间以至少一个行结束符分隔开。
> 	0. 该违规token是`}`。

就是说，如果上面日志中的错误例子中有一个换行符，那么解释器是会自动插入一个分号的：

	var a = {};
	b = 100;

但如果没有，解释器就不知道怎么办了，明显`{}b`这样的表达式也读不通，所以报错了。

更具体的分号处理还是看ECMA的规范吧，当然这次问题的原因也导致了我对《[JavaScript语句后应该加分号么？](http://hax.iteye.com/blog/1563585)》这篇文章的不认同。在应该用分号结束一个语句的地方不加，刚好又在文件结尾没有换行符，当多文件合并时就必然出现这样的问题。而没加的原因正是在有团队代码规范时仍有程序员的代码习惯不好。这种情况甚至让某些团队出台JS文件第一个语句必须以分号开头的规范。所以我个人还是支持每一条语句都以分号结束，但不需要极端到开头写分号。

这次问题排查时间过长也有一部分之前yuicompressor的maven插件其他问题的干扰，但根本的还是换到Sublime Text下开发没有强制团队使用语法检查的工具。而之前一直用Aptana时每个错误都会实时提示，让人不能不主动解决掉。然后搜索了之前装的[SublimeLinter][]不能跑起来的原因是没有装[node.js][]，装了之后果然好用了。所以今后需要在几个方面都有所注意：

* 团队规范语句结束必须加分号
* 建议所有文本文件结尾都有一个换行符
* 开发工具必须通过语法检查来避免低级错误
* 遇到平台问题多注意抛出Exception的上下文错误

OK，结案！

-EOF-

{% include references.md %}
