import React, { useId } from 'react';
import type { CipherMood } from '@venomous-snake/narrative';

interface CipherPortraitProps {
  mood: CipherMood;
  size?: number;
  className?: string;
}

const MOOD_EYE_COLOR: Record<CipherMood, string> = {
  neutral: '#00ff9d',
  excited: '#ffb454',
  concerned: '#ff3366',
  amused: '#00b4d8',
  impressed: '#c792ea',
  thinking: '#5c6773',
};

const MOOD_LABEL: Record<CipherMood, string> = {
  neutral: 'neutral',
  excited: 'excited',
  concerned: 'concerned',
  amused: 'amused',
  impressed: 'impressed',
  thinking: 'thinking',
};

export function CipherPortrait({
  mood,
  size = 80,
  className,
}: CipherPortraitProps): React.JSX.Element {
  const uid = useId();
  const glowId = `cipher-glow-${uid}`;
  const pulseId = `cipher-pulse-${uid}`;
  const scanId = `cipher-scan-${uid}`;
  const eyeColor = MOOD_EYE_COLOR[mood];
  const isThinking = mood === 'thinking';
  const isExcited = mood === 'excited';

  // Mouth path: slight smile by default, wider for excited, flat for concerned
  const mouthPath =
    mood === 'concerned'
      ? 'M 28 58 L 52 58'
      : mood === 'excited' || mood === 'impressed'
        ? 'M 26 55 Q 40 66 54 55'
        : 'M 28 56 Q 40 63 52 56';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`CIPHER — mood: ${MOOD_LABEL[mood]}`}
      role="img"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Outer glow filter */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Thinking pulse animation clip */}
        <clipPath id={scanId}>
          <rect x="6" y="6" width="68" height="68" rx="34" />
        </clipPath>

        {/* Glow pulse keyframe */}
        <style>{`
          @keyframes ${pulseId}-glow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes ${pulseId}-scan {
            0% { transform: translateY(-68px); }
            100% { transform: translateY(68px); }
          }
          @keyframes ${pulseId}-blink {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0.1; }
          }
        `}</style>
      </defs>

      {/* Background circle */}
      <circle cx="40" cy="40" r="37" fill="#0a0e14" />

      {/* Glow border */}
      <circle
        cx="40"
        cy="40"
        r="37"
        fill="none"
        stroke="#00ff9d"
        strokeWidth="2"
        filter={`url(#${glowId})`}
        style={{
          animation: isThinking
            ? `${pulseId}-glow 1.8s ease-in-out infinite`
            : `${pulseId}-glow 3s ease-in-out infinite`,
          opacity: 0.85,
        }}
      />

      {/* Inner subtle border */}
      <circle cx="40" cy="40" r="34" fill="none" stroke="#00ff9d22" strokeWidth="1" />

      {/* Scan line (visible during thinking/neutral) */}
      <g clipPath={`url(#${scanId})`}>
        <rect
          x="6"
          y="6"
          width="68"
          height="3"
          fill="#00ff9d"
          opacity="0.06"
          style={{
            animation: `${pulseId}-scan 4s linear infinite`,
            transformOrigin: 'center',
            transformBox: 'fill-box',
          }}
        />
      </g>

      {/* Face plate background */}
      <rect x="16" y="20" width="48" height="44" rx="6" fill="#0d1117" />

      {/* Left eye */}
      <rect
        x="20"
        y="30"
        width="16"
        height="10"
        rx="2"
        fill={eyeColor}
        style={{
          animation: isExcited
            ? `${pulseId}-blink 2.5s ease-in-out infinite`
            : `${pulseId}-blink 4s ease-in-out infinite`,
          filter: `drop-shadow(0 0 3px ${eyeColor})`,
        }}
      />

      {/* Right eye */}
      <rect
        x="44"
        y="30"
        width="16"
        height="10"
        rx="2"
        fill={eyeColor}
        style={{
          animation: isExcited
            ? `${pulseId}-blink 2.5s ease-in-out 0.1s infinite`
            : `${pulseId}-blink 4s ease-in-out 0.05s infinite`,
          filter: `drop-shadow(0 0 3px ${eyeColor})`,
        }}
      />

      {/* Thinking indicator dots (small pupils) */}
      {isThinking && (
        <>
          <circle cx="28" cy="35" r="2" fill="#ffffff33" />
          <circle cx="52" cy="35" r="2" fill="#ffffff33" />
        </>
      )}

      {/* Mouth */}
      <path
        d={mouthPath}
        stroke={eyeColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 2px ${eyeColor})` }}
      />

      {/* Circuit accent lines */}
      <line x1="6" y1="40" x2="14" y2="40" stroke="#00ff9d44" strokeWidth="1" />
      <line x1="66" y1="40" x2="74" y2="40" stroke="#00ff9d44" strokeWidth="1" />
      <line x1="40" y1="6" x2="40" y2="14" stroke="#00ff9d44" strokeWidth="1" />
    </svg>
  );
}
