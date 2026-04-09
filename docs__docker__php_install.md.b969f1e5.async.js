"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[793],{20728:function(l,s,n){n.r(s);var a=n(82532),u=n(36800),i=n(31546),p=n(76607),x=n(377),d=n(91769),m=n(45122),h=n(50760),t=n(92358),o=n(11872),c=n(75271),_=n(35735),e=n(52676);function r(){return(0,e.jsx)(t.dY,{children:(0,e.jsx)(c.Suspense,{fallback:(0,e.jsx)(o.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h1",{id:"\u642D\u5EFA-php-\u8FD0\u884C\u73AF\u5883",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u642D\u5EFA-php-\u8FD0\u884C\u73AF\u5883",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u642D\u5EFA PHP \u8FD0\u884C\u73AF\u5883"]}),(0,e.jsxs)("h2",{id:"\u65B9\u6848\u4E00\u4E34\u65F6\u7528",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u65B9\u6848\u4E00\u4E34\u65F6\u7528",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u65B9\u6848\u4E00(\u4E34\u65F6\u7528)"]}),(0,e.jsxs)("p",{children:[_.texts[0].value,(0,e.jsx)("code",{children:_.texts[1].value}),_.texts[2].value]}),(0,e.jsx)(d.Z,{lang:"ini",children:_.texts[3].value}),(0,e.jsxs)("p",{children:[_.texts[4].value,(0,e.jsx)("code",{children:_.texts[5].value}),_.texts[6].value,(0,e.jsx)("code",{children:_.texts[7].value}),_.texts[8].value,(0,e.jsx)("code",{children:_.texts[9].value}),_.texts[10].value]}),(0,e.jsx)(d.Z,{lang:"nginx",children:_.texts[11].value}),(0,e.jsx)("p",{children:_.texts[12].value}),(0,e.jsx)(d.Z,{lang:"shell",children:_.texts[13].value}),(0,e.jsxs)("p",{children:[_.texts[14].value,(0,e.jsx)("code",{children:_.texts[15].value}),_.texts[16].value]}),(0,e.jsxs)("ol",{children:[(0,e.jsxs)("li",{children:[(0,e.jsxs)("p",{children:[_.texts[17].value,(0,e.jsx)("code",{children:_.texts[18].value}),_.texts[19].value]}),(0,e.jsx)(d.Z,{lang:"shell",children:_.texts[20].value})]}),(0,e.jsxs)("li",{children:[(0,e.jsx)("p",{children:_.texts[21].value}),(0,e.jsx)(d.Z,{lang:"shell",children:_.texts[22].value})]}),(0,e.jsxs)("li",{children:[(0,e.jsx)("p",{children:_.texts[23].value}),(0,e.jsx)(d.Z,{lang:"shell",children:_.texts[24].value})]})]}),(0,e.jsxs)("h2",{id:"\u65B9\u6848\u4E8C\u63A8\u8350",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u65B9\u6848\u4E8C\u63A8\u8350",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u65B9\u6848\u4E8C\uFF08\u63A8\u8350\uFF09"]}),(0,e.jsxs)("p",{children:[_.texts[25].value,(0,e.jsx)("code",{children:_.texts[26].value}),_.texts[27].value,(0,e.jsx)("code",{children:_.texts[28].value}),_.texts[29].value]}),(0,e.jsxs)("p",{children:[(0,e.jsx)("code",{children:_.texts[30].value}),_.texts[31].value]}),(0,e.jsx)(d.Z,{lang:"dockerfile",children:_.texts[32].value}),(0,e.jsxs)("p",{children:[(0,e.jsx)("code",{children:_.texts[33].value}),_.texts[34].value]}),(0,e.jsx)(d.Z,{lang:"ini",children:_.texts[35].value}),(0,e.jsx)("p",{children:_.texts[36].value}),(0,e.jsx)(d.Z,{children:_.texts[37].value})]})})})})}s.default=r},35735:function(l,s,n){n.r(s),n.d(s,{texts:function(){return a}});const a=[{value:"\u5728\u9879\u76EE\u76EE\u5F55\u4E0B\u521B\u5EFA\u6587\u4EF6",paraId:0,tocIndex:1},{value:"docker-compose.yml",paraId:0,tocIndex:1},{value:",\u5185\u5BB9\u5982\u4E0B",paraId:0,tocIndex:1},{value:`services:
  # PHP \u670D\u52A1
  php:  # PHP\u7684\u670D\u52A1\u540D
    image: php:7.4-fpm  # \u8FD9\u91CC\u7528\u7684\u662F\u6700\u5C0F\u5305\uFF0C\u6CA1\u6709 mysqli \uFF0C\u4E5F\u53EF\u80FD\u5176\u4ED6\u6269\u5C55\u4E5F\u6CA1\uFF0C\u5982\u679C\u9700\u8981\u52A0\u6269\u5C55\uFF0C\u5EFA\u8BAE\u7528\u53E6\u4E00\u79CD\u7F16\u8BD1\u5B89\u88C5\u65B9\u5F0F
    volumes:
      - ./src:/var/www/html # \u628A\u5F53\u524D\u9879\u76EE\u76EE\u5F55\u4E0B\u7684SRC\u76EE\u5F55\u4E0B\u7684\u5185\u5BB9\uFF0C\u6302\u8F7D\u5230\u5BB9\u5668html\u76EE\u5F55\u4E2D

  # Web \u670D\u52A1\u5668
  nginx: 
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html  # \u914D\u7F6Enginx\u7684\u7A0B\u5E8F\u76EE\u5F55\uFF0C\u4E0Ephp\u4E2D\u7684\u4E00\u81F4
      - ./conf.d:/etc/nginx/conf.d #\u9879\u76EE\u76EE\u5F55\u4E0B\u7684 conf.d \u914D\u7F6E\u6587\u4EF6\u5939\uFF0C\u6302\u8F7D\u5230\u5BB9\u5668\u4E2D\u7684\u5BF9\u5E94\u76EE\u5F55
    depends_on:
      - php
`,paraId:1,tocIndex:1},{value:"\u7136\u540E\u5728\u9879\u76EE\u76EE\u5F55\u4E0B\u521B\u5EFA\u6587\u4EF6 ",paraId:2,tocIndex:1},{value:"conf.d",paraId:2,tocIndex:1},{value:"\uFF0C\u5E76\u5728",paraId:2,tocIndex:1},{value:"conf.d",paraId:2,tocIndex:1},{value:"\u76EE\u5F55\u4E0B\u521B\u5EFA ",paraId:2,tocIndex:1},{value:"default.conf",paraId:2,tocIndex:1},{value:"\u6587\u4EF6\uFF0C\u6587\u4EF6\u5185\u5BB9\u5982\u4E0B",paraId:2,tocIndex:1},{value:`server {
    listen 80;
    server_name localhost;
    root /var/www/html/www/xdt;  #\u7F51\u7AD9\u5165\u53E3\u6587\u4EF6\u5939\u76EE\u5F55\uFF0C\u6839\u636E\u4F60\u7684\u9700\u8981\u914D\u7F6E
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # \u5C06 PHP \u8BF7\u6C42\u8F6C\u53D1\u5230 php \u5BB9\u5668\u7684 9000 \u7AEF\u53E3
    location ~ \\.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
`,paraId:3,tocIndex:1},{value:"\u6700\u540E\uFF0C\u5728 docker \u4E2D\uFF0C\u542F\u52A8\u5BB9\u5668,\u8FDB\u5165powershell \uFF0C\u8FDB\u5165\u5230\u9879\u76EE\u76EE\u5F55\u4E0B\uFF0C\u8FD0\u884C\u4E0B\u9762\u7684\u547D\u4EE4",paraId:4,tocIndex:1},{value:`docker-compose up -d
`,paraId:5,tocIndex:1},{value:"\u540E\u6765\u53D1\u73B0\u6CA1\u6709 ",paraId:6,tocIndex:1},{value:"mysqli",paraId:6,tocIndex:1},{value:" \u6269\u5C55\uFF0C\u5219\u4F7F\u7528\u8FDB\u5165\u5BB9\u5668\u4E34\u65F6\u5B89\u88C5\u7684\u65B9\u5F0F\u5904\u7406\u7684\uFF0C\u6B65\u9AA4\u5982\u4E0B",paraId:6,tocIndex:1},{value:"\u8FDB\u5165 PHP \u5BB9\u5668 \uFF08\u5BF9\u5E94 ",paraId:7,tocIndex:1},{value:"docker-compose.yml",paraId:7,tocIndex:1},{value:"\u6587\u4EF6\u4E2D\u7684\u670D\u52A1\u540D\uFF09",paraId:7,tocIndex:1},{value:`docker-compose exec php bash
`,paraId:8,tocIndex:1},{value:"\u5728\u5BB9\u5668\u5185\u90E8\u6267\u884C\u5B89\u88C5\u547D\u4EE4",paraId:9,tocIndex:1},{value:`docker-php-ext-install mysqli
`,paraId:10,tocIndex:1},{value:"\u9000\u51FA\u5E76\u91CD\u542F\u5BB9\u5668\u4F7F\u914D\u7F6E\u751F\u6548",paraId:11,tocIndex:1},{value:`exit
docker-compose restart php
`,paraId:12,tocIndex:1},{value:"\u521B\u5EFA ",paraId:13,tocIndex:2},{value:"docker-compose.yml",paraId:13,tocIndex:2},{value:"\uFF0C\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\uFF0C\u5F15\u5165 ",paraId:13,tocIndex:2},{value:"Dockerfile",paraId:13,tocIndex:2},{value:" \u6587\u4EF6\uFF0C\u8FD9\u4E2A\u6587\u4EF6\u4E2D\u914D\u7F6E\u6574\u4E2APHP\u9700\u8981\u7528\u5230\u7684\u76F8\u5E94\u6269\u5C55\u7B49",paraId:13,tocIndex:2},{value:"Dockerfile",paraId:14,tocIndex:2},{value:"\u6587\u4EF6\u5185\u5BB9\u5982\u4E0B\uFF1A",paraId:14,tocIndex:2},{value:`FROM php:7.4-fpm

# \u5B89\u88C5 mysqli \u6269\u5C55
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# \u5982\u679C\u4EE5\u540E\u9700\u8981 PDO \u6216\u5176\u5B83\uFF0C\u53EF\u4EE5\u5199\u5728\u4E00\u8D77\uFF1A
#RUN docker-php-ext-install pdo pdo_mysql

# \u5B89\u88C5 redis \u6269\u5C55
RUN pecl install redis && docker-php-ext-enable redis
`,paraId:15,tocIndex:2},{value:"docker-compose.yml",paraId:16,tocIndex:2},{value:"\u6587\u4EF6\u5185\u5BB9\u5982\u4E0B",paraId:16,tocIndex:2},{value:`services:
  # PHP \u670D\u52A1
  php:
    #image: php:7.4-fpm # \u53BB\u6389\u539F\u6765\u7684\u76F4\u63A5\u955C\u50CF
    build: # \u6539\u7528\u81EA\u5B9A\u4E49\u7684\u65B9\u5F0F
      context: . # \u6307\u5B9A Dockerfile \u6240\u5728\u7684\u76EE\u5F55\u3002 \u70B9\u8868\u793A\u5F53\u524D\u76EE\u5F55
      dockerfile: Dockerfile # \u6307\u5B9A Dockerfile \u7684\u540D\u79F0(\u6587\u4EF6\u540D)
    volumes:
      - ./src:/var/www/html
    depends_on:
      - redis    # \u786E\u4FDD redis \u5148\u542F\u52A8

  # Web \u670D\u52A1\u5668
  nginx: 
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html
      - ./conf.d:/etc/nginx/conf.d
    depends_on:
      - php
      
  redis:
    image: redis:alpine # \u4F7F\u7528\u8F7B\u91CF\u7EA7\u7684 alpine \u7248\u672C
    ports:
      - "6381:6379" # \u7AEF\u53E3\u6620\u5C04 \u628A\u5185\u90E8 6379 \u8F6C\u5230\u5916\u90E8 6381
    # \u5982\u679C\u9700\u8981\u6570\u636E\u6301\u4E45\u5316\uFF0C\u53EF\u4EE5\u53D6\u6D88\u4E0B\u9762\u4E24\u884C\u7684\u6CE8\u91CA
    # volumes:
    #   - ./redis-data:/data
    
  mysql:
    image: mysql:8.0
    container_name: mysql  # \u6307\u5B9A\u5BB9\u5668\u540D\u79F0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
    ports:
      - "3308:3306"
    volumes:
      - ./mysql/data:/var/lib/mysql
      - ./mysql/conf:/etc/mysql/conf.d
      
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin
    restart: always
    ports:
      - "8071:80"
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
`,paraId:17,tocIndex:2},{value:"\u7136\u540E\u5728PowerShell \u4E2D\uFF0C\u8FDB\u5165\u5230\u9879\u76EE\u76EE\u5F55\u4E0B\uFF0C\u6267\u884C\u547D\u4EE4",paraId:18,tocIndex:2},{value:`docker-compose up -d --build
`,paraId:19,tocIndex:2}]}}]);
