type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "aria-hidden": true as const,
});

export const ArrowRight = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);
export const ArrowUpRight = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);
export const Download = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
  </svg>
);
export const Close = ({ size = 16, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Clock = ({ size = 14, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Sun = ({ size = 17, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Moon = ({ size = 17, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} className={className}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);
export const Auto = ({ size = 17, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
  </svg>
);
export const SpeakerOn = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} strokeLinejoin="round" className={className}>
    <path d="M11 5L6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);
export const SpeakerOff = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} strokeLinejoin="round" className={className}>
    <path d="M11 5L6 9H3v6h3l5 4V5z" />
    <path d="M16 9l5 6M21 9l-5 6" />
  </svg>
);
export const Asterisk = ({ size = 12, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
  </svg>
);
