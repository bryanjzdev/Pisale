"use client";

import { useState } from "react";
import {
  Shirt,
  Award,
  Timer,
  Droplets,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Trash2,
  Star,
  Package,
  Check,
} from "lucide-react";
import { KIT_ICONS, KIT_ICON_LABELS, KIT_PRESETS, type KitIcon, type KitItem } from "@/lib/kits";

const ICON_MAP: Record<KitIcon, typeof Shirt> = {
  shirt: Shirt,
  medal: Award,
  timer: Timer,
  droplet: Droplets,
  shield: ShieldCheck,
  bag: ShoppingBag,
};

type Props = {
  value: KitItem[];
  onChange: (items: KitItem[]) => void;
  stepLabel?: string;
};

export function KitBuilder({ value, onChange, stepLabel = "Kit Oficial del Corredor" }: Props) {
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customIcon, setCustomIcon] = useState<KitIcon>("bag");

  const isPresetActive = (preset: KitItem) => value.some((v) => v.title === preset.title);

  const togglePreset = (preset: KitItem) => {
    if (isPresetActive(preset)) {
      onChange(value.filter((v) => v.title !== preset.title));
    } else if (value.length < 12) {
      onChange([...value, { ...preset }]);
    }
  };

  const addCustom = () => {
    const title = customTitle.trim();
    if (title.length < 2 || value.length >= 12) return;
    onChange([
      ...value,
      { id: `custom-${Date.now()}`, title, description: customDesc.trim(), icon: customIcon },
    ]);
    setCustomTitle("");
    setCustomDesc("");
    setCustomIcon("bag");
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const toggleHighlight = (idx: number) =>
    onChange(value.map((v, i) => (i === idx ? { ...v, highlight: !v.highlight } : v)));

  const updateAt = (idx: number, field: "title" | "description", text: string) =>
    onChange(value.map((v, i) => (i === idx ? { ...v, [field]: text } : v)));

  return (
    <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(91,33,182,0.1)] backdrop-blur-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <Package className="h-3.5 w-3.5" />
            </span>
            <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
              {stepLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Elige qué incluye la inscripción. Se mostrará en la página de la carrera y en el boleto.
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black text-orange-700 border border-orange-200">
          {value.length} artículo{value.length === 1 ? "" : "s"} en el kit
        </span>
      </div>

      {/* Presets rápidos */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Agregar con un clic
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {KIT_PRESETS.map((preset) => {
            const Icon = ICON_MAP[preset.icon];
            const active = isPresetActive(preset);
            return (
              <button
                key={preset.id}
                type="button"
                id={`kit-preset-${preset.icon}`}
                onClick={() => togglePreset(preset)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? "border-orange-400 bg-orange-50/70 ring-2 ring-orange-400/20"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    active ? "bg-linear-to-br from-orange-500 to-rose-500 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="text-xs font-bold text-slate-800 leading-snug">{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista editable */}
      {value.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Contenido del kit (puedes editar el texto)
          </p>
          {value.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] ?? ShoppingBag;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3"
              >
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <input
                    type="text"
                    value={item.title}
                    maxLength={80}
                    onChange={(e) => updateAt(idx, "title", e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs font-bold text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.description}
                    maxLength={220}
                    placeholder="Descripción breve (opcional)"
                    onChange={(e) => updateAt(idx, "description", e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-[11px] font-medium text-slate-600 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    title="Destacar artículo"
                    onClick={() => toggleHighlight(idx)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.highlight ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-500"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${item.highlight ? "fill-amber-400" : ""}`} />
                  </button>
                  <button
                    type="button"
                    title="Quitar artículo"
                    onClick={() => removeAt(idx)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Artículo personalizado */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Artículo personalizado (gorra, calcetas, cupón, buff…)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={customTitle}
            maxLength={80}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="ej. Gorra técnica bordada"
            className="sm:col-span-4 h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
          />
          <input
            type="text"
            value={customDesc}
            maxLength={220}
            onChange={(e) => setCustomDesc(e.target.value)}
            placeholder="Descripción breve"
            className="sm:col-span-4 h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:border-orange-500 focus:outline-none"
          />
          <select
            value={customIcon}
            onChange={(e) => setCustomIcon(e.target.value as KitIcon)}
            className="sm:col-span-2 h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:outline-none"
          >
            {KIT_ICONS.map((ic) => (
              <option key={ic} value={ic}>
                {KIT_ICON_LABELS[ic]}
              </option>
            ))}
          </select>
          <button
            type="button"
            id="kit-add-custom"
            onClick={addCustom}
            disabled={customTitle.trim().length < 2 || value.length >= 12}
            className="sm:col-span-2 inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
