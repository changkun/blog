---
date: "2017-06-21 01:35:57"
toc: true
id: 232
slug: /posts/hexo-github-travis-ci-vps-ci-cd
aliases:
    - /archives/2017/06/232/
tags:
    - DevOps
    - 运维
    - 博客
title: Hexo + GitHub + Travis CI + VPS 自动部署
---

最近和朋友交流到 Hexo 博客的自动部署问题。其实很早以前我就思考过，由于博客是部署在阿里云上的，而 Hexo 从
本地部署到阿里云这个过程要走国际线路，上传时非常缓慢，于是决定利用 Travis CI 来实现自动构建及部署。

## 博客的源码结构

这个博客的源码其实从上次维护开始就完全通过 GitHub 私有项目进行托管了。这里截个图可看，大概是这个样子：

![](/images/posts/232/1.png)

<!--more-->

## 开启 Travis CI

这个步骤很简单，直接在 Travis CI 里面开启项目就好。

## 创建部署时的 SSH Key

```bash
ssh-keygen -f travis # 随便找个位置生成
# 然后把 travis.pub 的内容添加到服务器的 ~/.ssh/authorized_keys 中


# 安装 travis 工具
sudo gem install travis
travis login --auto --pro # 私有项目，所以添加 --pro
travis encrypt-file travis -add
# 这个过程伴随着一些询问过程，选对项目然后就会生成一个 travis.enc 的文件
# 我把他保存在项目目录下的 .travis 文件夹下
```

## 编写 `.travis.yml`

实话说，Travis CI 的环境很奇怪，下面这个 yml 测试了很久，仅供参考：

```yml
sudo: required
dist: trusty
group: edge
language: node_js
node_js: stable
python:
  - "3.4"
branches:
  only:
  - master
cache:
  apt: true
  yarn: true
  directories:
  - node_modules
addons:
  ssh_known_hosts:
  - changkun.us:38438
before_install:
- openssl aes-256-cbc -K $encrypted_3277e6996e70_key -iv $encrypted_3277e6996e70_iv -in .travis/travis.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- git config --global user.name "Changkun Ou"
- git config --global user.email "hi[_at_]changkun.de"
- sudo apt-get -qq update
- sudo apt-get install -y pandoc
- sudo apt-get -y install python3-pip python-dev
- sudo pip3 install -U setuptools
- sudo pip3 install -U virtualenvwrapper
- python3 -V
- pip3 -V
install:
- pip3 install -r requirements.txt
- npm install hexo-cli -g
- yarn
- git clone https://github.com/changkun/hexo-theme-next themes/hexo-theme-next
- cp config/site_config.yml _config.yml
- cp config/theme_config.yml themes/hexo-theme-next/_config.yml
script:
- make repair
- make g
- make mini
after_success:
- make dep
```

## 几个值得注意的点

1. Travis 在运行失败之后可以启用 Debug 模式通过 ssh 远程登录上去进行调试，不用反复 commit 来出发下一次
的构建调试；

2. `known_hosts` 的添加非常重要，因为每次通过 git 部署时会连接 VPS，而 Travis 在自动构建部署的过程中是
不能够输入的，所以非加不可，否则无法完成构建；

3. 仔细检查 ssh 的权限设置问题，例如 id_rsa 的权限不能太高，需要改为 600，VPS 端需要正确的添加好公钥；

4. Travis 上 pip3 包的安装不能使用 sudo，多语言环境的构建过程（node+python）可以选择其一作为主要语言，
另一部分通过 before_install 来完成依赖环境安装。

5. 多输出，对整个构建过程的监控非常有帮助。