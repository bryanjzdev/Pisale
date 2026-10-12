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
  UploadCloud,
  Check,
  Navigation,
  Flag,
  Droplets,
  Route,
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
  const [startPoint, setStartPoint] = useState("");
  const [isCircuit, setIsCircuit] = useState(true);
  const [endPoint, setEndPoint] = useState("");
  const [surface, setSurface] = useState<"Asfalto certificado" | "Senderos y Montaña" | "Mixto (Asfalto y Terracería)">("Asfalto certificado");
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "presets" | "url">("upload");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Distancias dinámicas
  const [distances, setDistances] = useState<DistanceInput[]>([
    { name: "10K", price: 450, maxParticipants: 500 },
    { name: "21K", price: 650, maxParticipants: 1000 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadedFileName(file.name);

    // Previsualización instantánea local
    const localPreview = URL.createObjectURL(file);
    setImageUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        // Fallback a Base64 si el backend devolvió error
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback a Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

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
        startPoint: startPoint || location,
        endPoint: isCircuit ? "Mismo punto de salida (Circuito cerrado)" : (endPoint || location),
        surface,
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

      {/* 3. Trazado del Recorrido (Salida, Meta y Terreno) */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 mb-2">
            <Navigation className="h-3.5 w-3.5" /> Ruta Inteligente Písale
          </div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            3. Trazado del Recorrido (Salida y Meta)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Solo indica el punto de inicio y fin. Písale calculará automáticamente los puestos oficiales de hidratación (cada 2.5 km), la altimetría y el mapa interactivo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Punto de Salida / Arranque
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-violet-600" />
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="ej. Zócalo Municipal / Explanada de las Pirámides"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Lugar exacto de reunión y arco de salida.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Modalidad del Circuito
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCircuit(true)}
                className={`h-12 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  isCircuit
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                🔄 Circuito Cerrado
              </button>
              <button
                type="button"
                onClick={() => setIsCircuit(false)}
                className={`h-12 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  !isCircuit
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                🏁 Punto a Punto
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isCircuit ? "Salida y meta en el mismo lugar" : "Salida y meta en lugares diferentes"}
            </p>
          </div>
        </div>

        {!isCircuit && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Punto de Meta / Llegada
            </label>
            <div className="relative">
              <Flag className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600" />
              <input
                type="text"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="ej. Estadio Olímpico / Plaza Juárez"
                className="w-full h-12 pl-10 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Tipo de Superficie */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Tipo de Superficie / Terreno
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "Asfalto certificado",
                label: "Asfalto / Calle",
                desc: "Pavimento urbano rápido",
                icon: Route,
              },
              {
                id: "Senderos y Montaña",
                label: "Trail & Montaña",
                desc: "Terracería, piedra y desnivel",
                icon: Mountain,
              },
              {
                id: "Mixto (Asfalto y Terracería)",
                label: "Mixto Urbano/Trail",
                desc: "Calle y terracería combinadas",
                icon: Navigation,
              },
            ].map((surf) => (
              <button
                key={surf.id}
                type="button"
                onClick={() => setSurface(surf.id as any)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  surface === surf.id
                    ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-xl ${surface === surf.id ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <surf.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{surf.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{surf.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Badge de Automatización Inteligente */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white">
          <div className="flex items-center gap-2.5">
            <Droplets className="h-4 w-4 text-sky-400 shrink-0" />
            <p className="text-xs font-medium text-slate-300">
              <strong className="text-white">Puestos de Hidratación automáticos:</strong> 1 estación oficial cada 2.5 km calculada según la distancia configurada.
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Reglamento Oficial World Athletics
          </span>
        </div>
      </div>

      {/* 4. Imagen de Portada */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            4. Imagen de Portada
          </label>

          {/* Selector de modo */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setImageSourceMode("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                imageSourceMode === "upload"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Subir de mi PC
            </button>
            <button
              type="button"
              onClick={() => setImageSourceMode("presets")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                imageSourceMode === "presets"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Presets
            </button>
            <button
              type="button"
              onClick={() => setImageSourceMode("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                imageSourceMode === "url"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              URL Externa
            </button>
          </div>
        </div>

        {/* Modo 1: Carga desde el ordenador */}
        {imageSourceMode === "upload" && (
          <div className="relative">
            <label
              htmlFor="cover-file-upload"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-violet-200 rounded-2xl bg-violet-50/40 hover:bg-violet-50 hover:border-violet-400 transition-all cursor-pointer group text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="h-6 w-6" />
              </div>
              <span className="text-sm font-extrabold text-slate-800 block">
                {isUploadingImage ? "Cargando imagen..." : "Haz clic o arrastra una foto desde tu ordenador"}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Soporta archivos JPG, PNG, WEBP de alta resolución
              </span>

              {uploadedFileName && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Archivo cargado: {uploadedFileName}
                </div>
              )}
            </label>
            <input
              id="cover-file-upload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Modo 2: Presets sugeridos */}
        {imageSourceMode === "presets" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">
              Selecciona una fotografía profesional precargada:
            </label>
            <div className="flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    imageUrl === preset.url
                      ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modo 3: Enlace URL */}
        {imageSourceMode === "url" && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Pega el enlace público de la imagen:
            </label>
            <div className="relative">
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
        )}

        {/* Previsualización en vivo */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Vista previa del banner de carrera
          </span>
          <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-4 sm:p-5">
              <div>
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                  {category}
                </span>
                <h4 className="text-white text-base sm:text-lg font-black drop-shadow-md">
                  {title || "Título de tu Carrera"}
                </h4>
                <p className="text-white/80 text-xs font-medium drop-shadow-sm">
                  {location || "Ciudad / Sede del evento"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Distancias, Precios y Cupos */}
      <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              5. Distancias, Precios y Cupos
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
