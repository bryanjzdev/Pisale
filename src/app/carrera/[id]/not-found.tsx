import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function CarreraNotFound() {
  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center selection:bg-fuchsia-200">
      <div className="relative z-10 max-w-md mx-auto">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-400 text-white shadow-xl shadow-fuchsia-500/25 mb-6">
          <Compass className="h-10 w-10 animate-spin-slow" />
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
          Error 404
        </span>

        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Carrera no encontrada
        </h1>

        <p className="mt-3 text-slate-500 font-medium text-base">
          El evento que estás buscando no existe, ha finalizado o cambió de dirección.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/#carreras"
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar todas las carreras
          </Link>
        </div>
      </div>
    </div>
  );
}
