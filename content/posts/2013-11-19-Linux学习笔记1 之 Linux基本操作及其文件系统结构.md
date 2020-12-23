---
date: "2013-11-19 23:47:33"
toc: true
id: 128
slug: /posts/learn-linux-1
aliases:
    - /archives/2013/11/128/
tags:
    - Linux
title: Linux学习笔记 1 Linux基本操作及其文件系统结构
---

**文件系统结构：**

``` bash
	pwd:
	print work directory 显示当前工作目录
	touch [文件]:
	创建一个空白文件或者更新已有文件的时间
	ls:
	显示当前工作目录的所有非隐藏文件
	-a: 显示所有包括隐藏的文件
	-l: 显示详细信息
	-R: 递归显示子目录结构
	-ld: 显示目录和链接信息
	file [文件]:
	查看文件的类型
	cd [目标目录]:
	切换目录 上一级目录&quot;..&quot; 当前目录&quot;.&quot; 用户家目录&quot;~&quot; 上一工作目录&quot;-&quot;
```

**基本文件操作：**

``` bash
	cp [文件]:
	复制文件或目录
	-r: 递归复制目录树
	-v: 显示详细信息
	mv [文件] [目标目录]:
	移动或重命名（即移动时进行重命名操作）
	rm [文件]:
	删除文件或者目录
	-i: 交互式
	-r: 递归的删除目录
	-f: 强制删除
	mkdir:
	创建一个目录
	rmdir:
	删除一个空目录
```

**Linux系统目录架构说明：**

``` bash
	bin:
	可执行文件（所有用户）
	boot:
	引导目录（vmlinuz...文件即为系统内核）
	dev:
	device缩写，Linux中所有的硬件设备被抽象为一个文件
	etc:
	配置文件，多为.conf/.cnf，几乎所有的系统配置
	home:
	用户文件夹的父目录 所有用户所有的文件
	lib:
	几乎所有的库文件
	lost+found:
	文件系统相关
	mnt:
	挂载
	opt:
	用于装载大型软件（不是强制的，用户可选）
	proc:
	只存在于内存中，不在硬盘上，保存实时信息（内存的虚拟数据，独特的文件系统）
	root:
	root用户的家目录
	sbin:
	super binary 只有超级用户才能够使用的bash命令
	selinux:
	与linux安全相关
	sys:
	底层的一些硬件信息
	temp:
	临时
	usr:
	默认保存应用软件的位置
	var:
	保存经常变动的信息
```