<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="author" content="mytharcher" />
<meta name="keywords" content="{{ page.tags | join: ',' }}" />
<title>闭门造轮子{% if page.title %} / {{ page.title }}{% endif %}</title>
<link href="http://mytharcher.github.com/feed.xml" rel="alternate" title="闭门造轮子" type="application/atom+xml" />
<link rel="stylesheet" type="text/css" href="/assets/css/site.css" />
<link rel="stylesheet" type="text/css" href="/assets/css/code/github.css" />
{% for style in page.styles %}<link rel="stylesheet" type="text/css" href="{{ style }}" />
{% endfor %}
</head>

<body class="{{ page.pageClass }}">

<div class="main">
	{{ content }}

	<footer>
		<p>&copy; Since 2012 <a href="http://github.com/mytharcher" target="_blank">github.com/mytharcher</a></p>
	</footer>
</div>

<side>
	<h2><a href="/">闭门造轮子</a><a href="/feed.xml" class="feed-link" title="RSS订阅"><img src="http://blog.rexsong.com/wp-content/themes/rexsong/icon_feed.gif" alt="RSS feed" /></a></h2>
	
	<nav class="block">
		<ul>
		{% for category in site.custom.categories %}<li class="{{ category.name }}"><a href="/category/{{ category.name }}/">{{ category.title }}</a></li>
		{% endfor %}
		</ul>
	</nav>
	
	<form action="/search/" class="block block-search">
		<h3>搜索</h3>
		<p><input type="search" name="q" placeholder="输入关键词按回车搜索" /></p>
	</form>
	
	<div class="block block-about">
		<h3>关于</h3>
		<figure>
			<img src="http://www.gravatar.com/avatar/1cd8c12591616d8c22aaa624f8c07834?s=48" />
			<figcaption><strong>mytharcher</strong></figcaption>
		</figure>
		<p>由于经常造各种轮子，所以自诩为前端造轮子工程师。各种形式主义，工具癖，规划控，纠结帝……以及重度拖延症患者。</p>
	</div>
	
	<div class="block block-license">
		<h3>版权申明</h3>
		<p><a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/2.5/cn/" target="_blank" class="hide-target-icon" title="本站(博客)作品全部采用知识共享署名-非商业性使用-禁止演绎 2.5 中国大陆许可协议进行许可。转载请通知作者并注明出处。"><img alt="知识共享许可协议" src="http://i.creativecommons.org/l/by-nc-nd/2.5/cn/88x31.png" /></a></p>
	</div>
	
	<div class="block block-fork">
		<a href="http://github.com/mytharcher" class="hide-target-icon"><img src="https://a248.e.akamai.net/assets.github.com/img/30f550e0d38ceb6ef5b81500c64d970b7fb0f028/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub"></a>
	</div>
	
	<div class="block block-thank">
		<h3>Power by</h3>
		<p>
			<a href="http://disqus.com/" target="_blank" title="云评论服务">Disqus</a>,
			<a href="http://github.com/" target="_blank">GitHub</a>,
			<a href="http://www.google.com/cse/" target="_blank" title="自定义站内搜索">Google Custom Search</a>,
			<a href="http://en.gravatar.com/" target="_blank" title="统一头像标识服务">Gravatar</a>,
			<a href="http://softwaremaniacs.org/soft/highlight/en/">HighlightJS</a>,
			<a href="http://github.com/mojombo/jekyll" target="_blank">jekyll</a>
		</p>
	</div>
</side>

<script src="http://elfjs.googlecode.com/files/elf-0.3.3-min.js"></script>
<script src="/assets/js/site.js"></script>
<script src="/assets/js/highlight.js"></script>
<script src="/assets/js/hljs/languages/css.js"></script>
<script src="/assets/js/hljs/languages/xml.js"></script>
<script src="/assets/js/hljs/languages/javascript.js"></script>
<script src="/assets/js/hljs/languages/php.js"></script>
<script src="/assets/js/hljs/languages/ruby.js"></script>
{% for script in page.scripts %}<script src="{{ script }}"></script>
{% endfor %}

</body>
</html>