# ArtDex · GPS 定位选馆 + 位置留痕 — 设计稿

- **日期**: 2026-06-26
- **分支**: `feat/gps-museum-location`
- **状态**: 设计定稿,待落实施计划

---

## 1. 背景与动机

当前 capture 页用一个**只有 MoMA / V&A 两个选项的手动切换**来决定识别候选集,且默认停在 MoMA。这导致一个真实 bug:用户拍的是种子库里别的博物馆的作品(如在 Louvre 的 Mona Lisa),但切换没动,识别只在 MoMA 那 3 幅里匹配 → 返回 none 或认错 →「拍的和识别的对不上」。

经核查,识别引擎本身是准的(实测:Starry Night→starry-night、Sleeping Gypsy→sleeping-gypsy、非候选 Mona Lisa→none 均正确)。问题出在**候选集由一个易被忽略、且只有 2 个选项的手动开关决定**。

产品的真实设计本应是 **GPS → 最近博物馆 → 候选集**。相关零件已存在但**从未接入 UI**:

- `useGeolocation()`(支持 `NEXT_PUBLIC_MOCK_LOCATION` 模拟)
- `fetchNearbyMuseum(lat,lon)` → `/api/museums/nearby`(返回最近馆 + 距离)
- `collect()` API 已接受 `lat/lon`,服务端已有 150m 传奇定位门

本设计把这些接起来,并把**拍照时的真实位置(经纬度 + 解析出的博物馆)留痕到收藏**。

---

## 2. 决策记录(已拍板,含理由)

| 决策 | 选择 | 理由 |
|---|---|---|
| GPS 范围 | **全套**:自动选馆 + 存经纬度 + 真 150m 门 | 用户明确要做到"记录当时所在地理位置";最贴合真实产品 |
| 候选集来源 | **GPS 最近博物馆** | 取代易忽略的 2 按钮手动切换 |
| 记录到 moment 的博物馆 | **GPS 解析出的馆**(非作品 home 馆) | 更正确:等于"拍时画在哪"的快照(如 The Bedroom 2026 借展 MoMA,应记 MoMA) |
| 原始坐标 | **存 `lat/lon` 到 moment** | 地图可显示精确点位/距离;满足"记录地理位置" |
| 传奇定位门 | **服务端真实 150m 判定**(去掉 hardcode `onSite:true`) | 真实产品语义;桌面 demo 靠 mock 坐标兑现 |
| GPS 拿不到位置时 | **退回手动选馆**(MoMA/V&A) + 一句提示 | 用户选定;保证可用性,提示避免传奇默默失败 |
| 手选模式下的传奇 | **收集不了**(服务端 gate 拒) + 友好提示 | 无坐标无法验证现场;明确告知"需到现场"而非静默失败 |

---

## 3. 行为流程

### 3.1 进入 capture 页(GPS 模式)

1. 挂载时 `useGeolocation()` 取位置(优先 `NEXT_PUBLIC_MOCK_LOCATION`)。
2. 位置就绪 → `fetchNearbyMuseum(lat,lon)` 解析最近博物馆,设为当前 `museumId`。
3. 顶部显示侦测结果与距离:`📍 Museum of Modern Art · 30 m`(近)/ `· 4.2 km`(远)。
4. 识别候选集 = 该馆今日在展作品。用户**无需手动选**。

### 3.2 封缄收集(seal → collect)

- 把**真实 `lat/lon` + GPS 解析的 `museumId`** 传给 `/api/collect`。
- 去掉 store 里 hardcode 的 `onSite:true`,由服务端用坐标判定 150m 门。
- 服务端把 `lat/lon` 写入该 moment。

### 3.3 GPS 不可用(降级)

- `getCurrentPosition` 报错 / 拒权 → 进入**手动选馆**模式,沿用现有 MoMA/V&A 切换。
- 此模式无坐标:**非传奇**正常收集;**传奇**被服务端 gate 拒,UI 提示「未能定位,传奇需到现场收集」。

---

## 4. 架构改动

### 4.1 唯一的架构选择:抽出 `nearestMuseum()` 纯函数

最近馆循环目前**内联**在 `/api/museums/nearby/route.ts`。按本项目"纯函数域层 + 单测"约定,抽到域层 `locationGate.ts`(紧挨 `haversineMeters`)并 TDD,route 改为调用它。

> 备选:保持内联——省一处改动,但违背约定且不可单测。**采纳:抽出。**

### 4.2 文件清单

| 文件 | 改动 | 类型 |
|---|---|---|
| `src/lib/domain/locationGate.ts` | 新增 `nearestMuseum(lat, lon, museums)` 纯函数 | **TDD**(先写测试) |
| `src/app/api/museums/nearby/route.ts` | 改调用 `nearestMuseum()` | 重构 |
| `src/lib/domain/moments.ts` | `Moment` 扩展可选 `lat?`, `lon?` | 类型 |
| `src/lib/db/queries.ts` | `appendMoment` 写入 `lat/lon`;收藏读取返回 | I/O |
| `src/app/api/collect/route.ts` | 把 `b.lat/b.lon` 透传给 `appendMoment`(gate 已存在) | I/O |
| `src/lib/collection-store.tsx` | `collect()` 接收真实 `lat/lon` + GPS `museumId`;**删除 hardcode `onSite:true`**;gated 错误回传 UI | 接线 |
| `src/components/screens/capture-screen.tsx` | `useGeolocation` + `fetchNearbyMuseum`;显示侦测馆/距离;手动切换作降级;坐标透传到 seal | 接线 |

> 大部分是**接线**,不是新基础设施。

---

## 5. 数据流

```
useGeolocation (mock 优先)
  → lat/lon
    → fetchNearbyMuseum → /api/museums/nearby → nearestMuseum() [纯,单测]
      → museumId(当前馆) → /api/candidates → 识别候选集
    → seal: collect({ artworkId, museumId, lat, lon, note, selfieUrl })
      → /api/collect
        → isOnSiteRequired? → haversine(lat/lon, 馆) ≤ 150m? [纯,已存在]
        → appendMoment({ ..., museumId, lat, lon })  ← 新存 lat/lon
```

---

## 6. 边界与错误处理

- **坐标缺失**:`collect()` 不再伪造 `onSite`;无坐标时服务端对传奇返回 403,UI 友好提示;非传奇照常。
- **最近馆很远(国内真机)**:`nearestMuseum` 仍返回欧美最近的那个(功能正常),但距离大 → 传奇 gate 拒。**demo 用 mock 坐标兑现**。
- **侦测馆当日无在展作品**:候选集为空 → 识别返回 none → 进手动兜底面板(现有行为)。
- **降级一致性**:手选模式仅 MoMA/V&A 可选(种子库当日有在展作品的两馆)。

---

## 7. Demo 配方(桌面/国内真机)

设 `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"`(MoMA 坐标):

- 最近馆 = MoMA → 候选集 = MoMA 作品
- collect 携带 MoMA 坐标 → 150m 门通过 → 《星夜》(传奇)可收
- 改成 V&A 坐标 `51.4966,-0.1719` 即可演 V&A 那 5 幅

> `NEXT_PUBLIC_*` 编译期注入,改后需重启 dev。

---

## 8. 测试

### 单元(TDD,先红后绿)
- `nearestMuseum()`:最近者胜、并列取其一稳定、空列表返回 null。
- 既有 `haversineMeters` / `isWithinGate` 单测保持通过。

### 跑通验证(I/O 边界,curl + DB + 浏览器)
- 预览 capture 页(mock=MoMA):顶部显示「MoMA · ~0 m」;识别《星夜》→ 命中 → 封缄 → collect 成功。
- DynamoDB 核查:该 moment 带 `lat/lon` 且 `museumId="moma"`。
- `curl /api/museums/nearby?lat=40.7614&lon=-73.9776` → 返回 moma。
- 降级路径:模拟 GPS 失败 → 出现手动切换 → 传奇收集被拒并提示。

---

## 9. 非目标(YAGNI)

- 不做后台持续定位 / 移动轨迹。
- 不在地图上新增"我拍照的精确点位"图层(仅存数据,留待后续)。
- 不扩 capture 手动切换到全部 14 馆(仅作 GPS 失败时的兜底,维持 MoMA/V&A)。
- 不引入第三方地理编码(只用种子库已有馆坐标做最近邻)。
