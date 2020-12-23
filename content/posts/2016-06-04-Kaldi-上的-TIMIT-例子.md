---
date: "2016-06-04 14:14:39"
toc: true
id: 199
slug: /posts/kaldi-timit-example
aliases:
    - /archives/2016/06/199/
tags:
    - Kaldi
    - 语音识别
title: Kaldi 上的 TIMIT 例子
---

Kaldi 上提供了很多例子让我们学习，这里有一个 Kaldi 上提供例子的列表：

[http://kaldi-asr.org/doc/examples.html](http://kaldi-asr.org/doc/examples.html)

但是大部分的数据库来源于LDC，并且需要成为会员才能下载。

我们这里使用一个叫做 TIMIT 的例子，当然他也是需要付费才能使用的数据集。

然而幸运的是我们可以在这个链接里找到所有的内容：

[http://www.fon.hum.uva.nl/david/ma_ssp/2007/TIMIT/](http://www.fon.hum.uva.nl/david/ma_ssp/2007/TIMIT/)

因为版权问题我不准备提供直接下载的链接，但是我作为老司机可以指一条路：`wget -r`，剩下的就看你自己的造化了。

数据拿到后，目录下会多出很多 `.html` 的文件。我这里写了一个脚本用于删除这些多余的文件，并将小写目录转换成大写目录（在 Kaldi 的 TIMIT 脚本中写出的目录都是大写的）：

<!--more-->

```python
import os

def delHTML(path):
    print "now on" + path + ":"
    for filename in os.listdir(path):
        newpath = path+'/'+filename
        if os.path.isdir(newpath):
            print filename + " is " + str(os.path.isdir(filename))
            delHTML(newpath)
        else:
            if '.html' in filename:
                print "delete: " + filename
                os.remove(newpath)

def renameDIR(path):
    print "now on" + path + ":"
    for filename in os.listdir(path):
        oldpath = path+'/'+filename
        newpath = path+'/'+filename.upper()
        if os.path.isdir(oldpath):
            os.rename(oldpath, newpath)
            print "change to: " + newpath
            renameDIR(newpath)

path = '/path/to/your/TIMIT/data'
delHTML(path)
renameDIR(path)
```

终于我们获得了一个完整的 TIMIT 的数据集，整个数据集内的文件一共有 666.8 MB。


## 运行 TIMIT 示例脚本

接下来我们终于可以开始使用 Kaldi 提供的一些例子来跑跑看了。

首先我们需要修改数据集的目录：

```
#timit=/export/corpora5/LDC/LDC93S1/timit/TIMIT # @JHU
#timit=/mnt/matylda2/data/TIMIT/timit # @BUT
# 上面两行是代码中原有的数据集位置，我们需要执行定制为下面的路径：
timit=/path/to/your/TIMIT/data
```

然后就可以

```bash
./run.sh
```

非常不幸，我们在运行脚本的时候回遇到这样的错误：

```
sed: 1: "s:.*/\(.*\)/\(.*\).WAV$ ...": bad flag in substitute command: 'i'
sed: 1: "s:.*/\(.*\)/\(.*\).PHN$ ...": bad flag in substitute command: 'i'
```
关于这个问题的出现，请参考：[http://stackoverflow.com/questions/4412945/case-insensitive-search-replace-with-sed/4412964#4412964](http://stackoverflow.com/questions/4412945/case-insensitive-search-replace-with-sed/4412964#4412964)，原因在于 Mac 上的 `sed` 并不是标准的 GNU 实现，所以我们需要安装 `GNU sed`。

我们可以在 Mac 上重新安装 `GNU sed` 来解决这个问题：

```
brew install gnu-sed --with-default-names
```

> 如果你没有 `brew` 请面壁思过。

安装完成后，我们会得到这样一个错误：

```
awk: calling undefined function gensub
 input record number 1, file train.text
 source line number 7
```

又是 Mac 的坑，awk gensub 是 GNU 上的一个扩展，Mac 上没有实现。

```bash
brew install gawk
```

装好后，再执行

```
./run.sh
```


输出。但是，依然还是有错：

```
local/timit_prepare_dict.sh: Error: the IRSTLM is not available or compiled
local/timit_prepare_dict.sh: Error: We used to install it by default, but.
local/timit_prepare_dict.sh: Error: this is no longer the case.
local/timit_prepare_dict.sh: Error: To install it, go to /Users/ouchangkun/Work/Git/kaldi/egs/timit/s5/../../../tools
local/timit_prepare_dict.sh: Error: and run extras/install_irstlm.sh
```

好吧，我们还要去装 `extras/install_irstlm.sh`。

装完后，我们终于能够完成第一部分的脚本，我们就能够看到

```
Data preparation succeeded
```

很可惜，我们还是不能完整的运行整个 `run.sh` 脚本，我们会得到：

```
error: qsub not found.
```
这是因为 TIMIT 的这个例子部署在多机器上，我们想要在本地运行所有的任务，需要修改 `cmd.sh` 中的内容：

```

# no GridEngine
export train_cmd=run.pl
export decode_cmd=run.pl
export cuda_cmd=run.pl
export mkgraph_cmd=run.pl

# 下面的内容均为多机器任务的命令，依赖 Sun GridEngine，我们注释掉所有的内容并使用上面的四行。

# export train_cmd="queue.pl --mem 4G"
# export decode_cmd="queue.pl --mem 4G"
# export mkgraph_cmd="queue.pl --mem 8G"

# the use of cuda_cmd is deprecated but it's still sometimes used in nnet1
# example scripts.
# export cuda_cmd="queue.pl --gpu 1"

# the rest of this file is present for historical reasons.
# for cluster-specific configuration it's better to rely on conf/queue.conf.
# if [ "$(hostname)" == "fit.vutbr.cz" ]; then
#   #b) BUT cluster options
#   queue="all.q@@blade,all.q@@speech"
#   gpu_queue="long.q@@gpu"
#   storage="matylda5"
#   export train_cmd="queue.pl -q $queue -l ram_free=1.5G,mem_free=1.5G,${storage}=0.5"
#   export decode_cmd="queue.pl -q $queue -l ram_free=2.5G,mem_free=2.5G,${storage}=0.1"
#   export cuda_cmd="queue.pl -q $gpu_queue -l gpu=1"
# fi

```

至此，我们再重新运行

```
./run.sh
```

便能运行完整个脚本，但是这非常依赖时间，我的本子配置如下：

```
MacBook Pro (Retina, 15-inch, Mid 2014)
2.5 GHz Intel Core i7
16 GB 1600 MHz DDR3
NVIDIA GT750M
```

运行情况如图所示：

![JOB](/images/posts/199/1.png)
