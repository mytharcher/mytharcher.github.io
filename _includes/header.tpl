<header>
	<h1>{% if page.title %}<a href="/blog/" class="minor">{{ site.blog.name }}</a> / {{ page.title }}{% else %}{{ site.blog.name }}{% endif %}</h1>
	{% unless page.title %}<p class="additional">{{ site.blog.desc }}</p>{% endunless %}
</header>
