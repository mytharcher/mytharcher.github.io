---
layout: blog
pageClass: page-type-post
---

<div class="trace">/ <a href="/blog/">{{ site.blog.name }}</a> / {{ page.title }}</div>

<article>
	<h1><a href="{{ page.url }}">{{ page.title }}</a></h1>
	{% assign post = page %}
	{% include meta.tpl %}
	{{ content }}
	{% capture permaurl %}{{site.origin}}{{ page.url }}{% endcapture %}
	<p class="permalink">永久链接：<a href="{{ permaurl }}">{{ permaurl }}</a></p>
</article>
<div id="disqus_thread" class="comments"></div>

<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7015804927845255"
     data-ad-slot="7629180734"
     data-ad-format="auto"></ins>
