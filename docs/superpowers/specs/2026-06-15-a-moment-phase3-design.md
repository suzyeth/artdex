# ArtDex · 一刻 Phase 3 — 藏品 UI(邮戳叠) 设计稿

- **日期**: 2026-06-15
- **分支**: 待开 `feat/a-moment-stack`(从最新 master 起)
- **状态**: 设计定稿,待落实施计划
- **上游**: Phase 1(数据)+ Phase 2(拍摄仪式)已合入 master。概念见 [2026-06-15-a-moment-design.md](./2026-06-15-a-moment-design.md)

---

## 1. 目标

把作品详情页从"单条收藏"升级成"**你和这幅画的全部一刻**":一条可横滑的宝丽来胶卷,初遇烫金、重逢按时间排;点开任意一刻**重温**,看到当时的合照与留言,并且**可以随时补写/修改留言**(封缄当下不方便写,事后再补)。这是"一刻"概念的最后一层——把孤立的拍摄变成**一段会生长的关系**。

---

## 2. 决策记录(已拍板)

| 决策 | 选择 | 理由 |
|---|---|---|
| 多刻布局 | **C · 胶卷横滑** | 让宝丽来合照当主角;横滑是自然的移动手势,像翻实体照片 |
| 排序 | **初遇最左**(烫金)→ 重逢按 capturedAt 往右 | 初遇为尊、置于起点;关系沿时间向右生长 |
| 点卡片 | **全屏重温** | 点开=打开一件珍藏的仪式感;复用显影后的宝丽来静态样子 |
| 留言去向 | **重温视图显示**,并**可新增/编辑** | 解决"拍完留的言后面看不到";封缄当下不便写,事后可补 |
| 封缄时留言 | **纯可选** | 可空着,之后在重温里补 |
| 复用 | 抽 **PolaroidCard** 共用组件 | 显影 overlay(动画)与重温(静态)共用同一张卡,DRY |

---

## 3. 组件结构

| 文件 | 职责 | 动作 |
|---|---|---|
| `src/components/polaroid-card.tsx` | **纯展示**:白卡 + 照片(真实比例)+ 可选 `MomentStamp` + 题注;初遇烫金 | 新建 |
| `src/components/moment-strip.tsx` | 一幅画的**横滑胶卷**:渲染 `momentsByArtwork[artworkId]` 的 PolaroidCard 串,初遇最左,点卡 → 重温 | 新建 |
| `src/components/moment-relive.tsx` | 单刻**全屏重温**:大号静态 PolaroidCard + 馆·日期 + **留言(显示/补写/编辑)** | 新建 |
| `src/components/polaroid-develop.tsx` | 改用共用的 `PolaroidCard`(显影动画包在外层) | 改造 |
| `src/components/artwork-detail-sheet.tsx` | props 由 `entry` 改为 `artworkId`;读 `momentsByArtwork`;用 `MomentStrip` 替换原单张自拍/单条 memory/单日期块 | 改造 |
| `src/components/screens/dex-screen.tsx` | 传 `artworkId={openId}`(已有 `openId`),删除现在的 `openEntry` 派生 | 改造 |
| `src/lib/db/queries.ts` | 新增 `updateMomentNote(userId, artworkId, index, note)` | 改造 |
| `src/app/api/moment/route.ts` | PATCH:更新某一刻的 note | 新建 |
| `src/lib/collection-store.tsx` | 新增 `updateMomentNote(artworkId, index, note)`(乐观 + POST) | 改造 |

> `MomentStamp`(Phase 2)继续复用。`PolaroidCard` 抽出后,Phase 2 的 `polaroid-develop` 改成"在 PolaroidCard 外层套显影动画",避免两份卡片样式漂移。

---

## 4. 胶卷与重温(交互)

### 4.1 胶卷(`MomentStrip`)
- 横向滚动容器(`overflow-x-auto`,scroll-snap),内含一串 PolaroidCard。
- 顺序:`sortMoments(moments)` 升序 → **初遇(第 0 张)烫金 + "初遇"角标**,其余重逢朴素。
- 每张卡:合照(真实比例,小尺寸)+ 邮戳(`MomentStamp`)+ 日期。点卡 → 打开 `MomentRelive`(传该刻 + 其 index)。
- 只有 1 刻 → 胶卷就一张初遇卡。

### 4.2 重温(`MomentRelive`)
- 全屏 overlay(同 `PolaroidDevelop` 的层级/底色),展示**大号静态 PolaroidCard**(照片真实比例,初遇烫金)。
- 下方:馆 · 日期。
- **留言区**:
  - 有留言 → 显示(`font-heading` 斜体,沿用详情页 memory 样式)+ 一个"编辑"入口。
  - 无留言 → 显示"补一句话"输入框。
  - 编辑/保存 → 调 `updateMomentNote(artworkId, index, note)`;乐观更新本地,后台 PATCH。
- 点空白/关闭按钮收起。

---

## 5. 后端:编辑某一刻的留言

- **定位**:用该刻在**升序列表中的 index**。DynamoDB 里 `moments` 是按时间追加的(每次 `capturedAt = now`,恒为最新),故**存储顺序 == 升序顺序 == 客户端看到的顺序**,index 一致可靠。
- **queries**:
  ```
  updateMomentNote(userId, artworkId, index, note):
    UpdateCommand SET moments[index].note = :note   (index 校验为非负整数)
  ```
- **API** `PATCH /api/moment`:body `{ artworkId, index, note }` → 鉴权取 userId → `updateMomentNote`。校验 index 范围。
- **store** `updateMomentNote(artworkId, index, note)`:乐观改 `momentsByArtwork`,后台 `fetch('/api/moment', PATCH)`。
- 封缄时的 note 仍走 Phase 1/2 既有路径(可选);本阶段只新增"事后改某一刻"。

---

## 6. 明确不做(YAGNI)

- ❌ 删除某一刻(本阶段只增/改 note,不删 moment)
- ❌ 给单刻换照片 / 重拍
- ❌ 跨设备同步留言草稿
- ❌ 胶卷的复杂手势(只要原生 scroll-snap,不做拖拽重排)
- ❌ B 实物叠 / C 之外的布局

---

## 7. 开放 / 留待实现期

- PolaroidCard 在胶卷里的小尺寸 vs 重温里的大尺寸:同组件用 `size` 变体(`sm`/`lg`),实现期定具体数值。
- 重温留言输入的键盘/滚动行为(移动端),真机微调。
- index 定位的健壮性:若未来出现时钟回拨导致乱序,可改为按 `capturedAt` 服务端查找 index(本阶段先用 index + 升序不变式)。

---

## 8. 验收(Phase 3 完成的样子)

进入某幅已收藏作品的详情:看到一条**横滑胶卷**,初遇烫金在最左、历次重逢往右。**点任意一张** → 全屏重温那张宝丽来 + 馆·日期 + 当时留言;**没写过就补一句、写过能改**,保存后持久(刷新仍在)。只有一次到访时,胶卷就一张初遇卡。地图/图鉴等仍照常工作。
