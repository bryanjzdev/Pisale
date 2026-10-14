"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import type { Race, DistanceOption } from "@/lib/mock-races";
import { createCheckoutSession } from "@/app/actions/checkout";

export function RaceActionCard({
  race,
  isLoggedIn,
  userEmail,
}: {
  race: Race;
  isLoggedIn: boolean;
  userEmail?: string | null;
}) {
  const router = useRouter();

  // Distancia seleccionada por defecto
  const defaultDist =
    race.distanceOptions && race.distanceOptions.length > 0
      ? race.distanceOptions[0]
      : {
          id: "default",
          name: race.distances[0] || "General",
          price: race.price,
          spotsAvailable: Math.max(0, race.spotsTotal - race.spotsTaken),
          maxSpots: race.spotsTotal,
        };

  const [selectedDistance, setSelectedDistance] = useState<DistanceOption | { id: string; name: string; price: number; spotsAvailable: number; maxSpots: number }>(
    defaultDist
  );

  // Estados para modal de confirmación si está logueado
  const [modalOpen, setModalOpen] = useState(false);
  const [shirtSize, setShirtSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const spotsTotal = race.spotsTotal || 1000;
  const spotsTaken = race.spotsTaken || 0;
  const percent = Math.min(100, Math.round((spotsTaken / spotsTotal) * 100));
  const isAlmostFull = percent >= 85;

  const handleAction = () => {
    if (!isLoggedIn) {
      // Redirigir a login con el callbackUrl para volver tras autenticarse
      router.push(`/login?callbackUrl=/carrera/${race.id}`);
      return;
    }
    // Usuario autenticado: abrir flujo de registro/pago
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await createCheckoutSession({
        raceId: race.id,
        distanceName: selectedDistance.name,
        price: selectedDistance.price,
        shirtSize: shirtSize,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al procesar el pago");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="sticky top-28 rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(91,33,182,0.18)] backdrop-blur-2xl">
        {/* Encabezado de precio */}
        <div className="mb-6 border-b border-dashed border-slate-200 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inscripción individual
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <Sparkles className="h-3 w-3" /> Precio oficial
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              ${selectedDistance.price.toLocaleString("es-MX")}
            </span>
            <span className="text-sm font-bold text-slate-500">MXN</span>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Incluye kit completo del corredor e impuestos aplicables.
          </p>
        </div>

        {/* Selector interactivo de Distancia */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5">
            Selecciona tu distancia:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(race.distanceOptions || race.distances.map((d) => ({
              id: d,
              name: d,
              price: race.price,
              spotsAvailable: 500,
              maxSpots: 1000,
            }))).map((opt) => {
              const active = selectedDistance.name === opt.name;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDistance(opt)}
                  className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-violet-600 bg-violet-50/70 text-violet-950 shadow-sm ring-2 ring-violet-500/20"
                      : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-display text-base font-bold">{opt.name}</span>
                    {active && <Check className="h-4 w-4 text-violet-600" />}
                  </div>
                  <span className="mt-1 text-xs font-bold text-slate-500">
                    ${opt.price.toLocaleString("es-MX")} MXN
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cupos disponibles */}
        <div className="mb-6 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Users className="h-3.5 w-3.5 text-violet-600" />
              Cupos vendidos
            </span>
            <span className={isAlmostFull ? "text-rose-600 font-extrabold" : "text-slate-800"}>
              {percent}% lleno ({spotsTaken.toLocaleString("es-MX")} / {spotsTotal.toLocaleString("es-MX")})
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isAlmostFull
                  ? "bg-linear-to-r from-rose-500 via-amber-500 to-rose-600"
                  : "bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-400"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {isAlmostFull && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-600">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              ¡Últimos lugares disponibles para este evento!
            </p>
          )}
        </div>

        {/* Fecha límite y horario */}
        <div className="mb-6 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-fuchsia-600" /> Cierre de registro:
            </span>
            <span className="font-bold text-slate-900">{race.deadline || "3 días antes"}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 text-violet-600" /> Horario de arranque:
            </span>
            <span className="font-bold text-slate-900">{race.startTime || "07:00 hrs"}</span>
          </div>
        </div>

        {/* Botón de acción llamativo */}
        <button
          id="btn-inscribirme-ahora"
          type="button"
          onClick={handleAction}
          className="btn-shine relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-base font-extrabold text-white shadow-[0_12px_35px_-8px_rgba(192,38,211,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-8px_rgba(192,38,211,0.7)] active:scale-[0.98]"
        >
          <span>Inscribirme Ahora</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {!isLoggedIn && (
          <p className="mt-2.5 text-center text-[11px] font-medium text-slate-400">
            Te pediremos iniciar sesión para guardar tu registro y boleto digital.
          </p>
        )}

        {/* Garantías de seguridad */}
        <div className="mt-6 border-t border-slate-100 pt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <QrCode className="h-4 w-4 text-violet-600" />
            <span>Boleto digital con código QR instantáneo</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Pago seguro garantizado con encriptación SSL</span>
          </div>
        </div>
      </div>

      {/* Modal de Inscripción / Flujo de Pago */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setModalOpen(false);
                setRegisteredSuccess(false);
              }}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!registeredSuccess ? (
              <div>
                <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600">
                  <Sparkles className="h-4 w-4" /> Finalizar inscripción
                </div>

                <h3 className="font-display text-2xl font-extrabold text-slate-900">
                  {race.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Corredor: <span className="font-bold text-slate-800">{userEmail}</span>
                </p>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Distancia elegida:</span>
                    <span className="font-bold text-slate-900">{selectedDistance.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fecha:</span>
                    <span className="font-bold text-slate-900">{race.day} {race.month} {race.year}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total a pagar:</span>
                    <span className="font-display text-xl font-extrabold text-violet-700">
                      ${selectedDistance.price.toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                </div>

                {/* Selección de talla de playera */}
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Talla de playera oficial:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["S", "M", "L", "XL"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setShirtSize(size)}
                        className={`h-11 rounded-xl font-bold text-sm transition-all ${
                          shirtSize === size
                            ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <div className="mt-7">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmRegistration}
                    className="btn-shine flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-base font-extrabold text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Procesando inscripción...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Confirmar y Pagar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-display text-3xl font-extrabold text-slate-900">
                  ¡Inscripción Exitosa!
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  Tu lugar para <strong>{race.title} ({selectedDistance.name})</strong> está confirmado. Tu boleto digital con código QR ya está en tu dashboard.
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
                  >
                    Ver mi Boleto en el Dashboard
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="h-11 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
