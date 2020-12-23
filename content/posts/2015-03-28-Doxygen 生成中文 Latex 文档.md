---
date: 2015-03-28 21:11:42
id: 178
path: source/_posts/2015-03-28-Doxygen 生成中文 Latex 文档.md
tags:
  - LaTeX
title: Doxygen 生成中文 Latex 文档
---

如今已经离不开 Mac 了，寒假的时候好好研究了一下Latex，终于在 Mac 能够熟练使用 MacTex 的各种生成方法了。

造轮子的时候，通常会遇到写文档的麻烦，了解到有 Doxygen 这个工具，还可以生成 Latex 的 pdf 文档，果断用了它。

但是似乎并不能直接根据代码生成中文文档，这就很讨厌了。

<!-- more -->

原因在于 doxygen 本身并不能直接输出 pdf 文件，而是生成 latex 目录，利用 makefile 来生成pdf文件。幸运的是，对于 latex 排版，doxygen 其实已经做了很多准备，保存的源文件是UTF-8编码，并默认使用了utf8 package。因此是支持多国语言的。

但是对于中文来说，还需要加载 CJKutf8 package，并配置好CJK环境。这才能顺利的使用中文。

所以解决方法其实很简单：

使用docxygen生成文档，注意选上 GENERATE_LATEX 、LATEX_OUTPUT、USE_PDFLATEX（最好还选上 PDF_HYPERLINKS）；
用文本编辑器打开 docxygen 生成的 latex 目录中的 refman.tex。找到“\begin{document}”这一行，将其修改为

``` latex
\usepackage{CJKutf8} 
\begin{document}
\begin{CJK}{UTF8}{gbsn} 
[/code]
再找到“\end{document}”这一行，将其修改为
[code lang="latex"]
\end{CJK} 
\end{document}
```

保存，输入make，完成编译。