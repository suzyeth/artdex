# AWS "data is stored" proof

Judges want evidence that real data lives in the AWS database. Two ways: **screenshots
in the AWS Console**, and/or the **CLI output** below (already captured live).

## Screenshots to grab (AWS Console, us-east-1)
1. **DynamoDB → Tables** — the 5 tables (`artdex_artworks`, `artdex_museums`, `artdex_artists`, `artdex_exhibitions`, `artdex_collections`).
2. **DynamoDB → `artdex_artworks` → Explore items** — real rows (id, title, `image_url`, rarity).
3. **DynamoDB → `artdex_collections` → Explore items** — a row whose `moments` list carries **lat/lon** (open one of the 2026-06-26/27 `starry-night` / `bedroom-arles` rows). ⭐ This is the money shot — it proves the geospatial write.
4. **S3 → `artdex-images-525033346195` → Objects** — uploaded selfie keepsakes.

## Live CLI proof — captured 2026-06-27 (us-east-1)

DynamoDB row counts:

| Table | Rows |
|---|---|
| `artdex_artists` | 26 |
| `artdex_museums` | 14 |
| `artdex_artworks` | 60 |
| `artdex_exhibitions` | 62 |
| `artdex_collections` | 91 |

Sample artwork (`artdex_artworks`):
```json
{ "id": "starry-night", "title": "The Starry Night",
  "rarity": "legendary",
  "image_url": "/artworks/van-gogh-starry-night-google-art-project.jpg" }
```

Geo-stamped moment (`artdex_collections` — proves the geospatial write):
```json
{ "artwork_id": "starry-night", "museumId": "moma",
  "lat": "40.7614", "lon": "-73.9776",
  "capturedAt": "2026-06-26T13:11:08Z" }
```

Amazon S3 keepsakes (`artdex-images-525033346195`): 11 objects, e.g.
`selfies/<user-id>/<uuid>.jpeg` (517 KB – 5 MB).

## Commands (re-run any time)
```bash
for t in artists museums artworks exhibitions collections; do
  echo "artdex_$t: $(aws dynamodb scan --table-name artdex_$t --select COUNT --region us-east-1 --query Count --output text)"
done
aws dynamodb get-item --table-name artdex_artworks --key '{"id":{"S":"starry-night"}}' --region us-east-1
aws dynamodb scan --table-name artdex_collections --filter-expression "attribute_exists(moments)" --max-items 3 --region us-east-1
aws s3 ls s3://artdex-images-525033346195/ --recursive --region us-east-1
```
