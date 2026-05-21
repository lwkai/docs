
# Django + Celery 定时任务完整入门

本文适合：

* Django 新手
* Python 后端新手
* 第一次使用 Celery
* 第一次做定时任务
* 第一次做 Redis 在线状态

目标：

> 从零彻底理解：
>
> * Celery 是什么
> * Beat 是什么
> * Worker 是什么
> * Redis 在里面干什么
> * Django 如何配置定时任务
> * 如何做在线用户清理

---

## 一、什么是定时任务？

定时任务：

就是：

> 到某个时间自动执行代码。

例如：

| 场景     | 示例          |
| ------ | ----------- |
| 在线状态清理 | 每分钟清理离线用户   |
| 订单超时   | 30分钟未支付自动取消 |
| 缓存刷新   | 每10分钟刷新缓存   |
| 数据统计   | 每天凌晨统计报表    |
| 邮件发送   | 每天9点发送邮件    |

---

## 二、为什么 Django 自带不了？

Django：

本身是：

```text id="rfahvv"
Web框架
```

负责：

* HTTP 请求
* API
* 数据库

但：

> 不负责后台长期运行任务。

所以：

需要：

```text id="jlwmqm"
Celery
```

---

## 三、什么是 Celery？

Celery

Celery：

是 Python 最流行的：

```text id="jlwm2y"
异步任务框架
```

作用：

* 后台执行任务
* 定时任务
* 异步任务
* 延迟任务

---

## 四、Celery 核心架构（最重要）

Celery 有三个核心角色：

| 角色     | 作用     |
| ------ | ------ |
| Django | 产生任务   |
| Beat   | 定时发送任务 |
| Worker | 真正执行任务 |
| Redis  | 消息队列   |

---

## 五、一定要理解：Beat 不执行任务

很多新手最大误区：

以为：

```text id="e5mjlwm"
Beat 会执行代码
```

实际上：

---

### Beat 只是：

```text id="jlwmm4"
定时器
```

它只负责：

```text id="0vjlwm"
到时间了
```

然后：

把任务丢给：

```text id="8xjlwm"
Redis
```

---

### 真正执行代码的是：

```text id="5qjlwm"
Worker
```

---

## 六、整体流程（非常重要）

---

### 1. Beat

每分钟：

```text id="4jlwm5"
发送 clean_online_users 任务
```

---

### 2. Redis

收到：

```text id="9rjlwm"
clean_online_users
```

---

### 3. Worker

从 Redis 拿到任务。

---

### 4. Worker

执行：

```python id="jlwm4m"
clean_online_users()
```

---

## 七、安装依赖

---

### 安装 Celery

```bash id="jlwm2n"
pip install celery
```

---

### 安装 Redis 驱动

```bash id="9jjlwm"
pip install redis
```

---

## 八、安装 Redis

Redis

Redis：

作用：

```text id="4sjlwm"
消息队列
```

Celery：

需要 Redis：

* 存任务
* 传递任务

---

## 九、启动 Redis

Linux：

```bash id="jlwmx1"
redis-server
```

Windows：

推荐：

* Docker
* WSL
* Redis Windows版

---

## 十、Django 配置 Celery

---

## 1. 创建 celery.py

项目目录：

```text id="jlwmx8"
my_project/
    celery.py
```

---

### celery.py

```python id="zjlwmv"
from celery import Celery
import os

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'my_project.settings'
)

app = Celery('my_project')

app.config_from_object(
    'django.conf:settings',
    namespace='CELERY'
)

app.autodiscover_tasks()
```

---

## 十一、**init**.py

```python id="3jlwm1"
from .celery import app as celery_app

__all__ = ('celery_app',)
```

---

## 十二、settings.py

---

### Redis 配置

```python id="vjlwm4"
CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'

CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'
```

---

## 十三、创建 tasks.py

例如：

```text id="jlwmc4"
apps/presence/tasks.py
```

---

### tasks.py

```python id="sjlwm6"
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task
def test_task():
    logger.error("定时任务执行了")
```

---

## 十四、配置定时任务

settings.py：

```python id="jlwmt9"
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'test-task': {
        'task': 'apps.presence.tasks.test_task',

        'schedule': crontab(minute='*/1'),
    },
}
```

---

## 十五、crontab 说明

| 配置       | 含义   |
| -------- | ---- |
| `*/1`    | 每分钟  |
| `*/5`    | 每5分钟 |
| `0`      | 整点   |
| `hour=0` | 凌晨0点 |

---

## 十六、启动 Celery

---

### 1. 启动 Worker

Linux：

```bash id="jlwmh2"
celery -A my_project worker -l info
```

Windows：

```bash id="2xjlwm"
celery -A my_project worker -l info -P solo
```

pyChar编辑器中命令行:
```bash
python -m celery -A my_project worker --loglevel=info --concurrency=1 -P solo
```
---

### 2. 启动 Beat

```bash id="m6jlwm"
celery -A my_project beat -l info
```
pyChar编辑器中命令行:
```
python -m celery -A my_project beat -l info
```
---

## 十七、非常关键：print 在哪里？

---

### print 不在 Beat 显示

因为：

```text id="7gjlwm"
Beat 不执行任务
```

---

### print 在 Worker 显示

因为：

```text id="9jlwmw"
Worker 才真正执行代码
```

---

## 十八、推荐：不要用 print

使用：

```python id="jlwmu0"
logger.error()
```

更稳定。

---

## 十九、Redis 在线状态设计（重点）

---

### 为什么用 ZSET？

因为：

ZSET：

```text id="jlwmz5"
支持按时间排序
```

适合：

* 在线状态
* 最近活跃
* 清理超时用户

---

## 二十、在线状态结构

---

### Key

```text id="jlwm7m"
presence:company:1
```

---

### Member

```text id="jlwmk0"
staff_id
```

---

### Score

```text id="8xjlwm"
最后活跃时间
```

---

## 二十一、用户心跳

```python id="jlwmv0"
timestamp = int(time.time())

redis_client.zadd(
    key,
    {
        staff_id: timestamp
    }
)
```

---

## 二十二、为什么 score 用时间戳？

因为：

可以：

```text id="3rjlwm"
根据时间判断在线
```

---

## 二十三、判断在线

例如：

60秒内活跃：

```python id="jlwmm2"
now = int(time.time())

online_users = redis_client.zrangebyscore(
    key,
    now - 60,
    "+inf"
)
```

---

## 二十四、清理离线用户

```python id="7djlwm"
redis_client.zremrangebyscore(
    key,
    0,
    now - 60
)
```

---

## 二十五、不要用 EXPIRE 判断在线

错误理解：

```text id="j7jlwm"
Key 存在 = 在线
```

---

正确理解：

```text id="jlwm94"
score 时间窗口 = 在线
```

---

## 二十六、EXPIRE 的真正作用

```python id="6mjlwm"
redis_client.expire(key, 86400)
```

只是：

```text id="n4jlwm"
防止长期没人使用的 company key 残留
```

不是：

```text id="vjlwm0"
在线机制
```

---

## 二十七、推荐参数

| 配置     | 推荐     |
| ------ | ------ |
| 心跳     | 30秒    |
| 在线超时   | 60~90秒 |
| 清理频率   | 1分钟    |
| EXPIRE | 7天     |

---

## 二十八、为什么有时删不掉？

最常见原因：

| 原因          | 说明          |
| ----------- | ----------- |
| 时间没超时       | score 还在窗口内 |
| key 错误      | 清理了别的 key   |
| Redis DB 错误 | db0/db1 不一致 |
| Redis 实例错误  | 连错 Redis    |
| GUI 未刷新     | Redis工具缓存   |

---

## 二十九、如何调试？

必须打印：

```python id="w5jlwm"
removed = redis_client.zremrangebyscore(...)

print(removed)
```

---

## 三十、查看 Redis 数据

Redis CLI：

```redis id="0rjlwm"
ZRANGE key 0 -1 WITHSCORES
```

---

## 三十一、最终推荐结构（生产级）

---

### 用户心跳

```python id="jlwmj7"
zadd
```

---

### 在线查询

```python id="n0jlwm"
zrangebyscore
```

---

### 定时清理

```python id="7xjlwm"
zremrangebyscore
```

---

### 长期过期

```python id="g7jlwm"
expire(7天)
```

---

## 三十二、新手最容易搞错的地方

---

### 1. Beat 不执行任务

真正执行的是：

```text id="wjlwm8"
Worker
```

---

### 2. print 不在 Beat 输出

输出在：

```text id="9wjlwm"
Worker
```

---

### 3. 在线判断不是看 member 是否存在

而是：

```text id="k0jlwm"
看 score 时间窗口
```

---

### 4. Redis EXPIRE 删除的是整个 key

不是：

```text id="x7jlwm"
单个 member
```

---

## 三十三、最终一句话总结

Celery：

```text id="0tjlwm"
Beat 负责“定时”
Worker 负责“执行”
Redis 负责“传递任务”
```

在线状态：

```text id="jlwm0j"
ZSET + 时间戳
```

核心思想：

```text id="z6jlwm"
时间窗口判断在线
而不是 Key 是否存在
```
