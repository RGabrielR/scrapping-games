interface StrikesHUDProps {
  strikes: number;
}

const StrikesHUD = ({ strikes }: StrikesHUDProps) => (
  <div className="flex items-center gap-1.5" aria-label={`Strikes: ${strikes} de 3`}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-extrabold transition-all duration-200 ${
          i < strikes
            ? "border-rose-300 bg-rose-100 text-rose-600"
            : "border-slate-200 bg-white text-slate-300"
        }`}
      >
        {i < strikes ? "✕" : "●"}
      </span>
    ))}
  </div>
);

export default StrikesHUD;
