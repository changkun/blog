---
date: "2013-11-20 00:28:48"
toc: true
id: 129
slug: /posts/learn-linux-2
aliases:
    - /archives/2013/11/129/
tags:
    - Linux
title: Linux学习笔记 2 Linux常用必背命令
---

## 日期时间

``` bash
date
# 格式化显示时间  +%Y[任意格式]%m[任意格式]%d
# -s: 设置时间
hwclock/clock
# 用以显示硬件时钟时间
cal
# 查看日历
uptime
# 查看系统运行时间
```

## 输出、查看

```bash
    echo:
        用以显示输入的内容
    cat:
        显示纯文本文件的内容
    more:
        用于翻页显示文件内容（只能用于向下翻页）
    less:
        用于翻页显示文件内容（带上下翻页）
    head:
        显示文件的头几行（默认十行）
        -n: 显示行数
    tail:
        显示文件的末尾几行（默认十行）
        -n: 显示行数
        -f: 追踪显示文件更新（一般用于查看日志、命令不会退出）
```

## 查看硬件信息：**
``` bash
    lspci:
        查看PCI设备
        -v: 查看详细信息
    lsusb:
        查看USB设备
        -v: 查看详细信息
    lsmod:
        查看加载的模块（驱动）
```

## 关机/重启
```bash
    shutdown [参数] 时间
        -h: 关机
        -r: 重启
        例如：
            shutdown -h now
            shutdown -h +10 （十分钟以后）
            shutdown -r 23:30 （23:30重启）
    poweroff:
        立即关机
    reboot:
        立即重启
```

## 归档和压缩

```bash
zip:
    zip myfile.zip unzip_file_name:
        压缩unzip_file_name为myfile.zip
unzip [压缩文件]:
    解压
gzip [压缩文件]:
    采用gzip压缩算法解压缩文件
    -d: 解压缩
tar [选项] [文件]:
    归档命令
    -c: 创建新的档案文件。如果用户想备份一个目录或是一些文件，就要选择这个选项
    -v 详细报告tar处理的文件信息。如无此选项，tar不报告文件信息
    -f 使用档案文件或设备，这个选项通常是必选的
    -z 用gzip来压缩/解压缩文件，加上该选项后可以将档案文件进行压缩，但还原时也一定要使用该选项进行解压缩
    -x 从档案文件中释放文件
    tar -cvf out.tar hello:
        归档hello文件夹
    tar -xvf out.tar:
        打开。释放归档文件
    tar -cvzf backuptar.gz /etc:
        使用-z参数将归档后再使用gzip进行压缩

tar cvf archive_name.tar direname/  # 创建新的 tar 文件
tar xvf archive_name.tar            # 解压 tar 文件
tar tvf archive_name.tar            # 查看 tar 文件

gzip test.txt                       # 创建一个 *.gz 压缩文件
gzip -d test.txt.gz                 # 解压 *.gz 文件
gzip -l *.gz                        # 显示压缩比率

bzip2 test.txt                      # 创建 *.bz2 压缩文件
bzip2 -d test.txt.bz2               # 解压 *.bz2 文件

unzip test.zip                      # 解压 *.zip 文件
unzip -l jasper.zip                 # 查看 *.zip 文件
```

## 查找

```bash
    locate [关键字]:
        快速查找文件或文件夹
        需要预先建立数据库，默认每天更新一次，或者也可以用updatedb手工建立/更新数据库
    find [查找位置] [查找参数] [关键字]:
        用以高级查找文件文件夹
        find . -name *hello*
        find / -name *.conf
        find / -perm 777
        find / -type d
        find . -name &quot;[关键词]&quot; -exec [命令] {} \;  // 可以返回结果
        -name: 以名称形式查找
        -perm: 以权限形式查找
        -user: 以所有者形式查找
        -group:以用户组形式查找
        -ctime:以修改时间形式查找
        -type: 以类型查找
        -size: 以大小查找
```