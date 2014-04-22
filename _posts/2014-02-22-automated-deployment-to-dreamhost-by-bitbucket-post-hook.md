---
layout:   post
title:    通过Bitbucket的POST hook向Dreamhost上自动部署git项目
category: experience
tags:     [Bitbucket, POST hook, git, Dreamhost, deploy, 自动部署]
---

大多数的PaaS服务都是用git push来进行部署，比如Heroku。其原理就是使用git提供的hook功能，这在GitHub和Bitbucket上都有提供。使用这样的方式对项目管理来说非常方便，但这次没有使用PaaS，于是准备在Dreamhost上手动配置一个hook来解决代码部署。

根据[Bitbucket对POST hook的官方说明](https://confluence.atlassian.com/display/BITBUCKET/POST+hook+management)，我们可以通过创建一个POST hook来进行git项目的自动部署。

## 第一步：在目标机器创建接收POST hook的URL

Bitbucket的官方hook说明中提到可以使用带有Basic认证模式的URL来进行POST通知，我个人也推荐这个方法。原因是使用一个随机的用户密码以保证这个URL不被随意或错误的调用，同时用户密码只存在脚本和Bitbucket的hook配置里，其他地方不会使用，具有一定的安全性。

但在测试中发现Dreamhost不支持HTTP Basic Authentication的Header被PHP读取（官方论坛问题：[PHP and PHP_AUTH_USER](https://discussion.dreamhost.com/thread-71152.html)，也可以通过`phpinfo()`的信息查看），于是通过这篇文章：[HTTP Authentication on PHP as CGI (like Dreamhost)](http://planetozh.com/blog/2009/04/http-authentication-on-php-as-cgi-like-dreamhost/)的方法，在`.htaccess`文件中加入以下规则：

	RewriteEngine on
	RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

并根据文章说明在PHP脚本中使用以下语句获得Basic认证方式的用户和密码变量：

	list($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']) =
		explode(':' , base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));

## 第二步：编写目标机器接收的处理逻辑

参考的是这篇博客[Using Bitbucket for Automated Deployments](http://brandonsummers.name/blog/2012/02/10/using-bitbucket-for-automated-deployments/)里的代码。解析验证参数通过后，就可以使用这段代码执行`git pull`的过程。整个程序储存为`git-hook.php`

## 第三步：准备Dreamhost环境

以上两个文件上传到Dreamhost的网站目录，同时这个目录需要初始化git信息，并以ssh协议添加远端仓库：

	$ git init
	$ git remote add origin ssh://git@bitbucket.org/username/repo.git

复制Dreamhost上当前用户`id_rsa.pub`的内容（没有的话创建一个），并到Bitbucket上以此创建一个deploy key（在项目设置中）。这一步我<del>不</del>确定是<del>否</del>必要的（但按照Bitbucket的说明是要的），但要注意，DH上的rsa只能设置**空密码**，否则部署不能成功。

接下来准备项目的分支，一般直接使用`master`分支，我这个项目用Dreamhost主要做测试用，所以使用了`dev`分支。所以在使用非`master`分支时需要手动创建好并切换到这个分支，方便起见，切换后可以删除`master`分支。

## 第四步：从本地push到Bitbucket测试效果

准备好之前的步骤之后，不需要在Dreamhost上pull代码，而可以回到本地环境，尝试向Bitbucket push一次代码，注意push的分支是之前配置过的。

一切正常的话Dreamhost上的代码就自动pull下来了，这时可以点开网址看看效果。

注：以下是上面提到的两个文件

<script src="https://gist.github.com/mytharcher/9138422.js"></script>

## Update ##

在Linux主机上遇到的问题这篇文章比较有帮助：

[Git pull from a php script, not so simple.](http://jondavidjohn.com/git-pull-from-a-php-script-not-so-simple/)

另外注意几点：

0. 使用PHP函数`exec('whoami')`方法调用命令行时，命令行的用户是当前执行PHP的用户。
0. `exec('xxx 2>&1')`可以捕获命令行的错误输出。
0. ssh-key出现的各种验证错误问题，都需要检查是否是当前用户，`~/.ssh`目录权限，`~/.ssh/known_hosts`文件是否已添加等情况。
0. PHP中`exec()`执行脚本的路径是文件所在位置的路径。

-EOF-
