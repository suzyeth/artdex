"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { museums, artworks, artists } from "@/lib/db/seedData";
import type { CollectionRecord } from "@/lib/mock/mockCollection";

interface WorldMapProps {
  records: CollectionRecord[];
}

type MuseumPins = {
  museum: (typeof museums)[number];
  items: {
    record: CollectionRecord;
    artwork: (typeof artworks)[number];
    artistName: string;
  }[];
};

function groupByMuseum(records: CollectionRecord[]): MuseumPins[] {
  const groups = new Map<string, MuseumPins>();
  for (const record of records) {
    const museum = museums.find((m) => m.id === record.museumId);
    const artwork = artworks.find((w) => w.id === record.artworkId);
    if (!museum || !artwork) continue;
    const artistName = artists.find((a) => a.id === artwork.artistId)?.name ?? "";
    const group = groups.get(museum.id) ?? { museum, items: [] };
    groups.set(museum.id, { ...group, items: [...group.items, { record, artwork, artistName }] });
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

export default function WorldMap({ records }: WorldMapProps) {
  const pins = groupByMuseum(records);

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
      {pins.map(({ museum, items }) => (
        <Marker
          key={museum.id}
          position={[museum.lat, museum.lon]}
          icon={pinIcon(items.some((i) => i.artwork.rarity === "legendary"), items.length)}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{museum.name}</p>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#71717a" }}>
                {museum.city}, {museum.country}
              </p>
              {items.map(({ record, artwork, artistName }) => (
                <div
                  key={artwork.id}
                  style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    style={{ width: 32, height: 42, objectFit: "cover", borderRadius: 4 }}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600 }}>{artwork.title}</div>
                    <div style={{ color: "#71717a" }}>
                      {artistName} · {record.collectedAt}
                    </div>
                    {record.note && (
                      <div style={{ fontStyle: "italic", color: "#52525b" }}>
                        &ldquo;{record.note}&rdquo;
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
