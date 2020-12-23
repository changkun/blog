---
date: "2013-08-26 03:23:09"
toc: true
id: 105
slug: /posts/install-opencv-on-mac
aliases:
    - /archives/2013/08/105/
tags:
    - OpenCV
    - Mac
    - 运维
    - 计算机视觉
title: 在 Mac 中配置OpenCV
---

笔者初次配置Mac下的OpenCV过程中花了很多精力，出现了很多状况，这些状况在互联网上根本不存在统一说法甚至没有，关于Mac下的OpenCV的各类文献都年代久远且OpenCV更新换代较快导致它们都严重过期。本文则希望能够帮助初次配置OpenCV for Mac少走弯路。

本文平台：Macbook Air 2013 OS X 10.8.4, OpenCV 4.6.1

本文时间：2013-08-26

**方法已经过期, 可供观赏, 请不要模仿**

<!-- more -->

## 第一步：安装Xcode及关键组件

OpenCV在Mackintosh中的配置不同与windows，需要自行在Mac下编译OpenCV。首先我们要保证完整的安装好Xcode。之所以是要求完整，是因为在App Store中下载的Xcode很多组建并未安装成功，在菜单栏中：Xcode－Preferences－Downloads-Components，安装Command Line Tools，安装完成这个后我们才能在接下来的步骤（CMake阶段）顺利进行。

![](/images/posts/105/1.png)
![](/images/posts/105/2.png)

## 第二步：安装、配置Homebrew和cmake

经常使用Ubuntu的同志们都知道sudo apt-get install命令，Mac下知名的有Homebrew（http://brew.sh/）、Macport。Homebrew使用的是ruby比macport更为优越，因此我们安装Homebrew，打开Mac下的终端，输入：

``` bash
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

![](/images/posts/105/3.png)

安装完成后，继续输入：

``` bash
brew selfupdate
brew install cmake
```

## 第三步：编译与安装OpenCV

由于brew中的OpenCV做过调整，无法直接使用brew install opencv直接安装opencv，因此安装完cmake后，在官网（http://opencv.org/）上下载适用于Mac平台的源。管网上的下载对于新手来说或许具有迷惑性，有一个OpenCV for linux/Mac，还有一个 OpenCV for iOS（这个适用于在iOS平台上的开发），我们是Mackintosh自然选择前者。

![](/images/posts/105/4.png)

解压完成后会看到上图所展示的文件夹，在终端中使用cd和ls两命令配合进入该文件夹中，例如：我的opencv位于如图位置：

![](/images/posts/105/5.png)

在终端中，进入该目录下：(注意：由于我已经编译完成过，所以多了一个build文件夹)

![](/images/posts/105/6.png)

这时通过cmake来编译opencv：

``` bash
mkdir build
cd build
cmake -G "Unix Makefiles" ..
make
sudo make install
```

这时，来到目录：/usr/local/lib和/usr/local/include检查是否已经成功安装opencv的lib文件和头文件。

![](/images/posts/105/7.png)

这时我们可以看到，/usr/local/lib路径下已经包含了很多opencv的dylib文件，/usr/local/include中包含了opencv和opencv2两个文件夹。说明我们已经成功安装好opencv。

## 第四步：在Xcode中配置opencv

方法一（不推荐）：

![](/images/posts/105/8.png)

如果lib文件链接正确，我们会在xcode的左侧看到一个lib的文件夹。使用opencv需要配置头文件路径和lib文件：

配置lib：

![](/images/posts/105/9.png)

然后下下面的界面下按下键盘上的“/”键来手动输入路径：

![](/images/posts/105/10.png)
![](/images/posts/105/11.png)

很自然的我们要输入的路径为：/usr/local/lib

配置头文件路径：
如图所示，在Header Search Path中输入：/usr/local/include /usr/local/include/opencv /usr/local/include/opencv2

![](/images/posts/105/12.png)

至此，opencv的配置已经完毕。

下面我们来用代码测试是否成功：

``` c++
//
//  test.cpp
//
//  Created by 欧 长坤 on 13-8-16
//  Copyright (c) 2013年 欧 长坤. All rights reserved.

#include &lt;opencv2/opencv.hpp&gt;
#include &lt;iostream&gt;
using namespace std;
using namespace cv;

int main ()
{
    const char* imagepath = "/Users/ouchangkun/Documents/OpenCV/OpenCV项目/test_opencv/test_opencv/building.jpg";
    IplImage* img = cvLoadImage(imagepath);
    cvShowImage("hehe", img);
    cvWaitKey();

    return 0;
}
```

![](/images/posts/105/13.png)

方法二（推荐，方法二配置的时候笔者已经升级到Xcode5）：

在Build Settings中，

```
Search Paths:
Header Search Paths: /usr/local/include
Library Search Paths: /usr/local/lib
User Header Search Path: /usr/local/include /usr/local/include/opencv /usr/local/include/opencv2
```

```
Linking：
Other Linker Flags: -lopencv_core -lopencv_highgui -lopencv_imgproc
```

根据需求可添加：

```
-lopencv_core -lopencv_highgui -lopencv_imgproc -lopencv_legacy -lopencv_contrib -lopencv_calib3d -lopencv_features2d -lopencv_flann -lopencv_ml -lopencv_objdetect -lopencv_video
```

进一步，使用OpenCV2的各类函数时，C++库和opencv库编译不一致，需要将
(http://stackoverflow.com/questions/13461400/opencv-unresolved-symbols-name-mangling-mismatch-xcode)

C++ standard library:
libc++(C++ Standard Library)改为libstdc++(GNU C++ standard library)即可正常编译显示图片。
(libc++是一个苹果新写的c++标准库，用来支持最新的c++11标准，而OpenCV则不支持该库)。

丧心病狂各种配置恶心资料：

> 1. https://www.google.com.hk/search?newwindow=1&safe=strict&q=libc%2B%2B+libstdc%2B%2B&oq=libc%2B%2B+libstdc%2B%2B&gs_l=serp.3..0i19j0i8i30i19l2j0i5i30i19.4935.6068.0.6342.5.5.0.0.0.0.214.684.0j4j1.5.0....0...1c.1.27.serp..0.5.682.5wZ0Sx1X6Bk
> 2. http://www.cnblogs.com/wellbye/archive/2013/04/25/3039203.html
>    http://tech.enekochan.com/2012/05/21/use-opencv-in-xcode-4-for-a-mac-os-x-application/
>    http://stackoverflow.com/questions/13461400/opencv-unresolved-symbols-name-mangling-mismatch-xcode
> 3. http://www.baidu.com/s?tn=baiduhome_pg&ie=utf-8&bs=xcode+%23include+%3Cunordered_map%3E&f=8&rsv_bp=1&rsv_spt=1&wd=xcode+unordered_map&rsv_sug3=12&rsv_sug=1&rsv_sug4=1438&inputT=5078
> 4. http://blog.csdn.net/china_lzn/article/details/8279444
>    http://www.baidu.com/s?wd=unordered_map+file+not+found&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baiduhome_pg&rsv_n=2&rsv_sug3=12&rsv_sug1=4&rsv_sug4=2107
>    http://www.cplusplus.com/reference/unordered_map/unordered_map/find/