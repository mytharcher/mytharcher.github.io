<head>
<title>{% if page.title %}{{ page.title }} - {% endif %}{{ site.name }}</title>
<meta charset="utf-8" />
<meta name="author" content="{{ site.meta.author.name }}" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="icon" href="/favicon.png" type="image/x-icon" />
<link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
<link href="https//{{ site.host }}/blog/feed.xml" rel="alternate" title="{{ site.blog.name }}" type="application/atom+xml" />
<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" />
<link rel="stylesheet" href="/assets/css/common.css" />
{% for style in layout.styles %}<link rel="stylesheet" type="text/css" href="{{ style }}" />
{% endfor %}
{% for style in page.styles %}<link rel="stylesheet" type="text/css" href="{{ style }}" />
{% endfor %}
</head>