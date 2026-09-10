import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BlenderSVG } from './BlenderSVG';
import { MangoTetrapack } from './MangoTetrapack';
import { CartonLabel } from './CartonLabel';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
  white:  '#FFFFFF',
};

/* ── Spring easing ─────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* Stage sequence */
const STAGES = {
  GATHER:  'gather',
  FLY:     'fly',
  SHAKE:   'shake',
  WAVE:    'wave',
  SUCCESS: 'success',
  CARTON:  'carton',
};

const DURATIONS = {
  [STAGES.GATHER]:  1200,
  [STAGES.FLY]:     1600,
  [STAGES.SHAKE]:   1000,
  [STAGES.WAVE]:    1100,
  [STAGES.SUCCESS]: 2400,
  [STAGES.CARTON]:  0,
};

const STAGE_ORDER = Object.values(STAGES);

/**
 * CelebrationPortal — Six-stage blending animation overlay.
 * Renders via createPortal to document.body.
 */
export function CelebrationPortal({ tasks, sessionVirtues = {}, heavyUpgrades = [], onReset }) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage]           = useState(STAGES.GATHER);
  const [flownCards, setFlownCards] = useState(new Set());
  const timerRef                    = useRef(null);

  /* Auto-advance stages */
  useEffect(() => {
    const dur = prefersReducedMotion
      ? (DURATIONS[stage] === 0 ? 0 : 320)
      : DURATIONS[stage];
    if (dur === 0) return;
    timerRef.current = setTimeout(() => {
      const next = STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1];
      if (next) setStage(next);
    }, dur);
    return () => clearTimeout(timerRef.current);
  }, [stage, prefersReducedMotion]);

  /* Stagger task cards into blender */
  useEffect(() => {
    if (stage !== STAGES.FLY) return;
    const timers = tasks.map((task, i) =>
      setTimeout(() => setFlownCards((prev) => new Set([...prev, task.id])), i * 170)
    );
    return () => timers.forEach(clearTimeout);
  }, [stage, tasks]);

  const isShaking    = stage === STAGES.SHAKE;
  const showWave     = [STAGES.WAVE, STAGES.SUCCESS, STAGES.CARTON].includes(stage);
  const showSuccess  = [STAGES.SUCCESS, STAGES.CARTON].includes(stage);
  const showCarton   = stage === STAGES.CARTON;

  /* Semi-arc card positions */
  const cardPositions = tasks.map((_, i) => {
    const angle = (i / tasks.length) * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * 220,
      y: Math.sin(angle) * 200 - 70,
    };
  });

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="celebration-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(23,37,84,0.92)',
          backdropFilter: 'blur(12px)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── GATHER / FLY / SHAKE ─────────────────────────── */}
        {[STAGES.GATHER, STAGES.FLY, STAGES.SHAKE].includes(stage) && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Blender */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
              style={{ position: 'relative', zIndex: 10 }}
            >
              <BlenderSVG
                isShaking={isShaking}
                fillLevel={isShaking ? 0.7 : 0}
                liquidColor={C.orange}
              />
            </motion.div>

            {/* Orbiting task cards */}
            {tasks.map((task, i) => {
              const pos      = cardPositions[i];
              const hasFlown = flownCards.has(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0, x: pos.x, y: pos.y }}
                  animate={
                    stage === STAGES.GATHER
                      ? { opacity: 1, scale: 1, x: pos.x, y: pos.y }
                      : hasFlown
                      ? { opacity: 0, scale: 0, x: 0, y: 0 }
                      : { opacity: 1, scale: 1, x: pos.x, y: pos.y }
                  }
                  transition={
                    stage === STAGES.GATHER
                      ? { type: 'spring', stiffness: 180, damping: 18, delay: i * 0.1 + 0.1 }
                      : { type: 'spring', stiffness: 320, damping: 24 }
                  }
                  style={{
                    position: 'absolute',
                    width: 110,
                    background: C.white,
                    border: `2px solid ${C.navy}`,
                    boxShadow: `3px 3px 0 ${C.yellow}`,
                    padding: '10px 12px',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 10,
                      color: C.navy,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {task.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── WAVE + SUCCESS + CARTON ──────────────────────────── */}
        <AnimatePresence>
          {showWave && (
            <motion.div
              key="wave-screen"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.85, ease }}
              style={{
                position: 'absolute', inset: 0,
                background: C.white,
                transformOrigin: 'bottom center',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: C.blue }} />
              {/* Bottom accent bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: C.orange }} />

              {/* Corner starbursts */}
              {!prefersReducedMotion && [
                { x: '8%',  y: '14%', size: 44, color: C.yellow, delay: 0.3 },
                { x: '88%', y: '12%', size: 32, color: C.orange,  delay: 0.42 },
                { x: '5%',  y: '78%', size: 36, color: C.green,   delay: 0.48 },
                { x: '90%', y: '80%', size: 38, color: C.blue,    delay: 0.36 },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 0.7 }}
                  transition={{ delay: s.delay, type: 'spring', stiffness: 280, damping: 18 }}
                  style={{ position: 'absolute', left: s.x, top: s.y, width: s.size, height: s.size, pointerEvents: 'none' }}
                >
                  <svg viewBox="0 0 50 50" fill={s.color}>
                    <path d="M25 0 L28 18 L42 8 L32 22 L50 25 L32 28 L42 42 L28 32 L25 50 L22 32 L8 42 L18 28 L0 25 L18 22 L8 8 L22 18 Z" />
                  </svg>
                </motion.div>
              ))}

              {/* ── SUCCESS screen ─────────────────────────────── */}
              <AnimatePresence>
                {showSuccess && !showCarton && (
                  <motion.div
                    key="success-content"
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 2 }}
                  >
                    <motion.div
                      animate={!prefersReducedMotion ? { y: [-12, 12, -12] } : {}}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ marginBottom: 30 }}
                    >
                      <BlenderSVG isShaking={false} fillLevel={0.75} liquidColor={C.orange} />
                    </motion.div>

                    {/* "HARVESTED" */}
                    <h2
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 'clamp(3rem, 10vw, 7.5rem)',
                        color: C.navy,
                        letterSpacing: '0.02em',
                        lineHeight: 0.9,
                        margin: '0 0 6px',
                      }}
                    >
                      HARVESTED.
                    </h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: `${C.navy}80`, margin: 0 }}>
                      Checking the blend…
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── CARTON screen ──────────────────────────────── */}
              <AnimatePresence>
                {showCarton && (
                  <motion.div
                    key="carton-layout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 48,
                      padding: '20px 40px',
                      maxWidth: 980,
                      width: '100%',
                      flexWrap: 'wrap',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {/* Left: result + button */}
                    <motion.div
                      initial={{ x: -48, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                      style={{ textAlign: 'center', flexShrink: 0 }}
                    >
                      <motion.div
                        animate={!prefersReducedMotion ? { y: [-10, 10, -10] } : {}}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ marginBottom: 20 }}
                      >
                        <BlenderSVG isShaking={false} fillLevel={0.8} liquidColor={C.orange} />
                      </motion.div>

                      <h2
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 32,
                          color: C.navy,
                          letterSpacing: '0.04em',
                          margin: '0 0 4px',
                        }}
                      >
                        BLENDED.
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: `${C.navy}70`,
                          margin: '0 0 24px',
                        }}
                      >
                        Session complete.
                      </p>

                      <button
                        onClick={onReset}
                        id="blend-again-btn"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '14px 28px',
                          background: C.yellow,
                          color: C.navy,
                          border: `2px solid ${C.navy}`,
                          cursor: 'pointer',
                          transition: 'transform 0.12s, box-shadow 0.12s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translate(-2px,-2px)';
                          e.currentTarget.style.boxShadow = `4px 4px 0 ${C.navy}`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        BLEND AGAIN →
                      </button>
                    </motion.div>

                    {/* Center: Tetrapack product reveal */}
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.25 }}
                      style={{ flexShrink: 0 }}
                    >
                      <MangoTetrapack animate={!prefersReducedMotion} size="lg" />
                    </motion.div>

                    {/* Right: Carton label / nutrition */}
                    <motion.div
                      initial={{ x: 48, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.35 }}
                      style={{ flex: '0 1 330px', minWidth: 260 }}
                    >
                      <CartonLabel
                        sessionVirtues={sessionVirtues}
                        heavyUpgrades={heavyUpgrades}
                        totalTasks={tasks.length}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
