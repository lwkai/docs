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