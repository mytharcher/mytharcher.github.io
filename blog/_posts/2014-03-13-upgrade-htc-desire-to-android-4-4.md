---
layout: post
title: 将HTC Desire刷到Android 4.4
category: experience
tags: [HTC Desire, Android, Android 4.4, 刷机]
---

![](http://www.theandroidsoul.com/wp-content/uploads/2014/01/htc-desire-j00m-kitkat-rom.png)

在经历过上次[折腾Android刷机的痛苦](/blog/posts/tossing-android)之后，我的HTC Desire历经一年我跑在全国各地都运行良好。可就在今天早上起床以后突然就启动不起来了，好在还能进fastboot和recovery模式，我恢复了上一次系统备份，但居然是一年前的。心想既然也是重刷，不如刷个4.4，正巧前几天看到一个老外放出来针对这个手机4.4的ROM，干脆就来试试。

所有的步骤基本都是参照这篇文章：[Update HTC Desire to Android 4.4.2 KitKat with j00m ROM](http://www.theandroidsoul.com/update-htc-desire-android-4-4-2-kitkat-j00m-rom/)，所以我后面也就是大概翻译一下。

## 第零步：检查你的设备 ##

![HTC Desire](http://2a.zol-img.com.cn/product/45_800x600/276/ceJ0hMcEbuRmo.jpg)

确保你的设备是**HTC Desire**（G7），因为ROM都是针对机型的。

## 第一步：备份你的手机 ##

用什么工具备份就随便你了，SD卡最好也备份（万一要重新分区），我直接使用的recovery里的备份当前系统。

## 第二步：解锁（略） ##

能玩到4.4刷机的我默认大家都解锁且Root过了，所以具体过程还是去网上找吧。这一步主要是为了可以刷入最新版本的recovery。

## 第三步：刷入最新版本的recovery ##

各手机型号最新版本的recovery下载列表：<https://www.clockworkmod.com/rommanager>

下载我们HTC Desire的[5.0.2.0](http://download2.clockworkmod.com/recoveries/recovery-clockwork-5.0.2.0-bravo.img)，虽然不是最高的`6.0.4.4`，但实测可用。

接下来打开手机的USB调试模式，重启到fastboot，连接电脑（默认你已经安装了命令行adb工具）。普通方式请直接参照[How to manually update ClockworkMod recovery image on HTC Desire GSM](http://blog.mybox.ro/2011/04/20/how-to-manually-update-clockworkmod-recovery-image-on-htc-desire-gsm/)：

	$ fastboot devices
	HT09RPL00912	fastboot

找到设备后：

	$ fastboot flash recovery recovery-clockwork-5.0.2.0-bravo.img

如果在命令行找不到已连接的设备（我在MAC下就是这种情况），比如报错是`USB device not found`，那么可以参照这篇文章[Mac OS X 下部分Android手机无法连接adb问题之解决方案](http://blog.csdn.net/duanyipeng/article/details/8836040)解决：

	$ system_profiler SPUSBDataType | grep HTC
	Vendor ID: 0x0bb4  (HTC Corporation)

找到这个`0x0bb4`的号码，将其加入到`~/.android/adb_usb.ini`中：

	$ echo "0x0bb4" >> ~/.android/adb_usb.ini

注意，搜索到这篇文章的说明“[adb failed to start daemon 的解决办法](http://www.cnblogs.com/mudoot/archive/2013/04/25/adb_daemon_not_running.html)”，这个文件中绝对不能有空行，否则还是找不到（写这个的程序员一定犯懒没有做trim）。

## 第四步：下载ROM文件 ##

ROM链接：<http://j00m.exnix.org/j00m_ev_bravo-nightly-2014.01.02-squished.zip>

另外不要参照原作者的步骤去下载GAPPS包，因为手机内存太小根本安不进去，直接会导致刷机后无法启动。所以只要将上面的ROM包下载到SD卡中就可以了。

## 第五步：刷入ROM ##

重启手机到recovery模式，双wipe后选install zip from SD card，找到安装包的位置，确定，等待就好。

![](http://www.theandroidsoul.com/wp-content/uploads/2013/11/How-to-Flash-File-in-CWM-Recovery.jpg)

很快就会结束，然后选择重启，稍等一会就可以看到启动画面变成了闪光的**android**标识，大概再等十几二十秒就正常进入4.4绚丽的系统了！

到这刷机就完成了，但是当你开始安装APP的时候就会发现，tmd内部存储总量才有140Mb，而原生应用已经占了60Mb，于是你只剩下80Mb装软件，在一个微信都要50Mb的年代，这能玩？！于是你还需要下一步。

## 第六步：a2ext ##

在上次[折腾Android刷机的痛苦](/blog/posts/tossing-android)过程里，这是一件很简单的事，于是我想参照在adb shell的命令行执行：

	$ cd /data/
	$ mv app /sd-ext/
	$ mv app-private /sd-ext/
	$ mv dalvik-cache /sd-ext/
	$ ln -s /sd-ext/app app
	$ ln -s /sd-ext/app-private app-private
	$ ln -s /sd-ext/dalvik-cache dalvik-cache
	$ cd /sd-ext/
	$ chmod 777 app
	$ chmod 777 app-private
	$ chmod 777 dalvik-cache
	$ reboot

结果却完全不一样，完全无法启动了。于是我又再重刷，还尝试了Link2sd这个应用，但他根本没找到我的ext3分区。最后终于在网上找到解决方案，原来可以用adb shell里原生的a2sd命令一句话直接解决：

	$ su
	$ a2sd
	y
	n
	y

三个选项中`n`代表不将应用数据保存到ext分区，据说是为了提高运行速度。在这之后重启就会发现安装APP不再占用内部存储空间了，才算完美刷机结束。

## 感受4.4 ##

总的来说，比2.3还是快了一些，毕竟机器是2010年的，差现在已经4年，但还能继续坚持使用已经不错了。而且不仅是操作变流畅，还可以安装很多2.3用不了的应用，非常好顶赞！看来Google所说4.4是针对旧手机的性能优化诚不欺我，所以建议有条件的用户都更新到最新的系统，感受新的便捷。

-EOF-
