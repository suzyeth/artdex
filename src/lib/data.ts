// AUTO-GENERATED from src/lib/db/seedData.ts by scripts/genMockData.ts — do not edit by hand.
// IDs match the DynamoDB catalog so real collection + recognition line up.
export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface Museum { id: string; name: string; city: string; country: string; lon: number; lat: number; x: number; y: number }
export interface Artwork { id: string; title: string; artist: string; artistId: string; year: string; rarity: Rarity; image: string; museumId: string; medium: string; blurb: string }
export interface Artist { id: string; name: string; nationality: string }

export const MUSEUMS: Record<string, Museum> = {
  "moma": {
    "id": "moma",
    "name": "Museum of Modern Art",
    "city": "New York",
    "country": "USA",
    "lon": -73.9776,
    "lat": 40.7614,
    "x": 29.45,
    "y": 27.35
  },
  "met": {
    "id": "met",
    "name": "The Metropolitan Museum of Art",
    "city": "New York",
    "country": "USA",
    "lon": -73.9632,
    "lat": 40.7794,
    "x": 29.45,
    "y": 27.34
  },
  "louvre": {
    "id": "louvre",
    "name": "Louvre",
    "city": "Paris",
    "country": "France",
    "lon": 2.3364,
    "lat": 48.8606,
    "x": 50.65,
    "y": 22.86
  },
  "orsay": {
    "id": "orsay",
    "name": "Musée d'Orsay",
    "city": "Paris",
    "country": "France",
    "lon": 2.3266,
    "lat": 48.86,
    "x": 50.65,
    "y": 22.86
  },
  "nationalgallery": {
    "id": "nationalgallery",
    "name": "The National Gallery",
    "city": "London",
    "country": "UK",
    "lon": -0.1283,
    "lat": 51.5089,
    "x": 49.96,
    "y": 21.38
  },
  "rijksmuseum": {
    "id": "rijksmuseum",
    "name": "Rijksmuseum",
    "city": "Amsterdam",
    "country": "Netherlands",
    "lon": 4.8852,
    "lat": 52.36,
    "x": 51.36,
    "y": 20.91
  },
  "vangoghmuseum": {
    "id": "vangoghmuseum",
    "name": "Van Gogh Museum",
    "city": "Amsterdam",
    "country": "Netherlands",
    "lon": 4.881,
    "lat": 52.3584,
    "x": 51.36,
    "y": 20.91
  },
  "mauritshuis": {
    "id": "mauritshuis",
    "name": "Mauritshuis",
    "city": "The Hague",
    "country": "Netherlands",
    "lon": 4.3144,
    "lat": 52.0805,
    "x": 51.2,
    "y": 21.07
  },
  "uffizi": {
    "id": "uffizi",
    "name": "Uffizi Gallery",
    "city": "Florence",
    "country": "Italy",
    "lon": 11.2553,
    "lat": 43.7678,
    "x": 53.13,
    "y": 25.68
  },
  "prado": {
    "id": "prado",
    "name": "Museo del Prado",
    "city": "Madrid",
    "country": "Spain",
    "lon": -3.6921,
    "lat": 40.4138,
    "x": 48.97,
    "y": 27.55
  },
  "courtauld": {
    "id": "courtauld",
    "name": "The Courtauld Gallery",
    "city": "London",
    "country": "UK",
    "lon": -0.117,
    "lat": 51.5115,
    "x": 49.97,
    "y": 21.38
  },
  "tate-britain": {
    "id": "tate-britain",
    "name": "Tate Britain",
    "city": "London",
    "country": "UK",
    "lon": -0.1276,
    "lat": 51.4911,
    "x": 49.96,
    "y": 21.39
  },
  "scottish-national": {
    "id": "scottish-national",
    "name": "Scottish National Gallery",
    "city": "Edinburgh",
    "country": "UK",
    "lon": -3.1956,
    "lat": 55.9509,
    "x": 49.11,
    "y": 18.92
  },
  "va": {
    "id": "va",
    "name": "Victoria and Albert Museum",
    "city": "London",
    "country": "UK",
    "lon": -0.1719,
    "lat": 51.4966,
    "x": 49.95,
    "y": 21.39
  }
}

export const ARTISTS: Artist[] = [
  {
    "id": "vangogh",
    "name": "Vincent van Gogh",
    "nationality": "Dutch"
  },
  {
    "id": "davinci",
    "name": "Leonardo da Vinci",
    "nationality": "Italian"
  },
  {
    "id": "monet",
    "name": "Claude Monet",
    "nationality": "French"
  },
  {
    "id": "vermeer",
    "name": "Johannes Vermeer",
    "nationality": "Dutch"
  },
  {
    "id": "rembrandt",
    "name": "Rembrandt van Rijn",
    "nationality": "Dutch"
  },
  {
    "id": "hokusai",
    "name": "Katsushika Hokusai",
    "nationality": "Japanese"
  },
  {
    "id": "botticelli",
    "name": "Sandro Botticelli",
    "nationality": "Italian"
  },
  {
    "id": "degas",
    "name": "Edgar Degas",
    "nationality": "French"
  },
  {
    "id": "renoir",
    "name": "Pierre-Auguste Renoir",
    "nationality": "French"
  },
  {
    "id": "cezanne",
    "name": "Paul Cézanne",
    "nationality": "French"
  },
  {
    "id": "caravaggio",
    "name": "Caravaggio",
    "nationality": "Italian"
  },
  {
    "id": "velazquez",
    "name": "Diego Velázquez",
    "nationality": "Spanish"
  },
  {
    "id": "goya",
    "name": "Francisco de Goya",
    "nationality": "Spanish"
  },
  {
    "id": "turner",
    "name": "J. M. W. Turner",
    "nationality": "British"
  },
  {
    "id": "manet",
    "name": "Édouard Manet",
    "nationality": "French"
  },
  {
    "id": "rousseau",
    "name": "Henri Rousseau",
    "nationality": "French"
  },
  {
    "id": "delacroix",
    "name": "Eugène Delacroix",
    "nationality": "French"
  },
  {
    "id": "gericault",
    "name": "Théodore Géricault",
    "nationality": "French"
  },
  {
    "id": "vaneyck",
    "name": "Jan van Eyck",
    "nationality": "Flemish"
  },
  {
    "id": "holbein",
    "name": "Hans Holbein the Younger",
    "nationality": "German"
  },
  {
    "id": "constable",
    "name": "John Constable",
    "nationality": "British"
  },
  {
    "id": "millais",
    "name": "John Everett Millais",
    "nationality": "British"
  },
  {
    "id": "canova",
    "name": "Antonio Canova",
    "nationality": "Italian"
  },
  {
    "id": "raphael",
    "name": "Raphael",
    "nationality": "Italian"
  },
  {
    "id": "morris",
    "name": "William Morris",
    "nationality": "British"
  },
  {
    "id": "mysore",
    "name": "Unknown (Mysore)",
    "nationality": "Indian"
  }
]

export const ARTWORKS: Artwork[] = [
  {
    "id": "starry-night",
    "title": "The Starry Night",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1889",
    "rarity": "legendary",
    "image": "/artworks/van-gogh-starry-night-google-art-project.jpg",
    "museumId": "moma",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "sunflowers",
    "title": "Sunflowers",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1888",
    "rarity": "epic",
    "image": "/artworks/vincent-willem-van-gogh-127.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "bedroom-arles",
    "title": "The Bedroom",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1888",
    "rarity": "epic",
    "image": "/artworks/vincent-van-gogh-de-slaapkamer-google-art-project.jpg",
    "museumId": "moma",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "almond-blossom",
    "title": "Almond Blossom",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1890",
    "rarity": "rare",
    "image": "/artworks/vincent-van-gogh-almond-blossom-google-art-project.jpg",
    "museumId": "vangoghmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "wheatfield-crows",
    "title": "Wheatfield with Crows",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1890",
    "rarity": "rare",
    "image": "/artworks/vincent-van-gogh-wheatfield-with-crows-google-art-project.jpg",
    "museumId": "vangoghmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "potato-eaters",
    "title": "The Potato Eaters",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1885",
    "rarity": "common",
    "image": "/artworks/vincent-van-gogh-the-potato-eaters-google-art-project.jpg",
    "museumId": "vangoghmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "starry-night-rhone",
    "title": "Starry Night Over the Rhône",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1888",
    "rarity": "epic",
    "image": "/artworks/starry-night-over-the-rhone.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "irises",
    "title": "Irises",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1889",
    "rarity": "rare",
    "image": "/artworks/irises-vincent-van-gogh.jpg",
    "museumId": "met",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "wheat-field-cypresses",
    "title": "Wheat Field with Cypresses",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1889",
    "rarity": "rare",
    "image": "/artworks/vincent-van-gogh-wheat-field-with-cypresses-google-art-project.jpg",
    "museumId": "met",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "mona-lisa",
    "title": "Mona Lisa",
    "artist": "Leonardo da Vinci",
    "artistId": "davinci",
    "year": "1503",
    "rarity": "legendary",
    "image": "/artworks/mona-lisa-by-leonardo-da-vinci-from-c2rmf-retouched.jpg",
    "museumId": "louvre",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "virgin-of-the-rocks",
    "title": "The Virgin of the Rocks",
    "artist": "Leonardo da Vinci",
    "artistId": "davinci",
    "year": "1486",
    "rarity": "epic",
    "image": "/artworks/leonardo-da-vinci-vergine-delle-rocce-louvre.jpg",
    "museumId": "louvre",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "annunciation",
    "title": "Annunciation",
    "artist": "Leonardo da Vinci",
    "artistId": "davinci",
    "year": "1472",
    "rarity": "rare",
    "image": "/artworks/leonardo-da-vinci-annunciazione-google-art-project.jpg",
    "museumId": "uffizi",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "blue-water-lilies",
    "title": "Blue Water Lilies",
    "artist": "Claude Monet",
    "artistId": "monet",
    "year": "1916",
    "rarity": "rare",
    "image": "/artworks/claude-monet-blue-water-lilies-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "poppies",
    "title": "Poppies",
    "artist": "Claude Monet",
    "artistId": "monet",
    "year": "1873",
    "rarity": "common",
    "image": "/artworks/claude-monet-037.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "the-magpie",
    "title": "The Magpie",
    "artist": "Claude Monet",
    "artistId": "monet",
    "year": "1869",
    "rarity": "common",
    "image": "/artworks/claude-monet-the-magpie-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "gare-saint-lazare",
    "title": "The Gare Saint-Lazare",
    "artist": "Claude Monet",
    "artistId": "monet",
    "year": "1877",
    "rarity": "common",
    "image": "/artworks/claude-monet-the-saint-lazare-station-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "girl-pearl-earring",
    "title": "Girl with a Pearl Earring",
    "artist": "Johannes Vermeer",
    "artistId": "vermeer",
    "year": "1665",
    "rarity": "legendary",
    "image": "/artworks/1665-girl-with-a-pearl-earring.jpg",
    "museumId": "mauritshuis",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "milkmaid",
    "title": "The Milkmaid",
    "artist": "Johannes Vermeer",
    "artistId": "vermeer",
    "year": "1658",
    "rarity": "epic",
    "image": "/artworks/johannes-vermeer-het-melkmeisje-google-art-project.jpg",
    "museumId": "rijksmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "view-of-delft",
    "title": "View of Delft",
    "artist": "Johannes Vermeer",
    "artistId": "vermeer",
    "year": "1661",
    "rarity": "rare",
    "image": "/artworks/vermeer-view-of-delft.jpg",
    "museumId": "mauritshuis",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "young-woman-water-pitcher",
    "title": "Young Woman with a Water Pitcher",
    "artist": "Johannes Vermeer",
    "artistId": "vermeer",
    "year": "1662",
    "rarity": "common",
    "image": "/artworks/young-woman-with-a-water-pitcher-met-dp353257.jpg",
    "museumId": "met",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "night-watch",
    "title": "The Night Watch",
    "artist": "Rembrandt van Rijn",
    "artistId": "rembrandt",
    "year": "1642",
    "rarity": "legendary",
    "image": "/artworks/the-night-watch-hd.jpg",
    "museumId": "rijksmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "anatomy-lesson",
    "title": "The Anatomy Lesson of Dr Nicolaes Tulp",
    "artist": "Rembrandt van Rijn",
    "artistId": "rembrandt",
    "year": "1632",
    "rarity": "rare",
    "image": "/artworks/rembrandt-the-anatomy-lesson-of-dr-nicolaes-tulp.jpg",
    "museumId": "mauritshuis",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "jewish-bride",
    "title": "The Jewish Bride",
    "artist": "Rembrandt van Rijn",
    "artistId": "rembrandt",
    "year": "1665",
    "rarity": "rare",
    "image": "/artworks/rembrandt-harmensz-van-rijn-portret-van-een-paar-als-oudtestamentische-figuren-genaamd-het-joodse-bruidje-google-art-project.jpg",
    "museumId": "rijksmuseum",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "great-wave",
    "title": "The Great Wave off Kanagawa",
    "artist": "Katsushika Hokusai",
    "artistId": "hokusai",
    "year": "1831",
    "rarity": "epic",
    "image": "/artworks/tsunami-by-hokusai-19th-century.jpg",
    "museumId": "met",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "birth-of-venus",
    "title": "The Birth of Venus",
    "artist": "Sandro Botticelli",
    "artistId": "botticelli",
    "year": "1485",
    "rarity": "legendary",
    "image": "/artworks/sandro-botticelli-la-nascita-di-venere-google-art-project-edited.jpg",
    "museumId": "uffizi",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "primavera",
    "title": "Primavera",
    "artist": "Sandro Botticelli",
    "artistId": "botticelli",
    "year": "1482",
    "rarity": "epic",
    "image": "/artworks/botticelli-primavera.jpg",
    "museumId": "uffizi",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "ballet-class",
    "title": "The Ballet Class",
    "artist": "Edgar Degas",
    "artistId": "degas",
    "year": "1874",
    "rarity": "rare",
    "image": "/artworks/edgar-degas-the-ballet-class-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "absinthe",
    "title": "In a Café (L'Absinthe)",
    "artist": "Edgar Degas",
    "artistId": "degas",
    "year": "1876",
    "rarity": "common",
    "image": "/artworks/edgar-degas-in-a-caf-google-art-project-2.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "moulin-galette",
    "title": "Bal du moulin de la Galette",
    "artist": "Pierre-Auguste Renoir",
    "artistId": "renoir",
    "year": "1876",
    "rarity": "epic",
    "image": "/artworks/pierre-auguste-renoir-le-moulin-de-la-galette.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "girls-at-piano",
    "title": "Young Girls at the Piano",
    "artist": "Pierre-Auguste Renoir",
    "artistId": "renoir",
    "year": "1892",
    "rarity": "common",
    "image": "/artworks/auguste-renoir-young-girls-at-the-piano-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "card-players",
    "title": "The Card Players",
    "artist": "Paul Cézanne",
    "artistId": "cezanne",
    "year": "1895",
    "rarity": "rare",
    "image": "/artworks/les-joueurs-de-cartes-par-paul-c-zanne.jpg",
    "museumId": "met",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "apples-oranges",
    "title": "Apples and Oranges",
    "artist": "Paul Cézanne",
    "artistId": "cezanne",
    "year": "1899",
    "rarity": "common",
    "image": "/artworks/paul-c-zanne-179.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "medusa",
    "title": "Medusa",
    "artist": "Caravaggio",
    "artistId": "caravaggio",
    "year": "1597",
    "rarity": "rare",
    "image": "/artworks/caravaggio-medusa-google-art-project.jpg",
    "museumId": "uffizi",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "bacchus",
    "title": "Bacchus",
    "artist": "Caravaggio",
    "artistId": "caravaggio",
    "year": "1596",
    "rarity": "common",
    "image": "/artworks/bacchus-by-caravaggio-1.jpg",
    "museumId": "uffizi",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "las-meninas",
    "title": "Las Meninas",
    "artist": "Diego Velázquez",
    "artistId": "velazquez",
    "year": "1656",
    "rarity": "legendary",
    "image": "/artworks/las-meninas-by-diego-vel-zquez-from-prado-in-google-earth.jpg",
    "museumId": "prado",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "third-of-may",
    "title": "The Third of May 1808",
    "artist": "Francisco de Goya",
    "artistId": "goya",
    "year": "1814",
    "rarity": "epic",
    "image": "/artworks/el-tres-de-mayo-by-francisco-de-goya-from-prado-thin-black-margin.jpg",
    "museumId": "prado",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "saturn",
    "title": "Saturn Devouring His Son",
    "artist": "Francisco de Goya",
    "artistId": "goya",
    "year": "1823",
    "rarity": "rare",
    "image": "/artworks/francisco-de-goya-saturno-devorando-a-su-hijo-1819-1823.jpg",
    "museumId": "prado",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "fighting-temeraire",
    "title": "The Fighting Temeraire",
    "artist": "J. M. W. Turner",
    "artistId": "turner",
    "year": "1839",
    "rarity": "epic",
    "image": "/artworks/turner-j-m-w-the-fighting-t-m-raire-tugged-to-her-last-berth-to-be-broken.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "rain-steam-speed",
    "title": "Rain, Steam and Speed",
    "artist": "J. M. W. Turner",
    "artistId": "turner",
    "year": "1844",
    "rarity": "rare",
    "image": "/artworks/rain-steam-and-speed-the-great-western-railway.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "olympia",
    "title": "Olympia",
    "artist": "Édouard Manet",
    "artistId": "manet",
    "year": "1863",
    "rarity": "epic",
    "image": "/artworks/manet-edouard-olympia-1863.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "dejeuner-herbe",
    "title": "Le Déjeuner sur l'herbe",
    "artist": "Édouard Manet",
    "artistId": "manet",
    "year": "1863",
    "rarity": "rare",
    "image": "/artworks/edouard-manet-luncheon-on-the-grass-google-art-project.jpg",
    "museumId": "orsay",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "sleeping-gypsy",
    "title": "The Sleeping Gypsy",
    "artist": "Henri Rousseau",
    "artistId": "rousseau",
    "year": "1897",
    "rarity": "rare",
    "image": "/artworks/la-boh-mienne-endormie.jpg",
    "museumId": "moma",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "liberty-leading",
    "title": "Liberty Leading the People",
    "artist": "Eugène Delacroix",
    "artistId": "delacroix",
    "year": "1830",
    "rarity": "epic",
    "image": "/artworks/eug-ne-delacroix-le-28-juillet-la-libert-guidant-le-peuple.jpg",
    "museumId": "louvre",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "raft-medusa",
    "title": "The Raft of the Medusa",
    "artist": "Théodore Géricault",
    "artistId": "gericault",
    "year": "1819",
    "rarity": "epic",
    "image": "/artworks/jean-louis-th-odore-g-ricault-la-balsa-de-la-medusa-museo-del-louvre-1818-19.jpg",
    "museumId": "louvre",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "arnolfini-portrait",
    "title": "The Arnolfini Portrait",
    "artist": "Jan van Eyck",
    "artistId": "vaneyck",
    "year": "1434",
    "rarity": "legendary",
    "image": "/artworks/van-eyck-arnolfini-portrait.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "the-ambassadors",
    "title": "The Ambassadors",
    "artist": "Hans Holbein the Younger",
    "artistId": "holbein",
    "year": "1533",
    "rarity": "epic",
    "image": "/artworks/hans-holbein-the-younger-the-ambassadors-google-art-project.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "rokeby-venus",
    "title": "The Rokeby Venus",
    "artist": "Diego Velázquez",
    "artistId": "velazquez",
    "year": "1647",
    "rarity": "epic",
    "image": "/artworks/diego-vel-zquez-rokeby-venus.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "hay-wain",
    "title": "The Hay Wain",
    "artist": "John Constable",
    "artistId": "constable",
    "year": "1821",
    "rarity": "epic",
    "image": "/artworks/john-constable-the-hay-wain.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "supper-at-emmaus",
    "title": "The Supper at Emmaus",
    "artist": "Caravaggio",
    "artistId": "caravaggio",
    "year": "1601",
    "rarity": "rare",
    "image": "/artworks/supper-at-emmaus-caravaggio-1601.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "venus-and-mars",
    "title": "Venus and Mars",
    "artist": "Sandro Botticelli",
    "artistId": "botticelli",
    "year": "1485",
    "rarity": "rare",
    "image": "/artworks/venus-and-mars-national-gallery.jpg",
    "museumId": "nationalgallery",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "bar-folies-bergere",
    "title": "A Bar at the Folies-Bergère",
    "artist": "Édouard Manet",
    "artistId": "manet",
    "year": "1882",
    "rarity": "epic",
    "image": "/artworks/edouard-manet-a-bar-at-the-folies-berg-re.jpg",
    "museumId": "courtauld",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "self-portrait-bandaged-ear",
    "title": "Self-Portrait with Bandaged Ear",
    "artist": "Vincent van Gogh",
    "artistId": "vangogh",
    "year": "1889",
    "rarity": "rare",
    "image": "/artworks/vincent-van-gogh-self-portrait-with-bandaged-ear-1889-courtauld-institute.jpg",
    "museumId": "courtauld",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "ophelia",
    "title": "Ophelia",
    "artist": "John Everett Millais",
    "artistId": "millais",
    "year": "1852",
    "rarity": "epic",
    "image": "/artworks/john-everett-millais-ophelia-google-art-project.jpg",
    "museumId": "tate-britain",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "snow-storm-steamboat",
    "title": "Snow Storm – Steam-Boat off a Harbour's Mouth",
    "artist": "J. M. W. Turner",
    "artistId": "turner",
    "year": "1842",
    "rarity": "rare",
    "image": "/artworks/joseph-mallord-william-turner-snow-storm-steam-boat-off-a-harbour-s-mouth-wga23178.jpg",
    "museumId": "tate-britain",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "old-woman-eggs",
    "title": "An Old Woman Cooking Eggs",
    "artist": "Diego Velázquez",
    "artistId": "velazquez",
    "year": "1618",
    "rarity": "rare",
    "image": "/artworks/diego-velazquez-an-old-woman-cooking-eggs-google-art-project.jpg",
    "museumId": "scottish-national",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "tipus-tiger",
    "title": "Tipu's Tiger",
    "artist": "Unknown (Mysore)",
    "artistId": "mysore",
    "year": "c.1793",
    "rarity": "legendary",
    "image": "/artworks/tipu-s-tiger-with-keyboard-on-display-2006ah4168.jpg",
    "museumId": "va",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "three-graces",
    "title": "The Three Graces",
    "artist": "Antonio Canova",
    "artistId": "canova",
    "year": "1817",
    "rarity": "epic",
    "image": "/artworks/canova-the-three-graces-a-4-1994-2006at7724.jpg",
    "museumId": "va",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "miraculous-draught",
    "title": "The Miraculous Draught of Fishes",
    "artist": "Raphael",
    "artistId": "raphael",
    "year": "1515",
    "rarity": "epic",
    "image": "/artworks/raphael-the-miraculous-draft-of-fishes-google-art-project.jpg",
    "museumId": "va",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "strawberry-thief",
    "title": "Strawberry Thief",
    "artist": "William Morris",
    "artistId": "morris",
    "year": "1883",
    "rarity": "rare",
    "image": "/artworks/morris-strawberry-thief-1883.jpg",
    "museumId": "va",
    "medium": "Oil on canvas",
    "blurb": ""
  },
  {
    "id": "salisbury-cathedral-bishops",
    "title": "Salisbury Cathedral from the Bishop's Grounds",
    "artist": "John Constable",
    "artistId": "constable",
    "year": "1823",
    "rarity": "rare",
    "image": "/artworks/john-constable-salisbury-cathedral-from-the-bishop-s-grounds.jpg",
    "museumId": "va",
    "medium": "Oil on canvas",
    "blurb": ""
  }
]

export const RARITY_META: Record<Rarity, { label: string; order: number }> = {
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
export function getArtist(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === id)
}
