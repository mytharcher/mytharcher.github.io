---
layout: post
title: DOM元素所有样式属性表
category: experience
tags: [CSS, Firefox, 样式]
---

之前发现[elf+js][]中设置样式的一个bug，然后决定对所有css的样式属性设置和获取都加上单测case。这里先通过Firefox获得了一个全部元素支持的样式属性表，存下来备忘。

| Property Name | Value Type | Values |
|-|-|-|
| background-attachment | String | scroll, fixed |
| background-clip | String | border-box, padding-box, content-box |
| background-color | Color |
| background-image | URL |
| background-origin | String | padding-box, border-box, content-box |
| background-position | String, Number | |
| background-repeat | String | repeat, repeat-x, repeat-y, no-repeat |
| background-size | Number, String | cover, contain |
| border-bottom-color | Color | |
| border-bottom-left-radius | Number | |
| border-bottom-right-radius | Number | |
| border-bottom-style | String | |
| border-bottom-width | Number | |
| border-collapse | String | collapse, separate |
| border-left-color | Color | |
| border-left-style | String | |
| border-left-width | Number | |
| border-right-color | Color | |
| border-right-style | String | |
| border-right-width | Number | |
| border-spacing | Number | |
| border-top-color | Color | |
| border-top-left-radius | Number | |
| border-top-right-radius | Number | |
| border-top-style | String | |
| border-top-width | Number | |
| bottom | Number | |
| box-shadow | Mix |
| caption-side | String | bottom, top |
| clear | String | none, both, left, right |
| clip | Function | |
| color | Color | |
| content | Content | |
| counter-increment | Number | |
| counter-reset | String | |
| cursor | String | |
| direction | String | |
| display | String | none, block, inline, inline-block, etc. |
| empty-cells | String | hide |
| float | String | left, right, none |
| font-family | String | |
| font-size | Number | |
| font-size-adjust | String | |
| font-stretch | String | normal, wider, narrower, etc. |
| font-style | String | normal, italic, oblique |
| font-variant | String | normal, small-caps, inherit |
| font-weight | String, Number | normal, bold |
| height | Number | |
| ime-mode | String | auto, active, inactive, disabled |
| left | Number | |
| letter-spacing | Number | |
| line-height | Number | |
| list-style-image | URL | |
| list-style-position | String | inside, outside |
| list-style-type | String | disc, square, etc. |
| margin-bottom | Number | |
| margin-left | Number | |
| margin-right | Number | |
| margin-top | Number | |
| marker-offset | Number | |
| max-height | Number | |
| max-width | Number | |
| min-height | Number | |
| min-width | Number | |
| opacity | Number | |
| outline-color | Color |
| outline-offset | Number | |
| outline-style | String | dotted, dashed, solid |
| outline-width | Number | |
| overflow | String | auto, hidden, visible |
| overflow-x | String | auto, hidden, visible |
| overflow-y | String | auto, hidden, visible |
| padding-bottom | Number | |
| padding-left | Number | |
| padding-right | Number | |
| padding-top | Number | |
| page-break-after | String | auto, always |
| page-break-before | String | auto, always |
| pointer-events | String | auto, none |
| position | String | absolute, relative, static |
| quotes | String, Content | none |
| resize | String | none, both, horizontal, vertical |
| right | Number | |
| table-layout | String | fixed |
| text-align | String | left, right, center |
| text-decoration | String | none, underline |
| text-indent | Number | |
| text-overflow | String | ellipsis |
| text-shadow | Mix |
| text-transform | Mix |
| top | Number | |
| unicode-bidi | String | normal, embed, bidi-override |
| vertical-align | String | top, middle, baseline, bottom |
| visibility | String | visible, hidden |
| white-space | normal, nowrap |
| width | Number | |
| word-spacing | Number | |
| word-wrap | String | break-word |
| z-index | Number | |

其中以`-moz-`开头的FF私有属性暂时忽略掉了。后续需要测试常用属性表中的所有内容。

-EOF-

{% include references.md %}
