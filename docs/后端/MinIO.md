---
title: 设置MinIO某个桶为可访问
icon: mdi:database-outline
sort: 0
---
如何在命令行中，设置一个桶为可分开访问


首先要看你的 MINIO 在容器中的名称，用 docker ps 列出来

然后进入容器
```shell
docker exec -it minio /bin/sh
```
然后需要创建一个连接别名，如果已有，请跳过
```
mc alias set myminio http://127.0.0.1:9000 admin 123456
```
命令行显示：
```
Added `myninio` successfully.
```


然后设置一个桶为可分开访问
```shell
mc policy set download myminio/test-bucket
# 或者
mc anonymous set download myninio/test-bucket
#  如果是完全公开，则把 download 改为  public，我本次只公开访问，配置为 donload
```

服务器返回：
```shell
# 对应 download 的返回
Access permission for `myminio/test-bucket` is set to `download`
# 这个对应  public 的返回
Access permission for `myminio/test-bucket` is set to `public`
```