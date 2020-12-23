---
date: 2015-03-27 18:10:20
id: 177
path: source/_posts/2015-03-27-Wordpress 站点搬家.md
tags:
  - Wordpress
  - LNMP
  - 运维
title: Wordpress 站点搬家
---

我的 Wordpress 站点使用的是 lnmp 快速搭建的，所以如果是搬家的话可以很快。

首先在新的VPS上安装lnmp。
下面这一行命令就可以解决了。

``` bash
wget -c http://soft.vpser.net/lnmp/lnmp1.1-full.tar.gz && tar zxf lnmp1.1-full.tar.gz && cd lnmp1.1-full && ./centos.sh
```

然后在执行：

<!-- more -->

``` bash
/root/vhost.sh
```

就可以按照步骤创建好文件夹了。

下一步就是把文件备份过来。

``` bash
# 原服务器
tar -cvf euryugasaki.com.tar /home/wwwroot/euryugasaki.com    # 网站打包
mysqldump -u 用户名 -p 数据库 &gt; 数据库.sql # mysql 数据备份
mv 文件 /home/wwwroot/euryugasaki.com/backup/

# 新服务器
wget http://euryugasaki.com/backup/文件  # 直接通过 http 在服务端下载
mysql -u root -p                       # 输入密码后进入 mysql 客户端
CREATE DATABASE `yourdb` CHARACTER SET utf8 COLLATE utf8_general_ci; # 创建一个名为 mydb 的数据库
exit                                   # 退出 mysql
mysql -u 用户名 -p 数据库 &lt; 数据库.sql # mysql 数据导入
tar -zxvf lellansin.com.tar.gz         # 解压网站之后移动到相应目录

# nohup 命令可以让系统后台执行
nohup tar -zxvf euryugasaki.com.tar.gz &
```

其实这样的话就已经搞完了
美国的服务器内网速度超级快高达40M/s
所以不用担心下载文件很慢什么的
你可以尝试在本地修改/etc/hosts文件来重定向到新服务器看看是不是真的成功了
接下来要做的就是取改A记录了

好嘛 那就到这里