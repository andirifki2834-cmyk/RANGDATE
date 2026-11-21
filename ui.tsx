"use client";
import { useEffect, useState } from "react";
export function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  if (!msg) return null;
  return <div className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl fadeUp ${type === "ok" ? "bg-[#0B3D2E] text-white" : "bg-red-600 text-white"}`}>{type === "ok" ? "✅ " : "⚠️ "}{msg}</div>;
}
export function useToast() { const [t, setT] = useState<{ msg: string; type: "ok" | "err" }>({ msg: "", type: "ok" }); const show = (msg: string, type: "ok" | "err" = "ok") => { setT({ msg, type }); setTimeout(() => setT({ msg: "", type: "ok" }), 4200); }; return { t, show }; }
export function StatCard({ label, value, sub, icon, gold }: any) {
  return <div className="card p-5 fadeUp"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700/60">{label}</p><p className="mt-1 text-[28px] font-black leading-none text-[#0B3D2E]">{value}</p><p className="mt-1.5 text-xs text-slate-500">{sub}</p></div><div className={`grid h-11 w-11 place-items-center rounded-2xl text-xl ${gold ? "bg-amber-100" : "bg-emerald-100"}`}>{icon}</div></div></div>;
}
export function BarChart({ data, color = "#10B981" }: { data: Record<string, number>; color?: string }) {
  const max = Math.max(...Object.values(data), 1);
  return <div className="space-y-3">{Object.entries(data).map(([k, v]) => (<div key={k}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-700">{k}</span><span className="font-black text-[#0B3D2E]">{v}</span></div><div className="h-3 overflow-hidden rounded-full bg-emerald-50"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(v / max) * 100}%`, background: `linear-gradient(90deg,#0B3D2E,${color})` }} /></div></div>))}{Object.keys(data).length === 0 && <p className="text-sm text-slate-400">Belum ada data</p>}</div>;
}
export function Donut({ male, female }: { male: number; female: number }) {
  const total = Math.max(male + female, 1); const pm = (male / total) * 100;
  return <div className="flex items-center gap-5"><div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(#0E7A4F 0 ${pm}%, #D4AF37 ${pm}% 100%)` }}><div className="absolute inset-[18px] grid place-items-center rounded-full bg-white text-center"><div><p className="text-lg font-black text-[#0B3D2E]">{male + female}</p><p className="text-[10px] text-slate-400">Jiwa</p></div></div></div><div className="space-y-2 text-sm"><p><span className="mr-2 inline-block h-3 w-3 rounded bg-[#0E7A4F]" />Laki-laki <b>{male}</b> ({pm.toFixed(0)}%)</p><p><span className="mr-2 inline-block h-3 w-3 rounded bg-[#D4AF37]" />Perempuan <b>{female}</b> ({(100 - pm).toFixed(0)}%)</p></div></div>;
}
export const roleLabel: Record<string, string> = { SUPER_ADMIN: "Admin Utama", OPERATOR: "Operator Desa", KADUS: "Kepala Dusun", PETUGAS: "Petugas" };
export function ageOf(bd: string) { const d = new Date(bd); const n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; }
export function fmtRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
