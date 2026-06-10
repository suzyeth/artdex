# ArtDex TODO

> 与 `docs/superpowers/plans/2026-06-09-artdex.md` 配套的进度快照。
> 提交截止：**2026-06-29 5pm PDT** · 额度申请截止：**2026-06-26 12pm PT（先到先得）**

## ✅ 已完成

- Phase 1 脚手架 + Vitest + env 模块
- Phase 4 全部领域逻辑（rarity / locationGate / candidates / progress / recognition），30 测试
- Task 2.1 `schema.sql`（未执行，等 Aurora）
- Task 2.4 Step 1 种子数据：18 艺术家 / 44 作品 / 10 博物馆，图片 URL 全部验证 200
- 手机优先 UI 壳：底部 Tab、着陆页、图鉴页（按艺术家分组 + 进度 + 锁定态）
- Task 6.1 定位 hook（`NEXT_PUBLIC_MOCK_LOCATION` 演示开关）
- 拍照流程 mock 版：快门 → 扫描动画 → CollectSheet → 150m 传说门禁 → 庆祝动画（稀有度缩放）→ localStorage 图鉴闭环
- Code review 修复：识别解析子串碰撞、共享 Rarity 类型、种子数据勘误

## 🔴 关键路径（用户操作，今天做）

- [ ] **注册 AWS 账号** + IAM `artdex-dev` + AWS CLI（`aws sts get-caller-identity` 验证）+ $20 预算告警
- [ ] **Devpost 报名 + 填额度申请表**（$100 AWS + $30 v0，先到先得）

## 🟠 AWS 基建（Phase 0，注册后立刻做，有审批/创建等待）

- [ ] Bedrock 申请 Claude 视觉模型访问 → 记录 `BEDROCK_MODEL_ID`
- [ ] Aurora PostgreSQL Serverless v2：**min ACU 设 0**（省钱）、开 Data API、装 PostGIS → 记录 ARN
- [ ] S3 桶 + CORS → 记录 `S3_BUCKET`
- [ ] `.env.local` 填齐全部真实值

## 🟡 代码（依赖 AWS 的）

- [ ] Task 2.2 `rdsData.ts` 客户端（parseRecords 先 TDD）
- [ ] Task 2.3 `applySchema.ts` 建表 + 验证 6 张表
- [ ] Task 2.4 `seed.ts` 灌数据 + 验证 count≈44
- [ ] Phase 5：`bedrock.ts`、`queries.ts`、Zod schemas、5 个 API 路由（nearby / candidates / recognize / collect / search）
- [ ] **退役 `src/lib/mock/`**：每个 mock 函数换成注释里写的对应路由
- [ ] Phase 7：`/api/collection` + Dex 接真数据
- [ ] Phase 8：S3 presigned 上传 + CollectSheet 加自拍入口（mock 版还没有 selfie 字段）

## 🟢 代码（不依赖 AWS，随时可做）

- [ ] Phase 3 Clerk：建应用拿 key → Provider / middleware / `requireUserId()`（users upsert 半步等 Aurora）
- [ ] Phase 9 世界地图：react-leaflet + OSM，先用 mock 收藏 + seedData 坐标（注意 dynamic import 关 SSR）
- [ ] **mock 收藏升级为完整记录**：CollectSheet 的留言现在被丢弃——localStorage 存 `{artworkId, note, museumId, collectedAt}` 而不只是 id，图鉴详情和地图 popup 都要用
- [ ] **图鉴 "By Rarity" 标签页**（Task 7.1 要求的双视图，现在只有 By Artist）
- [ ] 未收集卡片 🔒 → 暗剪影（Pokémon 钩子，竞品调研结论）
- [ ] 庆祝音效：WebAudio 合成 → `public/sfx/capture-<rarity>.mp3` 真实音效
- [ ] PWA manifest + 图标（加到主屏幕更像 app）
- [ ] README 重写（现在还是 create-next-app 默认模板，评委会看仓库）

## 🔵 收尾（Phase 11）

- [ ] 推 GitHub（先确认 .env.local 不在 git 历史）→ Vercel 部署 + 全部 env → 生产 URL 全流程验证
- [ ] 架构图 PNG（Browser → Vercel → RDS Data API → Aurora+PostGIS；S3；Bedrock）
- [ ] AWS 存储证明截图（`SELECT * FROM collections` + S3 对象列表）
- [ ] <3 分钟演示视频（拍照识别 → 稀有度庆祝 → 图鉴 → 地图 → 点名 Aurora）
- [ ] 提交文字描述（写明 Aurora PostgreSQL）+ Vercel 链接 + team ID
- [ ] 加分：发 #H0Hackathon 内容

## ⚪ 可选（时间富余才做）

- [ ] Phase 10 好友 + 排行榜
- [ ] 博物馆护照副轴（"卢浮宫精选 5/10"）
- [ ] Great Wave epic→legendary 重新权衡
- [ ] `artworksForProgress` 适配器（消除 artistId/artist_id 命名边界）
