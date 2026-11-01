# MIT Readiness Atlas

A standalone, local-first desktop app for exploring eight synthetic student-development archetypes and comparing a student's activities with transparent, source-linked rubrics.

## Workspace

- `desktop/` — React, TypeScript, Vite, and Tauri 2 desktop application
- `research/` — auditable public-evidence research pipeline and normalized release
- `PRODUCT.md` — product strategy and interpretation boundaries
- `DESIGN.md` — visual-system context

The debate lab, Workshop Judge, and their API keys remain separate under `Demo Projects`.

## Interpretation boundary

The app reports **archetype similarity and evidence strength**, not admission probability. The research release contains documented activities for enrolled students, not a matched set of applicants and outcomes, so it cannot support defensible admission odds.

## Run the desktop app

```powershell
cd desktop
npm install
npm run desktop:dev
```

## Checks

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Build a Windows installer:

```powershell
npm run desktop:build
```

## Privacy

Activity profiles remain in local browser storage inside the desktop webview. The app has no model API dependency and does not need the provider secrets used by other demo projects. Users are instructed not to enter names, contact details, application IDs, or private records.

## Public source copy

Person-level research datasets and raw captures are excluded from Git. The desktop app uses its synthetic examples and bundled aggregate statistics. Research scripts require separately supplied, appropriately reviewed inputs.
