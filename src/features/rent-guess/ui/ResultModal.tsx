import { useState, useEffect } from "react";
import { formatThousands } from "@/shared/lib/numberFormat";
import type { ApartmentWithResult } from "@/types";

interface ResultModalProps {
  lastApartment: ApartmentWithResult | null;
  show: boolean;
  onClose: () => void;
}

const ResultModal = ({ lastApartment, show, onClose }: ResultModalProps) => {
  const [canClose, setCanClose] = useState(false);

  // Enforce minimum 2-second viewing time
  useEffect(() => {
    if (!show) { setCanClose(false); return; }
    const t = setTimeout(() => setCanClose(true), 2000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show || !lastApartment) return null;

  const { title, feedbackMessage, guess, prizeInUSD, prizeInARS, percentDiff } = lastApartment;
  const isClose = percentDiff <= 10;

  let priceContext: string;
  if (prizeInUSD) {
    priceContext = `El precio era ${formatThousands(prizeInUSD)} Dólares — al cambio del día equivale a ${prizeInARS}.`;
  } else {
    priceContext = `El precio era ${formatThousands(prizeInARS?.replace("ARS ", "") ?? "")} ARS.`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={canClose ? onClose : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="fade-in relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f8fafc] shadow-[0_32px_80px_rgba(15,23,42,0.35)]"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coloured top strip */}
        <div className={`h-2 w-full flex-none ${isClose ? "bg-emerald-400" : "bg-rose-400"}`} />

        {/* Header */}
        <div className="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${isClose ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
              {isClose ? "✓" : "✗"}
            </span>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900">{title}</h2>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body — scrollable */}
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
          {/* Guess vs real price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Tu respuesta</p>
              <p className="mt-1 text-lg font-extrabold text-slate-800">$ {guess}</p>
            </div>
            <div className={`rounded-2xl border px-4 py-3 text-center shadow-sm ${isClose ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isClose ? "text-emerald-500" : "text-rose-400"}`}>Precio real</p>
              <p className={`mt-1 text-lg font-extrabold ${isClose ? "text-emerald-700" : "text-rose-700"}`}>
                $ {formatThousands(prizeInARS?.replace("ARS ", "") ?? "")}
              </p>
              {prizeInUSD && (
                <p className={`text-xs font-semibold ${isClose ? "text-emerald-500" : "text-rose-400"}`}>
                  ({formatThousands(prizeInUSD)} USD)
                </p>
              )}
            </div>
          </div>

          {/* Price context + feedback */}
          <div className={`rounded-2xl border px-4 py-3 text-sm ${isClose ? "border-emerald-100 bg-emerald-50/60 text-emerald-800" : "border-rose-100 bg-rose-50/60 text-rose-800"}`}>
            <p>{priceContext}</p>
            {feedbackMessage && <p className="mt-1 font-medium">{feedbackMessage}</p>}
          </div>

          {/* Percentage diff badge */}
          <p className="text-center text-xs font-semibold text-slate-400">
            Tu estimación estuvo{" "}
            <span className={`font-extrabold ${isClose ? "text-emerald-600" : "text-rose-500"}`}>
              {percentDiff === 0 ? "exacta" : `${percentDiff.toFixed(2)}% de diferencia`}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-slate-100 px-6 py-4">
          <button
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className={`w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition ${
              canClose
                ? "bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            {canClose ? "Siguiente departamento →" : "Viendo resultado…"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
