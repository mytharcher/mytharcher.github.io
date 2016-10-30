---
category: experience
title: node.js 调用子进程时的环境变量问题
---

[Hookagent](https://github.com/mytharcher/hookagent) 是我用 node.js 写的一个用于服务器根据代码仓库的推送自动部署的工具。之前一直发现部署后自定义脚本的环境变量不对，最终问题发现是 node 的`child_process.exec`中没有默认设置当前进程的环境变量，需要如下手动设置：

~~~
child_process.execFile('xxx.sh', ['args'], {
	env: process.env
});
~~~

参考：[exec与spawn方法的区别与陷阱](http://deadhorse.me/nodejs/2011/12/18/nodejs中child_process模块的exec方法和spawn方法.html)
