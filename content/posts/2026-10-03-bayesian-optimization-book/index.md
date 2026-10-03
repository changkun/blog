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
title: "I Wrote a Book on Bayesian Optimization"
title_zh: "我写了一本关于贝叶斯优化的书"
---
{{% en %}}
I wrote a book: [*Bayesian Optimization: From First Principles to Human Preferences*](https://changkun.de/bobook/). It is free to read online, in [English](https://changkun.de/bobook/en/) and in [Chinese](https://changkun.de/bobook/zh/).

It started with a practical question. Some things can only be judged by a person: whether a photo looks right, whether a design feels good, whether an exoskeleton is comfortable to walk in. To tune something like that, there is no formula to optimize. You can only ask the person, and every question costs them time and patience. So how do you find a good setting with as few questions as possible?

There is a well-developed answer, called Bayesian optimization. It keeps a running guess about every setting it has not tried yet, and uses that guess to decide what to try next. When all a person can tell you is "this one, not that one", the same idea still works; it just learns from comparisons instead of scores.

Using it with real people left me with a doubt, though. The method assumes the person already has a preference, fixed and waiting to be found. The people in front of it did not always behave as if they had one.

So the book has two halves. The first half builds the method from scratch, starting with the probability and linear algebra you may have forgotten since school, until you could write it yourself. The second half follows the research up to 2026: what has been proved, how it went with real people, and what psychology, economics, neuroscience, and philosophy have to say about what a preference is. Where I ended up: the algorithms are in good shape now. The hard part is the measurement, knowing what one comparison actually tells you, and what asking does to the person who answers.

Most figures in the book can be played with. You drag points around, step through the algorithm one decision at a time, and in a few of them, you are the one being optimized.
{{% /en %}}

{{% zh %}}
我写了一本书：[《贝叶斯优化：从基本原理到人类偏好》](https://changkun.de/bobook/zh/)，可以免费在线阅读，有[中文版](https://changkun.de/bobook/zh/)和[英文版](https://changkun.de/bobook/en/)。

起因是一个很实际的问题。有些东西只能靠人来判断：一张照片调得对不对，一个设计看着舒不舒服，一副外骨骼穿着走路顺不顺。想把这样的东西调好，没有公式可以拿来优化，只能去问人，而每问一次，都要花掉对方的时间和耐心。那么，怎样用尽可能少的提问，找到一个好的设置？

这个问题有一个相当成熟的答案，叫贝叶斯优化。它对每个还没试过的设置都保留一个估计，再用这个估计决定下一步试什么。如果人能告诉你的只有“这个比那个好”，同样的思路照样适用，只不过改成从比较里学习。

可真拿它在人身上用过之后，我心里多了一个疑问。这套方法默认人心里早就有一个固定的偏好，只等着被找出来；可坐在它面前的人，并不总是这样。

所以这本书分成两半。前一半从头把这套方法讲清楚，从上学时学过、可能早就忘了的概率论和线性代数讲起，一直讲到读者自己能把它写出来。后一半跟着研究走到 2026 年：哪些已经被证明了，用在真人身上效果如何，以及心理学、经济学、神经科学和哲学怎么看“偏好”这件事。我最后的看法是：算法本身已经相当成熟，难的是测量，也就是一次比较到底告诉了我们什么，提问本身又会怎样影响回答的人。

书里大部分图都可以动手试：拖动数据点，一步一步看算法怎么做决定；有几张图里，被优化的就是你自己。
{{% /zh %}}
