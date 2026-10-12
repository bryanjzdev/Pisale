"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Search,
  Sparkles,
  Shirt,
  User,
  Hash,
  Trophy,
  Loader2,
  RefreshCw,
  Volume2,
} from "lucide-react";
import { verificarYEntregarKit, type CheckInResult } from "@/app/actions/checkin";

export function CheckInScannerClient() {
  const [manualFolio, setManualFolio] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<Array<NonNullable<CheckInResult["registration"]>>>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedCodeRef = useRef<string>("");
  const isProcessingRef = useRef(false);

  // Reproducir sonido sutil de confirmación
  const playBeep = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(success ? 880 : 320, ctx.currentTime); // 880Hz éxito, 320Hz advertencia
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio no soportado o bloqueado
    }
  };

  const processCode = async (code: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    setCameraError(null);

    try {
      const res = await verificarYEntregarKit(code);
      setLastResult(res);
      playBeep(res.success);

      if (res.registration && res.success) {
        setRecentCheckIns((prev) => [res.registration!, ...prev.slice(0, 9)]);
      }
    } catch (err: any) {
      setLastResult({
        success: false,
        message: err?.message || "Error al conectar con el servidor.",
      });
      playBeep(false);
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
      // Permitir re-escaneo tras 2 segundos
      setTimeout(() => {
        lastScannedCodeRef.current = "";
      }, 2000);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Cámara trasera en móviles
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (decodedText !== lastScannedCodeRef.current) {
            lastScannedCodeRef.current = decodedText;
            processCode(decodedText);
          }
        },
        () => {
          // Frame sin QR, ignorar
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.error("Error al iniciar cámara:", err);
      setCameraError(
        "No se pudo acceder a la cámara. Asegúrate de conceder permisos de video en tu navegador o usa la búsqueda por Folio manual."
      );
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error("Error al detener cámara:", err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrCodeRef.current.stop();
          }
        } catch {}
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFolio.trim()) return;
    processCode(manualFolio.trim());
    setManualFolio("");
  };

  return (
    <div className="space-y-8">
      {/* Grid: Cámara / Lector y Búsqueda Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lector de Cámara Web / Móvil */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/80 bg-white/90 p-5 sm:p-7 shadow-lg backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Camera className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Escáner de Cámara QR
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Apunta al código QR del boleto del corredor
                  </p>
                </div>
              </div>

              {isScanning ? (
                <button
                  onClick={stopCamera}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <CameraOff className="h-3.5 w-3.5" />
                  Apagar Cámara
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="btn-shine inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-fuchsia-500/25 transition-all cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Activar Cámara
                </button>
              )}
            </div>

            {/* Viewport del Escáner */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-square sm:aspect-4/3 flex items-center justify-center">
              <div id="reader" className="w-full h-full" />

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-950/80">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-3 ring-1 ring-white/20">
                    <QrCode className="h-8 w-8 text-violet-400" />
                  </div>
                  <p className="text-sm font-bold">Cámara en espera</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Presiona el botón "Activar Cámara" para escanear con la cámara de tu celular o laptop.
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-4 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Iniciar Cámara Ahora
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white backdrop-blur-xs">
                  <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mb-2" />
                  <p className="text-xs font-bold">Verificando boleto...</p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
                {cameraError}
              </div>
            )}
          </div>
        </div>

        {/* Búsqueda Manual de Folio y Resultado en Vivo */}
        <div className="lg:col-span-5 space-y-4">
          {/* Formulario de Búsqueda Manual */}
          <div className="rounded-3xl border border-white/80 bg-white/90 p-5 sm:p-7 shadow-lg backdrop-blur-2xl">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-violet-600" /> Búsqueda por Folio o ID
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Si la cámara del atleta no lee el código, escribe su número de folio:
            </p>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={manualFolio}
                  onChange={(e) => setManualFolio(e.target.value.toUpperCase())}
                  placeholder="ej. PSL-8542"
                  className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono font-bold uppercase focus:border-violet-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !manualFolio.trim()}
                className="btn-shine h-11 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Validar
              </button>
            </form>
          </div>

          {/* Tarjeta de Resultado Instantáneo */}
          {lastResult && (
            <div
              className={`rounded-3xl border-2 p-6 shadow-xl transition-all ${
                lastResult.success
                  ? "border-emerald-400 bg-emerald-50/90 text-slate-900"
                  : lastResult.alreadyDelivered
                  ? "border-amber-400 bg-amber-50/90 text-slate-900"
                  : "border-rose-400 bg-rose-50/90 text-slate-900"
              }`}
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    lastResult.success
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : lastResult.alreadyDelivered
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  }`}
                >
                  {lastResult.success ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <AlertTriangle className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-1 ${
                      lastResult.success
                        ? "bg-emerald-200 text-emerald-900"
                        : lastResult.alreadyDelivered
                        ? "bg-amber-200 text-amber-900"
                        : "bg-rose-200 text-rose-900"
                    }`}
                  >
                    {lastResult.success
                      ? "✓ CHECK-IN EXITOSO"
                      : lastResult.alreadyDelivered
                      ? "⚠️ KIT YA ENTREGADO"
                      : "❌ ERROR DE VALIDACIÓN"}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                    {lastResult.message}
                  </h4>
                </div>
              </div>

              {/* Ficha del Corredor Validado */}
              {lastResult.registration && (
                <div className="rounded-2xl bg-white/95 p-4 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <p className="font-black text-sm text-slate-900">
                        {lastResult.registration.runnerName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {lastResult.registration.runnerEmail}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-black bg-violet-100 text-violet-800 px-2.5 py-1 rounded-lg">
                      {lastResult.registration.bibNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Distancia
                      </span>
                      <span className="font-bold text-slate-800">
                        {lastResult.registration.distanceName || "General"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-violet-50 p-2.5 border border-violet-100">
                      <span className="text-[10px] font-bold uppercase text-violet-600 block flex items-center gap-1">
                        <Shirt className="h-3 w-3" /> Talla Playera
                      </span>
                      <span className="text-base font-black text-violet-900">
                        Talla {lastResult.registration.shirtSize || "M"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{lastResult.registration.raceTitle}</span>
                    <span className="font-bold text-emerald-600">
                      ✓ Pago Verificado (${lastResult.registration.amountPaid} MXN)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Historial de Kits Entregados en esta Sesión */}
      {recentCheckIns.length > 0 && (
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Kits Entregados Recientemente en esta Mesa ({recentCheckIns.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Sesión activa</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentCheckIns.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{item.runnerName}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.raceTitle} · Distancia: {item.distanceName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-violet-100 px-2 py-0.5 font-bold text-violet-800 text-[11px]">
                    Playera: {item.shirtSize}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {item.bibNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
