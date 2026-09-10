import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
};

/**
 * BlenderSVG — Punk countertop blender illustration.
 *
 * Uses exact spec palette:
 *   Outline:  #172554  bold stroke
 *   Body:     #FB923C  vivid orange
 *   Controls: #2563EB  electric blue
 *   Indicator:#22C55E  fresh green
 *   Accents:  #FACC15  mango yellow
 *
 * Props:
 *   isShaking   {boolean} — trigger vibrate + spinning blade
 *   fillLevel   {number}  — 0–1 liquid height
 *   liquidColor {string}  — CSS color for liquid
 *   compact     {boolean} — 28×28 icon mode
 */
export function BlenderSVG({
  isShaking = false,
  fillLevel = 0,
  liquidColor = '#FB923C',
  compact = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const shouldShake = isShaking && !prefersReducedMotion;

  const jarTop    = 42;
  const jarBottom = 210;
  const jarH      = jarBottom - jarTop;
  const liquidY   = jarBottom - jarH * fillLevel;

  /* ── Compact icon mode ─────────────────────────────────── */
  if (compact) {
    return (
      <svg width="28" height="28" viewBox="0 0 180 300" fill="none" aria-hidden="true">
        {/* Jar outline */}
        <path d="M40 42 L24 210 L156 210 L140 42 Z" fill={`${C.orange}30`} stroke={C.navy} strokeWidth="6" strokeLinejoin="round" />
        {/* Lid */}
        <path d="M46 42 L134 42 L124 14 L56 14 Z" fill={C.yellow} stroke={C.navy} strokeWidth="5" strokeLinejoin="round" />
        {/* Base */}
        <rect x="22" y="218" width="136" height="64" rx="10" fill={C.orange} stroke={C.navy} strokeWidth="5" />
        {/* Active button */}
        <rect x="62" y="232" width="56" height="16" rx="3" fill={C.yellow} />
        {/* Green LED */}
        <circle cx="148" cy="250" r="8" fill={C.green} />
      </svg>
    );
  }

  return (
    <div
      className={shouldShake ? 'is-shaking' : ''}
      style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
    >
      <svg
        width="180"
        height="300"
        viewBox="0 0 180 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Retro punch blender"
        role="img"
      >
        <defs>
          {/* Base gradient */}
          <linearGradient id="bl-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={C.orange} />
            <stop offset="100%" stopColor="#D96A14" />
          </linearGradient>

          {/* Glass jar gradient */}
          <linearGradient id="bl-jar-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
            <stop offset="30%"  stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Liquid gradient */}
          <linearGradient id="bl-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={liquidColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.6" />
          </linearGradient>

          {/* Jar clip */}
          <clipPath id="bl-jar-clip">
            <path d="M40 42 L24 210 L156 210 L140 42 Z" />
          </clipPath>

          {/* Drop shadow */}
          <filter id="bl-shadow" x="-20%" y="-10%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={C.navy} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── MOTOR / BASE ─────────────────────────────────────── */}
        <rect
          x="18" y="216" width="144" height="70"
          rx="10"
          fill="url(#bl-base)"
          stroke={C.navy}
          strokeWidth="3.5"
          filter="url(#bl-shadow)"
        />

        {/* Base horizontal grip lines */}
        {[232, 242, 252, 262].map((y, i) => (
          <line key={i} x1="24" y1={y} x2="156" y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        ))}

        {/* ── BUTTONS ROW ──────────────────────────────────────── */}
        {/* SLOW */}
        <rect x="26" y="224" width="36" height="15" rx="2" fill="rgba(23,37,84,0.25)" stroke={C.navy} strokeWidth="1.5" />
        <text x="44" y="235" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.yellow} fontFamily="Inter,sans-serif">SLOW</text>

        {/* BLEND — active (yellow) */}
        <rect x="72" y="222" width="36" height="18" rx="2" fill={C.yellow} stroke={C.navy} strokeWidth="2" />
        <text x="90" y="234" textAnchor="middle" fontSize="7.5" fontWeight="900" fill={C.navy} fontFamily="Inter,sans-serif">BLEND</text>

        {/* PULSE */}
        <rect x="118" y="224" width="36" height="15" rx="2" fill="rgba(23,37,84,0.25)" stroke={C.navy} strokeWidth="1.5" />
        <text x="136" y="235" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.yellow} fontFamily="Inter,sans-serif">PULSE</text>

        {/* Power dial */}
        <circle cx="90" cy="263" r="11" fill={C.navy} stroke={C.navy} strokeWidth="2" />
        <circle cx="90" cy="263" r="6" fill={C.blue} stroke={C.navy} strokeWidth="1.5" />
        <circle cx="90" cy="257" r="2" fill="rgba(255,255,255,0.7)" />

        {/* Green LED indicator */}
        <circle cx="152" cy="226" r="5" fill={C.green} stroke={C.navy} strokeWidth="1.5" />
        <circle cx="152" cy="226" r="2.5" fill="#6EF5A0" opacity="0.8" />

        {/* ── COUPLING COLLAR ──────────────────────────────────── */}
        <rect x="30" y="208" width="120" height="12" rx="4" fill="#D4600A" stroke={C.navy} strokeWidth="2.5" />
        <rect x="44" y="211" width="92" height="5" rx="2" fill="rgba(0,0,0,0.18)" />

        {/* ── JAR BODY ─────────────────────────────────────────── */}
        {/* Jar background glass */}
        <path
          d="M40 42 L24 210 L156 210 L140 42 Z"
          fill={`${C.blue}18`}
          stroke={C.navy}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Liquid fill (animated height via fillLevel prop) */}
        {fillLevel > 0 && (
          <motion.g
            clipPath="url(#bl-jar-clip)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <rect x="0" y={liquidY} width="180" height={jarBottom - liquidY + 4} fill="url(#bl-liquid)" />

            {/* Wave surface */}
            {!prefersReducedMotion && (
              <motion.path
                d={`M24 ${liquidY} Q57 ${liquidY - 9} 90 ${liquidY} Q123 ${liquidY + 9} 156 ${liquidY} L156 ${liquidY + 5} Q123 ${liquidY + 14} 90 ${liquidY + 5} Q57 ${liquidY - 4} 24 ${liquidY + 5} Z`}
                fill={liquidColor}
                opacity={0.65}
                animate={{
                  d: [
                    `M24 ${liquidY} Q57 ${liquidY - 9} 90 ${liquidY} Q123 ${liquidY + 9} 156 ${liquidY} L156 ${liquidY+5} Q123 ${liquidY+14} 90 ${liquidY+5} Q57 ${liquidY-4} 24 ${liquidY+5} Z`,
                    `M24 ${liquidY} Q57 ${liquidY + 9} 90 ${liquidY} Q123 ${liquidY - 9} 156 ${liquidY} L156 ${liquidY+5} Q123 ${liquidY-4} 90 ${liquidY+5} Q57 ${liquidY+14} 24 ${liquidY+5} Z`,
                  ],
                }}
                transition={{ duration: isShaking ? 0.35 : 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
              />
            )}
          </motion.g>
        )}

        {/* Jar sheen on top of liquid */}
        <path d="M40 42 L24 210 L156 210 L140 42 Z" fill="url(#bl-jar-sheen)" />

        {/* Jar seam dashed line */}
        <line x1="90" y1="46" x2="90" y2="206" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,7" />

        {/* ── LID ─────────────────────────────────────────────── */}
        <path
          d="M46 42 L134 42 L124 14 L56 14 Z"
          fill={C.yellow}
          stroke={C.navy}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <line x1="62" y1="28" x2="118" y2="28" stroke="rgba(23,37,84,0.18)" strokeWidth="1.5" />

        {/* Lid knob */}
        <rect x="68" y="3" width="44" height="13" rx="6" fill={C.orange} stroke={C.navy} strokeWidth="3" />
        <circle cx="90" cy="9.5" r="3" fill={C.navy} />

        {/* ── SPOUT (right side nub) ───────────────────────────── */}
        <path
          d="M140 78 L162 64 L167 74 L145 90 Z"
          fill={`${C.blue}22`}
          stroke={C.navy}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* ── HANDLE ──────────────────────────────────────────── */}
        <path
          d="M24 110 C-8 110 -8 172 24 172"
          stroke={C.orange}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 110 C-8 110 -8 172 24 172"
          stroke={C.navy}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="0"
          opacity="0.4"
        />

        {/* ── BLADE ASSEMBLY ──────────────────────────────────── */}
        <motion.g
          style={{ transformOrigin: '90px 200px' }}
          animate={shouldShake ? { rotate: 360 } : { rotate: 0 }}
          transition={shouldShake
            ? { duration: 0.15, repeat: Infinity, ease: 'linear' }
            : {}
          }
        >
          {/* X blade */}
          <line x1="56" y1="200" x2="124" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
          <line x1="90" y1="186" x2="90" y2="214" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
          {/* Hub */}
          <circle cx="90" cy="200" r="5.5" fill={C.yellow} stroke={C.navy} strokeWidth="2.5" />
        </motion.g>

        {/* ── MEASUREMENT LINES ───────────────────────────────── */}
        {[120, 155, 188].map((ym, i) => (
          <g key={i}>
            <line x1="148" y1={ym} x2="154" y2={ym} stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <text x="158" y={ym + 4} fontSize="7.5" fill="rgba(255,255,255,0.22)" fontFamily="monospace">
              {['1', '2', '3'][i]}C
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
