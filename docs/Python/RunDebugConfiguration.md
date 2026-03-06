# 运行/调试配置

在 PyCharm 中，运行时，配置当前使用哪个.env配置文件的处理

![配置图](./static/debug-config.png)

图中 环境变量 位置，最后面增加 DJANGO_ENV= 你的运行环境名称

当前项目使用 Django 框架，对应的配置文件处理在项目名称文件夹下，我创建了一个 settings 目录，里面分 ：
```
项目名称文件夹
	settings
		__init__.py  # 启动时，配置的使用哪个环境处理相关代码
		base.py  #公共的  
		dev.py   #开发环境  
		prod.py  #生产环境 
		test.py  #测试环境
		feishu.py #飞书环境
    .env
    .env.dev  # 开发环境配置文件
    .env.test # 测试环境配置文件
    .env.prod # 生产环境配置文件
    .env.feishu # 飞书环境配置文件
```
分别对应各环境。

#### 文件`__init__.py`
```python
import os

from pathlib import Path

env = os.getenv('DJANGO_ENV', 'dev').lower() # 获取运行时配置的环境

BASE_DIR = Path(__file__).resolve().parent.parent
# 如果你只想以 settings.py 所在目录为基准：
SETTINGS_DIR = Path(__file__).resolve().parent

if env == 'prod':  # 如果是配置的生产环境
    target_file = SETTINGS_DIR / 'prod_local.py' # 这个是特殊的，如果本地要以这个模式运行，可以创建这个文件，针对本地运行测试，注意prod_local.py不要添加到版本管理库
    if target_file.exists():
        from .prod_local import *  # 载入本地生产环境
    else:
        from .prod import *  # 载入生产站的配置文件 对应 prod.py
elif env == 'test': # 测试环境
    target_file = SETTINGS_DIR / 'test_local.py'  # 加载本地开发配置文件，此文件不上版本管理中
    if target_file.exists():
        from .test_local import *
    else:
        from .test import *
elif env == 'weixin': # 微信
    from .weixin import *
elif env == 'feishu':  # 飞书
	from .feishu import *
else:  # 默认用开发环境
    from .dev import *

```
