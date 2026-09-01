# APIView 与 ViewSet (Django REST Framework)

本文适合：

* Django 新手
* DRF 新手
* 从 Java/Spring 转 Python 的开发者
* 想理解 APIView 和 ViewSet 区别的人

目标：

彻底理解：

* APIView 是什么
* ViewSet 是什么
* Serializer 是什么
* JWT 在哪里工作
* 为什么大厂很多喜欢 APIView
* 如何正确组织项目结构

---

## 一、什么是 DRF？

Django REST framework

DRF：

全称：

```text id="jlwm9s"
Django REST Framework
```

它是：

> Django 最流行的 REST API 框架。

作用：

* 开发接口
* JSON 返回
* 用户认证
* JWT
* 参数校验
* 分页
* 权限控制

---

## 二、DRF 中最核心的两个视图模式

DRF：

最常用：

| 类型      | 作用      |
| ------- | ------- |
| APIView | 自定义业务接口 |
| ViewSet | 标准 CRUD |

---

很多新手：

一开始：

```text id="jlwmf0"
不知道该选哪个
```

这是非常正常的。

---

## 三、先理解 ViewSet

---

### ViewSet 是什么？

ViewSet：

本质：

```text id="9rjlwm"
自动 CRUD 生成器
```

它：

帮你自动生成：

* 增删改查
* list
* create
* update
* delete

---

## 四、最经典 ViewSet 写法

---

### models.py

```python id="jlwm8c"
class User(models.Model):

    username = models.CharField(max_length=20)
```

---

### serializers.py

```python id="j2jlwm"
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = '__all__'
```

---

### views.py

```python id="8mjlwm"
from rest_framework.viewsets import ModelViewSet

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()

    serializer_class = UserSerializer
```

---

### urls.py

```python id="jlwm7j"
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'users', UserViewSet)

urlpatterns = router.urls
```

---

## 五、它自动生成了什么？

DRF：

自动帮你生成：

| 方法     | URL       | 功能 |
| ------ | --------- | -- |
| GET    | /users/   | 列表 |
| POST   | /users/   | 创建 |
| GET    | /users/1/ | 详情 |
| PUT    | /users/1/ | 修改 |
| DELETE | /users/1/ | 删除 |

---

## 六、ViewSet 的优点

---

### 1. 代码少

你只写：

```python id="1vjlwm"
queryset
serializer_class
```

即可。

---

### 2. CRUD 特别快

适合：

* 后台管理
* 商品
* 用户
* 分类
* 标签

---

### 3. 自动 RESTful

URL：

自动规范化。

---

## 七、ViewSet 的缺点

复杂业务：

容易：

```python id="h0jlwm"
@action
@action
@action
```

最后：

```text id="jlwm3f"
一个 ViewSet 几千行
```

非常难维护。

---

## 八、什么是 @action？

例如：

你想：

```text id="5qjlwm"
/users/login/
/users/logout/
/users/heartbeat/
```

这些：

不是：

```text id="0qjlwm"
标准 CRUD
```

于是：

DRF 提供：

```python id="jlwm6r"
@action
```

---

## 九、ViewSet + @action 示例

```python id="6rjlwm"
from rest_framework.decorators import action

class UserViewSet(ModelViewSet):

    @action(detail=False, methods=['post'])
    def heartbeat(self, request):

        return Response({
            "msg": "heartbeat"
        })
```

---

## 十、自动生成 URL

```text id="m6jlwm"
/users/heartbeat/
```

---

## 十一、问题来了

如果：

```python id="8xjlwm"
@action
@action
@action
```

越来越多。

最后：

```text id="q4jlwm"
ViewSet 会特别乱
```

---

## 十二、于是大型项目更喜欢 APIView

---

### APIView 是什么？

APIView：

本质：

```text id="3wjlwm"
一个 URL 对应一个 View
```

更接近：

```text id="3zjlwm"
原生 Django View
```

---

## 十三、APIView 最经典写法

---

### views.py

```python id="jlwm8x"
from rest_framework.views import APIView
from rest_framework.response import Response

class UserHeartbeatView(APIView):

    def post(self, request):

        return Response({
            "msg": "heartbeat"
        })
```

---

### urls.py

```python id="x8jlwm"
from django.urls import path

urlpatterns = [

    path(
        'users/heartbeat/',
        UserHeartbeatView.as_view()
    ),
]
```

---

## 十四、APIView 路由逻辑

APIView：

不是：

```text id="jlwmt0"
Router 自动生成
```

而是：

> 你自己写 path。

---

## 十五、APIView 如何分发请求？

根据：

```text id="x6jlwm"
HTTP Method
```

---

### GET

```python id="6qjlwm"
def get()
```

---

### POST

```python id="j7jlwm"
def post()
```

---

### PUT

```python id="0mjlwm"
def put()
```

---

### DELETE

```python id="1jjlwm"
def delete()
```

---

## 十六、APIView 的优点

---

### 1. 业务清晰

例如：

```text id="4j’wini"
heartbeat.py
login.py
logout.py
```

职责明确。

---

### 2. 特别适合复杂业务

例如：

* 登录
* IM
* WebSocket
* 支付
* AI
* 文件上传
* 在线状态

---

### 3. 更接近大型项目架构

大型项目：

通常：

```text id="jlwm4x"
一个接口一个 View
```

---

## 十七、APIView 的缺点

---

### 代码会多一点

因为：

很多东西：

你自己写。

---

## 十八、Serializer 是什么？

很多新手误解：

```text id="v6jlwm"
Serializer 只是数据库序列化
```

其实：

不是。

---

## 十九、Serializer 真正作用

---

### 1. 参数校验

例如：

```python id="3xjlwm"
username 必填
password 长度
邮箱格式
```

---

### 2. JSON 转 Python

---

### 3. 安全过滤

防止：

```text id="4xjlwm"
客户端乱传字段
```

---

## 二十、APIView 需要 Serializer 吗？

答案：

---

### 非常推荐使用

只是：

APIView：

不会：

```text id="7wjlwm"
自动调用
```

需要：

你自己调用。

---

## 二十一、APIView + Serializer 示例

---

### serializers.py

```python id="3r’wini"
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField()
```

---

### views.py

```python id="6yjlwm"
class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        return Response(
            serializer.validated_data
        )
```

---

## 二十二、ViewSet 为什么不用手动调用？

因为：

DRF：

已经帮你：

自动：

```python id="2hjlwm"
serializer.is_valid()

serializer.save()
```

了。

---

## 二十三、JWT 在哪里工作？

很多人误以为：

```text id="v4jlwm"
JWT 属于 ViewSet
```

其实：

不是。

---

JWT：

属于：

```text id="0wjlwm"
Authentication 层
```

---

## 二十四、JWT 与 APIView/ViewSet 无关

所以：

---

### APIView

```python id="0vjlwm"
request.user
```

能获取用户。

---

### ViewSet

```python id="jlwmu8"
request.user
```

也一样。

---

## 二十五、JWT 配置

settings.py：

```python id="jlwmu2"
REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': (

        'rest_framework_simplejwt.authentication.JWTAuthentication',

    ),
}
```

---

## 二十六、APIView 中使用 JWT

```python id="9pileswi"
from rest_framework.permissions import IsAuthenticated

class HeartbeatView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        print(request.user)

        return Response()
```

---

## 二十七、ViewSet 中使用 JWT

```python id="z5jlwm"
class UserViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]
```

完全一样。

---

## 二十八、APIView 推荐项目结构（重点）

大型项目：

推荐：

---

### serializers.py

```text id="1xileswi"
参数校验
```

---

### services.py

```text id="0uileswi"
业务逻辑
```

---

### views.py

```text id="1nileswi"
HTTP入口
```

---

## 二十九、为什么不要把业务写 View？

错误示例：

```python id="jlwm7v"
class LoginView(APIView):

    def post(self, request):

        几百行业务代码
```

后期：

特别难维护。

---

## 三十、推荐结构

---

### serializers.py

```python id="3mileswi"
class LoginSerializer(...)
```

---

### services.py

```python id="x6েওঁ"
class LoginService:

    @staticmethod
    def login(...):
```

---

### views.py

```python id="jlwmk4"
class LoginView(APIView):

    def post(self, request):

        serializer = ...

        LoginService.login(...)
```

---

## 三十一、大厂为什么很多偏向 APIView？

因为：

复杂业务：

ViewSet：

后期：

```text id="9vletseng"
容易变超级大文件
```

而 APIView：

```text id="5qletseng"
职责清晰
```

更适合多人协作。

---

## 三十二、什么时候用 ViewSet？

适合：

```text id="7rileswi"
标准 CRUD
```

例如：

* 商品
* 分类
* 用户管理
* 标签
* 后台管理

---

## 三十三、什么时候用 APIView？

适合：

```text id="7o’wini"
复杂业务接口
```

例如：

* 登录
* 支付
* IM
* 在线状态
* 文件上传
* AI
* WebSocket

---

## 三十四、新手最推荐方案

---

### 简单 CRUD

使用：

```text id="9f’wini"
ViewSet
```

---

### 复杂业务

使用：

```text id="5j’wini"
APIView
```

---

## 三十五、在线状态项目推荐

你现在：

在线状态系统。

推荐：

---

### 使用 APIView

例如：

---

#### 心跳

```python id="0m’wini"
class HeartbeatView(APIView)
```

---

#### 在线列表

```python id="2j’wini"
class OnlineUsersView(APIView)
```

---

#### 下线

```python id="4d’wini"
class OfflineView(APIView)
```

---

## 三十六、最终一句话总结（最重要）

---

### ViewSet

```text id="7s’wini"
适合 CRUD
自动化强
代码少
```

---

### APIView

```text id="3w’wini"
适合复杂业务
更灵活
更适合大型项目
```

---

### Serializer

```text id="9o’wini"
APIView 也强烈推荐使用
```

---

### JWT

```text id="2q’wini"
APIView 和 ViewSet 完全一样
```

---

## 三十七、真正的大厂经验

大型项目：

最终：

大多数核心业务：

其实都会：

```text id="5n’wini"
回归 APIView
```

因为：

> 业务复杂度远远超过 CRUD。
