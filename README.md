# Mango Chango 🥭

A task management web app built with pure Vanilla HTML, CSS, and JavaScript. **Mango Harvest** reframes productivity as a fruit-to-beverage journey: plant unfinished tasks as **Seeds**, move them through **Ripening**, and **Harvest** them to blend your daily wins.

---

## 💡 How It Works

Tasks move through three core stages on the board:

1. **Seeds (`#2563EB`)**: Tasks waiting to be tackled.
2. **Ripening (`#FB923C`)**: Active work in progress.
3. **Harvested (`#22C55E`)**: Completed tasks ready for blending.

When all tasks are harvested, the app triggers a blender celebration sequence that transforms completed work into a custom session tetrapack with virtue statistics.

---

## ✨ Features

- **Custom Task Creator**: Click **ADD TASK** to pick from pre-built templates (*Deep Work*, *Quick Win*, *Creative Sprint*, *Team Sync*, *Personal Reset*) and customize title, XP value, virtue type, and difficulty.
- **Interactive Kanban Board**: Built with native HTML5 Drag & Drop, live task counters, virtue tags, and difficulty badges.
- **Watering Sprinkler Cursor**: A custom sprinkler cursor follows mouse movement across the page, complete with a tactile water droplet spray effect on double-tap/double-click.
- **Data-Driven XP & Virtues**: Earn custom XP and build lifetime virtue stats (*Intellect*, *Discipline*, *Resilience*, *Harmony*, *Vitality*) as tasks are completed.
- **Profile Drawer & Radar Chart**: Track lifetime stats, rank titles, and virtue balance with a pure SVG radar chart.
- **Celebration Portal**: Animated blender transformation when harvesting all board tasks.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Dev Tooling**: [Vite](https://vitejs.dev/) for fast dev server & bundling
- **Linting**: [Oxlint](https://oxc.rs/)
- **Dependencies**: Zero runtime frameworks (no React, no external state libraries).

---

## 📁 Folder Structure

```text
Project/
├── src/
│   ├── js/
│   │   ├── board.js         # Kanban drag-and-drop logic
│   │   ├── celebration.js   # Harvest celebration animation
│   │   ├── main.js          # Main entry point
│   │   ├── profile.js       # Profile drawer & SVG radar chart
│   │   ├── scrollStory.js   # Navigation & scroll interactions
│   │   ├── sprinkler.js     # Custom sprinkler cursor & spray particles
│   │   ├── store.js         # Reactive state store with localStorage
│   │   ├── svgs.js          # Pure SVG vector generators
│   │   ├── taskCreator.js   # Task creation modal
│   │   └── virtues.js       # Virtue system & template definitions
│   └── styles/
│       └── main.css         # Design tokens, layout, and animations
├── index.html               # Single-page app HTML markup
└── package.json             # Project scripts and devDependencies
```

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local dev server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Run linter:**
   ```bash
   npm run lint
   ```
