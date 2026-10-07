import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Nombre de la marca */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tighter text-primary">
            PÍSALE<span className="text-muted-foreground">.</span>
          </span>
        </Link>

        {/* Botones de acción */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Soy Organizador
          </Button>
          <Button>Iniciar Sesión</Button>
        </div>
      </div>
    </nav>
  );
}