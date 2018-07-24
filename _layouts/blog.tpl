---
layout: page

styles:
  - /assets/css/code/sunburst.css
  - /assets/css/blog.css
---

<div class="main">
	{{ content }}

	<footer>
		<p>&copy; Since 2012 <a href="https://yanjunyi.com/">yanjunyi.com</a></p>
	</footer>
</div>

<aside>
	<h2><a href="/"><i class="fa fa-home"></i></a> / <a href="/blog/">{{ site.blog.name }}</a><a href="/blog/feed.xml" class="feed-link" title="Subscribe"><i class="fa fa-rss-square"></i></a></h2>
	<nav class="block">
		<ul>
		{% for category in site.blog.categories %}<li class="{{ category.name }}"><a href="/blog/category/{{ category.name }}/">{{ category.title }}</a></li>
		{% endfor %}
		<li class="discovery"><a href="/discovery/">日新月异</a></li>
		</ul>
	</nav>
	
	<form action="/search/" class="block block-search">
		<h3>搜索</h3>
		<p><input type="search" name="q" placeholder="输入关键词按回车搜索" /></p>
	</form>
	
	<div class="block block-about">
		<h3>关于</h3>
		<figure>
			{% if site.meta.author.gravatar %}<img src="{{ site.meta.gravatar}}{{ site.meta.author.gravatar }}?s=48" />{% endif %}
			<figcaption><strong>{{ site.meta.author.name }}</strong></figcaption>
		</figure>
		<p>由于经常造各种轮子，所以自诩为前端造轮子工程师。各种形式主义，工具癖，规划控，纠结帝……以及重度拖延症患者。</p>
	</div>
	
	<div class="block block-license">
		<h3>版权申明</h3>
		<p><a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/2.5/cn/" target="_blank" class="hide-target-icon" title="本站(博客)作品全部采用知识共享署名-非商业性使用-禁止演绎 2.5 中国大陆许可协议进行许可。转载请通知作者并注明出处。"><img alt="知识共享许可协议" src="https://i.creativecommons.org/l/by-nc-nd/2.5/cn/88x31.png" /></a></p>
	</div>
	
	<div class="block block-thank">
		<h3>Powered by</h3>
		<p>
			<a href="https://disqus.com/" target="_blank" title="云评论服务">Disqus</a>,
			<a href="http://elf.js.org/" target="_blank">elf+js</a>,
			<a href="https://github.com/" target="_blank">GitHub</a>,
			<a href="https://www.google.com/cse/" target="_blank" title="自定义站内搜索">Google Custom Search</a>,
			<a href="https://en.gravatar.com/" target="_blank" title="统一头像标识服务">Gravatar</a>,
			<a href="https://highlightjs.org/">HighlightJS</a>,
			<a href="https://github.com/mojombo/jekyll" target="_blank">jekyll</a>,
			<a href="https://github.com/mytharcher/SimpleGray" target="_blank">SimpleGray</a>
		</p>
	</div>
</aside>

{% include scripts.tpl %}
