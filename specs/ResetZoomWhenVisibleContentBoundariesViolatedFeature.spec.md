# Should reset zoom when first boundary of visible content is violated

- applyState:

```md
text

|# 1

text
```

- execute: `obsidian-zoom:zoom-in`
- keydown: `Backspace`
- assertState:

```md
text
|# 1

text
```

# Should reset zoom when second boundary of visible content is violated

- applyState:

```md
# 1|

text

# 2

text
```

- execute: `obsidian-zoom:zoom-in`
- keydown: `ArrowRight`
- keydown: `ArrowDown`
- keydown: `ArrowDown`
- assertState:

```md
# 1

text
|
# 2 #hidden
 #hidden
text #hidden
```

- keydown: `Delete`
- assertState:

```md
# 1

text
|# 2

text
```
