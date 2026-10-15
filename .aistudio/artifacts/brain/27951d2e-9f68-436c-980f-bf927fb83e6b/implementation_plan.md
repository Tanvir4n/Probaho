# Glassmorphic Sidebar & Frosted Action Drawer

Refines the architectural sidebar into a high-fidelity glassmorphic dock featuring a frosted white action pill with a green active indicator ring, smooth slide-out telemetry drawer, and complete green accent hierarchy across day and night viewports.

### User Review & Critical Decisions

> [!IMPORTANT]
> The sidebar and action drawer behavior has been aligned with your preferences:
> - **Confirmed Action Pill & Drawer Behavior**: The `< INFO` toggle is styled as an exact-match frosted white glass pill with an emerald/neon green active ring and pulse pip, revealing an interactive pop-out telemetry drawer containing active tool specifications, city projection switchers, and direct studio triggers.
> - **Confirmed Color Harmony**: Replaced legacy orange/blue accents across all sidebar states with vivid architectural green (`#22c55e` in night mode, `#16a34a` in day mode) with specular top-edge bevels and deep blur layers.

---

### 1. Overview & Core Concept

- **What It Does**: Provides architects and computational designers with an unobtrusive, floating glassmorphic sidebar dock anchored on the right viewport edge. It includes quick-selection tool tiles (MassLabs, archiMap, Colorgram, LaserFish) and an interactive frosted info pill that smoothly slides open an in-depth telemetry and dataset drawer.
- **Target Audience / Persona**: Computational architects, urban planners, GIS analysts, and creative technologists exploring architectural generative tooling.
- **Key Value**: Delivers frictionless navigation and tool state inspection without obscuring the background 3D/2D urban cartographic projection canvas.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Tool Switching**: The user clicks any of the 4 vertical tool icons (`MassLabs`, `archiMap`, `Colorgram`, `LaserFish`) in the frosted dock. The active tool highlights with a green bounding frame, a right-side green tab indicator, and updates the synchronized map projections and active tool state across the application.
2. **Opening Telemetry Drawer**: Clicking the frosted white `< INFO` pill expands a floating glassmorphic telemetry drawer from the right dock to the left, showing the active tool's full specifications, live metadata chips, quick urban map switches (New York, Tokyo, London, Cologne), and the "Launch Studio" shortcut button.
3. **Closing Drawer**: Clicking the active `HIDE >` pill or clicking outside collapses the drawer with a smooth cubic-bezier exit.
4. **Day / Night Adaptability**: Toggling the theme transforms the dock from dark tinted frosted acrylic (`rgba(12, 14, 18, 0.70)`) to crystalline day-lit glass (`rgba(255, 255, 255, 0.75)`), preserving contrast ratios and crisp specular borders.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-precision architectural glassmorphism with frosted acrylic diffusion, specular rim lighting, and clean Swiss typography.
- **Color Palette & Mood**:
  - Background Dock: `rgba(12, 14, 18, 0.70)` (night) / `rgba(255, 255, 255, 0.75)` (day) with `backdrop-blur-24px` and `backdrop-saturate-200%`.
  - Accent / Focus: Vivid emerald green (`#22c55e` / `#16a34a`), luminous glow shadows (`0 0 16px rgba(34, 197, 94, 0.35)`).
  - Borders & Reflections: 1px hairline frosted border (`rgba(255, 255, 255, 0.20)` night / `rgba(255, 255, 255, 0.90)` day) with inset highlight bevels (`inset 0 1.5px 1.5px rgba(255, 255, 255, 0.25)`).
- **Typography & Hierarchy**:
  - Labels & Tool Names: Tabular monospace font (`IBM Plex Mono` / `Space Mono`) with tight tracking.
  - Headers & Meta: Clean title case and unboxed metadata separated by middots (`·`).
- **Interactive Feedback & Motion**:
  - Hover states feature a subtle `-translate-y-0.5` lift with specular refraction brighten.
  - The drawer employs hardware-accelerated slide and fade transitions (`transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1)`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Action Pill Styling & Active Ring**
  - *Chosen Approach*: Frosted white glass pill (`bg-white/90` or `bg-white/15`) with a 1.5px glowing green ring when active, accompanied by a pulsing status pip.
  - *Why*: Provides high contrast against both dark blueprint backgrounds and daylight map tiles while adhering to the user's specific design request.
  - *Alternatives Considered*: Standard flat dark buttons were discarded because they lacked depth and visual connection to the glass dock.

- **Decision 2: Pop-out Drawer vs. Modal Overlay**
  - *Chosen Approach*: Lateral sliding pop-out drawer anchored directly to the left of the dock.
  - *Why*: Maintains spatial continuity with the dock tiles and keeps the center canvas visible for real-time map updates when switching cities.
  - *Alternatives Considered*: Full-screen modal or overlay would obstruct map navigation and feel disruptive for quick tool inspection.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Viewport Layout                                 │
│                                                                             │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │   ArchitecturalBackground     │  │        Header & Navigation         │  │
│  │   (Interactive City Canvas)   │  │   (Frosted Glassmorphic Bar)       │  │
│  └──────────────┬────────────────┘  └────────────────────────────────────┘  │
│                 │                                                           │
│                 ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       MassGlassSidebar (Fixed Right)                  │  │
│  │                                                                       │  │
│  │   ┌───────────────────────────┐      ┌────────────────────────────┐   │  │
│  │   │  Pop-out Info Drawer      │◄────►│   Vertical Glass Dock      │   │  │
│  │   │  - Live Telemetry         │      │   - Frosted Pill < INFO    │   │  │
│  │   │  - Tool Specifications    │      │   - MassLabs Tool Tile     │   │  │
│  │   │  - 4-City Quick Switch    │      │   - archiMap Tool Tile     │   │  │
│  │   │  - Launch Studio CTA      │      │   - Colorgram Tool Tile    │   │  │
│  │   │  - Token / Spec Trigger   │      │   - LaserFish Tool Tile    │   │  │
│  │   └───────────────────────────┘      └──────────────┬─────────────┘   │  │
│  └─────────────────────────────────────────────────────┼─────────────────┘  │
│                                                        ▼                    │
│                                            ┌─────────────────────────┐      │
│                                            │  Active State Handler   │      │
│                                            │  (toolId, mapIndex)     │      │
│                                            └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### State & Interaction Mapping
- `isExpanded` (boolean): Controls visibility and slide animation of the pop-out info drawer.
- `activeToolId` (string): Syncs with hero cards, pricing, and site analysis modal.
- `currentMapIndex` (number): Directly triggers background map switches (Manhattan, Tokyo, London, Cologne) from within the drawer.
- `onOpenSiteAnalysis` (callback): Launches the interactive GIS Site Analysis studio modal.
