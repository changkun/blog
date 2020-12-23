title: Shallow Learning and Deep Learning
id: 714
tags:
  - Code
tags:
---

了解一些 Machine Learning 的历史。
Shallow Learning 是 Machine Learning 的第一次浪潮。
20世纪80年代末期，用于 Artificial Neural Network 的 Back Propagation 算法发明，给 Machine Learning 带来了希望，掀起了基于统计模型的 Machine Learning 热潮。这个热潮一直持续到今天。人们发现，利用 Back Propagation 算法可以让一个 Artificial Neural Network 模型从大量训练样本中学习统计规律，从而对未知事件做预测。这种基于统计的 Machine Learning 方法比起过去基于人工规则的系统，在很多方面显出优越性。这个时候的 Artificial Neural Network ，虽也被称作 Multi-layer Perceptron ，但实际是种只含有一 Buried Layer 节点的 Shallow Layer 模型。
20世纪90年代，各种各样的Shallow Layer 的 Machine Learning 模型相继被提出，例如 Support Vector Machines 、 Boosting、Maximum Entropy Method（如LR，Logistic Regression）等。这些模型的结构基本上可以看成带有一层 Buried Layer 节点（如SVM、Boosting），或没有 Buried Layer 节点（如LR）。这些模型无论是在理论分析还是应用中都获得了巨大的成功。相比之下，由于理论分析的难度大，训练方法又需要很多经验和技巧，这个时期 Buried Layer 的 Artificial Neural Network 反而相对沉寂。
Deep Learning 是 Machine Learning 的第二次浪潮。
2006年，加拿大多伦多大学教授、 Machine Learning 领域的泰斗Geoffrey Hinton和他的学生Ruslan Salakhutdinov在《科学》上发表了一篇文章，开启了 Machine Learning 在学术界和工业界的浪潮。这篇文章有两个主要观点：
1）Multi-layer 的 Artificial Neural Network 具有优异的特征学习能力，学习得到的特征对数据有更本质的刻画，从而有利于可视化或分类；
2）Deep Neural Networks 在训练上的难度，可以通过 layer-wise pre-training 来有效克服。