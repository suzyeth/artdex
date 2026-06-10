import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ArtDex",
    short_name: "ArtDex",
    description:
      "Pokémon GO for the world's masterpieces — photograph real artworks at museums and collect them.",
    start_url: "/dex",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
