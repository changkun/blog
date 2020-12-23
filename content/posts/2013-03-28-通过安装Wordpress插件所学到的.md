---
date: "2013-03-28 13:41:10"
toc: true
id: 92
slug: /posts/通过安装-wordpress-插件所学到的
aliases:
    - /archives/2013/03/92/
tags:
    - Wordpress
    - LaTeX
    - Linux
    - 运维
title: 通过安装 Wordpress 插件所学到的
---

因为主要是数学和计算机方面，所以不需要什么过分牛逼的插件吧，所以装了几个相当常用的插件了。下面介绍最为重要的两个插件：

## LaTeX for WordPress

这个插件可以编写latex的公式，非常给力，效果正如大家所看到的，下面是插入的一组麦克斯韦方程组：

$$
\begin{cases}
\nabla\cdot\vec{E}=\frac{\rho}{\varepsilon_{0}}\\
\nabla\cdot\vec{B}=0\\
\nabla\times\vec{E}=-\frac{\partial\vec{B}}{\partial t}\\
\nabla\times\vec{B}=\mu_{0}\vec{J}+\mu_{0}\varepsilon_{0}\frac{\partial\vec{E}}{\partial t}
\end{cases}
$$

所以呢，这样就非常方便我以后写公式了，以前找过很多写博客的地方，甚至包括QQ空间，都让插入公式变得十分的痛苦。

<!-- more -->

## SyntaxHighlighter Evolved

恩，既然和计算机相关，那么代码这变得不可或缺。这个插件是我从隔壁 lellansin 盗过来的。感觉不错。
比方说下面是一个排序函数：

```c
void DataSort( int data[], int n, int (* compare) ( int a, int b ) )
{
	int I, j, k, temp;
	for( I = 0; I &lt; n-1; i++ )
	{
		k = i;
		for( j = i+1; j &lt; n; j++ )
		{
			if( (* compare)( data[j], data[k] ) )
				k = j;
		}
		if( k != i )
		{
			temp = data[k];
			data[k] = data[i];
			data[i] = temp;
		}
	}
}
```

## Linux 相关命令

嗯，首先补一个直接从lellansin那里学到的ubuntu下右键出现终端的方法，图片如下：

![](/images/posts/92/1.jpg)
![](/images/posts/92/2.jpg)
![](/images/posts/92/3.jpg)

然后呢，就是各种用于操作的命令了：

```bash
dir  查看当前目录下的文件和文件夹：
cd   选择目录( cd .. 可以转到上一层目录 )
```

如果装了gcc的话，还可以：

```bash
gcc hello.c
```

编译生成了a.out那么可以通过：

```bash
./a.out
```

来运行编译结果。

上传文件，则可以通过：

```bash
pwd                 # 查看当前目录的路径
mv [文件路径] [路径]  # 上传文件
unzip [zip压缩包名]  # 在当前目录下解压zip文件
rm [文件名]          # 删除文件
rmdir [文件夹名]     # 删除空文件夹
rm  -rf  [文件夹名]  # 递归删除文件夹
wget [链接]         # 可以直接在服务器当前目录上下载文件，比上述上传命令要简单快捷许多
chmod               # 可以修改读写权限（例如chmod 777 ./ 任何人都可以读写）
```