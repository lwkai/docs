# JPA



## 定义一个数据表



### 如何精细化控制表中字段的各细节

这是一个非常典型的问题。默认情况下，JPA 确实比较“保守”，为了保证兼容性，它会把 `String` 统一映射为 `VARCHAR(255)`。

想要打破这种“死板”的默认设置，你主要可以通过 `@Column` 注解来进行精细化控制。

#### 1. 使用 `@Column` 注解控制长度

这是最常用的方式，可以直接指定字段的长度、是否允许为空以及字段名。


```Java
@Column(length = 100) // 将 VARCHAR 限制为 100
private String username;

@Column(nullable = false, length = 50) // 不允许为空，长度 50
private String email;
```

#### 2. 使用 `columnDefinition` 彻底定制

如果你觉得 `length` 还是不够灵活（比如你想用 `TEXT`、`LONGTEXT` 或者特定的数据类型），可以使用 `columnDefinition` 属性。这相当于直接写 SQL 的字段定义部分。


```Java
@Column(columnDefinition = "TEXT") // 映射为长文本类型
private String bio;

@Column(columnDefinition = "VARCHAR(32) DEFAULT 'active'") // 指定默认值
private String status;
```

#### 3. 全局映射策略 (高级玩法)

如果你觉得给每个字段加注解太麻烦，希望全局修改（例如：所有的 String 默认都是 `VARCHAR(512)`），你可以自定义 Hibernate 的 `PhysicalNamingStrategy` 或者使用 `AttributeConverter`。

不过对于大多数项目，**方式 1 和 2** 已经能解决 95% 的问题了。

------

#### 常见场景对照表

| **需求**       | **注解写法**                                   | **生成的 SQL (近似)** |
| -------------- | ---------------------------------------------- | --------------------- |
| **限制长度**   | `@Column(length = 64)`                         | `VARCHAR(64)`         |
| **大文本内容** | `@Lob` 或 `@Column(columnDefinition = "TEXT")` | `TEXT` / `CLOB`       |
| **必须有值**   | `@Column(nullable = false)`                    | `NOT NULL`            |
| **固定长度**   | `@Column(columnDefinition = "CHAR(10)")`       | `CHAR(10)`            |

------

**一点小建议：**

虽然 JPA 的自动建表（`ddl-auto: update` 或 `create`）在开发阶段非常爽，但在**生产环境**中，建议将其关闭。生产环境通常推荐使用 **Liquibase** 或 **Flyway** 来管理数据库版本，这样更安全且可追溯。

------

## 如何关闭 JPA 的自动建表？

在你的 `application.properties` 或 `application.yml` 配置文件中，找到 `ddl-auto` 配置项并修改为 `none` 或 `validate`。

- **`none`**：完全禁用。Spring Boot 不会对数据库结构做任何改动。
- **`validate`**：最推荐的生产配置。它会检查你的实体类（Entity）与数据库表结构是否匹配，如果不匹配则启动失败，防止运行时报错。


```yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate # 生产环境建议设为 validate 或 none
```


------
## Liquibase 和 Flyway 是什么？

它们被称为**数据库版本管理工具**。你可以把它们理解为“数据库界的 Git”。

- **痛点**：如果你手动改了本地数据库，你同事的代码拉下来后程序可能就崩了；或者上线时，你可能会漏掉执行某条 `ALTER TABLE` 语句。
- **解决方案**：所有的数据库变更（建表、加字段、删索引）都写在脚本里。项目启动时，工具会自动检查哪些脚本还没运行过，并按顺序执行。

### 二者对比

| **特性**     | **Flyway (更流行/简单)** | **Liquibase (更强大/灵活)** |
| ------------ | ------------------------ | --------------------------- |
| **脚本格式** | 纯 SQL 为主              | XML, YAML, JSON 或 SQL      |
| **学习曲线** | 极低，写 SQL 即可        | 稍高，需要学习其 DSL        |
| **回滚支持** | 社区版不支持自动回滚     | 支持回滚（Rollback）        |
| **核心理念** | 追求简单、透明           | 追求跨库兼容、可扩展        |

------

### 3. 如何使用（以 Flyway 为例）

因为 Flyway 极其简单且符合开发者直觉（直接写 SQL），建议你从 Flyway 开始。

#### 第一步：添加依赖

在 `pom.xml` 中引入：

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId> </dependency>
```

#### 第二步：创建脚本

在 `src/main/resources/db/migration` 目录下创建 SQL 文件。

**注意命名规范：** `V<版本号>__<描述>.sql`（双下划线）。

- `V1__init_db.sql` (创建用户表)
- `V2__add_email_to_users.sql` (后来想加个字段)


```sql
-- V1__init_db.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    email VARCHAR(50)
);
```

#### 第三步：启动项目

当你启动 Spring Boot 时，Flyway 会自动检测数据库，发现没有 `flyway_schema_history` 表，就会创建它并按顺序执行你的 SQL 脚本。

------

#### 4. 为什么要这么做？（避坑指南）

> **真实场景：** > 假设你在本地通过 JPA 改了字段长度。如果你用 `ddl-auto: update`，它在本地生效了。但上线时，你需要手动去生产库敲 SQL。万一敲错了（比如少个逗号），或者忘了敲，程序上线就会报错。

使用 Flyway/Liquibase 后：

1. **强制同步**：代码库里有什么脚本，数据库就是什么样子。
2. **团队协作**：同事拉下你的代码，启动项目，数据库自动同步成和你一样的结构。
3. **环境一致性**：开发、测试、生产环境的数据库结构完全一致。

------

**你想尝试配置一下 Flyway 吗？我可以为你提供一个更详细的 `V1__init_db.sql` 脚本，把之前讨论的字段优化（长度限制、索引等）全部加进去。**
