---
category: experience
title: JavaScript 日期相关问题
---

### 日期对象对象的 `parse` 方法和时区问题 ###
	
	// Chrome old version
    Date.parse('2015-07-31'); // 1438272000000 
    new Date('2015-07-31').valueOf(); // 1438272000000
    new Date('2015', '07', 0).valueOf(); // 1438300800000

    // Chrome 53
    Date.parse('2015-07-31'); // 1438300800000 
    new Date('2015-07-31').valueOf(); // 1438300800000
    new Date('2015', 7, 0).valueOf(); // 1438272000000
    new Date('2015', '07', 0).valueOf(); // 1438272000000
    new Date('2015', 6, 0).valueOf(); // 1435593600000

### Sequelize migration 时区

在 seed 数据中插入的条目如果有日期相关字段，使用 `new Date()` 来设置字段值会得到正确的时间（经过时差偏移计算），而直接使用字符串 `2016-06-16` 形式的值得到的结果会产生时区偏移。

这篇文章里有关于 JavaScrpit 时区问题的详解：[关于“时间”的一次探索](https://segmentfault.com/a/1190000004292140)。
