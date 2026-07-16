合并 TS 文件在 `ffmpeg` 中非常简单，因为 TS（Transport Stream）格式的特殊性，它支持**直接流式拼接**，不需要重新编码，速度极快。

以下是两种最常用的合并方法：

---

### 方法一：使用 Concat 协议（最快、最推荐）

如果你的 TS 文件是从同一个源切片出来的（比如 M3U8 直播流下载下来的切片），它们的编码格式、分辨率、音频参数完全一致，可以直接用 `concat` 协议像拼接字符串一样合并它们。

#### 命令行语法：

```bash
ffmpeg -i "concat:file1.ts|file2.ts|file3.ts" -c copy output.mp4

```

* **`"concat:file1.ts|file2.ts|..."`**：用竖线 `|` 将所有要合并的 TS 文件连起来。
* **`-c copy`**：直接复制音视频流（不进行重新编码），几乎不占用 CPU，几秒钟就能搞定。
* **`output.mp4`**：顺便转换成更常用的 MP4 格式（当然你也可以写 `output.ts`）。

---

### 方法二：使用 Concat 分离器（文件多时推荐）

如果你有几十甚至上百个 TS 文件，把文件名一个个用 `|` 连起来会超过操作系统的命令行长度限制。这时候可以用**文本列表**的方法。

#### 步骤 1：创建一个文本文件

新建一个名为 `filelist.txt` 的文本文件，把所有 TS 文件按顺序写进去，格式如下：

```text
file 'file1.ts'
file 'file2.ts'
file 'file3.ts'

```

> **💡 效率小技巧：** > * **Windows (CMD) 快速生成列表：** `(for %i in (*.ts) do @echo file '%i') > filelist.txt`
> * **Mac/Linux (Terminal) 快速生成列表：** `printf "file '%s'\n" *.ts > filelist.txt`
> 
> 

#### 步骤 2：运行 ffmpeg 命令

```bash
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4

```

* **`-f concat`**：指定使用 concat 分离器。
* **`-safe 0`**：防止因为文件名包含特殊字符或相对路径报错。
* **`-i filelist.txt`**：输入刚才创建的文本列表。

---

### ⚠️ 避坑指南（常见问题）

1. **合并后声音和画面不同步，或者进度条错乱？**
* **原因**：TS 切片文件自带时间戳（PTS）。如果这些 TS 文件不是来自同一个源，直接拼接会导致时间戳断裂。
* **解决方法**：去掉 `-c copy`，让 ffmpeg **重新编码**以强制重置时间戳：
```bash
ffmpeg -f concat -safe 0 -i filelist.txt -c:v libx264 -c:a aac output.mp4

```


*(注意：重新编码会变慢，但能解决绝大部分音画不同步的问题。)*


2. **文件名字典排序问题**
* 如果你的文件叫 `file1.ts`, `file2.ts` ... `file10.ts`，有些系统排序会变成 `file1.ts`, `file10.ts`, `file2.ts`。生成列表后记得**检查一下顺序**，否则合并出来的视频会乱序。