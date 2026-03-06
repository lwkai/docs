# 项目创建 Docker 配置文件，并初始化

## 在 Docker 中安装 PostgreSQL

用 Docker Compose 安装，这种方式不仅能安装数据库，还能顺便把管理工具(图形界面)也一起装好。

### 1. 准备配置文件
在你的项目目录下（例如 E:\Project\demotest），创建一个名为  docker-compose.yml 的文件，贴入以下内容：
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: myuser          # 你的数据库用户名
      POSTGRES_PASSWORD: mypassword  # 你的数据库密码
      POSTGRES_DB: ai_project        # 初始数据库名称
    ports:
      - "5432:5432"                  # 映射端口到宿主机
    volumes:
      - ./postgres_data:/var/lib/postgresql/data # 数据持久化，防止重启后数据丢失

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin_gui
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com # 管理后台登录账号
      PGADMIN_DEFAULT_PASSWORD: admin        # 管理后台登录密码
    ports:
      - "8080:80"                            # 通过浏览器 8080 端口访问图形界面
```

### 2. 启动容器
打开 PowerShell, 进入该文件所在的目录，执行：
```PowerShell
docker-compose up -d
```
- `-d`的作用：让容器在后台运行，不占用你的终端窗口。

### 3. 如何验证安装成功？

#### 方式A：命令行检查
输入 `docker ps`, 如果你看到 `postgres_db` 和 `pgadmin_gui`的状态都是 Up, 就说明大功告成了。

#### 方式B：使用图形界面（pgAdmin）
1. 打开浏览器，访问 `http://localhost:8080`。
2. 使用刚才设置的邮箱 `admin@admin.com` 和密码 `admin`登录。
3. 连接数据库： * 点击 “Add New Server"。
 - Host Name: 填写  `db` (在 Docker 内部网络中直接用服务名)。
 - Username/password: 填写你在 `yml` 里设定的 `myuser` 和 `mypassword`。

### 4. 在 Spring Boot 中连接
现在你的数据库已经跑在 Docker 里的 5432 端口了。在你的 Spring Boot 项目 `src/main/resources/application.properties`中，配置如下：

```Properties
# 数据库连接地址
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_project
spring.datasource.username=myuser
spring.datasource.password=mypassword

# 自动根据 Java 实体类创建/更新表结构（新手神器）
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### 5. 给新手的进阶提示

1. 持久化数据： 注意我在配置文件里写的 `volumes`。这意味着你的数据实际存储在`E:\Project\demotest\postgres_data`文件夹下。即使你删除掉 Docker 容器，数据也不会丢。

2. VS Code 插件： 既然你用 VS Code,搜索并安装一个叫” Database Client"的插件，直接在编辑器左侧就能增删改查 SQL，比开浏览器更方便.

------ http://localhost:8080 进入管理后表的位置说明 -----

连接上数据库管理之后，数据表所在位置在 `Servers/postgres_db/数据库/ai_project/架构/表` 这里才是表的所在位置，当下因为没有建表，所以是空的。注意 `ai_project`是刚才配置文件中配置的数据库名称




----------------------------

在 Docker 开发中，修改配置文件（如 `docker-compose.yml`）后，你不需要手动去停止、删除再新建，Docker Compose 有一套非常智能的“增量更新”机制。

按照以下步骤操作即可启用新配置：

------

## 1. 最推荐的方法：直接再次运行

在终端输入和刚才一样的命令：

PowerShell

```
docker-compose up -d
```

**发生了什么？**

- Docker 会自动对比 `docker-compose.yml` 的内容和当前运行中容器的状态。
- **如果配置变了：** 它会只针对改变了的服务进行“销毁 -> 重建”。
- **如果配置没变：** 它会提示 `Running`，什么都不做。

------

## 2. 如果你修改的是“环境变量”或“端口”

有时候仅仅 `up -d` 可能不会触发彻底的重置（虽然大部分情况可以）。如果你想确保配置 100% 刷新，可以使用：

PowerShell

```
docker-compose up -d --force-recreate
```

- **`--force-recreate`：** 强制重新创建容器，即使你的配置没有变化。这在调试环境变量问题时非常有用。

------

## 3. 如果你修改了“镜像” (Image)

如果你把 `image: postgres:15` 改成了 `image: postgres:16`，你需要先拉取新镜像：

PowerShell

```
docker-compose pull
docker-compose up -d
```

------

## 4. 彻底重来的方法（慎用）

如果你觉得配置改得太乱，想“清空重来”：

PowerShell

```
docker-compose down
docker-compose up -d
```

- **注意：** `down` 会停止并删除容器。但只要你在 `yml` 里配置了 `volumes`（数据卷），你的数据库数据（那些表和记录）**不会丢失**，下次 `up` 起来时依然存在。

------

### 验证新配置是否生效

你可以通过以下命令查看容器的具体配置信息（比如看端口或环境变量是否改成功了）：

PowerShell

```
docker inspect postgres_db
```

------

### 专家提示：数据卷的限制

**有一点需要特别注意：**

如果你在 `yml` 环境里修改了 `POSTGRES_DB`（初始数据库名）或 `POSTGRES_USER`，但在之前运行的时候已经生成了 `./postgres_data` 文件夹，那么**修改是不会生效的**。

**原因：** PostgreSQL 只有在第一次启动、文件夹为空时才会执行初始化逻辑。

**解决办法：** 如果你想改初始数据库名，需要先 `docker-compose down`，然后手动删除电脑上的 `./postgres_data` 文件夹，再 `up`。**（注意：这会清空你之前在数据库里存的所有数据！）**

