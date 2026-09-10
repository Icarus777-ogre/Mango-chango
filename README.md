# 🥭 MANGO HARVEST — Pure HTML/CSS/JS Editorial Gamified Kanban

> **Ripen Your Work. Turn daily productivity into a bold, visual growth journey.**  
> A creative-studio editorial experience mixed with a punk mango beverage campaign, built with **100% Pure Vanilla HTML5, CSS3, and modern JavaScript (ES Modules)**.

---

## ⚡ Concept & Experience

**Mango Harvest** turns task management into an interactive fruit-to-beverage transformation pipeline:

```
 🌱 SEEDS               🍌 RIPENING            🥭 HARVESTED           🧃 MANGO TETRAPACK
[Raw Backlog]   ───►   [In-Progress]   ───►   [Done / Blended] ───►  [Session Reward & Virtues]
```

- **Seeds (`#2563EB`)**: Tasks waiting to germinate.
- **Ripening (`#FACC15`)**: Tasks gaining momentum in the pipeline.
- **Harvested (`#22C55E`)**: Completed tasks ready for the blender.
- **The Blender & Tetrapack (`#FB923C` / `#172554`)**: The transformation sequence that blends completed tasks into a custom session juice box with interactive nutritional virtue facts.

---

## ✨ Key Features

### 1. 📜 Editorial Narrative Single-Page Layout (`index.html` & `src/js/scrollStory.js`)
- Seamless scroll-driven storytelling inspired by creative studio portfolios (*kail.studio*).
- Massive **Bebas Neue** headlines (`RIPEN YOUR WORK.`), high-contrast color-blocked sections, floating ambient vector graphics, and fluid section transitions.
- IntersectionObserver scroll reveal animations and responsive mobile drawer navigation.

### 2. 📋 Pure Vanilla Drag-and-Drop Kanban Board (`src/js/board.js`)
- Native HTML5 Drag & Drop with tactile hover elevation, drag opacity feedback, and drop target highlights.
- Flat rectangular editorial styling with colored column accent borders and custom drag styling.
- Real-time task count indicators, priority chips, and dynamic virtue tags.

### 3. 🌀 6-Stage Celebration Portal (`src/js/celebration.js`)
When all tasks reach the **HARVESTED** column, a multi-phase celebration sequence triggers:
1. **GATHER**: Task cards orbit the vector blender.
2. **FLY**: Tasks fly directly into the blender chamber.
3. **SHAKE**: High-vibration blending with animated blade motion and rising liquid.
4. **WAVE**: Crisp white screen-wipe reveal with corner starbursts.
5. **SUCCESS**: Large editorial "HARVESTED." status.
6. **CARTON SHOWCASE**: 3-column reveal displaying the custom **BlenderSVG**, **MangoTetrapack 3D Carton**, and **CartonLabel** (Nutritional Facts breakdown with animated virtue percentage bars).

### 4. 🧬 4-Virtue Gamification Engine (`src/js/virtues.js` & `src/js/profile.js`)
- Tasks award XP across 4 distinct virtue categories:
  - 🧠 **Intellect**: Strategy, logic, and architecture.
  - 🤝 **Harmony**: Communication, teamwork, and balance.
  - ⚡ **Discipline**: Consistency, speed, and execution.
  - 🛡️ **Resilience**: Debugging, heavy tasks, and grit.
- Permanent stat upgrades upon conquering high-difficulty tasks.
- Visualized via an interactive **Trigonometric Vector SVG Radar Chart** (no heavy charting libraries required).

### 5. ♿ Accessibility & Motion Polish
- Full `prefers-reduced-motion` compliance across CSS transitions.
- Native cursor preservation with keyboard navigation focus states and semantic ARIA labeling.

---

## 🎨 Design System & Palette

The visual identity uses an intentional punk beverage palette:

| Token | Hex | Name | Primary Usage |
|---|---|---|---|
| `--electric-blue` | `#2563EB` | **Electric Blue** | Hero background, Seeds section, radar chart, action accents |
| `--mango-yellow` | `#FACC15` | **Mango Yellow** | Primary CTA buttons, Ripening section, tetrapack body |
| `--vivid-orange` | `#FB923C` | **Vivid Orange** | Blender body, column accent borders, section tags |
| `--fresh-green` | `#22C55E` | **Fresh Green** | Harvest section, Harvested column, completion badges |
| `--ink-navy` | `#172554` | **Ink Navy** | Display typography, outlines, high-contrast borders, footer |
| `--pure-white` | `#FFFFFF` | **Pure White** | Card surfaces, modal drawers, clean negative space |

---

## 🛠️ Tech Stack

- **Core**: 100% Pure HTML5, CSS3, JavaScript (ES Next / ES Modules)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/) (vanilla static module server)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Zero Frameworks**: No React, no JSX, no external React libraries.

---

## 📁 Project Architecture

```text
Project/
├── dist/                    # Production bundle
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Logos and media assets
│   ├── styles/
│   │   └── main.css         # Complete design token system, editorial typography & animations
│   └── js/
│       ├── board.js         # Vanilla HTML5 drag-and-drop Kanban engine
│       ├── celebration.js   # 6-phase celebration sequence & nutrition facts label
│       ├── main.js          # App initialization and bootstrap
│       ├── profile.js       # Profile drawer & pure SVG polygon radar chart
│       ├── scrollStory.js   # Navigation, scroll reveals, and live metrics
│       ├── store.js         # Lightweight pub/sub state store with localStorage
│       ├── svgs.js          # Pure vector SVG generators (Tetrapack, Blender, Starburst)
│       └── virtues.js       # 4-virtue algorithms, XP levels, and rank progression
├── index.html               # Semantic HTML5 single-page editorial layout
├── package.json             # Minimal dependencies (Vite + Oxlint only)
└── vite.config.js           # Vanilla Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` to view the application live.

3. **Production Build:**
   ```bash
   npm run build
   ```

4. **Lint Code:**
   ```bash
   npm run lint
   ```

---

## 📄 License

Distributed under the MIT License. Feel free to use and modify for personal or commercial projects.
