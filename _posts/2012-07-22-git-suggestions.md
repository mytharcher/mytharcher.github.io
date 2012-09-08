---
layout: post
title: Git使用规范建议
category: thinking
tags: [Git, 规范]
---

Git现在是越用越顺手了，甚至反过来svn都不会用了。但正因为git的灵活，尤其是使用分支及合并时非常灵活，很可能导致一起合作的人有不同的理解而产生冲突。所以我根据我个人的实践总结了一些使用规范的建议，整理如下。

## 分支规范

前人已经总结了：[GIT分支管理是一门艺术](http://roclinux.cn/?p=2129)（原文：[A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)）。

![GIT分支管理](http://nvie.com/img/2009/12/Screen-shot-2009-12-24-at-11.32.03.png)

基本上参照这张图就可以了。

## 多人协作规范

多人合作时比自己管理分支立马复杂了一个数量级，因为每人都会有一套分支结构，如果大家都遵循上一节分支规范还好，否则更加麻烦。

如果不是一个小团队可以达到内部高度规范和统一，那么大多数时候开源项目更适合使用Pull request的方式合作，这样的方式也更符合GitHub设计的精髓。

### 分支基点

Pull request永远使用主仓库的master（或dev，如果有）分支作为base，并新建一个`feature-xxx`或者`fix-xxx`分支进行开发，以保证不产生任何额外无关的commit造成合并困难。同时以此小步快跑的方式也能更大程度的保证分支的完整性和延续性，减少难以合并的分支。

### 推送合并目标

在发起pull request时，feature部分应对应到主仓库的dev分支，fix部分对应到master分支。

### 代码评审

Pull request必须经过主仓库成员code review，并由review人员完成合并。如果自己有主仓库的权限，又通过pull request进行代码分享，那么请不要自己完成合并，否则请直接推送到仓库。

### 处理期限

每个pull request的处理期限暂定为14天，超过2周并无人review的request任何有权限的用户（主仓库成员或自己）可以进行关闭，以减少干扰。

-EOF-

{% include references.md %}
