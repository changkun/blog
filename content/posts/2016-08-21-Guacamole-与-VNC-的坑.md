---
date: "2016-08-21 19:15:13"
toc: true
id: 209
slug: /posts/guacamole-源码分析与-vnc-中-rfb-协议的坑
aliases:
    - /archives/2016/08/209/
tags:
    - guacamole
    - VNC
    - Linux
    - DevOps
title: Guacamole 源码分析与 VNC 中 RFB 协议的坑
---

今天折腾了一整天 Guacamole，遇到了臭名昭著的坑，且听我一一道来。

简单来说 Guacamole 提供了浏览器端访问的桌面系统的解决方案。Guacamole 提供的解决方案主要由两部分组成：

1. 浏览器端基于 HTML5，Canvas 技术: Guacamole Client 的 Guacamole-Common-JS 组件
2. Guacamole Client 的 Guacamole Web 组件, 
3. Guacamole Server 仍然分为两个部分：
    - Guacamole Web 服务容器
    - `guacd` 守护进程与 `RDP`/`VNC`/`TELNET` 等其他服务进行通信。

下面这张图很好的解释了 `guacamole` 的架构，出自[官网手册](http://guacamole.incubator.apache.org/doc/gug/guacamole-architecture.html)：

![](/images/posts/209/1.png)

<!--more-->

## 部署 Guacamole Server

部署 Guacamole 分两步：

1. 部署 guacamole-server
2. 部署 guacamole-web-service

### 部署 guacamole-server

```bash
# 装依赖
sudo apt-get install libpng12-dev libjpeg-dev libcairo2-dev libossp-uuid-dev libpulse-dev libvncserver-dev libcairo2-dev freerdp-x11 libfreerdp-dev libvorbis-dev libssh-dev libpulse-dev tomcat7 tomcat7-admin libpango1.0-dev autoconf libossp-uuid-dev libtelnet-dev libvncserver-dev build-essential default-jre default-jdk  maven vnc4server

# 然后去官网把源码下下来, 进到 /src 内:
./configure
./configure --with-init-dir=/etc/init.d
sudo make
sudo make install
sudo ldconfig
```

### 部署 guacamole-client:

```bash
sudo mkdir -p /var/lib/guacamole/classpath
sudo wget -q --span-hosts http://sourceforge.net/projects/guacamole/files/current/binary/guacamole-0.9.9.war -P /var/lib/guacamole
cd /var/lib/tomcat7/webapps
sudo rm -rf ROOT
sudo ln -s /var/lib/guacamole/guacamole-0.9.9.war ./ROOT.war
sudo mkdir /etc/guacamole
sudo ln -s /etc/guacamole /usr/share/tomcat7/.guacamole
sudo vim /etc/guacamole/guacamole.properties

## 配置内容如下
#tname and port of guacamole proxy
guacd-hostname: 127.0.0.1
guacd-port:     4822
enable-websocket: true

# Authentication provider class
# auth-provider: net.sourceforge.guacamole.net.basic.BasicFileAuthenticationProvider
lib-drectory: /var/lib/guacamole/classpath
auth-provider: com.stephensugden.guacamole.net.hmac.HmacAuthenticationProvider
secret-key: for-test
timestamp-age-limit: 42000000
```

再在 `/etc/guacamole/` 下创建 `user-mapping.xml`:

`<user-mapping><authorize username="changkun" password="123"><protocol>vnc</protocol><param name="hostname">localhost</param><param name="port">5900</param><param name="password">VNCPASS</param></authorize></user-mapping>`

最后启动 `guacamole`/`tomcat7`/`vnc` 服务即可：

```bash
sudo /etc/init.d/guacd start
sudo /etc/init.d/tomcat7 start
vnc4server :1
```

> 关闭 vnc 服务用 `vnc4server -kill :1`。

这时便可以在 8080 端口访问 `guacamole` 服务了。

## Guacamole 对 UTF-8 的支持

关于 UTF-8 和 Unicode 之间的区别，简单来说 Unicode 是一种规范标准，规定了字符集的编码；而 UTF-8 是 Unicode 的一个具体的实现，解决了 Unicode 的存储问题。

关于 UTF-8 的具体实现细节可以归为两点：

1. 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
2. 对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。

这里说的比较精炼，可以参考[阮一峰的一篇关于字符编码的文章](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)。

### Guacamole Client 对 UTF-8 的编码

对于剪切板之间的传输不支持中文的情况，自然最先想到从客户端查起。首先查到[官方文档](http://guacamole.incubator.apache.org/doc/guacamole-common-js/Guacamole.Client.html)中对于剪贴板的描述，实现剪贴板之间的传输主要依赖 [`setClipboard`](http://guacamole.incubator.apache.org/doc/guacamole-common-js/Client.js.html) 方法和 `onclipboard` 事件。

对于 `setClipboard` 来说：

```js
/**
 * Sets the clipboard of the remote client to the given text data.
 *
 * @deprecated Use createClipboardStream() instead. 
 * @param {String} data The data to send as the clipboard contents.
 */
this.setClipboard = function(data) {
    // Do not send requests if not connected
    if (!isConnected())
        return;
    // Open stream
    var stream = guac_client.createClipboardStream("text/plain");
    var writer = new Guacamole.StringWriter(stream);
    // Send text chunks
    for (var i=0; i<data.length; i += 4096)
        writer.sendText(data.substring(i, i+4096));
    // Close stream
    writer.sendEnd();
};
```

看到这里发现对于字符的处理每次传输4096长度的字符串，知道传输完成才关闭写入流。所以关于编码的部分取决于 [`Guacamole.StringWriter`](http://guacamole.incubator.apache.org/doc/guacamole-common-js/StringWriter.js.html)对于 `.sendText()`的实现。

在这个实现中，`.sendText()` 会将字符串先编码为 `UTF-8` 然后通过 `.sendData` 方法传输：

```js
/**
 * Sends the given text.
 * 
 * @param {String} text The text to send.
 */
this.sendText = function(text) {
    if (text.length)
        array_writer.sendData(__encode_utf8(text));
};
```

那么问题就落在了关于对 UTF-8 的编码上了，下面是 `guacamole-client` 关于 UTF-8 编码的关键实现：


```js
// Guacamole Client 字符转码

var buffer = new Uint8Array(8192);
var length = 0;

function __expand(bytes) {

    // Resize buffer if more space needed
    if (length+bytes >= buffer.length) {
        var new_buffer = new Uint8Array((length+bytes)*2);
        new_buffer.set(buffer);
        buffer = new_buffer;
    }

    length += bytes;

}

function __append_utf8(codepoint) {

    var mask;
    var bytes;

    // 1 byte
    if (codepoint <= 0x7F) {
        mask = 0x00;
        bytes = 1;
    }
    // 2 byte
    else if (codepoint <= 0x7FF) {
        mask = 0xC0;
        bytes = 2;
    }
    // 3 byte
    else if (codepoint <= 0xFFFF) {
        mask = 0xE0;
        bytes = 3;
    }
    // 4 byte
    else if (codepoint <= 0x1FFFFF) {
        mask = 0xF0;
        bytes = 4;
    }
    // If invalid codepoint, append replacement character
    else {
        __append_utf8(0xFFFD);
        return;
    }
    // Offset buffer by size
    __expand(bytes);
    var offset = length - 1;
    // Add trailing bytes, if any
    for (var i=1; i<bytes; i++) {
        buffer[offset--] = 0x80 | (codepoint & 0x3F);
        codepoint >>= 6;
    }
    // Set initial byte
    buffer[offset] = mask | codepoint;
}

function __encode_utf8(text) {

    // Fill buffer with UTF-8
    // 使用 UTF-8 填充缓冲区
    for (var i=0; i<text.length; i++) {
        var codepoint = text.charCodeAt(i);
        __append_utf8(codepoint);
    }
    // Flush buffer
    if (length > 0) {
        var out_buffer = buffer.subarray(0, length);
        length = 0;
        return out_buffer;
    }

}

// 『你好』的 UTF-8 编码
// E4 BD A0
// 1110 0100 1011 1101 1010 0000
// E5 A5 BD
// 1110 0101 1010 0101 1011 1101
console.log(__encode_utf8("你好"));
```

总的来说 `__encode_utf8()` 这个方法最终实现了对 UTF-8 字符串的编码转换，上面给出的例子中，『你好』这两个汉字最终被编码为 `3-bytes` 的 `UTF-8`，分别是 `E4 BD A0` 和 `E5 A5 BD`。

看起来客户端这边没什么问题，那么我们再来查一查服务端的代码。

### Guacamole Server 对 UTF-8 的解码

先来看对 UTF-8 字符的处理是怎么实现的，由于 `guacd` 底层由 `C` 语言实现，就不再粘贴代码了，我们可以单独把 `/src/libguac/unicode.c` 和 `/src/libguac/guacamole/unicode.h` 这两个文件单独拿出来，注释掉 `unicode.c` 里面的 `#include "config.h"`，然后编写下面的 `main.cpp`：

```cpp
#include "unicode.h"
int main() {
    // 这里保存了『你好』的 UTF-8 编码
    char str[] = {0xE4, 0xBD, 0xA0, 0xE5, 0xA5, 0xBD, 0};
    guac_utf8_write(str[0], str, 6);
    printf("%s", str);
}
```

我们把三个文件一起编译 `gcc main.c unicode.c`，容易发现最后输出的确实是『你好』两个汉字，那么，究竟为什么最后还是没办法传递中文？

#### `guacd` 与 VNC 交互

首先我们需要定位到[src/common/guac_clipboard.c](https://github.com/glyptodon/guacamole-server/blob/425f7baa2b4c532086c5e418148a2d99a6912cd3/src/common/guac_clipboard.c)：

这个函数用于设置剪切板所粘贴文字的类型：

```c
void guac_common_clipboard_reset(guac_common_clipboard* clipboard, const char* mimetype) {
    clipboard->length = 0;
    strncpy(clipboard->mimetype, mimetype, sizeof(clipboard->mimetype)-1);
}
```

说明 `guacd` 在处理剪切板本身是没有问题的。

那么它在 `VNC` 上究竟是怎么处理剪切板的呢？[`/src/protocols/vnc/clipboard.c`](https://github.com/glyptodon/guacamole-server/blob/425f7baa2b4c532086c5e418148a2d99a6912cd3/src/protocols/vnc/clipboard.c)揭示了一切：


```c
int guac_vnc_clipboard_handler(guac_user* user, guac_stream* stream,
        char* mimetype) {

    /* Clear clipboard and prepare for new data */
    guac_vnc_client* vnc_client = (guac_vnc_client*) user->client->data;
    // 设置剪切板的类型
    guac_common_clipboard_reset(vnc_client->clipboard, mimetype);

    // 设置剪切板内容的处理方法
    /* Set handlers for clipboard stream */
    stream->blob_handler = guac_vnc_clipboard_blob_handler;
    stream->end_handler = guac_vnc_clipboard_end_handler;

    return 0;
}
int guac_vnc_clipboard_blob_handler(guac_user* user, guac_stream* stream,
        void* data, int length) {

    // 将数据拼接到剪切板中
    /* Append new data */
    guac_vnc_client* vnc_client = (guac_vnc_client*) user->client->data;
    guac_common_clipboard_append(vnc_client->clipboard, (char*) data, length);

    return 0;
}
void guac_vnc_cut_text(rfbClient* client, const char* text, int textlen) {

    guac_client* gc = rfbClientGetClientData(client, GUAC_VNC_CLIENT_KEY);
    guac_vnc_client* vnc_client = (guac_vnc_client*) gc->data;

    char received_data[GUAC_VNC_CLIPBOARD_MAX_LENGTH];

    const char* input = text;
    char* output = received_data;
    guac_iconv_read* reader = vnc_client->clipboard_reader;

    /* Convert clipboard contents */
    guac_iconv(reader, &input, textlen,
               GUAC_WRITE_UTF8, &output, sizeof(received_data));

    // 在这里设置剪切板内容
    /* Send converted data */
    guac_common_clipboard_reset(vnc_client->clipboard, "text/plain");
    guac_common_clipboard_append(vnc_client->clipboard, received_data, output - received_data);
    guac_common_clipboard_send(vnc_client->clipboard, gc);

}
```

`"text/plain"` 看起来完全没有问题，**Excuse me????????**，问题在哪儿？最后，终于查到了大坑原来在 VNC 协议本身身上。

## VNC 的大坑

最后的最后，我们终于把坑锁定在了 `VNC` 这个协议本身上，我们能够查到 [RFP, Remote Framebuffer Protocol](https://tools.ietf.org/html/rfc6143) 这个协议本身的描述，在 `7.5.6 ClientCutText` 和 `7.6.4 ServerCutText` 中：

> **7.5.6.  ClientCutText**
>
> RFB provides limited support for synchronizing the "cut buffer" of selected text between client and server.  This message tells the server that the client has new ISO 8859-1 (Latin-1) text in its cut buffer.  Ends of lines are represented by the newline character (hex 0a) alone.  No carriage-return (hex 0d) is used.  **There is no way to transfer text outside the Latin-1 character set.**

```
+--------------+--------------+--------------+
| No. of bytes | Type [Value] | Description  |
+--------------+--------------+--------------+
| 1            | U8 [6]       | message-type |
| 3            |              | padding      |
| 4            | U32          | length       |
| length       | U8 array     | text         |
+--------------+--------------+--------------+

```> **7.6.4.  ServerCutText**
>
> The server has new ISO 8859-1 (Latin-1) text in its cut buffer.  Ends of lines are represented by the newline character (hex 0a) alone.  No carriage-return (hex 0d) is used.  There is no way to transfer text outside the Latin-1 character set.

```
+--------------+--------------+--------------+
| No. of bytes | Type [Value] | Description  |
+--------------+--------------+--------------+
| 1            | U8 [3]       | message-type |
| 3            |              | padding      |
| 4            | U32          | length       |
| length       | U8 array     | text         |
+--------------+--------------+--------------+
```

在这两个消息的设计中，所有的内容均按照 `text/plain` 的方式进行传输，彻底忽略了剪切板中的 `minetype`，最终导致了无法传输除了 `ISO 8859-1` 标准规定以外的字符。## 一些扩展的思考

VNC 是个烂协议，这么烂的协议居然活到了 2016 年，那么我们有什么办法可以解决它呢？要知道，guacamole 本身实现的服务端 `guacd` 就可以将其称之为 `guacamole` 协议了。从最开始的架构图就可以看到，`guacd`本身并不仅仅只和 VNC 打交道，它还支持 `RDP` 这种远比 `VNC` 复杂得多也好得多的协议。但是，为什么我们还是希望用 `VNC`？因为 `VNC` 支持会话共享，而这正是  `RDP` 所做不到的事情。理论上看，我们可以在 `guacd` 底层动刀，复制出一个数据流，从而间接的支持会话共享，当然，这都是后话了。

关于会话共享，我们以后有时间再研究，这里有一个 `issue`：

- [Screen sharing support within Guacamole core](https://glyptodon.org/jira/browse/GUAC-844)