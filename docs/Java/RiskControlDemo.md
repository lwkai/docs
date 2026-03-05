# 自定义注解 + 拦截器 实现 安全令牌

自定义注解 + 拦截器 实现 登录/注册 等关键位置的安全令牌功能，

业务风控 / 防爬防撞库（人机挑战 / 人机校验 / 安全令牌 / 挑战响应机制 / 设备指纹 ）

要实现只拦截指定接口（如注册、登录），最优雅且符合 Spring Boot 习惯的做法是使用 **自定义注解 + 拦截器**。

这样你就不需要在拦截器的配置类里写死一长串的 URL 路径，而是直接在 Controller 的方法上“点石成金”。

### 1. 实现方案：自定义注解拦截

#### 第一步：创建注解 `@RiskCheck`

创建一个运行时注解，用来标记需要进行 RiskToken 校验的方法。


```Java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RiskCheck {
    // 可以扩展参数，比如：校验强度等级
    boolean required() default true;
}
```

#### 第二步：修改拦截器逻辑

在拦截器中，通过反射判断当前访问的方法是否有该注解。


```Java
@Component
public class RiskInterceptor implements HandlerInterceptor {

    @Autowired
    private RiskSecurityUtils riskSecurityUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 如果不是映射到方法（比如静态资源），直接放行
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 2. 检查方法上是否有 @RiskCheck 注解
        RiskCheck riskCheck = handlerMethod.getMethodAnnotation(RiskCheck.class);
        
        // 3. 如果没有注解，说明不需要 Risk 校验，直接放行
        if (riskCheck == null || !riskCheck.required()) {
            return true;
        }

        // 4. 执行核心校验逻辑
        String riskToken = request.getHeader("X-Risk-Token");
        String deviceId = request.getHeader("X-Device-ID");

        if (StringUtils.isEmpty(riskToken) || !riskSecurityUtils.verifyToken(riskToken, deviceId)) {
            // 校验失败，抛出自定义异常或返回错误信息
            throw new RuntimeException("Risk verification failed");
        }

        return true;
    }
}
```

#### 第三步：在 Controller 中使用

你只需要在特定的接口上加上注解即可：


```Java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    @RiskCheck // 只有这个接口会被拦截逻辑处理
    public Result login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    @GetMapping("/config")
    public Result getPublicConfig() { // 这个接口不带注解，直接放行
        return Result.success();
    }
}
```
#### 最后，拦截器，需要在 WebConfig.java 中配置，才会生效

```Java
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

	// 由 Spring 注入
    private final RiskInterceptor riskControllInterceptor;
    
    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(Objects.requireNonNull(riskControllInterceptor)) // 直接使用注入的实例
                .addPathPatterns("/api/**").excludePathPatterns(
                    "/api/*/auth/risk" // 排除获取 riskConfig 中生成Risk Token 的密钥接口
                );
    }
}
    
```
------

### 2. 除了注册登录，还有哪些接口需要拦截？

在实际业务中，除了登录注册，以下场景通常也需要 `X-Risk-Token` 保护：

#### A. 账户安全类（重灾区）

- **找回密码/修改密码：** 防止黑客利用撞库拿到的手机号进行暴力重置。
- **更换绑定手机号/邮箱：** 涉及账号归属权，必须防范自动化脚本。
- **注销账号：** 防止恶意操作导致用户数据丢失。

#### B. 资金与价值类

- **支付/提现下单：** 防止“中间人攻击”或模拟请求进行非法转账。
- **虚拟货币消耗（如金币、积分）：** 防止外挂自动化消耗用户资产。
- **绑定银行卡/实名认证：** 涉及敏感个人隐私。

#### C. 营销与反薅羊毛

- **领取大额优惠券：** 防止羊毛党批量刷券。
- **抽奖接口：** 防止通过脚本实现高频率抽奖。
- **抢购/秒杀下单：** 防止脚本抢占库存。

#### D. 内容合规与防灌水

- **发布评论/动态（首发）：** 尤其是新账号的前几次发帖。
- **批量私信/打招呼：** 社交软件中防止营销号骚扰。

### 总结建议

1. **分级防御：** 将所有接口分为 **公开(Public)**、**需登录(Auth)**、**高风险(Risk)** 三类。
2. **默认关闭：** 默认不开启 Risk 校验，只对上述高风险接口手动添加 `@RiskCheck`。
3. **灰度策略：** 如果由于 `X-Risk-Token` 逻辑变动担心影响业务，可以在注解里加个参数，结合配置中心实现“只验证、不拦截”的观察模式，等线上数据稳定后再真正拦截。

这种**基于注解**的方式，能让你的 `AuthController` 保持清晰的转发职责，同时让安全逻辑变得非常灵活。
