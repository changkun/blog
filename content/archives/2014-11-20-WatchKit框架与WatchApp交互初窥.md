---
date: 2014-11-20 13:21:45
id: 169
path: source/_posts/2014-11-20-WatchKit框架与WatchApp交互初窥.md
tags:
  - Apple Watch
  - iOS
title: WatchKit框架与WatchApp交互初窥
---

早晨起床看邮件，发现收到了水果发来的WatchKit框架发布通知，遂中午下课马上开始看框架，发现WatchKit暂时作为一个iPhone App的Extension，还算是比较简单，Apple Watch只负责显示，一切计算都由iPhone完成。但是粗略读了文档后相信水果肯定会把Apple Watch逐步打造为一个独立平台，毕竟这个框架还是beta版。

<!--more-->

## **关于框架**

WatchKit.framework是一个包含WatchKit扩展使用操作的应用程序接口类。一个Watch App包含一个或者多个界面控制器，每个接口可以包含table，button，slider以及其他的视觉元素。WatchKit扩展使用下面这套类框架来配置视觉元素以及响应用户的交互。

首先，三个关键类从NSObject中继承，他们分别是：WKInterfaceController、WKInterfaceDivice、WKInterfaceObject
WKInterfaceController这个类主要实现我们说编写的Watch app的界面。从它这里还有一个WKUserNotificationInterfaceController类继承下来，而这个类负责管理本地或者远程Notification的用户界面。

WKIterfaceDevice这个类封装了与特定用户配对了的AppleWatch的配置信息。指的注意的一点就是，这个类里面有封装了对于图片缓存的管理方法，难以置信的是：WatchApp只能缓存20M的图像，当没有足够多的缓存给图像使用时，WatchKit会自动删除旧图像腾出空间。因此目前Apple Watch里面所有的动画效果都是在iPhone上以连续的图片预先渲染然后再传送给Apple Watch完成的。

WKInterfaceObject这个类就是界面元素最关键的一个类了。这个类下面继承了Apple Watch中可以使用的全部控件对象，包括WKInterfaceButton（按钮控件）、WKInterfaceDate（时间控件）、WKInterfaceGroup（控件容器）、WKInterfaceImage（图片控件）、WKInterfaceLabel（标签控件）、WKInterfaceMap（地图控件）、WKInterfaceSeparator（分割控件）、WKInterfaceSlider（滑块控件）、WKInterfaceSwitch（开关控件）、WKInterfaceTable（列表控件）、WKInterfaceTimer（计时器控件）。
通过这些控件，大致能够想象一个Watch App可以长成什么样子了。

## **关于交互**

苹果在人机交互方面一直有自己独特的见解，而关于纯粹软件上的交互其实已经没什么好谈的了，但是在Watch Human Interface Guidelines中大概看到了几个比较有趣的东西：

- Apple Watch有一个新的交互手段叫做Digital Crown，它与普通的软件导航（比如说我们iPhone上使用的是顶部的NavigationBar和通过手势滑动这两种方式来返回）有着本质的区别，因为这是一个通过硬件来控制的导航工具。

- Apple Watch内置了一个叫做Taptic Engine的东西，当用户和Apple Watch进行交互的时候，它负责提供微妙的物理反馈。

- Apple Watch的屏幕拥有被叫做Force Touch的功能，能够感知用户的轻点和按压，所以此项能够提供现有手机上做不到的，另一个维度上的交互体验。

所以，Apple Watch在交互上的突破是淡化了物理硬件和软件之间的界限，一个深思熟虑的Watch App设计应该让愚蠢的用户难以分辨或者忘记硬件（Digital Crown or Taptic Engine or Force Touch）和软件（Navigation Bar or Gesture）带来的交互差异。
果然在人机交互方面的深思才是Apple真正擅长的大招啊，反观Android Wear，就是一个手机。

进一步阅读的参考文献：

> Framework Reference：
[https://developer.apple.com/library/prerelease/ios/documentation/WatchKit/Reference/WatchKit_framework/index.html#classes](https://developer.apple.com/library/prerelease/ios/documentation/WatchKit/Reference/WatchKit_framework/index.html#classes "https://developer.apple.com/library/prerelease/ios/documentation/WatchKit/Reference/WatchKit_framework/index.html#classes")
> Programming Guide:
[https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/index.html](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/index.html "https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/index.html")
> Apple Watch Human Interface Guidelines:
[https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/WatchHumanInterfaceGuidelines/index.html](https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/WatchHumanInterfaceGuidelines/index.html "https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/WatchHumanInterfaceGuidelines/index.html")

2014年11月19日 初稿 于成都
2014年11月20日 二稿 于成都