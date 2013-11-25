---
layout: post
title: 写了两个jekyll插件，算是Ruby初体验
category: experience
tags: [Ruby, jekyll, 插件, Markdown, 压缩]
---

周末无聊继续折腾[jekyll][]，越来越发现[GitHub][]上很多Ruby的东西。尤其是jekyll，我一直在找一些有用的插件，却一点都看不懂那些代码。比如昨天看到官方的插件列表里有[Markdown references][]，用来将所有引用链接放在一个文件里统一管理。这个早就想用，于是就下过来看看，结果很容易就没跑起来。插件的代码很短，但是对于完全不认识的Ruby，都看了几遍也发现不了问题。然后就先搁置了，又想到找另一个可以用来压缩jekyll输出的HTML，JS和CSS的插件，搜了很多贴果断没有合适的，为此我还去项目主页顶了一个Issue（[#476](https://github.com/mojombo/jekyll/issues/476)）。于是作为一个程序员脑子里立马就不安分的产生了**自己去写一个的邪念**！当然直接的后果就是周末两天都耗费在连注释加起来不到100行的Ruby代码上了，不过顺便算是入门级学习了Ruby，也把jekyll的代码看明白了大半。

好了，不废话，介绍下这两个新手级的插件。

### Markdown reference

先上原著地址：[Markdown references][] by [olov](https://github.com/olov)

作者说放个`_references.md`在根目录，然后把所有文章里的引用链接全改到这个文件里就OK了，可是我始终run不起来。然后就一边看jekyll里的写法，一边觉得作者把追加Markdown引用部分放在所有转换器里的处理方式不科学，于是直接操刀大改了实现的代码结构，把处理过程放到了Markdown专用的转换器层级。另外还发现如果`_reference.md`中没有留首尾空行的话，可能由于追加的时候和之前的内容并在一起而得不到正确的处理，于是在程序里强制对引用部分加了首尾的分隔空行。这些问题都搞定以后我写的第一个Ruby程序就完成了，当然同时也完成了第一个jekyll的插件。

<script src="https://gist.github.com/2758753.js?file=references.rb"></script>

使用的话就把这个文件放到jekyll的`/_plugins`文件夹下，同时在根目录创建一个名为`_references.md`的Markdown文件，然后所有的引用链接就可以都在里面只写一次就都能被所有文章引用了，的确很方便。

### 静态文件压缩器

这也是一个之前找了很久都没有合适的插件，特别针对JS，很多人写的不是要另换个目录生成压缩后的文件，就是要生成的时候用另一个压缩版本的URL来代替原来的写法，要压缩HTML的话更是找不到。个人觉得很不科学，对于压缩来说本来就应该是上线过程的一个类似于编译的步骤，首先不应该打破源码的写法，然后生成也没有必要换其他的目录。于是根据自己的想法又写了这个。

<script src="https://gist.github.com/2758691.js?file=compressor.rb"></script>

由于里面有对JS的压缩，也找了一个第三方库[packr](https://github.com/jcoglan/packr)来辅助实现。使用的话也是直接引入到`/_plugins`目录，所有HTML和JS文件就在输出时自动压缩掉了。

另外说说有关Ruby初体验的感觉。

在之前已经跟Ruby遭遇过两次，一次是第一次在本地运行jekyll，这就要装Ruby，然后发现由于被墙而下不全gem导致各种诡异的问题。第二次是想用[JSDuck][]来生成[jslib][]的API文档，但也由于Ruby以及作者导致的中文问题纠结了很久，直到后来花了近两个星期通过Issue（[#145](https://github.com/senchalabs/jsduck/issues/145)）推动作者解决。但这两次都从未动过一行Ruby代码。

这次真要逼到自己去写，于是在网上学了个入门。以前没仔细看的时候觉得Ruby的语法太奇怪，但这次通过实践学习下来觉得其中还是有很多语法是不错的，甚至比JS还简单有趣。

比如class的面向对象和module混入的写法，直接表示大爱，这个特性简直就像星际2里面强大的神虫混元体！可惜JS不能通过这样的申明来完成，而只能写语句，而且`extend()`这种写法的函数还不是原生提供的。

另外对于Ruby里函数式的写法也觉得很有意思，调用一个函数可以不写大多数语言的参数集符号`()`，而是可以像写一句话一样：

	load something, specify type

什么感觉？翻译过来应该是这样：

	load(something, specify(type))

而且迭代用大括号的表达式也非常方便：

	sum = 0
	[1..100] {|x| do sum += x}

唯一觉得不舒服的就是定义函数以及逻辑代码块不是用大括号分隔，而是要写字母`def`和一大堆`end`，始终让我这种从开始就接受C/Java代码风格教育的程序员感觉非常不安全，而且多用2空格缩进，很容易就看不清对齐了没有，好在Sublime Text很智能的在写`end`的时候自动缩进了。但是打`end`总要三个键，不如在开始的时候顺手两个成对的空格舒服方便，是否配对的问题在写习惯了以后也不用过脑。不过这个问题很可能也是因为我还不习惯这种DSL方式的编程，要是习惯了应该也挺舒服。

总的来说Ruby这门语言设计的还是很不错的，兼有面向对象和函数式编程的各种优点，而又考虑了很多DSL的写法，给人很流畅很舒服的编程体验，比起Java甚至JS来说都可以更少的陷入计算机的逻辑思考方式里。以我两天就可以写实际代码的水平来看，原来学一门新的语言真的不难。

---

## Update

**2012-05-22:**

0. [Markdown references][]的原著插件问题原因搞明白了，就是对文件结尾没有启新行的话，追加的引用部分会合并到之前的最后一行里，导致无法解析为引用链接。
0. 昨天上传到GitHub上以后发现插件没起作用，然后发了[Issue #557](https://github.com/mojombo/jekyll/issues/557)去问，结果最后找到答案[Issue #325](https://github.com/mojombo/jekyll/issues/325)是GitHub上现在因为安全的原因在生成Jekyll页面的时候限制了所有的用户插件。这真是个悲剧，以后所有的插件都只能线下使用，而不能集成到GitHub Pages里了。

-EOF-

[Markdown references]: https://gist.github.com/961336

{% include references.md %}
