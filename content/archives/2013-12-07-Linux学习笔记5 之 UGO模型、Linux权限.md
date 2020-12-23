---
date: 2013-12-07 19:52:14
id: 134
path: source/_posts/2013-12-07-Linux学习笔记5 之 UGO模型、Linux权限.md
tags:
  - Linux
title: Linux学习笔记 5 UGO模型、Linux权限
---

<span style="font-size:24px;">**Linux 用户与组**</span>

	用户用于限制使用者或进程可以使用、不可以使用那些资源

	组用来方便组织和管理用户

	每一个用户拥有一个UserID（UID）每个用户属于一个主组，属于一个或多个附属组

	每一个组拥有一个GroupID（GID）每一个进程以用户身份运行，并接受该用户可访问资源限制

	每一个可登陆用户拥有一个指定的shell

	<span style="line-height: 1.6em;">用户：</span>

	<span style="line-height: 1.6em;">用户ID为32位，从0开始，但是为了和老式系统兼容，用户ID限制在60000以下</span>

	root用户：ID为0的用户都是root用户

	系统用户：ID:1~499 没有Shell

	普通用户：ID:&gt;=500

	<span style="line-height: 1.6em;">系统文件都有一个所属用户及所属组</span>

	id: 显示当前用户的信息

	passwd:修改当前用户密码

	与用户相关的文件有:

	/etc/passwd 用户信息

	/etc/shadow 密码（加密）

	/etc/group 组信息

	passwd文件中格式为：

	用户名:密码:UID:GID:描述信息:用户家目录:用户的登陆Shell

	shadow:

	用户名:密码（分为三个部分）:....

	gourp:

	组名:组密码:组ID:....

	查看登陆的用户：

	命令whoami显示当前用户

	命令who显示已登陆用户

	命令w显示登陆用户在做什么

	创建一个用户:

	useradd ock 创建一个新用户ock

	这条命令会执行：

	1、在/etc/passwd添加用户信息

	2、passwd中创建密码，则会加密保存在/etc/shadow中

	3、为用户建立一个新的家目录/home/ock

	4、将/etc/skel中的文件复制在用户家目录中

	5、建立一个与用户用户名相同的组，新建用户默认属于这个同名组

	支持参数：

	-d 家目录

	-s 登陆shell

	-u userid

	-g 主组

	-G 附属组（最多31个，用&quot;,&quot;分割）

	也可以通过修改/etc/passwd的方式实现，但是不建议。

	&nbsp;

	修改用户信息

	usermod 参数 username

	-l 新用户名

	-u 新userid

	-d 用户家目录位置

	-g 用户所属主组

	-G 用户所属附属组

	-L 锁定用户使其不能登陆

	-U 解除锁定

	<span style="line-height: 1.6em;">删除用户</span>

	userdel 用以删除指定用户

	userdel ock （没有删除用户家目录）

	userdel -r ock （删除家目录）

	<span style="line-height: 1.6em;">组</span>

	<span style="line-height: 1.6em;">使用部分、智能或地理区域的分类方式创建使用组</span>

	<span style="line-height: 1.6em;">每个组有一个组ID</span>

	组信息保存在/etc/group中

	每一个用户拥有一个主组，同时还拥有31个附属组

	创建/修改/删除组：

	groupadd 添加组

	groupmod 修改组信息

	group -n newname oldname 改组名

	group -g newGID oldGID 改组id

	groupdel 删除组

	<span style="font-size:24px;">**Linux权限机制**</span>

	<span style="line-height: 1.6em;">Linux权限包括：读、写、执行</span>

	<span style="line-height: 1.6em;">每个文件都有所属用户和用户所属组</span>

	<span style="line-height: 1.6em;">权限 &nbsp; 对文件的影响 &nbsp;对目录的影响</span>

	<span style="line-height: 1.6em;">r读取 可读文件的内容 可列出目录内容</span>

	<span style="line-height: 1.6em;">w写入 可修改文件内容 可在目录中创建删除文件</span>

	<span style="line-height: 1.6em;">x执行 可作为命令执行 可访问目录内容</span>

	<span style="line-height: 1.6em;">目录必须拥有x权限，否则无法查看器内容</span>

	&nbsp;

	UGO模型 User Group Other

	三个一组（rwx）, 对应UGO分别设置

	ls -l

	格式为：

	UGO（文件类型【-,d】U权限【rwx】G权限【rwx】O权限【rwx】） 链接数量 所属用户 所属组 大小 时间 文件名

	chown 改变所属用户

	chown ock hhe

	-R 递归修改目录下所有文件

	chgrp 改变所属组

	-R 递归修改目录下所有文件

	不带参数则不能修改内部

	chmod 模式 文件

	模式格式：

	u g o代表用户，组，其他

	a代表all(u g o)

	+ - 代表加入或者删除对应权限

	rwx 代表三种权限

	例如chmod u+x hehe

	-R 递归修改权限

	数字方式：777 &lt;-&gt; rwxrwxrwx权限

	Linux扩展权限机制：默认权限、特殊权限（root 权限无穷大）

	每一个terminal拥有一个umask属性，来确定新建文件文件夹的默认权限

	umask 用数字方式显示

	目录默认权限是777-umask

	文件默认权限是666-umask

	普通用户默认umask是002，root用户默认umask022

	使用umask命令可以查看umask值或者设置当前用户的umask值

	三种特殊权限：（所属用户的x变为s）

	权限 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;对文件的影响 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;对目录的影响

	suid 以文件的所属用户身份执行而非执行文件的用户 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;无

	sgid &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;以文件所属组身份执行 &nbsp; &nbsp; &nbsp; &nbsp;在改目录中创建的任意新文件的所属组与改目录的所属组相同

	sticky &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 无 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;对目录拥有写入权限的用户仅仅可以删除其有用的文件，无法删除其他用户所有用的文件

	&nbsp;

	设置suid

	chmod u+s hhh

	设置sgid

	chmod g+s hhh

	设置sticky

	chmod o+t hhh

	数字方式

	suid = 4

	sgid = 2

	sticky = 1

	chmod 4755 hhh