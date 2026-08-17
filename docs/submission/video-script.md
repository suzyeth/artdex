# ArtDex — Demo video script ( < 3 minutes · 中英对照 )

Narration is **English** (judges). Chinese is for your own reference. Read the English
lines aloud while screen-recording. Say the Amazon service names clearly — database usage
is the judged criterion. Keep it **under 3:00** (aim for ~2:50).

**Recording setup**
- 镜头 2(蒙娜丽莎被拦):**不设**(或设错)`NEXT_PUBLIC_MOCK_LOCATION` → 传奇被定位门拦下,用你录好的蒙娜丽莎片段。
- 镜头 3 起(成功捕捉):`NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"`（MoMA），对《星空》拍照。
- 想展示丰富收藏(地图/巡展史/重逢)：DevTools → Cookies → 把 `artdex_uid` 设成 `demo-hero`，刷新。
- 捕捉流程尽量**一镜到底不剪**(证明是真的)。

---

## 1 — Hook（0:00–0:18）
**画面**：着陆页 / 图鉴网格
**VO (EN):** "You can buy a painting at auction. You can't buy the first time you stood in front of it. ArtDex is for people who love art but leave museums with nothing but a blurry photo. You don't collect the artwork, you collect the moment you were there — and every moment lives in **Amazon DynamoDB**."
**中文意思**：你能在拍卖会买下一幅画，但买不到你第一次站在它面前的那一刻。ArtDex 给那些热爱艺术、却每次离开博物馆只剩一张糊照片的人。你收集的不是画，是你"在场"的那一刻——而每一个瞬间都存在 Amazon DynamoDB 里。

## 2 — Mona Lisa：未到现场被拦（0:18–0:42）⭐
**画面**：你录的蒙娜丽莎片段 → 尝试收录 → 被拒
**VO (EN):** "Here's what makes it real. I try to seal the Mona Lisa, a legendary, from my desk — and ArtDex checks my location against the Louvre and **refuses**. I'm not within 150 metres. You can't fake being there with a screenshot. That gate runs server-side, against **DynamoDB**."
**中文意思**：让它"真"的关键在这。我在书桌前想收录蒙娜丽莎（传奇级），ArtDex 拿我的定位和卢浮宫一比，直接拒绝：我不在 150 米内。截图糊弄不了"在场"。这道门槛在服务端、对着 DynamoDB 校验。

## 3 — 到现场·拍照识别（0:42–1:05）
**画面**：设到现场 → 相机对《星空》→ 快门 → 识别动画
**VO (EN):** "On-site, GPS finds my nearest museum, and DynamoDB returns only the works on display there today — so the AI on **Amazon Bedrock** matches against a handful of candidates, not the whole history of art. That's what makes it reliable."
**中文意思**：到了现场，GPS 找到最近的博物馆，DynamoDB 只返回那里今天在展的作品；于是 Amazon Bedrock 上的 AI 只需在十来件候选里比对，而不是整部艺术史。这就是识别可靠的原因。

## 4 — 传奇庆祝·封缄·留念（1:05–1:25）
**画面**：传奇庆祝 → 长按封缄 → 拍立得显影
**VO (EN):** "The Starry Night — a legendary — and this time I'm in range. My selfie goes to **Amazon S3**; the capture, with its coordinates, is appended to my record in DynamoDB."
**中文意思**：《星空》，传奇级——这次我在范围内。自拍存进 Amazon S3；这次捕捉连同坐标，被追加进我在 DynamoDB 里的记录。

## 5 — 初遇 / 重逢（全片核心）（1:25–1:52）
**画面**：作品详情 → 初遇 + 重逢时间线
**VO (EN):** "This is the heart of it. The first time you meet a work it's a first encounter — you only get one. Come back and it's a reunion. I don't store that flag; DynamoDB derives it from the timestamps. The collection is an **append-only list of moments**, which is exactly why DynamoDB fits: serverless, pay-per-request, and the data model is the game."
**中文意思**：这是全片核心。第一次遇见是"初遇"，一生只有一次；再回来就是"重逢"。这个标记我不存，DynamoDB 从时间戳推算。整个收藏是一份只追加的"瞬间"列表——这正是为什么选 DynamoDB：serverless、按量付费，数据模型本身就是玩法。

## 6 — 作品会旅行·世界地图（1:52–2:18）
**画面**：巡展史（London→Paris→New York）→ 世界地图足迹
**VO (EN):** "And masterpieces travel. The exhibitions table is time-bounded, so a work's location is dynamic. Each piece shows its journey, and every catch pins to my world map — where the painting actually was."
**中文意思**：而且名作会旅行。exhibitions 表带时间范围，一件作品的位置是动态的。每件作品展示它的巡展轨迹，每次收录钉在世界地图上——钉在这幅画当时真正所在的地方。

## 7 — AWS 真实数据（2:18–2:42）
**画面**：AWS 控制台 → DynamoDB 表行（含 lat/lon）→ S3 对象
**VO (EN):** "And it's all live — rows in **Amazon DynamoDB** with latitude and longitude, keepsakes in **Amazon S3**."
**中文意思**：这一切都是真的——Amazon DynamoDB 里带经纬度的真实数据行，Amazon S3 里的留念照片。

## 8 — 收尾（2:42–2:55）
**画面**：logo / 网址
**VO (EN):** "A database that isn't storage — it's a record of presence. ArtDex. Built on Vercel and **Amazon DynamoDB**."
**中文意思**：一个不只是"存储"的数据库——它是一份"在场"的记录。ArtDex。基于 Vercel 和 Amazon DynamoDB 打造。

---

## Devpost 覆盖检查
- ✅ 问题：买得到画，买不到那一刻（镜头 1）
- ✅ 给谁：for people who love art but leave museums with a blurry photo（镜头 1）
- ✅ 为什么选这问题：情感主线（镜头 1、5）
- ✅ 为什么选 DynamoDB：append-only moments + serverless + 地点门槛服务端校验（镜头 2、5）
- ✅ app 真在跑：镜头 2–6 实拍

## Tips
- 全程口播 **Amazon DynamoDB / Bedrock / S3**。
- 时长压到 2:50；硬上限 3:00。
- 上传 YouTube 设 **Public**，链接贴进 Devpost。
