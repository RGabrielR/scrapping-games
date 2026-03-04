import { formatThousands } from "@/shared/lib/numberFormat";

interface PriceInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  hintDisabled?: boolean;
}

const PriceInput = ({ value, onChange, onSubmit, onHint, hintDisabled = false }: PriceInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(formatThousands(e.target.value));

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        onClick={hintDisabled ? undefined : onHint}
        disabled={hintDisabled}
        className={`flex flex-shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 shadow-sm transition ${
          hintDisabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
            : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95"
        }`}
        title={hintDisabled ? "Sin pista disponible" : "Ver pista"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 2a7 7 0 00-5.468 11.37A5.006 5.006 0 006 17v1a2 2 0 002 2h.126A2 2 0 0010 21h4a2 2 0 001.874-1H16a2 2 0 002-2v-1a5.006 5.006 0 00-.532-3.63A7 7 0 0012 2zm0 2a5 5 0 013.473 8.632A3 3 0 0014 15h-4a3 3 0 00-1.473-2.368A5 5 0 0112 4zm-2 13h4v1h-4v-1z" />
        </svg>
        <span className="text-[0.65rem] font-bold uppercase tracking-wide">Pista</span>
      </button>

      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
          <span className="text-gray-500 text-xl md:text-2xl">$</span>
        </div>
        <input
          type="text"
          className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-10 pr-20 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:py-4 md:text-2xl"
          placeholder="0"
          autoComplete="off"
          onChange={handleChange}
          value={value}
          style={{ WebkitAppearance: "none", MozAppearance: "textfield" } as React.CSSProperties}
        />
        <div className="pointer-events-none absolute inset-y-0 right-14 flex items-center z-10">
          <span className="text-gray-400 text-sm font-semibold">ARS</span>
        </div>
        <button
          onClick={onSubmit}
          className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl bg-slate-900 px-4 text-white transition hover:bg-slate-700 active:bg-black"
          title="Confirmar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="h-4 w-4"
            fill="currentColor"
          >
            <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PriceInput;
