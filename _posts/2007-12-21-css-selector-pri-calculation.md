---
date: 2007-12-21 01:05:36
layout: post
title: CSS选择器优先级的数位计算法
category: experience
tags:
- css
- 优先级
- 数位计算法
---

最近在写css的时候，由于经常使用到很长的多级选择器，而碰到一些样式被覆盖或者覆盖不了的情况是相当的郁闷，所以专门花了一些时间对一些选择器做了对比测试。这里先说明一下，由于ie6不支持css2.0选择器，所以这些测试忽略了一些2.0的选择器和连接符，如伪类(:hover)，属性([type="text"])，子选择符(>)等，仅针对#id，.class，tag和空格连接符测试。

定义：

1. **CSS句子**：一个完整的选择器构成一个CSS句子，如.abb #cd div.class。而用逗号连接的算作多个句子的省略定义方法。
2. **CSS单词**：CSS句子中任何一个#id或.class或tag都算作一个CSS单词，虽然照以前的理解一般把tag#id.class1.class2整个看作一个单词，但是在本文讨论范围内，这个只能算作一个由4个单词组成的词组。
3. **优先级**：对于选择到同一个元素的两个CSS句子，当他们定义该元素的同一个属性时，如果其中一个写在前而不会被写在后面的覆盖这个属性，那么就称这个CSS句子的优先级高于另一个。而当2个CSS句子互相调换在代码中的位置都是后面的覆盖前面的属性时，称这两个CSS句子有相同的优先级。

测试用dom：

	<div id="div">
		<div id="test1" class="test test1">1第一行<br>第二行<br>自身</div>
		<div id="test2" class="test test2">2第一行<br>第二行<br>自身</div>
		<div id="test3" class="test test3">3第一行<br>第二行<br>自身</div>
		<div id="test4" class="test test4">4第一行<br>第二行<br>自身</div>
		<div id="test5" class="test test5">5第一行<br>第二行<br>自身</div>
		<div id="test6" class="test test6">6第一行<br>第二行<br>自身</div>
		<div id="test7" class="test test7">7第一行<br>第二行<br>自身</div>
		<div id="test8" class="test test8">8第一行<br>第二行<br>自身</div>
	</div>

这里先给出8组选择器，每组两个，各位同学可以先想一想每组里面哪个选择器的优先级高：

	#test1{height:2em;}
	.test1{height:1em;}

	.body #test2{height:1em;}
	#test2{height:2em;}

	#test3{height:1em;}
	div .test3{height:2em;}

	.body #test4{height:2em;}
	body #test4{height:1em;}

	html #test5{height:2em;}
	body #test5{height:1em;}

	#body #test6{height:1em;}
	.html #test6{height:2em;}

	html #body #test7{height:1em;}
	.html .body #test7{height:2em;}

	#html.html .body #test8{height:1em;}
	.html #body.body #test8{height:2em;}

现在公布答案：

1. 仅一个选择器单词的时候`#id`高于`.class`应该不用说了；
2. `div#test2`比`#test2`多了一个单词，那么多一个单词的优先级高，这里可以暂时理解成多一个单词就选择的更精确；
3. 同样多一个单词，但其中一个有`#id`选择，则`#test3`要高于`div .test3`；
4. `.body #test4`高于`body #test4`，暂时可理解为同样多层级时，`.class`高于`tag`；
5. `html #test5`与`body #test5`有同样的优先级，先写的会被覆盖，这里猜测同样的层级数，优先级与层级跨越的深度无关；
6. `#body #test6`高于`.html #test6`，理解为`#id`优于`.class`也与层级深度无关；
7. 最后两个比较有难度了，但浏览器下的结果是`html #body #test7`高于`.html .body #test7`，怎样理解我先不说；
8. `#html.html .body #test8`与`.html #body.body #test8`同级。

其实越到后面，应该越是能看出一种模糊的规则来。经过我反复的分析，最终从模糊的感觉中发现了其中的奥秘，或者说是一种说得通的解释：

把css句子的单词组成定义为“数位”，像个十百位的数字一样，css中不同的单词代表不同的权重数位，分别是`#id`，`.class`，`tag`三个数位依次从高到低排列，组成了相当于十进制数字的百位，十位，个位。再把每个css句子中个各种单词的个数代入到刚刚划分的数位里，就可以得到一个类似于十进制数字的三位数，只是在css的优先级数位里，没有进位的概念，无数个低位单词也还是低于一个高位的单词。从而结论就是，**按`#id`，`.class`，`tag`的数位统计了css的单词个数并代入各个数位后，只要比较两个css数字的大小(从高位到低位依次比较)，就能得出两个css的优先级**。

用这个规则重新比较一遍前面的例子：

1. 1,0,0>0,1,0
2. 1,1,0>1,0,0
3. 0,1,1<1,0,0
4. 1,1,0>1,0,1
5. 1,0,1=1,0,1
6. 2,0,0>1,1,0
7. 2,0,1>1,2,0
8. 2,2,0=2,2,0

用这个方法很容易就能比较出最后两组例子的优先级，对于前述的一些情况也可以做出合理的解释，所以在没有更好的css选择器解释方法之前，这个**数位计算法**是非常方便且容易理解的。

-EOF-
