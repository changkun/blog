---
title: Guacamole Source Analysis
tags:
  - 源码分析
  - C
  - Guacamole
  - Apache
date: 2018-08-14 07:39:53
id:
---

This article explains how Apache [Guacamole](https://guacamole.apache.org/) works.

```
guacamole_deamon
     |
     |
     v
guacd_connection_thread --> guacd_user_thread
                     |              |
                     |              +-----> guac_vnc_client_thread / guac_rdp_client_thread / 等 
                     |              |                  |
                     |              |                  +-----> __guac_socket_keep_alive_thread 
                     |              |
                     |              +-----> guac_user_input_thread
                     |
                     +---> guacd_connection_io_thread --> guacd_connection_write_thread
```

## 