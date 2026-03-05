# 风控相关



##  “拦截器（或过滤器）”这种统一处理方式



### 职责单一制  和  防御深层化 的原则



把“进门前的检查”交给拦截器，把“进门后的惩罚”留在业务层



| **代码逻辑**                    | **归属地**                 | **迁移原因**                                                 |
| ------------------------------- | -------------------------- | ------------------------------------------------------------ |
| **IP 维度限流**                 | **拦截器 (Interceptor)**   | 这是典型的“流量守门员”工作。不管用户名对错，高频请求直接在外面挡掉，保护数据库。 |
| **设备维度限流**                | **拦截器 (Interceptor)**   | 同上。在大厂中，DeviceID 校验是全局性的安全切面。            |
| **账号失败次数检查 (阶梯锁定)** | **AuthServiceImpl (保留)** | **必须留在这里**。因为拦截器无法提前知道用户输入的 `username` 是否真实存在，或者是否需要针对特定用户执行锁定。 |
| **验证码校验 (阶梯 A)**         | **AuthServiceImpl (保留)** | 验证码通常和具体的登录操作（用户名密码）强绑定。             |

#### 在拦截器中处理“流量清洗”

将IP 和 DeviceID 的物理限流移出业务代码，放在拦截器中,当前该文件所在目录  `config/interceptor/`

```JAVA
// RiskControlInterceptor.java
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String ip = request.getRemoteAddr();
    String deviceId = request.getHeader("X-Device-ID");

    // 1. IP 限流（迁移自 AuthServiceImpl）
    if (!redisUtils.isAllowed("limit:ip:" + ip, 10, 60)) {
        throw new BusinessException(429, "操作频繁，请1分钟后再试");
    }

    // 2. 设备限流（新增的大厂增强维度）
    if (StringUtils.isNotBlank(deviceId)) {
        if (!redisUtils.isAllowed("limit:device:" + deviceId, 5, 60)) {
            throw new BusinessException(429, "当前设备尝试频繁");
        }
    }
    return true;
}
```

#### 现在瘦身后的 `AuthServiceImpl`
现在的 `login` 方法变得非常干净，只关注“账号安全”逻辑。

```java
public LoginResponse login(LoginRequest request, HttpServletResponse response) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. 账号锁定检查 (属于业务风控，保留)
    checkAccountLockStatus(failKey);

    // 2. 验证码校验 (属于业务流程，保留)
    handleCaptchaIfNecessary(request, failKey);

    try {
        // 3. 核心认证逻辑
        User dbUser = userService.authenticate(username, request.getPassword());
        
        // 登录成功清空计数
        redisTemplate.delete(failKey);
        
        // 生成令牌等后续操作...
        return responseData;
        
    } catch (BadCredentialsException e) {
        // 4. 只有认证失败才增加计数
        handleLoginFailure(failKey);
        throw new BusinessException(401, "用户名或密码错误");
    }
}
```
### 为什么要这样拆？（大厂思维）

1. **保护数据库（DB Protection）**： 如果 IP 限流写在 Service 里，恶意攻击者每分钟发 10000 个请求，Spring 依然要创建 Service 实例、解析参数、甚至可能触发数据库连接。移到拦截器后，这些无效流量在进入核心业务层之前就被丢弃了。
2. **解耦与复用**： 你的 `javademo` 以后可能有“修改支付密码”、“绑定手机号”等接口。如果你把 IP/设备限流写在拦截器里，只需在 `WebConfig` 配置一下路径，这些接口就自动获得了防刷能力，而不需要去每个 Service 里复制粘贴。
3. **精确计数**： 现在的代码中，如果验证码输错了，也会触发 `catch` 导致失败计数加 1。在大厂逻辑里，这叫“误杀”。通过拆分，只有真正的**密码错误**才会触发账号锁定计数，逻辑更严密。





### 为什么更青睐“统一拦截器”

#### A. 建立“灰度风控”

拦截器不只是“拦截”，它通常负责**数据采集**。

- **登录前**：拦截器记录 IP 和 DeviceID，并放入 `ThreadLocal`。
- **登录中**：业务逻辑直接从 `ThreadLocal` 读，不需要再去解析 Request。
- **登录后**：拦截器根据业务结果（成功/失败）更新 Redis 指纹画像。 这种**全生命周期的监控**，在分散的 Service 方法里是很难做到的。



#### B. 应对“零日漏洞”的快速响应

如果某天发现一种新型攻击专门针对“忘记密码”接口，在大厂里：

- **方式一（Service）**：需要改代码、测试、走发布流程，可能需要几个小时。
- **方式二（统一拦截器）**：运维或安全人员直接在动态配置中心（如 Apollo/Nacos）给拦截器加一个路径过滤规则，**秒级生效**，瞬间封死攻击路径。

#### C. 接口安全等级管理

大厂会将接口分为不同等级：

- **L1 (公开)**：如首页，不校验 DeviceID。
- **L2 (普通操作)**：如看评论，校验 DeviceID 但不限流。
- **L3 (高危)**：如登录、支付，强制校验 DeviceID 且执行严格限流。 拦截器可以根据注解或路径模式（AntPathMatcher）完美实现这种**精细化控制**。



在大厂的生产环境里，风控拦截器不仅要“拦得住”，还要“跑得快”。为了保证在高并发登录请求下，限流计数不会因为网络延迟或并发导致失效，我们必须使用 **Redis + Lua 脚本**。

以下是为你设计的 `RiskControlInterceptor` 核心实现方案。

------

### 1. 核心：Redis Lua 脚本 (保证原子性)

为什么非要用 Lua？因为 `get`、`incr`、`expire` 这三步如果分开执行，在高并发下会导致计数不准（竞态条件）。Lua 脚本可以像数据库事务一样，把这几步合成一个原子操作。

你可以在项目的 `resources` 目录下新建 `lua/limit.lua`，或者直接在代码中定义：

Lua

```lua
-- KEYS[1]: 具体的限流 Key (如 limit:ip:1.2.3.4)
-- ARGV[1]: 允许的最大尝试次数
-- ARGV[2]: 时间窗口(秒)

local current = redis.call('get', KEYS[1])
if current and tonumber(current) >= tonumber(ARGV[1]) then
    return 0 -- 失败：触发限流
else
    local res = redis.call('incr', KEYS[1])
    if tonumber(res) == 1 then
        redis.call('expire', KEYS[1], ARGV[2])
    end
    return 1 -- 成功：计数增加并放行
end
```

------

### 2. 拦截器实现：多维度综合判定

我们将 IP 和 DeviceID 放在拦截器。注意：**User 维度的锁定通常留在 Service**，因为拦截器在 `preHandle` 阶段很难优雅地处理复杂的业务登录失败计数，但我们可以把“物理限流”放在这里。


```java
@Component
@RequiredArgsConstructor
public class RiskControlInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DefaultRedisScript<Long> limitScript; // 注入上面定义的 Lua 脚本

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 1. 获取特征码
        String ip = getClientIp(request);
        String deviceId = request.getHeader("X-Device-ID");
        // 也可以从参数中预取 username (可选)
        String username = request.getParameter("username");

        // 2. IP 维度检查 (每分钟 10 次)
        checkLimit("limit:ip:" + ip, 10, 60, "操作频繁，请稍后再试");

        // 3. 设备维度检查 (每分钟 5 次 - 更严格)
        if (StringUtils.isNotBlank(deviceId)) {
            checkLimit("limit:device:" + deviceId, 5, 60, "当前设备请求过快");
        }
        
        // 4. 用户维度物理限流 (防止针对单个账号的瞬间超高并发爆破)
        if (StringUtils.isNotBlank(username)) {
             checkLimit("limit:user:freq:" + username, 20, 60, "账号请求过多");
        }

        return true;
    }

    private void checkLimit(String key, int max, int window, String msg) {
        Long result = redisTemplate.execute(limitScript, Collections.singletonList(key), max, window);
        if (result == null || result == 0) {
            throw new BusinessException(429, msg);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        // 大厂规范：考虑负载均衡(Nginx)后的真实IP
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
```

------

### 3. AuthServiceImpl：业务风控逻辑 (精简版)

现在的 `AuthServiceImpl` 只需要处理“密码错误导致的阶梯锁定”，这属于**业务风控**。


```java
public LoginResponse login(LoginRequest request) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. 检查是否处于阶梯锁定状态 (5次失败后的15分钟锁定)
    Integer failCount = getFailCount(failKey);
    if (failCount >= 5) {
        throw new BusinessException(423, "账号已锁定，请稍后再试");
    }

    // 2. 验证码校验 (3次失败后的强制要求)
    if (failCount >= 3) {
        validateCaptcha(request); 
    }

    try {
        // 3. 数据库逻辑...
        // 成功则删除 failKey
    } catch (BadCredentialsException e) {
        // 4. 只有认证失败才记录，逻辑更严密
        updateFailCount(failKey);
        throw e;
    }
}
```

------

### 4. 为什么要这样分层？

- **拦截器 = 物理屏障**：它的目标是**保护服务器资源**。不管你账号对不对，只要你发得太快，我就把你当成机器人乱棍打死，不让你消耗 CPU 和数据库连接。
- **Service = 业务逻辑**：它的目标是**账户安全**。它处理的是“密码输错”这种正常用户也可能发生的操作，提供的是“验证码”、“账号找回”等有温度的业务流程。





## 前端生成 `X-Device-ID`

如果你使用 Vue 或 React，可以写一个全局的 Axios 拦截器，确保每一笔请求都带上这个“身份证”。

```js
// frontend/src/utils/request.js
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const service = axios.create();

service.interceptors.request.use(async config => {
    // 优先从本地缓存取，没有则生成
    let deviceId = localStorage.getItem('X-Device-ID');
    if (!deviceId) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('X-Device-ID', deviceId);
    }
    
    // 注入请求头
    config.headers['X-Device-ID'] = deviceId;
    return config;
});
```





### 架构优势总结

1. **分层防御**：
   - **拦截器** 挡住 **“流量洪峰”**（不管账号对不对，先看你发得快不快）。
   - **Service 层** 挡住 **“暴力破解”**（看你密码对不对，输错几次锁账号）。
2. **弹性扩容**：
   - 自动识别局域网/NAT 环境，有效降低了“办公室用户”被集体误伤的概率。
3. **原子安全性**：
   - 使用 Lua 脚本确保了在高并发下，Redis 的 `get-check-set` 过程不会出现并发 bug。



## 在WEB端和移动端加构中，是否需要所有接口都带上 X-Risk-Token 和 X-Device-ID



在当前大厂（如字节、阿里、美团等）的移动端或 Web 端架构中，**并不是所有接口都强制带上 `X-Risk-Token`**，但 `X-Device-ID` 几乎是全量接口的标准配置。

以下是两种策略的详细对比以及主流大厂的实践做法：

------

## 1. 行业主流做法：分级防控 (Tiered Control)

大厂通常采用“**常态化设备标识 + 关键节点风险校验**”的组合模式。

### **A. 全量带上：`X-Device-ID` (设备指纹/标识)**

- **覆盖范围：** 99% 的接口（包括埋点、配置拉取、业务请求）。
- **目的：** 用于**用户行为分析**、**灰度发布**、**设备黑名单**、以及基础的限流。
- **大厂实践：** 无论用户是否登录，Header 中都会携带一个唯一的 `Device-ID` 或 `Fingerprint-ID`。

### **B. 关键节点带上：`X-Risk-Token` (风险令牌)**

- **覆盖范围：** 仅限“高风险”或“敏感”接口。
- **场景举例：**
  - **登录/注册/找回密码**（防止撞库、机器注册）。
  - **支付/提现/修改绑定手机**（资金安全）。
  - **营销活动领券/抽奖**（防止羊毛党）。
  - **发布评论/私信**（防止垃圾信息灌水）。
- **原因：** `Risk-Token` 的计算通常涉及复杂的指纹收集和加解密，如果全量带上，会增加前端功耗和后端的解密压力（计算成本）。

------

## 2. 方案对比表

| **维度**       | **方案一：仅登录/敏感接口带**                           | **方案二：全量接口带**                                  |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| **性能损耗**   | **低**（后端只在特定接口做校验）。                      | **高**（拦截器每单请求都要解密校验）。                  |
| **开发复杂度** | **中**（需要定义哪些接口是“敏感”的）。                  | **低**（一劳永逸，拦截器全挡住）。                      |
| **安全性**     | **高**（针对性防御，攻击者难以模拟核心逻辑）。          | **极高**（理论上全链路防爬，但容易误伤）。              |
| **大厂趋势**   | **主流**（如：业务网关根据路由标签判断是否校验 Risk）。 | **少见**（除非是极高安全等级的应用，如银行/电子钱包）。 |

------

## 3. 为什么“全量带 RiskToken”在实际中很难推广？

1. **性能瓶颈：** `Risk-Token` 的生成通常依赖 `tempKey`。如果全量带，意味着前端每发一个普通请求（比如获取个人头像），都要重新计算 Token，后端还要查 Redis 校验，这会导致响应延迟明显增加。
2. **前端体验：** 如果 `tempKey` 更新失败，会导致用户连“刷个动态”都看不了，这种**“误伤”**对用户体验是致命的。
3. **CDN 缓存失效：** 很多只读接口（如商品详情页）是可以在 CDN 缓存的。如果加上了动态生成的 `X-Risk-Token`，CDN 就无法有效缓存这些请求。

------

## 4. 架构建议

如果你现在的项目处于增长期，我建议你采取**“网关动态校验”**模式：

1. **默认配置：** 所有接口在 Header 中携带 `X-Device-ID`。
2. **动态拦截：** 定义一个注解（如 `@RiskCheck`），只加在 `LoginController`、`PayController` 等敏感接口上。
3. **拦截器逻辑：**
   - 拦截器检查目标方法是否有 `@RiskCheck`。
   - 如果有，执行 `X-Risk-Token` 校验逻辑（解密、有效期检查、`tempKey` 消耗）。
   - 如果没有，直接放行。

### **总结：**

**大厂用得更多的是：** **全量带 `Device-ID`，仅在登录及敏感业务接口带 `Risk-Token`。**



