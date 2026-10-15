"use client";

import { Shirt, Award, Timer, Droplets, Smartphone, Camera, CheckCircle2, Zap, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

const KIT_ITEMS = [
  {
    icon: Shirt,
    title: "Playera Técnica Pro Dry-Fit",
    badge: "Garantía de Talla",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    description: "Tejido microperforado ultra ligero de secado rápido. Reserva tu talla exacta en tiempo real al inscribirte sin sorpresas el día del evento.",
    gradient: "from-violet-500 to-indigo-600",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    metric: "110g Peso Pluma",
  },
  {
    icon: Award,
    title: "Medalla Conmemorativa 3D",
    badge: "Coleccionable",
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    description: "Aleación metálica de alta densidad con relieve tridimensional y listón sublimado premium. Diseños exclusivos grabados para cada ruta.",
    gradient: "from-amber-500 to-orange-600",
    imageUrl: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=600&auto=format&fit=crop",
    metric: "Fundición Maciza",
  },
  {
    icon: Timer,
    title: "Dorsal Oficial + Chip RFID / QR",
    badge: "Cronometraje Oficial",
    badgeColor: "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20",
    description: "Número impermeable en papel Tyvek resistente a lluvia y sudor con código QR criptográfico para check-in instantáneo y cronometraje de tapete.",
    gradient: "from-fuchsia-500 to-rose-600",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=600&auto=format&fit=crop",
    metric: "Precisión 1/1000s",
  },
  {
    icon: Droplets,
    title: "Abasto e Hidratación en Ruta",
    badge: "Cada 2.5 KM",
    badgeColor: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    description: "Puntos de abasto certificados con agua purificada y bebidas isotónicas frías, además de brigada médica de primeros auxilios y guardarropa.",
    gradient: "from-sky-500 to-cyan-600",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
    metric: "Isotónico & Agua",
  },
  {
    icon: Smartphone,
    title: "Live Tracking & Boleto Digital",
    badge: "App Móvil PWA",
    badgeColor: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    description: "Tus familiares siguen tu paso por cada parcial en vivo desde cualquier teléfono. Tu boleto vive en tu wallet digital con QR inviolable.",
    gradient: "from-violet-600 to-purple-600",
    imageUrl: "https://images.unsplash.com/photo-1510519138111-550da64d6736?q=80&w=600&auto=format&fit=crop",
    metric: "Paso en Tiempo Real",
  },
  {
    icon: Camera,
    title: "Diploma Finisher & Fotos HD",
    badge: "Instantáneo en Meta",
    badgeColor: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    description: "Cruzas la meta y tu certificado oficial con tiempo chip exacto está listo para descargar y compartir. Búsqueda automática de tus fotos por dorsal.",
    gradient: "from-emerald-500 to-teal-600",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=600&auto=format&fit=crop",
    metric: "Descarga en 1 Clic",
  },
];

export function KitOficialSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:py-32">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-linear-to-r from-violet-400/20 via-fuchsia-400/20 to-orange-400/20 blur-[130px]" />

      {/* Header de la sección */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-violet-700 backdrop-blur-md mb-4">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Experiencia de Carrera Completa
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
          Todo lo que incluye tu <span className="text-brand">Kit Oficial</span>.
        </h2>
        <p className="mt-5 text-base sm:text-xl font-medium text-slate-600 leading-relaxed">
          En Písale cada inscripción es una experiencia de primer nivel. Materiales premium, cronometraje de alta precisión y entrega ágil en 3 segundos sin filas.
        </p>
      </div>

      {/* Grid de 6 Tarjetas del Kit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {KIT_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-6 sm:p-7 shadow-[0_10px_35px_-10px_rgba(91,33,182,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(192,38,211,0.22)] flex flex-col justify-between"
            >
              {/* Imagen de fondo sutil con desenfoque suave al hacer hover */}
              <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-5 bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                {/* Badge flotante en la foto */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md bg-white/95 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Icono temático con gradiente */}
                <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg shadow-black/20" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${item.gradient} text-white`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                {/* Métrica clave */}
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="font-mono text-xs font-black tracking-wide text-white/95 drop-shadow-sm">
                    {item.metric}
                  </span>
                </div>
              </div>

              {/* Contenido textual */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 group-hover:text-violet-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm font-medium text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Indicador de calidad */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> 100% Certificado Písale
                </span>
                <span className="font-mono text-slate-400">0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner Comparativo Deportivo: Písale vs Modelos Antiguos */}
      <div className="mt-14 overflow-hidden rounded-[2.5rem] border border-violet-200/80 bg-linear-to-br from-violet-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md mb-4">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              La Diferencia Tecnológica de Písale
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              ¿Por qué los mejores clubes eligen Písale en lugar de las boleteras tradicionales?
            </h3>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Las plataformas convencionales tardan días en registrar tus depósitos y te hacen esperar en filas eternas para entregarte el kit. En Písale la tecnología trabaja para que tú solo disfrutes el asfalto o la montaña.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                Check-in móvil en 3s con escáner QR
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                Tallas de playera reservadas al momento
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                Resultados y diploma en vivo al cruzar la meta
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                Cesión y transferencia de boletos 100% digital
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-300 mb-1">Tiempo promedio de entrega de kit</p>
            <div className="font-display text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
              3.2 seg
            </div>
            <p className="mt-2 text-xs text-slate-300 max-w-xs">
              Con el escáner móvil de Písale, los voluntarios entregan hasta 800 kits por hora sin una sola fila detenida.
            </p>
            <Link
              href="/carreras"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-500 px-7 text-xs font-extrabold text-white shadow-lg shadow-fuchsia-500/25 hover:opacity-95 transition-all"
            >
              Explorar Carreras Disponibles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
