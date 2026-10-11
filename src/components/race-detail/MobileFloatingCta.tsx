"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Race } from "@/lib/mock-races";

export function MobileFloatingCta({
  race,
  isLoggedIn,
}: {
  race: Race;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  const handleAction = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/carrera/${race.id}`);
      return;
    }
    // Scroll hacia el selector o acción
    const el = document.getElementById("btn-inscribirme-ahora");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      el.click();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-slate-200/80 bg-white/95 p-3.5 backdrop-blur-xl shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Desde
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-extrabold text-slate-900">
              ${race.price.toLocaleString("es-MX")}
            </span>
            <span className="text-[11px] font-bold text-slate-500">MXN</span>
          </div>
        </div>

        <button
          onClick={handleAction}
          className="btn-shine flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 active:scale-95"
        >
          <span>Inscribirme Ahora</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
