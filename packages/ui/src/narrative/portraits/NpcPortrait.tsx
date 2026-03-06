import React from 'react';

export interface NpcPortraitProps {
  portraitId: string;
  size?: number;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

function FallbackPortrait({
  portraitId,
  size,
}: {
  portraitId: string;
  size: number;
}): React.JSX.Element {
  let hash = 0;
  for (let i = 0; i < portraitId.length; i++) {
    hash = portraitId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const color = `hsl(${h}, 70%, 50%)`;
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: `${color}18`,
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        fontSize: size * 0.125,
        fontFamily: FONT_FAMILY,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        boxShadow: `0 0 12px ${color}44`,
      }}
    >
      {portraitId.slice(0, 3)}
    </div>
  );
}

const PORTRAITS: Record<string, (size: number) => React.JSX.Element> = {
  // ── Security guard: helmet, orange visor, badge ─────────────────────────────
  guard: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Guard portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Shoulders */}
      <path d="M 0 80 L 2 62 L 18 56 L 28 54 L 52 54 L 62 56 L 78 62 L 80 80 Z" fill="#1c2030" />
      <rect x="0" y="60" width="80" height="2" fill="#ff9f1c" opacity="0.4" />
      {/* Neck */}
      <rect x="32" y="52" width="16" height="6" fill="#252838" />
      {/* Face */}
      <rect x="20" y="22" width="40" height="34" rx="3" fill="#252838" />
      {/* Helmet */}
      <path d="M 16 36 L 16 22 Q 16 10 40 10 Q 64 10 64 22 L 64 36 Z" fill="#1c2030" />
      <rect x="22" y="8" width="36" height="8" rx="4" fill="#1c2030" />
      {/* Orange visor */}
      <rect
        x="18"
        y="30"
        width="44"
        height="13"
        rx="2"
        fill="#ff9f1c"
        opacity="0.75"
        style={{ filter: 'drop-shadow(0 0 4px #ff9f1c88)' }}
      />
      <rect x="20" y="31" width="40" height="4" rx="1" fill="#fff" opacity="0.1" />
      {/* Chin / jaw */}
      <path d="M 22 50 Q 40 58 58 50" fill="none" stroke="#333" strokeWidth="1" />
      {/* Stern mouth */}
      <line x1="30" y1="50" x2="50" y2="50" stroke="#555" strokeWidth="2" />
      {/* Chest badge */}
      <rect x="33" y="62" width="14" height="9" rx="1" fill="#ff9f1c" opacity="0.65" />
      <line x1="40" y1="62" x2="40" y2="71" stroke="#0a0e14" strokeWidth="1" />
      <line x1="33" y1="66" x2="47" y2="66" stroke="#0a0e14" strokeWidth="1" />
      {/* Accent lines */}
      <line x1="4" y1="33" x2="14" y2="33" stroke="#ff9f1c" strokeWidth="1" opacity="0.4" />
      <line x1="66" y1="33" x2="76" y2="33" stroke="#ff9f1c" strokeWidth="1" opacity="0.4" />
    </svg>
  ),

  // ── Dr. Silva: goggles on forehead, messy hair, green accent ────────────────
  silva: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dr. Silva portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Lab coat */}
      <path d="M 2 80 L 4 60 L 20 56 L 28 54 L 52 54 L 60 56 L 76 60 L 78 80 Z" fill="#1e2535" />
      <path d="M 36 56 L 40 66 L 44 56" fill="none" stroke="#2a3a50" strokeWidth="2" />
      {/* Neck */}
      <rect x="33" y="52" width="14" height="6" fill="#2d2d44" />
      {/* Face oval */}
      <ellipse cx="40" cy="40" rx="20" ry="22" fill="#2d2d44" />
      {/* Messy hair */}
      <ellipse cx="40" cy="19" rx="22" ry="12" fill="#1a1a2e" />
      <path d="M 19 23 Q 15 12 21 8 Q 24 16 20 23" fill="#1a1a2e" />
      <path d="M 29 13 Q 27 4 33 2 Q 36 10 30 14" fill="#1a1a2e" />
      <path d="M 49 11 Q 53 3 57 6 Q 54 13 49 12" fill="#1a1a2e" />
      <path d="M 59 20 Q 66 13 64 23" fill="#1a1a2e" />
      {/* Goggles pushed up on forehead */}
      <rect
        x="21"
        y="17"
        width="38"
        height="12"
        rx="6"
        fill="#111827"
        stroke="#00ff88"
        strokeWidth="1.5"
      />
      <circle cx="31" cy="23" r="5" fill="#00ff88" opacity="0.1" stroke="#00ff88" strokeWidth="1" />
      <circle cx="49" cy="23" r="5" fill="#00ff88" opacity="0.1" stroke="#00ff88" strokeWidth="1" />
      <line x1="36" y1="23" x2="44" y2="23" stroke="#00ff88" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="31" cy="40" rx="5" ry="4" fill="#111827" />
      <circle
        cx="31"
        cy="40"
        r="2.5"
        fill="#00ff88"
        opacity="0.8"
        style={{ filter: 'drop-shadow(0 0 2px #00ff88)' }}
      />
      <ellipse cx="49" cy="40" rx="5" ry="4" fill="#111827" />
      <circle
        cx="49"
        cy="40"
        r="2.5"
        fill="#00ff88"
        opacity="0.8"
        style={{ filter: 'drop-shadow(0 0 2px #00ff88)' }}
      />
      {/* Nose */}
      <path d="M 38 45 Q 37 49 40 50 Q 43 49 42 45" fill="none" stroke="#555" strokeWidth="1" />
      {/* Smile */}
      <path
        d="M 33 53 Q 40 58 47 53"
        fill="none"
        stroke="#00ff88"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  // ── Kai: headset, blue screen reflection, tech vibe ─────────────────────────
  kai: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kai portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Jacket */}
      <path d="M 2 80 L 4 60 L 20 56 L 30 54 L 50 54 L 60 56 L 76 60 L 78 80 Z" fill="#161c2a" />
      {/* Neck */}
      <rect x="34" y="52" width="12" height="6" fill="#2a2a3e" />
      {/* Short hair */}
      <ellipse cx="40" cy="17" rx="20" ry="10" fill="#1a1a2e" />
      <rect x="20" y="14" width="40" height="8" fill="#1a1a2e" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="20" ry="22" fill="#262836" />
      {/* Headset band */}
      <path
        d="M 14 32 Q 14 12 40 12 Q 66 12 66 32"
        fill="none"
        stroke="#2a3a5e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Earcup */}
      <rect
        x="10"
        y="27"
        width="11"
        height="15"
        rx="4"
        fill="#1c2c3a"
        stroke="#00b4d8"
        strokeWidth="1.5"
      />
      {/* Mic boom */}
      <path d="M 21 35 L 27 44 L 32 44" fill="none" stroke="#2a3a5e" strokeWidth="1.5" />
      {/* Blue screen glow on left cheek */}
      <rect x="20" y="30" width="14" height="16" rx="3" fill="#00b4d8" opacity="0.07" />
      {/* Eyes */}
      <ellipse cx="31" cy="36" rx="5" ry="4" fill="#111827" />
      <ellipse
        cx="31"
        cy="36"
        rx="3"
        ry="3"
        fill="#00b4d8"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 2px #00b4d8)' }}
      />
      <ellipse cx="50" cy="36" rx="5" ry="4" fill="#111827" />
      <ellipse
        cx="50"
        cy="36"
        rx="3"
        ry="3"
        fill="#00b4d8"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 2px #00b4d8)' }}
      />
      {/* Nose */}
      <line x1="40" y1="41" x2="40" y2="45" stroke="#555" strokeWidth="1" />
      {/* Mouth */}
      <path
        d="M 34 50 Q 40 54 46 50"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  // ── Reeves: buzz cut, red visor, scar ───────────────────────────────────────
  reeves: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Reeves portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Uniform */}
      <path d="M 0 80 L 2 58 L 20 54 L 30 52 L 50 52 L 60 54 L 78 58 L 80 80 Z" fill="#1c1c2e" />
      {/* Neck */}
      <rect x="33" y="50" width="14" height="6" fill="#282838" />
      {/* Buzz cut — flat top */}
      <rect x="20" y="10" width="40" height="12" rx="2" fill="#1a1a2e" />
      <rect x="18" y="14" width="44" height="6" fill="#1a1a2e" />
      {/* Face — squarish */}
      <rect x="20" y="18" width="40" height="38" rx="3" fill="#2a2a3e" />
      <rect x="18" y="22" width="4" height="28" rx="2" fill="#252535" />
      <rect x="58" y="22" width="4" height="28" rx="2" fill="#252535" />
      {/* Red visor */}
      <rect
        x="20"
        y="27"
        width="40"
        height="13"
        rx="2"
        fill="#ff3a5c"
        opacity="0.72"
        style={{ filter: 'drop-shadow(0 0 5px #ff3a5c88)' }}
      />
      <rect x="22" y="28" width="36" height="4" rx="1" fill="#fff" opacity="0.07" />
      {/* Scar on left cheek */}
      <line x1="24" y1="44" x2="30" y2="53" stroke="#ff3a5c" strokeWidth="2" opacity="0.65" />
      {/* Stern mouth */}
      <line x1="31" y1="50" x2="49" y2="50" stroke="#555" strokeWidth="2" />
      {/* Chin cleft */}
      <line x1="40" y1="50" x2="40" y2="54" stroke="#555" strokeWidth="1" />
    </svg>
  ),

  // ── Patel: round glasses, neat hair, amber accent ───────────────────────────
  patel: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Patel portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Shirt / collar */}
      <path d="M 4 80 L 6 62 L 24 58 L 36 56 L 44 56 L 56 58 L 74 62 L 76 80 Z" fill="#1a2030" />
      <path d="M 38 58 L 40 68 L 42 58" fill="#ffb454" opacity="0.6" />
      {/* Neck */}
      <rect x="34" y="54" width="12" height="6" fill="#2a2a3e" />
      {/* Neat side-parted hair */}
      <ellipse cx="40" cy="18" rx="20" ry="12" fill="#1a1a2e" />
      <line x1="36" y1="10" x2="38" y2="22" stroke="#0a0e14" strokeWidth="2" />
      {/* Face oval */}
      <ellipse cx="40" cy="38" rx="19" ry="22" fill="#2a2a3e" />
      {/* Round glasses */}
      <circle cx="31" cy="36" r="8" fill="none" stroke="#ffb454" strokeWidth="1.5" />
      <circle cx="49" cy="36" r="8" fill="none" stroke="#ffb454" strokeWidth="1.5" />
      <circle cx="31" cy="36" r="7" fill="#ffb454" opacity="0.04" />
      <circle cx="49" cy="36" r="7" fill="#ffb454" opacity="0.04" />
      {/* Bridge & arms */}
      <line x1="39" y1="36" x2="41" y2="36" stroke="#ffb454" strokeWidth="1.5" />
      <line x1="20" y1="34" x2="23" y2="36" stroke="#ffb454" strokeWidth="1.5" />
      <line x1="60" y1="34" x2="57" y2="36" stroke="#ffb454" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="31" cy="36" r="3" fill="#1a1a2e" />
      <circle cx="31" cy="36" r="2" fill="#ffb454" opacity="0.8" />
      <circle cx="49" cy="36" r="3" fill="#1a1a2e" />
      <circle cx="49" cy="36" r="2" fill="#ffb454" opacity="0.8" />
      {/* Nose */}
      <path d="M 38 44 Q 37 48 40 49 Q 43 48 42 44" fill="none" stroke="#555" strokeWidth="1" />
      {/* Slight smile */}
      <path
        d="M 34 52 Q 40 57 46 52"
        fill="none"
        stroke="#ffb454"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  // ── LabBot: circular head, LED eyes, antenna, grille ────────────────────────
  labbot: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lab Bot portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Robot body */}
      <rect x="14" y="58" width="52" height="24" rx="4" fill="#151c26" />
      <rect x="14" y="58" width="52" height="3" fill="#00e5ff" opacity="0.4" />
      {/* Neck joint */}
      <rect
        x="32"
        y="52"
        width="16"
        height="10"
        rx="2"
        fill="#1c2030"
        stroke="#00e5ff"
        strokeWidth="0.5"
      />
      <line x1="36" y1="52" x2="36" y2="62" stroke="#00e5ff" strokeWidth="0.5" opacity="0.5" />
      <line x1="44" y1="52" x2="44" y2="62" stroke="#00e5ff" strokeWidth="0.5" opacity="0.5" />
      {/* Circular head */}
      <circle cx="40" cy="34" r="26" fill="#1c2030" />
      <circle
        cx="40"
        cy="34"
        r="26"
        fill="none"
        stroke="#00e5ff"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px #00e5ff)' }}
      />
      {/* Antenna */}
      <line x1="40" y1="8" x2="40" y2="2" stroke="#00e5ff" strokeWidth="1.5" />
      <circle
        cx="40"
        cy="2"
        r="2.5"
        fill="#00e5ff"
        style={{ filter: 'drop-shadow(0 0 3px #00e5ff)' }}
      />
      {/* Face plate */}
      <rect x="20" y="22" width="40" height="28" rx="3" fill="#111820" />
      {/* LED eyes */}
      <rect
        x="23"
        y="27"
        width="13"
        height="8"
        rx="2"
        fill="#00e5ff"
        opacity="0.8"
        style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }}
      />
      <rect
        x="44"
        y="27"
        width="13"
        height="8"
        rx="2"
        fill="#00e5ff"
        opacity="0.8"
        style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }}
      />
      {/* Mouth grille */}
      <rect
        x="26"
        y="37"
        width="28"
        height="9"
        rx="1"
        fill="#0a0e14"
        stroke="#00e5ff"
        strokeWidth="0.5"
      />
      <line x1="31" y1="37" x2="31" y2="46" stroke="#00e5ff" strokeWidth="0.5" opacity="0.6" />
      <line x1="37" y1="37" x2="37" y2="46" stroke="#00e5ff" strokeWidth="0.5" opacity="0.6" />
      <line x1="43" y1="37" x2="43" y2="46" stroke="#00e5ff" strokeWidth="0.5" opacity="0.6" />
      <line x1="49" y1="37" x2="49" y2="46" stroke="#00e5ff" strokeWidth="0.5" opacity="0.6" />
      {/* Side vents */}
      <line x1="14" y1="28" x2="20" y2="28" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="34" x2="20" y2="34" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="40" x2="20" y2="40" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="28" x2="66" y2="28" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="34" x2="66" y2="34" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="40" x2="66" y2="40" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
    </svg>
  ),

  // ── Voss: eye implant, sharp angular face, purple glow ──────────────────────
  voss: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Voss portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Dark coat */}
      <path d="M 0 80 L 2 56 L 18 50 L 28 48 L 52 48 L 62 50 L 78 56 L 80 80 Z" fill="#10101e" />
      <rect
        x="34"
        y="48"
        width="12"
        height="4"
        rx="1"
        fill="#1a1a2e"
        stroke="#c792ea"
        strokeWidth="0.5"
      />
      {/* Neck */}
      <rect x="34" y="46" width="12" height="6" fill="#252535" />
      {/* Angular face */}
      <polygon points="40,12 62,24 64,52 56,60 24,60 16,52 18,24" fill="#252535" />
      {/* Swept-back hair */}
      <path d="M 18 24 Q 20 10 40 10 Q 60 10 62 24 Q 54 14 40 14 Q 26 14 18 24" fill="#1a1a2e" />
      {/* Sharp cheekbones */}
      <path d="M 18 40 L 24 46 L 20 52" fill="#2a2a40" />
      <path d="M 62 40 L 56 46 L 60 52" fill="#2a2a40" />
      {/* Normal left eye */}
      <ellipse cx="30" cy="34" rx="5" ry="4" fill="#111827" />
      <circle cx="30" cy="34" r="2" fill="#888" />
      {/* Cybernetic right eye implant */}
      <circle
        cx="50"
        cy="34"
        r="11"
        fill="none"
        stroke="#c792ea"
        strokeWidth="0.4"
        opacity="0.35"
      />
      <circle cx="50" cy="34" r="8" fill="none" stroke="#c792ea" strokeWidth="0.7" opacity="0.55" />
      <circle cx="50" cy="34" r="5" fill="none" stroke="#c792ea" strokeWidth="1" opacity="0.8" />
      <circle
        cx="50"
        cy="34"
        r="2"
        fill="#c792ea"
        style={{ filter: 'drop-shadow(0 0 5px #c792ea)' }}
      />
      <circle cx="50" cy="34" r="11" fill="#c792ea" opacity="0.03" />
      {/* Implant data lines */}
      <line x1="58" y1="27" x2="72" y2="20" stroke="#c792ea" strokeWidth="0.5" opacity="0.5" />
      <line x1="61" y1="34" x2="76" y2="34" stroke="#c792ea" strokeWidth="0.5" opacity="0.5" />
      {/* Thin lips */}
      <line x1="32" y1="50" x2="48" y2="50" stroke="#c792ea" strokeWidth="1.5" opacity="0.55" />
    </svg>
  ),

  // ── Chen: hoodie, cyber-monocle, cyan ───────────────────────────────────────
  chen: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Chen portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Hoodie body */}
      <path
        d="M 0 80 L 2 58 L 14 52 L 26 50 L 40 48 L 54 50 L 66 52 L 78 58 L 80 80 Z"
        fill="#161820"
      />
      {/* Hood shadow frame */}
      <ellipse cx="40" cy="36" rx="32" ry="36" fill="#111420" />
      {/* Hood rim */}
      <path d="M 8 24 Q 40 0 72 24 Q 66 16 40 14 Q 14 16 8 24" fill="#1a1c2e" />
      {/* Face */}
      <ellipse cx="40" cy="38" rx="18" ry="20" fill="#282838" />
      {/* Short dark hair */}
      <ellipse cx="40" cy="20" rx="18" ry="10" fill="#111420" />
      {/* Cyber-monocle on right eye */}
      <circle
        cx="50"
        cy="34"
        r="9"
        fill="none"
        stroke="#00ffff"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px #00ffff)' }}
      />
      <circle cx="50" cy="34" r="6" fill="#00ffff" opacity="0.04" />
      <path d="M 59 34 Q 64 37 62 44" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.55" />
      {/* Left eye */}
      <ellipse cx="30" cy="34" rx="5" ry="4" fill="#111827" />
      <circle cx="30" cy="34" r="2.5" fill="#00ffff" opacity="0.65" />
      {/* Monocle eye */}
      <circle cx="50" cy="34" r="3" fill="#111827" />
      <circle
        cx="50"
        cy="34"
        r="2"
        fill="#00ffff"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 2px #00ffff)' }}
      />
      {/* Nose */}
      <path d="M 39 40 Q 38 44 40 45 Q 42 44 41 40" fill="none" stroke="#555" strokeWidth="1" />
      {/* Smirk */}
      <path
        d="M 33 50 Q 39 52 43 49"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Hood front cords */}
      <line x1="26" y1="50" x2="22" y2="72" stroke="#1a1c2e" strokeWidth="3" />
      <line x1="54" y1="50" x2="58" y2="72" stroke="#1a1c2e" strokeWidth="3" />
    </svg>
  ),

  // ── Okafor: beret, thick eyebrows, stern broad face ─────────────────────────
  okafor: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Okafor portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Uniform */}
      <path d="M 2 80 L 4 60 L 22 56 L 30 54 L 50 54 L 58 56 L 76 60 L 78 80 Z" fill="#151e1e" />
      {/* Neck */}
      <rect x="33" y="52" width="14" height="6" fill="#2a2a3a" />
      {/* Broad face */}
      <rect x="18" y="20" width="44" height="38" rx="5" fill="#2a2a3e" />
      {/* Beret */}
      <ellipse cx="40" cy="16" rx="24" ry="12" fill="#253028" />
      <ellipse cx="40" cy="10" rx="18" ry="8" fill="#1e2820" />
      <ellipse cx="40" cy="20" rx="22" ry="5" fill="#1a2218" />
      {/* Beret slant */}
      <path d="M 56 12 Q 64 10 66 18" fill="none" stroke="#253028" strokeWidth="2" />
      {/* Beret badge */}
      <circle cx="30" cy="14" r="3" fill="#b8a99a" opacity="0.75" />
      {/* Thick eyebrows */}
      <rect x="22" y="28" width="14" height="5" rx="2" fill="#0a0a10" />
      <rect x="44" y="28" width="14" height="5" rx="2" fill="#0a0a10" />
      {/* Stern eyes */}
      <rect x="24" y="34" width="10" height="6" rx="1" fill="#111827" />
      <circle cx="29" cy="37" r="2.5" fill="#b8a99a" opacity="0.65" />
      <rect x="46" y="34" width="10" height="6" rx="1" fill="#111827" />
      <circle cx="51" cy="37" r="2.5" fill="#b8a99a" opacity="0.65" />
      {/* Broad nose */}
      <path d="M 37 42 Q 36 48 40 50 Q 44 48 43 42" fill="none" stroke="#555" strokeWidth="1.5" />
      {/* Stern straight mouth */}
      <line x1="30" y1="52" x2="50" y2="52" stroke="#666" strokeWidth="2" />
      {/* Strong jaw */}
      <path d="M 22 50 L 22 56 Q 40 60 58 56 L 58 50" fill="none" stroke="#333" strokeWidth="1" />
    </svg>
  ),

  // ── Jamie: headphones, friendly, green highlights ───────────────────────────
  jamie: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jamie portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Casual shirt */}
      <path d="M 4 80 L 6 62 L 22 58 L 30 56 L 50 56 L 58 58 L 74 62 L 76 80 Z" fill="#162030" />
      {/* Neck */}
      <rect x="34" y="54" width="12" height="6" fill="#2a2a3e" />
      {/* Friendly round face */}
      <ellipse cx="40" cy="38" rx="20" ry="22" fill="#2d2d44" />
      {/* Light medium hair */}
      <ellipse cx="40" cy="18" rx="22" ry="12" fill="#2a2030" />
      <path d="M 20 28 Q 18 18 22 14 Q 30 24 20 28" fill="#2a2030" />
      {/* Headphone band — green */}
      <path
        d="M 14 34 Q 14 12 40 12 Q 66 12 66 34"
        fill="none"
        stroke="#00ff88"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Earcups */}
      <rect
        x="9"
        y="28"
        width="12"
        height="16"
        rx="6"
        fill="#1c2c1c"
        stroke="#00ff88"
        strokeWidth="1.5"
      />
      <rect
        x="59"
        y="28"
        width="12"
        height="16"
        rx="6"
        fill="#1c2c1c"
        stroke="#00ff88"
        strokeWidth="1.5"
      />
      <circle cx="15" cy="36" r="4" fill="#00ff88" opacity="0.18" />
      <circle cx="65" cy="36" r="4" fill="#00ff88" opacity="0.18" />
      {/* Bright friendly eyes */}
      <ellipse cx="31" cy="36" rx="5.5" ry="5" fill="#111827" />
      <circle cx="31" cy="36" r="3" fill="#00ff88" opacity="0.7" />
      <circle cx="30" cy="35" r="1" fill="#fff" opacity="0.35" />
      <ellipse cx="49" cy="36" rx="5.5" ry="5" fill="#111827" />
      <circle cx="49" cy="36" r="3" fill="#00ff88" opacity="0.7" />
      <circle cx="48" cy="35" r="1" fill="#fff" opacity="0.35" />
      {/* Nose */}
      <path d="M 39 43 Q 38 46 40 47 Q 42 46 41 43" fill="none" stroke="#555" strokeWidth="1" />
      {/* Wide friendly smile */}
      <path
        d="M 30 52 Q 40 59 50 52"
        fill="none"
        stroke="#00ff88"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  // ── Diaz: military haircut, earpiece, amber glow ────────────────────────────
  diaz: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Diaz portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Military uniform */}
      <path d="M 0 80 L 2 58 L 20 54 L 30 52 L 50 52 L 60 54 L 78 58 L 80 80 Z" fill="#1a1e28" />
      <rect x="0" y="58" width="80" height="2" fill="#ffb454" opacity="0.35" />
      {/* Neck */}
      <rect x="33" y="50" width="14" height="6" fill="#2a2a3e" />
      {/* Military flat top hair */}
      <rect x="22" y="10" width="36" height="9" rx="2" fill="#1a1a2e" />
      <rect x="20" y="14" width="40" height="6" fill="#1a1a2e" />
      {/* Angular face */}
      <rect x="20" y="18" width="40" height="38" rx="3" fill="#262838" />
      <rect x="18" y="20" width="4" height="30" rx="2" fill="#202030" />
      <rect x="58" y="20" width="4" height="30" rx="2" fill="#202030" />
      {/* Eyes */}
      <rect x="23" y="28" width="14" height="9" rx="2" fill="#111827" />
      <circle cx="30" cy="32.5" r="3" fill="#888" opacity="0.65" />
      <rect x="43" y="28" width="14" height="9" rx="2" fill="#111827" />
      <circle cx="50" cy="32.5" r="3" fill="#888" opacity="0.65" />
      {/* Earpiece — right */}
      <circle
        cx="62"
        cy="33"
        r="4.5"
        fill="#1a2030"
        stroke="#ffb454"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px #ffb454)' }}
      />
      <circle cx="62" cy="33" r="2" fill="#ffb454" opacity="0.6" />
      <path
        d="M 62 37.5 Q 64 43 62 47"
        fill="none"
        stroke="#ffb454"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Nose */}
      <rect x="38" y="40" width="4" height="8" rx="2" fill="#333" />
      {/* Straight firm mouth */}
      <line x1="30" y1="50" x2="50" y2="50" stroke="#666" strokeWidth="1.5" />
    </svg>
  ),

  // ── Echo: hexagonal AI face, magenta digital patterns ───────────────────────
  echo: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Echo AI portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Grid background */}
      <line x1="0" y1="20" x2="80" y2="20" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      <line x1="0" y1="40" x2="80" y2="40" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      <line x1="0" y1="60" x2="80" y2="60" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      <line x1="20" y1="0" x2="20" y2="80" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      <line x1="40" y1="0" x2="40" y2="80" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      <line x1="60" y1="0" x2="60" y2="80" stroke="#ff00ff" strokeWidth="0.3" opacity="0.18" />
      {/* Hexagonal head */}
      <polygon points="40,10 62,22 62,46 40,58 18,46 18,22" fill="#1a0a1e" />
      <polygon
        points="40,10 62,22 62,46 40,58 18,46 18,22"
        fill="none"
        stroke="#ff00ff"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px #ff00ff)' }}
      />
      <polygon
        points="40,16 57,26 57,44 40,54 23,44 23,26"
        fill="none"
        stroke="#ff00ff"
        strokeWidth="0.5"
        opacity="0.35"
      />
      {/* Abstract triangle eyes */}
      <polygon
        points="27,30 35,30 31,39"
        fill="#ff00ff"
        style={{ filter: 'drop-shadow(0 0 4px #ff00ff)' }}
      />
      <polygon
        points="45,30 53,30 49,39"
        fill="#ff00ff"
        style={{ filter: 'drop-shadow(0 0 4px #ff00ff)' }}
      />
      {/* Data stream */}
      <line x1="18" y1="34" x2="62" y2="34" stroke="#ff00ff" strokeWidth="0.4" opacity="0.3" />
      {/* Abstract mouth — binary bar */}
      <rect x="28" y="46" width="24" height="3" rx="1" fill="#ff00ff" opacity="0.45" />
      <rect x="32" y="46" width="4" height="3" fill="#ff00ff" opacity="0.8" />
      <rect x="44" y="46" width="4" height="3" fill="#ff00ff" opacity="0.8" />
      {/* Vertex nodes */}
      <circle
        cx="40"
        cy="10"
        r="2"
        fill="#ff00ff"
        style={{ filter: 'drop-shadow(0 0 3px #ff00ff)' }}
      />
      <circle cx="62" cy="22" r="2" fill="#ff00ff" opacity="0.55" />
      <circle cx="62" cy="46" r="2" fill="#ff00ff" opacity="0.55" />
      <circle cx="40" cy="58" r="2" fill="#ff00ff" opacity="0.55" />
      <circle cx="18" cy="46" r="2" fill="#ff00ff" opacity="0.55" />
      <circle cx="18" cy="22" r="2" fill="#ff00ff" opacity="0.55" />
      {/* Neck/body */}
      <rect
        x="32"
        y="58"
        width="16"
        height="22"
        rx="2"
        fill="#1a0a1e"
        stroke="#ff00ff"
        strokeWidth="0.5"
        opacity="0.4"
      />
    </svg>
  ),

  // ── Kim: slicked hair, monocle, gold accents ─────────────────────────────────
  kim: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kim portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Expensive suit */}
      <path
        d="M 0 80 L 2 52 L 14 46 L 26 44 L 40 40 L 54 44 L 66 46 L 78 52 L 80 80 Z"
        fill="#0c0e18"
      />
      {/* Lapels */}
      <path d="M 30 46 L 22 60 L 18 80" fill="none" stroke="#161828" strokeWidth="4" />
      <path d="M 50 46 L 58 60 L 62 80" fill="none" stroke="#161828" strokeWidth="4" />
      {/* Gold collar pin */}
      <path
        d="M 32 46 L 40 54 L 48 46"
        fill="none"
        stroke="#ffd700"
        strokeWidth="1.5"
        opacity="0.65"
      />
      <rect x="38" y="52" width="4" height="10" rx="1" fill="#ffd700" opacity="0.6" />
      {/* Neck */}
      <rect x="34" y="42" width="12" height="8" fill="#252535" />
      {/* Slicked-back hair */}
      <path d="M 18 22 Q 20 6 40 6 Q 60 6 62 22 Q 52 10 40 10 Q 28 10 18 22" fill="#0e1018" />
      <path d="M 18 22 L 62 22 L 58 16 Q 48 10 40 10 Q 32 10 22 16 Z" fill="#14161e" />
      {/* Angular face */}
      <polygon points="22,22 58,22 62,50 56,58 24,58 18,50" fill="#252535" />
      {/* Monocle on right eye */}
      <circle
        cx="50"
        cy="33"
        r="9"
        fill="none"
        stroke="#ffd700"
        strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }}
      />
      <circle cx="50" cy="33" r="6" fill="#ffd700" opacity="0.04" />
      <line x1="59" y1="37" x2="64" y2="45" stroke="#ffd700" strokeWidth="1.5" opacity="0.65" />
      {/* Left eye */}
      <ellipse cx="30" cy="33" rx="5" ry="4" fill="#111827" />
      <circle cx="30" cy="33" r="2.5" fill="#888" />
      {/* Right eye */}
      <circle cx="50" cy="33" r="3" fill="#111827" />
      <circle cx="50" cy="33" r="2" fill="#ffd700" opacity="0.8" />
      {/* Thin lips */}
      <path d="M 34 48 Q 40 50 46 48" fill="none" stroke="#888" strokeWidth="1.5" />
      {/* Cufflinks */}
      <circle cx="14" cy="56" r="3" fill="#ffd700" opacity="0.45" />
      <circle cx="66" cy="56" r="3" fill="#ffd700" opacity="0.45" />
    </svg>
  ),

  // ── Blackwell: full face mask, red eye slits ─────────────────────────────────
  blackwell: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Blackwell portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#050810" />
      {/* Heavy armor shoulders */}
      <path
        d="M 0 80 L 0 50 L 12 46 L 20 54 L 26 52 L 54 52 L 60 54 L 68 46 L 80 50 L 80 80 Z"
        fill="#111118"
      />
      <polygon points="0,50 12,46 14,58 6,62" fill="#181820" />
      <polygon points="80,50 68,46 66,58 74,62" fill="#181820" />
      {/* Neck */}
      <rect x="30" y="50" width="20" height="6" fill="#0f0f1a" />
      {/* Full face mask */}
      <rect x="16" y="12" width="48" height="48" rx="4" fill="#0f0f1a" />
      <rect
        x="16"
        y="12"
        width="48"
        height="48"
        rx="4"
        fill="none"
        stroke="#2a2a38"
        strokeWidth="1.5"
      />
      {/* Helmet top */}
      <rect x="18" y="8" width="44" height="10" rx="4" fill="#0d0d18" />
      <rect x="22" y="6" width="36" height="8" rx="4" fill="#0d0d18" />
      {/* Ventilation slots */}
      <line x1="22" y1="46" x2="38" y2="46" stroke="#1e1e2c" strokeWidth="1.5" />
      <line x1="22" y1="50" x2="38" y2="50" stroke="#1e1e2c" strokeWidth="1.5" />
      <line x1="22" y1="54" x2="38" y2="54" stroke="#1e1e2c" strokeWidth="1.5" />
      {/* Red eye slits */}
      <rect
        x="20"
        y="27"
        width="16"
        height="6"
        rx="1"
        fill="#ff0000"
        opacity="0.85"
        style={{ filter: 'drop-shadow(0 0 7px #ff0000)' }}
      />
      <rect
        x="44"
        y="27"
        width="16"
        height="6"
        rx="1"
        fill="#ff0000"
        opacity="0.85"
        style={{ filter: 'drop-shadow(0 0 7px #ff0000)' }}
      />
      {/* Center seam */}
      <line x1="40" y1="12" x2="40" y2="60" stroke="#191926" strokeWidth="1" />
      {/* Mask tech badge */}
      <circle cx="40" cy="44" r="4" fill="none" stroke="#222232" strokeWidth="1" />
      <circle cx="40" cy="44" r="2" fill="#111118" />
    </svg>
  ),

  // ── Kowalski: hardhat, grease marks, orange ──────────────────────────────────
  kowalski: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kowalski portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Work overalls */}
      <path d="M 2 80 L 4 58 L 20 54 L 30 52 L 50 52 L 60 54 L 76 58 L 78 80 Z" fill="#1c1a14" />
      <rect x="34" y="52" width="12" height="30" rx="2" fill="#252018" />
      {/* Neck */}
      <rect x="33" y="50" width="14" height="6" fill="#2a2a3a" />
      {/* Orange hard hat */}
      <path d="M 14 24 Q 14 6 40 6 Q 66 6 66 24 Z" fill="#ff6b35" />
      <rect
        x="10"
        y="22"
        width="60"
        height="6"
        rx="3"
        fill="#ff6b35"
        style={{ filter: 'drop-shadow(0 0 3px #ff6b3555)' }}
      />
      <rect x="12" y="22" width="56" height="4" rx="2" fill="#e05a28" />
      {/* Face — rugged */}
      <rect x="20" y="24" width="40" height="32" rx="4" fill="#2a2838" />
      {/* Grease marks */}
      <line x1="30" y1="26" x2="27" y2="38" stroke="#111" strokeWidth="2" opacity="0.55" />
      <line x1="52" y1="28" x2="54" y2="36" stroke="#111" strokeWidth="1.5" opacity="0.45" />
      <line x1="42" y1="24" x2="44" y2="32" stroke="#111" strokeWidth="1.5" opacity="0.4" />
      {/* Squinting eyes */}
      <rect x="24" y="30" width="12" height="7" rx="2" fill="#111827" />
      <circle cx="30" cy="33.5" r="2.5" fill="#888" opacity="0.65" />
      <rect x="44" y="30" width="12" height="7" rx="2" fill="#111827" />
      <circle cx="50" cy="33.5" r="2.5" fill="#888" opacity="0.65" />
      {/* Broad nose */}
      <path d="M 36 40 Q 35 46 40 47 Q 45 46 44 40" fill="none" stroke="#555" strokeWidth="1.5" />
      {/* Gruff expression */}
      <path
        d="M 29 50 Q 40 47 51 50"
        fill="none"
        stroke="#666"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Hat brim lines */}
      <line x1="20" y1="26" x2="14" y2="30" stroke="#e05a28" strokeWidth="1" />
      <line x1="60" y1="26" x2="66" y2="30" stroke="#e05a28" strokeWidth="1" />
    </svg>
  ),

  // ── Delta-7: angular industrial bot, amber LED eyes ──────────────────────────
  delta7: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Delta-7 portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Industrial body */}
      <rect x="10" y="58" width="60" height="24" rx="2" fill="#141c14" />
      <rect x="10" y="58" width="60" height="3" fill="#ff8c00" opacity="0.4" />
      {/* Arm joints */}
      <rect
        x="4"
        y="52"
        width="12"
        height="6"
        rx="2"
        fill="#1a1a14"
        stroke="#ff8c00"
        strokeWidth="0.5"
      />
      <rect
        x="64"
        y="52"
        width="12"
        height="6"
        rx="2"
        fill="#1a1a14"
        stroke="#ff8c00"
        strokeWidth="0.5"
      />
      {/* Neck */}
      <rect
        x="30"
        y="52"
        width="20"
        height="10"
        fill="#141c14"
        stroke="#ff8c00"
        strokeWidth="0.5"
      />
      <line x1="34" y1="52" x2="34" y2="62" stroke="#ff8c00" strokeWidth="0.5" opacity="0.5" />
      <line x1="46" y1="52" x2="46" y2="62" stroke="#ff8c00" strokeWidth="0.5" opacity="0.5" />
      {/* Angular head */}
      <rect x="14" y="12" width="52" height="44" rx="4" fill="#141c1e" />
      <rect
        x="14"
        y="12"
        width="52"
        height="44"
        rx="4"
        fill="none"
        stroke="#ff8c00"
        strokeWidth="1.5"
      />
      {/* Corner bolts */}
      <circle cx="18" cy="16" r="2" fill="#1a1a14" stroke="#ff8c00" strokeWidth="1" />
      <circle cx="62" cy="16" r="2" fill="#1a1a14" stroke="#ff8c00" strokeWidth="1" />
      <circle cx="18" cy="52" r="2" fill="#1a1a14" stroke="#ff8c00" strokeWidth="1" />
      <circle cx="62" cy="52" r="2" fill="#1a1a14" stroke="#ff8c00" strokeWidth="1" />
      {/* Face plate */}
      <rect x="20" y="18" width="40" height="32" rx="2" fill="#111820" />
      {/* Rectangular LED eyes */}
      <rect
        x="22"
        y="24"
        width="14"
        height="9"
        rx="1"
        fill="#ff8c00"
        opacity="0.82"
        style={{ filter: 'drop-shadow(0 0 4px #ff8c00)' }}
      />
      <rect
        x="44"
        y="24"
        width="14"
        height="9"
        rx="1"
        fill="#ff8c00"
        opacity="0.82"
        style={{ filter: 'drop-shadow(0 0 4px #ff8c00)' }}
      />
      {/* Model designation */}
      <text
        x="40"
        y="38"
        textAnchor="middle"
        fill="#ff8c00"
        fontSize="5"
        fontFamily="monospace"
        opacity="0.65"
      >
        Δ-7
      </text>
      {/* Lower grille */}
      <rect
        x="26"
        y="40"
        width="28"
        height="7"
        rx="1"
        fill="#0a0e14"
        stroke="#ff8c00"
        strokeWidth="0.5"
      />
      <line x1="32" y1="40" x2="32" y2="47" stroke="#ff8c00" strokeWidth="0.5" opacity="0.55" />
      <line x1="40" y1="40" x2="40" y2="47" stroke="#ff8c00" strokeWidth="0.5" opacity="0.55" />
      <line x1="48" y1="40" x2="48" y2="47" stroke="#ff8c00" strokeWidth="0.5" opacity="0.55" />
    </svg>
  ),

  // ── Volkov: heavy armor, cold blue visor ─────────────────────────────────────
  volkov: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Volkov portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#060c12" />
      {/* Massive armor shoulders */}
      <path
        d="M -4 80 L -4 52 L 8 46 L 16 54 L 22 50 L 58 50 L 64 54 L 72 46 L 84 52 L 84 80 Z"
        fill="#0e1420"
      />
      <polygon points="0,50 12,46 14,58 6,62" fill="#141c26" />
      <polygon points="80,50 68,46 66,58 74,62" fill="#141c26" />
      {/* Chest plate */}
      <rect
        x="20"
        y="54"
        width="40"
        height="28"
        rx="2"
        fill="#0e1420"
        stroke="#4da6ff"
        strokeWidth="0.5"
        opacity="0.55"
      />
      <line x1="40" y1="54" x2="40" y2="82" stroke="#4da6ff" strokeWidth="0.5" opacity="0.4" />
      {/* Heavy neck gorget */}
      <rect x="28" y="48" width="24" height="8" fill="#111820" />
      {/* Full helmet */}
      <path d="M 14 42 L 14 20 Q 14 8 40 8 Q 66 8 66 20 L 66 42 Z" fill="#111820" />
      <rect x="12" y="40" width="56" height="4" rx="1" fill="#0e1624" />
      {/* Cold blue visor */}
      <rect
        x="16"
        y="22"
        width="48"
        height="20"
        rx="2"
        fill="#4da6ff"
        opacity="0.6"
        style={{ filter: 'drop-shadow(0 0 6px #4da6ff88)' }}
      />
      <rect x="18" y="23" width="44" height="5" rx="1" fill="#fff" opacity="0.06" />
      {/* Helm center seam */}
      <line x1="40" y1="8" x2="40" y2="42" stroke="#1a2a3a" strokeWidth="1" />
      {/* Side accent */}
      <line x1="14" y1="32" x2="8" y2="32" stroke="#4da6ff" strokeWidth="0.5" opacity="0.5" />
      <line x1="66" y1="32" x2="72" y2="32" stroke="#4da6ff" strokeWidth="0.5" opacity="0.5" />
      {/* Chest rivets */}
      <circle cx="28" cy="60" r="2" fill="#0e1420" stroke="#4da6ff" strokeWidth="0.5" />
      <circle cx="52" cy="60" r="2" fill="#0e1420" stroke="#4da6ff" strokeWidth="0.5" />
    </svg>
  ),

  // ── AI Fragment: corrupted/glitchy, static, red ──────────────────────────────
  aifragment: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AI Fragment portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0614" />
      {/* Corruption stripe overlays */}
      <rect x="0" y="16" width="80" height="2" fill="#ff2222" opacity="0.18" />
      <rect x="0" y="34" width="80" height="3" fill="#ff2222" opacity="0.12" />
      <rect x="0" y="52" width="80" height="1" fill="#ff2222" opacity="0.1" />
      {/* Base face */}
      <rect x="16" y="14" width="48" height="52" rx="3" fill="#1a0a10" />
      {/* Glitch shift — upper face */}
      <rect x="24" y="14" width="40" height="18" rx="2" fill="#1a0a10" transform="translate(4,0)" />
      {/* Glitch shift — lower face */}
      <rect
        x="12"
        y="38"
        width="40"
        height="28"
        rx="2"
        fill="#1a0a10"
        transform="translate(-3,0)"
      />
      {/* Corrupted left eye */}
      <rect
        x="22"
        y="27"
        width="14"
        height="4"
        fill="#ff2222"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 5px #ff2222)' }}
      />
      <rect
        x="20"
        y="25"
        width="14"
        height="8"
        rx="1"
        fill="#ff2222"
        opacity="0.3"
        transform="translate(2,0)"
      />
      {/* Corrupted right eye */}
      <rect
        x="44"
        y="27"
        width="14"
        height="4"
        fill="#ff2222"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 5px #ff2222)' }}
      />
      <rect
        x="46"
        y="25"
        width="12"
        height="8"
        rx="1"
        fill="#ff2222"
        opacity="0.25"
        transform="translate(-2,0)"
      />
      {/* Static noise rects */}
      <rect x="18" y="22" width="6" height="2" fill="#ff2222" opacity="0.28" />
      <rect x="52" y="36" width="10" height="2" fill="#ff2222" opacity="0.22" />
      <rect x="28" y="44" width="4" height="2" fill="#ff2222" opacity="0.38" />
      <rect x="48" y="17" width="8" height="2" fill="#ff2222" opacity="0.18" />
      <rect x="14" y="48" width="6" height="2" fill="#ff2222" opacity="0.15" />
      {/* Corrupted mouth */}
      <rect x="26" y="44" width="28" height="4" rx="1" fill="#ff2222" opacity="0.25" />
      <rect
        x="28"
        y="44"
        width="8"
        height="4"
        fill="#ff2222"
        opacity="0.55"
        transform="translate(-2,0)"
      />
      <rect
        x="46"
        y="44"
        width="8"
        height="4"
        fill="#ff2222"
        opacity="0.55"
        transform="translate(2,0)"
      />
      {/* Body/neck */}
      <rect x="32" y="58" width="16" height="22" fill="#1a0a10" />
    </svg>
  ),

  // ── Core Guardian: symmetrical AI, green matrix patterns ────────────────────
  coreguardian: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Core Guardian portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#000a08" />
      {/* Matrix grid */}
      <line x1="20" y1="0" x2="20" y2="80" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      <line x1="40" y1="0" x2="40" y2="80" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      <line x1="60" y1="0" x2="60" y2="80" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      <line x1="0" y1="20" x2="80" y2="20" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      <line x1="0" y1="40" x2="80" y2="40" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      <line x1="0" y1="60" x2="80" y2="60" stroke="#00ff44" strokeWidth="0.3" opacity="0.1" />
      {/* Perfect circle head */}
      <circle cx="40" cy="34" r="26" fill="#001008" />
      <circle
        cx="40"
        cy="34"
        r="26"
        fill="none"
        stroke="#00ff44"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px #00ff44)' }}
      />
      <circle
        cx="40"
        cy="34"
        r="22"
        fill="none"
        stroke="#00ff44"
        strokeWidth="0.5"
        opacity="0.35"
      />
      {/* Symmetrical circuit arms */}
      <line x1="14" y1="34" x2="20" y2="34" stroke="#00ff44" strokeWidth="1" opacity="0.65" />
      <line x1="60" y1="34" x2="66" y2="34" stroke="#00ff44" strokeWidth="1" opacity="0.65" />
      <line x1="40" y1="8" x2="40" y2="14" stroke="#00ff44" strokeWidth="1" opacity="0.65" />
      <line x1="40" y1="54" x2="40" y2="60" stroke="#00ff44" strokeWidth="1" opacity="0.65" />
      <line x1="21" y1="15" x2="26" y2="20" stroke="#00ff44" strokeWidth="1" opacity="0.45" />
      <line x1="59" y1="15" x2="54" y2="20" stroke="#00ff44" strokeWidth="1" opacity="0.45" />
      <line x1="21" y1="53" x2="26" y2="48" stroke="#00ff44" strokeWidth="1" opacity="0.45" />
      <line x1="59" y1="53" x2="54" y2="48" stroke="#00ff44" strokeWidth="1" opacity="0.45" />
      {/* Symmetrical eyes */}
      <rect
        x="24"
        y="26"
        width="12"
        height="8"
        rx="2"
        fill="#00ff44"
        opacity="0.7"
        style={{ filter: 'drop-shadow(0 0 4px #00ff44)' }}
      />
      <rect
        x="44"
        y="26"
        width="12"
        height="8"
        rx="2"
        fill="#00ff44"
        opacity="0.7"
        style={{ filter: 'drop-shadow(0 0 4px #00ff44)' }}
      />
      {/* Central processor */}
      <circle cx="40" cy="38" r="3" fill="none" stroke="#00ff44" strokeWidth="1" opacity="0.55" />
      <circle cx="40" cy="38" r="1" fill="#00ff44" opacity="0.55" />
      {/* Data-bar mouth */}
      <rect x="28" y="44" width="24" height="3" rx="1" fill="#00ff44" opacity="0.45" />
      <rect x="32" y="44" width="4" height="3" fill="#00ff44" opacity="0.8" />
      <rect x="44" y="44" width="4" height="3" fill="#00ff44" opacity="0.8" />
      {/* Neck */}
      <rect
        x="34"
        y="60"
        width="12"
        height="20"
        rx="2"
        fill="#001008"
        stroke="#00ff44"
        strokeWidth="0.5"
        opacity="0.45"
      />
    </svg>
  ),

  // ── Ghost: ethereal, semi-transparent, wispy ────────────────────────────────
  ghost: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ghost portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#080a12" />
      {/* Ethereal ambient glow */}
      <ellipse cx="40" cy="40" rx="30" ry="35" fill="#aaaacc" opacity="0.03" />
      <ellipse cx="40" cy="40" rx="22" ry="27" fill="#aaaacc" opacity="0.04" />
      {/* Wispy head */}
      <ellipse cx="40" cy="34" rx="20" ry="24" fill="#aaaacc" opacity="0.10" />
      {/* Wispy tendrils */}
      <path d="M 20 30 Q 14 20 18 10 Q 20 18 22 28" fill="#aaaacc" opacity="0.07" />
      <path d="M 60 28 Q 66 18 62 8 Q 60 16 58 26" fill="#aaaacc" opacity="0.07" />
      <path d="M 40 58 Q 34 66 36 76 Q 40 68 44 76 Q 46 66 40 58" fill="#aaaacc" opacity="0.05" />
      {/* Faint outline */}
      <ellipse
        cx="40"
        cy="34"
        rx="20"
        ry="24"
        fill="none"
        stroke="#aaaacc"
        strokeWidth="0.5"
        opacity="0.2"
      />
      {/* Hollow eyes */}
      <ellipse cx="31" cy="30" rx="5" ry="4" fill="#aaaacc" opacity="0.18" />
      <ellipse cx="49" cy="30" rx="5" ry="4" fill="#aaaacc" opacity="0.18" />
      <ellipse cx="31" cy="30" rx="3" ry="2.5" fill="#080a12" opacity="0.55" />
      <ellipse cx="49" cy="30" rx="3" ry="2.5" fill="#080a12" opacity="0.55" />
      {/* Faint nose */}
      <path
        d="M 38 36 Q 37 40 40 41 Q 43 40 42 36"
        fill="none"
        stroke="#aaaacc"
        strokeWidth="0.5"
        opacity="0.25"
      />
      {/* Open ghostly mouth */}
      <ellipse cx="40" cy="46" rx="6" ry="3" fill="#080a12" opacity="0.45" />
      <ellipse
        cx="40"
        cy="46"
        rx="6"
        ry="3"
        fill="none"
        stroke="#aaaacc"
        strokeWidth="0.5"
        opacity="0.25"
      />
      {/* Floating particles */}
      <circle cx="22" cy="16" r="1.5" fill="#aaaacc" opacity="0.18" />
      <circle cx="58" cy="12" r="1" fill="#aaaacc" opacity="0.14" />
      <circle cx="16" cy="44" r="1" fill="#aaaacc" opacity="0.13" />
      <circle cx="64" cy="48" r="1.5" fill="#aaaacc" opacity="0.1" />
    </svg>
  ),

  // ── Sterling: CEO, sharp suit, monocle, gold ────────────────────────────────
  sterling: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sterling portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#0a0e14" />
      {/* Bespoke suit */}
      <path
        d="M 0 80 L 2 52 L 14 46 L 26 44 L 40 40 L 54 44 L 66 46 L 78 52 L 80 80 Z"
        fill="#0c0e18"
      />
      <path d="M 30 46 L 22 60 L 18 80" fill="none" stroke="#161828" strokeWidth="4" />
      <path d="M 50 46 L 58 60 L 62 80" fill="none" stroke="#161828" strokeWidth="4" />
      {/* Silk tie with gold pin */}
      <path d="M 36 46 L 40 58 L 44 46" fill="#1a1428" stroke="#ffd700" strokeWidth="0.5" />
      <rect x="38" y="52" width="4" height="10" rx="1" fill="#ffd700" opacity="0.55" />
      {/* Gold collar line */}
      <path
        d="M 32 46 L 40 54 L 48 46"
        fill="none"
        stroke="#ffd700"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Neck */}
      <rect x="34" y="42" width="12" height="8" fill="#252535" />
      {/* Perfectly slicked hair */}
      <path d="M 18 22 Q 20 6 40 6 Q 60 6 62 22 Q 52 10 40 10 Q 28 10 18 22" fill="#0e1018" />
      <path d="M 18 22 L 62 22 L 58 16 Q 48 10 40 10 Q 32 10 22 16 Z" fill="#14161e" />
      {/* Face */}
      <polygon points="22,22 58,22 62,50 56,58 24,58 18,50" fill="#252535" />
      <line x1="22" y1="42" x2="18" y2="50" stroke="#1e1e2e" strokeWidth="2" />
      <line x1="58" y1="42" x2="62" y2="50" stroke="#1e1e2e" strokeWidth="2" />
      {/* Gold monocle */}
      <circle
        cx="50"
        cy="33"
        r="9"
        fill="none"
        stroke="#ffd700"
        strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }}
      />
      <circle cx="50" cy="33" r="6" fill="#ffd700" opacity="0.03" />
      <line x1="59" y1="37" x2="64" y2="45" stroke="#ffd700" strokeWidth="1.5" opacity="0.6" />
      {/* Left eye */}
      <ellipse cx="30" cy="33" rx="5" ry="4" fill="#111827" />
      <circle cx="30" cy="33" r="2.5" fill="#888" />
      {/* Right eye */}
      <circle cx="50" cy="33" r="3" fill="#111827" />
      <circle cx="50" cy="33" r="2" fill="#ffd700" opacity="0.8" />
      {/* Defined lips */}
      <path d="M 34 48 Q 40 50 46 48" fill="none" stroke="#888" strokeWidth="1.5" />
      {/* Gold cufflinks */}
      <circle cx="14" cy="56" r="3" fill="#ffd700" opacity="0.4" />
      <circle cx="66" cy="56" r="3" fill="#ffd700" opacity="0.4" />
    </svg>
  ),

  // ── Nova: sleek AI assistant, holographic teal ──────────────────────────────
  nova: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nova portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#040c10" />
      {/* Holographic ambient */}
      <ellipse cx="40" cy="38" rx="28" ry="32" fill="#00d4aa" opacity="0.04" />
      {/* Holographic scan lines */}
      <line x1="8" y1="22" x2="72" y2="22" stroke="#00d4aa" strokeWidth="0.3" opacity="0.28" />
      <line x1="8" y1="30" x2="72" y2="30" stroke="#00d4aa" strokeWidth="0.3" opacity="0.28" />
      <line x1="8" y1="38" x2="72" y2="38" stroke="#00d4aa" strokeWidth="0.3" opacity="0.28" />
      <line x1="8" y1="46" x2="72" y2="46" stroke="#00d4aa" strokeWidth="0.3" opacity="0.28" />
      {/* Holographic face outline (dashed) */}
      <ellipse
        cx="40"
        cy="36"
        rx="20"
        ry="24"
        fill="none"
        stroke="#00d4aa"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        style={{ filter: 'drop-shadow(0 0 3px #00d4aa)' }}
      />
      <ellipse cx="40" cy="36" rx="20" ry="24" fill="#00d4aa" opacity="0.04" />
      {/* Smooth hair */}
      <path
        d="M 20 24 Q 20 10 40 10 Q 60 10 60 24 Q 52 14 40 14 Q 28 14 20 24"
        fill="#00302a"
        opacity="0.8"
      />
      {/* Sleek eyes */}
      <ellipse cx="31" cy="32" rx="6" ry="4" fill="#040c10" />
      <ellipse
        cx="31"
        cy="32"
        rx="4"
        ry="3"
        fill="#00d4aa"
        opacity="0.7"
        style={{ filter: 'drop-shadow(0 0 3px #00d4aa)' }}
      />
      <ellipse cx="49" cy="32" rx="6" ry="4" fill="#040c10" />
      <ellipse
        cx="49"
        cy="32"
        rx="4"
        ry="3"
        fill="#00d4aa"
        opacity="0.7"
        style={{ filter: 'drop-shadow(0 0 3px #00d4aa)' }}
      />
      <ellipse cx="29" cy="30" rx="1.5" ry="1" fill="#fff" opacity="0.35" />
      <ellipse cx="47" cy="30" rx="1.5" ry="1" fill="#fff" opacity="0.35" />
      {/* Refined nose */}
      <line x1="40" y1="37" x2="40" y2="41" stroke="#00d4aa" strokeWidth="0.8" opacity="0.45" />
      <line x1="37" y1="41" x2="43" y2="41" stroke="#00d4aa" strokeWidth="0.8" opacity="0.45" />
      {/* Serene smile */}
      <path
        d="M 33 46 Q 40 50 47 46"
        fill="none"
        stroke="#00d4aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 2px #00d4aa)' }}
      />
      {/* Holographic body projection */}
      <rect
        x="30"
        y="60"
        width="20"
        height="20"
        rx="4"
        fill="none"
        stroke="#00d4aa"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.35"
      />
      {/* Ambient particles */}
      <circle cx="12" cy="20" r="1.5" fill="#00d4aa" opacity="0.28" />
      <circle cx="68" cy="16" r="1" fill="#00d4aa" opacity="0.22" />
      <circle cx="72" cy="44" r="1.5" fill="#00d4aa" opacity="0.18" />
      <circle cx="8" cy="52" r="1" fill="#00d4aa" opacity="0.18" />
    </svg>
  ),

  // ── Snake: final boss, dark hood, toxic green slit eyes ──────────────────────
  snake: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Snake portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#020808" />
      {/* Deep atmosphere */}
      <ellipse cx="40" cy="50" rx="40" ry="36" fill="#060d06" opacity="0.7" />
      {/* Cloak */}
      <path
        d="M 0 80 L 0 40 Q 10 20 20 22 L 28 30 Q 36 10 40 10 Q 44 10 52 30 L 60 22 Q 70 20 80 40 L 80 80 Z"
        fill="#060c06"
      />
      {/* Hood shadow over face */}
      <ellipse cx="40" cy="36" rx="28" ry="30" fill="#060c06" />
      {/* Hood rim — barely visible */}
      <path
        d="M 12 28 Q 20 14 40 12 Q 60 14 68 28 Q 58 20 40 18 Q 22 20 12 28"
        fill="#0a1208"
        opacity="0.75"
      />
      {/* Face in deep shadow */}
      <ellipse cx="40" cy="38" rx="18" ry="22" fill="#0c1408" />
      {/* Mask — lower face */}
      <rect x="22" y="42" width="36" height="20" rx="4" fill="#080c08" />
      {/* Toxic green slit eyes — dominant feature */}
      <ellipse
        cx="31"
        cy="36"
        rx="7"
        ry="4"
        fill="#39ff14"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 7px #39ff14)' }}
      />
      <ellipse
        cx="49"
        cy="36"
        rx="7"
        ry="4"
        fill="#39ff14"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 7px #39ff14)' }}
      />
      {/* Slit pupils */}
      <rect x="30" y="33" width="2" height="6" rx="1" fill="#020808" />
      <rect x="48" y="33" width="2" height="6" rx="1" fill="#020808" />
      {/* Eye halo glow */}
      <ellipse cx="31" cy="36" rx="10" ry="6" fill="#39ff14" opacity="0.05" />
      <ellipse cx="49" cy="36" rx="10" ry="6" fill="#39ff14" opacity="0.05" />
      {/* Snake-scale mask pattern */}
      <path
        d="M 28 46 Q 34 44 40 46 Q 46 44 52 46"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.5"
        opacity="0.18"
      />
      <path
        d="M 26 50 Q 33 48 40 50 Q 47 48 54 50"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.5"
        opacity="0.18"
      />
      {/* Atmospheric side lines */}
      <line x1="2" y1="36" x2="10" y2="36" stroke="#39ff14" strokeWidth="0.5" opacity="0.28" />
      <line x1="70" y1="36" x2="78" y2="36" stroke="#39ff14" strokeWidth="0.5" opacity="0.28" />
    </svg>
  ),

  // ── Player: agent silhouette, green visor ────────────────────────────────────
  player: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Player portrait"
      role="img"
      style={{ display: 'block' }}
    >
      <rect width="80" height="80" fill="#080c14" />
      {/* Agent suit */}
      <path
        d="M 2 80 L 4 58 L 18 52 L 28 50 L 40 46 L 52 50 L 62 52 L 76 58 L 78 80 Z"
        fill="#0e1420"
      />
      <path d="M 32 50 L 28 62 L 24 80" fill="none" stroke="#182030" strokeWidth="3" />
      <path d="M 48 50 L 52 62 L 56 80" fill="none" stroke="#182030" strokeWidth="3" />
      {/* Chest emblem */}
      <path
        d="M 36 58 L 40 54 L 44 58 L 40 62 Z"
        fill="none"
        stroke="#00ff88"
        strokeWidth="1"
        opacity="0.55"
      />
      {/* Neck */}
      <rect x="33" y="46" width="14" height="8" fill="#161e26" />
      {/* Head silhouette */}
      <ellipse cx="40" cy="34" rx="20" ry="22" fill="#161e26" />
      {/* Short neutral hair */}
      <ellipse cx="40" cy="14" rx="20" ry="10" fill="#0e1420" />
      <rect x="20" y="12" width="40" height="8" fill="#0e1420" />
      {/* Green visor — the signature */}
      <rect
        x="20"
        y="25"
        width="40"
        height="15"
        rx="3"
        fill="#00ff88"
        opacity="0.65"
        style={{ filter: 'drop-shadow(0 0 5px #00ff8866)' }}
      />
      <rect x="22" y="26" width="36" height="4" rx="1" fill="#fff" opacity="0.07" />
      <line x1="20" y1="25" x2="60" y2="25" stroke="#00ff88" strokeWidth="0.5" opacity="0.45" />
      {/* Lower face / chin */}
      <path d="M 24 40 Q 40 52 56 40 L 54 46 Q 40 56 26 46 Z" fill="#161e26" />
      {/* Tech collar */}
      <rect x="30" y="46" width="20" height="3" rx="1" fill="#00ff88" opacity="0.18" />
      {/* Side circuit accents */}
      <line x1="4" y1="34" x2="12" y2="34" stroke="#00ff88" strokeWidth="0.5" opacity="0.38" />
      <line x1="68" y1="34" x2="76" y2="34" stroke="#00ff88" strokeWidth="0.5" opacity="0.38" />
    </svg>
  ),
};

export function NpcPortrait({ portraitId, size = 80 }: NpcPortraitProps): React.JSX.Element {
  const renderer = PORTRAITS[portraitId];
  if (renderer) return renderer(size);
  return <FallbackPortrait portraitId={portraitId} size={size} />;
}
