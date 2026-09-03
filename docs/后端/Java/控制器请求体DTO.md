---
title: Spring Boot 请求参数绑定与校验
icon: mdi:database-outline
sort: 0
---




---

# Spring Boot 请求参数绑定与校验 · 完整学习笔记

> 适用栈：Spring Boot 4.x / Java 17+（含 Java 25）/ **Jakarta** 校验体系（`jakarta.validation.*`，不是旧的 `javax.validation.*`）。
> 统一约定：本项目所有接口 HTTP 状态码恒为 200，业务结果靠 `Result.code` 区分（`ResultCode.VALIDATE_FAILED` 表示参数校验失败），见 `GlobalExceptionHandler`。

---

## 0. 先建立核心认知（最重要）

**一个 DTO / record 的字段“是否必填”，从来不是由字段声明本身决定的。** 比如你看到的 `RelationGenerateRequest`：

```12:36:src/main/java/com/xiaodingtie/feeling/modules/relation/dto/RelationGenerateRequest.java
public record RelationGenerateRequest(
        List<RelationEngineService.RelationInput> inputs,
        String problemType,
        String auraModel,
        String appearanceLevel,
        String targetType,
        Long topicId,
        String characterName
) {
}
```

`record` 的组件只是“构造参数 + 访问器”，**不包含任何必填/选填语义**。真正的规则由下面 4 件事共同决定：

1. **用哪种方式接收参数**（`@RequestParam` / `@RequestBody` / `@ModelAttribute` / `@PathVariable`）——不同方式默认值不同；
2. **字段类型**：基本类型（`int`/`long`/`boolean`）默认“必填”（缺了无法绑定会报错）；引用类型（`String`/`Long`/`List`）默认“可空”；
3. **校验注解 + 是否开启校验**（`@NotNull` 等 + 参数上的 `@Valid`/`@Validated`）——这是显式声明必填的唯一标准手段；
4. **业务代码里的空值判断**——兜底，但属于“运行时才炸”，不是声明式约束。

> 结论复述：`RelationGenerateRequest` 因为①没挂校验注解、②控制器参数没写 `@Valid`、③全是引用类型，所以**7 个字段在绑定层全部可选**；只有 `inputs` 因引擎里直接 `for` 遍历而“事实必填”（缺了 NPE→被吞成“生成失败”）。

---

## 1. 控制器接收请求参数有几种方式（使用方式总览）

| # | 方式 | 典型位置 | 参数来源 | 缺省 `required` | 何时用 |
| --- | --- | --- | --- | --- | --- |
| 1 | `@RequestParam` | URL `?a=1&b=2` 或表单字段 | 查询串 / form-data | `required=true` | 少量简单查询/筛选项（如分页 `page`/`size`） |
| 2 | `@PathVariable` | URL 路径 `/detail/{id}` | 路径段 | `required=true`（路径变量不可缺） | REST 风格资源定位（id、code） |
| 3 | `@RequestBody` | 请求体 JSON | body（反序列化） | 整个 body 缺了抛 `HttpMessageNotReadableException` | **复杂对象 / DTO**（主流，本项目 `generate` 即用此） |
| 4 | `@ModelAttribute` | 表单 / 查询串绑定到对象 | query + form | 对象本身非必填，内部字段看注解 | 传统表单提交、需要整体校验的对象 |
| 5 | 无注解的简单类型 | 自动按 `@RequestParam` 处理 | 查询串 | `required=true` | 单个零散参数（等价于 `@RequestParam`） |
| 6 | `@RequestHeader` / `@CookieValue` / `@RequestPart` | 请求头 / Cookie / multipart 分块 | 各自来源 | 多数 `required=true` | 取 token、文件上传等 |

下面挑最常用的 4 种展开。

### 1.1 `@RequestParam` —— URL 查询参数 / 表单字段

```java
@GetMapping("/history")
public Result<List<X>> history(
        @RequestParam(defaultValue = "0") int page,        // 有默认值 → 实际可选
        @RequestParam(required = false) String keyword) {  // 显式声明可选
    ...
}
```

- `required` 默认 `true`：缺参会直接 400（`MissingServletRequestParameterException`）。
- 给 `defaultValue` 后隐式变为可选（Spring 会把它当 `required=false`）。
- 适合“少量、扁平”的参数。多字段时别用一堆 `@RequestParam`，改用 `@ModelAttribute` 或 `@RequestBody`。

### 1.2 `@PathVariable` —— URL 路径变量

```java
@GetMapping("/detail/{reportId}")
public Result<X> getDetail(@PathVariable Long reportId) { ... }
```

- 路径变量**必须出现在 URL 模板里**，不存在就是 404 路由不匹配，谈不上“可选”。
- 可写 `@PathVariable(required = false)`，但只有当你在映射里用可选占位（如 `/detail/{id:/?}` 之类，较少用）才有意义。

### 1.3 `@RequestBody` —— JSON 请求体（DTO 校验主场）

```java
@PostMapping("/generate")
public Result<X> generate(@RequestBody RelationGenerateRequest request) { ... }
```

- 整个 body 缺失会抛 `HttpMessageNotReadableException`（你们已处理为“请求体不能为空”）。
- **body 内的字段默认全部可选**，除非在 DTO 上加校验注解 + 这里加 `@Valid`。
- 这是“对象级校验”的标准入口（见第 3、4 节）。

### 1.4 `@ModelAttribute` —— 表单/查询串绑定到对象

```java
@PostMapping("/form")
public Result<X> form(@Valid RelationForm form) { ... }  // 字段来自 ?name=&age= 等
```

- 与 `@RequestBody` 区别：数据来自 query/form，不是 JSON body。
- 同样靠 `@Valid` 开启内部字段校验。
- 本项目以 JSON 接口为主，较少用，但原理一致。

---

## 2. 声明式“必填/选填”的唯二标准手段

要在**绑定阶段**就拦截缺参（而不是进业务层才 NPE），只有两条路：

### 2.1 用绑定注解本身表达（仅 `@RequestParam` / `@PathVariable` 适用）

```java
@RequestParam(required = false) String keyword      // 选填
@RequestParam(defaultValue = "20") int size          // 选填（带默认值）
@PathVariable Long reportId                          // 必填（路径变量）
```

> 局限：只能用于“扁平参数”，**不能用于 `@RequestBody` 对象内部的字段**。`@RequestBody` 内部字段必填必须靠下面的 Bean Validation。

### 2.2 用 Bean Validation 注解 + `@Valid`（适用于所有对象内部字段）

这才是让 `RelationGenerateRequest` 这类 DTO 表达“某字段必填”的正确方式。两步：

1. **在字段上挂约束注解**：`@NotNull` / `@NotBlank` / `@NotEmpty` …
2. **在控制器参数上写 `@Valid`（或 `@Validated`）** 开启校验。

```java
// DTO
public record RelationGenerateRequest(
        @NotEmpty List<RelationInput> inputs,   // 必填且至少一个
        @NotBlank String problemType,           // 必填且非空白
        String auraModel,                        // 仍选填
        ...
) {}

// 控制器
@PostMapping("/generate")
public Result<X> generate(@Valid @RequestBody RelationGenerateRequest request) {
    // 若 inputs 为空 / problemType 为空白，Spring 直接抛 MethodArgumentNotValidException
    // → 被 GlobalExceptionHandler 收口成 Result.failed(VALIDATE_FAILED, "inputs: ...; problemType: ...")
}
```

**不加 `@Valid` 的后果**：注解写了也**完全不生效**，字段照样是 `null` 静默通过——这是最常见的坑。

---

## 3. 校验修饰符（Bean Validation 注解）完整清单

全部来自 `jakarta.validation.constraints.*`（Spring Boot 3/4 体系）。按用途分组，含作用、适用类型、示例、易错点。

### 3.1 空值判断（最常用，也最易混）

| 注解 | 作用 | 适用类型 | 示例 |
| --- | --- | --- | --- |
| `@NotNull` | 不能为 `null`（但空串/空集合**可以**） | 任意引用类型 | `@NotNull String x` |
| `@NotEmpty` | 不能为 `null` **且** `size()/length() > 0` | `String`、集合、`Map`、数组 | `@NotEmpty List<X> inputs` |
| `@NotBlank` | 不能为 `null` 且去空白后非空（`"  "` 也不行） | **仅 `String`** | `@NotBlank String problemType` |

> ⚠️ 三者区别（面试/实战高频坑）：
> - `String` 的“必填”用 `@NotBlank`（连空白串都拦）；不要用 `@NotNull`（拦不住 `""`）。
> - `List`/`Map`/数组的“至少一个”用 `@NotEmpty`（不是 `@NotBlank`，@NotBlank 对集合无效甚至编译/运行报错）。
> - `@NotNull` 适合 `Long`/`Integer` 等数字与枚举 code。

### 3.2 长度 / 大小范围

| 注解 | 作用 | 适用 | 示例 |
| --- | --- | --- | --- |
| `@Size(min=, max=)` | 字符数 / 元素个数在范围内 | `String`、集合、数组、`Map` | `@Size(max = 2000) String content` |
| `@Length(min=, max=)` ⚠️ | Hibernate 特有，等价于 `@Size` | `String` | 一般优先用标准 `@Size` |

### 3.3 数值范围

| 注解 | 作用 | 示例 |
| --- | --- | --- |
| `@Min(value)` / `@Max(value)` | 整数边界（含） | `@Min(0) @Max(7) int dayNo` |
| `@DecimalMin` / `@DecimalMax` | 支持小数边界，可加 `(inclusive=)` | `@DecimalMin("0.0") BigDecimal` |
| `@Positive` / `@PositiveOrZero` | 正数 / 非负 | `@PositiveOrZero int quota` |
| `@Negative` / `@NegativeOrZero` | 负数 / 非正 | |
| `@Digits(integer=, fraction=)` | 整数位/小数位位数 | 金额类 |

> 注意：`@Min`/`@Max` 对 `null` **不报错**（null 由 `@NotNull` 管）。想“必填且范围”，要 `@NotNull` + `@Min/@Max` 叠加。

### 3.4 格式校验

| 注解 | 作用 | 示例 |
| --- | --- | --- |
| `@Pattern(regexp=)` | 正则匹配 | `@Pattern(regexp = "^(VOICE\|TEXT\|IMAGE)$") String type` |
| `@Email` | 邮箱格式 | `@Email String mail` |
| `@URL` / `@URI` | URL 格式 | 媒体地址可用 `@URL` |

> 枚举 code（如 `problemType=ambiguous_drag`）的“合法性”建议用 `@Pattern` 枚举白名单，或在业务层用 `Enum.fromCode()` 兜底（你们 `RelationEngineService` 里 `ProblemType.fromCode` 即此思路，且已实现“非法值原样返回”的容错）。

### 3.5 布尔 / 时间

| 注解 | 作用 |
| --- | --- |
| `@AssertTrue` / `@AssertFalse` | 布尔字段必须为 true/false（如“已阅读协议”） |
| `@Past` / `@Future` / `@PastOrPresent` / `@FutureOrPresent` | 日期在过去/未来（带 `OrPresent` 含当前） |

### 3.6 级联校验（嵌套对象）

| 注解 | 作用 |
| --- | --- |
| `@Valid` | 标注在**对象/集合元素字段**上，触发其**内部字段**的约束（递归校验） |

```java
public record OrderReq(
        @Valid                                    // 关键：没有它，item 内部的 @NotBlank 不生效
        @NotEmpty List<@Valid OrderItem> items
) {}
public record OrderItem(@NotBlank String sku, @Min(1) int qty) {}
```

> 集合元素的级联要用 `List<@Valid OrderItem>`（Jakarta 支持在泛型实参上标 `@Valid`）。

### 3.7 自定义消息

每个注解都能写 `message`，用于覆盖默认提示，并会原样进 `GlobalExceptionHandler` 的 `getDefaultMessage()`：

```java
@NotBlank(message = "关系问题类型不能为空")
String problemType;
// 校验失败返回：Result.failed(VALIDATE_FAILED, "problemType: 关系问题类型不能为空")
```

---

## 4. 开启校验的开关：`@Valid` vs `@Validated`

两者都加在**控制器参数（或类）**上，但来源与能力不同。

| 维度 | `@Valid` | `@Validated` |
| --- | --- | --- |
| 来源 | `jakarta.validation.Valid`（JSR-380 标准） | `org.springframework.validation.annotation.Validated`（Spring 扩展） |
| 级联嵌套校验 | ✅ 支持（配合字段上的 `@Valid`） | ✅ 支持 |
| **分组校验**（group） | ❌ 不支持 | ✅ 支持（可按“新增/更新”用不同约束组） |
| 用在类级别 | ❌（只能方法参数/字段） | ✅ 可标在 `@RestController` 类上，配合方法参数裸校验 |

**本项目推荐**：对象 DTO 用 `@Valid`（标准、够用）；需要“同一对象在不同接口用不同必填规则”时才上 `@Validated` + 分组。

### 4.1 分组校验简述（进阶）

```java
public interface OnCreate {}   // 分组标记接口
public record RelationForm(
        @NotBlank(groups = OnCreate.class) String name,
        @NotBlank String remark                 // 任意分组都校验
) {}
@Validated            // 类上开启
@RestController
class X {
    @PostMapping("/create")
    void create(@Validated(OnCreate.class) RelationForm f) { ... }  // 仅触发 OnCreate 组 + 默认组
}
```

---

## 5. 校验失败在你们项目里如何返回（已就绪）

`GlobalExceptionHandler` 已经把三类和校验相关的异常收口成统一信封：

| 异常 | 触发场景 | 返回形态 |
| --- | --- | --- |
| `MethodArgumentNotValidException` | `@RequestBody` + `@Valid` 的 DTO 内部字段不达标 | `Result.failed(VALIDATE_FAILED, "字段: 消息; 字段: 消息")` |
| `BindException` | `@ModelAttribute` + `@Valid` 不达标 | 同上 |
| `ConstraintViolationException` | `@Validated` 类上 + 方法参数裸校验（如 `@NotNull @RequestParam`）不达标 | 同上 |

```36:64:src/main/java/com/xiaodingtie/feeling/common/exception/GlobalExceptionHandler.java
@ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
public Result<Object> handleBindingException(Exception ex) {
    ...
    String message = bindingResult.getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .collect(Collectors.joining("; "));
    return Result.failed(ResultCode.VALIDATE_FAILED, message);
}
```

> 关键点：一旦你给 `RelationGenerateRequest` 挂上注解 + `@Valid`，**缺参会自动走这里返回，不会再进 `generate()` 里 NPE**。HTTP 状态仍是 200，前端靠 `code == VALIDATE_FAILED` 识别。

> ⚠️ 依赖确认：校验**注解类型**（`jakarta.validation.*`）已随 Hibernate/JPA 间接进 classpath，但真正执行校验的引擎（`hibernate-validator` / `LocalValidatorFactoryBean`）建议**显式引入 `spring-boot-starter-validation`**，否则 `@Valid` 可能“写了不生效”。可检查 `pom.xml` 是否有该 starter；若没有，加上最稳妥。

---

## 6. 实战：把 `RelationGenerateRequest` 改造成“声明式必填”

改造前（现状，全可选）：

```java
// DTO
public record RelationGenerateRequest(
        List<RelationInput> inputs,
        String problemType,
        String auraModel,
        String appearanceLevel,
        String targetType,
        Long topicId,
        String characterName
) {}
// 控制器
@PostMapping("/generate")
public Result<RelationGenerateResponse> generate(@RequestBody RelationGenerateRequest request) { ... }
```

改造后（推荐）：

```java
public record RelationGenerateRequest(
        @NotEmpty(message = "至少提供一项关系材料（文字/语音/截图）")
        List<RelationEngineService.RelationInput> inputs,

        @NotBlank(message = "关系问题类型不能为空")
        String problemType,

        // auraModel：强烈建议但允许空（引擎有空安全兜底），故不加约束
        String auraModel,

        String appearanceLevel,   // 选填
        String targetType,        // 选填
        Long topicId,             // 选填

        // characterName：当前全代码无人读取，建议删除或接回落库逻辑
        @Deprecated String characterName
) {}
```

```java
@PostMapping("/generate")
public Result<RelationGenerateResponse> generate(@Valid @RequestBody RelationGenerateRequest request) {
    return Result.ok(reportService.generate(request));
}
```

> 说明：
> - `inputs` 用 `@NotEmpty`（List 用 NotBlank 无效）；`problemType` 用 `@NotBlank`（String 用 NotBlank 才拦得住空白串）。
> - `auraModel` 故意不加约束——因为 `RelationReportService`/`RelationEngineServiceDoubao` 对 `null` 都有容错（空串跳过），保留“可选但有兜底”的语义。
> - `characterName` 经全文检索**仅定义在 DTO、无任何使用**，是遗留死字段；要么删、要么接回真正的落库（如 `RelationReport.characterName`）。

---

## 7. 常见坑 & 最佳实践速记

1. **忘写 `@Valid`**：DTO 上的 `@NotNull` 等全部不生效，`null` 静默通过 —— 第一常见错误。
2. **`@RequestBody` 字段不能用 `@RequestParam(required=...)`**：那是查参专用，对 JSON body 内部字段无效。
3. **`record` 能校验吗？** 能。Spring Boot 4 + Hibernate Validator 8 支持在 record 组件上直接标约束注解。但要注意：**record 没有 setter，级联校验仍靠字段/访问器上的 `@Valid` 生效**，写法与普通类一致。
4. **`@NotBlank` 只能标 `String`**；集合/数组用 `@NotEmpty`；数字用 `@NotNull`+`@Min/@Max`。
5. **基本类型默认必填**：参数写成 `int dayNo`（无注解）缺省会报错；想可选就用包装类 `Integer` 并配合校验或 `@RequestParam(required=false)`。
6. **嵌套对象别忘 `@Valid`**：否则子对象内部约束不触发。
7. **body 整体缺失** → `HttpMessageNotReadableException`（你们已提示“请求体不能为空”），与“字段级校验”是两码事。
8. **枚举 code 合法性**：`@Pattern` 白名单 + 业务层 `Enum.fromCode` 兜底双保险（你们引擎已做容错）。
9. **校验消息要友好**：`message` 写中文业务话术，会直接进前端提示。
10. **依赖兜底**：确认 `spring-boot-starter-validation` 在 `pom.xml`，否则 `@Valid` 形同虚设。

---

## 8. 一图决策（什么时候用哪种）

```text
要接收参数
├─ 少量扁平查询/筛选/分页        → @RequestParam(required/defaultValue 控制必填)
├─ REST 资源定位 (id/code)       → @PathVariable (必填)
├─ 单个零散参数(无注解)          → 等价于 @RequestParam(required=true)
├─ 复杂对象 JSON                 → @RequestBody + DTO字段上@NotNull/@NotBlank/@NotEmpty
│                                 + 控制器参数 @Valid   ← 对象内部必填的唯一标准做法
└─ 表单/查询串绑对象             → @ModelAttribute + @Valid

字段是否必填 = 绑定注解(仅扁平参) 或 Bean Validation注解(@Valid 开启) 或 业务代码兜底
```

---

需要的话，我可以：
- 直接给你一份**可复制粘贴的 `RelationGenerateRequest` 改造 diff**（含 `pom.xml` 是否补 `starter-validation` 的建议）；
- 或顺手把没人用的 `characterName` 字段连同相关落库逻辑一起理清。

要不要我切到 **CRAFT 模式** 把第 6 节的改造落到代码里？