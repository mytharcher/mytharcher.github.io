---
layout: post
title: 转入Mac阵营
category: thinking
tags: [Mac, OS, OSX, 操作系统, 苹果]
---

## 改变 ##

说起换到Mac的原因，一是我这么多年（可以从6岁算起）从来没有买过一台笔记本电脑，要之后要不在公司，那公司的笔记本也就蹭不上了。二是想到要是带着出去旅行之类，也需要一台轻薄到极致的便携电脑，导个照片什么的再正常不过了，万一要是手痒了想写点代码，那光有移动硬盘也不行啊。

然后选择也就简单了，虽然现在市场上超级本的概念吵的很火，但真正做出来可以选择的好像没多少，而且关键是笔记本电脑行业都发展这么多年了，还都卖的死贵死贵（Ausu/Sony 13‘的还1w左右），完全还是奸商们在用概念坑钱的阶段。反而比起来做了好几年的Apple Mac Air便宜很多，于是也没什么好犹豫，挑个时间直接就入手了，水货全套+运费=￥6900。

到手以后其实也没有太多新鲜，毕竟也不是完全没有见识过，周围大把的UE和部分的FE都已经切到Mac上工作了，也正因为大家都推荐而且也的确不错买的才不犹豫。不过说换台电脑简单，但换个操作系统可是非常痛苦的一件事，尤其是对于从小就从DOS深入使用MS Windows体系，并且很少去碰Linux的玩家，在多年浸淫同一种系统后首次舍得购买曾经昂贵的Apple电脑，突然转入到Mac系统的阵营还是一个不小的冲击。

首先麻烦的事情就是要把以前要用的软件全部转到Mac下，或者至少找到可替代的产品。买之前我就给自己常用的软件列了个表：

开发相关
:	
	0. Chrome
	0. Firefox
	0. git/svn
	0. Sublime Text
	0. Apache
	0. PHP
	0. Java
	0. Ruby
	0. node.js
	0. GoAgent

日常使用
:	
	0. 拼音输入法
	0. 媒体播放器
	0. Photoshop/Lightroom
	0. QQ
	0. Google Earth
	0. Google Picasa

## 阵痛 ##

痛苦也就是从装软件开始的，我经历的步骤大概如下：

0.	装Chrome，Google官网要翻墙，于是百度了国内下载站完成安装。
	
0.	装git，下了GitHub官网for Mac的APP，发现只是个GUI，不过里面还好有一项是安装git命令行。
	
	git开启命令行配色：
	
		$ git config --global color.ui true
	
0.	装Sublime Text，结果官网要翻墙，忍无可忍准备先搞定GoAgent翻墙，还好系统自带了Python，但还需要运行C编译器，没有！于是看到说下XCode可以顺便安装上，但是下载1.6个G！趁这时间还是搜国内的下载站装上算了，尼玛的翻墙！
	
0.	期间无聊的时候下了Firefox，QQ，也摸索着各种快捷键和常用程序的使用。
	
	快捷键大多数还好，把以前在Windows下的Ctrl换成菊花命令键就OK，包括复制/粘贴/全选/剪切/撤销/重做等都没变化，甚至在Chrome和其他程序下新建标签页/新建文档/关闭标签页类似的都也是菊花+T/W完成。
	
0.	后来太多，记不住了。。。

## 经验 ##

### GUI下显示隐藏文件 ###

	$ defaults write com.apple.finder AppleShowAllFiles -bool true​

### [QQ For Mac 消息铃声替换方法](http://www.mac52ipod.cn/read.php/581.htm) ###

> 在 Finder 中找到 QQ 应用程序，然后在右击图标弹出的菜单中选择“显示包内容”，这样可以查看应用程序内部的文件。从目录中依次查找 Contents -> Resources -> msg.aif ，这个就是铃声对应的声音文件，将喜爱的声音文件名改成“msg”(扩展名保持文件原有 扩展名必须要 aif或aiff 这些是苹果专用格式)替换原文件，替换完 重新登陆QQ就是新的铃声了。

### Mac QQ 多开

按 CMD+N

### 系统用户头像更换方法 ###

系统偏好设置 -> 用户/用户组 -> 点击头像 -> 拖动一张图片进去

### [在Mac OS X中配置Apache ＋ PHP ＋ MySQL](http://dancewithnet.com/2010/05/09/run-apache-php-mysql-in-mac-os-x/) ###

Apache的配置过程中，使用以下命令来启动和查看启动错误：

	$ sudo apachectl -k start

### [Mac系统的启动过程和系统启动时运行shell脚本《转》](http://blog.sina.com.cn/s/blog_8732f19301010olq.html) ###

> 将脚本内容写入/etc/rc.local即可

### [Mac下如何设置开机自动运行指定命令？](http://segmentfault.com/q/1010000000095696) ###

> System Preferences -> Users & Groups -> Login Items -> 加号（选择你的脚本）

### [修改Mac命令行提示符](http://equation85.github.com/blog/customize-terminal-on-mac/)（英文：[Customizing Your Bash Command Prompt](http://blog.superuser.com/2011/09/21/customizing-your-bash-command-prompt/)） ###

### 添加命令行快捷方式 ###

`~/.bash_profile`中：

	alias vhosts="sudo vi /etc/hosts"  # 编辑hosts文件
	alias work="cd ~/work"             # 快速进入工作目录
	alias cl="source cl.sh"            # cl=cd & ls

`/usr/local/bin/cl.sh`：

	#!/bin/bash
	
	cd $* && ls

### 超级管理员

	sodu su

### Postgresql 启动

看不到 postgres 启动进程，需要运行`initdb`命令进行初始化，权限不能是 root，必须是当前用户：

    $ sudo rm -rf /usr/local/var/postgres
    $ sudo mkdir -p /usr/local/var/postgres
    $ sudo chown `whoami` /usr/local/var/postgres
    $ initdb -D /usr/local/var/postgres/

然后 launchctl 的守护进程自动就启动了。

### [Mac下Chrome快捷键（官网）](https://support.google.com/chrome/bin/answer.py?hl=zh-Hans&answer=165450) ###

### Mac ssh 连接 Ubuntu

Ubuntu 服务器上 `~/.vimrc` 文件中添加以下内容：

    set encoding=utf-8 fileencodings=ucs-bom,utf-8,cp936

Mac 下 ssh 无法输入中文，是由于 ssh 配置会自动应用当前系统的设置到远端，而系统中没有设置中文，导致远端无法输入。在`~/.bash_profile`加入以下两行：

    export LANG=“en_US.UTF-8”
    export LC_ALL="en_US.UTF-8”

参见：[Mac OS X ssh连接Ubuntu汉字不能输入问题]( http://ling0322.info/2013/12/18/mac-os-x-ssh-chinese-input-problem.html) 

### FTP软件 ###

需要FTP软件的时候欣喜的发现[FileZilla](http://filezilla-project.org/)居然有免费的Mac版。

### Firebug面板快捷键修改 ###

先把系统的F1-F12快捷键改为按FN后才使用基础功能内容，然后先鼠标点击打开Firebug面板，在面板左上角点虫子图标，下面有`Customize Shortcuts`，然后你就找到了。

### [Mac OS X刷新DNS缓存](http://www.jayxu.com/2010/03/08/2086/) ###

> 在命令行下输入：
> 
> 	 $ sudo dscacheutil -flushcache

### SSH翻墙 ###

自己有VPS或者可以ssh的主机的话，直接命令行建立代理翻墙：

	$ ssh -D <PORT> <USER>@<HOST>

### 媒体播放器 ###

众多人推荐的播放器：[MPlayerX](http://mplayerx.org/)，大部分格式无压力。

要是听歌？iTunes反正我不会用，本地音乐十几个G都在原来台式机硬盘上，考虑到MBA硬盘128很吃紧就不折腾了，直接听在线的吧，其他挑精选的手机听了。

### RAR格式压缩包 ###

[mac下解压缩rar文件工具-rarosx(免费的)使用介绍](http://jinchishuxue.iteye.com/blog/684495)

> 下载地址：<http://www.rarlab.com/download.htm>
> 
> 	$ cd path/to/rar
> 	$ sudo install -c -o $USER unrar /bin

反正我在*nix下不打算用rar打包了，能解压就行。

### 网银 & 支付宝 ###

直接上招行官网，点右侧的个人网上银行大众版，进去有MAC插件下载了！

支付宝也是官网有MAC支持下载了！

这些搞定基本就可以跟虚拟机windows say goodbye了！

### 图像处理 ###

#### Canon DPP 安装 ####

参照这篇：[Mac直接安裝 Canon DPP 升級版!!!!](http://www.canonfans.biz/simple/?t96570.html)

> 一樣先到Canon官網下載更新軟體
> 
> 1. 掛載下載下來的檔案
> 2. 把updateinstaller檔案拖曳(複製)到桌面
> 3. 右鍵或雙指來點擊這個檔案選擇<顯示套件內容>
> 4. 在跳出來的畫面中，進入 在進入
> 5. 在裡面找一個檔案`SDI.bundle`,右鍵或雙指來點擊這個檔案選擇<顯示套件內容>
> 6. 在跳出來的畫面中，進入 在進入
> 7. 在裡面找一個檔案`update.plist`刪掉它
> 8. 回桌面點擊複製到桌面的updateinstaller檔案就可以安裝了

#### Photoshop ####

官方有Mac版，要破解请自行Google。

#### Windows远程桌面 ####

微软官方用于在Mac下连接Windows远程桌面的工具：[远程桌面客户端](http://www.microsoft.com/zh-cn/download/details.aspx?id=18140)

### 其他工具软件包 ###

#### ImageMagick ####

用于在命令行处理图片，比如批量调整大小等需求（[官方下载页面](http://www.imagemagick.org/script/binary-releases.php)）。

	$ brew install imagemagick

## 吐槽 ##

0.	CMD菊花键和Ctrl被换位置极其不习惯啊！万一哪天又要回Windows星或者去Linux星看看就很别扭了啊！

0.	比起Windows下的资源管理器（尤其配合Clover），Mac下的Finder实在太难用。
	
	可能对于普通电脑用户他们的确不需要知道计算机系统是由文件构成的这个事实，但对开发者来说被系统掩盖的太深，没有充分及便捷的控制方式，结果是非常影响工作效率的。
	
	* 没有clover的标签页不说，连左侧文件树都没有，定位起来非常痛苦！
	* 在文件列表中使用[菊花+下]定位，居然这个组合键是直接打开文件！尼玛其他所有地方都是定位导航的操作，你在这怎么这么奇葩！
	* 完全不会记住每个文件夹的浏览视图，每次都要重新打开！
	
0.	各种软件包巨占空间。
	
	XCode居然要4个多G！连MySQL都要将近500M，这在Win下只要几十还是一百多M的啊。真的不理解Mac的软件为啥要占那么大空间。幸好买的硬盘是128G的，不然低配的估计连软件都不够装，更不要想照片音乐电影了。
	
0.	没有了？！

我一直想找更多的茬出来吐槽，但过了一两个星期基本就全都习惯了，特别因为很多事情都是靠浏览器+命令行+Sublime完成了。以至于回Windows下一直拿着Alt当Ctrl按，死活不对啊！

## 总结 ##

操作系统和豆瓣电台一样都是需要调教的，只是没有点红心那么简单，但是调教的越多她就会越听话，用起来也越顺手。

就像新认识一个妹子，如果长的漂亮的确很容易被她吸引。但要能快速的深入了解，就需要有良好的UI交互，API。最好能让她很顺从的适应你以前积累的习惯，当然要是新的习惯更好我也可以有所改变。之后还要会做我爱吃的菜，保持家里清洁卫生，有客人来也能接待好，当然最重要的是在你工作的时候安静的守在一边，需要的时候就帮忙递个扳手锤子，打个下手什么的，让我的任务可以高效的完成。

其实不是说Windows就真的不好，毕竟是从童年-青春期-成年调教了这么多年的，各种姿势早就习惯了。但最大的问题是整个开发的世界都是for \*nix的，在\*nix下各种软件包各种命令行很方便，而一到win就成各种怪胎，甚至有的开发者写文档会说各种Linux下怎么做，FreeBSD下怎么做，Mac下怎么做，但是到Win平台，直接大了一串`hahahah~`，你能不崩溃么！[v2ex](http://www.v2ex.com)上还看到很多人都说开发者一般对\*nix桌面系统的折腾流程都是：Ubuntu -> Debian -> Arch -> Gentoo -> 最终换到了Mac！这么说我省了很多时间一步到位了。另外，Mac实质上有更多新鲜的体位（说的多指触摸的触控板啦）用起来很爽不是！

其实也就电脑能这么比较，真要用这种标准去衡量妹子，那肯定会悲剧的啊！
