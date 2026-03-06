"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[811],{98140:function(s,d,e){e.r(d);var t=e(82532),a=e(36800),c=e(31546),m=e(76607),p=e(377),o=e(91769),h=e(45122),f=e(50760),l=e(92358),r=e(11872),i=e(75271),n=e(52154),_=e(52676);function u(){return(0,_.jsx)(l.dY,{children:(0,_.jsx)(i.Suspense,{fallback:(0,_.jsx)(r.Z,{}),children:(0,_.jsx)(_.Fragment,{children:(0,_.jsxs)("div",{className:"markdown",children:[(0,_.jsxs)("h1",{id:"\u8FD0\u884C\u8C03\u8BD5\u914D\u7F6E",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u8FD0\u884C\u8C03\u8BD5\u914D\u7F6E",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"\u8FD0\u884C/\u8C03\u8BD5\u914D\u7F6E"]}),(0,_.jsx)("p",{children:n.texts[0].value}),(0,_.jsx)("p",{children:(0,_.jsx)("img",{alt:"\u914D\u7F6E\u56FE",src:e(99908)})}),(0,_.jsx)("p",{children:n.texts[1].value}),(0,_.jsx)("p",{children:n.texts[2].value}),(0,_.jsx)(o.Z,{children:n.texts[3].value}),(0,_.jsx)("p",{children:n.texts[4].value}),(0,_.jsxs)("h4",{id:"\u6587\u4EF6__init__py",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u6587\u4EF6__init__py",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"\u6587\u4EF6",(0,_.jsx)("code",{children:n.texts[5].value})]}),(0,_.jsx)(o.Z,{lang:"python",children:n.texts[6].value})]})})})})}d.default=u},52154:function(s,d,e){e.r(d),e.d(d,{texts:function(){return t}});const t=[{value:"\u5728 PyCharm \u4E2D\uFF0C\u8FD0\u884C\u65F6\uFF0C\u914D\u7F6E\u5F53\u524D\u4F7F\u7528\u54EA\u4E2A.env\u914D\u7F6E\u6587\u4EF6\u7684\u5904\u7406",paraId:0,tocIndex:0},{value:"\u56FE\u4E2D \u73AF\u5883\u53D8\u91CF \u4F4D\u7F6E\uFF0C\u6700\u540E\u9762\u589E\u52A0 DJANGO_ENV= \u4F60\u7684\u8FD0\u884C\u73AF\u5883\u540D\u79F0",paraId:1,tocIndex:0},{value:"\u5F53\u524D\u9879\u76EE\u4F7F\u7528 Django \u6846\u67B6\uFF0C\u5BF9\u5E94\u7684\u914D\u7F6E\u6587\u4EF6\u5904\u7406\u5728\u9879\u76EE\u540D\u79F0\u6587\u4EF6\u5939\u4E0B\uFF0C\u6211\u521B\u5EFA\u4E86\u4E00\u4E2A settings \u76EE\u5F55\uFF0C\u91CC\u9762\u5206 \uFF1A",paraId:2,tocIndex:0},{value:`\u9879\u76EE\u540D\u79F0\u6587\u4EF6\u5939
	settings
		__init__.py  # \u542F\u52A8\u65F6\uFF0C\u914D\u7F6E\u7684\u4F7F\u7528\u54EA\u4E2A\u73AF\u5883\u5904\u7406\u76F8\u5173\u4EE3\u7801
		base.py  #\u516C\u5171\u7684  
		dev.py   #\u5F00\u53D1\u73AF\u5883  
		prod.py  #\u751F\u4EA7\u73AF\u5883 
		test.py  #\u6D4B\u8BD5\u73AF\u5883
		feishu.py #\u98DE\u4E66\u73AF\u5883
    .env
    .env.dev  # \u5F00\u53D1\u73AF\u5883\u914D\u7F6E\u6587\u4EF6
    .env.test # \u6D4B\u8BD5\u73AF\u5883\u914D\u7F6E\u6587\u4EF6
    .env.prod # \u751F\u4EA7\u73AF\u5883\u914D\u7F6E\u6587\u4EF6
    .env.feishu # \u98DE\u4E66\u73AF\u5883\u914D\u7F6E\u6587\u4EF6
`,paraId:3,tocIndex:0},{value:"\u5206\u522B\u5BF9\u5E94\u5404\u73AF\u5883\u3002",paraId:4,tocIndex:0},{value:"__init__.py",paraId:5},{value:`import os

from pathlib import Path

env = os.getenv('DJANGO_ENV', 'dev').lower() # \u83B7\u53D6\u8FD0\u884C\u65F6\u914D\u7F6E\u7684\u73AF\u5883

BASE_DIR = Path(__file__).resolve().parent.parent
# \u5982\u679C\u4F60\u53EA\u60F3\u4EE5 settings.py \u6240\u5728\u76EE\u5F55\u4E3A\u57FA\u51C6\uFF1A
SETTINGS_DIR = Path(__file__).resolve().parent

if env == 'prod':  # \u5982\u679C\u662F\u914D\u7F6E\u7684\u751F\u4EA7\u73AF\u5883
    target_file = SETTINGS_DIR / 'prod_local.py' # \u8FD9\u4E2A\u662F\u7279\u6B8A\u7684\uFF0C\u5982\u679C\u672C\u5730\u8981\u4EE5\u8FD9\u4E2A\u6A21\u5F0F\u8FD0\u884C\uFF0C\u53EF\u4EE5\u521B\u5EFA\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u9488\u5BF9\u672C\u5730\u8FD0\u884C\u6D4B\u8BD5\uFF0C\u6CE8\u610Fprod_local.py\u4E0D\u8981\u6DFB\u52A0\u5230\u7248\u672C\u7BA1\u7406\u5E93
    if target_file.exists():
        from .prod_local import *  # \u8F7D\u5165\u672C\u5730\u751F\u4EA7\u73AF\u5883
    else:
        from .prod import *  # \u8F7D\u5165\u751F\u4EA7\u7AD9\u7684\u914D\u7F6E\u6587\u4EF6 \u5BF9\u5E94 prod.py
elif env == 'test': # \u6D4B\u8BD5\u73AF\u5883
    target_file = SETTINGS_DIR / 'test_local.py'  # \u52A0\u8F7D\u672C\u5730\u5F00\u53D1\u914D\u7F6E\u6587\u4EF6\uFF0C\u6B64\u6587\u4EF6\u4E0D\u4E0A\u7248\u672C\u7BA1\u7406\u4E2D
    if target_file.exists():
        from .test_local import *
    else:
        from .test import *
elif env == 'weixin': # \u5FAE\u4FE1
    from .weixin import *
elif env == 'feishu':  # \u98DE\u4E66
	from .feishu import *
else:  # \u9ED8\u8BA4\u7528\u5F00\u53D1\u73AF\u5883
    from .dev import *

`,paraId:6,tocIndex:1}]},99908:function(s,d,e){s.exports=e.p+"static/debug-config.f46409eb.png"}}]);
