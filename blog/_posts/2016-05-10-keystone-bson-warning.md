---
category: experience
title: Keystone bson warning 问题
---

在 0.3.19 下启动程序就报错：

~~~
{ Error: Cannot find module '../build/Release/bson'
    at Function.Module._resolveFilename (module.js:438:15)
    at Function.Module._load (module.js:386:25)
    at Module.require (module.js:466:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/Users/mytharcher/work/outsourcing/keruyun/web/node_modules/mongoose/node_modules/bson/ext/index.js:15:10)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:456:32)
    at tryModuleLoad (module.js:415:12)
    at Function.Module._load (module.js:407:3)
    at Module.require (module.js:466:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/Users/mytharcher/work/outsourcing/keruyun/web/node_modules/mongoose/node_modules/bson/lib/bson/index.js:3:24)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:456:32) code: 'MODULE_NOT_FOUND' }
js-bson: Failed to load c++ bson extension, using pure JS version
~~~

搜到 mongoose 这个 issue [2285](https://github.com/Automattic/mongoose/issues/2285#issuecomment-218196162) 解决了问题。原因是 mongoose 依赖的 bson 包有问题，可以通过更新版本来解决。Keystone@0.3.9 对 mongo 和 mongoose 的依赖比较老，而 0.4.0 还是 alpha 没有发布到 npm，所以可以依照帖子里来解决。
