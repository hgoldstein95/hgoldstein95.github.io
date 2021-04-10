---
layout: default
---

## Blog Posts

I spend a lot of my spare time exploring new and interesting topics (usually
in computer science, but occasionally in other areas). After I've spent time
and energy digesting information about a topic, a logical next step would be
to write down what I've learned. I thought a blog would be a nice way to
force myself to organize my thoughts, while simultaneously creating content
that others might find useful.

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