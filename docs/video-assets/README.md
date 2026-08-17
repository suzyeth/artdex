# ArtDex — 拍视频资源总表

3 分钟 Demo 视频的全部资源都在本文件夹。下表是总索引;后面是分镜计划 + 录制配置速查。

---

## 一、资源清单（list 表格）

| # | 文件 | 类型 | 用途 / 对应镜头 |
|---|---|---|---|
| 1 | `script.pdf` | 念稿 | 逐字配音稿 + 分镜（全程对照） |
| 2 | `board-logo.png` | 自制图 | **镜头 0 Hook** + **镜头 8 Close**（片头/片尾板） |
| 3 | `board-mechanic-cards.png` | 自制图 | **镜头 2 Solution**（三机制卡：GPS/稀有度/Legendary 限现场） |
| 4 | `board-architecture.png` | 自制图 | **镜头 7 Database**（Browser→Vercel→DynamoDB/Bedrock/S3） |
| 5 | `aws-1-collections-overview.png` | AWS 截图 | 镜头 7 — collections 总览（用户数据真入库） |
| 6 | `aws-2-collections-table-info.png` | AWS 截图 | 镜头 7 — 表信息（91 项 + ARN + us-east-1） |
| 7 | `aws-3-moments-timeline.png` | AWS 截图 | 镜头 7 — moment 时间线 JSON（用户多次相遇） |
| 8 | `aws-4-artworks-rarity.png` | AWS 截图 | 镜头 7 — rarity 列佐证（目录在 DynamoDB，备用） |
| 9 | `aws-5-starry-night-travel.png` | AWS 截图 | 镜头 5/7 — 星空三城巡展史（exhibitions：Tate→Orsay→MoMA） |
| 10 | `board-*.html` | 可编辑源码 | 自制图源文件（改文案/颜色后用 Chrome 无头重渲染） |

> 自制图改完重渲染命令见本文件末尾。

---

## 二、分镜计划（哪些实拍、哪些插静图）

| 镜头 | 时间 | 用什么 | 拍法 |
|---|---|---|---|
| 0 Hook | 0:00 | `board-logo.png` | 静图定格 2–3s + 旁白金句 |
| 1 Problem | 0:15 | （实拍蒙太奇） | 走马观花、拍完就忘 |
| 2 Solution | 0:36 | `board-mechanic-cards.png` | 静图停 12–15s，镜头扫过三卡 |
| 3 Capture | 0:55 | **实拍录屏** | 拍照→Bedrock 识别→Legendary 庆祝 + 防伪（见配置） |
| 4 Moment | 1:28 | **实拍**（demo-hero） | 拍立得显影 keepsake |
| 5 Reunion | 1:54 | **实拍**（demo-hero） + `aws-5` | 星空三城回忆 / 作品旅行 |
| 6 Dex+Map | 2:18 | **实拍**（demo-hero） | 图鉴 23/60 + 地图 7 城足迹 |
| 7 Database | 2:36 | 见下方 4 图连放 | 架构图 + AWS 截图 |
| 8 Close | 2:56 | `board-logo.png` | 首尾呼应金句 |

**镜头 7（数据库段 ~20s）4 图连放顺序：**
1. `board-architecture.png`（~6s）— "Next.js on Vercel, data in DynamoDB…"
2. `aws-2-collections-table-info.png`（~4s）— 念到 DynamoDB，框住 91 项 + ARN
3. `aws-1-collections-overview.png`（~5s）— "every encounter is stored"
4. `aws-5-starry-night-travel.png`（~5s）— "artworks travel — the DB tracks when & where"
   - `aws-3` / `aws-4` 备用，想多证可塞 2s

---

## 三、录制配置速查（本地 demo-hero）

本地 `npm run dev` → `localhost:3000` 直接是 demo-hero 账号（地图 7 城、图鉴 23/60、星空+卧室+纸牌玩家三城回忆）。

切换两套 `.env.local` 配置录不同镜头：

| 录什么 | `DEMO_USER_ID` | `NEXT_PUBLIC_MOCK_LOCATION` | `NEXT_PUBLIC_DEMO_ALLOW_REPRO` |
|---|---|---|---|
| **镜头 3 成功捕捉+庆祝** | 注释掉（空号） | `40.7614,-73.9776`（MoMA） | `1`（桌面翻拍要放行） |
| **镜头 3 防伪拦截** | 注释掉 | `40.7614,-73.9776` | 关闭（拍复制品→被拦） |
| **镜头 4–6 展示** | `demo-hero` | 关闭 | 关闭 |

> 改 `.env.local` 后**重启 dev** 才生效。镜头 3 的"成功捕捉"和"防伪拦截"不能同时成立，分两段录再剪。

**录制小贴士**
- 地图页首次加载慢（拉世界地理数据），先打开预热再录。
- 镜头 4 别真拍自拍（会往库里塞真人脸）——用作品图或跳过自拍步骤。
- 必念 4 个 AWS 名词：**DynamoDB / Bedrock / S3 / Vercel**（镜头 3、7）。
- 时长红线 <3:00。

---

## 四、demo 账号亮点（录的时候记得展示）

- **地图**：9 馆 / 7 城足迹（纽约·巴黎·伦敦·阿姆斯特丹·海牙·佛罗伦萨·马德里）
- **三城回忆**：星空（Tate→Orsay→MoMA）、卧室（Courtauld→Van Gogh→MoMA）、纸牌玩家（Tate→Orsay→Met）——同一张画、三座城市
- **客观巡展史**：点开作品详情，「Exhibition history」直接读数据库 exhibitions（不是用户笔记），标出当前所在地
- **拍立得邮戳**：每张 keepsake 右下角馆名+年份戳（已修对比度，深色画上也看得清）

---

## 五、改图重渲染命令

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --user-data-dir=<临时目录> --window-size=1920,1080 --force-device-scale-factor=2 \
  --virtual-time-budget=7000 --screenshot=board-logo.png \
  "file:///G:/2026claude/artdex/ArtDex/docs/video-assets/board-logo.html"
```

## 备注
- 生产站：`https://artdex-fawn.vercel.app`
- AWS 截图原图备份：`C:\Users\ASUS\Pictures\Screenshots\`
- 本文件夹未纳入 git（视频物料，与 demo 假账号一样留本地）
