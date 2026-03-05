# Lua 脚本

```lua
-- KEYS[1]: IP 限流 Key, KEYS[2]: Device 限流 Key, KEYS[3]: NAT 集合 Key
-- ARGV[1]: IP 最大次数, ARGV[2]: Device 最大次数, ARGV[3]: 过期时间(秒), ARGV[4]: DeviceID

-- 1. 更新 NAT 设备集合（静默采集）
if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end

-- 2. 检查设备限流 (高压线)
local dev_curr = redis.call('get', KEYS[2])
if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
    return -1 -- 错误码 -1: 设备被封
end

-- 3. 检查 IP 限流 (基础线)
local ip_curr = redis.call('get', KEYS[1])
if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
    return -2 -- 错误码 -2: IP 被封
end

-- 4. 计数增加
local res_dev = redis.call('INCR', KEYS[2])
if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end

local res_ip = redis.call('INCR', KEYS[1])
if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end

return 1 -- 成功通过
```



这段 Lua 脚本是一个 **Redis 限流脚本**，实现了：

- ✅ IP 限流
- ✅ 设备限流（更严格）
- ✅ NAT 设备采集（记录一个 IP 下的设备集合）
- ✅ 原子执行（Redis Lua 保证整个脚本不可被打断）

我给你逐行详细解释 👇

------

# 🟢 参数说明

```lua
-- KEYS[1]: IP 限流 Key, KEYS[2]: Device 限流 Key, KEYS[3]: NAT 集合 Key
-- ARGV[1]: IP 最大次数, ARGV[2]: Device 最大次数, ARGV[3]: 过期时间(秒), ARGV[4]: DeviceID
```

### KEYS 数组

| 索引    | 含义             |
| ------- | ---------------- |
| KEYS[1] | IP 计数 key      |
| KEYS[2] | 设备 计数 key    |
| KEYS[3] | NAT 设备集合 key |

------

### ARGV 数组

| 索引    | 含义              |
| ------- | ----------------- |
| ARGV[1] | IP 最大允许次数   |
| ARGV[2] | 设备最大允许次数  |
| ARGV[3] | 过期时间（秒）    |
| ARGV[4] | 当前请求的设备 ID |

------

# 🟢 第 1 部分：更新 NAT 设备集合（静默采集）

```lua
if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end
```

### 第 1 行

```lua
if ARGV[4] ~= "" then
```

意思：

> 如果传入了 DeviceID（不为空字符串）

说明：

- 有些情况可能只做 IP 限流，没有设备号
- 这里做保护判断

------

### 第 2 行

```lua
redis.call('SADD', KEYS[3], ARGV[4])
```

执行 Redis 命令：

```
SADD NAT集合 设备ID
```

作用：

- 把当前设备 ID 加入 NAT 集合
- 自动去重（Set 结构）

用途：

> 统计一个 IP 下有多少设备（识别共享 IP、机房代理、NAT 行为）

------

### 第 3 行

```lua
redis.call('EXPIRE', KEYS[3], ARGV[3])
```

给 NAT 集合设置过期时间。

作用：

- 防止 NAT 集合永久增长
- 和限流窗口保持一致

------

# 🟢 第 2 部分：检查设备限流（高压线）

```lua
local dev_curr = redis.call('get', KEYS[2])
```

从 Redis 获取：

```
GET deviceKey
```

结果：

- nil → 还没计数
- 数字 → 当前设备访问次数

------

```lua
if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
```

意思：

- 如果当前设备已有计数
- 并且 >= 最大设备次数

------

```lua
return -1 -- 错误码 -1: 设备被封
```

直接返回 -1

含义：

| 返回值 | 意义         |
| ------ | ------------ |
| -1     | 设备限流触发 |

⚠️ 注意：

脚本立即结束
不会再执行 IP 计数

这就是：

> 设备限流优先级高于 IP 限流

------

# 🟢 第 3 部分：检查 IP 限流（基础线）

```lua
local ip_curr = redis.call('get', KEYS[1])
```

获取 IP 当前访问次数。

------

```lua
if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
```

如果 IP 次数 >= IP 最大次数。

------

```lua
return -2 -- 错误码 -2: IP 被封
```

返回 -2

| 返回值 | 意义        |
| ------ | ----------- |
| -2     | IP 限流触发 |

------

# 🟢 第 4 部分：计数增加

只有前面都没触发封禁，才会执行这里。

------

## 🟡 设备计数增加

```lua
local res_dev = redis.call('INCR', KEYS[2])
```

执行：

```
INCR deviceKey
```

作用：

- 设备访问次数 +1
- 如果 key 不存在，会自动创建并变成 1

------

```lua
if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end
```

意思：

> 如果这是第一次计数（值等于 1）

才设置过期时间。

目的：

- 形成固定时间窗口
- 避免每次请求都刷新过期时间

这是一种：

> 固定窗口限流算法（Fixed Window）

------

## 🟡 IP 计数增加

```lua
local res_ip = redis.call('INCR', KEYS[1])
```

IP 次数 +1。

------

```lua
if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end
```

同样：

- 第一次访问才设置 TTL
- 保证时间窗口固定

------

# 🟢 最终返回

```lua
return 1 -- 成功通过
```

表示：

| 返回值 | 含义     |
| ------ | -------- |
| 1      | 请求通过 |

------

# 🟢 整体执行逻辑流程图

```
1️⃣ 记录 NAT 设备
        ↓
2️⃣ 设备是否超限？
        ↓
      是 → 返回 -1
        ↓
3️⃣ IP 是否超限？
        ↓
      是 → 返回 -2
        ↓
4️⃣ 设备 +1
5️⃣ IP +1
        ↓
返回 1
```

------

# 🟢 返回码总结

| 返回值 | 含义     |
| ------ | -------- |
| 1      | 成功     |
| -1     | 设备限流 |
| -2     | IP 限流  |

------

# 🟢 这个脚本的设计优点

✅ 原子执行（Redis Lua）
✅ 设备优先级高
✅ 支持 NAT 采集
✅ 自动过期
✅ 无并发问题
✅ 轻量高性能

------

# 🟢 这属于什么限流算法？

这是：

> 固定时间窗口限流（Fixed Window Rate Limiting）

不是滑动窗口。

------

如果你愿意，我可以帮你：

- 🔥 改造成滑动窗口版本
- 🔥 改造成漏桶算法
- 🔥 加入 NAT 设备数量阈值控制
- 🔥 优化成生产级高并发版本

你这个设计已经很专业了 👍