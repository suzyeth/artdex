// AUTO-GENERATED from src/lib/db/seedData.ts by scripts/genMockData.ts — do not edit by hand.
// IDs match the DynamoDB catalog so real collection + recognition line up.
export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface Museum { id: string; name: string; city: string; country: string; x: number; y: number }
export interface Artwork { id: string; title: string; artist: string; artistId: string; year: string; rarity: Rarity; image: string; museumId: string; medium: string; blurb: string }
export interface Artist { id: string; name: string; nationality: string }

export const MUSEUMS: Record<string, Museum> = {
  "moma": {
    "id": "moma",
    "name": "Museum of Modern Art",
    "city": "New York",
    "country": "USA",
    "x": 29.45,
    "y": 27.35
  },
  "met": {
    "id": "met",
    "name": "The Metropolitan Museum of Art",
    "city": "New York",
    "country": "USA",
    "x": 29.45,
    "y": 27.34
  },
  "louvre": {
    "id": "louvre",
    "name": "Louvre",
    "city": "Paris",
    "country": "France",
    "x": 50.65,
    "y": 22.86
  },
  "orsay": {
    "id": "orsay",
    "name": "Musée d'Orsay",
    "city": "Paris",
    "country": "France",
    "x": 50.65,
    "y": 22.86
  },
  "nationalgallery": {
    "id": "nationalgallery",
    "name": "The National Gallery",
    "city": "London",
    "country": "UK",
    "x": 49.96,
    "y": 21.38
  },
  "rijksmuseum": {
    "id": "rijksmuseum",
    "name": "Rijksmuseum",
    "city": "Amsterdam",
    "country": "Netherlands",
    "x": 51.36,
    "y": 20.91
  },
  "vangoghmuseum": {
    "id": "vangoghmuseum",
    "name": "Van Gogh Museum",
    "city": "Amsterdam",
    "country": "Netherlands",
    "x": 51.36,
    "y": 20.91
  },
  "mauritshuis": {
    "id": "mauritshuis",
    "name": "Mauritshuis",
    "city": "The Hague",
    "country": "Netherlands",
    "x": 51.2,
    "y": 21.07
  },
  "uffizi": {
    "id": "uffizi",
    "name": "Uffizi Gallery",
    "city": "Florence",
    "country": "Italy",
    "x": 53.13,
    "y": 25.68
  },
  "prado": {
    "id": "prado",
    "name": "Museo del Prado",
    "city": "Madrid",
    "country": "Spain",
    "x": 48.97,
    "y": 27.55
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Van%20Gogh%20-%20Starry%20Night%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20Willem%20van%20Gogh%20127.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20van%20Gogh%20-%20De%20slaapkamer%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20van%20Gogh%20-%20Almond%20blossom%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20van%20Gogh%20-%20Wheatfield%20with%20crows%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20van%20Gogh%20-%20The%20potato%20eaters%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Starry%20Night%20Over%20the%20Rhone.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Irises-Vincent%20van%20Gogh.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent%20van%20Gogh%20-%20Wheat%20Field%20with%20Cypresses%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Mona%20Lisa%2C%20by%20Leonardo%20da%20Vinci%2C%20from%20C2RMF%20retouched.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20Da%20Vinci%20-%20Vergine%20delle%20Rocce%20(Louvre).jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20Annunciazione%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Monet%20-%20Blue%20Water%20Lilies%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Monet%20037.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Monet%20-%20The%20Magpie%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Monet%20-%20The%20Saint-Lazare%20Station%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/1665%20Girl%20with%20a%20Pearl%20Earring.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Johannes%20Vermeer%20-%20Het%20melkmeisje%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vermeer-view-of-delft.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Young%20Woman%20with%20a%20Water%20Pitcher%20MET%20DP353257.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Night%20Watch%20-%20HD.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20-%20The%20Anatomy%20Lesson%20of%20Dr%20Nicolaes%20Tulp.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20Harmensz.%20van%20Rijn%20-%20Portret%20van%20een%20paar%20als%20oudtestamentische%20figuren%2C%20genaamd%20'Het%20Joodse%20bruidje'%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tsunami%20by%20hokusai%2019th%20century.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Sandro%20Botticelli%20-%20La%20nascita%20di%20Venere%20-%20Google%20Art%20Project%20-%20edited.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Botticelli-primavera.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Edgar%20Degas%20-%20The%20Ballet%20Class%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Edgar%20Degas%20-%20In%20a%20Caf%C3%A9%20-%20Google%20Art%20Project%202.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre-Auguste%20Renoir%2C%20Le%20Moulin%20de%20la%20Galette.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Auguste%20Renoir%20-%20Young%20Girls%20at%20the%20Piano%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Les%20Joueurs%20de%20cartes%2C%20par%20Paul%20C%C3%A9zanne.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Paul%20C%C3%A9zanne%20179.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20-%20Medusa%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Bacchus%20by%20Caravaggio%201.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Las%20Meninas%2C%20by%20Diego%20Vel%C3%A1zquez%2C%20from%20Prado%20in%20Google%20Earth.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/El%20Tres%20de%20Mayo%2C%20by%20Francisco%20de%20Goya%2C%20from%20Prado%20thin%20black%20margin.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Francisco%20de%20Goya%2C%20Saturno%20devorando%20a%20su%20hijo%20(1819-1823).jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Turner%2C%20J.%20M.%20W.%20-%20The%20Fighting%20T%C3%A9m%C3%A9raire%20tugged%20to%20her%20last%20Berth%20to%20be%20broken.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Rain%20Steam%20and%20Speed%20the%20Great%20Western%20Railway.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Manet%2C%20Edouard%20-%20Olympia%2C%201863.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Edouard%20Manet%20-%20Luncheon%20on%20the%20Grass%20-%20Google%20Art%20Project.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/La%20Boh%C3%A9mienne%20endormie.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Eug%C3%A8ne%20Delacroix%20-%20Le%2028%20Juillet.%20La%20Libert%C3%A9%20guidant%20le%20peuple.jpg?width=1000",
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
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/JEAN%20LOUIS%20TH%C3%89ODORE%20G%C3%89RICAULT%20-%20La%20Balsa%20de%20la%20Medusa%20(Museo%20del%20Louvre%2C%201818-19).jpg?width=1000",
    "museumId": "louvre",
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
