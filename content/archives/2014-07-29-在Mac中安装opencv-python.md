---
date: 2014-07-29 10:34:37
id: 159
path: source/_posts/2014-07-29-在Mac中安装opencv-python.md
tags:
  - OpenCV
  - Python
title: 在 Mac 中安装 opencv-python
---

前段时间手贱升级到了 Yosemite Developer Preview 版，实在是太费电，想降级，结果发现升级时没有备份，简直是残废= =，遂重装系统，隔了很久，今天才想起来还要装个OpenCV（惭愧…很久没写OpenCV了…），这学期一直在写Python，Python快速开发简直赞，所以想用Python来些OpenCV了……

不觉发现OpenCV已经更新到2.4.9了，遂看了一上午的OpenCV的官方文档，对比了一下Python和C++的接口，感觉很不错。
不过安装教程也是奇葩，好像万年不更新了…

好吧进入正题，下面是傻瓜式的安装教程

如果你已经有了CMake环境，那么直接跳到第3步

### 1、安装Homebrew(类似于Ubuntu的apt-get)

``` bash
ruby -e &quot;$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)&quot;
```

### 2、安装CMake

``` bash
brew install cmake
```

### 3、安装OpenCV

在下载的OpenCV源码文件夹内，执行如下命令，如果CMake有错，那么请安装Xcode中的Command Line Tools(Xcode5以后的版本自带了，如果Xcode都没有你怎么会想到安装OpenCV..orz)：

``` bash
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D BUILD_PYTHON_SUPPORT=ON -D BUILD_EXAMPLES=ON ..
make
sudo make install
```

### 4、配置Python路径

在~目录下

``` bash
vim .bash_profile
```

在.bash_profile中添加，其中python2.7视个人python版本而定。

``` bash
export PYTHONPATH=/usr/local/lib/python2.7/site-packages/
```

保存，在~目录下执行下面命令:

``` bash
source .bash_profile
```