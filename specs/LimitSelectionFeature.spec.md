# Should limit selection on zooming in

- applyState:

```md
text

# 1|

text

## 1.1|

text

# 2

text
```

- execute: `obsidian-zoom:zoom-in`
- assertState:

```md
text #hidden
 #hidden
# 1 #hidden
 #hidden
text #hidden
 #hidden
|## 1.1|

text

# 2 #hidden
 #hidden
text #hidden
```

# Should limit selection when zoomed in

- platform: `darwin`
- applyState:

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
- keydown: `Cmd-KeyA`
- assertState:

```md
text #hidden
 #hidden
# 1 #hidden
 #hidden
text #hidden
 #hidden
|## 1.1

text
|
# 2 #hidden
 #hidden
text #hidden
```

# Should limit selection when zoomed in

- platform: `linux`
- applyState:

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
- keydown: `Ctrl-KeyA`
- assertState:

```md
text #hidden
 #hidden
# 1 #hidden
 #hidden
text #hidden
 #hidden
|## 1.1

text
|
# 2 #hidden
 #hidden
text #hidden
```

# Should not have bug #39

- applyState:

```md
# h1|

# h2
```

- execute: `obsidian-zoom:zoom-in`
- keydown: `ArrowDown`
- replaceSelection: `a`
- replaceSelection: `b`
- replaceSelection: `c`
- assertState:

```md
# h1
abc|
# h2 #hidden
```
