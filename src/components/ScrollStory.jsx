/**
 * ScrollStory — Main editorial page.
 *
 * Single scrollable experience:
 *   Nav → Hero → Seeds → Ripening → Harvest → Board → Stats → Footer
 *
 * Inspired by kail.studio: immersive full-screen sections, large editorial
 * typography, floating objects, minimal navigation, clean whitespace.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MangoTetrapack } from './MangoTetrapack';
import { BlenderSVG } from './BlenderSVG';
import { Board } from './Board';
import { ProfileStats } from './ProfileStats';
import {
  useStore,
  COLUMNS,
  selectColumns,
  selectProfile,
} from '../store/useStore';
import { VIRTUES } from '../virtues';

/* ── Spec palette constants ──────────────────────────────── */
const C = {
  navy:    '#172554',
  blue:    '#2563EB',
  yellow:  '#FACC15',
  orange:  '#FB923C',
  green:   '#22C55E',
  white:   '#FFFFFF',
  offWhite:'#FAFAF8',
};

/* ── Smooth spring easing ────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ==========================================================================
   SHARED MICRO COMPONENTS
   ========================================================================== */

/** Translucent bubble shape for hero background */
function Bubble({ size, opacity, x, y, blur = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: '50%',
        background: `rgba(255,255,255,${opacity})`,
        border: `1px solid rgba(255,255,255,${Math.min(opacity * 1.8, 0.3)})`,
        left: x, top: y,
        filter: blur ? `blur(${blur}px)` : undefined,
        pointerEvents: 'none',
      }}
    />
  );
}

/** Scroll-triggered reveal wrapper */
function Reveal({ children, delay = 0, y = 40 }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Typography helpers ──────────────────────────────────── */
const sectionLabel = (color) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color,
  margin: 0,
});

const bodyText = (color, size = 18) => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.6,
  color,
  margin: 0,
});

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function Nav({ onProfileOpen }) {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const onWhite   = scrolled;
  const textColor = onWhite ? C.navy : 'rgba(255,255,255,0.9)';
  const navBg     = onWhite ? 'rgba(255,255,255,0.97)' : 'transparent';

  const links = [
    { label: 'SEEDS',   id: 'seeds' },
    { label: 'BOARD',   id: 'board' },
    { label: 'HARVEST', id: 'harvest' },
    { label: 'STATS',   id: 'stats' },
  ];

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 48px',
          background: navBg,
          backdropFilter: onWhite ? 'blur(18px)' : 'none',
          borderBottom: onWhite ? `1px solid rgba(23,37,84,0.08)` : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: textColor,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
            transition: 'color 0.4s',
          }}
        >
          Mango Harvest
        </button>

        {/* Desktop links */}
        <div
          className="nav-desktop"
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: textColor,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0',
                opacity: 0.82,
                transition: 'opacity 0.2s, color 0.4s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.82)}
            >
              {link.label}
            </button>
          ))}

          {/* Profile button */}
          <button
            id="profile-open-btn"
            onClick={onProfileOpen}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 22px',
              background: onWhite ? C.navy : 'rgba(255,255,255,0.15)',
              color: C.white,
              border: `2px solid ${onWhite ? C.navy : 'rgba(255,255,255,0.45)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.yellow;
              e.currentTarget.style.color      = C.navy;
              e.currentTarget.style.borderColor = C.yellow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = onWhite ? C.navy : 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color       = C.white;
              e.currentTarget.style.borderColor = onWhite ? C.navy : 'rgba(255,255,255,0.45)';
            }}
          >
            PROFILE
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile navigation"
          aria-expanded={mobileOpen}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: textColor,
            display: 'none', padding: 4,
            transition: 'color 0.4s',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0,
              background: C.white,
              borderBottom: `3px solid ${C.navy}`,
              padding: '20px 32px 28px',
              zIndex: 99,
              display: 'flex', flexDirection: 'column', gap: 18,
            }}
          >
            {[...links, { label: 'PROFILE', id: 'profile' }].map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileOpen(false);
                  link.id === 'profile' ? onProfileOpen() : scrollTo(link.id);
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: 14,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: C.navy, background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', padding: '4px 0',
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      style={{
        minHeight: '100vh',
        background: C.blue,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
      }}
    >
      {/* Translucent bubbles — decorative only */}
      <Bubble size={430} opacity={0.06} x="56%" y="-6%" blur={45} />
      <Bubble size={210} opacity={0.09} x="5%"  y="54%" />
      <Bubble size={95}  opacity={0.12} x="83%" y="67%" />
      <Bubble size={58}  opacity={0.16} x="22%" y="16%" />
      <Bubble size={140} opacity={0.07} x="87%" y="18%" blur={18} />

      {/* Content grid */}
      <div
        className="hero-inner"
        style={{
          width: '100%', maxWidth: 1400,
          margin: '0 auto',
          padding: '60px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: 48,
        }}
      >
        {/* Left: editorial headline */}
        <div>
          <Reveal>
            <p style={sectionLabel('rgba(255,255,255,0.55)')}>
              Mango Harvest Studio · 2026
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1
              id="hero-title"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(4.5rem, 11.5vw, 10.5rem)',
                color: C.white,
                lineHeight: 0.9,
                letterSpacing: '0.01em',
                margin: '16px 0 30px',
                textShadow: `4px 4px 0 rgba(23,37,84,0.28)`,
              }}
            >
              RIPEN<br />
              YOUR<br />
              WORK.
            </h1>
          </Reveal>

          <Reveal delay={0.11}>
            <p
              style={{
                ...bodyText('rgba(255,255,255,0.72)', 18),
                maxWidth: 380,
                marginBottom: 44,
              }}
            >
              Turn unfinished tasks into something golden.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <button
              id="start-harvesting-btn"
              onClick={() => document.getElementById('board')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '16px 34px',
                background: C.yellow,
                color: C.navy,
                border: `2px solid transparent`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform  = 'translate(-3px,-3px)';
                e.currentTarget.style.boxShadow = `4px 4px 0 ${C.navy}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform  = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform  = 'translate(1px,1px)';
                e.currentTarget.style.boxShadow = `1px 1px 0 ${C.navy}`;
              }}
            >
              START HARVESTING
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </Reveal>
        </div>

        {/* Right: floating tetrapack */}
        <div
          className="hero-tetrapack"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [-18, 16, -18],
              rotate: [-2.5, 2.5, -2.5],
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: `drop-shadow(0 28px 52px rgba(23,37,84,0.45))` }}
          >
            <MangoTetrapack size="xl" animate={true} />
          </motion.div>
        </div>
      </div>

      {/* Scroll prompt */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          pointerEvents: 'none',
        }}
      >
        <span style={{ ...sectionLabel('rgba(255,255,255,0.4)'), letterSpacing: '0.2em', fontSize: 10 }}>
          SCROLL
        </span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
            <rect x="1" y="1" width="16" height="24" rx="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="2.5" fill="rgba(255,255,255,0.5)" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SEEDS SECTION (01)
   ========================================================================== */
function SeedsSection() {
  const prefersReducedMotion = useReducedMotion();

  /* Floating task tag positions */
  const floatingTags = [
    { text: 'DESIGN',      rot: -7, x: '70%',  y: '25%', dur: 4.2 },
    { text: 'ENGINEERING', rot: 4,  x: '67%',  y: '54%', dur: 5.1 },
    { text: 'ANIMATION',   rot: -4, x: '74%',  y: '74%', dur: 4.7 },
  ];

  return (
    <section
      id="seeds"
      aria-labelledby="seeds-heading"
      style={{
        minHeight: '90vh',
        background: C.blue,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 60px',
        borderTop: `1px solid rgba(255,255,255,0.12)`,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Text block */}
        <div style={{ maxWidth: 560 }}>
          <Reveal>
            <p style={sectionLabel('rgba(255,255,255,0.5)')}>01 / SEEDS</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="seeds-heading"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(5.5rem, 15vw, 15rem)',
                color: C.white,
                lineHeight: 0.87,
                margin: '10px 0 32px',
                letterSpacing: '0.01em',
              }}
            >
              SEEDS
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p style={{ ...bodyText('rgba(255,255,255,0.68)', 20), maxWidth: 340 }}>
              Start with the unfinished.
            </p>
          </Reveal>
        </div>

        {/* Floating task tag shapes — decorative, aria-hidden */}
        {!prefersReducedMotion && floatingTags.map((tag, i) => (
          <motion.div
            key={tag.text}
            aria-hidden="true"
            className="seed-tag"
            style={{
              left: tag.x, top: tag.y,
              transform: `rotate(${tag.rot}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease }}
            animate={{
              y: [0, -10, 0],
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.65)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {tag.text}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   RIPENING SECTION (02)
   ========================================================================== */
function RipeningSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="ripening-heading"
      style={{
        minHeight: '90vh',
        background: C.yellow,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 60px',
      }}
    >
      <div
        className="story-split"
        style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}
      >
        {/* Left: text */}
        <div>
          <Reveal>
            <p style={sectionLabel(`${C.orange}`)}>02 / RIPENING</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="ripening-heading"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(4.5rem, 11vw, 11rem)',
                color: C.navy,
                lineHeight: 0.87,
                margin: '10px 0 32px',
              }}
            >
              RIPENING
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p style={{ ...bodyText(`${C.navy}BB`, 20), maxWidth: 340 }}>
              Momentum makes it sweeter.
            </p>
          </Reveal>
        </div>

        {/* Right: blender — visual focus */}
        <Reveal delay={0.12}>
          <div
            className="story-split-visual"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [-10, 10, -10] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 22px 44px rgba(23,37,84,0.22))` }}
            >
              <BlenderSVG fillLevel={0.52} liquidColor={C.orange} />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   HARVEST SECTION (03)
   ========================================================================== */
function HarvestSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="harvest"
      aria-labelledby="harvest-heading"
      style={{
        minHeight: '90vh',
        background: C.white,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 60px',
        borderTop: `6px solid ${C.green}`,
      }}
    >
      <div
        className="story-split"
        style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}
      >
        {/* Left: tetrapack reveal — visual focus */}
        <Reveal>
          <div
            className="story-split-visual"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [-12, 10, -12] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 20px 40px rgba(34,197,94,0.28))` }}
            >
              <MangoTetrapack size="lg" animate={true} />
            </motion.div>
          </div>
        </Reveal>

        {/* Right: text */}
        <div>
          <Reveal delay={0.06}>
            <p style={sectionLabel(C.green)}>03 / HARVEST</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              id="harvest-heading"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(4.5rem, 11vw, 11rem)',
                color: C.navy,
                lineHeight: 0.87,
                margin: '10px 0 32px',
              }}
            >
              HARVEST
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{ ...bodyText(`${C.navy}99`, 20), maxWidth: 340, marginBottom: 36 }}>
              Make the win visible.
            </p>
          </Reveal>

          {/* Stage chips */}
          <Reveal delay={0.2}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {[
                { text: 'DONE',    color: C.green },
                { text: 'BLENDED', color: C.blue },
                { text: 'SHIPPED', color: C.orange },
              ].map(({ text, color }) => (
                <span
                  key={text}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '7px 16px',
                    background: `${color}18`,
                    color,
                    border: `1.5px solid ${color}44`,
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   BOARD SECTION (04) — embedded functional Kanban
   ========================================================================== */
function BoardSection({ onProfileOpen }) {
  return (
    <section
      id="board"
      aria-labelledby="board-heading"
      style={{
        background: C.offWhite,
        padding: '100px 0 80px',
        borderTop: `1px solid rgba(23,37,84,0.08)`,
      }}
    >
      {/* Section header */}
      <div
        className="section-pad"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 60px 60px',
        }}
      >
        <Reveal>
          <p style={sectionLabel(C.orange)}>04 / BOARD</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              marginTop: 10,
            }}
          >
            <h2
              id="board-heading"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
                color: C.navy,
                lineHeight: 0.9,
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              YOUR<br />
              WORK.
            </h2>

            <p
              style={{
                ...bodyText(`${C.navy}75`, 15),
                maxWidth: 300,
                paddingBottom: 6,
              }}
            >
              Drag tasks through the stages. Harvest them all to blend.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Embedded board — all DnD functionality intact */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 60px' }}>
        <Reveal delay={0.1}>
          <Board embedded onProfileOpen={onProfileOpen} />
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   STATS SECTION (05)
   ========================================================================== */
function StatsSection() {
  const columns = useStore(selectColumns);
  const profile = useStore(selectProfile);

  const harvestedCount = columns[COLUMNS.HARVESTED]?.length ?? 0;
  const totalXP = VIRTUES.reduce(
    (sum, v) => sum + (profile.lifetimeStats[v] ?? 0),
    0,
  );

  const statItems = [
    { value: harvestedCount,        label: 'Tasks Harvested', color: C.green  },
    { value: totalXP,               label: 'XP Earned',       color: C.blue   },
    { value: profile.totalShakes,   label: 'Sessions Blended',color: C.orange },
    { value: profile.rank.title,    label: 'Current Rank',    color: C.navy, isText: true },
  ];

  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      style={{
        background: C.white,
        padding: '120px 60px 100px',
        borderTop: `1px solid rgba(23,37,84,0.08)`,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <p style={sectionLabel(C.blue)}>05 / STATS</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            id="stats-heading"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: C.navy,
              lineHeight: 0.9,
              margin: '12px 0 72px',
              letterSpacing: '0.02em',
            }}
          >
            YOUR HARVEST.
          </h2>
        </Reveal>

        <div className="stats-grid">
          {statItems.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div
                style={{
                  padding: '40px 36px',
                  borderRight: i < statItems.length - 1
                    ? `1px solid rgba(23,37,84,0.1)`
                    : 'none',
                }}
              >
                {/* Large number */}
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: stat.isText
                      ? 'clamp(2rem, 3.5vw, 4rem)'
                      : 'clamp(3.5rem, 7vw, 7rem)',
                    color: stat.color,
                    lineHeight: 1,
                    marginBottom: 10,
                    letterSpacing: stat.isText ? '0.03em' : '0.01em',
                  }}
                >
                  {stat.value}
                </div>
                {/* Label */}
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: `${C.navy}65`,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOOTER
   ========================================================================== */
function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: C.navy,
        padding: '36px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        MANGO HARVEST
      </span>

      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: 'rgba(255,255,255,0.28)',
        }}
      >
        Group 14 · Sophomore Project · 2026
      </span>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: C.yellow,
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
      >
        BACK TO TOP ↑
      </button>
    </footer>
  );
}

/* ==========================================================================
   MAIN EXPORT
   ========================================================================== */
export function ScrollStory() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Fixed navigation */}
      <Nav onProfileOpen={() => setShowProfile(true)} />

      {/* Page sections */}
      <HeroSection />
      <SeedsSection />
      <RipeningSection />
      <HarvestSection />
      <BoardSection onProfileOpen={() => setShowProfile(true)} />
      <StatsSection />
      <Footer />

      {/* Profile drawer overlay — managed at page level */}
      <ProfileStats
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}
