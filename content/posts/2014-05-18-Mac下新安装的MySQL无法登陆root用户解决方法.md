---
date: 2014-05-18 08:04:40
id: 156
path: source/_posts/2014-05-18-Mac下新安装的MySQL无法登陆root用户解决方法.md
tags:
  - MySQL
  - Mac
title: Mac下新安装的MySQL无法登陆root用户解决方法
---

也不知是何原因，新安装好的MySQL，如果尝试用mysql -u root -p登陆就会出现这样的错误，但是root用户根本就没有设置密码。

``` bash
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
```

下面是解决方案：
1、先在系统偏好设置中关闭MySQL服务；
2、在终端中输入：

<!-- more -->

``` bash
sudo su
mysqld_safe --skip-grant-tables --skip-networking &
```

这时便能越过权限表，直接登陆MySQL了。
3、新建一个终端，输入

``` bash
mysql -u root
```

4、 在MySQL中修改root用户密码即可：

``` bash
mysql&gt; UPDATE mysql.user SET password=PASSWORD(’新密码’) WHERE User=’root’;
mysql&gt; FLUSH PRIVILEGES;
```



下面是在Mac中安装MySQLdb的方法：
由于要在Python里使用MySQL，但是Python内建的库中没有操作MySQL的玩意。所以得单独装一个,在安装下面的内容之前你首先得装一个MySQL。
在这里下载MySQLdb for Python，现在的最新版本是1.2.3，下载 MySQL-python-1.2.3.tar.gz 文件。（大视窗就直接 MySQL-python-1.2.3.win32-py2.7.msi 安装把）

在Finder直接双击压缩包或者 `tar zxvf` 解压之后，打开里面的 `site.cfg`  文件找到这一行：

``` bash
#mysql_config = /usr/local/bin/mysql_config
```

修改到你实际安装的mysql的位置，你可以一路 `cd ..` 去看，我的是：

``` bash
mysql_config = /usr/local/mysql/bin/mysql_config
```

然后`cd`到解压的目录输入`python setup.py build`，注意，这个操作之前你确保你的mac上已经安装gcc或者xcode+command line tools。
再`sudo python setup.py install`，安装完毕，但是你import MySQLdb的时候会出现一大堆错误。这个时候你在用户目录中`ls -al`然后打开`open .bash_profile`文件添加以下内容

``` bash
export DYLD_LIBRARY_PATH="/usr/local/mysql/lib"
```

然后在终端执行

``` bash
$sudo ln -s /usr/local/mysql/lib/libmysqlclient.18.dylib /usr/lib/libmysqlclient.18.dylib
```