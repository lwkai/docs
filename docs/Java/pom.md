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

XML

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### 第二步：暴露端点

默认情况下，出于安全考虑，Spring Boot 只暴露了 `/health` 和 `/info`。如果你想查看所有信息，需要在 `application.yml` 中配置：

YAML

```
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