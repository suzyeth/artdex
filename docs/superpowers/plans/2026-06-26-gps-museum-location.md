# GPS 定位选馆 + 位置留痕 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture 页用手机 GPS 自动选最近博物馆来驱动识别候选集,并把拍照时的真实经纬度+博物馆留痕到收藏;传奇作品由服务端真实 150m 定位门把关,GPS 失败时退回手动选馆。

**Architecture:** 复用已有但未接线的零件(`useGeolocation`、`fetchNearbyMuseum`、`/api/collect` 的 lat/lon 门)。先抽出一个纯函数 `nearestMuseum()` 并 TDD,再把它接进 `/api/museums/nearby`、capture 页、collection store、collect/collection 路由。纯逻辑走 TDD,AWS/I-O 边界走"跑通验证"(curl + DynamoDB 核查 + 浏览器)。

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · Vitest(jsdom,`@`→`src/`)· DynamoDB(`@aws-sdk/lib-dynamodb`)· 浏览器 Geolocation API。

**分支:** `feat/gps-museum-location`(已建,spec 已提交)。

**Demo 前置(每次本地验证都需要):** 在 `.env.local` 设 `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"`(MoMA),改后重启 `npm run dev`。

---

## 文件结构

| 文件 | 职责 | 改动 |
|---|---|---|
| `src/lib/domain/locationGate.ts` | 纯地理逻辑(haversine、门、最近邻) | 新增 `nearestMuseum()` |
| `test/locationGate.test.ts` | 上者单测 | 新增 `nearestMuseum` 用例 |
| `src/app/api/museums/nearby/route.ts` | GPS→最近馆 HTTP 边界 | 改用 `nearestMuseum()` |
| `src/lib/domain/moments.ts` | Moment 类型 | 加 `lat?` `lon?` |
| `src/app/api/collect/route.ts` | 收集写入边界 | moment 带 lat/lon |
| `src/app/api/collection/route.ts` | 收集读取边界 | moment 回传 lat/lon |
| `src/lib/collection-store.tsx` | 客户端收藏状态 | `collect()` 接收 lat/lon/museumId,删 `onSite:true` |
| `src/components/match-sheet.tsx` | 匹配确认弹层 | 传奇未定位时改文案+禁封缄 |
| `src/components/screens/capture-screen.tsx` | 拍照主流程 | GPS 选馆 + 显示距离 + 兜底 + 透传坐标 |

---

### Task 1: 纯函数 `nearestMuseum()`(TDD)

**Files:**
- Modify: `src/lib/domain/locationGate.ts`
- Test: `test/locationGate.test.ts`

- [ ] **Step 1: 写失败测试**

在 `test/locationGate.test.ts` 顶部 import 行追加 `nearestMuseum`:

```ts
import { haversineMeters, isWithinGate, GATE_RADIUS_M, nearestMuseum } from "@/lib/domain/locationGate";
```

在文件末尾追加:

```ts
describe("nearestMuseum", () => {
  const museums = [
    { id: "moma", lat: 40.7614, lon: -73.9776 },
    { id: "louvre", lat: 48.8606, lon: 2.3364 },
    { id: "va", lat: 51.4966, lon: -0.1719 },
  ];

  it("returns the closest museum to the given point", () => {
    const hit = nearestMuseum(40.7620, -73.9780, museums); // 紧邻 MoMA
    expect(hit?.museum.id).toBe("moma");
  });

  it("reports the distance in meters to the chosen museum", () => {
    const hit = nearestMuseum(40.7614, -73.9776, museums); // 正好在 MoMA
    expect(hit?.distanceM).toBeLessThan(1);
  });

  it("picks Louvre when the point is in Paris", () => {
    const hit = nearestMuseum(48.8600, 2.3370, museums);
    expect(hit?.museum.id).toBe("louvre");
  });

  it("returns null for an empty museum list", () => {
    expect(nearestMuseum(40.7614, -73.9776, [])).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run test/locationGate.test.ts`
Expected: FAIL —「nearestMuseum is not a function」/ 导出不存在。

- [ ] **Step 3: 实现纯函数**

在 `src/lib/domain/locationGate.ts` 末尾追加:

```ts
/**
 * Nearest museum to a point, by haversine. Generic over any object carrying
 * lat/lon, so it works on both the DynamoDB MuseumRow and the seed shape.
 * Returns the matched museum plus its distance in meters, or null for an empty list.
 */
export function nearestMuseum<M extends { lat: number; lon: number }>(
  lat: number,
  lon: number,
  museums: M[],
): { museum: M; distanceM: number } | null {
  let best: M | null = null;
  let bestD = Infinity;
  for (const m of museums) {
    const d = haversineMeters(lat, lon, m.lat, m.lon);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  return best ? { museum: best, distanceM: bestD } : null;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run test/locationGate.test.ts`
Expected: PASS(含既有 haversine/gate 用例)。

- [ ] **Step 5: 提交**

```bash
git add src/lib/domain/locationGate.ts test/locationGate.test.ts
git commit -m "feat(domain): add nearestMuseum() with tests"
```

---

### Task 2: `/api/museums/nearby` 改用 `nearestMuseum()`

**Files:**
- Modify: `src/app/api/museums/nearby/route.ts`

- [ ] **Step 1: 替换内联循环**

把整个文件替换为:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAllMuseums } from "@/lib/db/queries";
import { nearestMuseum } from "@/lib/domain/locationGate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }
  const hit = nearestMuseum(lat, lon, await getAllMuseums());
  if (!hit) return NextResponse.json({ museum: null });
  const { museum: best, distanceM } = hit;
  return NextResponse.json({
    museum: { id: best.id, name: best.name, city: best.city, lat: best.lat, lon: best.lon, distM: distanceM },
  });
}
```

- [ ] **Step 2: 类型与构建检查**

Run: `npm run build`
Expected: 构建通过,无 TS 报错。

- [ ] **Step 3: 跑通验证(对 live API,行为不变)**

Run:
```bash
curl -s "https://artdex-fawn.vercel.app/api/museums/nearby?lat=40.7614&lon=-73.9776"
```
Expected(部署后):`{"museum":{"id":"moma",...,"distM":<≈0>}}`。本地验证留到 Task 7 统一做。

- [ ] **Step 4: 提交**

```bash
git add src/app/api/museums/nearby/route.ts
git commit -m "refactor(api): nearby route uses nearestMuseum() domain fn"
```

---

### Task 3: Moment 携带 `lat/lon`(类型 + 写入 + 读取)

**Files:**
- Modify: `src/lib/domain/moments.ts:8-15`
- Modify: `src/app/api/collect/route.ts:45-52`
- Modify: `src/app/api/collection/route.ts`(moments 映射处)

- [ ] **Step 1: 扩展 Moment 类型**

`src/lib/domain/moments.ts` 中把 `Moment` 接口改为:

```ts
export interface Moment {
  capturedAt: string;        // ISO timestamp, e.g. "2026-06-15T10:30:00.000Z"
  museumId: string;          // museum the capture happened in
  exhibitionLabel?: string;  // snapshot label, e.g. "The Louvre, Paris"
  photo?: string;            // keepsake photo (the with-it / selfie shot)
  note?: string;
  stampStyle?: StampStyle;   // chosen at capture; defaults to "postmark" when absent
  lat?: number;              // capture location latitude (GPS), when available
  lon?: number;              // capture location longitude (GPS), when available
}
```

- [ ] **Step 2: collect 路由写入 lat/lon**

`src/app/api/collect/route.ts` 把 `appendMoment(...)` 调用改为:

```ts
  const { isFirst } = await appendMoment(userId, artwork.id, {
    capturedAt,
    museumId: b.museumId || "",
    exhibitionLabel: exhibitionLabel || undefined,
    photo: b.selfieUrl || b.photoUrl || undefined,
    note: b.note || undefined,
    stampStyle: normalizeStampStyle(b.stampStyle),
    lat: typeof b.lat === "number" ? b.lat : undefined,
    lon: typeof b.lon === "number" ? b.lon : undefined,
  });
```

> `appendMoment` 用 `list_append(:one)` 把整个 moment 对象入库,故新增字段自动持久化,无需改 `queries.ts`。

- [ ] **Step 3: collection 读取路由回传 lat/lon**

`src/app/api/collection/route.ts` 中 `rawMoments.map(async (mo) => ({ ... }))` 的返回对象追加两行:

```ts
      const moments = await Promise.all(
        rawMoments.map(async (mo) => ({
          capturedAt: mo.capturedAt,
          museumId: mo.museumId ?? "",
          exhibitionLabel: mo.exhibitionLabel ?? "",
          note: mo.note ?? "",
          photo: await resolvePhoto(mo.photo),
          stampStyle: normalizeStampStyle(mo.stampStyle),
          lat: mo.lat ?? null,
          lon: mo.lon ?? null,
        })),
      );
```

- [ ] **Step 4: 构建检查**

Run: `npm run build`
Expected: 通过。(纯字段透传,无新逻辑,故不加单测;跑通验证在 Task 7 做 DB 核查。)

- [ ] **Step 5: 提交**

```bash
git add src/lib/domain/moments.ts src/app/api/collect/route.ts src/app/api/collection/route.ts
git commit -m "feat(moments): persist capture lat/lon on each moment"
```

---

### Task 4: store `collect()` 透传坐标 + 删除 hardcode `onSite`

**Files:**
- Modify: `src/lib/collection-store.tsx:7-13`(CollectedEntry)
- Modify: `src/lib/collection-store.tsx:87-112`(collect callback)

- [ ] **Step 1: 扩展 CollectedEntry**

把接口改为:

```ts
export interface CollectedEntry {
  artworkId: string
  note?: string
  selfie?: string
  collectedAt: string // ISO date
  stampStyle?: StampStyle
  museumId?: string   // GPS-resolved museum the capture happened in
  lat?: number        // capture location (GPS), when available
  lon?: number
}
```

- [ ] **Step 2: 重写 collect callback**

把 `const collect = useCallback(...)` 整段替换为:

```ts
  const collect = useCallback((entry: CollectedEntry) => {
    setCollected((prev) => ({ ...prev, [entry.artworkId]: entry })) // optimistic
    // Prefer the GPS-resolved museum (where the user actually is); fall back to the
    // artwork's catalog museum only when no location was supplied.
    const museumId = entry.museumId ?? getArtwork(entry.artworkId)?.museumId ?? ""
    setMomentsByArtwork((prev) => {
      const moment: Moment = {
        capturedAt: new Date().toISOString(),
        museumId,
        photo: entry.selfie,
        note: entry.note,
        stampStyle: entry.stampStyle,
        lat: entry.lat,
        lon: entry.lon,
      }
      return { ...prev, [entry.artworkId]: sortMoments([...(prev[entry.artworkId] ?? []), moment]) }
    })
    fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artworkId: entry.artworkId,
        museumId,
        lat: entry.lat,
        lon: entry.lon,
        note: entry.note,
        selfieUrl: entry.selfie,
        stampStyle: entry.stampStyle,
      }),
    }).catch(() => {})
  }, [])
```

> 删除了 `onSite: true`。传奇作品现在由服务端按 `lat/lon` 与 150m 判定;capture 页会在客户端**预先**拦掉"未定位的传奇"(Task 5/6),所以正常流程不会打到这个 403。

- [ ] **Step 3: 构建检查**

Run: `npm run build`
Expected: 通过。

- [ ] **Step 4: 提交**

```bash
git add src/lib/collection-store.tsx
git commit -m "feat(store): thread GPS lat/lon + museum into collect, drop hardcoded onSite"
```

---

### Task 5: MatchSheet —— 传奇未定位时改文案 + 禁封缄

**Files:**
- Modify: `src/components/match-sheet.tsx`

- [ ] **Step 1: 新增 `locationVerified` prop**

在 `MatchSheet` 的 props 解构与类型里加入 `locationVerified`(放在 `photoPreview` 之后):

```ts
export function MatchSheet({
  artworkId,
  alreadyCollected,
  isReproduction,
  photoPreview,
  locationVerified,
  onClose,
  onSeal,
}: {
  artworkId: string | null;
  alreadyCollected: boolean;
  isReproduction?: boolean;
  photoPreview?: string;
  locationVerified?: boolean;
  onClose: () => void;
  onSeal: (note: string, stampStyle: StampStyle) => void;
}) {
```

- [ ] **Step 2: 计算"传奇被拦"**

在 `const isLegendary = artwork?.rarity === "legendary";` 之后加一行:

```ts
  const legendaryBlocked = isLegendary && !locationVerified;
```

- [ ] **Step 3: 传奇信息块按定位状态切换文案**

把现有 `{isLegendary && ( ... )}` 块(含「Your location has been verified.」)替换为:

```tsx
          {isLegendary && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-primary bg-primary/5 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-primary">
                <span className="font-semibold">Legendary — on-site only.</span>{" "}
                {legendaryBlocked
                  ? `未能确认你在 ${museum?.name ?? "the museum"} 现场,传奇作品需到博物馆 150 米内才能封缄。`
                  : `This work can only be sealed inside ${museum?.name ?? "the museum"}. Your location has been verified.`}
              </p>
            </div>
          )}
```

- [ ] **Step 4: 被拦时隐藏封缄按钮**

把末尾的 `<SealButton onSeal={handleSeal} />` 替换为:

```tsx
          {legendaryBlocked ? (
            <p className="mt-5 w-full select-none border border-border bg-secondary/40 py-4 text-center text-xs text-muted-foreground">
              到现场后即可封缄这枚传奇
            </p>
          ) : (
            <SealButton onSeal={handleSeal} />
          )}
```

- [ ] **Step 5: 构建检查**

Run: `npm run build`
Expected: 通过。

- [ ] **Step 6: 提交**

```bash
git add src/components/match-sheet.tsx
git commit -m "feat(match): block legendary seal until location verified"
```

---

### Task 6: capture-screen —— GPS 选馆 + 显示距离 + 兜底 + 透传坐标

**Files:**
- Modify: `src/components/screens/capture-screen.tsx`

- [ ] **Step 1: 追加 import**

把现有 import 区补上(放在已有 import 之后):

```ts
import { useEffect } from "react";
import { useGeolocation } from "@/lib/useGeolocation";
import { fetchCandidates, fetchNearbyMuseum, uploadSelfie } from "@/lib/api";
import { GATE_RADIUS_M } from "@/lib/domain/locationGate";
import type { Candidate, NearbyMuseum } from "@/lib/types";
import { MapPin } from "lucide-react";
```

> 注意:`useEffect` 合并进顶部那一行 `import { useRef, useState } from "react";` → 改成 `import { useEffect, useRef, useState } from "react";`;`fetchCandidates`/`uploadSelfie` 已在原 import 行,只是补 `fetchNearbyMuseum`;`MapPin` 加进现有 `lucide-react` import;`Candidate` 已 import,补 `NearbyMuseum`。不要重复 import。

- [ ] **Step 2: 加入 GPS 状态与解析 effect**

在 `export function CaptureScreen()` 内、`const [museumId, setMuseumId] = useState<string>("moma");` 这一行**之后**插入:

```ts
  const geo = useGeolocation();
  const [nearby, setNearby] = useState<NearbyMuseum | null>(null);
  const [geoMode, setGeoMode] = useState<"locating" | "gps" | "manual">("locating");

  // Resolve GPS -> nearest museum once a position is known. On any geo failure,
  // fall back to the manual MoMA/V&A toggle (keeps the demo usable).
  useEffect(() => {
    if (geo.status === "loading") return;
    if (geo.status === "error") {
      setGeoMode("manual");
      return;
    }
    let cancelled = false;
    fetchNearbyMuseum(geo.lat, geo.lon).then((m) => {
      if (cancelled) return;
      if (m) {
        setNearby(m);
        setMuseumId(m.id);
        setGeoMode("gps");
      } else {
        setGeoMode("manual");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [geo]);

  // Capture coordinates (null in manual fallback). Legendary seal needs us within the gate.
  const coords = geo.status === "ready" ? { lat: geo.lat, lon: geo.lon } : null;
  const locationVerified = Boolean(nearby && nearby.distM <= GATE_RADIUS_M);
```

- [ ] **Step 3: 头部按模式渲染"侦测馆/距离" or "手动切换"**

把头部那段 `<div className="mt-3 flex items-center justify-center gap-4"> ... </div>`(渲染 `CAPTURE_MUSEUMS.map(...)` 切换的整块)替换为:

```tsx
        {geoMode === "gps" && nearby ? (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-sm">
            <MapPin className="size-3.5 text-primary" />
            <span className="font-medium text-foreground">{nearby.name}</span>
            <span className="text-muted-foreground">
              · {nearby.distM < 1000 ? `${Math.round(nearby.distM)} m` : `${(nearby.distM / 1000).toFixed(1)} km`}
            </span>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="label-caps text-muted-foreground">
              {geoMode === "locating" ? "Locating…" : "Museum"}
            </span>
            {CAPTURE_MUSEUMS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMuseumId(m.id)}
                disabled={phase === "scanning"}
                className={cn(
                  "label-caps border-b-2 pb-0.5 transition-colors disabled:opacity-50",
                  museumId === m.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
```

- [ ] **Step 4: 封缄时透传 museumId + 坐标**

在 `handleSeal` 内,把 `const commit = (selfie?: string) =>` 那一句改为:

```ts
    const commit = (selfie?: string) =>
      collect({
        artworkId: id,
        note: note || undefined,
        selfie,
        collectedAt: capturedAt.slice(0, 10),
        stampStyle,
        museumId,
        lat: coords?.lat,
        lon: coords?.lon,
      });
```

同一函数内,把 develop 用的博物馆从作品 home 馆改为当前(GPS)馆,使keepsake 显示"你当时所在地":把

```ts
    const museum = art ? getMuseum(art.museumId) : undefined;
```
改为
```ts
    const museum = getMuseum(museumId) ?? (art ? getMuseum(art.museumId) : undefined);
```

- [ ] **Step 5: 给 MatchSheet 传 `locationVerified`**

把 `<MatchSheet ... />` 调用补一个 prop:

```tsx
      <MatchSheet
        artworkId={matchId}
        alreadyCollected={matchId ? isCollected(matchId) : false}
        isReproduction={isRepro}
        photoPreview={capturePreview}
        locationVerified={locationVerified}
        onClose={() => setMatchId(null)}
        onSeal={handleSeal}
      />
```

- [ ] **Step 6: 构建检查**

Run: `npm run build`
Expected: 通过,无未使用变量/类型报错。

- [ ] **Step 7: 提交**

```bash
git add src/components/screens/capture-screen.tsx
git commit -m "feat(capture): GPS picks nearest museum, shows distance, threads coords to seal"
```

---

### Task 7: 端到端跑通验证 + `.env.example` 备注

**Files:**
- Modify: `.env.example`(注释)
- 无代码逻辑改动(仅验证)

- [ ] **Step 1: 设置 mock 定位并起本地服务**

确认 `.env.local` 含 `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"`,然后:

Run: `npm run dev`
预期:`http://localhost:3000` 起来。

- [ ] **Step 2: 浏览器跑通(用 preview 工具)**

- 打开 `/`(或 capture 页),确认头部显示「📍 Museum of Modern Art · 0 m」(GPS 模式,非 MoMA/V&A 切换)。
- 在 capture 页用《星夜》图片走识别(可拖入/选取一张 Starry Night 图)→ 命中「The Starry Night」。
- 传奇信息块显示「…Your location has been verified.」(因 mock 在馆内),封缄按钮可用。
- 长按封缄 → 显影 → 收藏成功。

Expected:整条链路无报错;Network 面板 `/api/collect` 返回 200 `{collected:true,...}`。

- [ ] **Step 3: DynamoDB 核查 lat/lon 落库**

Run:
```bash
aws dynamodb scan --table-name artdex-collections --region us-east-1 \
  --filter-expression "artwork_id = :a" \
  --expression-attribute-values '{":a":{"S":"starry-night"}}' \
  --max-items 1
```
Expected:返回项里 `moments` 列表中最新一条含 `lat`≈40.7614、`lon`≈-73.9776、`museumId`/`museum_id` = `moma`。

> 表名以 `.env.local` / 既有 seed 脚本为准;若不同,用 `aws dynamodb list-tables --region us-east-1` 查实际收藏表名。

- [ ] **Step 4: 验证降级路径(手动选馆)**

临时在 `.env.local` 注释掉 `NEXT_PUBLIC_MOCK_LOCATION`,重启 `npm run dev`,在浏览器**拒绝**定位授权:
- 头部应回退为 MoMA/V&A 手动切换。
- 选 MoMA → 识别《星夜》(传奇)→ MatchSheet 显示「未能确认你在现场…」且**无封缄按钮**(改为"到现场后即可封缄")。
- 选一个**非传奇**作品(如 The Bedroom)→ 可正常封缄收集。

验证完把 `NEXT_PUBLIC_MOCK_LOCATION` 改回 MoMA。

- [ ] **Step 5: 跑全量单测 + 构建**

Run: `npm test && npm run build`
Expected:全绿;构建通过。

- [ ] **Step 6: `.env.example` 加一句说明并提交**

在 `.env.example` 的 `NEXT_PUBLIC_MOCK_LOCATION` 注释下补一行:

```
# 例:MoMA "40.7614,-73.9776" / V&A "51.4966,-0.1719"。设它即可在桌面演示
# 传奇 150m 定位门(否则真机在国内,最近馆数千公里外,传奇会被正确拦下)。
```

```bash
git add .env.example
git commit -m "docs(env): note MOCK_LOCATION coords for demoing the legendary gate"
```

---

## Self-Review 记录

- **Spec 覆盖**:§3.1 GPS 选馆→Task 6;§3.2 collect 透传坐标→Task 4;§3.3 降级+传奇提示→Task 5/6 + Task 7 Step 4;§4.1 抽 `nearestMuseum`→Task 1/2;§4.2 文件清单逐项有对应 Task;§5 数据流→Task 1/3/4/6;§7 demo 配方→Task 7;§8 测试→Task 1(单测)+Task 7(跑通)。无遗漏。
- **Placeholder**:无 TBD/TODO;每个改代码步骤均含完整代码。
- **类型一致**:`nearestMuseum` 返回 `{ museum, distanceM }` 在 Task 1 定义、Task 2 解构使用一致;`NearbyMuseum.distM`(Task 6)与 nearby 路由输出字段名一致;`CollectedEntry` 新增 `museumId/lat/lon`(Task 4)与 capture 调用(Task 6 Step 4)一致;`Moment.lat/lon`(Task 3)与 store(Task 4)、collect 路由(Task 3 Step 2)一致;`locationVerified` prop 在 Task 5 定义、Task 6 Step 5 传入一致。
```
