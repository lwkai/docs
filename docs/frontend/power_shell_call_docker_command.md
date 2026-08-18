# PowerShell 一键启动 WSL Docker 容器内的开发项目

## 1. 核心需求与背景

* **开发环境**：代码放在 WSL 子系统中，运行环境及依赖安装在 Docker 容器内部（WSL 无直接运行环境）。
* **目标**：在 Windows PowerShell 终端中，无需手动一步步 `wsl` -> `docker exec` -> `cd` -> 运行命令，实现打开 PowerShell 或选中特定终端配置文件时，**一键自动贯穿启动容器内的项目**。

---

## 2. 验证成功的终端命令

在 Windows PowerShell 中直接运行以下贯穿命令：

```powershell
wsl docker exec -it df519ca1dd6a bash -c "cd /workspace/frontend && npm run build:weapp -- --watch"

```

### 命令参数拆解：

* **`wsl`**：在 Windows 宿主机中直接调用 WSL 子系统的 Docker 命令。
* **`docker exec -it df519ca1dd6a`**：以交互式终端（`-it`）模式进入容器 ID 为 `df519ca1dd6a` 的容器。
* **`bash -c "..."`**：在容器内的 `bash` Shell 中执行指定的连续命令。
* **`cd /workspace/frontend`**：切换到容器内部的项目根目录。
* **`npm run build:weapp -- --watch`**：在容器内启动微信小程序编译与监听服务。

---

## 3. Windows Terminal（终端）一键配置步骤

通过 Windows Terminal 的“配置文件”功能，为该项目创建专属的终端标签页：

### 操作步骤：

1. 打开 **Windows Terminal**（Windows 终端）。
2. 点击顶部标签栏的下拉箭头 `∨`，选择 **设置**（或按快捷键 `Ctrl + ,`）。
3. 在左侧菜单栏底部点击 **添加新配置文件**。
4. 选择 **新建空白配置文件**。
5. 配置以下基本信息：
* **名称**：例如 `微信小程序前端编译` 或 `Project Frontend Watch`
* **命令行**：粘贴以下指令：
```powershell
%SystemRoot%\System32\wsl.exe docker exec -it df519ca1dd6a bash -c "cd /workspace/frontend && npm run build:weapp -- --watch"

```

6. 点击右下角 **保存**。

---

## 4. 日常使用方法

每次需要启动项目编译时：

1. 打开 Windows Terminal。
2. 点击顶部标签栏下拉菜单 `∨`。
3. 点击刚创建的配置文件名称（例如 **微信小程序前端编译**）。
4. 终端会自动连接 WSL → 进入容器 `df519ca1dd6a` → 切换目录 `/workspace/frontend` → 执行监听编译。

---

## 5. 注意事项与日常维护

1. **容器 ID 与名称变动**：
* 目前命令中使用了固定容器 ID `df519ca1dd6a`。如果容器重建或重新拉取，ID 可能会发生改变。
* **建议**：可以用容器名称（`NAMES`）替换容器 ID，例如将 `df519ca1dd6a` 替换为 `my-frontend-container`，这样更稳定。


2. **容器启动状态**：
* 执行前请确保该 Docker 容器处于运行状态（`running`）。如果容器已停止，可在 PowerShell 中运行 `wsl docker start df519ca1dd6a` 先启动容器。




出现类似这样的错误：
```
Error response from daemon: container 55ed5af298355ed8cae7cfbfd37188705220abbaa0430114e689970eeabf62e9 is not running


[已退出进程，代码为 1 (0x00000001)]

现在可以使用Ctrl+D关闭此终端，或按 Enter 重新启动。
```


出现这个错误的直接原因是：**你的 Docker 容器当前处于“停止/未运行”（Status: Exited）状态**。`docker exec` 命令要求目标容器必须处于运行中才能进入并执行代码。

为了在点击 Windows Terminal 配置文件时**能够自动将未运行的容器启动**，同时继续保留上一步“防止内存溢出”和“失败后不退出终端”的功能，可以在命令中加入 `docker start` 逻辑。

---

### 解决方案：在命令中增加自动启动容器机制

将 Windows Terminal 配置文件中的命令行（Command line）替换为以下内容：

```powershell
%SystemRoot%\System32\wsl.exe bash -c "docker start 55ed5af29835 > /dev/null 2>&1 && docker exec -it 55ed5af29835 bash -c 'export NODE_OPTIONS=\"--max-old-space-size=4096\" && cd /workspace && npm run dev; exec bash'"

```

---

### 命令执行逻辑拆解

1. **`docker start 55ed5af29835 > /dev/null 2>&1`**：
* 在执行 `exec` 之前，先尝试启动容器。
* 如果容器已经是运行状态，该命令会静默跳过；如果容器已停止，会自动将它拉起（避免报 `container is not running`）。


2. **`&&`**：
* 保证容器启动成功后，才接着执行后面的操作。


3. **`docker exec -it 55ed5af29835 ...`**：
* 进入容器，提高 Node.js 内存限制（防止 137 错误），进入 `/workspace` 目录并启动 `npm run dev`。


4. **`; exec bash`**：
* 即使 `npm run dev` 意外崩溃，依然保留在容器内的 `bash` 提示符下，防止窗口直接挂掉并弹出 exit 报错。



---

### 终极优化建议：使用容器名称代替容器 ID（推荐）

容器 ID（如 `55ed5af29835`）在容器销毁、重新构建或通过 Dev Containers 重新挂载后很容易改变。建议在容器启动时赋予它一个固定的名称（或者在 Docker Desktop / VS Code 中查看它的 **NAME**，例如 `my-dev-container`）。

如果使用容器名称（例如 `my-dev-container`），配置命令会更加稳定且易读：

```powershell
%SystemRoot%\System32\wsl.exe bash -c "docker start my-dev-container > /dev/null 2>&1 && docker exec -it my-dev-container bash -c 'export NODE_OPTIONS=\"--max-old-space-size=4096\" && cd /workspace && npm run dev; exec bash'"

```