---
category: experience
title: 支付宝接口问题集
---

### 订单 ID 重复

测试[alipay-php-sdk](https://github.com/mytharcher/alipay-php-sdk)的时候由于搭建的测试环境比生产环境少实际订单数据，在通过 ID 自增创建新订单时，无法支付，并提示`TRADE_TOTALFEE_NOT_MATCH`错误。搜索错误代码后发现是测试环境的新订单 ID 与生产环境中已支付过的订单 ID 重复。

到这里明白为何订单 ID 一般不使用自增整型数据，而是用 UUID 的字符串。


### 『网络系统原因』报错

	抱歉，由于网络系统的原因，您暂时无法使用当前的服务，请稍候再使用 

出这个错误是因为网关地址需要加上`_input_charset`参数：

	https://mapi.alipay.com/gateway.do?_input_charset=utf-8
