const CongressLoader = () => (
  <div className="congress-loader">
    <svg
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
      className="congress-building"
      aria-label="Cargando..."
    >
      {/* Flag pole */}
      <line x1="100" y1="8" x2="100" y2="28" stroke="currentColor" strokeWidth="2" />
      <rect x="100" y="8" width="16" height="10" rx="1" fill="currentColor" opacity="0.7" />

      {/* Dome */}
      <ellipse cx="100" cy="36" rx="22" ry="10" fill="currentColor" opacity="0.85" />
      <rect x="78" y="36" width="44" height="8" fill="currentColor" opacity="0.85" />

      {/* Pediment (triangular roof) */}
      <polygon points="22,80 100,52 178,80" fill="currentColor" opacity="0.9" />

      {/* Entablature (horizontal band under pediment) */}
      <rect x="30" y="80" width="140" height="8" fill="currentColor" />

      {/* Main building body */}
      <rect x="30" y="88" width="140" height="58" fill="currentColor" opacity="0.95" />

      {/* Columns (6 columns, evenly spaced) */}
      {[46, 66, 86, 106, 126, 146].map((x) => (
        <rect key={x} x={x} y="80" width="8" height="66" rx="2" fill="white" opacity="0.18" />
      ))}

      {/* Windows — left side */}
      <rect x="42" y="96" width="20" height="16" rx="3" fill="white" opacity="0.25" />
      <rect x="42" y="118" width="20" height="16" rx="3" fill="white" opacity="0.25" />

      {/* Windows — right side */}
      <rect x="138" y="96" width="20" height="16" rx="3" fill="white" opacity="0.25" />
      <rect x="138" y="118" width="20" height="16" rx="3" fill="white" opacity="0.25" />

      {/* Central door (arched) */}
      <rect x="84" y="108" width="32" height="38" rx="6" fill="white" opacity="0.3" />

      {/* Steps */}
      <rect x="20" y="146" width="160" height="5" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="10" y="151" width="180" height="5" rx="1" fill="currentColor" opacity="0.4" />
    </svg>

    <div className="congress-dots">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default CongressLoader;
