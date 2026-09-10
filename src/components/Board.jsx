import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';

import {
  useStore,
  COLUMNS,
  COLUMN_META,
  selectColumns,
  selectTasks,
  selectProfile,
  selectSessionVirtues,
  selectSessionHeavyUpgrades,
  selectHarvestedIds,
  selectMoveTask,
  selectCompleteSession,
  selectResetBoard,
} from '../store/useStore';
import { useCheckCompletion } from '../hooks/useCheckCompletion';
import { Column } from './Column';
import { CelebrationPortal } from './CelebrationPortal';

/* ── Spec palette ───────────────────────────────────────── */
const C = {
  navy:   '#172554',
  blue:   '#2563EB',
  yellow: '#FACC15',
  orange: '#FB923C',
  green:  '#22C55E',
  white:  '#FFFFFF',
  off:    '#FAFAF8',
};

/**
 * Board — Functional Kanban.
 *
 * Props:
 *   embedded       {boolean} — when true: strip full-page wrapper (used in ScrollStory)
 *   onProfileOpen  {function} — called when user triggers profile (embedded mode)
 */
export function Board({ embedded = false, onProfileOpen }) {
  const columns         = useStore(selectColumns);
  const tasks           = useStore(selectTasks);
  const profile         = useStore(selectProfile);
  const sessionVirtues  = useStore(selectSessionVirtues);
  const heavyUpgrades   = useStore(selectSessionHeavyUpgrades);
  const harvestedIds    = useStore(selectHarvestedIds);

  const harvestedTasks = useMemo(
    () => harvestedIds.map((id) => tasks[id]).filter(Boolean),
    [harvestedIds, tasks],
  );

  const moveTask        = useStore(selectMoveTask);
  const completeSession = useStore(selectCompleteSession);
  const resetBoard      = useStore(selectResetBoard);

  const [activeTask,      setActiveTask]      = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const { isComplete } = useCheckCompletion(columns);
  const prevCompleteRef = useRef(false);

  useEffect(() => {
    if (isComplete && !prevCompleteRef.current) {
      prevCompleteRef.current = true;
      const timer = setTimeout(() => {
        completeSession();
        setShowCelebration(true);
      }, 600);
      return () => clearTimeout(timer);
    }
    if (!isComplete) prevCompleteRef.current = false;
  }, [isComplete, completeSession]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findTaskColumn = useCallback(
    (taskId) => Object.entries(columns).find(([, ids]) => ids.includes(taskId))?.[0],
    [columns],
  );

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks[active.id] ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const fromColumn = findTaskColumn(active.id);
    const toColumn   = over.id;
    if (!fromColumn || !toColumn || fromColumn === toColumn) return;
    moveTask(active.id, fromColumn, toColumn);
  };

  const handleReset = () => {
    setShowCelebration(false);
    resetBoard();
  };

  const columnOrder = [COLUMNS.RAW, COLUMNS.RIPENING, COLUMNS.HARVESTED];

  /* ── DnD board grid (shared between modes) ─────────────── */
  const boardGrid = (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board-grid">
        {columnOrder.map((colId) => {
          const taskObjs = columns[colId].map((id) => tasks[id]).filter(Boolean);
          return (
            <Column
              key={colId}
              columnId={colId}
              tasks={taskObjs}
              meta={COLUMN_META[colId]}
            />
          );
        })}
      </div>

      {/* Drag ghost overlay */}
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              background: C.white,
              border: `2px solid ${C.navy}`,
              boxShadow: `4px 4px 0 ${C.yellow}`,
              padding: '13px 15px',
              width: 260,
              transform: 'rotate(2deg) scale(1.04)',
              opacity: 0.94,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: C.navy,
                marginBottom: 4,
                lineHeight: 1.35,
              }}
            >
              {activeTask.title}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: 'rgba(23,37,84,0.5)',
              }}
            >
              {activeTask.tags?.[0]}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  /* ── CELEBRATION OVERLAY ────────────────────────────────── */
  const celebrationOverlay = (
    <AnimatePresence>
      {showCelebration && (
        <CelebrationPortal
          tasks={harvestedTasks}
          sessionVirtues={sessionVirtues}
          heavyUpgrades={heavyUpgrades}
          onReset={handleReset}
        />
      )}
    </AnimatePresence>
  );

  /* ── EMBEDDED MODE ─────────────────────────────────────── */
  if (embedded) {
    return (
      <div style={{ position: 'relative' }}>
        {boardGrid}
        {celebrationOverlay}
      </div>
    );
  }

  /* ── STANDALONE MODE (fallback, not used in current routing) ── */
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.off,
        padding: '60px 40px 80px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Minimal standalone header */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: C.navy,
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: '0.02em',
            }}
          >
            YOUR WORK.
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(23,37,84,0.5)', fontWeight: 500 }}>
            Drag tasks through the stages. Harvest all to blend.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Rank pill */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '9px 18px',
              background: C.yellow,
              color: C.navy,
              border: `2px solid ${C.navy}`,
            }}
          >
            {profile.rank.title}
          </span>

          {onProfileOpen && (
            <button
              id="profile-open-btn-standalone"
              onClick={onProfileOpen}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '9px 18px',
                background: C.navy,
                color: C.white,
                border: `2px solid ${C.navy}`,
                cursor: 'pointer',
              }}
            >
              PROFILE
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {boardGrid}
      </div>
      {celebrationOverlay}
    </div>
  );
}
