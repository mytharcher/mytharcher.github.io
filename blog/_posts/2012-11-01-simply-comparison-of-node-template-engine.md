---
layout: post
title: node模板引擎简单比较
category: thinking
tags: [模板, 模板引擎, jade, ejs, HAML, Mustache, CoffeeKup]
---

{% raw %}

node.js里选择模板引擎时看了大部分引擎的语法，简单做个对比。

## [jade](http://jade-lang.com/) ##

	doctype 5
	html(lang="en")
		head
		title= pageTitle
		script(type='text/javascript')
			if (foo) {
				bar()
			}
		body
		h1 Jade - node template engine
		#container
			if youAreUsingJade
			p You are amazing
			else
			p Get on it!

完全没有html了，代码比较像zencoding的风格，但是看着不舒服，pass！
	
## [ejs](http://embeddedjs.com/) ##

	<ul>
	<% for(var i=0; i<supplies.length; i++) { %>
		<li><%= supplies[i] %></li>
	<% } %>
	</ul>

为啥看见这个带`<%`和for语法的就懒得继续看下去了？不过好处是表达式和控制语法都是JavaScript的。

## [HAML](http://haml.info/) ##

	%section.container
		%h1= post.title
		%h2= post.subtitle
		.content
		= post.content

又一个不写HTML标签的模板，总觉得这么写学习成本太高。

## [Mustache.js](http://mustache.github.com/) ##

	<h1>{{header}}</h1>
	{{#bug}}
	{{/bug}}
	{{#items}}
		{{#first}}
		<li><strong>{{name}}</strong></li>
		{{/first}}
		{{#link}}
		<li><a href="{{url}}">{{name}}</a></li>
		{{/link}}
	{{/items}}
	{{#empty}}
		<p>The list is empty.</p>
	{{/empty}}

没有逻辑语句，看着最舒服干净的一个，没别的就他了！
	
## [CoffeeKup](http://coffeekup.org/) ##

	doctype 5
	html ->
		head ->
		meta charset: 'utf-8'
		title "#{@title or 'Untitled'} | A completely plausible website"
		body ->
		header ->
			h1 @title or 'Untitled'
			
			nav ->
			ul ->
				(li -> a href: '/', -> 'Home') unless @path is '/'
				li -> a href: '/chunky', -> 'Bacon!'
				switch @user.role
				when 'owner', 'admin'
					li -> a href: '/admin', -> 'Secret Stuff'
				when 'vip'
					li -> a href: '/vip', -> 'Exclusive Stuff'
				else
					li -> a href: '/commoners', -> 'Just Stuff'

要记住的符号元素太多了，有点Ruby风格。

{% endraw %}

-EOF-
