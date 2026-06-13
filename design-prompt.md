# Migaforos — UI Design Prompt

## Project Overview
A web app for anonymous/ pseudonymous emotional expression. Users share poems, unsent letters, confessions, micro-stories, and vents. Max 5 posts per day. Others react with emojis, comment (nested), and save favorites.

## Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#2D1B4E` | Buttons, headers, active tabs, main brand |
| Primary light | `#EDE9F6` | Section tags, subtle backgrounds |
| Primary hover | `#7C3AED` | Link hovers, secondary actions |
| Background | `#FFFFFF` | Page background |
| Surface | `#F8F6FC` | Card backgrounds, subtle sections |
| Text primary | `#1A1A2E` | Body text |
| Text secondary | `#6B7280` | Timestamps, counters, hints |
| Border | `#E5E7EB` | Card borders, dividers |

## Typography
- Font: Inter or Geist (sans-serif)
- Weights: Regular 400, Semibold 600
- Scale: 14px (small), 16px (body), 20px (h2), 24px (h1)

## Spacing & Corners
- Page max-width: 768px, centered with auto margins
- Card padding: 24px
- Border radius: 16px (cards), 8px (inputs), 999px (pills/tags)
- Gaps: 16px between cards, 24px between sections

---

## Screens

### 1. Feed (`/`)

**Layout:**
- Fixed header: logo "migaforos" left | "Nuevo post" button + "Iniciar sesión" right
  - Header height: 56px, bottom border 1px solid `#E5E7EB`
  - Logo: font-weight 700, color `#2D1B4E`

- **Section pills** (horizontal scrollable row below header):
  - "Todas" | "Poesía" | "Cartas no enviadas" | "Confesiones" | "Microrrelatos" | "Desahogo"
  - Default: bg `#F3F4F6`, text `#6B7280`, border-radius 999px, padding 8px 16px
  - Active: bg `#2D1B4E`, text `#FFFFFF`
  - Hover: bg `#EDE9F6`

- **Post cards** (vertical list):
  - White card with 1px `#E5E7EB` border, border-radius 16px, padding 20px
  - Hover: border `#C4B5D4` (subtle purple), shadow sm
  - Title: semibold 16px, max 1 line truncate
  - Content preview: 14px `#6B7280`, max 2 lines line-clamp
  - Footer row: author name (or "Anónimo" in italic `#9CA3AF`), dot separator, relative time ("hace 2 h"), right-aligned counters (💬 3 ❤️ 12)

**States:** Empty section → centered message "Todavía no hay publicaciones" with link to "ver todas"

### 2. Post Detail (`/post/[id]`)

**Layout:**
- Same header as feed
- "← Volver" link in 14px `#6B7280`, hover `#2D1B4E`

- **Post card** (white, border, 16px radius, 24px padding):
  - Section pill (same style as feed, non-interactive)
  - Author + dot + timestamp row (14px `#6B7280`)
  - Title: 24px bold `#1A1A2E`
  - Content: 16px `#1A1A2E`, whitespace preserved, line-height 1.7

- **Reaction bar** (below post card):
  - Row of 6 pill buttons: ❤️ 🔥 😢 🤯 🕯️ 💔
  - Each: border 1px `#E5E7EB`, border-radius 999px, padding 8px 16px, font-size 16px
  - Active/hover: bg `#EDE9F6`, border `#C4B5D4`
  - Count badge: 12px semibold `#6B7280` next to emoji

- **Comments section** (below reactions):
  - Title "Comentarios (N)" 18px semibold
  - Comment form: text input + "Enviar" button (`#2D1B4E` bg) in a flex row
  - Comment list (vertical):
    - Each comment: 14px text, author (semibold `#1A1A2E`) + dot + timestamp in 12px `#6B7280`
    - Replies: indented 20px, left border 2px `#EDE9F6`, padding-left 16px, smaller text
    - Empty state: "Sin comentarios todavía. Sé el primero en responder."

### 3. New Post (`/nuevo`)

**Layout:**
- Same header, no section pills
- Title: 24px bold "Nueva publicación"
- Subtitle: 14px `#6B7280` "Límite de 5 publicaciones por día. Elegí bien lo que querés compartir."

- **Form** (vertical stack, 20px gap):
  - Título: text input, full width, border 1px `#E5E7EB`, 8px radius, 12px padding, 16px font
  - Sección: select dropdown, same styling, bg white, chevron icon
    - Options: "Seleccioná una sección" (disabled), Poesía, Cartas no enviadas, Confesiones, Microrrelatos, Desahogo
  - Contenido: textarea, 8 rows, same border style, resize vertical, monospace optional
  - Checkbox: "Publicar como anónimo" — styled checkbox + label in 14px `#6B7280`
  - Submit button: full width, bg `#2D1B4E`, text white, 14px semibold, 12px padding y, 8px radius
    - Hover: bg `#3D2A6B`
    - Disabled: opacity 50%

### 4. Login (`/login`)

**Layout:**
- No header. Full viewport centered (flex column, min-h-screen, justify-center)
- Max-width 360px for the form card

- Title: 28px bold `#1A1A2E`, centered
- Subtitle: 14px `#6B7280`, centered, margin-bottom 32px
- Form:
  - Email input + Contraseña input (full width, standard styling)
  - Error message: 14px red (#DC2626), bg `#FEF2F2`, 8px radius, 12px padding (hidden by default)
  - Submit button: full width, bg `#2D1B4E`, text white
- Footer link: 14px `#6B7280` "¿No tenés cuenta? Registrate" — link color `#2D1B4E`

### 5. Register (`/register`)

**Layout:**
- Same as login: centered, no header, max-width 360px

- Title: 28px bold "Crear cuenta"
- Subtitle: 14px "Unite a Migaforos para compartir lo que sentís"
- Form fields: Email, Usuario, Nombre público (optional), Contraseña, Repetir contraseña
  - Each with label in 14px semibold above input
- Submit button: "Crear cuenta" on `#2D1B4E` bg
- Footer: "¿Ya tenés cuenta? Iniciá sesión"

---

## Design Principles
1. **Intimate, not corporate** — feels like a fabric-bound violet notebook, not a SaaS dashboard
2. **Breathing room** — generous whitespace, nothing feels cramped
3. **Gentle hierarchy** — titles are clearly scannable, metadata is muted
4. **Honest interaction** — hover states are subtle transitions, no flashy animations
5. **Mobile-first** — all layouts stack cleanly below 640px, pills scroll horizontally
6. **No decoration** — no hero images, no illustrations, no icons (except reaction emojis)
