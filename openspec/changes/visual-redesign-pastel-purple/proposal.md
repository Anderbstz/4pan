# Proposal: Pastel Purple Visual Redesign

## Intent

The app is an emotional safe space (poems, confessions, desahogo) but has zero visual identity — pure black/white/gray. A pastel purple palette communicates warmth and emotional tone befitting anonymous expression.

## Scope

### In Scope
- Initialize shadcn (`components.json`, `lib/utils.ts`, base components)
- Install 7 shadcn components: Button, Input, Label, Card, Badge, Select, Tabs
- Replace all inline Tailwind color classes with theme tokens across 12 UI files
- Create pastel purple palette via `@theme inline` in `globals.css`

### Out of Scope
- Auth/session logic, DB/Prisma changes, new features/routes, dark mode, animations, responsive layout beyond colors

## Capabilities

### New Capabilities
- `theme-pastel-purple`: Pastel purple color system via Tailwind v4 `@theme` tokens
- `shadcn-component-set`: Initialized shadcn component library with Button, Input, Card, Badge, Select, Tabs, Label

### Modified Capabilities
- None

## Approach

**1 — Init**: `npx shadcn init` with `--base-color zinc --css-variables true`. Replace all generated CSS vars with pastel purple values.

**2 — Theme**: Update `globals.css` — define pastel purple `@theme inline` tokens + shadcn CSS variable overrides.

**3 — Install**: `npx shadcn add button input label card badge select textarea`

**4 — Refactor (dependency order)**: `globals.css` → `layout.tsx` → `navbar.tsx` → `page.tsx` (feed) → `nuevo/*` → `post/[id]/*` → auth pages. Each file: remove ALL explicit color classes → use shadcn component variants + theme tokens for remaining layout-only utilities.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/globals.css` | Modified | Pastel purple @theme + shadcn CSS vars |
| `src/components/navbar.tsx` | Modified | Btn → shadcn Button |
| `src/app/(dashboard)/page.tsx` | Modified | Tabs → shadcn Tabs, cards → Card, badges → Badge |
| `src/app/(dashboard)/nuevo/form.tsx` | Modified | All form elements → shadcn |
| `src/app/(dashboard)/nuevo/page.tsx` | Modified | Container theme tokens |
| `src/app/(dashboard)/post/[id]/page.tsx` | Modified | Card, Badge, metadata tokens |
| `src/app/(dashboard)/post/[id]/reaction-buttons.tsx` | Modified | Button variants |
| `src/app/(dashboard)/post/[id]/comment-form.tsx` | Modified | Button, Input |
| `src/app/(auth)/login/page.tsx` | Modified | Container tokens |
| `src/app/(auth)/login/form.tsx` | Modified | Form elements → shadcn |
| `src/app/(auth)/register/page.tsx` | Modified | Container tokens |
| `src/app/(auth)/register/form.tsx` | Modified | Form elements → shadcn |
| `components.json` | **New** | shadcn init config |
| `src/lib/utils.ts` | **New** | cn() utility |
| `src/components/ui/` | **New** | 7 shadcn component files |

## Color Palette

```
primary: #D4A5E8 | primary-foreground: #FFFFFF
secondary: #E8D4F0 | secondary-foreground: #1A1A2E
background: #FFFFFF | foreground: #1A1A2E
muted: #F0E6F5 | muted-foreground: #6B5B7B
accent: #C9A0DC | accent-foreground: #FFFFFF
destructive: #E8A0A0 | destructive-foreground: #FFFFFF
border: #E8D4F0 | ring: #D4A5E8
radius: 0.625rem
```

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| shadcn v4 init fails on Next.js 16 ESM | Low | `--legacy-peer-deps` fallback |
| Radix deps peer mismatch | Low | Separate `npm install` before `shadcn add` |
| Navbar is async Server Component — Radix is client | Med | Wrap interactive Radix in client boundaries; keep outer shell server |

## Rollback Plan

`git checkout main` — full revert. No DB migrations involved.

## Dependencies

- shadcn v4.10 CLI (already in devDependencies)
- Internet access for `npx shadcn init` + `npx shadcn add`

## Success Criteria

- [ ] `npm run build` passes with zero errors
- [ ] Zero inline color Tailwind classes across all 12 UI files
- [ ] Consistent pastel purple identity (primary: `#D4A5E8`)
- [ ] Auth, post creation, reactions, and comments work without regression
