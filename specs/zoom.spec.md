# Should zoom

```md
text

# 1

text

## 1.1|

text

# 2

text
```

- execute: `obsidian-zoom:zoom-in`

```md
text #hidden
 #hidden
# 1 #hidden
 #hidden
text #hidden
 #hidden
## 1.1|

text

# 2 #hidden
 #hidden
text #hidden
```

# Reproduce steps for #39

```md
# h1|

# h2
```

- execute: `obsidian-zoom:zoom-in`
- keydown: `ArrowDown`
- replaceSelection: `a`
- replaceSelection: `b`
- replaceSelection: `c`

```md
# h1
abc|
# h2 #hidden
```
