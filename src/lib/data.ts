export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface Museum {
  id: string
  name: string
  city: string
  country: string
  // Percentage coordinates on the world map (0-100)
  x: number
  y: number
}

export interface Artwork {
  id: string
  title: string
  artist: string
  artistId: string
  year: string
  rarity: Rarity
  image: string
  museumId: string
  medium: string
  blurb: string
}

export interface Artist {
  id: string
  name: string
  nationality: string
}

export const MUSEUMS: Record<string, Museum> = {
  moma: { id: "moma", name: "MoMA", city: "New York", country: "USA", x: 27, y: 38 },
  louvre: { id: "louvre", name: "The Louvre", city: "Paris", country: "France", x: 49, y: 33 },
  rijks: { id: "rijks", name: "Rijksmuseum", city: "Amsterdam", country: "Netherlands", x: 50, y: 31 },
  metro: {
    id: "metro",
    name: "Tokyo Nat'l Museum",
    city: "Tokyo",
    country: "Japan",
    x: 84,
    y: 41,
  },
  mauritshuis: {
    id: "mauritshuis",
    name: "Mauritshuis",
    city: "The Hague",
    country: "Netherlands",
    x: 49.5,
    y: 31,
  },
  orangerie: { id: "orangerie", name: "Musée de l'Orangerie", city: "Paris", country: "France", x: 48.5, y: 33.5 },
}

export const ARTISTS: Artist[] = [
  { id: "van-gogh", name: "Vincent van Gogh", nationality: "Dutch" },
  { id: "da-vinci", name: "Leonardo da Vinci", nationality: "Italian" },
  { id: "rembrandt", name: "Rembrandt van Rijn", nationality: "Dutch" },
  { id: "hokusai", name: "Katsushika Hokusai", nationality: "Japanese" },
  { id: "vermeer", name: "Johannes Vermeer", nationality: "Dutch" },
  { id: "monet", name: "Claude Monet", nationality: "French" },
]

export const ARTWORKS: Artwork[] = [
  {
    id: "starry-night",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    artistId: "van-gogh",
    year: "1889",
    rarity: "legendary",
    image: "/art/starry-night.png",
    museumId: "moma",
    medium: "Oil on canvas",
    blurb:
      "Painted from the window of his asylum room at Saint-Rémy, van Gogh's swirling night sky is one of the most recognized works in Western art.",
  },
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    artistId: "da-vinci",
    year: "1503",
    rarity: "legendary",
    image: "/art/mona-lisa.png",
    museumId: "louvre",
    medium: "Oil on poplar panel",
    blurb:
      "The most famous portrait in the world, celebrated for the subject's enigmatic smile and da Vinci's masterful sfumato.",
  },
  {
    id: "night-watch",
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    artistId: "rembrandt",
    year: "1642",
    rarity: "legendary",
    image: "/art/night-watch.png",
    museumId: "rijks",
    medium: "Oil on canvas",
    blurb:
      "Rembrandt's colossal militia portrait broke convention with its dramatic motion and theatrical use of light and shadow.",
  },
  {
    id: "great-wave",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "1831",
    rarity: "epic",
    image: "/art/great-wave.png",
    museumId: "metro",
    medium: "Woodblock print",
    blurb:
      "Hokusai's towering wave with Mount Fuji beyond is the most iconic image in Japanese art and a global emblem of ukiyo-e.",
  },
  {
    id: "pearl-earring",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    artistId: "vermeer",
    year: "1665",
    rarity: "epic",
    image: "/art/pearl-earring.png",
    museumId: "mauritshuis",
    medium: "Oil on canvas",
    blurb:
      "Often called the 'Mona Lisa of the North,' Vermeer's tronie captures a fleeting glance with luminous, mysterious intimacy.",
  },
  {
    id: "sunflowers",
    title: "Sunflowers",
    artist: "Vincent van Gogh",
    artistId: "van-gogh",
    year: "1888",
    rarity: "epic",
    image: "/art/sunflowers.png",
    museumId: "louvre",
    medium: "Oil on canvas",
    blurb:
      "Painted to decorate his Arles studio for Gauguin's arrival, van Gogh's sunflowers radiate warmth in layered yellows.",
  },
  {
    id: "water-lilies",
    title: "Water Lilies",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1906",
    rarity: "rare",
    image: "/art/water-lilies.png",
    museumId: "orangerie",
    medium: "Oil on canvas",
    blurb:
      "Part of Monet's lifelong series of his Giverny pond, this work dissolves form into shimmering reflections of sky and water.",
  },
]

export const RARITY_META: Record<
  Rarity,
  { label: string; order: number }
> = {
  common: { label: "Common", order: 0 },
  rare: { label: "Rare", order: 1 },
  epic: { label: "Epic", order: 2 },
  legendary: { label: "Legendary", order: 3 },
}

export function getArtwork(id: string): Artwork | undefined {
  return ARTWORKS.find((a) => a.id === id)
}

export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS[id]
}
