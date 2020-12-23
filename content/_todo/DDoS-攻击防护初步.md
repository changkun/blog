title: DDoS 攻击防护初步
id: 1083
comment: false
tags:
  - 随笔
tags:
---

服务器遭受到大量的大量SYN_RECV，80端号占死，网站打不开，没有硬防方法

1.
[code lang="shell"]
sysctl -w net.ipv4.tcp_syncookies=1 #启用使用syncookies
sysctl -w net.ipv4.tcp_synack_retries=1 #降低syn重试次数
sysctl -w net.ipv4.tcp_syn_retries=1 #降低syn重试次数
sysctl -w net.ipv4.tcp_max_syn_backlog=6000 #最大半连接数
sysctl -w net.ipv4.conf.all.send_redirects=0 
sysctl -w net.ipv4.conf.all.accept_redirects=0 #不接受重定向的icmp數據包
sysctl -w net.ipv4.tcp_fin_timeout=30 
sysctl -w net.ipv4.tcp_keepalive_time=60 
sysctl -w net.ipv4.tcp_window_scaling=1 
sysctl -w net.ipv4.icmp_echo_ignore_all=1 #禁止ICMP
sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=1 #ICMP禁止广播
[/code]
2.限制单位时间内连接数
[code lang="shell"]
iptables -N syn-flood 
iptables -A FORWARD -p tcp --syn -j syn-flood 
iptables -A INPUT -p tcp --syn -j syn-flood
iptables -A syn-flood -p tcp --syn -m limit --limit 3/s --limit-burst 1 -j ACCEP
iptables -A syn-flood -j DROP
iptables -A INPUT -i eth0 -p tcp ! --syn -m state --state NEW -j DROP 
iptables -A INPUT -p tcp --syn -m state --state NEW -j DROP
[/code]
3 如果还是不行
[code language="lan"][/code]
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --update --seconds 60 --hitcount 30 -j REJECT
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --set -j ACCEP

如攻击过来的流量大于你的服务器的流量，那就没有什么办法了，如果流量不大，以上方法，可以暂时保证你的80可以访问