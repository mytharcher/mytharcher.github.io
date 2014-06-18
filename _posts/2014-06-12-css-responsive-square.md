---
layout: post
title: CSS百分比自适应正方形
category: experience
tags: [CSS, 百分比, 自适应, 正方形]

---

当遇到不确定宽高图片要统一风格显示最好的办法就是处理成正方形，就像Instagram。但是如何用CSS的方式得到一个不确定宽度的正方形容器就成了问题，尤其是要适应响应式的设计里。

后来到群里从小罗那问到了答案：**用`padding`属性来处理**。看例子：

<style type="text/css">
.figure-list{
    margin: 0;
    padding: 0;
}
.figure-list:after{
    content: "";
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
    visibility: hidden;
}
.figure-list li{
    list-style: none;
    float: left;
    width: 23.5%;
    margin: 0 2% 2% 0;
}
.figure-list figure{
    position: relative;
    width: 100%;
    height: 0;
    overflow: hidden;
    margin: 0;
    padding-bottom: 100%; /* 关键就在这里 */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.figure-list figure a{
    display: block;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
}
</style>
<ul class="figure-list">
    <li>
        <figure style="background-image:url(http://1.su.bdimg.com/skin/19.jpg)">
            <a href="#"></a>
        </figure>
    </li>
    <li>
        <figure style="background-image:url(http://5.su.bdimg.com/skin/3.jpg)">
            <a href="#"></a>
        </figure>
    </li>
</ul>

    <style type="text/css">
    .figure-list{
        margin: 0;
        padding: 0;
    }
    .figure-list:after{
        content: "";
        display: block;
        clear: both;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }
    .figure-list li{
        list-style: none;
        float: left;
        width: 23.5%;
        margin: 0 2% 2% 0;
    }
    .figure-list figure{
        position: relative;
        width: 100%;
        height: 0;
        overflow: hidden;
        margin: 0;
        padding-bottom: 100%; /* 关键就在这里 */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .figure-list figure a{
        display: block;
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
    }
    </style>
    <ul class="figure-list">
        <li>
            <figure style="background-image:url(http://1.su.bdimg.com/skin/19.jpg)">
                <a href="#"></a>
            </figure>
        </li>
        <li>
            <figure style="background-image:url(http://5.su.bdimg.com/skin/3.jpg)">
                <a href="#"></a>
            </figure>
        </li>
    </ul>

从例子里发现元素的`padding`的百分比数值是根据当前元素的宽度来计算的，于是可以利用这个特性来做一些特殊布局。正方形只是矩形的特殊形式，所以需要一定宽高比例的矩形也可以用这个方法。

-EOF-
