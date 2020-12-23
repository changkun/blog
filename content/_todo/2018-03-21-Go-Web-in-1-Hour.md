---
date: 2018-03-21 20:39:08
id: 250
path: source/_posts/2018-03-21-Go-Web-in-1-Hour.md
tags:
  - Go
  - 教程
title: Go Web in 1 Hour
---

## HTTP 协议

- HTTP 协议无状态，需要使用 Cookie 机制来维护连接状态
- 请求包格式例：

```
GET /domains/example/ HTTP/1.1			 //请求行: 请求方法 请求URI HTTP协议/协议版本
Host：www.iana.org						//服务端的主机名
User-Agent：Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4		   //浏览器信息
Accept：text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8	//客户端能接收的mine
Accept-Encoding：gzip,deflate,sdch		//是否支持流压缩
Accept-Charset：UTF-8,*;q=0.5		    //客户端字符编码集
//空行,用于分割请求头和消息体
//消息体, 请求资源参数, 例如POST传递的参数
```

- HTTP协议定义了很多与服务器交互的请求方法，最基本的有4种，分别是 GET,POST,PUT,DELETE
- GET 和 POST 除语义、长度外，本质上没有区别
- 相应包格式：

```
HTTP/1.1 200 OK						//状态行
Server: nginx/1.0.8					//服务器使用的WEB软件名及版本
Date:Date: Tue, 30 Oct 2012 04:14:25 GMT		//发送时间
Content-Type: text/html				//服务器发送信息的类型
Transfer-Encoding: chunked			//表示发送HTTP包是分段发的
Connection: keep-alive				//保持连接状态
Content-Length: 90					//主体内容长度
//空行 用来分割消息头和主体
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"... //消息体
```

- 状态码：
  - 1XX 提示信息 - 表示请求已被成功接收，继续处理
  - 2XX 成功 - 表示请求已被成功接收，理解，接受
  - 3XX 重定向 - 要完成请求必须进行更进一步的处理
  - 4XX 客户端错误 - 请求有语法错误或请求无法实现
  - 5XX 服务器端错误 - 服务器未能实现合法的请求
- 从HTTP/1.1起，默认都开启了Keep-Alive保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的TCP连接
- Keep-Alive不会永久保持连接，它有一个保持时间，可以在不同服务器软件（如Apache）中设置这个时间。

## Go 的 http 包

下面的代码调用了 http 包，并能够在 9090 端口上接受 http 请求：

```go
package main

import (
	"fmt"
	"net/http"
	"strings"
	"log"
)

func sayhelloName(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()  							//解析参数，默认是不会解析的
	fmt.Println(r.Form)  					//这些信息是输出到服务器端的打印信息
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	fmt.Println(r.Form["url_long"])
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	fmt.Fprintf(w, "Hello astaxie!") 		//写入到w的是输出到客户端的
}

func main() {
	http.HandleFunc("/", sayhelloName) 		 //设置访问的路由
	err := http.ListenAndServe(":9090", nil) //设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
```

## Web 开发主要涉猎

- 表单处理
  - 表单输入
  - 输入过滤
  - 表单验证
  - XSS 攻击预防
  - 多次提交预防
  - 文件上载
  - CSRF 攻击预防
- 数据库处理
  - ORM
- 会话与数据存储
  - session 与 cookie
  - session 存储
  - session 劫持预防
- 文本文件处理
  - JSON 处理
  - 正则处理
  - 模板处理
  - 文件操作
- 服务
  - WebSocket
  - RESTful
  - RPC
  - 本地化
- 错误处理
  - 调试
  - 测试
- 线上
  - 日志
  - 部署
  - 备份
  - 回复

## Beego orm

- Beego orm 是一个 ORM 操作库，采用了 Go style 的数据库操作，实现了 struct 到数据表记录的映射。
- Beego orm 支持 database/sql 标准接口，只要数据库驱动支持 database/sql 接口就可介入 beego orm，主要包括：
  - Mysql: [github/go-mysql-driver/mysql](https://github.com/go-sql-driver/mysql)
  - PostgreSQL: [github.com/lib/pq](https://github.com/lib/pq)
  - SQLite: [github.com/mattn/go-sqlite3](https://github.com/mattn/go-sqlite3)
  - Mysql: [github.com/ziutek/mymysql/godrv](https://github.com/ziutek/mymysql)
- 安装 `go get github.com/astaxie/beego`

### 初始化

- 导入相应的数据库驱动及 database/sql 标准接口以及 beego orm 包

```go
import (
	"database/sql"
    "github.com/astaxie/beego/orm"
    _ "github.com/go-sql-driver/mysql"
)
func init() {
    // 注册驱动
    orm.RegisterDriver("mysql", orm.DR_MySQL)
    // 设置默认数据库
    orm.RegisterDataBase("default", "mysql", "root:root@/my_db?charset=utf8", 30)
    // 注册定义的 Model
    orm.RegisterModel(new(User))
    orm.RunSyncdb("default", false, true)
}
```

