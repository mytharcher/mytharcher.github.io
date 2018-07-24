<!DOCTYPE html>
<html>
{% include head.tpl %}

<body class="{% if page.pageClass %}{{ page.pageClass }}{% else %}{{ layout.pageClass }}{% endif %}">

{{ content }}

{% include scripts.tpl %}
</body>
</html>
