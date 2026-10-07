import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

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
    <html lang="es" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#fbfaff]">
        <Navbar />
        {/* El main tomará el resto del espacio disponible */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}