---
date: 2020-12-15T00:00:00+01:00
title: "\"Worse is Better\""
---

偶然间读到了一篇文章的节选片段《The Rise of Worse is Better》，这篇文章的作者 Richard 围绕为什么 C 和 Unix 能够成功展开了反思。这篇文章中聊到了几个软件设计的四大目标简单、正确、一致和完整。其中围绕四个目标发展出了两大很有代表性的流派: MIT 流派和 New Jersey 流派（贝尔实验室所在地）。MIT 流派认为软件要绝对的正确和一致，然后才是完整，最后才是简单；而一并“讽刺”了 New Jersey 流派反其道而行之的做法，他们将简单的优先级设为最高，为了简单甚至能够放弃正确。换句话说，软件的质量（受欢迎的程度）并不随着功能的增加而提高，从实用性以及易用性来考虑，功能较少的软件反而更受到使用者和市场青睐。

所以你看到为什么总是有些人总是抱怨 Go 这也不行那也不行，这也没有那也没有了。因为来自贝尔实验室的 Rob Pike 就是一个彻彻底底的 New Jersey 流派中人。所以总结起来 Go 的特点就是:

1. 简单
2. 非常简单
3. 除了简单就是简单

然后围绕 Worse is Better 还有好几篇后续文章:

- 原始文章: Richard P. Gabriel. The Rise of Worse is Better. 1989. https://www.dreamsongs.com/RiseOfWorseIsBetter.html
- 后续1: Nickieben Bourbaki. Worse is Better is Worse. 1991. https://dreamsongs.com/Files/worse-is-worse.pdf
- 后续2: Richard P. Gabriel. Is Worse Really Better? 1992. https://dreamsongs.com/Files/IsWorseReallyBetter.pdf
- 后续3: Richard P. Gabriel. Worse is Better. 2000. https://www.dreamsongs.com/WorseIsBetter.html
- 后续4: Richard P. Gabriel. Back to the Future: Worse (Still) is Better! Dec 04, 2000. https://www.dreamsongs.com/Files/ProWorseIsBetterPosition.pdf
- 后续5: Richard P. Gabriel. Back to the Future: Is Worse (Still) Better?  Aug 2, 2002. https://www.dreamsongs.com/Files/WorseIsBetterPositionPaper.pdf

所以你更倾向于哪个学派？
