---
date: "2014-03-27 12:48:13"
toc: true
id: 152
slug: /posts/python-quickstart
aliases:
    - /archives/2014/03/152/
tags:
    - Python
title: Python QuickStart
---

Python Version: 2.7
We use python for rapid development. Mainly using the matrix operations, so we quickly introduce python collection type and control structure.

## List

``` python
>>> wow=[]
>>> wow.append(1)
>>> wow.append('nice hat')
>>> wow
```

python has arryay data type, which similar to c/cpp/java/..., can contain only one type of data.
This array type is faster than list when you are looping.

<!-- more -->

## Dicthinaries

``` python
>>> wow={}
>>> wow['name']='euryugasaki'
>>> wow[123]=456
>>> wow
```

## Set

``` python
>>> Set1 = [1,2,3,4,5,6,7,8,9]
>>> pSet1 = set(Set1)
>>> pSet1
>>> pSet2 = set([4,5,6,7])
>>> pSet2
>>> pSet1-pSet2
>>> pSet1|pSet2
>>> pSet1&pSet2
```

## if

``` python
>>> val=10
>>> if val<9: print "hehe"
>>> if val<9:
...    print "hehe"
...
```

## for
In for,while,or if statements, we use indentation to tell python which line of code belong inside these loops.

``` python
>>> pset=set([1,2,3,4,5])
>>> for item in pset:
...    print item
...
```

You can also loop over a dictionary, The item iterated over are acturally the dictionary keys.

## list comprehensions

``` python
>>> wow = [1,2,3,4,5,6,7,8,9]
>>> newWOW = [item*3 for item in array if item>5]
>>> newWOW
```