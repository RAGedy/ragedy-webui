# Ember UI — Figma Design Specification
### Open WebUI Redesign · Handoff Document

> **Overview:** A full visual redesign of this Open WebUI fork using an "Ember" colour scheme — near-black surfaces, warm white text, and red-orange-amber glowing accents. Adds a new collapsible right sidebar (open by default). All existing routes, navigation links, and functional buttons are preserved unchanged; only the visual treatment is modified. This document is the complete design handoff for Figma.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Ember Color Palette](#2-ember-color-palette)
3. [Typography](#3-typography)
4. [Iconography](#4-iconography)
5. [Spacing & Grid](#5-spacing--grid)
6. [Global Layout Structure](#6-global-layout-structure)
7. [Left Sidebar (Redesigned)](#7-left-sidebar-redesigned)
8. [Right Sidebar (NEW)](#8-right-sidebar-new)
9. [Top Navbar — Chat View](#9-top-navbar--chat-view)
10. [Chat Interface](#10-chat-interface)
11. [Message Input Bar](#11-message-input-bar)
12. [Ember Glow Button Spec](#12-ember-glow-button-spec)
13. [Component States](#13-component-states)
14. [Modals & Overlays](#14-modals--overlays)
15. [Page-by-Page Breakdown](#15-page-by-page-breakdown)
16. [All Routes — Constraint Reference](#16-all-routes--constraint-reference)
17. [Animations & Motion](#17-animations--motion)
18. [Responsive Behaviour](#18-responsive-behaviour)
19. [Accessibility](#19-accessibility)
20. [Figma Component Checklist](#20-figma-component-checklist)

---

## 1. Design Philosophy

### The Ember Aesthetic

**Ember** is the visual language for this redesign. The metaphor is a dying coal — mostly dark and still, with deep concentrated heat at its core that occasionally breathes and pulses with warm colour. It is not fiery or aggressive. It is sophisticated, contained, and alive in a quiet way.

**Core Principles:**

| Principle | Implementation |
|---|---|
| **Dark First** | Near-black is the dominant surface. Light is reserved for text and critical focal points. |
| **Warmth, Not Fire** | Accents are warm (red-orange-amber), never cool. No blues, no greens, no teals. |
| **Earned Glow** | Glow effects are reserved for interactive moments. Not every element glows. The glow means something. |
| **Spatial Depth** | Three surface levels: void (background), raised (panels), elevated (modals). Each is slightly lighter. |
| **Measured Motion** | Animations are slow and breathing, never frantic. |

**What Ember is NOT:** it is not a "hacker terminal" aesthetic, not a warning/danger UI, not garish neon. The warm tones convey intelligence and warmth, not alarm.

---

## 2. Ember Color Palette

All tokens should be defined as Figma Variables (local color styles). Use OKLCH in code; use hex equivalents below in Figma.

### 2.1 Surface Tokens

| Token | Hex | OKLCH | Usage |
|---|---|---|---|
| `ember-void` | `#080808` | oklch(0.06 0 0) | App background, deepest layer |
| `ember-shadow` | `#101010` | oklch(0.09 0 0) | Left sidebar background |
| `ember-charcoal` | `#181818` | oklch(0.13 0 0) | Right sidebar background |
| `ember-graphite` | `#212121` | oklch(0.17 0 0) | Main content background |
| `ember-stone` | `#2a2a2a` | oklch(0.21 0 0) | Card / panel surfaces |
| `ember-ash` | `#363636` | oklch(0.27 0 0) | Hover states, subtle dividers |
| `ember-cinder` | `#454545` | oklch(0.33 0 0) | Borders, input outlines |

### 2.2 Text Tokens

| Token | Hex | Usage |
|---|---|---|
| `ember-text-primary` | `#f0ede8` | Body text, labels — warm white, not pure |
| `ember-text-secondary` | `#b8b4ae` | Subdued text, timestamps, hints |
| `ember-text-tertiary` | `#7a7570` | Placeholder, disabled text |
| `ember-text-inverse` | `#0a0a0a` | Text on light/glow surfaces |

> Note: Do **not** use pure white (`#ffffff`). The warmth in `ember-text-primary` (`#f0ede8`) is intentional — it reads as white but contributes to the thermal aesthetic.

### 2.3 Ember Accent Tokens

| Token | Hex | Role |
|---|---|---|
| `ember-core` | `#e83800` | Deepest red-orange; glow origin |
| `ember-flame` | `#ff4d00` | Primary interactive accent |
| `ember-glow` | `#ff7430` | Hover states, mid-glow |
| `ember-spark` | `#ff9a47` | Light accent, gradient midpoint |
| `ember-flare` | `#ffc84a` | Warm amber; gradient terminus |
| `ember-ember` | `#ffde80` | Brightest point of pulse animation |

### 2.4 Gradients

Define all as Figma gradient styles:

```
ember-gradient-horizontal:
  0%   → #e83800 (ember-core)
  50%  → #ff7430 (ember-glow)
  100% → #ffc84a (ember-flare)

ember-gradient-vertical:
  0%   → #e83800
  100% → #ff9a47

ember-gradient-radial (for glow halos):
  center → #ff4d00 at 0% opacity 80%
  edge   → transparent at 100%

ember-gradient-subtle-bg (sidebar accent stripe):
  top    → #ff4d00 opacity 60%
  bottom → #ffc84a opacity 20%
```

### 2.5 Semantic / Status Tokens

| Token | Hex | Usage |
|---|---|---|
| `ember-success` | `#4caf7a` | Success states, confirmed actions |
| `ember-warning` | `#f0a830` | Warnings (uses warm amber, fits palette) |
| `ember-error` | `#e84040` | Errors, destructive actions |
| `ember-info` | `#c0956a` | Informational messages (warm neutral) |

### 2.6 Transparency Scale

Use these for overlays and shadow glows:

```
ember-flame/10  — barely-there glow tint
ember-flame/20  — gentle glow
ember-flame/40  — active glow border
ember-flame/60  — hover highlight
ember-core/80   — strong accent fill
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallbacks |
|---|---|---|
| **Body / UI** | Inter | system-ui, -apple-system, sans-serif |
| **Display / Headings** | Archivo | Inter, sans-serif |
| **Code / Monospace** | JetBrains Mono | Menlo, Monaco, monospace |
| **RTL / Arabic** | Vazirmatn | system-ui |

### 3.2 Type Scale

| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display-xl` | 32px | 700 | 1.2 | -0.5px | Page titles, hero text |
| `display-lg` | 24px | 600 | 1.3 | -0.3px | Section headers |
| `display-md` | 20px | 600 | 1.35 | -0.2px | Panel headings |
| `display-sm` | 16px | 600 | 1.4 | -0.1px | Card headings |
| `body-lg` | 15px | 400 | 1.6 | 0 | Chat messages, main content |
| `body-md` | 14px | 400 | 1.55 | 0 | Body text, descriptions |
| `body-sm` | 13px | 400 | 1.5 | 0.1px | Captions, hints |
| `label-md` | 13px | 500 | 1.4 | 0.1px | Form labels, nav items |
| `label-sm` | 11px | 500 | 1.3 | 0.3px | Badges, tags, meta |
| `code-md` | 14px | 400 | 1.6 | 0 | Code blocks |
| `code-sm` | 12px | 400 | 1.5 | 0 | Inline code |

### 3.3 Text Treatment

- **Gradient text** (use sparingly on key headings): Apply `ember-gradient-horizontal` as text fill
- **Glow text** (for active states): `text-shadow: 0 0 12px ember-flame/50`
- **Tracking**: Uppercase labels use +0.5px–1px letter-spacing

---

## 4. Iconography

- **Icon library**: Lucide Icons (already used in codebase) — do not change the icon set
- **Icon size scale**: 12 / 14 / 16 / 18 / 20 / 24px
- **Default colour**: `ember-text-secondary` (#b8b4ae)
- **Active / hover colour**: `ember-text-primary` (#f0ede8)
- **Accent icon colour**: `ember-flame` (#ff4d00)
- **Stroke width**: 1.5px for all icons at ≥16px; 1.25px at 12–14px
- **Icons in ember-glow buttons**: always `#ffffff`

---

## 5. Spacing & Grid

### 5.1 Base Unit

4px. All spacing values are multiples of 4.

### 5.2 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon padding, tight gutters |
| `space-2` | 8px | Component internal padding |
| `space-3` | 12px | Default gap between related elements |
| `space-4` | 16px | Section padding, card padding |
| `space-5` | 20px | Panel padding |
| `space-6` | 24px | Section separation |
| `space-8` | 32px | Large section breaks |
| `space-10` | 40px | Page-level padding |
| `space-12` | 48px | Hero space |

### 5.3 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 4px | Tags, badges, tiny chips |
| `radius-sm` | 6px | Inputs, small buttons |
| `radius-md` | 8px | Cards, panels, buttons |
| `radius-lg` | 12px | Dropdowns, modals |
| `radius-xl` | 16px | Large cards, sheets |
| `radius-pill` | 9999px | Pill buttons, avatar circles |

### 5.4 Layout Widths

| Element | Width |
|---|---|
| Left sidebar | 260px (default) · collapsible to 0 |
| Right sidebar | 320px (default) · collapsible to 0 |
| Main content | flex-1 (fills remaining space) |
| Chat message column | max-width 760px, centred in main |
| Modal (standard) | 480px |
| Modal (wide) | 680px |
| Modal (fullscreen mobile) | 100vw |

---

## 6. Global Layout Structure

### 6.1 Three-Column Shell

```
┌─────────────────────────────────────────────────────────────┐
│  ember-void background (#080808)                            │
│                                                             │
│  ┌───────────┐  ┌───────────────────────┐  ┌────────────┐  │
│  │           │  │                       │  │            │  │
│  │   LEFT    │  │    MAIN CONTENT       │  │   RIGHT    │  │
│  │  SIDEBAR  │  │    AREA               │  │  SIDEBAR   │  │
│  │  260px    │  │    flex-1             │  │  320px     │  │
│  │  #101010  │  │    #212121            │  │  #181818   │  │
│  │           │  │                       │  │            │  │
│  └───────────┘  └───────────────────────┘  └────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Surface Elevation

| Level | Token | Use case |
|---|---|---|
| 0 — Void | `ember-void` | App shell background |
| 1 — Base | `ember-shadow` / `ember-charcoal` | Sidebars |
| 2 — Raised | `ember-graphite` | Main content area |
| 3 — Elevated | `ember-stone` | Cards, input fields |
| 4 — Floating | `ember-ash` | Dropdowns, tooltips |
| 5 — Overlay | `ember-void` + blur | Modal backdrops |

### 6.3 Accent Stripe

Both sidebars have a 2px vertical ember-gradient stripe on their inner edge (the edge touching main content):

- Left sidebar: right edge stripe
- Right sidebar: left edge stripe

This stripe is `ember-gradient-vertical` with 60% opacity, and subtly pulses opacity from 40%→70%→40% on a 4s loop.

### 6.4 Global Background Treatment

The main content area (`ember-graphite`, #212121) has a very subtle radial gradient from centre:

```
background: radial-gradient(
  ellipse 60% 60% at 50% 30%,
  #252018 0%,       /* very slightly warmer centre */
  #212121 60%,
  #1a1a1a 100%
)
```

This creates a sense of warmth at the conversation focal point without being distracting.

---

## 7. Left Sidebar (Redesigned)

### 7.1 Overview

The left sidebar is a complete visual redesign of the existing sidebar. **All existing functionality must be preserved exactly.** Only the visual treatment changes.

**Background**: `ember-shadow` (#101010)
**Width**: 260px (variable via CSS `--sidebar-width`)
**Height**: Full viewport height
**Position**: Fixed, left edge
**Right edge**: 2px `ember-gradient-vertical` accent stripe (60% opacity)

### 7.2 Section: Top Header Bar

**Height**: 56px
**Background**: `ember-shadow` (same as sidebar — no distinct header background)
**Bottom border**: 1px `ember-cinder` (#454545) at 40% opacity

Contents (left to right):

1. **App Logo / Brand Mark** (left)
   - 24×24px ember flame icon or stylised 'R' glyph
   - Colour: `ember-flame` (#ff4d00)
   - Subtle glow: `drop-shadow(0 0 6px ember-flame/50)`

2. **Spacer** (flex-1)

3. **New Chat Button** → route: `/`
   - 32×32px icon button
   - Icon: `PenSquare` or `Plus`, 18px, `ember-text-secondary`
   - Hover: icon becomes `ember-flame`, background becomes `ember-ash` (#363636)
   - **This button has the Ember Glow bezel** (see §12)
   - `aria-label="New Chat"`

4. **Search Button** → opens `SearchModal`
   - 32×32px icon button
   - Icon: `Search`, 18px, `ember-text-secondary`
   - Hover: icon becomes `ember-text-primary`
   - Keyboard shortcut: `Ctrl+K` / `Cmd+K`

### 7.3 Section: Pinned Models (conditional — shown if models are pinned)

**Background**: transparent
**Top padding**: 12px
**Left/right padding**: 9px

- Section label: `label-sm`, `ember-text-tertiary`, uppercase, 4px letter-spacing — "PINNED"
- Items: horizontal pill row of model avatars/labels
- Each pill: `ember-stone` background, 6px radius, 6px vertical / 10px horizontal padding
- Active/selected model pill: `ember-flame/20` background, `ember-flame` border 1px
- Each pill links to `/?model={model.id}`

### 7.4 Section: Channels (conditional — shown if channels exist)

**Collapsible**: yes — click section header to collapse
**Top padding**: 8px

- Header row: icon `Hash` (14px, `ember-text-tertiary`) + label `label-sm` "CHANNELS" + `ChevronDown` toggle
- Each channel item `ChannelItem`:
  - 36px height, 9px horizontal padding
  - Icon: `Hash` 14px left-gutter
  - Label: `body-sm`, `ember-text-secondary`
  - Hover: background `ember-ash` (#363636), text `ember-text-primary`
  - Active (current route): background `ember-stone`, left-border 2px `ember-flame`, text `ember-text-primary`
  - Links to `/channels/{channel.id}`

### 7.5 Section: Chat List (primary content)

**Flex-1** — fills remaining sidebar height
**Overflow**: scroll (hidden scrollbar, visible on hover)

- **Group headers** (date-based: Today, Yesterday, Previous 7 Days, etc.):
  - `label-sm`, `ember-text-tertiary`, uppercase, 10px vertical padding, 12px left padding

- **Chat items** (`ChatItem`):
  - 36px min-height, 9px horizontal padding, 4px vertical padding
  - Title: `body-sm`, `ember-text-secondary`, single line, truncated
  - Hover: background `ember-ash` (#363636), text `ember-text-primary`
  - Active: background `ember-stone`, left-border 2px `ember-flame`, text `ember-text-primary`
  - Context menu (right-click / `...` hover): `ember-stone` background dropdown
  - Links to `/c/{id}`

- **Folders** (`RecursiveFolder`):
  - Folder icon `Folder` 14px `ember-text-tertiary`
  - Indented children (12px per level)
  - Expand/collapse animation: 150ms ease-out

- **Pinned chats** appear at top of list with `Pin` icon 12px in `ember-spark` colour

### 7.6 Section: Bottom User Menu

**Height**: 64px
**Background**: `ember-shadow` (same as sidebar)
**Top border**: 1px `ember-cinder` at 40% opacity
**Sticky**: bottom of sidebar

Layout:
```
[Avatar 32px] [Name + Role truncated] ... [Overflow menu icon]
```

- **Avatar**: 32px circle, `ember-ash` background if no image, initials in `ember-text-primary`
- **Name**: `label-md`, `ember-text-primary`, truncated
- **Role/Status emoji**: `label-sm`, `ember-text-tertiary` below name
- **Menu trigger**: `MoreHorizontal` icon 16px, appears on hover of row

**UserMenu Dropdown** (opens upward):
- Background: `ember-stone` (#2a2a2a)
- Border: 1px `ember-cinder`
- Border-radius: 12px
- Shadow: `0 -8px 32px rgba(0,0,0,0.6)`
- Width: 220px
- Items (all must be present):

| Label | Icon | Route / Action | Visibility |
|---|---|---|---|
| Playground | `FlaskConical` | `/playground` | Admin only |
| Admin Panel | `Shield` | `/admin` | Admin only |
| Settings | `Settings` | Opens `SettingsModal` | Always |
| Keyboard Shortcuts | `Keyboard` | Opens `ShortcutsModal` | Always |
| Archived Chats | `Archive` | Opens `ArchivedChatsModal` | Always |
| Help & Docs | `HelpCircle` | External docs link | Always |
| Sign Out | `LogOut` | Auth sign-out action | Always |

- Separator line (`ember-cinder` at 30% opacity) between Admin items and personal items, and before Sign Out

---

## 8. Right Sidebar (NEW)

### 8.1 Overview

This is a brand-new panel with no existing equivalent. It is toggled **ON by default** and collapses to 0 when dismissed.

**Background**: `ember-charcoal` (#181818)
**Width**: 320px (default) — resizable between 240px min and 480px max
**Height**: Full viewport height
**Position**: Fixed, right edge
**Left edge**: 2px `ember-gradient-vertical` accent stripe (60% opacity)

### 8.2 Toggle Behaviour

- **Default**: Open (visible) on first load
- **Toggle button**: Located in the top navbar (right section), see §9
- **Collapse animation**: Width transitions 320px → 0 over 250ms ease-in-out; content fades out over 150ms
- **Expand animation**: Width transitions 0 → 320px over 250ms ease-in-out; content fades in over 150ms with 50ms delay
- **State persisted**: Remember collapsed/expanded state in localStorage key `ember-right-sidebar-open`

### 8.3 Header

**Height**: 56px
**Bottom border**: 1px `ember-cinder` at 40% opacity

Contents:
- Left: label `display-sm` "Panel" (placeholder) in `ember-text-tertiary`
- Right: Close/collapse button (X icon or `ChevronRight` 16px) — `ember-text-tertiary`, hover `ember-text-primary`

### 8.4 Body (placeholder)

While the panel content is TBD, the empty state should be designed as:

- Vertically centred, horizontally centred
- Icon: stylised ember flame SVG, 48px, `ember-flame` at 20% opacity
- Label: `body-sm`, `ember-text-tertiary` — "Coming soon"
- No border, no card — just the icon and text floating in the dark panel

### 8.5 Resize Handle

- Between main content and right sidebar: a 4px-wide drag handle
- Default: invisible (transparent)
- Hover: `ember-gradient-vertical` at 40% opacity
- Drag active: `ember-gradient-vertical` at 80% opacity
- Cursor: `col-resize`

---

## 9. Top Navbar — Chat View

This is the sticky header bar visible on the chat pages (`/`, `/c/[id]`).

**Height**: 56px
**Background**: `ember-graphite` (#212121) with gradient fade to transparent at bottom (height 32px):
```
background: linear-gradient(to bottom, #212121 0%, #212121 60%, transparent 100%)
```
**Position**: sticky top-0, z-index 30

### 9.1 Left Section

- **Sidebar toggle** (mobile only, <768px): `Menu` icon 20px, `ember-text-secondary`
- **Model Selector** (`ModelSelector` component):
  - Pill shape, `ember-stone` background, 8px radius
  - Height: 36px, min-width: 180px
  - Active model name: `body-md`, `ember-text-primary`
  - `ChevronDown` icon 14px right-aligned, `ember-text-tertiary`
  - Hover: background `ember-ash`, border 1px `ember-cinder`
  - **This button has the Ember Glow bezel** (see §12, subtle variant)
  - On open: dropdown appears below, `ember-stone` bg, border `ember-cinder`, `radius-lg`

### 9.2 Centre Section (contextual)

- Chat title (editable on double-click): `body-md`, `ember-text-secondary`, centred
- Temporary chat badge (when active): pill badge, `ember-stone` bg, `ember-warning` text, `label-sm`

### 9.3 Right Section (left to right)

All buttons: 32×32px icon buttons, `radius-md`, `ember-text-secondary` default, `ember-text-primary` hover

| Button | Icon | Route/Action | Notes |
|---|---|---|---|
| Temporary Chat toggle | `Timer` / `Clock` | Toggles `?temporary-chat=true` | Active state: `ember-flame` icon colour |
| Save Temporary Chat | `Bookmark` | Saves temp chat | Visible only when in temp-chat mode |
| New Chat | `Plus` | `/` | Mobile only (desktop uses sidebar) |
| Share / Menu | `Share2` or `MoreHorizontal` | Opens chat `Menu` dropdown | |
| Controls toggle | `SlidersHorizontal` | Toggles existing ChatControls panel | Active: `ember-flame` |
| **Right Sidebar toggle** | `PanelRight` | Toggles new right sidebar | Active: **Ember Glow bezel** (see §12) — this is the primary glow button in the navbar |

**Right sidebar toggle button** special treatment:
- When sidebar is OPEN: icon `PanelRight` in `ember-flame`, button background `ember-flame/10`, full glow bezel active
- When sidebar is CLOSED: icon `PanelRight` in `ember-text-tertiary`, no glow bezel

---

## 10. Chat Interface

### 10.1 Messages Area

**Background**: inherits `ember-graphite` from content area
**Max width**: 760px, centred with `margin: 0 auto`
**Padding**: 24px horizontal, 32px top

**User message bubble**:
- Background: `ember-stone` (#2a2a2a)
- Border-radius: 16px 16px 4px 16px (sharp bottom-right)
- Padding: 12px 16px
- Text: `body-lg`, `ember-text-primary`
- Max width: 80% of message column
- Alignment: right-aligned
- Subtle right-edge warm tint: `box-shadow: inset -2px 0 0 ember-flame/20`

**AI response**:
- No bubble — full-width text block
- Left gutter: 36px (avatar space)
- Avatar: 28px circle, `ember-stone` bg, model initial or icon, `ember-flame` colour
- Text: `body-lg`, `ember-text-primary`
- `line-height: 1.7` for readability

**Code blocks** (in responses):
- Background: `ember-void` (#080808)
- Border: 1px `ember-cinder`
- Border-radius: `radius-md` (8px)
- Font: `code-md`, `ember-text-primary`
- Syntax highlight colours: warm palette (amber for keywords, orange for strings, muted for comments)
- Header bar: filename / language + copy button — `ember-shadow` bg, `label-sm`, `ember-text-tertiary`

**Citations / footnotes**:
- Small numbered superscripts in `ember-spark` colour
- Citation drawer: `ember-stone` bg, `radius-lg`

**Message actions** (appear on hover):
- Row of small icon buttons below each message
- `ember-shadow` background pill container
- Icons: `ThumbsUp`, `ThumbsDown`, `Copy`, `RefreshCcw`, `MoreHorizontal`
- Icon size: 14px, `ember-text-tertiary` → `ember-text-primary` on hover

**Timestamps**:
- `label-sm`, `ember-text-tertiary`, shown on hover

### 10.2 Welcome / Empty State

When no chat is open (`/` route, empty):

- Centred content, vertically centred in main area
- **Ember logo mark**: 64px flame SVG, animated slow pulse (see §17)
- **Greeting text**: `display-lg`, `ember-text-primary` — "What can I help with today?"
- **Suggestion chips**: 4 chips in a 2×2 grid
  - Each chip: `ember-stone` bg, border 1px `ember-cinder`, `radius-lg`, 16px padding
  - Hover: border becomes `ember-flame/40`, background `ember-ash`
  - Clip text at 2 lines

---

## 11. Message Input Bar

**Position**: Sticky bottom
**Background**: `ember-graphite` — with gradient fade to transparent at top:
```
background: linear-gradient(to top, #212121 0%, #212121 60%, transparent 100%)
```
**Padding**: 16px horizontal, 16px bottom (+ safe-area-inset-bottom for notch)

### 11.1 Input Container

- Background: `ember-stone` (#2a2a2a)
- Border: 1px `ember-cinder` at 60% opacity
- Border-radius: 16px
- Shadow: `0 4px 24px rgba(0,0,0,0.4)`
- On focus: border becomes `ember-flame/60`, subtle outer glow `0 0 0 3px ember-flame/10`

### 11.2 Input Field

- Font: `body-lg`, `ember-text-primary`
- Placeholder: `ember-text-tertiary` — "Message…"
- Min height: 52px, max height: 240px (scrollable)
- No border, no background (inherits container)
- Padding: 14px 16px

### 11.3 Input Toolbar (below input field)

Small icon buttons in a row. All 28×28px, `radius-sm`, `ember-text-tertiary` → `ember-text-primary` on hover:

| Button | Icon | Action | Notes |
|---|---|---|---|
| Attach file | `Paperclip` | File picker | |
| Upload image | `Image` | Image picker | |
| Web search | `Globe` | Toggle web search | Active: `ember-flame` icon |
| Voice input | `Mic` | Voice recording | Active: `ember-error` icon, pulsing |
| Tools | `Wrench` | Tool server picker | |
| Knowledge | `Database` | Knowledge base attach | |

### 11.4 Send Button

- Position: right side of input container
- Size: 36×36px circle
- Background: `ember-flame` (#ff4d00)
- Icon: `ArrowUp` or `Send`, 18px, white
- **This button has the full Ember Glow bezel** (see §12, full variant)
- Disabled state (no text entered): background `ember-ash`, icon `ember-text-tertiary`, no glow
- Hover: background `ember-glow` (#ff7430)
- Active/press: scale(0.95)

---

## 12. Ember Glow Button Spec

This section defines the glow animation that is applied to key interactive elements.

### 12.1 Glow Variants

Two variants exist:

| Variant | Used on |
|---|---|
| **Full Glow** | Send button, New Chat button |
| **Subtle Glow** | Model selector pill, Right sidebar toggle (when open) |

### 12.2 Full Glow — Static Appearance

When button is in normal/idle state and glowing is active:

```
box-shadow:
  0 0 0 1px rgba(255, 77, 0, 0.6),      /* tight ember border ring */
  0 0 8px 2px rgba(255, 77, 0, 0.35),   /* close glow */
  0 0 20px 6px rgba(255, 140, 66, 0.2), /* mid glow */
  0 0 40px 12px rgba(255, 180, 71, 0.1) /* far ambient */
```

### 12.3 Full Glow — Animation (Breathing / Pulsing)

**CSS Keyframe Name**: `ember-pulse`
**Duration**: 3 seconds
**Timing**: `ease-in-out`
**Iteration**: infinite
**Direction**: alternate

```
@keyframes ember-pulse {
  0% {
    box-shadow:
      0 0 0 1px rgba(232, 56, 0, 0.7),
      0 0 6px 2px rgba(232, 56, 0, 0.4),
      0 0 16px 4px rgba(255, 77, 0, 0.2),
      0 0 32px 8px rgba(255, 116, 48, 0.1);
  }
  33% {
    box-shadow:
      0 0 0 1px rgba(255, 77, 0, 0.75),
      0 0 10px 3px rgba(255, 77, 0, 0.5),
      0 0 24px 8px rgba(255, 140, 66, 0.28),
      0 0 48px 16px rgba(255, 180, 71, 0.14);
  }
  66% {
    box-shadow:
      0 0 0 1px rgba(255, 154, 71, 0.8),
      0 0 12px 4px rgba(255, 116, 48, 0.55),
      0 0 28px 10px rgba(255, 154, 71, 0.3),
      0 0 56px 18px rgba(255, 200, 74, 0.15);
  }
  100% {
    box-shadow:
      0 0 0 1px rgba(255, 200, 74, 0.6),
      0 0 8px 3px rgba(255, 154, 71, 0.4),
      0 0 20px 7px rgba(255, 180, 71, 0.22),
      0 0 40px 14px rgba(255, 222, 128, 0.1);
  }
}
```

The colour journey: deep red-orange → orange → amber-orange → warm amber. Never white. Never yellow-green.

### 12.4 Subtle Glow

For less prominent buttons (model selector, sidebar toggle):

```
@keyframes ember-pulse-subtle {
  0% {
    box-shadow:
      0 0 0 1px rgba(232, 56, 0, 0.35),
      0 0 8px 2px rgba(255, 77, 0, 0.12);
  }
  100% {
    box-shadow:
      0 0 0 1px rgba(255, 154, 71, 0.45),
      0 0 12px 4px rgba(255, 180, 71, 0.18);
  }
}
```

Duration: 3.5s, ease-in-out, infinite, alternate.

### 12.5 Glow Application Rules

- Glow is applied to the **bezel** (border ring + box-shadow) only, never to the fill
- Glow only activates when the button is **interactive** (not disabled)
- On hover, the glow increases by 20% intensity
- On active/press, glow halts momentarily (scale-down feedback takes priority)
- Glow is **paused** when the user has `prefers-reduced-motion: reduce` — the border ring remains static at mid-cycle value

### 12.6 Glow Button List

All of these elements must have the Ember Glow bezel in the Figma design:

| Element | Variant | Route / Context |
|---|---|---|
| Send message button (input bar) | Full Glow | Chat pages: `/`, `/c/[id]` |
| New Chat button (sidebar header) | Full Glow | Sidebar, always visible |
| Right sidebar toggle (navbar) | Subtle Glow | When sidebar is open |
| Model selector pill (navbar) | Subtle Glow | Chat pages |

---

## 13. Component States

For every interactive component, design all states:

### 13.1 State Matrix

| State | Visual Treatment |
|---|---|
| **Default** | `ember-stone` or `ember-graphite` bg, `ember-text-secondary` text |
| **Hover** | Background lightens by one step (e.g. stone→ash), text → `ember-text-primary` |
| **Focus** | `ember-flame/40` border ring (1px outer outline, 2px offset) |
| **Active / Pressed** | `scale(0.97)`, background darkens by one step |
| **Selected / Active Route** | `ember-flame/20` background, `ember-flame` left-border 2px |
| **Disabled** | 30% global opacity, cursor `not-allowed`, no hover effect |
| **Loading** | Skeleton shimmer using `ember-stone` → `ember-ash` sweep animation |
| **Error** | `ember-error/20` background, `ember-error` border |
| **Success** | `ember-success/20` background, `ember-success` border, 1.5s then returns to default |

### 13.2 Input States

| State | Border | Background |
|---|---|---|
| Default | 1px `ember-cinder` | `ember-stone` |
| Focus | 1px `ember-flame/60`, outer glow | `ember-stone` |
| Filled | 1px `ember-cinder` | `ember-stone` |
| Error | 1px `ember-error` | `ember-error/10` |
| Disabled | 1px `ember-cinder/30` | `ember-shadow` |

---

## 14. Modals & Overlays

### 14.1 Modal Shell

All modals share these base properties:

- **Backdrop**: `ember-void` at 70% opacity + `backdrop-filter: blur(8px)`
- **Container**: `ember-stone` (#2a2a2a) background
- **Border**: 1px `ember-cinder`
- **Border-radius**: `radius-xl` (16px)
- **Shadow**: `0 24px 64px rgba(0,0,0,0.8)`
- **Entry animation**: fade-in 150ms + scale from 0.96 → 1.0
- **Exit animation**: fade-out 100ms + scale to 0.97

### 14.2 Settings Modal

All existing tabs must be present (no tabs can be removed):

- **Tabs**: General · Interface · Account · Audio · Connections · Integrations · Personalization · Data Controls · About
- **Tab strip**: horizontal, `ember-shadow` bg, active tab has `ember-flame` bottom-border (2px) and `ember-text-primary` text
- **Content area**: `ember-graphite` bg inside modal
- **Width**: 680px (wide modal)
- **Height**: 70vh, scrollable content

### 14.3 Search Modal

- **Width**: 560px
- **Triggered by**: Ctrl+K / Cmd+K or search icon
- **Input**: at top, `ember-void` bg, large — `display-sm` font size
- **Results**: list below, each item `ember-stone` hover, chat title + snippet preview
- **Empty state**: `ember-text-tertiary` centered — "Start typing to search…"

### 14.4 Archived Chats Modal

- **Width**: 560px
- **List**: same styling as main chat list (ChatItem)
- **Search input** at top

### 14.5 Shortcuts Modal

- **Width**: 480px
- **Grid layout**: 2 columns, `label-md` shortcut label + `code-sm` key chip
- **Key chips**: `ember-stone` bg, `radius-xs`, 1px `ember-cinder` border

### 14.6 Share Chat Modal

- **Width**: 480px
- **URL field**: `ember-void` bg input, copy button with `ember-flame` icon
- **Toggle**: share on/off toggle — active state uses `ember-flame` fill

### 14.7 Dropdown Menus

- Background: `ember-stone` (#2a2a2a)
- Border: 1px `ember-cinder`
- Border-radius: `radius-lg` (12px)
- Shadow: `0 8px 32px rgba(0,0,0,0.6)`
- Item height: 36px
- Item padding: 8px 12px
- Hover: `ember-ash` background
- Destructive item (e.g. "Delete"): `ember-error` text colour on hover
- Separator: 1px `ember-cinder` at 30% opacity

---

## 15. Page-by-Page Breakdown

### 15.1 Auth Page (`/auth`)

- **Background**: `ember-void` full screen
- **Central card**: `ember-shadow` bg, `radius-xl`, 480px wide, shadow `0 24px 64px rgba(0,0,0,0.8)`
- **Ember logo**: top of card, 48px flame mark + "Ember" wordmark in Archivo `display-xl`
- **Logo glow**: `drop-shadow(0 0 20px ember-flame/60)` on logo mark
- **Tabs**: Sign In / Sign Up — `ember-flame` active tab indicator
- **Inputs**: standard Ember input style (see §13.2)
- **Submit button**: Full Glow variant (see §12)
- **LDAP option**: subtle link style, `ember-text-tertiary`

### 15.2 Error Page (`/error`)

- **Background**: `ember-void` full screen
- **Central content**: centred vertically
- **Icon**: `AlertTriangle` 64px, `ember-error` colour
- **Heading**: `display-xl`, `ember-text-primary` — "Connection Error"
- **Body**: `body-lg`, `ember-text-secondary`
- **Retry button**: standard Ember button, `ember-stone` bg, `ember-text-primary`

### 15.3 Home / Chat Page (`/` and `/c/[id]`)

See §9 (navbar), §7 (left sidebar), §8 (right sidebar), §10 (chat interface), §11 (input).

### 15.4 Channels Page (`/channels/[id]`)

- Same 3-column shell
- Messages area same as chat
- Channel header replaces chat navbar — shows `#channel-name`, member count, description

### 15.5 Notes Pages (`/notes`, `/notes/new`, `/notes/[id]`)

- Same 3-column shell
- Notes list: left-inset panel or replaces chat list
- Note editor: full-width, `ember-graphite` bg, minimal UI — just the editor
- Editor font: `body-lg`, `line-height: 1.8`
- Sidebar on notes pages shows notes list in left sidebar, not chat list

### 15.6 Playground Pages (`/playground`, `/playground/completions`, `/playground/images`)

- **Header tab strip**: Chat · Completions · Images (3 tabs)
  - `ember-shadow` bg tab strip, `ember-flame` active indicator
- **Content**: appropriate for each tab (chat interface, text completion textarea, image generation UI)
- **Admin-only access indicator**: subtle `label-sm` `ember-text-tertiary` "Admin access required" if not admin

### 15.7 Workspace Pages (`/workspace` and sub-routes)

- **Header tab strip**: Models · Knowledge · Prompts · Skills · Tools
- **List pages**: table/card layout, `ember-stone` cards, hover `ember-ash`
- **Create/Edit pages**: form layout, standard Ember inputs
- **Primary action button** (e.g. "Create Model"): `ember-flame` background, white text, Full Glow bezel

### 15.8 Admin Pages (`/admin` and sub-routes)

- **Header tab strip**: Users · Analytics · Evaluations · Functions · Settings
- **Admin panel header**: `ember-shadow` bg banner, "Admin Panel" in `display-md`, `ember-flame` accent stripe beneath
- **Settings page tabs**: Connections · Security · Features · etc. (preserve all existing admin setting tabs)
- **Data tables**: `ember-stone` rows, alternating `ember-graphite` / `ember-stone`, `ember-flame` sort indicator

### 15.9 Share Page (`/s/[id]`)

- Public-facing, no sidebar
- Same message display as chat
- Banner: "Shared Conversation" label + original chat title
- Footer: "Powered by Ember" (or brand name) attribution

### 15.10 Watch Page (`/watch`)

- Minimal layout, no sidebar
- Full-width content area

---

## 16. All Routes — Constraint Reference

> **CRITICAL**: The Figma designs must account for every route listed below. No route may be removed or redirected. All navigation buttons that trigger these routes must be present in the redesign. Layout changes are permitted; functionality is not.

### 16.1 Public Routes

| Route | Page | Key UI Elements to Preserve |
|---|---|---|
| `/auth` | Authentication | Sign In / Sign Up tabs, LDAP option, submit button |
| `/auth?redirect={url}` | Auth with redirect | Same as above |
| `/error` | Backend error | Retry action |
| `/watch` | Watch page | Preserve existing content |
| `/s/[id]` | Shared chat (public) | Full message display, no auth required |

### 16.2 Core App Routes (Authenticated)

| Route | Page | Key UI Elements to Preserve |
|---|---|---|
| `/` | Home / New Chat | Empty state, model selector, input bar |
| `/?model={modelId}` | Chat with preselected model | Model pre-populated in selector |
| `/?q={query}` | Chat with prefilled query | Query pre-populated in input |
| `/?temporary-chat=true` | Temporary chat mode | Temp chat banner, save button in navbar |
| `/c/[id]` | Specific chat | Full chat interface, all message actions |

### 16.3 Channel Routes

| Route | Page |
|---|---|
| `/channels/[id]` | Channel conversation view |

### 16.4 Notes Routes

| Route | Page | Key UI Elements |
|---|---|---|
| `/notes` | Notes list | List of notes, New Note button |
| `/notes?content={query}` | Notes with prefilled content | Content pre-populated |
| `/notes/new` | New note editor | Editor, save, title input |
| `/notes/[id]` | Specific note editor | Full editor, save, delete |

### 16.5 Playground Routes (Admin Only)

| Route | Page |
|---|---|
| `/playground` | Chat playground |
| `/playground/completions` | Text completions |
| `/playground/images` | Image generation |

### 16.6 Workspace Routes (Permitted Users)

| Route | Page |
|---|---|
| `/workspace` | Workspace overview |
| `/workspace/models` | Models list |
| `/workspace/models/create` | Create model |
| `/workspace/models/edit` | Edit model (query param: model ID) |
| `/workspace/knowledge` | Knowledge bases list |
| `/workspace/knowledge/create` | Create knowledge base |
| `/workspace/knowledge/[id]` | View/edit knowledge base |
| `/workspace/prompts` | Prompts list |
| `/workspace/prompts/create` | Create prompt |
| `/workspace/prompts/[id]` | View/edit prompt |
| `/workspace/skills` | Skills list |
| `/workspace/skills/create` | Create skill |
| `/workspace/skills/edit` | Edit skill |
| `/workspace/tools` | Tools list |
| `/workspace/tools/create` | Create tool |
| `/workspace/tools/edit` | Edit tool |
| `/workspace/functions/create` | Create function |

### 16.7 Admin Routes (Admin Only)

| Route | Page |
|---|---|
| `/admin` | Admin panel — User management |
| `/admin/users` | Users overview |
| `/admin/users/[tab]` | Users sub-tab (e.g. overview, groups) |
| `/admin/analytics` | Analytics dashboard |
| `/admin/analytics/[tab]` | Analytics sub-tab |
| `/admin/evaluations` | Evaluations |
| `/admin/evaluations/[tab]` | Evaluations sub-tab (leaderboard, feedback) |
| `/admin/functions` | Admin functions list |
| `/admin/functions/create` | Create admin function |
| `/admin/functions/edit` | Edit admin function |
| `/admin/settings` | Admin settings |
| `/admin/settings/[tab]` | Admin settings sub-tab (connections, security, features, etc.) |

### 16.8 Query Parameters (Must Remain Functional)

| Parameter | Context | Effect |
|---|---|---|
| `?model={id}` | `/` | Pre-select model |
| `?q={query}` | `/` | Pre-fill message input |
| `?content={text}` | `/notes` | Pre-fill note content |
| `?redirect={url}` | `/auth` | Post-auth redirect |
| `?temporary-chat=true` | `/` | Enable temporary chat mode |
| `?sync=true` | Various | Open stats sync modal |

### 16.9 Modal-Triggered UI (Not Routes, But Must Be Present)

These are UI states triggered by buttons — they are not routes but must be accessible from the redesigned layout:

| UI Element | Trigger | Must Remain In |
|---|---|---|
| Settings Modal (all tabs) | User menu → Settings | Left sidebar user menu |
| Archived Chats Modal | User menu → Archived Chats | Left sidebar user menu |
| Keyboard Shortcuts Modal | User menu → Shortcuts | Left sidebar user menu |
| Share Chat Modal | Navbar → Share | Chat navbar |
| Search Modal | Sidebar search icon or Ctrl+K | Sidebar header |
| Chat Controls Panel (Controls/Files/Overview) | Navbar → Controls toggle | Chat navbar |
| Tool Servers Modal | Input bar → Tools | Message input toolbar |
| Channel Create/Edit Modal | Channels section + button | Left sidebar channels section |
| Folder Create/Edit Modal | Chat list context menu | Left sidebar chat list |
| User Status Modal | User menu avatar | Left sidebar user menu |

---

## 17. Animations & Motion

### 17.1 Motion Principles

- **Purposeful**: every animation communicates a state change
- **Warm**: easing curves are ease-out (decisive starts, gentle stops) — nothing is perfectly linear
- **Breathing**: idle animations are slow (3–5s) and gentle; they should not distract

### 17.2 Animation Catalogue

| Name | Duration | Easing | Usage |
|---|---|---|---|
| `ember-pulse` | 3s | ease-in-out, infinite, alternate | Glow buttons |
| `ember-pulse-subtle` | 3.5s | ease-in-out, infinite, alternate | Subtle glow elements |
| `ember-stripe-breathe` | 4s | ease-in-out, infinite, alternate | Sidebar accent stripes |
| `sidebar-slide-in` | 250ms | ease-out | Sidebar expand |
| `sidebar-slide-out` | 250ms | ease-in | Sidebar collapse |
| `modal-enter` | 150ms | ease-out | Modal appear (fade + scale) |
| `modal-exit` | 100ms | ease-in | Modal disappear |
| `dropdown-enter` | 120ms | ease-out | Dropdown open |
| `dropdown-exit` | 80ms | ease-in | Dropdown close |
| `message-appear` | 200ms | ease-out | New message slide in from bottom |
| `skeleton-shimmer` | 1.5s | linear, infinite | Loading placeholders |
| `logo-breathe` | 5s | ease-in-out, infinite, alternate | Logo flame on empty state |

### 17.3 Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`:
- Glow animations: freeze at mid-cycle value (no movement)
- Slide/scale transitions: replaced with instant opacity fade
- Skeleton shimmer: replaced with static `ember-stone` placeholder

---

## 18. Responsive Behaviour

### 18.1 Breakpoints

| Name | Width | Behaviour |
|---|---|---|
| Mobile | < 768px | Both sidebars hidden by default; togglable drawers |
| Tablet | 768px–1199px | Left sidebar visible; right sidebar hidden by default |
| Desktop | ≥ 1200px | Both sidebars visible by default |

### 18.2 Mobile Adaptations

- Left sidebar becomes a drawer (slides in over content, `ember-void` backdrop)
- Right sidebar becomes a drawer from the right
- Chat controls panel (existing) becomes a bottom sheet
- Modal width: 100% (full screen)
- Message input: full width, taller hit targets
- Model selector: abbreviated (icon + short name)

### 18.3 Right Sidebar on Tablet

- Default: hidden on tablet (< 1200px)
- Toggle button still visible in navbar
- Opens as overlay drawer (not shifting main content)

---

## 19. Accessibility

- **Colour contrast**: all text on ember backgrounds must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Glow effects**: supplementary only — glow buttons must also have a solid border ring visible without colour perception
- **Focus rings**: `ember-flame/40` outline, 2px width, 2px offset — always visible on keyboard focus
- **Motion**: all animations respect `prefers-reduced-motion`
- **Icon buttons**: all must have `aria-label`
- **Tooltips**: all icon-only buttons show tooltip on hover (150ms delay)

### 19.1 Contrast Check Points

| Element | Foreground | Background | Min Ratio |
|---|---|---|---|
| Body text | `#f0ede8` | `#212121` | 4.5:1 ✓ |
| Secondary text | `#b8b4ae` | `#212121` | 4.5:1 ✓ |
| Ember accent on dark | `#ff4d00` | `#212121` | 3:1 (large only) |
| Ember accent on stone | `#ff7430` | `#2a2a2a` | Check in Figma |
| Disabled text | `#7a7570` | `#212121` | Non-interactive, exempt |

---

## 20. Figma Component Checklist

Use this checklist to ensure all components are created in the Figma file:

### Foundation
- [ ] Color styles (all `ember-*` tokens defined as Figma local variables)
- [ ] Text styles (all 11 type scale entries)
- [ ] Effect styles (all 4 glow shadow variants)
- [ ] Grid styles (layout grids for mobile/tablet/desktop)
- [ ] Gradient styles

### Layout Components
- [ ] App shell (3-column layout frame)
- [ ] Left sidebar — all sections, all states
- [ ] Right sidebar — header, empty state, collapsed state
- [ ] Chat navbar — all button states
- [ ] Message area — scroll container

### Chat Components
- [ ] User message bubble (default, hover)
- [ ] AI response (default, hover)
- [ ] Code block (with header bar)
- [ ] Message actions row (all states)
- [ ] Empty state / welcome screen
- [ ] Citation pill

### Input Components
- [ ] Message input bar (default, focus, with attachment preview)
- [ ] Send button (default, hover, active, disabled) + glow animation
- [ ] Input toolbar buttons (all, all states)
- [ ] File attachment preview chip

### Sidebar Sub-Components
- [ ] Chat item (default, hover, active, with context menu)
- [ ] Channel item (default, hover, active)
- [ ] Folder (collapsed, expanded, with children)
- [ ] Pinned model pill (default, active)
- [ ] User menu row (default, hover)
- [ ] User menu dropdown (all items)

### Modals
- [ ] Modal shell (backdrop + container)
- [ ] Settings modal (all tabs)
- [ ] Search modal (empty state, with results)
- [ ] Archived chats modal
- [ ] Shortcuts modal
- [ ] Share chat modal

### Common Components
- [ ] Button — primary (with glow, without glow)
- [ ] Button — secondary
- [ ] Button — ghost
- [ ] Button — destructive
- [ ] Button — icon-only
- [ ] Input field (all states)
- [ ] Textarea (all states)
- [ ] Dropdown menu
- [ ] Tooltip
- [ ] Toggle switch (default, active)
- [ ] Checkbox (unchecked, checked, indeterminate)
- [ ] Badge / pill (default, ember-accent, status variants)
- [ ] Tag chip
- [ ] Avatar (with image, with initials, sizes: 24/28/32/40px)
- [ ] Loading skeleton (line, circle, block)
- [ ] Toast notification (info, success, warning, error)

### Page Frames (Full Artboards)
- [ ] Auth page (desktop)
- [ ] Auth page (mobile)
- [ ] Chat — empty state (desktop)
- [ ] Chat — with messages (desktop)
- [ ] Chat — with messages (mobile)
- [ ] Workspace — models list
- [ ] Admin panel — users
- [ ] Notes — editor
- [ ] Playground

---

*End of Figma Design Specification — Ember UI for Open WebUI*

*Version 1.0 · 2026-03-22*