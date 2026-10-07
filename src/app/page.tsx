import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Zap, ArrowRight, Trophy, Timer, TrendingUp, Users } from "lucide-react";

const MOCK_RACES = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México 2026",
    date: "15 Nov 2026",
    location: "CDMX, México",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    price: "$650 MXN",
    status: "Últimos Lugares",
    statusColor: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    participants: "15k+",
  },
  {
    id: "2",
    title: "Trail Nocturno Desierto de los Leones",
    date: "03 Dic 2026",
    location: "Cuajimalpa, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=800",
    price: "$450 MXN",
    status: "Inscripciones Abiertas",
    statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
    participants: "2k+",
  },
  {
    id: "3",
    title: "5K Neón Night Run",
    date: "20 Ene 2027",
    location: "Monterrey, N.L.",
    imageUrl: "https://images.unsplash.com/photo-1516445084931-15b67bb423e2?auto=format&fit=crop&q=80&w=800",
    price: "$350 MXN",
    status: "Early Bird",
    statusColor: "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
    participants: "5k+",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-primary/30">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Gradients (Blobs) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
        
        {/* Dark Overlay over the background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950" />
        
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <div className="inline-flex items-center justify-center p-1 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Badge variant="outline" className="px-4 py-1.5 border-none text-primary bg-transparent text-sm font-semibold tracking-wide">
              <Zap className="w-4 h-4 mr-2 fill-primary animate-bounce" />
              La plataforma #1 de México
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white drop-shadow-2xl leading-[1.1]">
            Supera tu límite.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary bg-300% animate-gradient">
              Nosotros hacemos el resto.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Inscripciones en segundos, resultados en tiempo real y tus boletos directo en tu wallet. Únete a la revolución del running.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.7)] transition-all duration-300 hover:-translate-y-1">
              Explorar Eventos <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-full border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all duration-300">
              Crear mi cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-20 -mt-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
          {[
            { icon: Users, label: "Corredores Activos", value: "50K+" },
            { icon: Trophy, label: "Carreras Exitosas", value: "320+" },
            { icon: Timer, label: "Tiempo de Inscripción", value: "< 1 min" },
            { icon: TrendingUp, label: "Crecimiento", value: "200%" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4 text-center group">
              <stat.icon className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARRERAS DESTACADAS */}
      <section className="container mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Próximas Carreras
            </h2>
            <p className="text-zinc-400 text-lg">Descubre los eventos más esperados y asegura tu lugar antes de que se agoten.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10 rounded-full px-6">
            Ver calendario completo <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_RACES.map((race) => (
            <Card key={race.id} className="group overflow-hidden flex flex-col bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 rounded-3xl">
              <div className="relative h-64 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${race.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <Badge variant="outline" className={`absolute top-4 right-4 font-bold backdrop-blur-md ${race.statusColor}`}>
                  {race.status}
                </Badge>
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md">
                    <Users className="w-3 h-3 mr-1" /> {race.participants}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="relative bg-transparent pt-6 pb-2">
                <CardTitle className="text-2xl font-bold leading-tight text-white group-hover:text-primary transition-colors duration-300">
                  {race.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4 text-sm font-medium text-zinc-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>{race.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 truncate">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="truncate">{race.location}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between p-6 pt-2 border-t border-zinc-800/50 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Precio desde</span>
                  <span className="font-black text-3xl tracking-tight text-white">{race.price}</span>
                </div>
                <Button className="font-bold rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                  Inscribirme
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}