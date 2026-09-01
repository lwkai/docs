# Vite项目中，增加 Vue Router

在刚创建的 Vite 项目（通常是 Vue 3）中，使用 `<router-view>` 需要先安装并配置 **Vue Router**。

Vite 默认的模板是非常精简的，不会自动包含路由功能。你可以按照以下 4 个步骤快速搞定：

### 1. 安装 Vue Router

在终端运行以下命令：

```bash
npm install vue-router@4
```

------

### 2. 创建路由配置文件

在 `src` 目录下新建一个 `router` 文件夹，并创建 `index.js`（或 `index.ts`）：

**路径：`src/router/index.js`**

```js
import { createRouter, createWebHistory } from 'vue-router'
// 1. 定义路由组件，也可以从其他文件导入
const Home = { template: '<div>首页</div>' }
const About = { template: '<div>关于</div>' }

// 2. 定义一些路由
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

------

### 3. 在 `main.js` 中注册

你需要告诉 Vue 应用使用这个路由配置。

**路径：`src/main.js`**

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入刚才创建的 router

const app = createApp(App)

app.use(router) // 使用路由插件
app.mount('#app')
```

------

### 4. 在 `App.vue` 中使用 `<router-view>`

现在你可以在模板中放置“占位符”了。当 URL 匹配到对应路径时，组件就会渲染在这里。

**路径：`src/App.vue`**

代码段

```vue
<template>
  <nav>
    <router-link to="/">首页</router-link> |
    <router-link to="/about">关于</router-link>
  </nav>

  <hr />

  <router-view></router-view>
</template>
```

### 💡 小贴士：

- **路由懒加载**：在实际开发中，建议使用 `component: () => import('../views/Home.vue')` 的方式引入组件，这样可以优化首屏加载速度。
- **Vite 预设**：如果你下次想省事，创建项目时运行 `npm create vue@latest`，它会交互式询问你是否需要安装 Vue Router，选“Yes”它就会帮你把上面这些代码全部生成好。

需要我帮你写一个包含“详情页”和“参数传递”的进阶路由例子吗？