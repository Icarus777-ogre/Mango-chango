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
 * MangoTetrapack — premium editorial tetrapack product illustration.
 *
 * Props:
 *   animate  {boolean}  — play spring-entry + idle 3D rock
 *   size     {'sm'|'md'|'lg'|'xl'} — scale preset
 */
export function MangoTetrapack({ animate: shouldAnimate = true, size = 'md' }) {
  const prefersReducedMotion = useReducedMotion();

  const scales = { sm: 0.65, md: 1, lg: 1.25, xl: 1.55 };
  const s = scales[size] ?? 1;
  const w = Math.round(200 * s);
  const h = Math.round(310 * s);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.84, y: 24 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
      style={{ display: 'inline-block' }}
    >
      <motion.div
        animate={!prefersReducedMotion && shouldAnimate
          ? { rotateY: [-6, 6, -6] }
          : { rotateY: 0 }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      >
        <svg
          width={w}
          height={h}
          viewBox="0 0 200 310"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Mango Harvest limited-edition tetrapack"
          role="img"
        >
          <defs>
            {/* Front face gradients */}
            <linearGradient id="tp-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FFE033" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>

            {/* Side panel */}
            <linearGradient id="tp-side" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#C09A00" />
              <stop offset="100%" stopColor="#A88600" />
            </linearGradient>

            {/* Gable top */}
            <linearGradient id="tp-gable" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%"   stopColor="#D4A800" />
              <stop offset="100%" stopColor="#EDBE00" />
            </linearGradient>

            {/* Glass sheen across front */}
            <linearGradient id="tp-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.26)" />
              <stop offset="30%"  stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Mango graphic gradient */}
            <radialGradient id="mango-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#FFAA4A" />
              <stop offset="100%" stopColor="#FB923C" />
            </radialGradient>

            {/* Drop shadow filter */}
            <filter id="tp-dropshadow" x="-25%" y="-5%" width="160%" height="130%">
              <feDropShadow dx="5" dy="12" stdDeviation="18" floodColor={C.navy} floodOpacity="0.32" />
            </filter>

            {/* Clip front face */}
            <clipPath id="clip-front">
              <rect x="15" y="55" width="145" height="225" rx="2" />
            </clipPath>
          </defs>

          {/* ── CONTACT SHADOW ────────────────────────────────────── */}
          <ellipse cx="88" cy="298" rx="76" ry="11" fill="rgba(23,37,84,0.14)" />

          {/* ── RIGHT SIDE PANEL ─────────────────────────────────── */}
          <path d="M160,72 L196,88 L196,280 L160,280 Z" fill="url(#tp-side)" />
          {/* Side seam lines */}
          <line x1="160" y1="95"  x2="196" y2="111" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          <line x1="160" y1="160" x2="196" y2="176" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          {/* Side rotated text label */}
          <text
            transform="rotate(90,178,180)"
            x="178" y="180"
            textAnchor="middle"
            fontSize="6.5"
            fill="rgba(255,255,255,0.35)"
            fontFamily="'Inter',sans-serif"
            letterSpacing="2"
          >
            MANGO HARVEST · 2026
          </text>

          {/* ── FRONT FACE BASE ──────────────────────────────────── */}
          <rect
            x="15" y="55" width="145" height="225" rx="2"
            fill="url(#tp-body)"
            filter="url(#tp-dropshadow)"
          />

          {/* ── ELECTRIC BLUE LABEL BLOCK (top area) ─────────────── */}
          <rect
            x="15" y="55" width="145" height="78"
            fill={C.blue}
            clipPath="url(#clip-front)"
          />

          {/* "MANGO" in Bebas Neue — large */}
          <text
            x="88" y="101"
            textAnchor="middle"
            fontSize="29"
            fontFamily="'Bebas Neue',sans-serif"
            fill={C.yellow}
            letterSpacing="1.5"
          >
            MANGO
          </text>

          {/* "HARVEST" in Space Grotesk — smaller, below */}
          <text
            x="88" y="121"
            textAnchor="middle"
            fontSize="11"
            fontFamily="'Space Grotesk',sans-serif"
            fontWeight="700"
            fill="rgba(255,255,255,0.82)"
            letterSpacing="3.5"
          >
            HARVEST
          </text>

          {/* ── MANGO GRAPHIC — center of front face ─────────────── */}
          {/* Mango body */}
          <ellipse cx="88" cy="192" rx="38" ry="32" fill="url(#mango-grad)" />
          {/* Highlight shine */}
          <ellipse cx="75" cy="178" rx="13" ry="10" fill="rgba(255,225,120,0.42)" />
          {/* Stem */}
          <path
            d="M88 160 C88 160 92 148 100 143"
            stroke={C.green}
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf */}
          <path
            d="M100 143 C108 135 117 138 114 146 C111 152 100 143 100 143 Z"
            fill={C.green}
            stroke={C.navy}
            strokeWidth="1"
          />

          {/* ── "HARVEST EDITION" small label strip ──────────────── */}
          <rect x="24" y="155" width="72" height="18" fill="rgba(23,37,84,0.14)" rx="1" />
          <text
            x="60" y="167"
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="'Inter',sans-serif"
            fontWeight="700"
            fill={C.navy}
            letterSpacing="1.2"
          >
            HARVEST EDITION
          </text>

          {/* ── GREEN ACCENT STRIPE ───────────────────────────────── */}
          <rect x="15" y="248" width="145" height="5" fill={C.green} clipPath="url(#clip-front)" />

          {/* ── NAVY BOTTOM BAND ─────────────────────────────────── */}
          <rect x="15" y="253" width="145" height="27" fill={C.navy} clipPath="url(#clip-front)" />
          <text
            x="88" y="271"
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="'Space Grotesk',sans-serif"
            fontWeight="700"
            fill="white"
            letterSpacing="2.5"
          >
            BLEND · WORK · WIN
          </text>

          {/* ── GLASS SHEEN (front face) ──────────────────────────── */}
          <rect
            x="15" y="55" width="145" height="225" rx="2"
            fill="url(#tp-sheen)"
            clipPath="url(#clip-front)"
          />

          {/* ── OUTLINE & SEAM (front) ────────────────────────────── */}
          <rect x="15" y="55" width="145" height="225" rx="2" stroke={C.navy} strokeWidth="2.5" fill="none" />
          {/* Horizontal seam at label junction */}
          <line x1="15" y1="133" x2="160" y2="133" stroke={C.navy} strokeWidth="1" strokeDasharray="4,5" opacity="0.25" />

          {/* ── TOP GABLE ─────────────────────────────────────────── */}
          {/* Front gable */}
          <path d="M15,55 L88,18 L160,55 Z" fill="url(#tp-gable)" />
          {/* Gable center crease */}
          <line x1="88" y1="18" x2="88" y2="55" stroke="rgba(23,37,84,0.25)" strokeWidth="1.5" strokeDasharray="3,5" />
          {/* Gable outline */}
          <path d="M15,55 L88,18 L160,55" stroke={C.navy} strokeWidth="2" strokeLinejoin="round" fill="none" />

          {/* Right side gable */}
          <path d="M160,55 L196,72 L118,38 Z" fill="#B89200" />
          <path d="M160,55 L196,72" stroke={C.navy} strokeWidth="2" strokeLinejoin="round" fill="none" />

          {/* ── SPOUT ─────────────────────────────────────────────── */}
          <rect x="68" y="11" width="40" height="10" rx="5" fill={C.navy} />
          <rect x="74" y="13" width="28" height="6" rx="3" fill="#2D3E6B" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
