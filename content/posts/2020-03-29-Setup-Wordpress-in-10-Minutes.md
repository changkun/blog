---
date: 2020-03-29 18:36:02
id: 265
path: source/_posts/2020-03-29-Setup-Wordpress-in-10-Minutes.md
tags:
  - Wordpress
title: Setup Wordpress in 10 Minutes
---

Last week, my colleague asked me to set up a Wordpress server, and I remember how painful to setup it many years ago. It requires MySQL and PHP. Therefore, it may introduce many security leaks. My website at the moment still can receive Wordpress attack.

Today, I discovered a rapid solution to set up a Wordpress server using Docker, and it also solves the problem with Let's Encrypt.

Let's check it out.

<!-- more -->

Before we start, if you haven't configured your DNS, please go to DNS manager, setup A record for `@` and `www` and point them to the server, then we can start.

## Step1: Install Docker and Docker-Compose

If you argue, I could have use **Kubernetes**?
Well, you can if you like. I did this for my colleague, which doesn't profit myself much :)

```
$ apt update && apt upgrade -y
$ apt install docker.io docker-compose
```

## Step 2: Store everything in a directory

```
$ mkdir ~/wordpress
```

## Step 3: Setup WebProxy

Many thanks to @evertramos, he did everything for setting up the webproxy:


```bash
$ cd ~/wordpress
$ git clone https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion.git webproxy
$ mv webproxy/.env.sample webproxy/.env
```

Replace `.env` with the following content:

```conf
# ~/wordpress/webproxy/.env
NGINX_WEB=nginx-web
DOCKER_GEN=nginx-gen
LETS_ENCRYPT=nginx-letsencrypt
IP=0.0.0.0
NETWORK=webproxy
NGINX_FILES_PATH=./nginx-data
```

Then strat the script:

```bash
./start.sh
```

If you want to configure more options, please check out his repository.

## Step 4: Setup Wordpress

Again, thanks to @evertramos, he did everything for setting up the Wordpress:

```yaml
# ~/wordpress/docker-compose.yaml
version: '3'
services:
   db:
     container_name: ${CONTAINER_DB_NAME}
     image: mariadb:latest
     restart: unless-stopped
     volumes:
        - ${DB_PATH}:/var/lib/mysql
     environment:
       MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
       MYSQL_DATABASE: ${MYSQL_DATABASE}
       MYSQL_USER: ${MYSQL_USER}
       MYSQL_PASSWORD: ${MYSQL_PASSWORD}
   wordpress:
     depends_on:
       - db
     container_name: ${CONTAINER_WP_NAME}
     image: wordpress:latest
     restart: unless-stopped
     volumes:
       - ${WP_CORE}:/var/www/html
       - ${WP_CONTENT}:/var/www/html/wp-content
     environment:
       WORDPRESS_DB_HOST: ${CONTAINER_DB_NAME}:3306
       WORDPRESS_DB_NAME: ${MYSQL_DATABASE}
       WORDPRESS_DB_USER: ${MYSQL_USER}
       WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD}
       WORDPRESS_TABLE_PREFIX: ${WORDPRESS_TABLE_PREFIX}
       VIRTUAL_HOST: ${DOMAINS}
       LETSENCRYPT_HOST: ${DOMAINS}
       LETSENCRYPT_EMAIL: ${LETSENCRYPT_EMAIL}
networks:
    default:
       external:
         name: ${NETWORK}
```

Also, set up an `.env` file and change to corresponding configs:

```conf
# ~/wordpress/.env
NETWORK=webproxy
CONTAINER_DB_NAME=db
DB_PATH=~/wordpress/db
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=database_name
MYSQL_USER=user_name
MYSQL_PASSWORD=user_password
CONTAINER_WP_NAME=wordpress
WP_CORE=~/wordpress/core
WP_CONTENT=~/wordpress/content
WORDPRESS_TABLE_PREFIX=wp_
DOMAINS=domain.com,www.domain.com
LETSENCRYPT_EMAIL=your_email@domain.com
```

Then, we are ready to go:

```bash
$ docker-compose up -d
```

## Step 5: Setup SFTP

Note that in Wordpress, you will need to set up an SFTP server for the plugin and theme installation.

Activate an SFTP server that dedicated for the Wordpress, the first step is to secure the folder you open to the public:

```bash
$ chown -R www-data:www-data content
```

Then you need to enable the SFTP in SSH config, to edit the configuration, you need:

```bash
$ vim /etc/ssh/sshd_config
```

Then put the following information to the config file:

```conf
Match group sftp
ChrootDirectory ~/wordpress/content
X11Forwarding no
AllowTcpForwarding no
ForceCommand internal-sftp
```

Then restart the server:

```bash
$ service ssh restart
```

To use SFTP group, you need:

```bash
$ addgroup sftp
$ usermod -a -G sftp your_sftp_user
```

Done, and have fun :)