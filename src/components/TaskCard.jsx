import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { VIRTUE_META, DIFFICULTY_META, getTopVirtues } from '../virtues';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
  white:  '#FFFFFF',
};

/* Priority dot colors — accessible, uses navy text on bright surfaces */
const PRIORITY_DOT = {
  high:   { color: C.orange,  label: 'High' },
  medium: { color: C.yellow,  label: 'Medium' },
  low:    { color: C.green,   label: 'Low' },
};

export function TaskCard({ task, columnId, index = 0, accentColor = C.blue }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { columnId, task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
  };

  const priority = PRIORITY_DOT[task.priority] ?? PRIORITY_DOT.medium;
  const isHarvested = columnId === 'harvested';
  const topVirtues  = getTopVirtues(task.virtueWeights ?? {}, 1);
  const topVirtue   = topVirtues[0];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isDragging ? 0.25 : 1,
        y: 0,
        rotate: isDragging ? 2 : 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        type: 'spring',
        stiffness: 340,
        damping: 26,
        delay: isDragging ? 0 : index * 0.04,
      }}
      whileHover={!isDragging ? {
        y: -3,
        boxShadow: `3px 3px 0 ${accentColor}`,
        transition: { duration: 0.12 },
      } : {}}
      layout
      layoutId={task.id}
      style={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        style={{
          background: isHarvested ? `${C.green}0D` : C.white,
          border: `1.5px solid ${isHarvested ? `${C.green}40` : 'rgba(23,37,84,0.1)'}`,
          borderLeft: `3px solid ${accentColor}`,
          padding: '12px 14px',
          position: 'relative',
          userSelect: 'none',
          /* No border-radius — editorial flat style */
        }}
      >
        {/* Row 1: Title + priority dot */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
          {/* Priority dot — accessible indicator */}
          <div
            title={`Priority: ${priority.label}`}
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: priority.color,
              flexShrink: 0,
              marginTop: 4,
              border: `1.5px solid rgba(23,37,84,0.15)`,
            }}
          />

          <h3
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: C.navy,
              lineHeight: 1.35,
              flex: 1,
              letterSpacing: '-0.01em',
            }}
          >
            {task.title}
          </h3>
        </div>

        {/* Row 2: Tags + virtue */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {/* Tag chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {task.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.navy,
                  background: `rgba(23,37,84,0.07)`,
                  padding: '2px 7px',
                  letterSpacing: '0.05em',
                  /* Flat, no border-radius */
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Top virtue + difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {topVirtue && (
              <span
                title={`${topVirtue.virtue}: ${topVirtue.weight}%`}
                style={{
                  fontSize: 9,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  color: VIRTUE_META[topVirtue.virtue]?.color ?? C.blue,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {topVirtue.virtue.slice(0, 3)}
              </span>
            )}
            {task.difficulty && (
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: 'rgba(23,37,84,0.45)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {DIFFICULTY_META?.[task.difficulty]?.label?.slice(0, 3) ?? ''}
              </span>
            )}
          </div>
        </div>

        {/* Harvested checkmark */}
        {isHarvested && (
          <div
            aria-label="Harvested"
            style={{
              position: 'absolute',
              top: 10, right: 12,
              color: C.green,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
