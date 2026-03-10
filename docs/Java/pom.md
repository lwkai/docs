# POM 依赖配置

## spring-boot-configuration-processor

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

这个依赖虽然不参与编译运行，但它是大厂项目的“润滑剂”。

 - 作用：它会扫描你的 @ConfigurationProperties 注解，生成一份元数据文件。

 - 好处：当你以后在 application.yml 里输入 app.security.risk... 时，VS Code 会自动弹出代码补全，并显示你在代码里写的注释。




## spring-boot-starter-actuator


`spring-boot-starter-actuator` 是 Spring Boot 提供的一个**监控和管理**框架。简单来说，它就像是在你的应用程序里安装了一套“传感器”和“仪表盘”，让你能在运行时实时观察应用的健康状况、性能指标和内部配置。

------

### 1. 核心功能

引入 Actuator 后，它会暴露一系列 **Endpoints（端点）**，通过这些 HTTP 接口，你可以获取以下信息：

- **`/actuator/health`**：查看应用的健康状态（是否存活、数据库连通性、磁盘空间等）。
- **`/actuator/info`**：查看自定义的应用描述信息。
- **`/actuator/metrics`**：查看各种指标（JVM 内存、CPU 使用率、HTTP 请求统计等）。
- **`/actuator/loggers`**：查看并**实时修改**日志级别（无需重启服务即可把某个包的日志从 INFO 改为 DEBUG）。
- **`/actuator/env`**：查看当前应用的所有环境变量和配置参数。
- **`/actuator/beans`**：查看 Spring 容器中所有初始化的 Bean 列表。

------

### 2. 为什么需要它？

在微服务架构或生产环境中，你不可能通过打断点来调试程序。Actuator 的作用主要体现在：

1. **健康检查（Health Check）**：配合 Kubernetes、Nginx 或 Eureka 使用。如果 `/health` 返回 503，负载均衡会自动切断流量，避免请求发送到故障节点。
2. **性能监控**：你可以将 Actuator 的数据暴露给 **Prometheus**，再通过 **Grafana** 展示成漂亮的图表。
3. **线上排查**：通过 `/env` 查看生产环境配置是否生效，或通过 `/threadump` 查看当前线程死锁情况。

------

### 3. 如何配置

#### 第一步：引入依赖

在 `pom.xml` 中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### 第二步：暴露端点

默认情况下，出于安全考虑，Spring Boot 只暴露了 `/health` 和 `/info`。如果你想查看所有信息，需要在 `application.yml` 中配置：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*" # 暴露所有端点。生产环境建议只开启需要的。
  endpoint:
    health:
      show-details: always # 显示详细的健康信息（如磁盘、数据库具体状态）
```

------

### ⚠️ 安全警示

**非常重要：** Actuator 暴露的很多信息（如 `/env` 或 `/beans`）含有敏感配置（比如数据库密码、API Key）。

- **不要**在公网直接暴露所有端点。
- **建议**配合 `spring-boot-starter-security` 对 `/actuator/**` 路径进行权限校验，或者通过 Nginx 拦截外部对该路径的访问。

**你想了解如何将这些监控数据接入像 Grafana 这样的可视化面板吗？**

## flyway-core

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```



简单来说，这段 XML 代码引入的是 **Flyway**，它是 Java 生态中最流行的 **数据库版本管理工具**（Database Migrations）。

如果把代码版本管理比作 Git，那么 Flyway 就是**数据库版本的 Git**。

------

### 1. 它解决了什么痛点？

在没有 Flyway 之前，团队开发常遇到这些尴尬事：

- **手动同步：** 同事 A 修改了表结构，同事 B 运行代码报错，因为 B 的本地数据库没更新。
- **环境不一致：** 开发环境跑得好好的，上线到生产环境时，忘了执行某条 `ALTER TABLE` 语句，导致系统崩溃。
- **初始化困难：** 新人入职，得满地找最新的 `.sql` 初始化脚本。

### 2. Flyway 的核心工作原理

Flyway 会在你的数据库中自动创建一张名为 `flyway_schema_history` 的元数据表。它通过以下步骤确保数据库同步：

1. **扫描脚本：** 自动扫描项目路径下（通常是 `src/main/resources/db/migration`）的 SQL 脚本。
2. **比对版本：** 检查脚本文件名里的版本号（如 `V1__init.sql`, `V2__add_user_email.sql`）。
3. **执行更新：** 如果发现某个脚本的版本号比 `flyway_schema_history` 表里记录的最高版本还要新，它就会执行该脚本。
4. **记录状态：** 执行成功后，将该脚本的版本、描述、校验码（Checksum）存入表中。

### 3. 它的主要优势

- **自动化：** 项目启动时自动检查并升级数据库，无需人工干预。
- **确定性：** 同样的脚本，在任何环境下执行出来的结果都一模一样。
- **防止篡改：** 它会检查已执行脚本的 Checksum，如果有人偷偷修改了旧的 SQL 文件，Flyway 会报错提醒，防止生产环境数据不一致。

------

### 4. 典型脚本命名示例

脚本通常需要遵循特定的命名规范：

- `V1__create_user_table.sql`（版本 1，创建用户表）
- `V1.1__add_index.sql`（版本 1.1，添加索引）
- `V2__update_config.sql`（版本 2，修改配置）

> **注意：** 在 Spring Boot 项目中，通常除了这个 `flyway-core` 依赖，还需要确保配置了数据源（DataSource），它就能在应用启动时自动“起飞”。

------

既然你准备好了，我们就来看看在 Spring Boot 中如何通过简单的配置让 Flyway “跑”起来。

------

### 1. 基础配置 (application.yml)

只要你在 `pom.xml` 中引入了 `flyway-core`，Spring Boot 就会自动开启 Flyway。你只需要在配置文件中指定一些基础信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_db
    username: root
    password: password
  
  flyway:
    # 是否启用 Flyway
    enabled: true
    # 脚本存放位置，默认就是这个路径
    locations: classpath:db/migration
    # 如果数据库不是空的（已有表），需要开启此项进行基准线初始化
    baseline-on-migrate: true
```

------

### 2. 脚本存放位置

你需要把 SQL 脚本放在 `src/main/resources/db/migration` 文件夹下。

**文件命名规则：**

- **V** + **版本号** + **双下划线** + **描述** + **.sql**
- 例如：`V1__init_db.sql`

------

### 3. Flyway 的“大脑”：元数据表

当你启动程序后，Flyway 会在你的数据库里自动创建一张 `flyway_schema_history` 表。

| **version** | **description** | **type** | **script**        | **checksum** | **success** |
| ----------- | --------------- | -------- | ----------------- | ------------ | ----------- |
| 1           | init db         | SQL      | V1__init_db.sql   | 12345678     | 1 (成功)    |
| 2           | add email       | SQL      | V2__add_email.sql | 87654321     | 1 (成功)    |

**它是怎么工作的？**

1. **扫描：** 启动时检查文件夹里的脚本。
2. **对比：** 发现本地有个 `V3__add_index.sql`，但表中最高只有 `V2`。
3. **执行：** 运行 `V3` 脚本。
4. **记录：** 将 `V3` 的信息写入表。

------

### 4. 特别注意：Checksum（校验和）

这是 Flyway 最“硬核”的地方。一旦 `V1__init_db.sql` 被执行过，你就**绝对不能**再去修改这个文件里的内容。

- 如果你偷偷改了 `V1` 的 SQL，Flyway 再次启动时会计算该文件的 Checksum，发现和数据库表里记录的不一致。
- **结果：** 报错，程序拒绝启动。
- **正确做法：** 永远不要修改已执行的脚本，而是创建一个更高版本（如 `V4`）的脚本去修复问题。

------

### 进阶：如何处理已有的旧项目？

如果你的项目已经运行很久了，数据库里全是表，现在想引入 Flyway，只需：

1. 将当前数据库结构导出为 `V1__baseline.sql`。
2. 设置 `spring.flyway.baseline-on-migrate: true`。
3. Flyway 会认为之前的表都是“基准”，从 `V2` 开始正式管理。

## flyway-mysql

简单来说，`flyway-mysql` 是 Flyway 的一个**数据库专用的驱动插件/模块**。

从 Flyway **8.2.1** 版本开始，Flyway 进行了一次“瘦身计划”。它把对各种数据库（如 MySQL, PostgreSQL, Oracle 等）的具体支持代码从 `flyway-core` 核心库中剥离了出来，变成了独立的依赖。

------

### 1. 为什么需要它？

在旧版本中，`flyway-core` 包含了所有数据库的适配逻辑，这导致依赖包非常臃肿。

现在的逻辑是：

- **`flyway-core`**：负责核心逻辑（扫描脚本、管理版本表、事务控制）。
- **`flyway-mysql`**：负责 MySQL 特有的语法处理（比如如何处理 MySQL 的 `LOCK TABLES` 或特定的错误码）。

**如果你在 Spring Boot 项目中使用 MySQL，但只引入了 `flyway-core`，启动时很可能会报错：**

> *“Unsupported Database: MySQL”* 或 *“Missing database specific module”*。

------

### 2. 如何配合使用？

在你的 `pom.xml` 中，你需要同时引入这两个伙伴（如果你使用的是 Spring Boot 3.x 或较新的 Flyway 版本）：

```xml
<dependencies>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-mysql</artifactId>
    </dependency>
    
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
</dependencies>
```

------

### 3. 它的职责范围

`flyway-mysql` 模块主要处理以下 MySQL 特有的逻辑：

- **解析语法：** 处理 MySQL 特有的 SQL 语法（如存储过程、触发器里的分隔符 `DELIMITER`）。
- **版本检测：** 识别当前是 MySQL 5.7 还是 8.0，或者是 MariaDB（虽然 MariaDB 现在也有专用的 `flyway-database-mariadb`）。
- **锁机制：** 在执行迁移时，如何安全地锁定元数据表以防止多个实例同时运行。

------

### 总结

- **`flyway-core`** 是大脑。
- **`flyway-mysql`** 是翻译官，负责把大脑的指令翻译成 MySQL 听得懂的话。

如果你用的是 PostgreSQL，就需要引入 `flyway-database-postgresql`。这种模块化的设计让你的项目打包体积更小、更纯粹。

