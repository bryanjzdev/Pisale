"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRace, type DistanceInput } from "@/app/actions/races";
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
  Mountain,
  Moon,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";

const IMAGE_PRESETS = [
  {
    category: "RUTA",
    label: "Ruta Urbana (Avenida)",
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    category: "TRAIL",
    label: "Trail & Montaña",
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    category: "NOCTURNA",
    label: "Carrera Nocturna",
    url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=1200",
  },
];

export function CrearCarreraForm({
  defaultOrganizerName,
}: {
  defaultOrganizerName: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"RUTA" | "TRAIL" | "NOCTURNA">("RUTA");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("06:30 hrs");
  const [deadline, setDeadline] = useState("3 días antes del evento");
  const [location, setLocation] = useState("");
  const [organizationName, setOrganizationName] = useState(defaultOrganizerName);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);

  // Distancias dinámicas
  const [distances, setDistances] = useState<DistanceInput[]>([
    { name: "10K", price: 450, maxParticipants: 500 },
    { name: "21K", price: 650, maxParticipants: 1000 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manejar cambio en distancias
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
    setDistances([...distances, { name: "5K", price: 350, maxParticipants: 300 }]);
  };

  const handleRemoveDistance = (index: number) => {
    if (distances.length <= 1) return;
    setDistances(distances.filter((_, i) => i !== index));
  };

  // Cálculos de proyección
  const totalCapacity = distances.reduce((acc, d) => acc + (Number(d.maxParticipants) || 0), 0);
  const totalRevenue = distances.reduce((acc, d) => acc + (Number(d.price) || 0) * (Number(d.maxParticipants) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createRace({
        title,
        category,
        date,
        location,
        imageUrl,
        description,
        startTime,
        deadline,
        organizationName,
        distances,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res?.raceId) {
        router.push(`/carrera/${res.raceId}`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Categoría */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-4">
          1. Tipo de Carrera
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setCategory("RUTA");
              setImageUrl(IMAGE_PRESETS[0].url);
            }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              category === "RUTA"
                ? "border-violet-600 bg-violet-50/70 shadow-md shadow-violet-500/10"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Ruta Urbana</span>
              <span className="text-xs text-slate-500">Pavimento y ciudad</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory("TRAIL");
              setImageUrl(IMAGE_PRESETS[1].url);
            }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              category === "TRAIL"
                ? "border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-500/10"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Trail Running</span>
              <span className="text-xs text-slate-500">Montaña y senderos</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory("NOCTURNA");
              setImageUrl(IMAGE_PRESETS[2].url);
            }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              category === "NOCTURNA"
                ? "border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Nocturna</span>
              <span className="text-xs text-slate-500">Luces y noche</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Información General */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-6">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
          2. Datos Generales del Evento
        </label>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Nombre Oficial de la Carrera *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Maratón de la Primavera CDMX 2026"
            className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Ciudad o Ubicación *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="ej. Bosque de Chapultepec, CDMX"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Fecha de la Carrera *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Horario de Arranque
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="ej. 06:30 hrs"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Organizador o Club Anfitrión
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="ej. Runners México Oficial"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Descripción de la Carrera
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe la ruta, beneficios del kit, medalla conmemorativa o detalles para los corredores..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* 3. Imagen de Portada */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-4">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
          3. Imagen de Portada
        </label>

        {/* Previsualización */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <span className="text-white text-xs font-bold drop-shadow-md">
              Vista previa del banner oficial
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600">
            Presets sugeridos o pega tu propia URL:
          </label>
          <div className="flex flex-wrap gap-2">
            {IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  imageUrl === preset.url
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <ImageIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-11 pl-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-mono text-slate-700 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Distancias, Precios y Cupos */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              4. Distancias, Precios y Cupos
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Los corredores podrán elegir su distancia en la pasarela de pago.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDistance}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3.5 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir Distancia
          </button>
        </div>

        <div className="space-y-3">
          {distances.map((dist, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 items-center rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5"
            >
              <div className="col-span-4 sm:col-span-3">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Distancia
                </label>
                <input
                  type="text"
                  required
                  value={dist.name}
                  onChange={(e) => handleDistanceChange(idx, "name", e.target.value)}
                  placeholder="ej. 10K"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>

              <div className="col-span-4 sm:col-span-4">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Precio (MXN)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={dist.price}
                    onChange={(e) => handleDistanceChange(idx, "price", Number(e.target.value))}
                    className="w-full h-10 pl-6 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-3 sm:col-span-4">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Cupo Máx.
                </label>
                <div className="relative">
                  <Users className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min={1}
                    value={dist.maxParticipants}
                    onChange={(e) => handleDistanceChange(idx, "maxParticipants", Number(e.target.value))}
                    className="w-full h-10 pl-8 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>
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

        {/* Resumen Financiero */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-950 p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 block">
              Proyección de Evento
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black">${totalRevenue.toLocaleString("es-MX")}</span>
              <span className="text-xs font-bold text-violet-300">MXN Recaudación Máx.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-violet-200">
            <div>
              <span className="block font-bold text-white text-base">{totalCapacity}</span>
              <span>Corredores totales</span>
            </div>
            <div>
              <span className="block font-bold text-emerald-400 text-base">Stripe & OXXO</span>
              <span>Cobros directos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-shine flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-base font-extrabold text-white shadow-xl shadow-fuchsia-500/25 transition-all hover:opacity-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Publicando evento en Písale...
            </span>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Publicar Carrera Oficialmente
              <ArrowRight className="h-5 w-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
