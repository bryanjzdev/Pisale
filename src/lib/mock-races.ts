// Datos de ejemplo mientras conectamos la base de datos (Fase 1 del plan).
// La forma de este tipo servirá como referencia para el modelo `Race` de Prisma.

export type RaceCategory = "ruta" | "trail" | "nocturna";

export type Race = {
  id: string;
  title: string;
  day: string;
  month: string;
  year: string;
  location: string;
  imageUrl: string;
  price: number;
  category: RaceCategory;
  distances: string[];
  status: { label: string; tone: "hot" | "open" | "early" };
  spotsTaken: number;
  spotsTotal: number;
  elevation?: string;
};

export const MOCK_RACES: Race[] = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México",
    day: "15", month: "Nov", year: "2026",
    location: "Reforma, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=900",
    price: 650,
    category: "ruta",
    distances: ["21K", "10K"],
    status: { label: "Últimos lugares", tone: "hot" },
    spotsTaken: 14200, spotsTotal: 15000,
  },
  {
    id: "2",
    title: "Trail Nocturno Desierto de los Leones",
    day: "03", month: "Dic", year: "2026",
    location: "Cuajimalpa, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=900",
    price: 450,
    category: "trail",
    distances: ["25K", "12K"],
    status: { label: "Inscripciones abiertas", tone: "open" },
    spotsTaken: 1100, spotsTotal: 2000,
    elevation: "+1,250 m",
  },
  {
    id: "3",
    title: "5K Neón Night Run",
    day: "20", month: "Ene", year: "2027",
    location: "Parque Fundidora, MTY",
    imageUrl: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&q=80&w=900",
    price: 350,
    category: "nocturna",
    distances: ["5K"],
    status: { label: "Early bird", tone: "early" },
    spotsTaken: 1800, spotsTotal: 5000,
  },
  {
    id: "4",
    title: "Maratón Internacional de Guadalajara",
    day: "14", month: "Feb", year: "2027",
    location: "Centro, GDL",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=900",
    price: 890,
    category: "ruta",
    distances: ["42K", "21K"],
    status: { label: "Inscripciones abiertas", tone: "open" },
    spotsTaken: 6400, spotsTotal: 12000,
  },
  {
    id: "5",
    title: "Ultra Trail Sierra de Arteaga",
    day: "07", month: "Mar", year: "2027",
    location: "Arteaga, Coahuila",
    imageUrl: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=900",
    price: 1200,
    category: "trail",
    distances: ["50K", "30K"],
    status: { label: "Últimos lugares", tone: "hot" },
    spotsTaken: 760, spotsTotal: 800,
    elevation: "+2,900 m",
  },
  {
    id: "6",
    title: "Glow Run Puebla 10K",
    day: "28", month: "Mar", year: "2027",
    location: "Angelópolis, Puebla",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&q=80&w=900",
    price: 380,
    category: "nocturna",
    distances: ["10K", "5K"],
    status: { label: "Early bird", tone: "early" },
    spotsTaken: 900, spotsTotal: 4000,
  },
];
