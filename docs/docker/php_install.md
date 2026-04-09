# 搭建 PHP 运行环境

## 方案一(临时用)

在项目目录下创建文件`docker-compose.yml`,内容如下

```ini
services:
  # PHP 服务
  php:  # PHP的服务名
    image: php:7.4-fpm  # 这里用的是最小包，没有 mysqli ，也可能其他扩展也没，如果需要加扩展，建议用另一种编译安装方式
    volumes:
      - ./src:/var/www/html # 把当前项目目录下的SRC目录下的内容，挂载到容器html目录中

  # Web 服务器
  nginx: 
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html  # 配置nginx的程序目录，与php中的一致
      - ./conf.d:/etc/nginx/conf.d #项目目录下的 conf.d 配置文件夹，挂载到容器中的对应目录
    depends_on:
      - php
```

然后在项目目录下创建文件 `conf.d`，并在`conf.d`目录下创建 `default.conf`文件，文件内容如下

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/www/xdt;  #网站入口文件夹目录，根据你的需要配置
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # 将 PHP 请求转发到 php 容器的 9000 端口
    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```



最后，在 docker 中，启动容器,进入powershell ，进入到项目目录下，运行下面的命令

```shell
docker-compose up -d
```

后来发现没有 `mysqli` 扩展，则使用进入容器临时安装的方式处理的，步骤如下

1. 进入 PHP 容器 （对应 `docker-compose.yml`文件中的服务名）

   ```shell
   docker-compose exec php bash
   ```

   

2. 在容器内部执行安装命令

   ```shell
   docker-php-ext-install mysqli
   ```

3. 退出并重启容器使配置生效

	```shell
	exit
	docker-compose restart php
	```



## 方案二（推荐）

创建 `docker-compose.yml`，在配置文件中，引入 `Dockerfile` 文件，这个文件中配置整个PHP需要用到的相应扩展等

`Dockerfile`文件内容如下：

```dockerfile
FROM php:7.4-fpm

# 安装 mysqli 扩展
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# 如果以后需要 PDO 或其它，可以写在一起：
#RUN docker-php-ext-install pdo pdo_mysql
```

`docker-compose.yml`文件内容如下

```ini
services:
  # PHP 服务
  php:
    #image: php:7.4-fpm # 去掉原来的直接镜像
    build: # 改用自定义的方式
      context: . # 指定 Dockerfile 所在的目录。 点表示当前目录
      dockerfile: Dockerfile # 指定 Dockerfile 的名称(文件名)
    volumes:
      - ./src:/var/www/html

  # Web 服务器
  nginx: 
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html
      - ./conf.d:/etc/nginx/conf.d
    depends_on:
      - php
```

然后在PowerShell 中，进入到项目目录下，执行命令

```
docker-compose up -d --build
```





