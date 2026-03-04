import type { ApartmentData } from "@/types";
import { Fragment } from "react";

/** Renders text with XXXXXX placeholders replaced by black redaction bars. */
const Redacted = ({ text }: { text: string }) => (
  <>
    {text.split("XXXXXX").map((part, i, arr) => (
      <Fragment key={i}>
        {part}
        {i < arr.length - 1 && (
          <span
            className="mx-0.5 inline-block select-none rounded bg-slate-900 px-1 align-middle text-slate-900"
            aria-label="precio oculto"
          >
            ▓▓▓▓▓
          </span>
        )}
      </Fragment>
    ))}
  </>
);

interface HintModalProps {
  presentApartment: ApartmentData;
  maskedDescription: string;
  show: boolean;
  onClose: () => void;
}

const HintModal = ({ presentApartment, maskedDescription, show, onClose }: HintModalProps) => {
  if (!show) return null;

  const isUSD = Boolean(presentApartment.prizeInUSD);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal card — max height + scroll */}
      <div
        className="fade-in relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f8fafc] shadow-[0_32px_80px_rgba(15,23,42,0.35)]"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed, never scrolls */}
        <div className="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2a7 7 0 00-5.468 11.37A5.006 5.006 0 006 17v1a2 2 0 002 2h.126A2 2 0 0010 21h4a2 2 0 001.874-1H16a2 2 0 002-2v-1a5.006 5.006 0 00-.532-3.63A7 7 0 0012 2zm0 2a5 5 0 013.473 8.632A3 3 0 0014 15h-4a3 3 0 00-1.473-2.368A5 5 0 0112 4zm-2 13h4v1h-4v-1z" />
              </svg>
            </span>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900">Pista</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6">
          {/* Currency type */}
          <div className={`flex items-center gap-4 rounded-2xl border px-5 py-4 ${isUSD ? "border-emerald-200 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
            <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-black ${isUSD ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
              {isUSD ? "USD" : "ARS"}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">El precio está en</p>
              <p className={`text-xl font-extrabold ${isUSD ? "text-emerald-700" : "text-blue-700"}`}>
                {isUSD ? "Dólares" : "Pesos argentinos"}
              </p>
            </div>
          </div>

          {/* Masked description */}
          {maskedDescription && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Descripción del anuncio
              </p>
              <div className="flex flex-col gap-2">
                {maskedDescription.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-slate-600">
                    <Redacted text={para.replace(/\n/g, " ")} />
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — fixed, never scrolls */}
        <div className="flex-none border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
          >
            Cerrar pista
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
