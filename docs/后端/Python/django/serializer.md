# Serializer (序列化器)

这是一份为你量身定制的 **Django REST Framework (DRF) 序列化器（Serializer）从零开始到大厂进阶** 的学习笔记。笔记结合了你之前在“企业互联邀请”项目中所遇到的核心痛点（如只读字段控制、状态转换、列表性能塌方、动态分发等），按梯度循序渐进。

---

# 💡 DRF 序列化器核心学习笔记：从零基础到大厂生产级架构

---

## 第一阶段：零基础破冰 —— 什么是序列化器？

### 1. 核心概念与双向路径

在传统的 Django 中，我们通过模板渲染 HTML。但在前后端分离的 API 架构中，后端只负责传输数据（通常是 JSON）。
序列化器就是穿梭在 **Python 对象** 和 **标准 JSON** 之间的“翻译官”，它负责两条核心路径：

* **序列化 (Serialization - 读取/Output)**：把 Django 的 `Model 对象` 转换成 `JSON 字典` 返回给前端（GET 请求）。
* **反序列化 (Deserialization - 写入/Input)**：把前端传来的 `JSON 字典` 校验并翻译成 `Python 验证后的数据 (validated_data)`，最终保存到数据库（POST/PUT 请求）。

### 2. 从最基础的 `Serializer` 开始

如果你有一个纯 Python 类，或者想完全手动控制字段，可以继承 `serializers.Serializer`：

```python
from rest_framework import serializers

class UserDemoSerializer(serializers.Serializer):
    # 显式定义每个字段
    username = serializers.CharField(max_id=100)
    email = serializers.EmailField()
    
    # 手动实现写入逻辑
    def create(self, validated_data):
        return DemoUser.objects.create(**validated_data)

```

---

## 第二阶段：效率飞跃 —— 绑定模型的 `ModelSerializer`

在实际开发中，我们 90% 的场景都是围绕数据库模型（Model）做 CRUD。DRF 提供了 `ModelSerializer`，它可以根据 Model 自动推导字段，极大地减少了重复代码。

### 1. 标准的基础结构

结合你的企业互联项目，定义一个标准的基础模型序列化器：

```python
from rest_framework import serializers
from .models import InterconnectInvitation

class InterconnectInvitationBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterconnectInvitation
        # fields 决定了序列化器的边界！只有在这里面的字段才能参与输入或输出
        fields = ['id', 'inviter_corp_id', 'inviter_staff_id', 'invite_code', 'status', 'created_at']

```

### 2. 核心避坑三大属性：控制“谁能读、谁能写”

大厂 API 规范极其严格，绝不允许用户通过 POST 请求篡改某些系统生成的字段（如状态、邀请码）。我们必须通过控制属性来实现 **Request DTO（输入）** 与 **Response DTO（输出）** 的彻底隔离。

* **`fields`**：总边界。无论读写，只要想用，必须包含。
* **`read_only_fields`**：**只读字段（只出不进）**。前端可见（在 `serializer.data` 中），但前端 POST 传过来时，DRF 会自动剔除，确保安全。
* **`write_only_fields`**（或字段参数 `write_only=True`）：**只写字段（只进不出）**。例如密码，允许前端传，但序列化返回时绝对不展示。

#### 💡 大厂级安全改造示例：

```python
class InterconnectInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterconnectInvitation
        fields = ['id', 'inviter_corp_id', 'inviter_staff_id', 'invite_code', 'status', 'created_at']
        
        # 核心防线：这些字段由后端逻辑自动处理，禁止前端传入篡改
        read_only_fields = ['id', 'invite_code', 'status', 'created_at']

    def create(self, validated_data):
        # 在后端高层自动生成安全数据，符合安全规范
        import uuid
        validated_data['invite_code'] = uuid.uuid4().hex
        validated_data['status'] = 0  # 默认未处理
        return super().create(validated_data)

```

---

## 第三阶段：展现层优化 —— 自定义计算属性与动态扩展

在前后端协作中，前端往往不希望只拿到硬编码的数字（如 `status: 0`），也不希望自己拼 URL。这就需要序列化器具备“加工数据”的能力。

### 1. 利用 `SerializerMethodField` 动态增加字段

如果字段在数据库里不存在，是动态计算出来的，使用 `SerializerMethodField()`。

* **规则**：定义字段 `xxx` 后，必须在类中提供一个 `get_xxx(self, obj)` 的方法，`obj` 是当前处理的 Model 实例。

### 2. 大厂状态优雅转换：同步返回 ID 与 Label

结合你的 `models.IntegerChoices`（0:未处理，1:已同意...），让 API 一次性返回丰富的结构体：

```python
class InterconnectInvitationDisplaySerializer(serializers.ModelSerializer):
    # 1. 自定义计算属性：返回状态的详情字典
    status_info = serializers.SerializerMethodField()
    # 2. 自定义计算属性：直接返回拼接好的完整跳转 URL
    invite_url = serializers.SerializerMethodField()

    class Meta:
        model = InterconnectInvitation
        fields = ['id', 'inviter_corp_id', 'status', 'status_info', 'invite_url']
        read_only_fields = fields

    def get_status_info(self, obj):
        """让前端同时拿到状态码和可读的中文名称，杜绝前端硬编码"""
        # 利用 Django 原生 IntegerChoices 的 .value 和 .label
        return {
            "id": obj.status,
            "name": obj.get_status_display()  # Django 自动生成的 get_FOO_display() 方法
        }

    def get_invite_url(self, obj):
        """动态生成带签名的安全链接"""
        base_url = "https://yourdomain.com/api/interconnect/accept/"
        return f"{base_url}?invite_id={obj.id}&invite_code={obj.invite_code}"

```

⚠️ **常见报错避坑**：如果你声明了 `signature = serializers.SerializerMethodField()`，但忘记在 `Meta.fields` 列表中加上 `'signature'`，DRF 会抛出 `AssertionError`。**显式定义的字段必须加入 fields 列表！**

---

## 第四阶段：大厂进阶架构 —— 读写分离与多场景动态分发

### 1. 为什么不能“一个序列化器走天下”？（痛点复盘）

如果你的序列化器里包含了复杂的计算（如循环调用 SHA1 算法、UUID 生成、外表关联查询等）。当你调用 **GET 列表接口（list 动作）** 时，假设一页返回 50 条数据，后端就会死循环计算 50 次，导致 **CPU 爆表、性能崩塌**。
而且，列表页往往只是用于管理员展示“历史记录”，根本没人点击，此时计算签名是毫无意义的。

### 2. 核心工程思想：场景拆分 / 读写分离

针对同一个 Model，大厂标准的做法是：根据不同的场景（创建、列表展示、详情查看），编写多个专门的序列化器。

[Image illustrating Read-Write Separation in API serializers where separate DTOs handle list, detail, and creation requests]

#### 第一步：进行序列化器精细化拆分

```python
# 1. 用于【列表展示】的轻量级序列化器：追求极致速度，无签名，无重度计算
class InterconnectInvitationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterconnectInvitation
        fields = ['id', 'inviter_corp_id', 'status', 'created_at']  # 仅保留核心列
        read_only_fields = fields

# 2. 用于【创建/详情】的高层序列化器：包含 invite_url, signature 等重度计算字段
class InterconnectInvitationDetailSerializer(serializers.ModelSerializer):
    status_info = serializers.SerializerMethodField()
    invite_url = serializers.SerializerMethodField()

    class Meta:
        model = InterconnectInvitation
        fields = ['id', 'inviter_corp_id', 'inviter_staff_id', 'status', 'status_info', 'invite_url', 'created_at']
        read_only_fields = fields

```

#### 第二步：在 ViewSet 中重写 `get_serializer_class` 动态分发

利用 DRF 视图集的 `self.action` 变量，判断当前是 `list`、`retrieve` 还是 `create` 动作，从而无缝分发不同的序列化器：

```python
from rest_framework import viewsets
from .models import InterconnectInvitation

class InterconnectInvitationViewSet(viewsets.ModelViewSet):
    queryset = InterconnectInvitation.objects.all()
    
    def get_serializer_class(self):
        """
        大厂最标准做法：动态重写序列化器分发
        """
        if self.action == 'list':
            # 列表请求：返回轻量级序列化器，保护 CPU 性能，提升吞吐量
            return InterconnectInvitationListSerializer
        
        elif self.action in ['retrieve', 'create']:
            # 详情或刚创建完：需要立刻对前端返回带签名的完整数据，返回重度序列化器
            return InterconnectInvitationDetailSerializer
        
        # 默认回滚（保障健壮性）
        return InterconnectInvitationListSerializer

```

---

## 📝 总结：你当前必须掌握的“高维心法”

1. **别动主表 ID**：处理互联企业数据冲突时，用映射表/虚拟映射作为中间层，序列化器可以通过外键动态包装组合。
2. **控制权收拢在后端**：状态的 `Id-Name` 映射、URL 签名计算必须由序列化器输出，前端只负责渲染，不负责逻辑硬编码。
3. **建立全局性能视角**：写代码时时刻警惕 `SerializerMethodField` 里的查询和计算。遇到高频 list 接口，果断采用**方案一（拆分序列化器并重写 `get_serializer_class`）**，这是最标准、最利于中大型项目解耦的工程审美。

## 常规的序列化器使用
```python
class CorpConnectionViewSet(CustomModelViewSet):
    queryset = CorpConnection.objects.all()

    permission_classes = [IsAuthenticated, IsCompanyUser]

    serializer_class = DataAggregateSerializer  # 要用到的序列化器
```