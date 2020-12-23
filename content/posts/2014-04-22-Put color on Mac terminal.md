---
date: 2014-04-22 13:41:23
id: 154
path: source/_posts/2014-04-22-Put color on Mac terminal.md
tags:
  - Vim
  - Mac
title: Put color on Mac terminal
---

Mac中的ls命令可以使用-G参数彩色化输出的文件列表，需要配置LSCOLORS环境变量定义颜色，具体配置方法可以输入man ls查看。

不过，我查到这篇文章：[http://linfan.info/blog/2012/02/27/colorful-terminal-in-mac/](http://linfan.info/blog/2012/02/27/colorful-terminal-in-mac/)
这篇文章的博主推荐安装Linux使用的GNU Coreutils替换Mac的ls命令，因为：
    Coreutils提供了配置工具，定义颜色代码更加方便；
    Coreutils包含的不仅仅是ls，同时作为Linux用户，他更习惯于使用GNU的各种shell工具。
（好吧，其实我也是一样）

Coreutils的安装与配置方法如下：
    通过Homebrew安装Coreutils

``` bash
brew install xz coreutils 
```

    注：Coreutils并不依赖于xz，但它的源码是用xz格式压缩的，安装xz才能解压。
生成颜色定义文件

``` bash
gdircolors --print-database &gt; ~/.dir_colors
```

在~/.bash_profile配置文件中加入以下代码

``` bash
if brew list | grep coreutils &gt; /dev/null ; then
  PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
  alias ls='ls -F --show-control-chars --color=auto'
  eval `gdircolors -b $HOME/.dir_colors`
fi
```

gdircolor的作用就是设置ls命令使用的环境变量LS_COLORS（BSD是LSCOLORS），我们可以修改~/.dir_colors自定义文件的颜色，此文件中的注释已经包含各种颜色取值的说明。

grep高亮显示关键字:
这个很简单，加上--color参数就可以了，为了使用方便，可以在~/.bash_profile配置文件中加上alias定义。

``` bash
alias grep='grep --color'
alias egrep='egrep --color'
alias fgrep='fgrep --color'
```

Vim语法高亮:
在Vim中输入命令:syntax on激活语法高亮，若需要Vim启动时自动激活，在~/.vimrc中添加一行syntax on即可。
不过，我还再.vimrc里面加了其他参数：

``` bash
set tabstop=4
set softtabstop=4
set ts=4
set expandtab
set autoindent
set nu
```