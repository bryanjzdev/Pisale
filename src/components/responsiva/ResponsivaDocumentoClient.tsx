"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  HeartPulse,
  Phone,
  AlertTriangle,
  CheckCircle2,
  User,
  Calendar,
  MapPin,
  Edit3,
  Check,
  FileCheck2,
  Info,
} from "lucide-react";
import { RealQRCode } from "@/components/common/RealQRCode";

interface ResponsivaDocumentoClientProps {
  race: {
    id: string;
    title: string;
    day: string;
    month: string;
    year: string;
    location: string;
    category?: string;
    startTime?: string;
  };
  runner: {
    name: string;
    email: string;
    bibNumber: string;
    distance: string;
    registrationId: string;
    registeredDate: string;
    shirtSize?: string;
  };
}

export function ResponsivaDocumentoClient({
  race,
  runner,
}: ResponsivaDocumentoClientProps) {
  // Estado para datos de contacto de emergencia y ficha médica
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoParentesco, setContactoParentesco] = useState("Familiar directo");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [tipoSangre, setTipoSangre] = useState("O+");
  const [alergias, setAlergias] = useState("Ninguna conocida");
  const [padecimiento, setPadecimiento] = useState("Apto / Sin padecimientos");

  // Estado para panel de edición rápida en pantalla
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);

  // Cargar datos previos de localStorage si existen
  useEffect(() => {
    try {
      const cacheKey = `pisale_waiver_${runner.registrationId}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.contactoNombre) setContactoNombre(parsed.contactoNombre);
        if (parsed.contactoParentesco) setContactoParentesco(parsed.contactoParentesco);
        if (parsed.contactoTelefono) setContactoTelefono(parsed.contactoTelefono);
        if (parsed.tipoSangre) setTipoSangre(parsed.tipoSangre);
        if (parsed.alergias) setAlergias(parsed.alergias);
        if (parsed.padecimiento) setPadecimiento(parsed.padecimiento);
      }
    } catch {
      // Ignorar errores en navegadores restrictivos
    }
  }, [runner.registrationId]);

  const handleGuardarDatos = () => {
    try {
      const cacheKey = `pisale_waiver_${runner.registrationId}`;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          contactoNombre,
          contactoParentesco,
          contactoTelefono,
          tipoSangre,
          alergias,
          padecimiento,
        })
      );
      setDatosGuardados(true);
      setTimeout(() => setDatosGuardados(false), 2500);
      setMostrarEditor(false);
    } catch {
      setMostrarEditor(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const fechaActual = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500 selection:text-white print:bg-white print:text-slate-900 pb-20 pt-28 sm:pt-32">
      {/* ========================================================
          BARRA DE HERRAMIENTAS SUPERIOR (OCULTA EN IMPRESIÓN)
          ======================================================== */}
      <div className="print-hidden mx-auto max-w-4xl px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900/90 p-4 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <Link
            href={`/carrera/${race.id}/boleto?registration_id=${runner.registrationId}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Boleto
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setMostrarEditor(!mostrarEditor)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                mostrarEditor
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5 text-violet-400" />
              <span>{mostrarEditor ? "Cerrar Editor" : "Llenar Datos Médicos"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-5 py-2 text-xs font-black text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Panel Desplegable para Llenar Datos Médicos en Pantalla */}
        {mostrarEditor && (
          <div className="mt-4 rounded-3xl bg-slate-900/95 p-6 border border-violet-500/30 backdrop-blur-xl shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <HeartPulse className="h-4 w-4 text-rose-400" />
                <span>Captura de Ficha Médica y Contacto de Emergencia</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Se plasmará automáticamente en la carta lista para imprimir
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Nombre Contacto de Emergencia *
                </label>
                <input
                  type="text"
                  placeholder="Ej. María González López"
                  value={contactoNombre}
                  onChange={(e) => setContactoNombre(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Parentesco / Relación
                </label>
                <input
                  type="text"
                  placeholder="Ej. Esposa, Hermano, Entrenador"
                  value={contactoParentesco}
                  onChange={(e) => setContactoParentesco(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Teléfono de Emergencia (10 dígitos) *
                </label>
                <input
                  type="tel"
                  placeholder="Ej. 55 1234 5678"
                  value={contactoTelefono}
                  onChange={(e) => setContactoTelefono(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Grupo Sanguíneo / RH
                </label>
                <select
                  value={tipoSangre}
                  onChange={(e) => setTipoSangre(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="O+">O Positivo (O+)</option>
                  <option value="O-">O Negativo (O-)</option>
                  <option value="A+">A Positivo (A+)</option>
                  <option value="A-">A Negativo (A-)</option>
                  <option value="B+">B Positivo (B+)</option>
                  <option value="B-">B Negativo (B-)</option>
                  <option value="AB+">AB Positivo (AB+)</option>
                  <option value="AB-">AB Negativo (AB-)</option>
                  <option value="Desconocido">No especificado</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Alergias a Medicamentos
                </label>
                <input
                  type="text"
                  placeholder="Ej. Penicilina, AINEs, Ninguna"
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Condición Médica Relevante
                </label>
                <input
                  type="text"
                  placeholder="Ej. Asma, Hipertensión, Ninguna"
                  value={padecimiento}
                  onChange={(e) => setPadecimiento(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={handleGuardarDatos}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Aplicar a la Responsiva</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <span>
            <strong>Requisito Indispensable:</strong> Lleva este formato impreso y debidamente firmado junto con tu <strong>identificación oficial (INE)</strong> para recoger tu kit de corredor.
          </span>
        </div>
      </div>

      {/* ========================================================
          DOCUMENTO OFICIAL LISTO PARA IMPRIMIR (HOJA TAMAÑO CARTA)
          Optimizado con @media print para 1 sola página perfecta
          ======================================================== */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="print-break-inside-avoid relative overflow-hidden rounded-3xl bg-white text-slate-900 border-2 border-slate-800 p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.5)] print:shadow-none print:border print:border-slate-800 print:rounded-none print:p-6 print:m-0">
          
          {/* ENCABEZADO INSTITUCIONAL */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-display font-black text-xl text-white">
                  P
                </span>
                <div>
                  <span className="font-display text-sm sm:text-base font-black tracking-wider uppercase block text-slate-900 leading-tight">
                    PÍSALE · PLATAFORMA DEPORTIVA OFICIAL
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                    CARTA RESPONSIVA, DESLINDE DE RESPONSABILIDAD MÉDICA Y ACEPTACIÓN DE REGLAMENTO
                  </span>
                </div>
              </div>

              {/* QR Compacto y Folio */}
              <div className="flex items-center gap-2 text-right">
                <div className="text-right">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 block">
                    FOLIO OFICIAL
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-black text-violet-700 block">
                    {runner.bibNumber}
                  </span>
                </div>
                <div className="border border-slate-300 p-1 rounded-md bg-white">
                  <RealQRCode value={runner.bibNumber} size={42} />
                </div>
              </div>
            </div>
          </div>

          {/* DATOS DE LA CARRERA Y CÉDULA DEL ATLETA */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            {/* Evento */}
            <div className="sm:col-span-7">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                Evento Oficial
              </span>
              <p className="font-display text-sm font-black text-slate-900 leading-tight">
                {race.title}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-600 mt-0.5">
                <span><strong>Fecha:</strong> {race.day} {race.month} {race.year}</span>
                <span><strong>Arranque:</strong> {race.startTime || "06:30 hrs"}</span>
                <span><strong>Sede:</strong> {race.location}</span>
              </div>
            </div>

            {/* Atleta */}
            <div className="sm:col-span-5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                Atleta Registrado
              </span>
              <p className="font-display text-sm font-black text-slate-900 leading-tight">
                {runner.name}
              </p>
              <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-600 mt-0.5">
                <span><strong>Distancia:</strong> {runner.distance}</span>
                {runner.shirtSize && <span><strong>Playera:</strong> {runner.shirtSize}</span>}
                <span><strong>ID:</strong> {runner.registrationId.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* FICHA MÉDICA Y CONTACTO DE EMERGENCIA */}
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 print:bg-white print:border-slate-300">
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 print:text-slate-900 uppercase tracking-wider mb-2">
              <HeartPulse className="h-3.5 w-3.5 text-rose-600 print:text-slate-800" />
              <span>Ficha Médica Deportiva y Contacto para Emergencias</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">
                  Contacto de Emergencia:
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {contactoNombre ? contactoNombre : "_____________________"}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">
                  Parentesco / Relación:
                </span>
                <span className="font-medium text-slate-800 block">
                  {contactoParentesco ? contactoParentesco : "_____________________"}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">
                  Teléfono de Emergencia:
                </span>
                <span className="font-mono font-bold text-slate-900 block">
                  {contactoTelefono ? contactoTelefono : "_____________________"}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">
                  Grupo Sanguíneo:
                </span>
                <span className="font-black text-violet-700 print:text-slate-900 block">
                  {tipoSangre}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-rose-100 print:border-slate-200 text-[10px]">
              <div>
                <span className="font-bold text-slate-600">Alergias a Medicamentos / Sustancias:</span>{" "}
                <span className="text-slate-800">{alergias || "Ninguna especificada"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-600">Padecimiento / Medicación Vigente:</span>{" "}
                <span className="text-slate-800">{padecimiento || "Apto para la prueba"}</span>
              </div>
            </div>
          </div>

          {/* TEXTO LEGAL OFICIAL: DESLINDE DE RESPONSABILIDAD Y WAIVER MÉDICO */}
          <div className="mb-4 text-[9.5px] leading-relaxed text-slate-700 border-t border-b border-slate-200 py-2.5 space-y-1.5 text-justify">
            <p>
              <strong>1. DECLARACIÓN DE SALUD Y APTITUD FÍSICA:</strong> Declaro bajo protesta de decir verdad que me encuentro en óptimas condiciones físicas, médicas y mentales para participar en el evento deportivo <strong>{race.title}</strong> en la distancia oficial seleccionada. Certifico que me he sometido voluntariamente a exámenes médicos de rutina previos y que no padezco enfermedad cardiovascular, pulmonar o lesión musculoesquelética que comprometa mi integridad o ponga en riesgo mi vida durante el desarrollo de la prueba.
            </p>

            <p>
              <strong>2. ASUNCIÓN EXPRESA DE RIESGOS:</strong> Reconozco y asumo de manera voluntaria e informada todos los riesgos inherentes y fortuitos derivados de la práctica atlética al aire libre, incluyendo de manera enunciativa más no limitativa: caídas, contacto con otros participantes, condiciones climatológicas adversas (calor, lluvia, hipotermia), deshidratación severa, tráfico vehicular en cruces y desniveles del asfalto o senderos.
            </p>

            <p>
              <strong>3. EXONERACIÓN Y DESLINDE LEGAL DE RESPONSABILIDAD:</strong> Libero y deslindo de toda responsabilidad legal, civil, penal, laboral, administrativa o indemnizatoria al <strong>Comité Organizador</strong>, a la sede sede anfitriona (<strong>{race.location}</strong>), a las autoridades municipales, estatales y federales de seguridad y vialidad, a los patrocinadores oficiales, jueces, voluntarios y a la plataforma tecnológica <strong>Písale (pisale.mx)</strong>, por cualquier incidente, lesión corporal temporal o permanente, invalidez o pérdida de la vida ocurrida antes, durante o después del evento por causas fortuitas o inherentes al esfuerzo físico.
            </p>

            <p>
              <strong>4. AUTORIZACIÓN DE ATENCIÓN MÉDICA PREHOSPITALARIA:</strong> Autorizo expresamente al cuerpo médico oficial del evento y servicios de ambulancia designados para suministrarme los primeros auxilios, medicamentos requeridos y/o coordinar mi traslado urgente a un hospital en caso de emergencia médica, asumiendo yo o mi aseguradora los gastos derivados si exceden la cobertura básica del evento.
            </p>

            <p>
              <strong>5. REGLAMENTO Y DERECHOS DE IMAGEN:</strong> Acepto portar mi número de competidor oficial en el pecho en todo momento, respetar los puntos de control de cronometraje y el reglamento oficial. Asimismo, autorizo de forma gratuita y no exclusiva el uso de mi imagen fotográfica y de video capturada durante la carrera para fines informativos, de memorias y de difusión deportiva del evento.
            </p>
          </div>

          {/* RECUADRO DE FIRMA AUTÓGRAFA DEL ATLETA Y FECHA */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end mb-4 pt-1">
            {/* Firma */}
            <div className="sm:col-span-7">
              <div className="h-16 sm:h-20 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-end pb-1 bg-slate-50/50 print:bg-white">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  (Espacio exclusivo para firma autógrafa)
                </span>
              </div>
              <div className="mt-1 text-center">
                <span className="font-display font-black text-xs text-slate-900 block uppercase">
                  {runner.name}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                  Nombre y Firma del Atleta (o Padre/Tutor si es menor de edad)
                </span>
              </div>
            </div>

            {/* Fecha y Lugar de Firma */}
            <div className="sm:col-span-5 bg-slate-50 print:bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Lugar y Fecha de Firma
              </span>
              <p className="text-[11px] font-bold text-slate-900">
                Sede: {race.location}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Fecha: {fechaActual}
              </p>
              <p className="text-[9px] text-slate-400 mt-1 italic">
                Manifestación de conformidad libre y voluntaria.
              </p>
            </div>
          </div>

          {/* TALÓN DE CONTROL PARA STAFF DE EXPO / ENTREGA DE KITS */}
          <div className="border-t-2 border-dashed border-slate-400 pt-3 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-black text-slate-900 uppercase">
                Uso Exclusivo Staff Expo:
              </span>
              <label className="flex items-center gap-1.5 font-medium">
                <span className="inline-block h-3.5 w-3.5 border border-slate-400 rounded-xs" />
                <span>Identificación INE cotejada</span>
              </label>
              <label className="flex items-center gap-1.5 font-medium">
                <span className="inline-block h-3.5 w-3.5 border border-slate-400 rounded-xs" />
                <span>Responsiva firmada física</span>
              </label>
              <label className="flex items-center gap-1.5 font-medium">
                <span className="inline-block h-3.5 w-3.5 border border-slate-400 rounded-xs" />
                <span>Kit y chip entregados</span>
              </label>
            </div>

            <div className="text-right">
              <span className="font-mono text-[9px] text-slate-400">
                VERIFICADO: PÍSALE-CHECKIN · VÁLIDO CON IDENTIFICACIÓN
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
