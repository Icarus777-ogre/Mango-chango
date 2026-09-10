import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VIRTUES, VIRTUE_META } from '../virtues';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
};

/**
 * CartonLabel — Nutrition-facts-style session results panel.
 * Light background with navy text. Spec palette for bars and accents.
 */
export function CartonLabel({ sessionVirtues = {}, heavyUpgrades = [], totalTasks = 0 }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 350);
    return () => clearTimeout(t);
  }, []);

  const upgradeMap = {};
  for (const { virtue, delta } of heavyUpgrades) {
    upgradeMap[virtue] = (upgradeMap[virtue] ?? 0) + delta;
  }
  const hasUpgrades = Object.keys(upgradeMap).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }}
      style={{
        width: '100%',
        maxWidth: 340,
        background: '#FFFFF8',
        border: `3px solid ${C.navy}`,
        boxShadow: `5px 5px 0 ${C.yellow}`,
        fontFamily: "'Courier New', Courier, monospace",
        color: C.navy,
        overflow: 'hidden',
      }}
    >
      {/* ── Header band ─────────────────────────────── */}
      <div
        style={{
          background: C.yellow,
          padding: '10px 16px',
          borderBottom: `3px solid ${C.navy}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Starburst icon */}
        <svg width="26" height="26" viewBox="0 0 50 50" aria-hidden="true">
          <path
            d="M25 0 L28 18 L42 8 L32 22 L50 25 L32 28 L42 42 L28 32 L25 50 L22 32 L8 42 L18 28 L0 25 L18 22 L8 8 L22 18 Z"
            fill={C.orange}
          />
        </svg>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              color: C.navy,
              letterSpacing: '-0.01em',
            }}
          >
            MANGO HARVEST
          </div>
          <div style={{ fontSize: 8, color: C.navy + 'AA', letterSpacing: '0.1em', fontWeight: 700 }}>
            SESSION BLEND REPORT
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Nutrition Facts heading */}
        <div
          style={{
            borderBottom: `8px solid ${C.navy}`,
            paddingBottom: 4,
            marginBottom: 3,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: C.navy,
            }}
          >
            Nutrition Facts
          </div>
        </div>

        <div style={{ borderBottom: `1px solid ${C.navy}40`, padding: '4px 0', fontSize: 11 }}>
          {totalTasks} serving{totalTasks !== 1 ? 's' : ''} per session
        </div>
        <div
          style={{
            borderBottom: `4px solid ${C.navy}`,
            padding: '4px 0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
          }}
        >
          <span>Blend Size</span>
          <span style={{ fontWeight: 700 }}>{totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
        </div>

        <div
          style={{
            borderBottom: `1px solid ${C.navy}30`,
            padding: '3px 0',
            textAlign: 'right',
            fontSize: 9,
            letterSpacing: '0.04em',
          }}
        >
          % Daily Virtue Value *
        </div>

        {/* Virtue rows */}
        {VIRTUES.map((virtue, i) => {
          const pct        = sessionVirtues[virtue] ?? 0;
          const meta       = VIRTUE_META[virtue];
          const isUpgraded = !!upgradeMap[virtue];

          return (
            <div key={virtue} style={{ borderBottom: `1px solid ${C.navy}20`, padding: '6px 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{meta.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.01em' }}>
                    {virtue}
                  </span>
                  {isUpgraded && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 320, delay: i * 0.08 + 0.4 }}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 8,
                        fontWeight: 900,
                        background: C.yellow,
                        color: C.navy,
                        padding: '1px 5px',
                        border: `1px solid ${C.navy}`,
                        letterSpacing: '0.04em',
                      }}
                    >
                      +{upgradeMap[virtue]} PERM
                    </motion.span>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{pct}%</span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 8,
                  background: `${C.navy}12`,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: animated ? `${pct}%` : 0 }}
                  transition={{ duration: 0.75, ease: 'easeOut', delay: i * 0.1 + 0.15 }}
                  style={{
                    height: '100%',
                    background: isUpgraded
                      ? `linear-gradient(90deg, ${meta.color}, ${C.yellow})`
                      : meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div style={{ borderBottom: `4px solid ${C.navy}`, margin: '6px 0' }} />

        {/* Permanent upgrades */}
        {hasUpgrades && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{
              background: `${C.yellow}33`,
              border: `1.5px solid ${C.yellow}`,
              padding: '8px 10px',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: '0.08em',
                marginBottom: 6,
                color: C.navy,
              }}
            >
              HEAVY TASK STAT UPGRADES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(upgradeMap).map(([virtue, delta]) => {
                const meta = VIRTUE_META[virtue];
                return (
                  <span
                    key={virtue}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: meta.color,
                      background: `${meta.color}18`,
                      border: `1.5px solid ${meta.color}55`,
                      padding: '2px 8px',
                    }}
                  >
                    {meta.icon} +{delta} {virtue}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}

        <div style={{ fontSize: 8, color: `${C.navy}70`, lineHeight: 1.5, letterSpacing: '0.01em' }}>
          * % Daily Values based on a 100-point virtue blend.
          {hasUpgrades && ' Permanent upgrades applied to Lifetime Profile.'}
        </div>
      </div>
    </motion.div>
  );
}
