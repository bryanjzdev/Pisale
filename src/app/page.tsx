import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Zap, ArrowRight } from "lucide-react";

const MOCK_RACES = [
  {
    id: "1",
    title: "Medio Maratón Ciudad de México 2026",
    date: "15 Nov 2026",
    location: "CDMX, México",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    price: "$650 MXN",
    status: "Últimos Lugares",
    statusColor: "bg-destructive text-destructive-foreground hover:bg-destructive",
  },
  {
    id: "2",
    title: "Trail Nocturno Desierto de los Leones",
    date: "03 Dic 2026",
    location: "Cuajimalpa, CDMX",
    imageUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=800",
    price: "$450 MXN",
    status: "Inscripciones Abiertas",
    statusColor: "bg-primary text-primary-foreground hover:bg-primary",
  },
  {
    id: "3",
    title: "5K Neón Night Run",
    date: "20 Ene 2027",
    location: "Monterrey, N.L.",
    imageUrl: "https://images.unsplash.com/photo-1516445084931-15b67bb423e2?auto=format&fit=crop&q=80&w=800",
    price: "$350 MXN",
    status: "Early Bird",
    statusColor: "bg-purple-500 text-white hover:bg-purple-600",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section con Overlay Oscuro */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary backdrop-blur-sm">
            <Zap className="w-3 h-3 mr-2 fill-primary" />
            La nueva era de las carreras
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground drop-shadow-sm">
            Supera tu límite.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Nosotros hacemos el resto.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-medium">
            Inscripciones en segundos, resultados en tiempo real y boletos directo en tu wallet. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-md font-bold">
              Explorar Eventos <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Grid de Carreras */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight">Próximas Carreras</h2>
          <Button variant="ghost" className="hidden sm:flex">Ver calendario completo</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_RACES.map((race) => (
            <Card key={race.id} className="group overflow-hidden flex flex-col border-muted/50 bg-muted/10 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
              <div className="relative h-56 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${race.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <Badge className={`absolute top-4 right-4 font-bold ${race.statusColor}`}>
                  {race.status}
                </Badge>
              </div>
              
              <CardHeader className="relative -mt-6 rounded-t-2xl bg-card pt-6">
                <CardTitle className="text-xl font-bold leading-tight line-clamp-2">
                  {race.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-3 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-muted">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span>{race.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-muted">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>{race.location}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between border-t p-6 bg-muted/5">
                <span className="font-black text-2xl tracking-tight">{race.price}</span>
                <Button className="font-bold shadow-md">Inscribirme</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}