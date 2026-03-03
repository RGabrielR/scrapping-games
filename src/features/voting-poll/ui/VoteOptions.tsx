interface VoteOptionsProps {
  onVote: (options: string[]) => void;
}

const VoteOptions = ({ onVote }: VoteOptionsProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
      <button
        type="button"
        onClick={() => onVote(["AFIRMATIVO"])}
        className="w-full max-w-xs rounded-2xl border border-emerald-300 bg-emerald-500 px-5 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:max-w-[12rem]"
      >
        AFIRMATIVO
      </button>
      <button
        type="button"
        onClick={() => onVote(["NEGATIVO"])}
        className="w-full max-w-xs rounded-2xl border border-rose-300 bg-rose-500 px-5 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 sm:max-w-[12rem]"
      >
        NEGATIVO
      </button>
      <button
        type="button"
        onClick={() => onVote(["AUSENTE", "ABSTENCION"])}
        className="w-full max-w-xs rounded-2xl border border-amber-300 bg-amber-500 px-5 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:max-w-[12rem]"
      >
        AUSENTE O ABSTENCION
      </button>
    </div>
  );
};

export default VoteOptions;
