title: 配置MySQL主从热备实现读写分离
id: 905
tags:
  - Code
---

环境说明：
Master(Ubuntu 14.04)   MySQL:5.5.40-0ubuntu0.14.04.1
Slave(Mac OS X 10.10)  MySQL:5.6.20 MySQL Community Server (GPL)

先配置Master:
[code lang="bash"]
vi /etc/mysql/my.cnf
[/code]
配置内容如下:
[code lang="bash"]
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
server-id=200
log-bin=mysql-bin
relay-log=relay-bin
relay-log-index=relay-bin-index
[/code]
保存配置后，重启MySQL服务。
[code lang="bash"]
service mysqld restart
[/code]

接下来配置Slave:
[code lang="bash"]
vi /usr/local/mysql/my.cnf
[/code]

[code lang="bash"]
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
server-id=132
log-bin=mysql-bin
replicate-do-db=test
log-slave-updates=1
[/code]
保存配置后，重启MySQL服务。
[code lang="bash"]
service mysqld restart
[/code]

登录Slave，然后执行下面命令：
[code lang="mysql"]
mysql&gt; stop slave;
mysql&gt; change master to master_host='192.168.1.200',master_user='root',master_password='123456';
mysql&gt; start slave;
mysql&gt; show slave status\G;
[/code]

查看这两项是否为YES，yes为正常。
[code lang="bash"]
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
[/code]