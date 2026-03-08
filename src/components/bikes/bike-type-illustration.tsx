'use client';

interface BikeTypeIllustrationProps {
  type: string;
  className?: string;
}

const colors: Record<string, { frame: string; accent: string; wheel: string }> = {
  road:   { frame: '#2563eb', accent: '#3b82f6', wheel: '#1e3a5f' },
  mtb:    { frame: '#d97706', accent: '#f59e0b', wheel: '#78350f' },
  gravel: { frame: '#059669', accent: '#10b981', wheel: '#064e3b' },
  city:   { frame: '#7c3aed', accent: '#8b5cf6', wheel: '#4c1d95' },
  ebike:  { frame: '#0891b2', accent: '#22d3ee', wheel: '#164e63' },
  other:  { frame: '#6b7280', accent: '#9ca3af', wheel: '#374151' },
};

function RoadBike({ frame, accent, wheel }: { frame: string; accent: string; wheel: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels */}
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="3" opacity="0.3" />
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="45" cy="85" r="2.5" fill={wheel} />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="3" opacity="0.3" />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="155" cy="85" r="2.5" fill={wheel} />
      {/* Frame — aggressive road geometry */}
      <path d="M45 85 L85 40 L155 85" stroke={frame} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M85 40 L120 42" stroke={frame} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M45 85 L100 65 L155 85" stroke={frame} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 65 L85 40" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Handlebar — drop bar */}
      <path d="M120 42 L128 38 L132 44" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Saddle */}
      <path d="M78 37 L92 37" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Cranks */}
      <circle cx="100" cy="85" r="6" stroke={accent} strokeWidth="2" fill="none" />
      <path d="M100 79 L103 74" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MtbBike({ frame, accent, wheel }: { frame: string; accent: string; wheel: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels — chunky tires */}
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="5" opacity="0.25" />
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="5" strokeDasharray="3 4" />
      <circle cx="45" cy="85" r="3" fill={wheel} />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="5" opacity="0.25" />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="5" strokeDasharray="3 4" />
      <circle cx="155" cy="85" r="3" fill={wheel} />
      {/* Fork — suspension */}
      <path d="M45 85 L55 55" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M45 85 L50 55" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* Frame — slacker MTB geometry */}
      <path d="M55 55 L90 42 L105 70 L155 85" stroke={frame} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M55 55 L105 70" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      <path d="M90 42 L105 70" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Handlebar — flat/riser */}
      <path d="M55 55 L60 48 L70 46" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Saddle — lower */}
      <path d="M83 39 L97 39" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Cranks */}
      <circle cx="105" cy="85" r="6" stroke={accent} strokeWidth="2" fill="none" />
      <path d="M105 79 L108 74" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GravelBike({ frame, accent, wheel }: { frame: string; accent: string; wheel: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels — medium tires */}
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="4" opacity="0.25" />
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="4" strokeDasharray="5 3" />
      <circle cx="45" cy="85" r="2.5" fill={wheel} />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="4" opacity="0.25" />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="4" strokeDasharray="5 3" />
      <circle cx="155" cy="85" r="2.5" fill={wheel} />
      {/* Frame — relaxed road geometry */}
      <path d="M45 85 L82 42 L155 85" stroke={frame} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82 42 L118 44" stroke={frame} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M45 85 L98 67 L155 85" stroke={frame} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M98 67 L82 42" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Handlebar — flared drops */}
      <path d="M118 44 L126 39 L132 46" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Saddle */}
      <path d="M75 39 L89 39" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Cranks */}
      <circle cx="98" cy="85" r="6" stroke={accent} strokeWidth="2" fill="none" />
      {/* Bags hint */}
      <rect x="88" y="48" width="8" height="12" rx="1.5" fill={accent} opacity="0.2" />
    </svg>
  );
}

function CityBike({ frame, accent, wheel }: { frame: string; accent: string; wheel: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels */}
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="3.5" opacity="0.25" />
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="3.5" strokeDasharray="6 3" />
      <circle cx="45" cy="85" r="2.5" fill={wheel} />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="3.5" opacity="0.25" />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="3.5" strokeDasharray="6 3" />
      <circle cx="155" cy="85" r="2.5" fill={wheel} />
      {/* Frame — step-through / upright geometry */}
      <path d="M45 85 L70 50 L115 50 L155 85" stroke={frame} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M95 50 L100 75 L155 85" stroke={frame} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 85 L100 75" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Handlebar — swept back */}
      <path d="M70 50 L62 42 L55 44" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Saddle */}
      <path d="M108 47 L122 47" stroke={frame} strokeWidth="3" strokeLinecap="round" />
      {/* Fender hint */}
      <path d="M28 85 Q45 60 62 85" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M138 85 Q155 60 172 85" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Cranks */}
      <circle cx="100" cy="85" r="6" stroke={accent} strokeWidth="2" fill="none" />
    </svg>
  );
}

function EBike({ frame, accent, wheel }: { frame: string; accent: string; wheel: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels */}
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="4" opacity="0.25" />
      <circle cx="45" cy="85" r="28" stroke={wheel} strokeWidth="4" strokeDasharray="5 3" />
      <circle cx="45" cy="85" r="3" fill={wheel} />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="4" opacity="0.25" />
      <circle cx="155" cy="85" r="28" stroke={wheel} strokeWidth="4" strokeDasharray="5 3" />
      <circle cx="155" cy="85" r="3" fill={wheel} />
      {/* Frame */}
      <path d="M45 85 L80 42 L155 85" stroke={frame} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 42 L120 44" stroke={frame} strokeWidth="4" strokeLinecap="round" />
      <path d="M45 85 L100 67 L155 85" stroke={frame} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 67 L80 42" stroke={frame} strokeWidth="3.5" strokeLinecap="round" />
      {/* Battery — integrated in downtube */}
      <rect x="60" y="57" width="32" height="8" rx="3" fill={accent} opacity="0.35" transform="rotate(-25 60 57)" />
      {/* Motor hub */}
      <circle cx="100" cy="85" r="9" fill={accent} opacity="0.25" />
      <circle cx="100" cy="85" r="6" stroke={accent} strokeWidth="2" fill="none" />
      {/* Lightning bolt */}
      <path d="M97 80 L101 84 L99 85 L103 90" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Handlebar */}
      <path d="M120 44 L128 38 L132 42" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Saddle */}
      <path d="M73 39 L87 39" stroke={frame} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BikeTypeIllustration({ type, className }: BikeTypeIllustrationProps) {
  const c = colors[type] || colors.other;

  const bikes: Record<string, React.ReactNode> = {
    road: <RoadBike {...c} />,
    mtb: <MtbBike {...c} />,
    gravel: <GravelBike {...c} />,
    city: <CityBike {...c} />,
    ebike: <EBike {...c} />,
  };

  return (
    <div className={className}>
      {bikes[type] || <RoadBike {...colors.other} />}
    </div>
  );
}
