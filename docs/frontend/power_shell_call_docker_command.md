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