---
date: 2013-12-07 19:01:47
id: 132
path: source/_posts/2013-12-07-Linux学习笔记4 之 Linux文件系统基本操作.md
tags:
  - Linux
title: Linux学习笔记 4 Linux文件系统基本操作
---

Linux文件系统支持：

	ext2（默认不带日志）、<span style="line-height: 1.6em;">ext3（默认带日志）、</span><span style="line-height: 1.6em;">ext4、</span><span style="line-height: 1.6em;">fat(MS-DOS)、</span><span style="line-height: 1.6em;">vfat、</span><span style="line-height: 1.6em;">nfs、</span><span style="line-height: 1.6em;">iso9660、</span><span style="line-height: 1.6em;">proc、</span><span style="line-height: 1.6em;">gfs(global file system)、</span><span style="line-height: 1.6em;">jfs、</span><span style="line-height: 1.6em;">...</span>

	&nbsp;

	创建文件系统：

	mke2fs -t ext4 /dev/sdb1

	常用参数：

	-b block size 指定文件系统块大小

	-c 建立文件系统时，检查损坏块

	-L label 指定卷标

	-j 建立文件系统日志

	&nbsp;

	mkfs 支持参数较少 不能精细化控制

	mkfs ext3 /dev/sda3

	mkfs ext4 /dev/sda3

	mkfs vfat /dev/sda3

	&nbsp;

	dumpe2fs 查看文件系统的详细信息

	dumpe2fs /dev/sda3

	&nbsp;

	ezlabel 为文件系统添加标签

	ezlabel /dev/sda2 显示sda2系统标签

	ezlabel /dev/sda2 HH 设置标签为HH

	&nbsp;

	fsck 检查并修复损坏的文件系统

	-y 不提示进行修复

	-t 对损坏较严重的文件系统进行检查修复时，需要使用此参数来指定修复文件系统的类型

	对于识别为文件的损坏数据（文件系统无记录）fsck会将文件放入lost+found目录系统启动时会对磁盘进行fsck操作

	&nbsp;

	JOURNAL日志 拥有较强的稳定性，在出现错误时可以进行恢复

	带日志的文件系统：

	（1）将准备执行的事务的具体内容写入日志

	（2）进行操作

	（3）成功后，具体内容从日志中删除

	优点：出现意外可查看日志

	缺点：丧失一定性能

	&nbsp;

	fdisk 只有超级用户才可以使用

	fdisk -l 列出所有安装的磁盘及其分区信息

	fdisk /dev/sda 对目标磁盘进行分区操作，分区后使用partprobe让内核更新分区信息，否则重启后才能识别

	/proc/partitions 文件也可以用来查看分区信息

	分区：

	主分区：n -&gt; p -&gt; 1 -&gt; +size(K,M,G)

	扩展分区：n -&gt; e -&gt; 2 -&gt; +size(K,M,G)

	逻辑分区：n -&gt; l -&gt; enter -&gt; +size(K,M,G)

	（分区号从5开始）

	修改id： t

	保存MBR： w

	分区后需要创建文件系统才能使用。

	&nbsp;

	挂载、使用文件系统：磁盘或分区建好后，需挂在到一个目录才能使用

	Windows或Mac会进行自动挂载，创建好文件系统后会自动挂载到系统上

	Linux需要手工进行挂载或配置系统进行自动挂载

	/dev/sda3 ext3 -挂载-&gt; /mnt

	&nbsp;

	mount 将格式化好的磁盘或分区挂载到一个目录上

	mount /dev/sda3 /mnt

	不带参数的mount会显示所有已挂载的文件系统

	-t 指定文件系统的类型

	-o 指定挂载选项

	ro, rw read-only只读，read-write读写，默认rw

	sync 代表不使用缓存，对所有操作直接写入磁盘

	async 使用缓存（默认，提高性能）

	noatime 代表每次访问文件时，不更新文件的访问时间（提高性能）

	atime 代表每次访问文件时，更新文件的访问时间

	remount 重新挂载文件系统

	&quot;,&quot;表示连接参数

	&nbsp;

	umount 卸载挂载的文件系统

	umount 文件系统/挂载点

	umount /dev/sda3 == umount /mnt

	出现device is busy报错：使用fuser -m /mnt查看使用进程 或者 lsof / mnt 查看使用文件

	&nbsp;

	自动挂载

	配置文件/etc/fstab用来定义需要自动挂载的文件系统

	fstab每一行代表一个挂载配置 格式：

	&nbsp;/dev/sda3 &nbsp; /mnt &nbsp; &nbsp;ext4 &nbsp; defaults &nbsp; &nbsp; &nbsp; 0 0

	要挂载的设备 挂载点 文件系统 &nbsp;挂载选项 &nbsp;dump,fsck相关选项

	可以使用LABEL取代/dev/sda3

	mount -a 挂载所有fstab中定义的自动挂载项