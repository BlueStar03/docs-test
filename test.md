---
layout: default
title: "Test Markdown Document"
description: "A full-coverage sample exercising CommonMark, GFM, and common extensions."
author: "zBuLe"
date: 2026-05-21
tags: [test, markdown, sample]
draft: false
---

# This is an h1 tag

## This is an h2 tag

### This is an h3 tag

#### This is an h4 tag

##### This is an h5 tag

###### This is an h6 tag

## This heading has 1 id {#my_id}

## This heading has 2 classes {.class1 .class2}

## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

~~This text will be strikethrough~~

## List

## Unordered List

- Item 1
- Item 2
  - Item 2a
  - Item 2b

### Ordered List

1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b

## Images

![GitHub Logo](https://placehold.co/120x80)  
Format: ![Alt Text](https://placehold.co/64x64)

## Links

https://github.com - automatic!
[GitHub](https://github.com)

## Blockquote

As Kanye West said:

> We're living the future so
> the present is our past.

> [!NOTE]
> This is a note blockquote.

> [!WARNING]
> This is a warning blockquote.

## Horizontal Rule

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

## Inline Code

I think you should use an
`<addr>` element here instead.

## Fenced code block

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

```javascript {.class1 .class}
function add(x, y) {
  return x + y
}
```

```javascript {.line-numbers}
function add(x, y) {
  return x + y;
}
```

## Task List

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

## Tables

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

colspan `>` or `empty cell`

| a | b |
|---|---|
| > | 1 |
| 2 ||

rowspan `^`

| a | b |
|---|---|
| 1 | 2 |
| ^ | 4 |

## Emoji and FontAwsome

:smile:
:fa-car:

## Format extentions

H~2~O

30^th^

Content [^1]

[^1]: Hi! This is a footnote

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium
The HTML specification
is maintained by the W3C.

==marked==

> [!WARNING]
> Default title (capitalized from type).

> [!WARNING] Custom Title
> Overrides the default title.

> [!WARNING] Use `npm install` first
> Inline formatting (code, bold, italic) is preserved in the title.

> [!WARNING] ""
> No title row at all — just content with the colored border and background. `code`

---

## file code

```javascript
const animals = ["fox", "owl", "otter", "lynx"];
const pick = animals[Math.floor(Math.random() * animals.length)];

console.log(`Random animal: ${pick}`);
```
{: file='an_imal-Pick.js'}



```javascript
const animals = ["fox", "owl", "otter", "lynx"];
const pick = animals[Math.floor(Math.random() * animals.length)];

console.log(`Random animal: ${pick}`);
```
{: file='example.js' window='linux' numbers='true' }
---