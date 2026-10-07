import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Zap, ArrowRight, Trophy, Timer, TrendingUp, Users, CheckCircle2, ChevronRight } from "lucide-react";

const MOCK_RACES = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México 2026",
    date: "15 Nov 2026",
    location: "CDMX, México",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    price: "$650 MXN",
    status: "Últimos Lugares",
    statusColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    participants: "15,000+",
  },
  {
    id: "2",
    title: "Trail Nocturno Desierto de los Leones",
    date: "03 Dic 2026",
    location: "Cuajimalpa, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=800",
    price: "$450 MXN",
    status: "Inscripciones Abiertas",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    participants: "2,000+",
  },
  {
    id: "3",
    title: "5K Neón Night Run",
    date: "20 Ene 2027",
    location: "Monterrey, N.L.",
    imageUrl: "https://images.unsplash.com/photo-1516445084931-15b67bb423e2?auto=format&fit=crop&q=80&w=800",
    price: "$350 MXN",
    status: "Early Bird",
    statusColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    participants: "5,000+",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* BACKGROUND GRID & GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent opacity-60 blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
        
        <div className="container mx-auto px-4 text-center max-w-5xl">
          
          <div className="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl shadow-2xl transition-transform hover:scale-105 cursor-pointer group">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
              Pisale 2.0 ya está disponible <ChevronRight className="inline w-4 h-4 ml-1 opacity-50" />
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[1.1] drop-shadow-2xl">
            Correr nunca había sido <br className="hidden md:block"/>
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-20 animate-pulse" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                tan extraordinario.
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Revolucionamos la gestión deportiva. Inscripciones instantáneas, boletos digitales y resultados en vivo. Todo en una sola plataforma diseñada para atletas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="relative group w-full sm:w-auto h-14 px-8 rounded-xl bg-white text-black hover:bg-zinc-200 text-lg font-bold transition-all">
              <span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <span className="relative flex items-center">
                Explorar Carreras <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white backdrop-blur-sm transition-all">
              Soy Organizador
            </Button>
          </div>
        </div>

        {/* GLOWING DASHBOARD PREVIEW MOCKUP */}
        <div className="mt-20 w-full max-w-6xl mx-auto px-4 perspective-1000">
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-2 transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-black/40">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="h-64 md:h-96 w-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40" />
          </div>
        </div>
      </section>

      {/* STATS SECTION - MINIMALIST */}
      <section className="relative z-20 py-24 border-y border-zinc-800/50 bg-zinc-950/30 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-zinc-800/50 text-center">
            {[
              { label: "Corredores Activos", value: "50,000+" },
              { label: "Carreras Exitosas", value: "320+" },
              { label: "Tiempo de Registro", value: "< 1 min" },
              { label: "Satisfacción", value: "99.9%" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4">
                <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARRERAS DESTACADAS */}
      <section className="relative z-20 container mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-400 bg-indigo-500/10">Eventos Top</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              Próximas Carreras
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl">Asegura tu lugar en los eventos deportivos más esperados de México. No te quedes fuera.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl px-6 h-12">
            Explorar calendario <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_RACES.map((race) => (
            <Card key={race.id} className="group overflow-hidden flex flex-col bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 rounded-2xl">
              <div className="relative h-64 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${race.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className={`font-bold backdrop-blur-md px-3 py-1 ${race.statusColor}`}>
                    {race.status}
                  </Badge>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2">
                    <span className="flex items-center text-xs font-semibold bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                      <Users className="w-3 h-3 mr-1.5" /> {race.participants}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pt-6 pb-2">
                <CardTitle className="text-2xl font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                  {race.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4 text-sm font-medium text-zinc-400 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-indigo-400" />
                    <span className="text-zinc-300">{race.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-zinc-300">{race.location}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between p-6 border-t border-zinc-800 bg-zinc-950/50">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Precio</span>
                  <span className="font-black text-2xl text-white tracking-tight">{race.price}</span>
                </div>
                <Button className="font-bold rounded-xl px-6 bg-white text-black hover:bg-zinc-200 transition-colors">
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}