/**
 * Renders the three voting buttons for the voting poll game.
 * @param {{ onVote: (options: string[]) => void }} props
 */
const VoteOptions = ({ onVote }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
      <button
        type="button"
        onClick={() => onVote(["AFIRMATIVO"])}
        className="w-full max-w-xs rounded-2xl bg-green-700 px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-1 hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 sm:max-w-[12rem]"
      >
        AFIRMATIVO
      </button>
      <button
        type="button"
        onClick={() => onVote(["NEGATIVO"])}
        className="w-full max-w-xs rounded-2xl bg-red-700 px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-1 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:max-w-[12rem]"
      >
        NEGATIVO
      </button>
      <button
        type="button"
        onClick={() => onVote(["AUSENTE", "ABSTENCION"])}
        className="w-full max-w-xs rounded-2xl bg-yellow-700 px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 sm:max-w-[12rem]"
      >
        AUSENTE O ABSTENCIÓN
      </button>
    </div>
  );
};

export default VoteOptions;
