import type { Metadata } from "next";
// Geist ya debe estar importado arriba si lo seleccionaste en la instalación
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Písale | Inscripciones a carreras sin fricción",
  description: "La plataforma más rápida para gestionar tus carreras y encontrar tu siguiente reto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        {/* El main tomará el resto del espacio disponible */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}