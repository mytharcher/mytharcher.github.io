---
category: experience
title: node.js DES 加密
---

~~~
function cipher (buffer, key) {
	var cip = crypto.createCipheriv('des-cbc', key, key);
	var result = cip.update(buffer);
	result += cip.final('base64');
	return result;
}
~~~

[nodejs和java中的des/3des加密解密](http://mygo.iteye.com/blog/2018882)
