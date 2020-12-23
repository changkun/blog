---
date: 2014-11-06 13:38:07
id: 168
path: source/_posts/2014-11-06-Python-MySQLdb 教程.md
tags:
  - MySQL
  - Python
title: Python-MySQLdb 教程
---

Python操作MySQL，一个常用的方案就是使用MySQLdb库，安装在之前的日志已经介绍过了：
[Mac下新安装的MySQL无法登陆root用户解决方法](http://www.euryugasaki.com/archives/853 "Mac下新安装的MySQL无法登陆root用户解决方法")

下面我们来看看如何使用Python操作MySQL，基本逻辑分为四个步骤。

<!-- more -->

## 包含MySQLdb库

``` python
import MySQLdb
```

## 与MySQL建立连接

``` python
conn = MySQLdb.connet(host='localhost', user='root';, passwd='root&quot;, db = 'euryugasaki', port=3306)
```

connect()方法用来提供与MySQL的连接，接受多个参数，返回连接的对象：
host: 数据库主机名，默认是本地主机
user: 数据库登录用户，默认是当前用户
passwd: 数据库登录密码，默认是空
db: 使用的数据库名，没有默认值
port: MySQL服务使用TCP端口，默认3306

连接对象提供了对事务操作的支持，标准方法有：
commit() 提交
插入更新数据的时候一定要执行commit()否则不能真正的插入数据。
rollback() 回滚

## 运行SQL语句并接受返回值

``` python
cursor = conn.cursor()
n = cursor.execute(sql,param)
```

我们需要使用连接返回的对象获得一个cursor对象，并使用cursor提供的方法来进行工作。这类方法包括两大类：
a) 执行命令
callproc(self, procname, args): 用来执行存储过程，接受的参数为存储过程名和参数列表，返回值为受影响的行数.
execute(self, query, args): 执行单条SQL语句，接受的参数为SQL语句本身和使用的参数列表，返回值为受影响的行数.
executemany(self, query, args): 执行单条SQL语句，但是重复执行参数列表里的参数，返回值为受影响的行数.
nextset(self): 移动到下一个结果集
b) 接受返回值
fetchall(self):接受全部的返回结果行.
fetchmany(self, size=None): 接受size调返回结果行，如果size的值大于返回的结果行的数量，则会返回cursor.arraysize条数据
fetchone(self): 返回一条结果航
scroll(self, value, mode='relative'): 移动指针到某一行，如果mode='relative',则表示当前所在行移动value条，如果mode='absolute'，则表示从结果集的一行移动value条

## 关闭数据库连接
需要分别关闭指针对象和连接对象，他们有名字相同的方法：

``` python
cursor.close()
conn.close()
```

例子：

``` python
import MySQLdb

try:
	connection = MySQLdb.connect(host='localhost', user='root', passwd='cvlabock', db = 'euryugasaki', port=3306)
	cur = connection.cursor()
	count = cur.execute('SELECT * FROM wp_users')

	#only accept one return value
	result = cur.fetchone()
	print result

	#accept five return values
	results = cur.fetchmany(5)
	for r in results:
		print r
	print &quot;\n&quot;

	#accept all the return values
	result2 = cur.fetchall()
	print result2

	#insert datas
	cur.execute('CREATE DATABASE IF NOT EXISTS testEuryugasaki')
	conn.select_db('testEuryugasaki')
        cur.execute('CREATE TABLE test(id int, info varchar(20))')
	value=[1, 'hi Longqi']
	cur.execute('INSERT INTO testEuryugasaki VALUES(%s, %s)', value)
	values=[]
	for i in range(20):
		values.append((i, 'hi Longqi '+str(i)))
	cur.excutemany('INSERT INTO testEueyugasaki VALUES(%s, %s)', values)
	cur.execute('UPDATE testEuryugasaki SET info=&quot;I am Euryugasaki&quot; WHERE id = 3')

	conn.commit()

	cur.close()
	connection.close()

except MySQLdb.Error, e:
		print &quot;MySQL Error %d: %s&quot; % (e.args[0], e.args[1])
```

connet()方法中还有一个参数是charset，设置charset是让数据库的编码与自身相同，如果数据库的编码是gb2312，则使用charset='gb2312'，如果是utf-8则charset='urt8'