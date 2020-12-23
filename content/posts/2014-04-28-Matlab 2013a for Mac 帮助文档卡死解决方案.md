---
date: "2014-04-28 20:12:27"
toc: true
id: 155
slug: /posts/matlab-2013a-for-mac-hanging-issue
aliases:
    - /archives/2014/04/155/
tags:
    - Matlab
    - Mac
title: Matlab 2013a for Mac 帮助文档卡死解决方案
---

有两种方法，不过都有自己的缺点。

方法1：
R2013a在命令窗口中输入: 

``` matlab
com.mathworks.mlwidgets.html.HtmlComponentFactory.setBrowserProperty('JxBrowser.BrowserType','Mozilla15');
```

缺点：会使得Menubar菜单消失。

<!-- more -->

如果想还原运行的上面命令：

``` matlab
com.mathworks.mlwidgets.html.HtmlComponentFactory.setBrowserProperty('JxBrowser.BrowserType','Safari');
```

方法2：
在防火墙中禁止matlab访问网络，这样不需要任何改动就可以避免帮助文档卡死。
缺点：需要matlab进行网络访问则会失效。