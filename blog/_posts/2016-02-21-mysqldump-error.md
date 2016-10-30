---
category: experience
title: mysqldump 报错
---

    Couldn't execute 'SHOW VARIABLES LIKE 'gtid\_mode'': Table 'performance_schema.session_variables' doesn't exist (1146)

    Couldn't execute 'SHOW VARIABLES LIKE 'gtid\_mode'': Native table 'performance_schema'.'session_variables' has the wrong structure (1682)

使用`mysql_upgrade`升级数据库表解决。

参考：[Mysqldump:performance_schema.session_variables不存在](http://b.aicode.cc/database/2015/12/12/mysqldump-performance_schema.session_variables不存在.html)
