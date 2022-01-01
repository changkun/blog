title: Docker 极速入门教程03 - 数据与网络管理及 Docker 安全
id: 99
date: 2016-09-04 00:22:54
tags:
  - Docker
  - DevOps
  - Linux
---

通过前面的教程中，我们已经介绍了非常基本的 Docker 镜像和容器的管理。有一个很容易想到的需求就是：让 Docker 容器与宿主机进行数据共享、让 Docker 容器访问网络。本节我们就从它们讲起。

**Docker 极速入门教程系列 (往期)**

- [Docker 极速入门教程01 - 基本概念和操作](https://changkun.de/blog/archives/2016/08/95/)
- [Docker 极速入门教程02 - 镜像与容器管理](https://changkun.de/blog/archives/2016/08/96/)

## 数据卷管理

Docker 与宿主机之间的数据共享是以数据卷的形式进行的，它与宿主机上的文件系统挂载非常相似。而数据卷的管理主要包括：

1. 在 Docker 中创建数据卷
2. 对数据卷中的权限进行管理
3. 挂载宿主机的文件
4. 使用数据卷容器共享数据
5. 数据卷备份

<!--more-->


## 延伸阅读

- [Docker 文件系统：Aufs 和 Devicemapper](http://www.infoq.com/cn/articles/analysis-of-docker-file-system-aufs-and-devicemapper/)
- [Docker 命令参考文档](https://docs.docker.com/engine/reference/commandline/cli/?spm=0.0.0.0.HdmaQo)