---
date: 2014-03-09 16:55:50
id: 148
path: source/_posts/2014-03-09-Lua一日游：（5）Cocos2d-x与LuaScript.md
tags:
  - Lua
  - cocos2dx
title: Lua一日游:(5) cocos2dx 与 Lua
---

Cocos2d-X.org是cocos2d-x的官网，我们可以在官网上下载到它的最新版本，据说现在正在测试的版本3.0相比2.0会有比较大的改动，所以我们这里直接下载的3.0版本。

下载完毕后，我们可以知道这样一个readme的文件，如图所示。

![](/images/posts/148/1.png)

这里面已经写好了如何去创建一个cocos2d-x的工程，所以我们按照他所说的，运行这个py脚本，得到一个新的窗口，如图所示。

![](/images/posts/148/2.png)

<!-- more -->

创建完成后，我们打开mac平台下的xcode工程文件，如图所示。

![](/images/posts/148/3.png)
![](/images/posts/148/4.png)

打开工程后，可以看到Xcode不支持lua的高亮形式，我们等会儿采用LDT进行lua脚本的编写，我们先尝试编译一下这个工程，因为是第一次编译，所以会花较长时间，如图。

![](/images/posts/148/5.png)
![](/images/posts/148/6.png)

我们把LDT的workspace切换到工程的目录下，然后删除掉Resources里面多余的文件。

![](/images/posts/148/7.png)
![](/images/posts/148/8.png)

删除完成后，我们使用LDT创建一个名为main.lua（ 写上一行代码：print("hello lua") ）的文件，并在Xcode里面更改调用的文件，可以看到在控制台处，输出了Lua的调用结果。

![](/images/posts/148/9.png)
![](/images/posts/148/10.png)

下面我们试一下使用cocos2d来添加一个文本到屏幕上，如图示。

![](/images/posts/148/11.png)
