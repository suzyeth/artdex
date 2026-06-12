"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CollectionItem } from "@/lib/types";

interface WorldMapProps {
  items: CollectionItem[];
}

type MuseumPins = {
  museumId: string;
  museumName: string;
  city: string;
  lat: number;
  lon: number;
  items: CollectionItem[];
};

function groupByMuseum(items: CollectionItem[]): MuseumPins[] {
  const groups = new Map<string, MuseumPins>();
  for (const it of items) {
    if (!it.museumId || it.lat === null || it.lon === null) continue;
    const group =
      groups.get(it.museumId) ??
      { museumId: it.museumId, museumName: it.museumName, city: it.city, lat: it.lat, lon: it.lon, items: [] };
    group.items.push(it);
    groups.set(it.museumId, group);
  }
  return [...groups.values()];
}

// DOM-string icon instead of Leaflet's default image markers — avoids the
// well-known bundler asset-path problem and lets rarity drive the color.
function pinIcon(hasLegendary: boolean, count: number) {
  const bg = hasLegendary ? "#f59e0b" : "#3f3f46";
  const ring = hasLegendary ? "#fde68a" : "#71717a";
  return divIcon({
    className: "",
    html: `<div style="background:${bg};border:2px solid ${ring};color:#fff;width:28px;height:28px;border-radius:9999px 9999px 9999px 2px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.5)"><span style="transform:rotate(45deg);font-size:11px;font-weight:700">${count}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [6, 26],
    popupAnchor: [8, -24],
  });
}

export default function WorldMap({ items }: WorldMapProps) {
  const pins = groupByMuseum(items);

  return (
    <MapContainer
      center={[35, 0]}
      zoom={2}
      minZoom={2}
      className="h-full w-full"
      style={{ background: "#18181b" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {pins.map((pin) => (
        <Marker
          key={pin.museumId}
          position={[pin.lat, pin.lon]}
          icon={pinIcon(pin.items.some((i) => i.rarity === "legendary"), pin.items.length)}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{pin.museumName}</p>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#71717a" }}>{pin.city}</p>
              {pin.items.map((it) => (
                <div
                  key={it.artworkId}
                  style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    style={{ width: 32, height: 42, objectFit: "cover", borderRadius: 4 }}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div style={{ color: "#71717a" }}>
                      {it.artistName} · {it.collectedAt.slice(0, 10)}
                    </div>
                    {it.note && (
                      <div style={{ fontStyle: "italic", color: "#52525b" }}>
                        &ldquo;{it.note}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
