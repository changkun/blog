---
date: 2026-10-03T09:00:00+02:00
toc: false
id:
slug: /posts/bayesian-optimization-book
draft: false
tags:
    - 随笔
    - 研究
    - 贝叶斯优化
title: "A Book on Bayesian Optimization and Human Preferences"
title_zh: "一本关于贝叶斯优化与人类偏好的书"
---
{{% en %}}
I have written an interactive book, [*Bayesian Optimization: From First Principles to Human Preferences*](https://changkun.de/bobook/). It is free to read online, in [English](https://changkun.de/bobook/en/) and in [Chinese](https://changkun.de/bobook/zh/).

Some functions are expensive to evaluate and impossible to write down: the accuracy of a model after a day of training, the comfort of an exoskeleton after a minute of walking, the look of a design that only a person can judge. Bayesian optimization finds good inputs for such functions with few evaluations. When the only measurement is a person choosing between two options, the same idea becomes preferential Bayesian optimization, and the person becomes part of the system being studied.

The book starts from the probability and linear algebra a software engineer may not have used since school, builds Gaussian processes and the optimization loop on top, and extends them to learning from comparisons. Four case studies work real problems end to end: a classifier, a chemical reaction, an exoskeleton, and a photograph you enhance yourself. The second half follows the research through 2026: what has been proved, what happened when these methods met real people, and what psychology, economics, neuroscience, and philosophy say about whether a preference is there to be found.

Its argument is that the algorithms are now mature, and the hard part has moved to measurement: what a single comparison measures, and what asking does to the person who answers.

Most figures can be changed. You place observations and watch a Gaussian process respond, step an optimizer through its decisions, and in several places you are the person being optimized.
{{% /en %}}

{{% zh %}}
我写了一本交互式的书：[《贝叶斯优化：从基本原理到人类偏好》](https://changkun.de/bobook/zh/)，可在线免费阅读，有[中文版](https://changkun.de/bobook/zh/)和[英文版](https://changkun.de/bobook/en/)。

有些函数评估代价高昂，又无法写出解析式：模型训练一整天后的准确率、穿戴外骨骼行走一分钟后的舒适度、只能由人判断的设计美观程度，都属此类。贝叶斯优化能以很少的评估次数为这类函数找到好的输入。当唯一的测量手段是由人在两个选项中做出取舍时，同样的思路便成为偏好贝叶斯优化，而做出取舍的人本身也成为被研究系统的一部分。

本书从基础讲起，不假定读者还记得学校里的概率论与线性代数；在此之上依次讲解高斯过程、优化循环和基于比较的学习，并通过四个案例完整演示这些方法：分类器调参、化学反应优化、外骨骼调节，以及由读者亲自参与的照片增强。后半部分梳理截至 2026 年的研究：哪些结论已得到证明，这些方法用于真人时效果如何，以及心理学、经济学、神经科学与哲学如何看待偏好是否预先存在、有待发现。

全书的核心论点是：算法已趋成熟，难点已转向测量，即一次比较究竟测量了什么，以及提问本身如何影响回答者。

书中大部分图都可以交互：读者可以添加观测，观察高斯过程如何响应，逐步执行优化过程；在部分图中，读者本人就是被优化的对象。
{{% /zh %}}
