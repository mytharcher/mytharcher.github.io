{% include header.tpl %}

{% for post in list %}
{% if post.category != 'works' %}
<article{% if forloop.index == 1 and preview %} content-loaded="1"{% endif %}>
	<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
	{% include meta.tpl %}
	<div class="article-content">
	{% if forloop.index == 1 and preview and post.layout == 'post' %}
		{{ post.content }}
	{% elsif forloop.index < 10 and post.excerpt %}
		{{ post.excerpt }}
	{% endif %}
	</div>
</article>
{% endif %}
{% endfor %}

{% if list == null %}
<article class="empty">
	<p>该分类下还没有文章</p>
</article>
{% endif %}