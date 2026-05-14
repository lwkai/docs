# Python

## 字典移除一项的操作方式

### 1. `pop()` 方法（最安全，最推荐）

如果你想删除某个键，并且获取它对应的值，使用 pop()。

同时，它支持设置默认值，这样当键不存在时，程序不会报错，而是返回默认值。

```python
my_dict = {
  "name": "Alex", 
  "age": 25, 
  "corp_id": "wx123456"
}

# 1. 成功删除并获取值
age = my_dict.pop("age")
print(age)      # 输出: 25
print(my_dict)  # 输出: {'name': 'Alex', 'corp_id': 'wx123456'}

# 2. 安全删除（即使键不存在，也不会报错，会返回 None 或你指定的默认值）
signature = my_dict.pop("signature", None) 
print(signature) # 输出: None (因为字典里没有 'signature')
```

### 2. `del` 关键字（最直接，但要注意 KeyKerror）

如果你不需要获取被删除的值，只是单纯想把它从字典里抹去，可以使用 `del`。

注意：如果键不存在，会抛出 `KeyError` 异常，因此建议配合 `if` 判断使用。

```python
my_dict = {
  "name": "Alex", 
  "age": 25, 
  "corp_id": "wx123456"
}

# 如果确认键一定存在，可以直接删除
del my_dict["age"]

# 如果不确定键是否存在，安全的写法：
if "signature" in my_dict:
    del my_dict["signature"]

```

### 3. `popitem()` 方法（删除最后一项）

在 Python 3.7+ 中，字典是有序的（按插入顺序）。`popitem()` 会删除并返回字典中的最后一对键值（LIFO 顺序）。

注意：如果字典为空，调用它会报 `KeyError`。

```python
my_dict = {"name": "Alex", "age": 25}

# 删除最后一项
key, value = my_dict.popitem()
print(key, value)  # 输出: age 25
print(my_dict)     # 输出: {'name': 'Alex'}
```

## 彻底清空字典

字典.clear()