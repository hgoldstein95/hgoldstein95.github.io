---
layout: default
---

## Blog Posts

<ul class="post-list">
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    {%- for post in site.posts -%}
        <li>
        <h3 style="display: inline-block;">
            <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
            </a>
        </h3>
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        {%- if site.show_excerpts -%}
            {{ post.excerpt }}
        {%- endif -%}
        </li>
    {%- endfor -%}
</ul>