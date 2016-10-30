---
layout: post
title: Shell脚本笔记
category: experience
tags: Shell
---

### 利用`tar`命令做文件夹复制

虽然简单的`cp -r`也能完成大部分任务，但我不知道如何做过滤限制。看到项目之前的发布脚本里为了要过滤svn目录写了长达10行的cp操作，就决定找一种简单的方式来完成。所幸搜到这个帖子跟我的需求完全一致：[按条件选择文件后如何保持目录结构进行拷贝](http://bbs.chinaunix.net/thread-3613442-1-1.html)，于是折腾半天以后得到下面的代码：

	tar -c source/dir --exclude=.svn | tar -x -C dest/dir

`tar`的两个反向操作用管道连接在一起，这个思路可谓是大爱！

### 分析文件内容合并输出

这其实是[ER][]里的一个例子，项目中每个功能都用零散的JS文件开发，然后通过一个文件中写`document.write`全部的`<script>`标签进行引入，到上线的时候再通过脚本把所有引用的文件合并打包成一个。

Erik原来是这么写的：

	cat asset/mblog.js | 
	    awk -F'"' '/src="[^"]+.js"/{print $2}' |
	            xargs cat > "asset/mblog-all.js"

但我拿过来项目里就不好使，研究了半天发现`awk`这个命令其实并不适合分析字符串，更适合用在格式化的日志文件分析里。所以我又去网上找其他的命令，然后发现了`sed`，于是自己捣鼓出下面的打包命令：

	sed 's/.*"\(.*\.js\)".*/\1/' "src/~build.js" | xargs cat > "dest/~build.js"

### 通配符和引号

删除文件时路径如果被引号（单双皆同）包括，那么路径通配符*不会被正常解析。

	rm -rf "abc/*" # 不成功
	rm -rf abc/* # 成功

但是在`find`命令中又刚好相反：

	find . -name * # 报错
	find . -name '*' # 成功

### 批量修改文件后缀

	ls | grep markdown | awk -F'.' '{print $1}' | xargs -i mv {}.markdown {}.md

-EOF-

{% include references.md %}
