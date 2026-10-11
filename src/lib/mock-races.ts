// Datos de ejemplo mientras conectamos la base de datos (Fase 1 del plan).
// La forma de este tipo servirá como referencia para el modelo `Race` de Prisma.

export type RaceCategory = "ruta" | "trail" | "nocturna";

export type DistanceOption = {
  id: string;
  name: string; // ej. "10K", "21K"
  price: number;
  spotsAvailable: number;
  maxSpots: number;
  elevationGain?: string;
  recommendedPace?: string;
};

export type KitItem = {
  id: string;
  title: string;
  description: string;
  icon: "shirt" | "medal" | "timer" | "droplet" | "shield" | "bag";
  highlight?: boolean;
};

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

  // Campos extendidos para la vista de detalle
  description?: string;
  startTime?: string;
  deadline?: string;
  expo?: {
    location: string;
    dates: string;
    hours: string;
  };
  distanceOptions?: DistanceOption[];
  elevationProfile?: {
    gain: string;
    minAlt: string;
    maxAlt: string;
    difficulty: "Fácil" | "Moderada" | "Alta" | "Técnica";
    points: number[]; // Puntos porcentuales para renderizar la curva SVG de altimetría
  };
  routeDetails?: {
    surface: string;
    hydrationPoints: number;
    medicalStations: number;
    pacers: string[];
    routeMapUrl?: string;
  };
  kitItems?: KitItem[];
  organizer?: {
    name: string;
    verified: boolean;
    avatarUrl?: string;
  };
};

const DEFAULT_KIT_ITEMS: KitItem[] = [
  {
    id: "1",
    title: "Playera Conmemorativa Dry-Fit",
    description: "Tecnología micro-ventilada de alta transpirabilidad y corte atlético.",
    icon: "shirt",
    highlight: true,
  },
  {
    id: "2",
    title: "Medalla de Finalista 3D",
    description: "Diseño conmemorativo de fundición con relieve coleccionable.",
    icon: "medal",
    highlight: true,
  },
  {
    id: "3",
    title: "Chip Cronometraje BibTag",
    description: "Monitoreo en vivo punto a punto integrado a tu app Písale.",
    icon: "timer",
  },
  {
    id: "4",
    title: "Hidratación en Ruta & Meta",
    description: "Puntos de abasto con agua purificada y bebida isotónica cada 2.5K.",
    icon: "droplet",
  },
  {
    id: "5",
    title: "Morral Conmemorativo & Guardarropa",
    description: "Bolsa oficial con servicio seguro de custodia de pertenencias.",
    icon: "bag",
  },
  {
    id: "6",
    title: "Seguro Médico de Corredor",
    description: "Cobertura de primeros auxilios y asistencia médica durante la carrera.",
    icon: "shield",
  },
];

export const MOCK_RACES: Race[] = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México",
    day: "15",
    month: "Nov",
    year: "2026",
    location: "Paseo de la Reforma, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
    price: 650,
    category: "ruta",
    distances: ["21K", "10K"],
    status: { label: "Últimos lugares", tone: "hot" },
    spotsTaken: 14200,
    spotsTotal: 15000,
    elevation: "+120 m",
    description:
      "Corre por la avenida más emblemática del país. Disfruta de un recorrido plano y rápido pasando por el Ángel de la Independencia, Chapultepec y la Diana Cazadora. Una fiesta atlética con miles de corredores impulsando cada kilómetro.",
    startTime: "06:30 hrs",
    deadline: "10 de Noviembre, 2026 - 23:59",
    expo: {
      location: "WTC Ciudad de México, Salón Mexica",
      dates: "Viernes 13 y Sábado 14 de Noviembre, 2026",
      hours: "10:00 hrs a 19:00 hrs",
    },
    distanceOptions: [
      {
        id: "21k",
        name: "21K Medio Maratón",
        price: 650,
        spotsAvailable: 500,
        maxSpots: 10000,
        elevationGain: "+120 m",
        recommendedPace: "04:30 - 06:30 min/km",
      },
      {
        id: "10k",
        name: "10K Recreativo",
        price: 520,
        spotsAvailable: 300,
        maxSpots: 5000,
        elevationGain: "+60 m",
        recommendedPace: "05:00 - 07:00 min/km",
      },
    ],
    elevationProfile: {
      gain: "+120 m",
      minAlt: "2,240 m",
      maxAlt: "2,285 m",
      difficulty: "Fácil",
      points: [2240, 2245, 2252, 2260, 2275, 2285, 2270, 2260, 2250, 2242, 2240],
    },
    routeDetails: {
      surface: "Asfalto pavimentado plano",
      hydrationPoints: 8,
      medicalStations: 4,
      pacers: ["1h 30m", "1h 45m", "2h 00m", "2h 15m"],
      routeMapUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
    },
    kitItems: DEFAULT_KIT_ITEMS,
    organizer: {
      name: "Asociación Atlética CDMX",
      verified: true,
    },
  },
  {
    id: "2",
    title: "Trail Nocturno Desierto de los Leones",
    day: "03",
    month: "Dic",
    year: "2026",
    location: "Parque Nacional Desierto de los Leones, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=1200",
    price: 450,
    category: "trail",
    distances: ["25K", "12K"],
    status: { label: "Inscripciones abiertas", tone: "open" },
    spotsTaken: 1100,
    spotsTotal: 2000,
    elevation: "+1,250 m",
    description:
      "Una aventura mágica bajo la luz de la luna y las estrellas en el bosque milenario. Senderos empinados, veredas de tierra y pinos gigantes con linterna frontal obligatoria. Desafía tu resistencia con un desnivel que pondrá a prueba tus piernas.",
    startTime: "19:00 hrs (Nocturna)",
    deadline: "28 de Noviembre, 2026 - 23:59",
    expo: {
      location: "Ex-Convento Desierto de los Leones",
      dates: "Sábado 03 de Diciembre, 2026",
      hours: "14:00 hrs a 18:00 hrs",
    },
    distanceOptions: [
      {
        id: "25k",
        name: "25K Trail Experto",
        price: 580,
        spotsAvailable: 420,
        maxSpots: 1000,
        elevationGain: "+1,250 m",
        recommendedPace: "06:30 - 09:00 min/km",
      },
      {
        id: "12k",
        name: "12K Trail Sprint",
        price: 450,
        spotsAvailable: 480,
        maxSpots: 1000,
        elevationGain: "+620 m",
        recommendedPace: "06:00 - 08:30 min/km",
      },
    ],
    elevationProfile: {
      gain: "+1,250 m",
      minAlt: "2,980 m",
      maxAlt: "3,750 m",
      difficulty: "Alta",
      points: [2980, 3100, 3320, 3540, 3750, 3600, 3420, 3210, 3050, 2980],
    },
    routeDetails: {
      surface: "Sendero de tierra compacta, rocas y raíces",
      hydrationPoints: 5,
      medicalStations: 3,
      pacers: ["Guías de rescate en ruta"],
      routeMapUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    },
    kitItems: [
      ...DEFAULT_KIT_ITEMS.slice(0, 2),
      {
        id: "lamp",
        title: "Lámpara Frontal LED Recargable",
        description: "Luz ultrabrillante de 400 lúmenes con banda reflectante de seguridad.",
        icon: "shield",
        highlight: true,
      },
      ...DEFAULT_KIT_ITEMS.slice(2),
    ],
    organizer: {
      name: "Wild Peak Trails México",
      verified: true,
    },
  },
  {
    id: "3",
    title: "5K Neón Night Run",
    day: "20",
    month: "Ene",
    year: "2027",
    location: "Parque Fundidora, Monterrey",
    imageUrl: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&q=80&w=1200",
    price: 350,
    category: "nocturna",
    distances: ["5K"],
    status: { label: "Early bird", tone: "early" },
    spotsTaken: 1800,
    spotsTotal: 5000,
    elevation: "+40 m",
    description:
      "La carrera nocturna más divertida del norte. Música de DJs en vivo a lo largo del circuito, túneles de luz ultravioleta, polvos neón biodegradables y una fiesta épica en la meta.",
    startTime: "20:00 hrs",
    deadline: "15 de Enero, 2027 - 23:59",
    expo: {
      location: "Nave Lewis, Parque Fundidora",
      dates: "Sábado 20 de Enero, 2027",
      hours: "11:00 hrs a 18:30 hrs",
    },
    distanceOptions: [
      {
        id: "5k",
        name: "5K Glow Experience",
        price: 350,
        spotsAvailable: 3200,
        maxSpots: 5000,
        elevationGain: "+40 m",
        recommendedPace: "Cualquier ritmo / Recreativo",
      },
    ],
    elevationProfile: {
      gain: "+40 m",
      minAlt: "530 m",
      maxAlt: "550 m",
      difficulty: "Fácil",
      points: [530, 535, 545, 548, 540, 532, 530],
    },
    routeDetails: {
      surface: "Pavimento y adoquín cerrado al tráfico",
      hydrationPoints: 3,
      medicalStations: 2,
      pacers: ["DJs en cada kilómetro"],
    },
    kitItems: [
      {
        id: "neon-shirt",
        title: "Playera Neón Glow UV",
        description: "Estampado fosforescente de alto impacto reactivo a luz ultravioleta.",
        icon: "shirt",
        highlight: true,
      },
      ...DEFAULT_KIT_ITEMS.slice(1),
    ],
    organizer: {
      name: "Pulse Events MX",
      verified: true,
    },
  },
  {
    id: "4",
    title: "Maratón Internacional de Guadalajara",
    day: "14",
    month: "Feb",
    year: "2027",
    location: "Centro Histórico, Guadalajara",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200",
    price: 890,
    category: "ruta",
    distances: ["42K", "21K"],
    status: { label: "Inscripciones abiertas", tone: "open" },
    spotsTaken: 6400,
    spotsTotal: 12000,
    elevation: "+180 m",
    description:
      "Certificado por World Athletics. Recorre los monumentos históricos tapatíos como La Minerva, el Teatro Degollado y los Arcos de Guadalajara. Ambiente festivo con mariachi en vivo y medalla trofeo de colección.",
    startTime: "06:15 hrs",
    deadline: "05 de Febrero, 2027 - 23:59",
    expo: {
      location: "Expo Guadalajara, Salón Jalisco",
      dates: "Viernes 12 y Sábado 13 de Febrero, 2027",
      hours: "09:00 hrs a 18:00 hrs",
    },
    distanceOptions: [
      {
        id: "42k",
        name: "42K Maratón Completo",
        price: 890,
        spotsAvailable: 2800,
        maxSpots: 6000,
        elevationGain: "+180 m",
        recommendedPace: "04:15 - 06:00 min/km",
      },
      {
        id: "21k",
        name: "21K Medio Maratón",
        price: 680,
        spotsAvailable: 2800,
        maxSpots: 6000,
        elevationGain: "+95 m",
        recommendedPace: "04:30 - 06:30 min/km",
      },
    ],
    elevationProfile: {
      gain: "+180 m",
      minAlt: "1,540 m",
      maxAlt: "1,620 m",
      difficulty: "Moderada",
      points: [1540, 1560, 1585, 1610, 1620, 1590, 1570, 1580, 1550, 1540],
    },
    routeDetails: {
      surface: "Asfalto certificado World Athletics",
      hydrationPoints: 16,
      medicalStations: 8,
      pacers: ["3h 00m", "3h 15m", "3h 30m", "3h 45m", "4h 00m", "4h 30m"],
    },
    kitItems: DEFAULT_KIT_ITEMS,
    organizer: {
      name: "Comude Guadalajara",
      verified: true,
    },
  },
  {
    id: "5",
    title: "Ultra Trail Sierra de Arteaga",
    day: "07",
    month: "Mar",
    year: "2027",
    location: "Sierra de Arteaga, Coahuila",
    imageUrl: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=1200",
    price: 1200,
    category: "trail",
    distances: ["50K", "30K"],
    status: { label: "Últimos lugares", tone: "hot" },
    spotsTaken: 760,
    spotsTotal: 800,
    elevation: "+2,900 m",
    description:
      "La 'Suiza Mexicana' te espera con cumbres nevadas, cañones escarpados y bosques de oyamel. Una prueba de ultra distancia para corredores experimentados que otorga puntos ITRA / UTMB Index.",
    startTime: "05:00 hrs",
    deadline: "20 de Febrero, 2027 - 23:59",
    expo: {
      location: "Plaza Principal de San Antonio de las Alazanas",
      dates: "Sábado 06 de Marzo, 2027",
      hours: "12:00 hrs a 19:00 hrs",
    },
    distanceOptions: [
      {
        id: "50k",
        name: "50K Ultra Skyrace",
        price: 1400,
        spotsAvailable: 18,
        maxSpots: 400,
        elevationGain: "+2,900 m",
        recommendedPace: "Trail técnico / Calificación previa",
      },
      {
        id: "30k",
        name: "30K Montaña Desafío",
        price: 1200,
        spotsAvailable: 22,
        maxSpots: 400,
        elevationGain: "+1,650 m",
        recommendedPace: "Trail intermedio",
      },
    ],
    elevationProfile: {
      gain: "+2,900 m",
      minAlt: "2,150 m",
      maxAlt: "3,520 m",
      difficulty: "Técnica",
      points: [2150, 2400, 2800, 3200, 3520, 3100, 2900, 2600, 2300, 2150],
    },
    routeDetails: {
      surface: "Senderos técnicos, pedregales, crestas de montaña",
      hydrationPoints: 6,
      medicalStations: 4,
      pacers: ["Equipo de rescate alpino"],
    },
    kitItems: DEFAULT_KIT_ITEMS,
    organizer: {
      name: "Ultra Coahuila Expeditions",
      verified: true,
    },
  },
  {
    id: "6",
    title: "Glow Run Puebla 10K",
    day: "28",
    month: "Mar",
    year: "2027",
    location: "Parque Lineal Angelópolis, Puebla",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&q=80&w=1200",
    price: 380,
    category: "nocturna",
    distances: ["10K", "5K"],
    status: { label: "Early bird", tone: "early" },
    spotsTaken: 900,
    spotsTotal: 4000,
    elevation: "+65 m",
    description:
      "Una noche electrizante con la Estrella de Puebla iluminando el camino. Circuito cerrado, zonas de hidratación fluorescentes y un concierto de clausura exclusivo para corredores.",
    startTime: "19:30 hrs",
    deadline: "20 de Marzo, 2027 - 23:59",
    expo: {
      location: "Complejo Cultural Universitario BUAP",
      dates: "Viernes 27 y Sábado 28 de Marzo, 2027",
      hours: "10:00 hrs a 17:00 hrs",
    },
    distanceOptions: [
      {
        id: "10k",
        name: "10K Glow Competitivo",
        price: 420,
        spotsAvailable: 1500,
        maxSpots: 2000,
        elevationGain: "+65 m",
      },
      {
        id: "5k",
        name: "5K Glow Recreativo",
        price: 380,
        spotsAvailable: 1600,
        maxSpots: 2000,
        elevationGain: "+35 m",
      },
    ],
    elevationProfile: {
      gain: "+65 m",
      minAlt: "2,130 m",
      maxAlt: "2,165 m",
      difficulty: "Fácil",
      points: [2130, 2145, 2160, 2165, 2150, 2135, 2130],
    },
    routeDetails: {
      surface: "Asfalto y pista de tartán Angelópolis",
      hydrationPoints: 4,
      medicalStations: 2,
      pacers: ["05:00 min/km", "06:00 min/km"],
    },
    kitItems: DEFAULT_KIT_ITEMS,
    organizer: {
      name: "Run Puebla Series",
      verified: true,
    },
  },
];
