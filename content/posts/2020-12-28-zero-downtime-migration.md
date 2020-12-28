---
date: 2020-12-28T07:41:45+01:00
toc: true
id: 270
slug: /posts/zero-downtime-migration
tags:
    - 博客
    - 运维
    - Traefik
title: Migration with Zero Downtime
---

在[这篇文章](https://blog.changkun.de/posts/all-in-go/) 中我介绍了
changkun.de 重新调整后的一个整体的架构，
但并没有仔细的介绍进行架构升级的过程是怎样的、升级过程中是否有进行停机等等。
这次我们就来简单聊一聊这个迁移过程。

<!--more-->

## 迁移清单

首先，changkun.de 服务器上运行了诸多服务，比如使用频繁的有 redir、midgard
等等，如图所示：

![](/images/posts/268/arch.png)

这些服务包括：

- https://changkun.de/s/main
- https://changkun.de/s/blog
- https://changkun.de/s/midgard
- https://changkun.de/s/redir
- https://changkun.de/s/upbot
- https://changkun.de/s/modern-cpp-tutorial

以及这两个曾经在 changkun.de 上部署，但目前已经重定向到 golang.design 的两个网站：

- https://changkun.de/s/go-under-the-hood
- https://changkun.de/s/gossa

迁移面临的几个重要的问题是：

1. 如何完成数据的迁移，尤其是 redir 所存储的短链接记录
2. 如何保证网站不掉线？
3. 如何适配并调整 GitHub Action 上的 CI 部署脚本？

changkun.de 的机器购买于 2016 年，因为一些特殊的原因，无法顺利的更新到 20.04 的发行版。
而且由于 Digital Ocean 本身的技术限制，甚至无法添加 VPC。相当于机器被整个锁死了：

![](/images/posts/270/legacy-node.png)

一个比较粗暴的方式就是直接购买一台新的机器，将所有的服务迁移到新的机器上，然后对域名进行切换。
但这种做法非常依赖服务本身对机器的依赖性，如果服务对机器的环境具有强依赖，则需要进行过多服务器
环境的配置，这也是为什么希望对所有现行服务进行容器化的一个重要原因：能够随时启动一台新的机器
并快速部署现有的服务。

接下来我们就来看看这个过程需要进行那些运维操作。

## 配置 Traefik

我们的目标是用上 Traefik 进行反向代理。我们就必须理解 Traefik 2 的基本工作原理。
Traefik 的工作原理本质上跟传统的反向代理并没有多少区别，反倒是发明了许多新的名词（新瓶旧酒），
比如静态配置、动态配置、路由、服务等等。这些概念其实在 Nginx 上也有体现。
比如说，Nginx 可以使用：

```
sudo service nginx reload
```

来实现 Traefik 中所谓 Dynamic Configuration 的更新；也可以通过

```
sudo service nginx restart
```

来实现 Traefik 中所谓 Static Configuration 的更新；
可以通过这样的配置来同时实现静态文件的访问：

```
server {
    server_name changkun.de;
    access_log /www/logs/www.changkun.de.access.log;
    error_log  /www/logs/www.changkun.de.error.log;
    root /www;
    index index.html;
    error_page 404 /404.html;
    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }
    ...
}
```

以及这样的配置 Traefik 中重定向的 Middleware：

```
server {
    ...
    rewrite ^/golang/(.*)$ https://golang.design/under-the-hood/$1 permanent;
    rewrite ^/gossa(.*)$ https://golang.design/gossa/$1 permanent;
    ...
}
```

甚至和 Traefik 中的 Service Proxy：


```
server {
    ...
    location ~ ^/(x|s|r)/ {
        proxy_pass http://0.0.0.0:9123;
        proxy_set_header Host            $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
    location = /upbot {
        proxy_pass http://0.0.0.0:9120;
        proxy_set_header Host       $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
    location /midgard/ {
        proxy_pass          http://0.0.0.0:9124;
        proxy_set_header    Host             $host;
        proxy_set_header    X-Real-IP        $remote_addr;
        proxy_set_header    X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header    X-Client-Verify  SUCCESS;
        proxy_set_header    X-Client-DN      $ssl_client_s_dn;
        proxy_set_header    X-SSL-Subject    $ssl_client_s_dn;
        proxy_set_header    X-SSL-Issuer     $ssl_client_i_dn;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 1800;
        proxy_connect_timeout 1800;
        client_max_body_size 2M;
    }
}
```

等等。当然，这样的配置比较基础，比如说，没有多个容器实例间的负载均衡。
不过既然我们已经决定更换到 Traefik，可以更加方便的利用容器的隔离性来解决均衡的问题。

### 静态配置

配置 Traefik 首先要解决的就是静态配置，这包括解决这几个问题：

1. EntryPoints：即对外开放的 Port
2. certificatesResolvers：即 TLS 证书
3. providers：即从何处获取动态配置的信息

Traefik 的 Provider 是一种配置发现的实现，支持的方式也非常多，
我个人比较偏好配置文件的形式，方便进行归类。所以选择了 File Provider。

比如下面的配置强制启用了 https、设置了证书的 resolver、并确定从文件获取动态配置：

```yaml
entryPoints:
  web:
    address: :80
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: :443
certificatesResolvers:
  changkunResolver:
    acme:
      email: hi@changkun.de
      storage: /etc/traefik/conf/acme.json
      httpChallenge:
        entryPoint: web
providers:
  file:
    directory: /etc/traefik/conf/
    watch: truef
```

### 动态配置

动态配置主要涵盖网站的路由信息，以 main 为例：

```yaml
http:
  routers:
    # github.com/changkun/main
    to-main:
      rule: "Host(`dev.changkun.de`)"
      tls:
        certResolver: changkunResolver
      middlewares:
        - main-errorpages
      service: main
  middlewares:
    main-errorpages:
      errors:
        status:
          - "404"
        service: main
        query: "/404.html"
  services:
    main:
      loadBalancer:
        servers:
        - url: http://main
```

最后 Traefik 通过 docker compose 创建，并附带一个 `traefik_proxy` 的 Docker 网络：

```yaml
version: '3'

services:
  traefik:
    container_name: traefik
    image: traefik:v2.2
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    networks:
      - proxy
    volumes:
      - ./traefik.yml:/etc/traefik/traefik.yml
      - ./conf:/etc/traefik/conf
      - ./logs:/logs
networks:
  proxy:
    driver:
      bridge
```

Traefik 还有非常花哨的 Dashboard：

![](/images/posts/270/traefik.png)

配置也非常的无痛：

```yaml
http:
  routers:
    dashboard:
      rule: Host(`traefik.changkun.de`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))
      service: api@internal
      tls:
        certResolver: changkunResolver
      middlewares:
        - auth
  middlewares:
    auth:
      basicAuth:
        users:
          - "changkun:password"
```

当然，整个动态配置涉及的内容还很多，可以在 [changkun.de/s/proxy](https://changkun.de/s/proxy)
处找到全部的配置。

## 服务的部署

仍然以主网站 changkun.de/s/main 为例，服务容器化后部署非常的直接：

```
make build && make up
```

部署完所有服务后，容器均处于正常运行状态了：

![](/images/posts/270/dockers.png)

可以看到，目前网站所运行的服务中有几个单点，原因在于：

1. Traefik：一台机器上只能部署一个
2. Midgard：有状态的服务
3. Redis：作为数据库使用

这里面的单点除了 Redis 可以被升级调整为集群之外，其他的两个均暂时无法进行扩展。

Midgard 应用自身包含了一个全局的剪贴板，存储在应用内部；
同时 Midgard 还维系了 Daemon 和 Server 之间的 Websocket 连接，是一个有状态的服务。

负载均衡本身有多种类型， Traefik 在集群环境下可以存在多个副本。
在多个不同的节点上进行负载均衡，而多个节点间的均衡可以利用更加低层级的均衡手段，
比如 DNS、链路层、网络层的均衡等等。但在 changkun.de 的单机环境下进行反向代理，
监听 80 和 433 目的就是对机器上的容器服务进行应用层负载均衡，也无法进行扩展。

## GitHub Action 部署脚本

### changkun/modern-cpp-tutorial

[changkun/modern-cpp-tutorial] 的部署有些棘手，因为项目本身需要构建 PDF，
这依赖了 [pandoc](https://pandoc.org/) 和 [texlive](https://www.tug.org/texlive/)。

早年为了加速构建流程，不必在每次更新的时候去安装一个完整的 textlive-full，
我提交过一个 changkun/modern-cpp-tutorial:build-env 的镜像。显然，容器包含了一个完整的
textlive-full，自然体积也是大得吓人。不过下载一个镜像总比 `apt install textlive-full`
来得方便。

在 modern-cpp-tutorial 这个仓库的 [github-action/workflow](https://github.com/changkun/modern-cpp-tutorial/blob/master/.github/workflows/website.yml) 中，
部署方式非常的粗暴，直接将构建完的文件 scp 到服务器上就完了。

那么不能服务静态文件的 Traefik，怎么适配这个部署流程呢？可以有两种做法：

1. 在服务器上编译：每次有新的提交时，登陆到服务器上完成构建

  这种做法的缺点是服务器必须去拉取最新的提交、消耗服务器资源进行构建，本质上跟直接上传构建文件并
  没有太多本质上的区别。

2. 保持原始的部署方式，在服务器上启动仅用于服务静态文件的 Nginx。比如下面的配置：

  ```yaml
  version: '3'
    services:
    www:
        image: nginx:stable-alpine
        restart: always
        volumes:
        - /www:/usr/share/nginx/html
        deploy:
        replicas: 3
        networks:
        - traefik_proxy
    networks:
    traefik_proxy:
        external: true
  ```

  服务了 /www 目录下的所有 assets。那么只需要将 modern-cpp-tutorial 编译后的文件
  上传到这个目录下就行了，甚至不需要对容器进行更新。

> - 如果你问我为什么不用 CDN？没钱，要不您打个赏？
> - 如果你问我为什么不用 Cloudflare？懒。一方面个人网站不想引入过多依赖；
>   另一方面，[golang.design](https://golang.design) 启用了 Cloudflare，
>   也算是和 changkun.de 做是一个 A/B 对照。

简单的思考后，决定使用第二种方案。让 modern-cpp 作为一个特例（因为在一个 C++ 的教程里面用 Go 来
打包静态文件似乎有些不太合适，用 C++ 实现起来相对来说工作量远大于用 Go 进行实现）存在。

对于这个决策而言，不需要对 modern-cpp-tutorial 仓库本身进行任何更新，只需要更新一下
仓库的 secrets，比如访问服务器的私钥、登陆用户的用户名、上传的路径等信息。

### changkun/blog

除了 modern-cpp-tutorial 之外，另一个使用了 GitHub Action CI 服务的仓库就是这个博客本身。
虽然播客也可以直接用上面提到的第二种方案直接上传静态文件，但为了实现最初的目标，
最终选择了第一种做法：

```
ssh $USER@$DOMAIN "cd changkun.de/blog && git fetch && git rebase && make build && make up"
```

即通过 GitHub Action 登陆到服务器上、拉取仓库、构建、并更新，也算是作为方法 2 的一种对照。

## DNS 更新

没什么可说的，确定服务部署完毕后在 dev.changkun.de 域名下没有访问问题，
把 changkun.de 的 DNS 记录指向新的机器就行了。

整个迁移过程中 [upbot](https://changkun.de/s/upbot) 没有任何报警，
说明对于所有现行服务而言，我们的零宕机迁移是成功的 :)

## 总结

这篇文章介绍了 changkun.de 如何在不宕机的情况下从一台机器迁移到另一台机器。
在生产环境下，数据库服务会被部署到额外的节点上，而应用服务本身会通过 URL 来建立连接。

好在 changkun.de 网站本身在并没有引入太多的数据量，进而这个迁移过程并不涉及太多数据的迁移。
也就能够正常的将数据从一台机器直接拷贝到另一台机器。

所有的服务首先通过 dev.changkun.de 上线，当确定所有的服务都可用时，
再调整根域名 changkun.de 的 DNS，实现无缝切换。

对于使用 CI 部署的服务而言，目前采用了两套不同的方法：

1. `modern-cpp`: 在 GitHub Action 上编译好静态文件，统一上传到服务器上；
2. `blog`: 在 GitHub Action 上直接访问服务器，在服务器上进行编译和运行。

虽然这个过程可以做得更「政治正确」，比如搭建诸如 Jenkins 的私有构建系统，仅接受 GitHub 仓库的
Web Hook；直接在机器上构建并更新；又比如可以购买额外的 Docker Registry 空间，
构建并发布到 Registry 后，再通知机器完成镜像的更新；或是更加优雅的上 k8s，用上 Helm...

但谨记：「过早优化是万恶之源」。
