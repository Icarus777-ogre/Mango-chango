// ─── Board State Schema ────────────────────────────────────────────────────────
// Normalized structure:
//   columns: { [columnId]: taskId[] }  — ordered list of task IDs per column
//   tasks:   { [taskId]: Task }        — single source of truth for task data
//
// This avoids duplicating task data across columns and makes MOVE_TASK O(n)
// with pure immutable array operations.

export const COLUMNS = {
  RAW: 'raw',
  RIPENING: 'ripening',
  HARVESTED: 'harvested',
};

export const COLUMN_META = {
  [COLUMNS.RAW]: {
    id: COLUMNS.RAW,
    title: 'Backlog',
    subtitle: 'Seeds awaiting their season',
    emoji: '🌱',
    bgColor: '#FFFFFF',
    headerColor: '#172554',
    borderColor: '#172554',
    cardBg: '#F8FAFC',
    cardBorder: '#E2E8F0',
    tagColor: '#2563EB',
    borderStyle: 'solid',
    accentGlow: 'rgba(37, 99, 235, 0.1)',
  },
  [COLUMNS.RIPENING]: {
    id: COLUMNS.RIPENING,
    title: 'In Progress',
    subtitle: 'Soaking in the tropical sun',
    emoji: '🌤️',
    bgColor: '#FFFFFF',
    headerColor: '#172554',
    borderColor: '#172554',
    cardBg: '#FEF9C3',
    cardBorder: '#FDE047',
    tagColor: '#CA8A04',
    borderStyle: 'solid',
    accentGlow: 'rgba(250, 204, 21, 0.15)',
  },
  [COLUMNS.HARVESTED]: {
    id: COLUMNS.HARVESTED,
    title: 'Done',
    subtitle: 'Ripe, golden & ready to blend',
    emoji: '🥭',
    bgColor: '#FFFFFF',
    headerColor: '#172554',
    borderColor: '#172554',
    cardBg: '#DCFCE7',
    cardBorder: '#86EFAC',
    tagColor: '#16A34A',
    borderStyle: 'solid',
    accentGlow: 'rgba(34, 197, 94, 0.15)',
  },
};

// ─── Initial Seed Data ─────────────────────────────────────────────────────────
const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Design the harvest dashboard',
    description: 'Wireframe and prototype the main board UI with mango theme',
    priority: 'high',
    emoji: '🎨',
    tags: ['Design', 'UI'],
  },
  {
    id: 'task-2',
    title: 'Set up drag-and-drop engine',
    description: 'Integrate @dnd-kit with accessible keyboard support',
    priority: 'high',
    emoji: '⚙️',
    tags: ['Engineering', 'Core'],
  },
  {
    id: 'task-3',
    title: 'Craft the blender animation',
    description: 'Build the Framer Motion celebration sequence portal',
    priority: 'medium',
    emoji: '🎬',
    tags: ['Animation', 'UX'],
  },
  {
    id: 'task-4',
    title: 'Write ripening metaphor copy',
    description: 'Polish all microcopy to match the mango harvest narrative',
    priority: 'low',
    emoji: '✍️',
    tags: ['Content', 'Copy'],
  },
];

export const initialState = {
  columns: {
    [COLUMNS.RAW]: ['task-1', 'task-2'],
    [COLUMNS.RIPENING]: ['task-3'],
    [COLUMNS.HARVESTED]: ['task-4'],
  },
  tasks: Object.fromEntries(SEED_TASKS.map((t) => [t.id, t])),
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
export function boardReducer(state, action) {
  switch (action.type) {
    case 'MOVE_TASK': {
      const { taskId, fromColumn, toColumn, toIndex } = action.payload;

      if (fromColumn === toColumn) return state;

      // Pure immutable removal from source column
      const newFrom = state.columns[fromColumn].filter((id) => id !== taskId);

      // Pure immutable insertion at target index in destination column
      const newTo = [...state.columns[toColumn]];
      const insertAt = toIndex !== undefined ? toIndex : newTo.length;
      newTo.splice(insertAt, 0, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumn]: newFrom,
          [toColumn]: newTo,
        },
      };
    }

    case 'RESET_BOARD': {
      return initialState;
    }

    default:
      return state;
  }
}
