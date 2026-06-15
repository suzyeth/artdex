# ArtDex · 一刻 Phase 2 — 拍摄仪式 (Capture Ritual) 设计稿

- **日期**: 2026-06-15
- **分支**: 待开(建议从最新 master / 合并后的 a-moment 起 `feat/a-moment-ritual`)
- **状态**: 设计定稿,待落实施计划
- **上游**: Phase 1 数据模型已合入([PR #1](https://github.com/suzyeth/artdex/pull/1));概念见 [2026-06-15-a-moment-design.md](./2026-06-15-a-moment-design.md)

---

## 1. 目标

把现在"拍照即收藏"的 Capture 流程,升级成有体感的**拍摄仪式**:
> 站在画前拍一张你和它的合照 → 长按封缄 → 一张宝丽来从雾里慢慢显影 → 盖上出处邮戳。
这是 Phase 1 不可见地基(`moments` 数据)之上的**第一层可见体验**。

---

## 2. 决策记录(已拍板,含理由)

| 决策 | 选择 | 理由 |
|---|---|---|
| 拍几次 | **C · 一次拍摄,人站画侧** | 一张照片里画+你同框,既能识别又是真合照;最贴近真实美术馆拍法,比"两次拍"少一步 |
| 识别兜底 | 沿用**"从在展清单挑"** | 站侧角/部分遮挡导致认不出时不卡死(Phase 1 已有 `/api/recognize` + 手动兜底) |
| 封缄手势 | 识别后**长按"封缄此刻"**提交 | 调起的是系统相机,无法拦截原生快门;故把"封缄"放在拍完识别后,作为郑重的提交一拍 |
| 显影动效 | **① 雾散**(模糊+乳白 → 渐清) | 最像真宝丽来化学显影,最有"诞生而非消失"的期待感 |
| 显影时长 | **10–20s**(Phase 1 已定) | 够"等一下"的仪式,不折磨 |
| 印戳样式 | **A 邮戳 / C 票根,全局二选一** | 用户可选但不每次问;渲染时生效、风格统一,邮戳叠不混乱;B 火漆放弃(偏土、遮照片) |
| 初遇/重逢 | 初遇**烫金描边 + "初遇"字样**,重逢朴素 | 复用 Phase 1 的 `kindOf` 派生,不新增存储 |

---

## 3. 拍摄流程(C · 一次拍摄)

```
① 取景    站到画的侧边,画和你同框 → 点快门(调起系统相机)
② 识别    回到 App,对照片跑 /api/recognize(作用域=当前馆在展)
            ├─ 认出 → 锁定 artworkId,进入 ③
            └─ 认不出 → "从在展清单挑"兜底,选中后进入 ③
③ 封缄    展示识别结果(哪幅画/哪个馆)+ 你的照片 → 长按"封缄此刻"提交
④ 显影    这张照片就地变成一张雾蒙蒙的宝丽来,10–20s 内 ① 雾散显清
            (照片本地即时显影;S3 上传 + appendMoment 在后台并行)
⑤ 成型    显清后盖上印戳(全局样式)。若为该画初遇 → 烫金描边 + "初遇"
```

**与现有代码的关系**:`capture-screen.tsx` 现在已是"单张拍摄 → 识别 → MatchSheet 确认 → collect"。Phase 2 把 ③ 之后的"另外加 selfie"步骤去掉(**拍的这张就是合照**),并接上 ④⑤ 的显影 + 印戳。`collect()` → `appendMoment`(Phase 1 已就绪)负责落库,`photo` 即这张合照。

---

## 4. 组件结构(高内聚、小文件)

| 文件 | 职责 | 动作 |
|---|---|---|
| `src/components/screens/capture-screen.tsx` | 编排 ①–③:取景/识别/兜底/长按封缄 | 改造 |
| `src/components/polaroid-develop.tsx` | ④ 纯展示:接收 photo + 印戳数据,播放 ① 雾散显影(10–20s) | 新建 |
| `src/components/moment-stamp.tsx` | ⑤ 渲染印戳:邮戳 / 票根二选一 + 初遇烫金 | 新建 |
| `src/lib/stamp-preference.ts` | 全局印戳偏好(localStorage,默认 `postmark`),`useStampStyle()` | 新建 |
| `src/components/screens/profile-screen.tsx` | 加一个"印戳样式:邮戳 ⇄ 票根"开关 | 改造 |

**显影动效实现**:① 雾散 = 在 photo 上叠 `filter: blur()` + 乳白遮罩,10–20s 内动画到清晰(framer-motion 或 CSS keyframes;遵循设计系统,过渡用真实显影曲线 ease-out)。显影期间只露轮廓。

**印戳数据**:`{ museumName, city, date, kind }` —— `museumName/city` 来自 moment 的 `museumId` 查 catalog;`date` 来自 `capturedAt`;`kind` 由 `kindOf(momentsByArtwork[artworkId], thisMoment)` 派生(Phase 1 `moments.ts`)。

---

## 5. 印戳两种样式(全局偏好)

- **A · 邮戳**:圆形盖戳叠在照片角,环形馆名 + 年份 + 小图标,墨色(cobalt),轻微旋转、半透。呼应 Phase 1 的"邮戳叠"。
- **C · 票根**:照片底部一行等宽印字 `● 馆名 · 城市 — DD MON YYYY — WITNESSED`,上缘虚线齿孔。
- **初遇**:无论哪种样式,加**黄铜/烫金描边**(brass)+ 角标"初遇";**重逢**朴素。
- 切换:Profile 的开关写 `stamp-preference`(localStorage),`polaroid-develop` / `moment-stamp` 渲染时读取,作用于**所有**(过去+将来)宝丽来。

---

## 6. 在场如何被见证(沿用 Phase 1 决策)

轻验证:**必须当场实拍**(`<input capture="environment">`,不能从相册导入);身份来自识别/挑选,**不靠这张可能被你挡住的合照**。不做强 GPS 围栏 / 反作弊。

---

## 7. 明确不做(YAGNI)

- ❌ in-app `getUserMedia` 取景器(沿用系统相机调起,免 HTTPS 与额外复杂度)
- ❌ 每次封缄单独挑印戳(全局偏好即可,保持仪式快、叠面整齐)
- ❌ 视频/连拍自动取帧(方案 D,留待以后)
- ❌ 火漆封印样式 B
- ❌ 显影进度可跳过/快进(慢就是这一刻的姿态)

---

## 8. 开放 / 留待实现期

- 显影动效的精确曲线与"露轮廓"程度,实现期对着真机微调(配合 light-editorial 设计:cobalt/brass/Playfair)。
- 邮戳环形文字的 CSS/SVG 落地方式(CSS 难做圆排文字,可能用 SVG `<textPath>`)。
- 长按封缄的时长与触感反馈(~1s + haptic),实现期手感调。
- 印戳偏好是否将来同步到用户档案(Phase 2 先 localStorage,够用)。

---

## 9. 验收(Phase 2 完成的样子)

在手机上:站画侧拍一张 → 认出(或挑选)→ 长按封缄 → 看着宝丽来雾散显影 → 盖上邮戳;若是初遇则烫金。Profile 切换邮戳/票根后,已有宝丽来样式随之改变。数据仍由 Phase 1 的 `appendMoment` 落库(初遇→重逢正确)。
