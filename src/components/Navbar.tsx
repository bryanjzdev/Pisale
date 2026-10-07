import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, ChevronDown } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        
        {/* Logo / Nombre de la marca */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Flame className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            PÍSALE<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Enlaces de Navegación (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            Carreras <ChevronDown className="h-4 w-4 opacity-50" />
          </Link>
          <Link href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Resultados
          </Link>
          <Link href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Organizadores
          </Link>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-11 px-5">
            Crear Evento
          </Button>
          <Button className="h-11 px-6 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}