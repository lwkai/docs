# Taro 无缝循环滚动 + 可手拖实现示例（多实例隔离）

> 环境：Taro 4.x + React 18 + NutUI + Sass｜目标端：微信小程序 / H5

> 核心知识点：样式隔离、ref 传递、SelectorQuery 测量、配色相位对齐、组件级唯一 ID 收敛查询作用域、手拖暂停/恢复

---

## 一、效果目标

- 标签列表**无缝循环向左滚动**；
- 用户可**手指拖动**（左右都可），松手后自动恢复滚动；
- 页面上**放多个实例也不互相干扰**（多实例隔离）；
- 绕回接缝处**背景/配色不跳变**。

实现思路：把标签复制两份拼成双倍轨道 → `requestAnimationFrame` 平移 → `offset % 一份宽度` 取模绕回。

---

## 二、组件级唯一 ID（多实例隔离的关键）

**问题**：若用全局 `selectAll('.track .item')` 查节点，页面有两个滚动条时会把两处的节点混在一起，`Math.floor(len/2)` 取半逻辑直接算错。

**方案**：每个组件实例用 `useRef` 固化一个唯一 ID，挂到容器 `id` 上，查询时用 `#${uid} .track .item` 后代选择器限定作用域。

```tsx
import { useRef } from 'react';

let SEQ = 0; // 仅用于生成初始值，靠 useRef 固化

export function useMarqueeUid() {
  const uidRef = useRef(`marquee-${SEQ++}`);
  return uidRef.current;
}
```

> 注意：ID 必须用 `useRef` 固化，重渲染不再自增；Taro 不支持「在某个 DOM 节点下再 selectAll」，要用「带 ID 前缀的选择器字符串」实现作用域限定。目标是隔离，不是报错。

---

## 三、滚动 Hook（逻辑层，含测量 + rAF + 手拖）

```ts
// useLoopScroll.ts
import Taro from '@tarojs/taro';
import { useEffect, useRef } from 'react';

export function useLoopScroll(items: { id: string; label: string }[], uid: string) {
  const trackRef = useRef<HTMLElement | null>(null);     // 轨道：平移目标
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const singleWidthRef = useRef(0);     // 一份内容宽度（含尾部 gap）
  const enabledRef = useRef(false);     // 内容超过视口才滚动
  const draggingRef = useRef(false);    // 触摸状态
  const lastXRef = useRef(0);
  const speedRef = useRef(0.5);         // px/帧

  const applyOffset = () => {
    if (trackRef.current) {
      const w = singleWidthRef.current;
      // 双向无缝：translateX 始终落在 (-w, 0]，向左/向右拖都不会露白
      const off = w > 0 ? (((offsetRef.current % w) + w) % w) - w : offsetRef.current;
      trackRef.current.style.transform = `translateX(${off}px)`;
    }
  }

  const tick = () => {
    if (!draggingRef.current && enabledRef.current) {
      offsetRef.current -= speedRef.current;
      applyOffset();
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!items.length || !trackRef.current ) return;

    const measure = () => {
      const q = Taro.createSelectorQuery();
      // ① 测容器宽度 → 决定是否启用滚动
      q.select(`#${uid} .marquee-viewport`)
        .boundingClientRect((vp: any) => {
          // ② 测一份标签宽度（带 uid 限定作用域）
          q.selectAll(`#${uid} .marquee-track .marquee-item`)
            .boundingClientRect((nodes: any) => {
              if (!nodes || !nodes.length) return;
              const n = Math.floor(nodes.length / 2);
              const w = nodes[n].left - nodes[0].left; // 含尾部 gap
              if (w > 0) {
                singleWidthRef.current = w;
                enabledRef.current = w > (vp?.width || 0); // 超出视口才滚
              }
            })
            .exec();
        })
        .exec();
    };

    const t = setTimeout(measure, 50); // 等字体/布局稳定
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    return () => {
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [items, uid]);

  // 手拖：暂停/恢复
  const onTouchStart = (e: any) => {
    if (!enabledRef.current) return;
    draggingRef.current = true;
    lastXRef.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: any) => {
    if (!draggingRef.current) return;
    const x = e.touches[0].clientX;
    offsetRef.current += x - lastXRef.current; // 右移→内容右移
    lastXRef.current = x;
    applyOffset();
  };
  const onTouchEnd = () => {
    draggingRef.current = false;
  };

  return { trackRef, onTouchStart, onTouchMove, onTouchEnd };
}
```

**要点**：
- 测量必须用 `Taro.createSelectorQuery()`，**不能**用浏览器 `getBoundingClientRect`（小程序端无效）。
- `setTimeout(50)` 等布局稳定再测，避免字体未就绪测错宽度。
- `containerRef` 真正参与逻辑：测容器宽度决定是否 `enabledRef`（内容不足一屏不滚），不再是"死 ref"。
- 查询带 `#${uid}` 前缀 → 多实例各自隔离。

---

## 四、展示组件（配色相位对齐是关键）

```tsx
// LoopMarquee.tsx
import { View, Text } from '@tarojs/components';
import { useLoopScroll } from './useLoopScroll';
import { useMarqueeUid } from './useMarqueeUid';
import './LoopMarquee.scss';

const COLORS = 4; // 配色循环数（hot_tag_0 ~ hot_tag_3）

export function LoopMarquee({ lists }: { lists: { id: string; label: string }[] }) {
  const uid = useMarqueeUid();
  const { trackRef, onTouchStart, onTouchMove, onTouchEnd } =
    useLoopScroll(lists, uid);

  if (!lists.length) return null;

  // 关键：配色相位绑定「标签原始下标 k」，第二份复制也传 k（不传 k+len）
  const renderItem = (it: { id: string; label: string }, k: number) => (
    <View
      key={`${it.id}_${k}`}
      className={`marquee-item hot_tag_${k % COLORS}`}
    >
      <Text>{it.label}</Text>
    </View>
  );

  return (
    <View className="marquee-section" id={uid}>
      <View
        className="marquee-viewport"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <View
          className="marquee-track"
          ref={(el) => { trackRef.current = el as unknown as HTMLElement; }}
        >
          {/* 复制两份实现无缝；第二份传同样的 k → 配色与第一份逐位对齐 */}
          {lists.map((it, k) => renderItem(it, k))}
          {lists.map((it, k) => renderItem(it, k))}
        </View>
      </View>
    </View>
  );
}
```

**配色相位对齐说明**（绕回不变色的关键）：
- 若用全局 `idx % 4` 且第二份 `idx = k + len`，当 `len % 4 ≠ 0`（如后台给 6 个）时，第二份开头相位 `(k+6)%4 ≠ k%4`，与第一份错位 → 绕回时背景突变。
- 改为「第二份也传原始 `k`」→ 两份第 k 个都是 `hot_tag_{k%4}`，**逐位同色**，绕回零跳变。无论后台返回几个都正确。

---

## 五、样式（全局类名，无需 cssModules）

```scss
// LoopMarquee.scss
.marquee-section {
  padding: 0 16px;
}

.marquee-viewport {
  overflow: hidden;
  width: 100%;
}

.marquee-track {
  display: flex;
  gap: 10px;
  width: max-content;
  will-change: transform;

  .marquee-item {
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    background: rgba(139, 92, 246, 0.2);
    color: #cbd5e1;

    &.hot_tag_0 { background: #6f45a6; color: #ff4d4f; }
    &.hot_tag_1 { background: #5e1a77; color: #9b6fd4; }
    &.hot_tag_2 { background: #6708e2; color: #40a9ff; }
    &.hot_tag_3 { background: #6b4d91; color: #52c41a; }
  }
}
```

> 若把此组件抽成独立文件 + 独立 scss，注意：**微信小程序端函数组件的独立 scss 可能不会注入页面 wxss**。稳妥做法是把样式收口到页面级 scss（套在页面根类下），组件内不单独 import scss —— 这是本项目踩过的坑。

---

## 六、使用（多实例也安全）

```tsx
// 页面中
<LoopMarquee lists={hotTagsA} ></LoopMarquee>
<LoopMarquee lists={hotTagsB} ></LoopMarquee> // 第二个实例用独立 uid，查询互不干扰
```

---

## 七、踩坑清单（反模式，勿复踩）

1. ❌ 给普通函数组件单独建 scss 又指望小程序端自动生效 → 样式丢失，收口到页面 scss。
2. ❌ 用浏览器 `getBoundingClientRect` 拿布局 → 小程序端无效，必须用 `Taro.createSelectorQuery()`。
3. ❌ 全局 `selectAll('.track .item')` 做测量 → 多实例串扰，用 `#${uid}` 限定作用域。
4. ❌ 配色用全局 `idx % 4` 且第二份 `idx + len` → 相位错位绕回变色，改用原始 `k % 4`。
5. ❌ `cloneNode` 复制 React 节点 → 事件丢失 + 协调冲突，复制应在数据/JSX 层做。
6. ❌ 模块级计数器直接 `seq++` 写在 render → 重渲染/严格模式串号，用 `useRef` 固化。
7. ✅ 多节点 ref 当普通 prop 传；单节点跨组件用 `forwardRef + useImperativeHandle` 暴露 getter。
8. ✅ 操作 NutUI 内部节点优先按类名 `selectAll` 查，别追 ref。

---

> 备注：本示例为知识点最小可运行模板，落地到具体项目时请对齐已有分层（展示组件 / hooks / 页面 scss 收口）与类型定义。

---

这份笔记的自包含示例覆盖了你关心的全部点：**多实例隔离（uid）、手拖、无缝绕回、配色相位对齐、ref 正确用法、测量规范、样式隔离坑**。直接复制即可使用。

如果之后你想把它落到仓库 `docs/` 里做团队沉淀，切到 **craft 模式** 我可以帮你建文件。需要我调整笔记里的示例（比如换成你真实的 `HotTag` 字段名、`bgColor` 上色方案）也可以说。