# 配置网络IP地址



## 直接修改配置文件

配置文件位置：
```shell
/etc/NetworkManager/system-connections/enp4s0.nmconnection
```
enp4s0.nmconnection  这个是每个系统在安装，对应系统网卡生成的，每个系统都可能不一样，根据你的来，扩展名是一样的 `.nmconnection`



编辑上述文件，找到配置文件中的 `[ipv4]`

```ini
[ipv4]
method=auto  # IP地址的方式  auto 表示自动获取  manual 表示静态IP
addresses=192.168.1.100/24  #这是配置IP地址，对应静态IP方式，动态IP则不需要配置此项
gateway=192.168.1.1  # 这是配置网关，对应静态IP方式，动态IP则不需要配置此项
dns=114.114.114.114;8.8.8.8; # 这是配置DNS，每个DNS后面分号结束，动态IP则不需要配置

```

然后保存，重启，尝试用下面命令重启，好像没有生效

```shell
systemctl restart NetworkManager
```



