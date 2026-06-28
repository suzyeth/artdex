// Seed catalog for ArtDex. Image URLs use Wikimedia Commons Special:FilePath
// (stable filename-based redirects) with ?width=1000 so the app never downloads
// the enormous Google Art Project originals.

import type { Rarity } from "../domain/rarity";
import { imageSlug } from "./imageSlug";

// Artwork images are self-hosted under public/artworks/ (Wikimedia Commons, the
// original host, is blocked in mainland China). The filename argument is kept as the
// stable key — scripts/downloadArtworkImages.ts fetches each into <slug>.jpg.
const img = (filename: string) => `/artworks/${imageSlug(filename)}.jpg`;

export const artists = [
  { id: "vangogh", name: "Vincent van Gogh", era: "1853–1890", movement: "Post-Impressionism" },
  { id: "davinci", name: "Leonardo da Vinci", era: "1452–1519", movement: "High Renaissance" },
  { id: "monet", name: "Claude Monet", era: "1840–1926", movement: "Impressionism" },
  { id: "vermeer", name: "Johannes Vermeer", era: "1632–1675", movement: "Dutch Golden Age" },
  { id: "rembrandt", name: "Rembrandt van Rijn", era: "1606–1669", movement: "Dutch Golden Age" },
  { id: "hokusai", name: "Katsushika Hokusai", era: "1760–1849", movement: "Ukiyo-e" },
  { id: "botticelli", name: "Sandro Botticelli", era: "1445–1510", movement: "Early Renaissance" },
  { id: "degas", name: "Edgar Degas", era: "1834–1917", movement: "Impressionism" },
  { id: "renoir", name: "Pierre-Auguste Renoir", era: "1841–1919", movement: "Impressionism" },
  { id: "cezanne", name: "Paul Cézanne", era: "1839–1906", movement: "Post-Impressionism" },
  { id: "caravaggio", name: "Caravaggio", era: "1571–1610", movement: "Baroque" },
  { id: "velazquez", name: "Diego Velázquez", era: "1599–1660", movement: "Spanish Golden Age" },
  { id: "goya", name: "Francisco de Goya", era: "1746–1828", movement: "Romanticism" },
  { id: "turner", name: "J. M. W. Turner", era: "1775–1851", movement: "Romanticism" },
  { id: "manet", name: "Édouard Manet", era: "1832–1883", movement: "Realism / Impressionism" },
  { id: "rousseau", name: "Henri Rousseau", era: "1844–1910", movement: "Naïve art" },
  { id: "delacroix", name: "Eugène Delacroix", era: "1798–1863", movement: "Romanticism" },
  { id: "gericault", name: "Théodore Géricault", era: "1791–1824", movement: "Romanticism" },
  { id: "vaneyck", name: "Jan van Eyck", era: "c.1390–1441", movement: "Early Netherlandish" },
  { id: "holbein", name: "Hans Holbein the Younger", era: "1497–1543", movement: "Northern Renaissance" },
  { id: "constable", name: "John Constable", era: "1776–1837", movement: "Romanticism" },
  { id: "millais", name: "John Everett Millais", era: "1829–1896", movement: "Pre-Raphaelite" },
  { id: "canova", name: "Antonio Canova", era: "1757–1822", movement: "Neoclassicism" },
  { id: "raphael", name: "Raphael", era: "1483–1520", movement: "High Renaissance" },
  { id: "morris", name: "William Morris", era: "1834–1896", movement: "Arts and Crafts" },
  { id: "mysore", name: "Unknown (Mysore)", era: "18th c.", movement: "Mysore court workshop" },
];

export const museums = [
  { id: "moma", name: "Museum of Modern Art", city: "New York", country: "USA", lon: -73.9776, lat: 40.7614 },
  { id: "met", name: "The Metropolitan Museum of Art", city: "New York", country: "USA", lon: -73.9632, lat: 40.7794 },
  { id: "louvre", name: "Louvre", city: "Paris", country: "France", lon: 2.3364, lat: 48.8606 },
  { id: "orsay", name: "Musée d'Orsay", city: "Paris", country: "France", lon: 2.3266, lat: 48.86 },
  { id: "nationalgallery", name: "The National Gallery", city: "London", country: "UK", lon: -0.1283, lat: 51.5089 },
  { id: "rijksmuseum", name: "Rijksmuseum", city: "Amsterdam", country: "Netherlands", lon: 4.8852, lat: 52.36 },
  { id: "vangoghmuseum", name: "Van Gogh Museum", city: "Amsterdam", country: "Netherlands", lon: 4.881, lat: 52.3584 },
  { id: "mauritshuis", name: "Mauritshuis", city: "The Hague", country: "Netherlands", lon: 4.3144, lat: 52.0805 },
  { id: "uffizi", name: "Uffizi Gallery", city: "Florence", country: "Italy", lon: 11.2553, lat: 43.7678 },
  { id: "prado", name: "Museo del Prado", city: "Madrid", country: "Spain", lon: -3.6921, lat: 40.4138 },
  { id: "courtauld", name: "The Courtauld Gallery", city: "London", country: "UK", lon: -0.117, lat: 51.5115 },
  { id: "tate-britain", name: "Tate Britain", city: "London", country: "UK", lon: -0.1276, lat: 51.4911 },
  { id: "scottish-national", name: "Scottish National Gallery", city: "Edinburgh", country: "UK", lon: -3.1956, lat: 55.9509 },
  { id: "va", name: "Victoria and Albert Museum", city: "London", country: "UK", lon: -0.1719, lat: 51.4966 },
];

export const artworks: {
  id: string; artistId: string; title: string; year: string;
  rarity: Rarity; isSignature: boolean; imageUrl: string;
}[] = [
  // --- Van Gogh ---
  { id: "starry-night", artistId: "vangogh", title: "The Starry Night", year: "1889",
    rarity: "legendary", isSignature: true, imageUrl: img("Van Gogh - Starry Night - Google Art Project.jpg") },
  { id: "sunflowers", artistId: "vangogh", title: "Sunflowers", year: "1888",
    rarity: "epic", isSignature: true, imageUrl: img("Vincent Willem van Gogh 127.jpg") },
  { id: "bedroom-arles", artistId: "vangogh", title: "The Bedroom", year: "1888",
    rarity: "epic", isSignature: true, imageUrl: img("Vincent van Gogh - De slaapkamer - Google Art Project.jpg") },
  { id: "almond-blossom", artistId: "vangogh", title: "Almond Blossom", year: "1890",
    rarity: "rare", isSignature: false, imageUrl: img("Vincent van Gogh - Almond blossom - Google Art Project.jpg") },
  { id: "wheatfield-crows", artistId: "vangogh", title: "Wheatfield with Crows", year: "1890",
    rarity: "rare", isSignature: false, imageUrl: img("Vincent van Gogh - Wheatfield with crows - Google Art Project.jpg") },
  { id: "potato-eaters", artistId: "vangogh", title: "The Potato Eaters", year: "1885",
    rarity: "common", isSignature: false, imageUrl: img("Vincent van Gogh - The potato eaters - Google Art Project.jpg") },
  { id: "starry-night-rhone", artistId: "vangogh", title: "Starry Night Over the Rhône", year: "1888",
    rarity: "epic", isSignature: false, imageUrl: img("Starry Night Over the Rhone.jpg") },
  { id: "irises", artistId: "vangogh", title: "Irises", year: "1889",
    rarity: "rare", isSignature: false, imageUrl: img("Irises-Vincent van Gogh.jpg") },
  { id: "wheat-field-cypresses", artistId: "vangogh", title: "Wheat Field with Cypresses", year: "1889",
    rarity: "rare", isSignature: false, imageUrl: img("Vincent van Gogh - Wheat Field with Cypresses - Google Art Project.jpg") },

  // --- Leonardo da Vinci ---
  { id: "mona-lisa", artistId: "davinci", title: "Mona Lisa", year: "1503",
    rarity: "legendary", isSignature: true, imageUrl: img("Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg") },
  { id: "virgin-of-the-rocks", artistId: "davinci", title: "The Virgin of the Rocks", year: "1486",
    rarity: "epic", isSignature: true, imageUrl: img("Leonardo Da Vinci - Vergine delle Rocce (Louvre).jpg") },
  { id: "annunciation", artistId: "davinci", title: "Annunciation", year: "1472",
    rarity: "rare", isSignature: false, imageUrl: img("Leonardo da Vinci - Annunciazione - Google Art Project.jpg") },

  // --- Monet ---
  { id: "blue-water-lilies", artistId: "monet", title: "Blue Water Lilies", year: "1916",
    rarity: "rare", isSignature: true, imageUrl: img("Claude Monet - Blue Water Lilies - Google Art Project.jpg") },
  { id: "poppies", artistId: "monet", title: "Poppies", year: "1873",
    rarity: "common", isSignature: false, imageUrl: img("Claude Monet 037.jpg") },
  { id: "the-magpie", artistId: "monet", title: "The Magpie", year: "1869",
    rarity: "common", isSignature: false, imageUrl: img("Claude Monet - The Magpie - Google Art Project.jpg") },
  { id: "gare-saint-lazare", artistId: "monet", title: "The Gare Saint-Lazare", year: "1877",
    rarity: "common", isSignature: false, imageUrl: img("Claude Monet - The Saint-Lazare Station - Google Art Project.jpg") },

  // --- Vermeer ---
  { id: "girl-pearl-earring", artistId: "vermeer", title: "Girl with a Pearl Earring", year: "1665",
    rarity: "legendary", isSignature: true, imageUrl: img("1665 Girl with a Pearl Earring.jpg") },
  { id: "milkmaid", artistId: "vermeer", title: "The Milkmaid", year: "1658",
    rarity: "epic", isSignature: true, imageUrl: img("Johannes Vermeer - Het melkmeisje - Google Art Project.jpg") },
  { id: "view-of-delft", artistId: "vermeer", title: "View of Delft", year: "1661",
    rarity: "rare", isSignature: false, imageUrl: img("Vermeer-view-of-delft.jpg") },
  { id: "young-woman-water-pitcher", artistId: "vermeer", title: "Young Woman with a Water Pitcher", year: "1662",
    rarity: "common", isSignature: false, imageUrl: img("Young Woman with a Water Pitcher MET DP353257.jpg") },

  // --- Rembrandt ---
  { id: "night-watch", artistId: "rembrandt", title: "The Night Watch", year: "1642",
    rarity: "legendary", isSignature: true, imageUrl: img("The Night Watch - HD.jpg") },
  { id: "anatomy-lesson", artistId: "rembrandt", title: "The Anatomy Lesson of Dr Nicolaes Tulp", year: "1632",
    rarity: "rare", isSignature: false, imageUrl: img("Rembrandt - The Anatomy Lesson of Dr Nicolaes Tulp.jpg") },
  { id: "jewish-bride", artistId: "rembrandt", title: "The Jewish Bride", year: "1665",
    rarity: "rare", isSignature: false, imageUrl: img("Rembrandt Harmensz. van Rijn - Portret van een paar als oudtestamentische figuren, genaamd 'Het Joodse bruidje' - Google Art Project.jpg") },

  // --- Hokusai ---
  { id: "great-wave", artistId: "hokusai", title: "The Great Wave off Kanagawa", year: "1831",
    rarity: "epic", isSignature: true, imageUrl: img("Tsunami by hokusai 19th century.jpg") },

  // --- Botticelli ---
  { id: "birth-of-venus", artistId: "botticelli", title: "The Birth of Venus", year: "1485",
    rarity: "legendary", isSignature: true, imageUrl: img("Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg") },
  { id: "primavera", artistId: "botticelli", title: "Primavera", year: "1482",
    rarity: "epic", isSignature: true, imageUrl: img("Botticelli-primavera.jpg") },

  // --- Degas ---
  { id: "ballet-class", artistId: "degas", title: "The Ballet Class", year: "1874",
    rarity: "rare", isSignature: true, imageUrl: img("Edgar Degas - The Ballet Class - Google Art Project.jpg") },
  { id: "absinthe", artistId: "degas", title: "In a Café (L'Absinthe)", year: "1876",
    rarity: "common", isSignature: false, imageUrl: img("Edgar Degas - In a Café - Google Art Project 2.jpg") },

  // --- Renoir ---
  { id: "moulin-galette", artistId: "renoir", title: "Bal du moulin de la Galette", year: "1876",
    rarity: "epic", isSignature: true, imageUrl: img("Pierre-Auguste Renoir, Le Moulin de la Galette.jpg") },
  { id: "girls-at-piano", artistId: "renoir", title: "Young Girls at the Piano", year: "1892",
    rarity: "common", isSignature: false, imageUrl: img("Auguste Renoir - Young Girls at the Piano - Google Art Project.jpg") },

  // --- Cézanne ---
  { id: "card-players", artistId: "cezanne", title: "The Card Players", year: "1895",
    rarity: "rare", isSignature: true, imageUrl: img("Les Joueurs de cartes, par Paul Cézanne.jpg") },
  { id: "apples-oranges", artistId: "cezanne", title: "Apples and Oranges", year: "1899",
    rarity: "common", isSignature: false, imageUrl: img("Paul Cézanne 179.jpg") },

  // --- Caravaggio ---
  { id: "medusa", artistId: "caravaggio", title: "Medusa", year: "1597",
    rarity: "rare", isSignature: true, imageUrl: img("Caravaggio - Medusa - Google Art Project.jpg") },
  { id: "bacchus", artistId: "caravaggio", title: "Bacchus", year: "1596",
    rarity: "common", isSignature: false, imageUrl: img("Bacchus by Caravaggio 1.jpg") },

  // --- Velázquez ---
  { id: "las-meninas", artistId: "velazquez", title: "Las Meninas", year: "1656",
    rarity: "legendary", isSignature: true, imageUrl: img("Las Meninas, by Diego Velázquez, from Prado in Google Earth.jpg") },

  // --- Goya ---
  { id: "third-of-may", artistId: "goya", title: "The Third of May 1808", year: "1814",
    rarity: "epic", isSignature: true, imageUrl: img("El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg") },
  { id: "saturn", artistId: "goya", title: "Saturn Devouring His Son", year: "1823",
    rarity: "rare", isSignature: false, imageUrl: img("Francisco de Goya, Saturno devorando a su hijo (1819-1823).jpg") },

  // --- Turner ---
  { id: "fighting-temeraire", artistId: "turner", title: "The Fighting Temeraire", year: "1839",
    rarity: "epic", isSignature: true, imageUrl: img("Turner, J. M. W. - The Fighting Téméraire tugged to her last Berth to be broken.jpg") },
  { id: "rain-steam-speed", artistId: "turner", title: "Rain, Steam and Speed", year: "1844",
    rarity: "rare", isSignature: false, imageUrl: img("Rain Steam and Speed the Great Western Railway.jpg") },

  // --- Manet ---
  { id: "olympia", artistId: "manet", title: "Olympia", year: "1863",
    rarity: "epic", isSignature: true, imageUrl: img("Manet, Edouard - Olympia, 1863.jpg") },
  { id: "dejeuner-herbe", artistId: "manet", title: "Le Déjeuner sur l'herbe", year: "1863",
    rarity: "rare", isSignature: false, imageUrl: img("Edouard Manet - Luncheon on the Grass - Google Art Project.jpg") },

  // --- Rousseau ---
  { id: "sleeping-gypsy", artistId: "rousseau", title: "The Sleeping Gypsy", year: "1897",
    rarity: "rare", isSignature: true, imageUrl: img("La Bohémienne endormie.jpg") },

  // --- Delacroix ---
  { id: "liberty-leading", artistId: "delacroix", title: "Liberty Leading the People", year: "1830",
    rarity: "epic", isSignature: true, imageUrl: img("Eugène Delacroix - Le 28 Juillet. La Liberté guidant le peuple.jpg") },

  // --- Géricault ---
  { id: "raft-medusa", artistId: "gericault", title: "The Raft of the Medusa", year: "1819",
    rarity: "epic", isSignature: true, imageUrl: img("JEAN LOUIS THÉODORE GÉRICAULT - La Balsa de la Medusa (Museo del Louvre, 1818-19).jpg") },

  // --- National Gallery, London (added) ---
  { id: "arnolfini-portrait", artistId: "vaneyck", title: "The Arnolfini Portrait", year: "1434",
    rarity: "legendary", isSignature: true, imageUrl: img("Van Eyck - Arnolfini Portrait.jpg") },
  { id: "the-ambassadors", artistId: "holbein", title: "The Ambassadors", year: "1533",
    rarity: "epic", isSignature: true, imageUrl: img("Hans Holbein the Younger - The Ambassadors - Google Art Project.jpg") },
  { id: "rokeby-venus", artistId: "velazquez", title: "The Rokeby Venus", year: "1647",
    rarity: "epic", isSignature: false, imageUrl: img("Diego Velázquez - Rokeby Venus.jpg") },
  { id: "hay-wain", artistId: "constable", title: "The Hay Wain", year: "1821",
    rarity: "epic", isSignature: true, imageUrl: img("John Constable The Hay Wain.jpg") },
  { id: "supper-at-emmaus", artistId: "caravaggio", title: "The Supper at Emmaus", year: "1601",
    rarity: "rare", isSignature: false, imageUrl: img("Supper at Emmaus-Caravaggio (1601).jpg") },
  { id: "venus-and-mars", artistId: "botticelli", title: "Venus and Mars", year: "1485",
    rarity: "rare", isSignature: false, imageUrl: img("Venus and Mars National Gallery.jpg") },

  // --- More UK galleries (added) ---
  { id: "bar-folies-bergere", artistId: "manet", title: "A Bar at the Folies-Bergère", year: "1882",
    rarity: "epic", isSignature: true, imageUrl: img("Edouard Manet, A Bar at the Folies-Bergère.jpg") },
  { id: "self-portrait-bandaged-ear", artistId: "vangogh", title: "Self-Portrait with Bandaged Ear", year: "1889",
    rarity: "rare", isSignature: false, imageUrl: img("Vincent van Gogh - Self-portrait with bandaged ear (1889, Courtauld Institute).jpg") },
  { id: "ophelia", artistId: "millais", title: "Ophelia", year: "1852",
    rarity: "epic", isSignature: true, imageUrl: img("John Everett Millais - Ophelia - Google Art Project.jpg") },
  { id: "snow-storm-steamboat", artistId: "turner", title: "Snow Storm – Steam-Boat off a Harbour's Mouth", year: "1842",
    rarity: "rare", isSignature: false, imageUrl: img("Joseph Mallord William Turner - Snow Storm - Steam-Boat off a Harbour's Mouth - WGA23178.jpg") },
  { id: "old-woman-eggs", artistId: "velazquez", title: "An Old Woman Cooking Eggs", year: "1618",
    rarity: "rare", isSignature: false, imageUrl: img("Diego Velazquez - An Old Woman Cooking Eggs - Google Art Project.jpg") },

  // --- Victoria and Albert Museum, London (added) ---
  { id: "tipus-tiger", artistId: "mysore", title: "Tipu's Tiger", year: "c.1793",
    rarity: "legendary", isSignature: true, imageUrl: img("Tipu's Tiger with keyboard on display 2006AH4168.jpg") },
  { id: "three-graces", artistId: "canova", title: "The Three Graces", year: "1817",
    rarity: "epic", isSignature: true, imageUrl: img("Canova - The Three Graces, A.4-1994, 2006AT7724.jpg") },
  { id: "miraculous-draught", artistId: "raphael", title: "The Miraculous Draught of Fishes", year: "1515",
    rarity: "epic", isSignature: true, imageUrl: img("Raphael - The Miraculous Draft of Fishes - Google Art Project.jpg") },
  { id: "strawberry-thief", artistId: "morris", title: "Strawberry Thief", year: "1883",
    rarity: "rare", isSignature: true, imageUrl: img("Morris Strawberry Thief 1883.jpg") },
  { id: "salisbury-cathedral-bishops", artistId: "constable", title: "Salisbury Cathedral from the Bishop's Grounds", year: "1823",
    rarity: "rare", isSignature: false, imageUrl: img("John Constable - Salisbury Cathedral from the Bishop's Grounds.jpg") },
];

// Exhibitions: every artwork is placed at its real home museum with a window
// covering today. A few famous works are "touring" — they carry several
// date-disjoint rows tracing a multi-city journey (London → Paris/Amsterdam →
// New York), so the temporal + geospatial model is exercised by real data, not
// just present structurally. Exactly one row per work covers today() (its current
// location, used by the candidate-set query); the earlier rows are its history.
export const exhibitions: {
  id: string; artworkId: string; museumId: string; start: string; end: string;
}[] = [
  // Van Gogh
  // touring hero: Starry Night's journey — Tate (London) → Orsay (Paris) → MoMA (current)
  { id: "ex-starry-loan-tate", artworkId: "starry-night", museumId: "tate-britain", start: "2023-02-01", end: "2024-01-31" },
  { id: "ex-starry-loan-orsay", artworkId: "starry-night", museumId: "orsay", start: "2024-02-15", end: "2025-05-31" },
  { id: "ex-starry-night", artworkId: "starry-night", museumId: "moma", start: "2025-06-15", end: "2030-01-01" },
  { id: "ex-sunflowers", artworkId: "sunflowers", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  // touring: The Bedroom — Courtauld (London) → Van Gogh Museum → MoMA (current 2026)
  { id: "ex-bedroom-loan-courtauld", artworkId: "bedroom-arles", museumId: "courtauld", start: "2021-09-01", end: "2023-02-28" },
  { id: "ex-bedroom-home", artworkId: "bedroom-arles", museumId: "vangoghmuseum", start: "2023-03-15", end: "2025-12-31" },
  { id: "ex-bedroom-tour", artworkId: "bedroom-arles", museumId: "moma", start: "2026-01-01", end: "2026-12-31" },
  { id: "ex-almond-blossom", artworkId: "almond-blossom", museumId: "vangoghmuseum", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-wheatfield-crows", artworkId: "wheatfield-crows", museumId: "vangoghmuseum", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-potato-eaters", artworkId: "potato-eaters", museumId: "vangoghmuseum", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-starry-night-rhone", artworkId: "starry-night-rhone", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  // fictional loan for the demo: the 1889 Irises really lives at the Getty (not in
  // our museum list); the Met owns a different 1890 "Irises" still life
  { id: "ex-irises", artworkId: "irises", museumId: "met", start: "2026-01-01", end: "2026-12-31" },
  { id: "ex-wheat-field-cypresses", artworkId: "wheat-field-cypresses", museumId: "met", start: "2020-01-01", end: "2030-01-01" },

  // Da Vinci
  { id: "ex-mona-lisa", artworkId: "mona-lisa", museumId: "louvre", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-virgin-of-the-rocks", artworkId: "virgin-of-the-rocks", museumId: "louvre", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-annunciation", artworkId: "annunciation", museumId: "uffizi", start: "2020-01-01", end: "2030-01-01" },

  // Monet
  { id: "ex-blue-water-lilies", artworkId: "blue-water-lilies", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-poppies", artworkId: "poppies", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-the-magpie", artworkId: "the-magpie", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-gare-saint-lazare", artworkId: "gare-saint-lazare", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },

  // Vermeer
  { id: "ex-girl-pearl-earring", artworkId: "girl-pearl-earring", museumId: "mauritshuis", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-milkmaid", artworkId: "milkmaid", museumId: "rijksmuseum", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-view-of-delft", artworkId: "view-of-delft", museumId: "mauritshuis", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-young-woman-water-pitcher", artworkId: "young-woman-water-pitcher", museumId: "met", start: "2020-01-01", end: "2030-01-01" },

  // Rembrandt
  { id: "ex-night-watch", artworkId: "night-watch", museumId: "rijksmuseum", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-anatomy-lesson", artworkId: "anatomy-lesson", museumId: "mauritshuis", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-jewish-bride", artworkId: "jewish-bride", museumId: "rijksmuseum", start: "2020-01-01", end: "2030-01-01" },

  // Hokusai
  { id: "ex-great-wave", artworkId: "great-wave", museumId: "met", start: "2020-01-01", end: "2030-01-01" },

  // Botticelli
  { id: "ex-birth-of-venus", artworkId: "birth-of-venus", museumId: "uffizi", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-primavera", artworkId: "primavera", museumId: "uffizi", start: "2020-01-01", end: "2030-01-01" },

  // Degas
  { id: "ex-ballet-class", artworkId: "ballet-class", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-absinthe", artworkId: "absinthe", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },

  // Renoir
  { id: "ex-moulin-galette", artworkId: "moulin-galette", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-girls-at-piano", artworkId: "girls-at-piano", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },

  // Cézanne — touring: The Card Players — Tate (London) → Orsay (Paris) → Met (current 2026)
  { id: "ex-card-players-loan-tate", artworkId: "card-players", museumId: "tate-britain", start: "2021-05-01", end: "2023-04-30" },
  { id: "ex-card-players-home", artworkId: "card-players", museumId: "orsay", start: "2023-05-15", end: "2025-12-31" },
  { id: "ex-card-players-tour", artworkId: "card-players", museumId: "met", start: "2026-01-01", end: "2026-12-31" },
  { id: "ex-apples-oranges", artworkId: "apples-oranges", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },

  // Caravaggio
  { id: "ex-medusa", artworkId: "medusa", museumId: "uffizi", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-bacchus", artworkId: "bacchus", museumId: "uffizi", start: "2020-01-01", end: "2030-01-01" },

  // Velázquez
  { id: "ex-las-meninas", artworkId: "las-meninas", museumId: "prado", start: "2020-01-01", end: "2030-01-01" },

  // Goya
  { id: "ex-third-of-may", artworkId: "third-of-may", museumId: "prado", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-saturn", artworkId: "saturn", museumId: "prado", start: "2020-01-01", end: "2030-01-01" },

  // Turner
  { id: "ex-fighting-temeraire", artworkId: "fighting-temeraire", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-rain-steam-speed", artworkId: "rain-steam-speed", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },

  // Manet
  { id: "ex-olympia", artworkId: "olympia", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-dejeuner-herbe", artworkId: "dejeuner-herbe", museumId: "orsay", start: "2020-01-01", end: "2030-01-01" },

  // Rousseau
  { id: "ex-sleeping-gypsy", artworkId: "sleeping-gypsy", museumId: "moma", start: "2020-01-01", end: "2030-01-01" },

  // Delacroix
  { id: "ex-liberty-leading", artworkId: "liberty-leading", museumId: "louvre", start: "2020-01-01", end: "2030-01-01" },

  // Géricault
  { id: "ex-raft-medusa", artworkId: "raft-medusa", museumId: "louvre", start: "2020-01-01", end: "2030-01-01" },

  // National Gallery, London (added)
  { id: "ex-arnolfini-portrait", artworkId: "arnolfini-portrait", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-the-ambassadors", artworkId: "the-ambassadors", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-rokeby-venus", artworkId: "rokeby-venus", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-hay-wain", artworkId: "hay-wain", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-supper-at-emmaus", artworkId: "supper-at-emmaus", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-venus-and-mars", artworkId: "venus-and-mars", museumId: "nationalgallery", start: "2020-01-01", end: "2030-01-01" },

  // More UK galleries (added)
  { id: "ex-bar-folies-bergere", artworkId: "bar-folies-bergere", museumId: "courtauld", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-self-portrait-bandaged-ear", artworkId: "self-portrait-bandaged-ear", museumId: "courtauld", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-ophelia", artworkId: "ophelia", museumId: "tate-britain", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-snow-storm-steamboat", artworkId: "snow-storm-steamboat", museumId: "tate-britain", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-old-woman-eggs", artworkId: "old-woman-eggs", museumId: "scottish-national", start: "2020-01-01", end: "2030-01-01" },

  // Victoria and Albert Museum, London (added)
  { id: "ex-tipus-tiger", artworkId: "tipus-tiger", museumId: "va", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-three-graces", artworkId: "three-graces", museumId: "va", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-miraculous-draught", artworkId: "miraculous-draught", museumId: "va", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-strawberry-thief", artworkId: "strawberry-thief", museumId: "va", start: "2020-01-01", end: "2030-01-01" },
  { id: "ex-salisbury-cathedral-bishops", artworkId: "salisbury-cathedral-bishops", museumId: "va", start: "2020-01-01", end: "2030-01-01" },
];
