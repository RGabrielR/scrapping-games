const BuildingLoader = () => (
  <div className="congress-loader">
    <svg
      viewBox="0 0 220 160"
      xmlns="http://www.w3.org/2000/svg"
      className="building-loader-svg"
      aria-label="Cargando departamento..."
    >
      {/* ── Left building (short) ── */}
      <rect x="5" y="78" width="46" height="77" rx="2" fill="currentColor" opacity="0.72" />
      {/* Cornice */}
      <rect x="3" y="74" width="50" height="5" rx="1" fill="currentColor" opacity="0.6" />
      {/* Windows — 2 cols × 3 rows */}
      {[84, 99, 114].map((y) =>
        [13, 30].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="11" height="10" rx="1.5" fill="white" opacity="0.28" />
        ))
      )}
      {/* Door */}
      <rect x="16" y="130" width="16" height="25" rx="2" fill="white" opacity="0.22" />

      {/* ── Centre building (tallest) ── */}
      <rect x="58" y="18" width="104" height="137" rx="2" fill="currentColor" />
      {/* Penthouse / rooftop box */}
      <rect x="76" y="8" width="68" height="12" rx="2" fill="currentColor" opacity="0.8" />
      {/* Antenna */}
      <line x1="110" y1="2" x2="110" y2="9" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      {/* Windows — 3 cols × 5 rows */}
      {[28, 47, 66, 85, 104].map((y) =>
        [69, 98, 127].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="19" height="13" rx="1.5" fill="white" opacity="0.25" />
        ))
      )}
      {/* Central door */}
      <rect x="92" y="118" width="36" height="37" rx="3" fill="white" opacity="0.2" />

      {/* ── Right building (medium) ── */}
      <rect x="169" y="50" width="46" height="105" rx="2" fill="currentColor" opacity="0.82" />
      {/* Cornice */}
      <rect x="167" y="46" width="50" height="5" rx="1" fill="currentColor" opacity="0.65" />
      {/* Windows — 2 cols × 4 rows */}
      {[60, 76, 92, 108].map((y) =>
        [177, 193].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="11" height="10" rx="1.5" fill="white" opacity="0.28" />
        ))
      )}
      {/* Door */}
      <rect x="180" y="128" width="16" height="27" rx="2" fill="white" opacity="0.22" />

      {/* Ground */}
      <rect x="0" y="155" width="220" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
    </svg>

    <div className="congress-dots">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default BuildingLoader;
