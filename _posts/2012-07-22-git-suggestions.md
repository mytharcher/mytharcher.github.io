---
layout: post
title: Git使用规范建议
category: thinking
tags: [Git, 规范]
---

Git现在是越用越顺手了，甚至反过来svn都不会用了。但正因为git的灵活，尤其是使用分支及合并时非常灵活，很可能导致一起合作的人有不同的理解而产生冲突。所以我根据我个人的实践总结了一些使用规范的建议，整理如下。

## 分支规范 ##

前人已经总结了：[GIT分支管理是一门艺术](http://roclinux.cn/?p=2129)（原文：[A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)）。

![GIT分支管理](http://nvie.com/img/git-model@2x.png)

基本上参照这张图就可以了。

## 多人协作规范 ##

多人合作时比自己管理分支立马复杂了一个数量级，因为每人都会有一套分支结构，如果大家都遵循上一节分支规范还好，否则更加麻烦。

### 小团队集中式管理规范 ###

0.	除了上线过程任何时候保持本地`master`分支与仓库`master`分支同步（即每次开始开发前先同步`master`分支）：
	
		$ git checkout master     # 切换到master分支
		$ git pull origin master  # 更新master分支
	
0.	任何新功能的开发或bug修复都从本地的`master`分支`checkout`出一个新的临时功能分支来跟踪：
	
		$ git checkout -b feature-style                       # 从更新的master分支创建并切换至feature-style分支
		...(code dev)                                         # 开发代码
		$ git add path/to/modified/files                      # 标记修改的文件
		$ git commit -m "Adjust page style for xxx function." # 提交修改
	
0.	在本地测试完成后将当前临时分支合并到本地`dev`分支，并推送到仓库的`dev`分支自动部署到环境测试进行测试：
	
		$ git checkout dev                 # 切换到dev分支
		$ git pull origin dev              # 更新dev分支
		$ git merge --no-ff feature-style  # 将开发好功能的feature-style分支合并到dev分支
		$ git push origin dev              # 推送dev到仓库，将自动部署到test.youketu.com环境
	
	测试发现的任何问题要回到`feature-style`分支进行修改，然后再重复上述两步。
	
0.	在测试环境确认自己开发的功能OK以后，将功能临时分支合并到本地`master`分支，并推送到仓库，准备上线：
	
		$ git checkout master              # 切换到master分支
		$ git pull origin master           # 更新master分支（避免其他人上线的修改产生冲突）
		$ git merge --no-ff feature-style  # 将测试完成的分支合并入本地的master分支
		$ git push origin master           # 推送master到仓库，并通知线上服务器管理员进行pull上线

0.	线上服务器管理员登录服务器，更新代码完成上线。
	
0.	Bug修复的每一次提交都可以在注释信息里填写已关联在issues系统里的bug编号，如`git commit -m "Resolved #12. Fix admin style..."`，这样可以自动关闭系统中的Bug。
	
0.	`dev`分支只作为测试服务器自动部署用，任何情况下不再合并`dev`到`master`，这两个分支只通过各个开发者的临时功能分支间接产生交互，互不干扰。

### 开源项目分布式管理规范 ###

如果不是一个小团队可以达到内部高度规范和统一，那么大多数时候开源项目更适合使用Pull request的方式合作，这样的方式也更符合GitHub设计的精髓。

0.	分支基点
	
	Pull request永远使用主仓库的master（或dev，如果有）分支作为base，并新建一个`feature-xxx`或者`fix-xxx`分支进行开发，以保证不产生任何额外无关的commit造成合并困难。同时以此小步快跑的方式也能更大程度的保证分支的完整性和延续性，减少难以合并的分支。

0.	推送合并目标
	
	在发起pull request时，feature部分应对应到主仓库的dev分支，fix部分对应到master分支。

0.	代码评审
	
	Pull request必须经过主仓库成员code review，并由review人员完成合并。如果自己有主仓库的权限，又通过pull request进行代码分享，那么请不要自己完成合并，否则请直接推送到仓库。

0.	处理期限
	
	每个pull request的处理期限暂定为14天，超过2周并无人review的request任何有权限的用户（主仓库成员或自己）可以进行关闭，以减少干扰。

以上列举了两种情况的管理方式，可根据项目和团队的具体情况选择使用。

-EOF-

{% include references.md %}
