<header>
	<h1>{% if page.title %}<a href="/" class="minor">{{ site.blog.name }}</a> / {{ page.title }}{% else %}{{ site.blog.name }}{% endif %}</h1>
	{% if page.title == null %}<p class="additional">{{ site.blog.desc }}</p>{% endif %}
</header>
