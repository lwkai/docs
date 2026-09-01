---
title: Spring `@ConditionalOnExpression` 使用笔记
icon: mdi:database-outline
sort: 6
---

# Spring `@ConditionalOnExpression` 使用笔记

## 1. 它解决什么问题

按**配置开关**决定某个 Bean 是否注册进 Spring 容器。典型场景：同一接口有 **Mock 实现**和**真实实现**，用配置在两者间切换，不用改代码、不用手动注释 `@Service`。

## 2. 基本语法

```java
@ConditionalOnExpression("${配置项.key:默认值}")
```

执行分两步：

1. **占位符解析**：把 `${...}` 替换成 Environment 里的实际值（找不到则用冒号后的默认值）；
2. **SpEL 求值**：把替换后的字符串当 SpEL 表达式计算，结果为 `true` → Bean 注册，`false` → 跳过。

## 3. 核心规则：默认值何时生效（最容易踩坑）

| 属性状态 | 实际取值 | 默认值是否生效 |
| :--- | :--- | :--- |
| 属性存在，值 = `true` | `true` | ❌ 忽略 |
| 属性存在，值 = `false` | `false` | ❌ 忽略 |
| 属性**完全不存在** | 冒号后的默认值 | ✅ 生效 |
| 属性存在但值为空（`mock.llm:`） | 空字符串 | ❌ 忽略 → SpEL 求值报错 |

**口诀：有值用值，无值用默认。默认值只在「这个 key 从没在任何地方出现过」时才兜底，一旦配置过就彻底失效。**

## 4. 可以在哪些地方配置这个值

按**优先级从高到低**（高的覆盖低的）：

| 优先级 | 配置来源 | 示例 |
| :--- | :--- | :--- |
| 1（最高） | 命令行参数 | `java -jar app.jar --mock.llm=true` |
| 2 | Java 系统属性 | `-Dmock.llm=true` |
| 3 | 操作系统环境变量 | `MOCK_LLM=true`（relaxed binding：大写下划线 ↔ 小写点） |
| 4 | jar **外** profile 配置 | `./config/application-local.yml` |
| 5 | jar **内** profile 配置 | `application-local.yml` |
| 6 | jar **外** 通用配置 | `./config/application.yml` |
| 7 | jar **内** 通用配置 | `application.yml` |
| 8 | `@PropertySource` 注解 | — |
| 9（最低） | `SpringApplication` 默认属性 | — |

**两条关键推论：**

- **profile 专属配置（`application-{profile}.yml`）永远覆盖通用配置（`application.yml`）**。
  → 本项目里 `application.yml` 写 `mock.llm: false`、`application-local.yml` 写 `mock.llm: true`，激活 `local` 后最终值是 `true`。
- **`application.yml` 是通用配置，任何环境都会加载**。所以在它里面写了某个 key，就等于「该属性永远存在」，占位符默认值**永远用不上**。

## 5. 类上怎么用：必须成对互斥（重点）

### ❌ 错误写法：两个实现读同一个 key，且都不取反

```java
@Service
@ConditionalOnExpression("${mock.llm:false}")   // Mock 实现
public class XxxServiceMock implements XxxService { }

@Service
@ConditionalOnExpression("${mock.llm:true}")    // 真实实现 —— 和上面完全一样！
public class XxxServiceReal implements XxxService { }
```

因为默认值在属性存在时无效，这两个条件**等价于同一个** `${mock.llm}`：

| `mock.llm` | Mock | Real | 后果 |
| :--- | :--- | :--- | :--- |
| `true` | 注册 | 注册 | ❌ `NoUniqueBeanDefinitionException`（2 个 Bean） |
| `false` | 不注册 | 不注册 | ❌ `NoSuchBeanDefinitionException`（0 个 Bean） |

**注意：`false` 时「真实实现也消失」是最隐蔽的坑** —— 本该兜底的实现反而没了。

### ✅ 正确写法：一个取反，保证互斥

```java
@Service
@ConditionalOnExpression("${mock.llm:false}")    // 开关=true 时生效（Mock）
public class XxxServiceMock implements XxxService { }

@Service
@ConditionalOnExpression("!${mock.llm:false}")   // 开关=false 时生效（真实）
public class XxxServiceReal implements XxxService { }
```

| `mock.llm` | Mock | Real | 结果 |
| :--- | :--- | :--- | :--- |
| `true` | ✅ | ❌ | 只有 Mock |
| `false` | ❌ | ✅ | 只有 Real |
| 不存在 | 默认 `false` → ❌ | 默认 `false` → ✅ | 只有 Real |

**任何情况都恰好注册一个 Bean。**

> **默认值统一写 `:false`**：属性缺失时走真实实现，不会因漏配而意外启用 Mock（安全的生产兜底）。

## 6. 更推荐的写法：`@ConditionalOnProperty`

纯布尔/字符串开关用它更直观，不容易写错：

```java
@Service
@ConditionalOnProperty(name = "mock.llm", havingValue = "true")                          // true 时生效
public class XxxServiceMock implements XxxService { }

@Service
@ConditionalOnProperty(name = "mock.llm", havingValue = "false", matchIfMissing = true)  // false 或缺失时生效
public class XxxServiceReal implements XxxService { }
```

- `matchIfMissing = true` = 「属性不存在时按匹配处理」，语义比 `${key:true}` 清晰得多。

| 场景 | 推荐注解 |
| :--- | :--- |
| 简单布尔 / 字符串开关 | `@ConditionalOnProperty` ✅ |
| 需要组合逻辑（多 key 联动、取反、比较） | `@ConditionalOnExpression` |

## 7. SpEL 支持的运算符

```java
@ConditionalOnExpression("!${mock.llm:false}")                              // 取反
@ConditionalOnExpression("${a:false} && ${b:false}")                        // 与
@ConditionalOnExpression("${a:false} || ${b:false}")                        // 或
@ConditionalOnExpression("'${mode:dev}' == 'prod'")                         // 字符串比较（值要加引号）
@ConditionalOnExpression("${a:false} and ${b:false}")                       // 关键字写法（等价 &&）
```

## 8. 报错速查对照表

| 启动报错 | 根因 | 排查方向 |
| :--- | :--- | :--- |
| `NoUniqueBeanDefinitionException` | 多个实现同时满足条件 | 条件没互斥，检查是否漏了 `!` |
| `NoSuchBeanDefinitionException` | 没有任何实现满足条件 | 条件全为 false，检查是否该取反没取反 |
| SpEL 解析失败 / EL1008E 等 | 占位符无默认值且属性不存在，残留 `${...}` 字面量 | 给占位符加 `:默认值` |
| 配置改了不生效 | 被更高优先级属性源覆盖 | 看第 4 节优先级表，或查 `/actuator/env` |

## 9. 本项目实例（combat 引擎）

**当前状态与问题：**

```19:19:src/main/java/com/xiaodingtie/feeling/modules/combat/service/CombatEngineServiceMock.java
@ConditionalOnExpression("${mock.llm:false}")
```

```31:31:src/main/java/com/xiaodingtie/feeling/modules/combat/service/CombatEngineServiceDoubao.java
@ConditionalOnExpression("${mock.llm:true}")
```

⚠️ 两者等价、未互斥 → local 下（`mock.llm=true`）**两个都注册** → `NoUniqueBeanDefinitionException`。

**修复：**把 Doubao 改成取反即可

```java
@ConditionalOnExpression("!${mock.llm:false}")
```

**付费引擎那对目前是安全的**（可作正确范例参考）：

```50:50:src/main/java/com/xiaodingtie/feeling/modules/combat/service/CombatPaidEngineServiceDoubao.java
@ConditionalOnExpression("(!${mock.llm:false})")
```

其 Mock 侧 `@Service` 与条件注解被注释掉了（第 26–27 行），当前只有 Doubao 注册，**暂无冲突**；但若日后取消注释启用 Mock，需确认两者互斥。

## 10. 排查 Checklist

1. 当前激活了哪个 profile？（`spring.profiles.active`）
2. `mock.llm` 的**最终值**是多少？→ 访问 `/actuator/env` 或 `/actuator/configprops` 确认，不要只看单个 yml 文件。
3. 两个实现的条件是否互斥？（一个有 `!`，另一个没有）
4. 是否误以为「默认值能覆盖已配置的值」？（不能，见第 3 节）
5. 是否漏配导致 0 个 Bean？（条件全 false）

---

这份笔记涵盖了语法、配置来源优先级、互斥配对写法、推荐替代方案和报错速查。