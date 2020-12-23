---
date: "2014-03-09 15:20:37"
toc: true
id: 145
slug: /posts/lua-2
aliases:
    - /archives/2014/03/145/
tags:
    - Lua
title: Lua一日游:(2)Table和Array
---

我们直接来看代码：

``` lua
-- 定义一个Table
Config = {hello = "hello lua", world = "world"} -- 一个被叫做Config的Table被定义出来，键值hello索引的值是"hello lua"，类推
Config.words = "hello"  -- 键值为words索引的值为"hello"
Config.num = 100  -- 键值为num索引的值为100
Config["name"] = "zhangsan"

print(Config.words)     -- 访问形式1  本质是键值
print(Config["words"])  -- 访问形式2
print(Config.name)      -- 更多的例子
print(Config.hello)     -- 更多的例子

-- Table的遍历
for key, var in pairs(Config) do  -- 使用pairs对Table进行遍历
	print(key, var)  -- 分别打印键值和值
end

-- Array
arr = {1, 2, 3, 4, "hello"} -- 与Table不同的是，Array没有填写键值

for key, var in pairs(arr) do -- 同样是使用pairs对Array进行遍历
	print(key, var)  -- 值得注意的是数组的索引是从1开始的
end

arr2 = {} -- 定义了另一个Array
for var=1, 100 do
	table.insert(arr2,1,var) -- 向arr2中添加元素
end

for key, var in pairs(arr2) do -- 遍历Array
	print(key, var)
end

print(table.maxn(arr2)) -- 求Array的长度
```