import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
  white:  '#FFFFFF',
};

/* Editorial column identity — overrides COLUMN_META display text */
const EDITORIAL = {
  raw: {
    name:       'SEEDS',
    accent:     C.blue,
    label:      '01',
    emptyText:  'Nothing planted yet.',
    dropText:   'DROP HERE',
    headerBg:   C.blue,
    bodyBg:     '#EFF6FF',
  },
  ripening: {
    name:       'RIPENING',
    accent:     C.orange,
    label:      '02',
    emptyText:  'Still waiting for the sun.',
    dropText:   'DROP HERE',
    headerBg:   C.yellow,
    bodyBg:     '#FFFBEB',
  },
  harvested: {
    name:       'HARVESTED',
    accent:     C.green,
    label:      '03',
    emptyText:  'Nothing ripe yet.',
    dropText:   'DROP HERE',
    headerBg:   C.green,
    bodyBg:     '#F0FDF4',
  },
};

export function Column({ columnId, tasks }) {
  const { isOver, setNodeRef } = useDroppable({ id: columnId });

  const ed = EDITORIAL[columnId] ?? EDITORIAL.raw;
  const taskCount = tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
    >
      {/* Column shell */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${ed.accent}`,
          boxShadow: isOver
            ? `0 0 0 2px ${ed.accent}, 4px 4px 0 ${ed.accent}`
            : `3px 3px 0 ${ed.accent}44`,
          background: ed.bodyBg,
          minHeight: 480,
          maxHeight: 'calc(100vh - 200px)',
          transition: 'box-shadow 0.18s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header — bright accent color */}
        <div
          style={{
            background: ed.headerBg,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderBottom: `2px solid ${ed.accent}`,
          }}
        >
          {/* Stage number + name */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: '0.14em',
                color: columnId === 'ripening' ? C.navy : 'rgba(255,255,255,0.75)',
                textTransform: 'uppercase',
              }}
            >
              {ed.label}
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: columnId === 'ripening' ? C.navy : C.white,
                lineHeight: 1,
              }}
            >
              {ed.name}
            </h2>
          </div>

          {/* Count badge */}
          <span
            aria-label={`${taskCount} tasks`}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 12,
              color: columnId === 'ripening' ? C.navy : C.white,
              background: 'rgba(0,0,0,0.15)',
              padding: '3px 10px',
              letterSpacing: '0.02em',
            }}
          >
            {taskCount}
          </span>
        </div>

        {/* Droppable body */}
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: isOver ? `${ed.accent}0D` : 'transparent',
            transition: 'background 0.15s ease',
          }}
        >
          {/* Drop indicator (empty + dragging over) */}
          {isOver && taskCount === 0 && (
            <div
              style={{
                border: `2px dashed ${ed.accent}`,
                padding: '28px 16px',
                textAlign: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ed.accent,
              }}
            >
              {ed.dropText}
            </div>
          )}

          {/* Empty state */}
          {!isOver && taskCount === 0 && (
            <div
              style={{
                padding: '48px 16px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'rgba(23,37,84,0.35)',
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                {ed.emptyText}
              </p>
            </div>
          )}

          {/* Task cards */}
          {tasks.map((task, idx) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}
              index={idx}
              accentColor={ed.accent}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
