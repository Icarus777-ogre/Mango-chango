import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { VIRTUES, VIRTUE_META } from '../virtues';
import { useStore, selectProfile } from '../store/useStore';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
  white:  '#FFFFFF',
};

/* ── Custom radar dot ────────────────────────────────────── */
function PolarDot({ cx, cy }) {
  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill={C.blue}
      stroke={C.white}
      strokeWidth={2}
    />
  );
}

/* ── Custom radar tooltip ────────────────────────────────── */
function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { subject, value } = payload[0].payload;
  const meta = VIRTUE_META[subject];
  return (
    <div
      style={{
        background: C.white,
        border: `2px solid ${C.navy}`,
        boxShadow: `3px 3px 0 ${C.yellow}`,
        padding: '10px 14px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{meta?.icon}</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: C.navy }}>
          {subject}
        </span>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: meta?.color ?? C.blue, lineHeight: 1 }}>
        {value} <span style={{ fontSize: 12, color: `${C.navy}70`, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>pts</span>
      </div>
    </div>
  );
}

/* ── Custom polar axis tick ──────────────────────────────── */
function PolarTick({ x, y, payload }) {
  const meta = VIRTUE_META[payload.value];
  if (!meta) return null;
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>
      <tspan fontSize={14} dy={-10}>{meta.icon}</tspan>
      <tspan
        x={x} dy={16} fontSize={9}
        fill={`${C.navy}90`}
        fontWeight="700"
        fontFamily="'Space Grotesk', sans-serif"
        letterSpacing="0.06em"
        textTransform="uppercase"
      >
        {payload.value.slice(0, 4).toUpperCase()}
      </tspan>
    </text>
  );
}

/* ─────────────────────────────────────────────────────────── */

export function ProfileStats({ isOpen, onClose }) {
  const profile = useStore(selectProfile);
  const { lifetimeStats, totalShakes, rank } = profile;

  const radarData = useMemo(
    () => VIRTUES.map((v) => ({ subject: v, value: lifetimeStats[v] ?? 0, fullMark: 50 })),
    [lifetimeStats],
  );

  const totalPoints = VIRTUES.reduce((sum, v) => sum + (lifetimeStats[v] ?? 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(23,37,84,0.55)',
              backdropFilter: 'blur(6px)',
              zIndex: 8000,
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="profile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0,
              width: 'min(460px, 100vw)',
              background: C.white,
              borderLeft: `3px solid ${C.navy}`,
              boxShadow: `-6px 0 0 rgba(23,37,84,0.1)`,
              zIndex: 8001,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              color: C.navy,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 28px 18px',
                borderBottom: `2px solid ${C.navy}14`,
                background: C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.blue,
                    margin: '0 0 4px',
                  }}
                >
                  Lifetime Profile
                </p>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28,
                    color: C.navy,
                    margin: 0,
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  VIRTUE STATS
                </h2>
              </div>

              <button
                id="profile-close-btn"
                onClick={onClose}
                aria-label="Close profile"
                style={{
                  background: C.navy,
                  border: 'none',
                  color: C.white,
                  width: 36, height: 36,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.blue}
                onMouseLeave={e => e.currentTarget.style.background = C.navy}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 28px 0' }}>
              {/* ── Rank card ─────────────────────────────────── */}
              <div
                style={{
                  background: C.yellow,
                  border: `2px solid ${C.navy}`,
                  boxShadow: `4px 4px 0 ${C.navy}`,
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginBottom: 28,
                }}
              >
                <div style={{ fontSize: 44, lineHeight: 1 }}>{rank.icon}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 9,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: `${C.navy}80`,
                      margin: '0 0 2px',
                    }}
                  >
                    Current Rank
                  </p>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 24,
                      color: C.navy,
                      lineHeight: 1,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {rank.title}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: `${C.navy}80`, fontWeight: 500, margin: '4px 0 0' }}>
                    {totalShakes} session{totalShakes !== 1 ? 's' : ''} · {totalPoints} pts total
                  </p>
                </div>
              </div>

              {/* ── Radar chart ───────────────────────────────── */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: `${C.navy}80`,
                    margin: '0 0 12px',
                  }}
                >
                  VIRTUE RADAR
                </p>
                <div
                  style={{
                    border: `2px solid ${C.navy}12`,
                    padding: '12px 0',
                    background: '#FAFBFF',
                  }}
                >
                  <ResponsiveContainer width="100%" height={248}>
                    <RadarChart data={radarData} margin={{ top: 24, right: 34, bottom: 24, left: 34 }}>
                      <PolarGrid stroke={`${C.navy}12`} gridType="polygon" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={<PolarTick />}
                        tickLine={false}
                        axisLine={{ stroke: `${C.navy}12` }}
                      />
                      <Radar
                        name="Lifetime"
                        dataKey="value"
                        stroke={C.blue}
                        fill={C.blue}
                        fillOpacity={0.12}
                        strokeWidth={2.5}
                        dot={<PolarDot />}
                      />
                      <Tooltip content={<RadarTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Stat bars ─────────────────────────────────── */}
              <div style={{ marginBottom: 36 }}>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: `${C.navy}80`,
                    margin: '0 0 16px',
                  }}
                >
                  LIFETIME STATS
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {VIRTUES.map((virtue) => {
                    const val    = lifetimeStats[virtue] ?? 0;
                    const meta   = VIRTUE_META[virtue];
                    const barPct = Math.min((val / 50) * 100, 100);
                    return (
                      <div key={virtue}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14 }}>{meta.icon}</span>
                            <span
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: 12,
                                color: C.navy,
                                letterSpacing: '0.01em',
                              }}
                            >
                              {virtue}
                            </span>
                          </div>
                          <span
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 16,
                              color: meta.color,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {val} pts
                          </span>
                        </div>
                        {/* Track */}
                        <div
                          style={{
                            height: 6,
                            background: `${C.navy}10`,
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barPct}%` }}
                            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
                            style={{ height: '100%', background: meta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
