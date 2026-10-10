import Link from "next/link";
import { ArrowLeft, Flame, Sparkles } from "lucide-react";
import { loginWithGoogle, loginWithApple } from "@/app/actions/auth";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#fbfaff] flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden selection:bg-fuchsia-200 selection:text-fuchsia-900">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[600px] h-[600px] bg-orange-300/30 rounded-full blur-[130px] opacity-70" />
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="group inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Volver al inicio</span>
        </Link>
        
        <div className="flex justify-center">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 via-fuchsia-500 to-violet-600 text-white shadow-xl shadow-fuchsia-500/30">
            <Flame className="h-7 w-7" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40" />
          </span>
        </div>
        
        <h2 className="mt-6 text-center font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-bold text-violet-600 hover:text-violet-500 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        {/* Glassmorphism Card */}
        <div className="border-beam relative bg-white/70 py-10 px-6 shadow-[0_20px_60px_-15px_rgba(91,33,182,0.15)] backdrop-blur-2xl rounded-3xl border border-white/80 sm:px-12">
          
          <form className="space-y-5" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nombre completo
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Juan Pérez"
                  className="block w-full h-12 rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 sm:text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@correo.com"
                  className="block w-full h-12 rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 sm:text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Mínimo 8 caracteres"
                  className="block w-full h-12 rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-shine group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 via-fuchsia-600 to-violet-600 px-8 text-sm font-bold text-white shadow-[0_8px_25px_-8px_rgba(192,38,211,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_35px_-8px_rgba(192,38,211,0.6)]"
              >
                Crear cuenta
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/80 px-4 font-semibold text-slate-500 backdrop-blur-md rounded-full">
                  O regístrate con
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1">
              <form action={loginWithGoogle}>
                <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>
              </form>
            </div>
            
            <p className="mt-6 text-center text-[10px] text-slate-400">
              Al registrarte, aceptas nuestros <Link href="#" className="underline">Términos de servicio</Link> y <Link href="#" className="underline">Política de privacidad</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
