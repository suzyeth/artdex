# ArtDex — 全流程视频脚本（含现有视频）

整合"已录素材 + 待补录"的最终剪辑脚本。旁白英文(对评委),中文供理解。
目标时长 < 3:00(压到 ~2:55)。

> 🟢 现有·复用 = 你已录视频里有，直接剪入　🔴 需录 = 要拍/重拍　★ = 核心

---

## 📌 提交硬性要求（务必满足）

1. **视频上传 YouTube，设为 Public（公开），不是 Unlisted。** （清单原文 "set to public"）
2. **视频必须讲清这 4 点**（已分配到镜头，旁白务必念到）：
   - **① 解决什么问题** → 镜头 1：博物馆走马观花、拍完就忘，留不住自己见过的艺术。
   - **② 给谁** → 镜头 1：热爱艺术、却每次离开博物馆只剩一张糊照片的人。
   - **③ 为什么选这个问题** → 镜头 1：你买得到画，但买不到第一次站在它面前的那一刻——这才是值得留住的。
   - **④ 为什么选 DynamoDB** → 镜头 5：收藏天然是"只追加的瞬间列表"，serverless、按量付费、初遇/重逢从时间戳推算——数据模型本身就是玩法。
3. 全程口播 **Amazon DynamoDB / Bedrock / S3**；总时长 ≤ 3:00。

---

## 1 — Hook（0:00–0:18）🔴 需录
**画面**：着陆页 / 图鉴网格
**VO (EN):** "You can buy a painting at auction. You can't buy the first time you stood in front of it. ArtDex is for people who love art but leave museums with nothing but a blurry photo. You don't collect the artwork, you collect the moment you were there — and every moment lives in **Amazon DynamoDB**."
**中文**：你能在拍卖会买下一幅画，但买不到第一次面对它的那一刻。ArtDex 给那些热爱艺术、却离开博物馆只剩一张糊照片的人。你收集的是"在场"的那一刻——每个瞬间都存在 Amazon DynamoDB 里。

## 2 — 蒙娜丽莎·桌面拍 → 双重拦截（0:18–0:44）🔴 需重录 ★
**画面**：对着蒙娜丽莎**印刷品/屏幕**从桌面拍 → 弹层同时出现两条提示：**"Legendary — on-site only"** + **"Looks like a reproduction"**
**VO (EN):** "Watch. I photograph a print of the Mona Lisa from my desk, and ArtDex refuses on two counts: I'm not within 150 m of the Louvre, and it can tell this is a print, not the original canvas. You can't fake being there — and that check runs server-side, against **DynamoDB**."
**中文**：我对着蒙娜丽莎印刷品从桌面拍，ArtDex 两道都拦：不在卢浮宫 150 米内，而且认出这是印刷品、不是真迹。"在场"伪造不了——这道校验在服务端、对着 DynamoDB 跑。

## 3 — 到现场·拍照识别（0:44–1:05）🔴 需录
**画面**：设到现场 → 相机对《星空》→ 快门 → 识别动画
**VO (EN):** "On-site, GPS finds my nearest museum, and DynamoDB returns only the works on display there today — so the AI on **Amazon Bedrock** matches against a handful of candidates, not the whole history of art. That's what makes it reliable."
**中文**：到了现场，GPS 找最近的馆，DynamoDB 只返回那里今天在展的作品；于是 Amazon Bedrock 的 AI 只在十来件候选里比对，而非整部艺术史。这就是识别可靠的原因。

## 4 — 传奇庆祝·封缄·留念（1:05–1:25）🔴 需录
**画面**：传奇庆祝 → 长按封缄 → 拍立得显影
**VO (EN):** "The Starry Night — a legendary — and this time I'm in range. My selfie goes to **Amazon S3**; the capture, with its coordinates, is appended to my record in DynamoDB."
**中文**：《星空》，传奇级——这次在范围内。自拍进 Amazon S3；捕捉连同坐标追加进我在 DynamoDB 的记录。

## 5 — 初遇 / 重逢（全片核心）（1:25–1:52）🔴 需录 ★
**画面**：作品详情 → 巡展史 + 初遇/重逢时间线（用 demo-hero）
**VO (EN):** "This is the heart of it. The first time you meet a work it's a first encounter — you only get one. Come back and it's a reunion. I don't store that flag; DynamoDB derives it from the timestamps. The collection is an **append-only list of moments**, which is exactly why DynamoDB fits: serverless, pay-per-request, and the data model is the game."
**中文**：全片核心。第一次遇见是"初遇"，一生一次；再回来是"重逢"。这个标记我不存，DynamoDB 从时间戳推算。收藏是只追加的"瞬间"列表——这正是为什么选 DynamoDB：serverless、按量付费，数据模型本身就是玩法。

## 6 — 作品会旅行·世界地图（1:52–2:18）🔴 需录
**画面**：巡展史（London→Paris→New York）→ 世界地图足迹（demo-hero）
**VO (EN):** "And masterpieces travel. The exhibitions table is time-bounded, so a work's location is dynamic. Each piece shows its journey, and every catch pins to my world map — where the painting actually was."
**中文**：名作会旅行。exhibitions 表带时间范围，作品位置是动态的。每件展示巡展轨迹，每次收录钉在世界地图上——钉在画当时真正所在的地方。

## 7 — AWS 真实数据（2:18–2:42）🟢 现有·复用
**画面**：AWS 控制台 → DynamoDB 表行（含 lat/lon）→ S3 对象　【用你已录视频里这段；最好补一帧能看到 lat/lon】
**VO (EN):** "And it's all live — rows in **Amazon DynamoDB** with latitude and longitude, keepsakes in **Amazon S3**."
**中文**：这一切都是真的——Amazon DynamoDB 里带经纬度的真实数据行，Amazon S3 里的留念照片。

## 8 — 收尾（2:42–2:55）🟢 板·复用（用新版 board-logo.png）
**画面**：logo / 网址
**VO (EN):** "A database that isn't storage — it's a record of presence. ArtDex. Built on Vercel and **Amazon DynamoDB**."
**中文**：一个不只是"存储"的数据库——它是一份"在场"的记录。ArtDex。基于 Vercel 和 Amazon DynamoDB 打造。

---

## 现有视频如何利用
- 🟢 镜头 7（AWS 控制台）：直接剪入。
- 🟢 镜头 8（logo）：用**更新后**的 `board-logo.png`（旧视频那句已换掉）。
- ⚠️ 现有的 机制卡板 / 架构板×2 / 向日葵段：偏"幻灯片"，建议**不进最终版**（架构板最多在镜头 7 留一块），把时间留给 6 段实拍。
- ❌ 必删：现有视频结尾 **45 秒黑屏**。

## 录制配置（每改 .env.local 后重启 dev）
| 录哪段 | DEMO_USER_ID | MOCK_LOCATION | DEMO_ALLOW_REPRO |
|---|---|---|---|
| 镜头 2 蒙娜丽莎双拦 | demo-hero 或空 | "40.7614,-73.9776"(MoMA,你不在卢浮宫) | 1（翻拍提示已开） |
| 镜头 3–4 星空成功+庆祝 | **注释掉**（空号→首次→庆祝） | "40.7614,-73.9776" | 1 |
| 镜头 5–6 重逢/地图 | demo-hero | 关掉无所谓 | — |

## Devpost 覆盖
✓ 问题(镜1) ✓ 给谁(镜1) ✓ 为什么(镜1/5) ✓ 为什么选 DynamoDB(镜2/5) ✓ 反作弊:定位门槛 + 翻拍检测(镜2) ✓ app 真在跑(镜2–6)

## Tips
口播 Amazon DynamoDB / Bedrock / S3；时长 ≤3:00；上传 YouTube 设 **Public**。
