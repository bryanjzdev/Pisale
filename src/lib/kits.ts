import type { KitItem } from "@/lib/mock-races";

export type { KitItem };

export const KIT_ICONS = ["shirt", "medal", "timer", "droplet", "shield", "bag"] as const;
export type KitIcon = (typeof KIT_ICONS)[number];

export const KIT_ICON_LABELS: Record<KitIcon, string> = {
  shirt: "Playera",
  medal: "Medalla",
  timer: "Chip / Dorsal",
  droplet: "Hidratación",
  shield: "Seguro / Servicio",
  bag: "Morral / Extra",
};

/** Catálogo de artículos frecuentes que el organizador puede activar con un clic. */
export const KIT_PRESETS: KitItem[] = [
  {
    id: "preset-shirt",
    title: "Playera Conmemorativa Dry-Fit",
    description: "Tela técnica de secado rápido. El corredor elige su talla al inscribirse.",
    icon: "shirt",
    highlight: true,
  },
  {
    id: "preset-medal",
    title: "Medalla de Finalista",
    description: "Medalla conmemorativa entregada al cruzar la meta.",
    icon: "medal",
    highlight: true,
  },
  {
    id: "preset-bib",
    title: "Número de Corredor con Chip",
    description: "Dorsal oficial con chip de cronometraje y código QR para entrega de kit.",
    icon: "timer",
  },
  {
    id: "preset-water",
    title: "Hidratación en Ruta y Meta",
    description: "Puntos de abasto con agua y bebida isotónica durante el recorrido.",
    icon: "droplet",
  },
  {
    id: "preset-insurance",
    title: "Seguro de Corredor y Servicio Médico",
    description: "Cobertura durante el evento y brigada de primeros auxilios.",
    icon: "shield",
  },
  {
    id: "preset-bag",
    title: "Morral Oficial con Productos de Patrocinadores",
    description: "Bolsa del evento con muestras y cupones de marcas aliadas.",
    icon: "bag",
  },
];

export const DEFAULT_KIT_SELECTION: KitItem[] = KIT_PRESETS.slice(0, 4);

const MAX_ITEMS = 12;
const MAX_TITLE = 80;
const MAX_DESC = 220;

/**
 * Valida y normaliza la lista de artículos del kit que llega del cliente.
 * Nunca confiar en el payload: se recorta, se limita y se fuerza el ícono a la lista blanca.
 */
export function sanitizeKitItems(input: unknown): KitItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .slice(0, MAX_ITEMS)
    .map((raw, idx): KitItem | null => {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as Record<string, unknown>;
      const title = typeof r.title === "string" ? r.title.trim().slice(0, MAX_TITLE) : "";
      if (title.length < 2) return null;
      const description =
        typeof r.description === "string" ? r.description.trim().slice(0, MAX_DESC) : "";
      const icon = KIT_ICONS.includes(r.icon as KitIcon) ? (r.icon as KitIcon) : "bag";
      return {
        id: `kit-${idx + 1}`,
        title,
        description,
        icon,
        highlight: r.highlight === true,
      };
    })
    .filter((x): x is KitItem => x !== null);
}

/** Lee el JSON guardado en BD de forma segura. */
export function parseStoredKitItems(value: unknown): KitItem[] | undefined {
  const items = sanitizeKitItems(value);
  return items.length > 0 ? items : undefined;
}
