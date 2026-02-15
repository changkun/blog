---
date: 2021-01-06T00:00:00
title: "Creating A Window"
---

如何使用 Go 创建一个窗口？macOS 有 Cocoa、Linux 有 X11，但访问这些 API 似乎都需要
引入 Cgo，可不可以不实用 Cgo？一些现有的 GUI 库或这图形引擎：

GUI 工具包:

- https://github.com/hajimehoshi/ebiten
- https://github.com/gioui/gio
- https://github.com/fyne-io/fyne
- https://github.com/g3n/engine
- https://github.com/goki/gi
- https://github.com/peterhellberg/gfx
- https://golang.org/x/exp/shiny

2D/3D 图形相关:

- https://github.com/llgcode/draw2d
- https://github.com/fogleman/gg
- https://github.com/ajstarks/svgo
- https://github.com/BurntSushi/graphics-go
- https://github.com/azul3d/engine
- https://github.com/KorokEngine/Korok
- https://github.com/EngoEngine/engo/
- http://mumax.github.io/

这里有一小部分：

https://github.com/avelino/awesome-go#gui

大部分人的做法是使用 glfw 和 OpenGL，这是一些需要使用到的库（Cgo 绑定）：

- https://github.com/go-gl/gl
- https://github.com/go-gl/glfw
- https://github.com/remogatto/egl

这里面有一些相对底层一些的，比如 X 相关:

- X 绑定：https://github.com/BurntSushi/xgb
- X 窗口管理：https://github.com/BurntSushi/wingo

比如 macOS 上如果需要用到 Metal：

- https://dmitri.shuralyov.com/gpu/mtl

像是前面的 GUI 工具中的 ebiten，在 windows 上已经不需要 Cgo 了，做法似乎是将窗口管理相关的
DLL 直接打包进二进制，然后走 DLL 动态链接调用。

除了 GLFW 之外，还有相对重一些的 SDL：

- https://github.com/veandco/go-sdl2

一些基本名词之间的关系：

```
Unix:      上帝
BSD:       类 Unix，伯克利分发，两种传统风味的 Unix 之一
System V:  AT&T 开发，两种传统风味的 Unix 之一
Linux:     新鲜风味的类 Unix
POSIX:     尝试减少实现差异的标准
Darwin:    苹果的开源类 Unix 内核 XNU
Mach-O:    Darwin 混合的微内核，CMU 开发
```

![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Unix_history-simple.svg/2560px-Unix_history-simple.svg.png)

> By Eraserhead1, Infinity0, Sav_vas - Levenez Unix History Diagram, Information on the history of IBM&#039;s AIX on ibm.com，CC BY-SA 3.0，https://commons.wikimedia.org/w/index.php?curid=1801948

关于 Wayland 的一些工具之间的关系：

```
X Window System == X11: MIT 开发的显示标准，GNOME、KDE 依赖的基础
Xorg:    X11 的官方实现
Wayland: 另一种显示服务器和客户端之间的通信协议，区别于 X11
EGL:     Wayland 客户端使用 EGL 来直接操作 framebuffer
libDRM:  EGL/X11 底层依赖的内核对 userspace 开放的 API
DRM:     内核级操作 framebuffer 的组件
```

![](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Wayland_display_server_protocol.svg/1920px-Wayland_display_server_protocol.svg.png)

> By Shmuel Csaba Otto Traian, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=28029855

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/The_Linux_Graphics_Stack_and_glamor.svg/2880px-The_Linux_Graphics_Stack_and_glamor.svg.png)

> By Shmuel Csaba Otto Traian, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=31768083

![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Linux_Graphics_Stack_2013.svg/2880px-Linux_Graphics_Stack_2013.svg.png)

> By Shmuel Csaba Otto Traian, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=27858390

![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Free_and_open-source-software_display_servers_and_UI_toolkits.svg/2880px-Free_and_open-source-software_display_servers_and_UI_toolkits.svg.png)

> By Shmuel Csaba Otto Traian，CC BY-SA 3.0，https://commons.wikimedia.org/w/index.php?curid=27799196

所以通过 DRM 可以在 Linux 下直接操作 Frame Buffer 上，也就是 Direct Rendering Manager。相关的库有：

- https://github.com/NeowayLabs/drm

有了这个就可以在 Linux 上直接做纯 Go 的绘制了，从而消除对 C 遗产的依赖。
