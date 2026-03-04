# 风控相关



# “拦截器（或过滤器）”这种统一处理方式

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