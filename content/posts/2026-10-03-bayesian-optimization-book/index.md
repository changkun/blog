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
title: "A Book on Bayesian Optimization"
title_zh: "一本关于贝叶斯优化的书"
---
{{% en %}}
I wrote a book: [*Bayesian Optimization: From First Principles to Human Preferences*](https://changkun.de/bobook/en/).

My PhD at LMU Munich was about human-in-the-loop systems, and one question kept coming back. Some things can only be judged by a person: whether a photo looks right, whether a 3D model still looks good after it is simplified, whether a design feels right. There is no formula to optimize; you can only ask the person, and every question costs them time and patience. How do you find a good setting with as few questions as possible? The standard answer is Bayesian optimization, together with its variant that learns from comparisons, "this one, not that one", instead of scores.

I used it, and it left me with a doubt. In one project we built such a system with an industry partner for 3D artists, and two professional artists used it for three months. Most of the time they stopped before the optimizer had even started, and their judgments were not always consistent. In another study, experts and novices using the same optimizer behaved quite differently. The method assumes the person already has a preference, fixed and waiting to be found. The people in front of it did not always behave as if they had one.

Writing this book was a way back to that question, for two reasons. One was to get a systematic overview of the whole field, from the probability and linear algebra underneath to the research on preferences. The other was to catch up. I graduated a few years ago, and the field did not wait: there are new methods and new theory, many more studies with real people, and language models now trained on millions of human comparisons.

So the book has two halves. The first half builds the method from scratch, until you could write it yourself. The second half follows the research up to 2026: what has been proved, how it went with real people, and what psychology, economics, neuroscience, and philosophy have to say about what a preference is. Where I ended up: the algorithms are in good shape now. The hard part is the measurement, knowing what one comparison actually tells you, and what asking does to the person who answers.

Most figures in the book can be played with. You drag points around, step through the algorithm one decision at a time, and in a few of them, you are the one being optimized.
{{% /en %}}

{{% zh %}}
我写了一本书：[《贝叶斯优化：从基本原理到人类偏好》](https://changkun.de/bobook/zh/)。

我在慕尼黑大学读博时做的是人在回路（human-in-the-loop）的系统，有一个问题反复出现：有些东西只能靠人来判断，比如一张照片调得对不对，一个 3D 模型简化之后还好不好看，一个设计看着舒不舒服。这类问题没有公式可以拿来优化，只能去问人，而每问一次，都要花掉对方的时间和耐心。怎样用尽可能少的提问，找到一个好的设置？标准答案是贝叶斯优化，以及它从比较中学习的变体：不让人打分，只问“这个和那个，哪个更好”。

这套方法我用过，用完心里多了一个疑问。有个项目，我们和一家企业合作，给 3D 美术师做了这样一个系统，两位专业美术师用了三个月。大多数时候，优化器还没真正开始，他们就停下了；他们的判断也并不总是前后一致。另一项研究里，专家和新手用同一个优化器，表现却很不一样。这套方法默认人心里早有一个固定的偏好，只等着被找出来；可坐在它面前的人，并不总是这样。

写这本书，是想回到这个问题上来，原因有两个。一是想把整个领域系统地梳理一遍，从底下的概率论和线性代数，一直到关于偏好的研究。二是想跟上前沿：毕业好几年了，这个领域并没有停下来等我。新的方法和理论不断出现，有真人参与的研究多了很多，大语言模型也已经在用数以百万计的人类比较数据来训练。

所以这本书分成两半。前一半从头把这套方法讲清楚，讲到读者自己能把它写出来。后一半跟着研究走到 2026 年：哪些已经被证明了，用在真人身上效果如何，以及心理学、经济学、神经科学和哲学怎么看“偏好”这件事。我最后的看法是：算法本身已经相当成熟，难的是测量，也就是一次比较到底告诉了我们什么，提问本身又会怎样影响回答的人。

书里大部分图都可以动手试：拖动数据点，一步一步看算法怎么做决定；有几张图里，被优化的就是你自己。
{{% /zh %}}
