---
layout: post
title: 数据可视化的设计和使用问题
category: thinking
---

现在数据可视化是非常时髦的技术，用以表现互联网大数据时代的各种数据，但有很多情况下使用可视化的产品没有过多的考虑要展示的数据的意义，所以总会有一些误用，在这里举一些例子，以便今后遇到不会犯同样的错误。

柱状图
----------

柱状图最主要的作用是查看分布情况，比如小学时候的数学课就教过用绘图纸画班级期末考分数分布图。而在分布情况中，横坐标（即与“柱”垂直的坐标）是有很大意义的，代表一定的顺序，而如果用数量来排序，反而会增加理解难度。举个反面例子：

<figure>
    <img src="http://mbed.qiniudn.com/yanjunyi.com/img/data-visualization-design-and-usage/umindex-android-version.jpg" />
    <figcaption><strong>【用法错误】</strong>不应该按照数量排序，而应该按照版本顺序排列</figcaption>
</figure>

饼状图
----------

饼状图主要是表现占有率，份额等。因为一个圆周刚好对应`100%`，所以用来显示一个集合里各个元素数量的比例非常合适。

<figure>
    <img src="http://mbed.qiniudn.com/yanjunyi.com/img/data-visualization-design-and-usage/umindex-social-sharing.jpg" />
    <figcaption>【用法正确】占比在饼图中的表达，其他的小份额扩展出来表示</figcaption>
</figure>

折线图
----------

展示一组数据的变化趋势，一般横坐标是跟时间相关。

暂无例子

面积图
----------

面积图是结合了折线图的趋势和饼图的占比合并出来的一种图表，主要表示集合中各元素数量占比的趋势变化。

<figure>
    <img src="http://mbed.qiniudn.com/yanjunyi.com/img/data-visualization-design-and-usage/umindex-ios-version.jpg" />
    <figcaption><strong>【用法正确】</strong>同时以元素在时间上的先后顺序排列，更易表达和理解</figcaption>
</figure>

3D 扩展
----------

当平面的不够表现更多相关数据维度时，可以扩展为 3D 形式。比如屏幕分辨率的占比情况，可以用长宽两个维度表示屏幕尺寸，而厚度作为第三个维度表示数量占比，再放按从小到大的顺序排在一起，统计结果就会非常直观。

<figure>
    <img src="http://mbed.qiniudn.com/yanjunyi.com/img/data-visualization-design-and-usage/baidu-tongji-resolution.jpg" />
    <img src="http://mbed.qiniudn.com/yanjunyi.com/img/data-visualization-design-and-usage/baidu-tongji-browser.jpg" />
    <figcaption>在这个 3D 例子上进行改进，每一块长方体的长宽利用起来表示分辨率的长宽将能达到更好的效果。甚至还可以设计成 3D 的饼图</figcaption>
</figure>

-EOF-
