---
layout: post
title: 恶心的CoffeeScript
category: criticism
tags: [CoffeeScript, JavaScript]
---

最近用到一个npm有新的需求本想改写下，但看了下是CoffeeScript写的，顿时胃口感觉被翻倒，恶心不打一处来。

从语法上用`->`这种符号来定义函数就开始觉得恶心，就如PHP里要用`->`作为成员访问运算符而`.`作为字符串连接运算符，`\`作为命名空间分隔符一样脑残。细节我不用继续说，去官方主页对比就知道差异了。多看几眼其实很明白这肯定是Ruby用户搞出来的语法，大多数跟Ruby里很像，比如函数调用时的参数和JSON的定义。

为了简化而产生一种新的语法必然增加学习成本，这其实不算什么大事。但关键的问题在于，这种新的语法并没有提供任何新的功能，<del>比如仍然不能通过一个关键字`class`就定义一个JS的“类”</del>（官网介绍了方法：<http://coffeescript.org/#classes>。但并仍不是语言级别的完美解决）。我这么说是因为和SASS/LESS之于CSS不同，CSS里没变量，没有可重复调用的类似宏的书写，所以CSS适合用LESS等来简化。而JS本身已经很简单了，这就使得增加的语法翻译过程特别的没有意义，每当我要写一个脚本文件的时候，我都要考虑如何加入一个翻译过程。是的，有人说那是你开发工具配置的不够好，可是我为什么还要多此一举去配置这个工具？尤其是当我使用不同工具去开发的时候，是不是每个工具都要去配置？我用记事本临时修改个JS怎么办？

刚好这也有篇国外大神们的讨论：[Rails 3.1里CoffeeScript包默认开启](https://github.com/rails/rails/compare/9333ca7...23aa7da)

其中TJ大神更是极端的指出：

> It's just laughable, I would never hire someone who wrote coffeescript, that's like hiring someone for client-side js that knows jQuery but nothing about the DOM

最后看来就是一帮Ruby程序员由于浏览器上不能写Ruby，然后把JS搞成Ruby一样的写法，何其蛋疼！JS就是JS！JS本身的写法已经很舒服很流畅，没有必要用别的语言的写法来重新写JS。所以这个时候我要坚持奥卡姆剃须刀原则，能少一样是一样。没简化多少JS的书写，却要折腾出很多麻烦的工具来进行翻译，这完全是把本来我的G点变成了痛点，不好意思，我不买账。

好了，吐不吐槽是我的事，用不用是你自己的事。
