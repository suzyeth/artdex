# ArtDex TODO

> 与 `docs/superpowers/plans/2026-06-09-artdex.md` 配套的进度快照。
> 提交截止：**2026-06-29 5pm PDT** · 额度申请截止：**2026-06-26 12pm PT（先到先得）**
>
> ⚠️ **数据库 = DynamoDB（不是 Aurora）**。新 AWS 免费计划禁止 Aurora 用 Data API，
> 升级付费才行；为控成本改用 DynamoDB（免费套餐、serverless、零闲置成本）。
> 三个赛道指定库之一即可，DynamoDB 完全合规。地理查询不需要 PostGIS——
> 门槛用 `locationGate.ts` 的 haversine，"最近博物馆"对 10 个馆在应用层算。

## ✅ 已完成

- Phase 1 脚手架 + Vitest + env；Phase 4 全部领域逻辑（30 测试）
- 手机优先 UI：底部 Tab、着陆页、图鉴（按艺术家 + 按稀有度双视图 + 锁定剪影）、世界地图、PWA manifest
- **AWS 全部就绪**（账号 525033346195 / us-east-1 / IAM `artdex-dev` / CLI 已配）：
  - Bedrock 视觉可用，`BEDROCK_MODEL_ID=us.anthropic.claude-haiku-4-5-20251001-v1:0`（Anthropic 使用案例表单已提交生效）
  - **DynamoDB** 5 张表（PAY_PER_REQUEST）+ 真实数据 18/10/44/46（`scripts/seedDynamo.ts`）
  - **S3 桶** `artdex-images-525033346195` + CORS
  - 预算告警 $10 + $20 → suzysu418@gmail.com
- **后端全部建好并实测**：`src/lib/aws/{dynamo,bedrock,s3}.ts`、`src/lib/db/queries.ts`、cookie 匿名 `auth.ts`
  - 6 路由：nearby / candidates（巡展生效）/ recognize（**《星空》《蒙娜丽莎》准确识别，错馆返回 null**）/ collect（**定位门槛实测：远 403 近成功**）/ collection / search / upload-url
- **退役 `src/lib/mock/`**：capture / dex / map 全接真 API（`src/lib/api.ts` + `types.ts`），tsc 干净
- **Phase 8 自拍合照**：S3 presigned PUT/GET 完整往返实测（图入桶、key 入库、地图 popup 显示自拍）

## ✅ 打磨已完成（2026-06-12 晚）

- **防伪检测**：识别 prompt 同时判 live/repro（白嫖同一次 Bedrock 调用）——实测平面图判 repro ✅；
  传说级 + repro → 拦截（demo 逃生口 `NEXT_PUBLIC_DEMO_ALLOW_REPRO=1`），低稀有度 → 琥珀色警告但可收
- 客户端压图（≤1024px JPEG 再上传）、catalog 60s 内存缓存、收集震动反馈（按稀有度）
- **图鉴详情弹层**：点已收集卡片 → 大图 + 自拍合照 + 笔记 + 「何时何地收集」
- **Premium mock 页**（/premium，B2C 变现展示 + 博物馆 B 端合作 blurb），Dex 头部 ✦ 入口

## 🟡 剩余（不阻塞，按优先级）

- [x] 文档对齐：spec / 计划 / 上层 CLAUDE.md 的 Aurora→DynamoDB + Clerk→cookie 已在勘误横幅注明
- [x] README 重写：DynamoDB 栈、真实 AWS 状态、拍立得 moment 特性、准确 catalog 数（55/22/13/57）
- [x] 庆祝音效：换成预渲染钟琴音色 WAV（`scripts/genSfx.ts` → `public/sfx/collect-<rarity>.wav`），合成器作降级
- [ ] **Phase 3 Clerk（可选）**：现用 cookie 匿名 id，每浏览器独立收藏，demo 够用；要"加好友/跨设备"才需要

## 🔵 收尾（Phase 11 提交）

- [ ] 推 GitHub（确认 `.env.local` 不在历史）→ Vercel 部署 + 环境变量
      （`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `BEDROCK_MODEL_ID` / `S3_BUCKET`）→ 生产 URL 全流程验证
- [ ] 架构图 PNG（Browser → Vercel → DynamoDB；S3；Bedrock）
- [ ] AWS 存储证明截图（DynamoDB 表数据 + S3 对象列表）
- [ ] <3 分钟演示视频（拍照识别 → 稀有度庆祝 → 图鉴 → 地图 → **点名 Amazon DynamoDB + Bedrock**）
- [ ] 提交文字描述（写明 **DynamoDB**）+ Vercel 链接 + team ID
- [ ] 加分：发 #H0Hackathon 内容

## ⚪ 可选（时间富余才做）

- [ ] Phase 10 好友 + 排行榜（DynamoDB 里在应用层聚合）
- [ ] 博物馆护照副轴（"卢浮宫精选 5/10"）
- [ ] 图鉴详情页展示自拍合照 + 参观笔记
