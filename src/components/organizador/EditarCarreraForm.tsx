"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarCarrera, type DistanceInput } from "@/app/actions/races";
import { KitBuilder } from "@/components/organizador/KitBuilder";
import { DEFAULT_KIT_SELECTION, sanitizeKitItems, type KitItem } from "@/lib/kits";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Building2,
  DollarSign,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  UploadCloud,
  Check,
  CheckCircle2,
  Route,
} from "lucide-react";
import Link from "next/link";

interface EditarCarreraFormProps {
  race: {
    id: string;
    title: string;
    category: "RUTA" | "TRAIL" | "NOCTURNA";
    date: Date | string;
    location: string;
    imageUrl?: string | null;
    startPoint?: string | null;
    endPoint?: string | null;
    surface?: string | null;
    kitItems?: any;
    distances: Array<{
      id?: string;
      name: string;
      price: number;
      maxParticipants: number;
    }>;
  };
}

export function EditarCarreraForm({ race }: EditarCarreraFormProps) {
  const router = useRouter();

  const formattedDate = new Date(race.date).toISOString().slice(0, 16);

  const [title, setTitle] = useState(race.title);
  const [category, setCategory] = useState<"RUTA" | "TRAIL" | "NOCTURNA">(
    (race.category as any) || "RUTA"
  );
  const [date, setDate] = useState(formattedDate);
  const [location, setLocation] = useState(race.location);
  const [startPoint, setStartPoint] = useState(race.startPoint || "");
  const [endPoint, setEndPoint] = useState(race.endPoint || "");
  const [surface, setSurface] = useState(
    race.surface || "Asfalto certificado"
  );
  const [imageUrl, setImageUrl] = useState(
    race.imageUrl || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200"
  );
  const [kitItems, setKitItems] = useState<KitItem[]>(() => {
    const parsed = sanitizeKitItems(race.kitItems);
    return parsed.length > 0 ? parsed : DEFAULT_KIT_SELECTION;
  });
  const [distances, setDistances] = useState<DistanceInput[]>(
    race.distances.length > 0
      ? race.distances.map((d) => ({
          name: d.name,
          price: d.price,
          maxParticipants: d.maxParticipants,
        }))
      : [{ name: "10K", price: 450, maxParticipants: 500 }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleDistanceChange = (
    index: number,
    field: keyof DistanceInput,
    value: string | number
  ) => {
    const updated = [...distances];
    updated[index] = { ...updated[index], [field]: value };
    setDistances(updated);
  };

  const handleAddDistance = () => {
    setDistances([...distances, { name: "5K", price: 400, maxParticipants: 300 }]);
  };

  const handleRemoveDistance = (index: number) => {
    if (distances.length <= 1) return;
    setDistances(distances.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await actualizarCarrera(race.id, {
      title,
      category,
      date,
      location,
      imageUrl,
      startPoint,
      endPoint,
      surface,
      distances,
      kitItems,
    });

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage(true);
      setTimeout(() => {
        router.push(`/carrera/${race.id}`);
        router.refresh();
      }, 1200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Información General */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-700 text-xs font-black">
              1
            </span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Datos Principales de la Carrera
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">ID: {race.id.slice(0, 8)}...</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nombre Oficial del Evento *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 focus:border-violet-600 focus:outline-none"
            >
              <option value="RUTA">Ruta Urbana (Asfalto)</option>
              <option value="TRAIL">Trail Running & Montaña</option>
              <option value="NOCTURNA">Carrera Nocturna (Neón)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fecha y Hora de Arranque *
            </label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Ubicación o Ciudad Sede *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Logística de Ruta */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-700 text-xs font-black">
            2
          </span>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Logística y Trazado de Ruta
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Punto de Salida
            </label>
            <input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              placeholder="ej. Monumento a la Revolución"
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Punto de Meta
            </label>
            <input
              type="text"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder="ej. Mismo punto (Circuito)"
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Superficie del Terreno
          </label>
          <input
            type="text"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Imagen de Portada */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-700 text-xs font-black">
            3
          </span>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Imagen de Portada
          </h2>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            URL de la Fotografía del Evento
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>

        {imageUrl && (
          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={imageUrl} alt="Vista previa" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* 4. Distancias, Precios y Cupos */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-700 text-xs font-black">
              4
            </span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Distancias, Precios y Cupos
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddDistance}
            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar Distancia
          </button>
        </div>

        <div className="space-y-3">
          {distances.map((dist, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5"
            >
              <div className="col-span-4">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Distancia
                </label>
                <input
                  type="text"
                  required
                  value={dist.name}
                  onChange={(e) => handleDistanceChange(idx, "name", e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>

              <div className="col-span-4">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Precio (MXN)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={dist.price}
                  onChange={(e) => handleDistanceChange(idx, "price", Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Cupo Máx.
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={dist.maxParticipants}
                  onChange={(e) =>
                    handleDistanceChange(idx, "maxParticipants", Number(e.target.value))
                  }
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>

              <div className="col-span-1 flex justify-center pt-4">
                <button
                  type="button"
                  disabled={distances.length <= 1}
                  onClick={() => handleRemoveDistance(idx)}
                  className="text-slate-400 hover:text-rose-500 disabled:opacity-20 transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Kit Oficial del Corredor */}
      <KitBuilder
        value={kitItems}
        onChange={setKitItems}
        stepLabel="4. Kit Oficial del Corredor"
      />

      {/* Mensajes de feedback */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ¡Cambios guardados con éxito! Redirigiendo a la convocatoria...
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          href={`/carrera/${race.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Cancelar y volver
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-shine inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-8 text-sm font-extrabold text-white shadow-xl shadow-fuchsia-500/25 hover:opacity-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Guardando cambios...</span>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Guardar y Actualizar Evento
            </>
          )}
        </button>
      </div>
    </form>
  );
}
