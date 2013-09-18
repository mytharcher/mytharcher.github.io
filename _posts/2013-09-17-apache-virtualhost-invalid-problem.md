---
layout: post
title: Apache虚拟主机配置不生效的问题
category: experience
tags: [Mac, Apache, virtualhost, 配置]
---

这次SSD坏掉Apple给我换了新的，当然系统也重装过，再配置本地开发环境Apache服务器时始终虚拟主机不对。我再用`host`命令查询本地域名全都没有生效，于是很奇怪去网上查，有说10.8的系统之后DNS的解析顺序被调整，`/etc/hosts`文件的优先级被后移。于是我到处想办法问如何解决这个DNS的问题，却没想到用`ping`命令尝试一下，直到问题发到网上有人提醒，才发现域名配置的是对的，`/etc/hosts`也生效了。那本地站点无法访问就应该是Apache的配置问题，再翻出各种配置，并找来网上别人的配置对比，才发现虚拟主机部分少了这么一句话：

    NameVirtualHost *

其实遭遇过很多次这个问题，以前在Windows下也碰到过，但从来没搞明白为什么。这次终于找到原因，加了这句话重启服务立马万事大吉！

-EOF-
