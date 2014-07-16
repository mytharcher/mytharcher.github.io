---
layout:   post
title:    Cordova (Phonegap) 开发手机应用问题集
category: experience
tags:     [cordova, phonegap, icon, 图标]
---

用PhoneGap开发手机应用已经不是新鲜事了，不过我才刚刚接触。对于从Web转过来偶尔做个手机小应用的确是个较为简单的起步方式，减去了新语言的学习成本。不过还是会碰到不成熟开源项目的一些坑。

## 历史 ##

[PhoneGap][]应该大家都知道，但Cordova我也是这次用才见这个词。尤其是在搜索官方文档的时候先后出现了好几个不同的域名，有phonegap.com的，有adobe.com的，还有apache.org的，所以一下就混乱了。

所以先查了资料正名下，按照[PhoneGap官方对名字的解释](http://phonegap.com/2012/03/19/phonegap-cordova-and-what%E2%80%99s-in-a-name/)，最早叫PhoneGap，后来由[Adobe在2011年收购了Notibi公司](http://news.newhua.com/news/2011/1021/135030.shtml)后，将源码捐赠给Apache软件基金会托管。由于一些商标和License的原因，Apache托管的项目改名为Cordova。现在用一句话解释就是：PhoneGap是Cordova的一个发行版，正如WebKit是Chrome和Safari的开源引擎。

> PhoneGap is a distribution of Apache Cordova. You can think of Apache Cordova as the engine that powers PhoneGap, similar to how WebKit is the engine that powers Chrome or Safari. (Browser geeks, please allow me the affordance of this analogy and I’ll buy you a beer later.)

那么我这里使用的是Apache的Cordova，因为Adobe的PhoneGap在线构建只支持一个免费的私有项目。所以后面的问题都是基于Cordova。

## Getting Start ##

首先安装[Cordova命令行工具](http://cordova.apache.org/docs/en/3.3.0/guide_cli_index.md.html#The%20Command-Line%20Interface)：

    $ npm install -g cordova

然后根据官方文档创建项目：

    $ cordova create project/path com.domain.project AppClass

这个命令会在`project/path`目录中创建包路径为`com.domain.project`的应用类`AppClass`。

进入创建的`project/path`目录添加要通过Cordova发布的平台，大多数情况即Android和iOS：

    $ cordova platform add android
    $ cordova platform add ios

好了，到这一步就可以进入项目中的`www/`目录下编辑`index.html`完成应用了。

## 调试和测试 ##

### Android ###

首先你要安装了Java和[Android开发工具](http://developer.android.com/sdk/index.html)，然后根据[Android开发工作流程](http://developer.android.com/tools/workflow/index.html)创建AVD设备模拟器。在开发到可用阶段后，通过下面的命令构建和测试：

    $ cordova build android # 编译+构建

新开一个命令行窗口打开模拟器（或者在Eclipse里打开）：

    $ emulator -avd VirtualDeviceName

再到命令行里push到模拟器：

    $ cordova emulate android

这时候就可以在模拟器里测试自己的应用了，不过touch只能用鼠标点击来模拟。

如果要发布APK文件，那么可以在Eclipse界面里操作导出为APK，跟着提示继续就可以了。其中一步要创建一个签名秘钥，要输两个密码，最好找地方记住，然后秘钥文件也要保存好。

在命令行发布的话要安装Ant，并且使用之前创建的秘钥。进入到项目的`platforms/android`目录（秘钥文件最好就放置在此目录），创建一个`ant.properties`文件，以指明使用的keystore：

    key.store=your.keystore
    key.alias=youralias

运行：

    $ ant release

过程中会要求明文输入之前的秘钥，然后就会在`bin/`目录中生成`AppClass-release.apk`，这个文件就可以拿到真机上安装使用了。

或者调试的时候也可以不用签名，直接运行`ant debug`就可以编译一个带DEBUG签名的APK，但是非签名应用真机不开debug模式是不能安装的，市场也不接受这样的安装包。

调试中也可以使用USB连接真机（要求打开debug模式），在项目目录运行下面的命令push到真机：

    $ cordova run android

不过我一般是在模拟器测试差不多再发布一个签名安装包到真机测试。

### iOS ###

iOS的开发好像只能在Mac下，使用Xcode。首先也是先编译构建：

    $ cordova build ios

之后在`platforms/ios`目录中会有一个`AppClass.xcodeproj`文件，文件名是之前创建时的应用名（也可以在`config.xml`中修改成发布使用的名称）。双击这个文件在XCode中打开项目，左上角运行栏里选择一个虚拟设备，比如iPhone的iOS 6.1（需要下载500+M），CMD+R就在iOS中运行了。

要想在真机里调试的话Apple会要求你注册成为AppStore的开发者，要交$99一年的“保护费”才可以。由于我觉得我的应用还暂时没达到能赚钱的地步，所以暂时虚拟测试，等以后做的足够好再去市场发布吧。

不过根据[用 Xcode 在 iOS 越狱设备上开发调试](http://zhuoqiang.me/jailbroken-ios-device-debug-using-xcode.html)这篇文章，也可以在已越狱的设备上安装发布。

我使用的Mac系统版本是10.9，Xcode版本是5.0，这其中有一些路径会不一样，但基本在Xcode.app的目录中相应能够找到。

要导出越狱iOS设备可用的`.ipa`安装包步骤如下：

0. 在XCode中选择模拟设备iOS Device（第一个）
0. Product菜单中选Achieve进行打包
0. 按`⌘`+`Shift`+`2`打开Organizer面板，Achieve选项卡，选中自己的项目
0. 点右侧`Distribute`发布，三种模式选最下面的，选个路径导出项目包
0. 将项目包拖进iTunes，找到对应应用，右键选择在Finder中查看，这里就能看到`.ipa`文件，复制出来就可以了

## 问题集 ##

### 图标配置及自动生成问题 ###

开发的时候一直不明白Cordova的图标配置在哪里，网上搜了各种说法都不一。后来在Stackoverflow上找到一个问题：[How to add app icon within phonegap projects](http://stackoverflow.com/questions/17820492/how-to-add-app-icon-within-phonegap-projects)，其中[Linus Unnebäck](http://stackoverflow.com/users/148072/linus-unneback)的回答对我提供了帮助。

按照他的回答，下载[Gist:7515016](https://gist.github.com/LinusU/7515016)里的脚本，并按其中的README.md安装到项目中，再在`config.xml`中添加一行：

    <icon src="res/icons/" />

然后在`www/res/icons`目录中添加`android`和`ios`目录，并按规则添加不同尺寸的icon图标文件。之后在运行build命令时，图标就会自动被复制到项目指定位置，虚拟机里应用的图标就不在是Cordova默认的了。

Linus Unnebäck的脚本里还有一个自动resize的脚本`convert.sh`，把它也copy到`www/res/icons`目录，在该目录中调用脚本可以将一张名为`my-hires-icon.png`的图片自动resize成Adnroid和iOS的目标图标尺寸并改名，就不用人工在Photoshop里一个一个修改了。也可以在脚本中把这个文件名改为`$1`，这样调用方式里就可以随意指定图标的源文件名名了：

    $ sh convert.sh my-logo-512x512.png

使用这个脚本之前需要先安装强大的图形处理工具[ImageMagick](http://www.imagemagick.org/)软件包。Mac下使用`brew install imagemagick`即可。另外需要安装`jpeg`和`libpng`等解码库，也可以使用brew。

但是不知为何我的安装出了些问题，在运行脚本时报了这个错误：

> convert: no decode delegate for this image format `logo-512.png' @ error/constitute.c/ReadImage/552.

搜索了很多问题后，我的解决方案是，卸载ImageMagick并重新下载源码编译安装，安装目录我仍使用了之前brew的目录`/usr/local/Cellar`，并按brew的规则把源码包放在`imagemagick/6.8.8-1`目录中。

配置编译参数（主要是告知其libpng包的位置）：

    $ ./configure CPPFLAGS="-I/usr/local/Cellar/libpng/1.5.14 -I/usr/local/Cellar/libpng/1.5.14/include" LDFLAGS="-L/usr/local/Cellar/libpng/1.5.14 -L/usr/local/Cellar/libpng/1.5.14/lib" --prefix=/usr/local/Cellar/imagemagick/6.8.8-1

然后等待运行结果：

> ...
> DELEGATES       = bzlib mpeg freetype png xml zlib

当看到上面最后一行中包含了png则说明解码器找到了。然后再运行：

    $ make && make install

安装成功后就可以使用之前的脚本自动生成不同尺寸的图标了。

-EOF-

[Cordova]: http://cordova.apache.org/
[PhoneGap]: http://phonegap.com/