import { Shirt, Medal, Timer, Droplets, ShieldCheck, ShoppingBag, CheckCircle2, Sparkles } from "lucide-react";
import type { KitItem } from "@/lib/mock-races";

const ICON_MAP = {
  shirt: Shirt,
  medal: Medal,
  timer: Timer,
  droplet: Droplets,
  shield: ShieldCheck,
  bag: ShoppingBag,
};

export function RunnerKitGrid({ items }: { items?: KitItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 mb-2">
            <Sparkles className="h-3 w-3" /> Kit Oficial del Corredor
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todo lo que incluye tu inscripción
          </h2>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 rounded-full px-3 py-1 self-start sm:self-auto">
          6 beneficios garantizados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] || Shirt;
          return (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                item.highlight
                  ? "border-violet-200/80 bg-linear-to-br from-violet-50/60 via-fuchsia-50/30 to-white shadow-sm"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              {item.highlight && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-700 bg-violet-100/90 rounded-full px-2 py-0.5">
                    Estelar
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                    item.highlight
                      ? "bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-violet-500/25"
                      : "bg-slate-100 text-slate-700 group-hover:bg-violet-100 group-hover:text-violet-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-violet-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Incluido en el boleto</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
