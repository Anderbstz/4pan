# Tasks: Pastel Purple Visual Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~985 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + components → PR 2: Refactor |
| Delivery strategy | ask-on-risk → stacked PRs |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | shadcn init + theme + 7 components | PR 1 | ~615 lines, mostly generated; base = feature/tracker |
| 2 | Refactor 12 UI files | PR 2 | ~395 lines, real review; base = PR 1 branch |

## Phase 1: Foundation (init + theme)

- [x] 1.1 Run `npx shadcn init --defaults` — creates `components.json`, `src/lib/utils.ts`, default CSS vars in `globals.css`
- [x] 1.2 Install deps: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tailwindcss-animate`
- [x] 1.3 Replace default CSS vars with pastel purple palette via `@theme inline {}` in `globals.css`; keep Geist font defs

## Phase 2: Install shadcn components

- [x] 2.1 Run `npx shadcn add button input label card badge select textarea` → `src/components/ui/*.tsx` (7 files)
- [ ] 2.2 Verify build: `npm run build` passes (pre-existing errors in navbar.tsx and form.tsx — not introduced by PR 1)

## Phase 3: Refactor UI files

- [ ] 3.1 **navbar.tsx** — wrap interactive parts in client boundaries; "Nuevo post" → `<Button variant="default" size="sm">`; login/logout → `<Button variant="ghost" size="sm">`
- [ ] 3.2 **layout.tsx** — `<body>` gets `bg-background text-foreground`
- [ ] 3.3 **feed page.tsx** — tabs → shadcn `<Tabs>`; post cards → `<Card>`; section tags → `<Badge>`; metadata → `text-muted-foreground`
- [ ] 3.4 **nuevo/form.tsx** — `<input>` → `<Input>`; `<textarea>` → `<Textarea>`; `<select>` → `<Select>`; `<label>` → `<Label>`; submit → `<Button variant="default">`; error → destructive tokens
- [ ] 3.5 **nuevo/page.tsx** — `text-gray-500` → `text-muted-foreground`
- [ ] 3.6 **post/[id]/page.tsx** — article → `<Card>`; section → `<Badge>`; "Volver" → `text-muted-foreground`; comment divs → `<Card>` / `<CardContent>`
- [ ] 3.7 **reaction-buttons.tsx** — buttons → `<Button variant="outline" size="sm">`; active → `variant="secondary"`
- [ ] 3.8 **comment-form.tsx** — input → `<Input>`; submit button → `<Button variant="default" size="sm">`
- [ ] 3.9 **login/form.tsx** — inputs → `<Input>`; labels → `<Label>`; submit → `<Button variant="default" className="w-full">`; error → destructive tokens
- [ ] 3.10 **login/page.tsx** — wrap in `<Card>` with `<CardHeader>` / `<CardTitle>` / `<CardContent>`
- [ ] 3.11 **register/form.tsx** — same pattern as login/form: `<Input>`, `<Label>`, `<Button>`
- [ ] 3.12 **register/page.tsx** — same Card wrapper pattern as login/page

## Phase 4: Verify

- [ ] 4.1 `npm run build` — zero errors
- [ ] 4.2 Confirm zero inline color classes remain across 12 UI files
- [ ] 4.3 Visual check: auth, feed, post detail, creation all render with pastel palette
