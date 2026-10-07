import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Zap, ArrowRight, Trophy, Timer, TrendingUp, Users, ChevronRight } from "lucide-react";

const MOCK_RACES = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México 2026",
    date: "15 Nov 2026",
    location: "CDMX, México",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    price: "$650 MXN",
    status: "Últimos Lugares",
    statusColor: "bg-rose-100 text-rose-600 border-rose-200",
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
    statusColor: "bg-teal-100 text-teal-700 border-teal-200",
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
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    participants: "5,000+",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* BACKGROUND ELEMENTS - Light & Clean */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-cyan-400/10 rounded-full blur-[150px] mix-blend-multiply" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-16">
        
        <div className="container mx-auto px-4 text-center max-w-5xl">
          
          <div className="inline-flex items-center justify-center px-5 py-2 mb-8 rounded-full bg-white/60 border border-slate-200/60 backdrop-blur-md shadow-sm transition-transform hover:scale-105 cursor-pointer group">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-3 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
              Pisale 2.0 ya está disponible <ChevronRight className="inline w-4 h-4 ml-1 opacity-60" />
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Correr nunca había sido <br className="hidden md:block"/>
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
                tan extraordinario.
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Revolucionamos la gestión deportiva. Inscripciones instantáneas, boletos digitales y resultados en vivo. Todo en una sola plataforma diseñada para atletas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_40px_rgb(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              Explorar Carreras <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl border-slate-300 bg-white/50 hover:bg-white text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5">
              Soy Organizador
            </Button>
          </div>
        </div>

        {/* MOCKUP IMAGE - Light & Premium */}
        <div className="mt-16 w-full max-w-5xl mx-auto px-4">
          <div className="relative rounded-2xl border border-slate-200/80 bg-white/40 backdrop-blur-xl shadow-2xl p-2 overflow-hidden ring-1 ring-black/5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/50 bg-white/60">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-64 md:h-96 w-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-20 py-20 bg-white/60 border-y border-slate-200 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-slate-200 text-center">
            {[
              { icon: Users, label: "Corredores Activos", value: "50,000+" },
              { icon: Trophy, label: "Carreras Exitosas", value: "320+" },
              { icon: Timer, label: "Tiempo de Registro", value: "< 1 min" },
              { icon: TrendingUp, label: "Satisfacción", value: "99.9%" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4">
                <stat.icon className="w-8 h-8 text-blue-600 mb-3 opacity-80" />
                <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARRERAS DESTACADAS */}
      <section className="relative z-20 container mx-auto px-4 py-28">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 rounded-full font-bold">
              Eventos Top
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Próximas Carreras
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium">Asegura tu lugar en los eventos deportivos más esperados de México. No te quedes fuera.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-6 h-12 font-bold">
            Explorar calendario <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_RACES.map((race) => (
            <Card key={race.id} className="group overflow-hidden flex flex-col bg-white border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl">
              <div className="relative h-60 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${race.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className={`font-bold backdrop-blur-md px-3 py-1 shadow-sm ${race.statusColor}`}>
                    {race.status}
                  </Badge>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2">
                    <span className="flex items-center text-xs font-semibold bg-white/90 text-slate-900 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                      <Users className="w-3 h-3 mr-1.5 text-blue-600" /> {race.participants}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pt-6 pb-2">
                <CardTitle className="text-2xl font-black leading-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {race.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4 text-sm font-medium text-slate-600 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-semibold">{race.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-semibold">{race.location}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Precio</span>
                  <span className="font-black text-2xl text-slate-900 tracking-tight">{race.price}</span>
                </div>
                <Button className="font-bold rounded-xl px-6 bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-md">
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