# Flumpy Trump

Een complete, speelbare Flappy Bird-achtige browsergame met een **cartoonachtig, zelfgetekend Trump-hoofd** (programmatic Canvas-asset). Geen externe copyrighted assets, geen tracking.

## Features
- Soepele Canvas game loop (`requestAnimationFrame`) met delta-time.
- Responsief op desktop en mobiel (tap/click/space/arrow-up).
- Game states: Intro, Playing, Paused (`P`), Game Over.
- Pipes + collision + score + high score in `localStorage` (`flumpy_trump_highscore`).
- Difficulty scaling (hogere snelheid, kleinere gap binnen grenzen).
- Kleine juice-effecten: flap particles + subtiele camera shake bij collision.
- Modulaire TypeScript-architectuur, strict mode, unit tests met Vitest.

## Tech stack
- Vanilla TypeScript
- HTML5 Canvas
- Vite
- ESLint + Prettier
- Vitest

## Snel starten
```bash
npm install
npm run dev
```
Open daarna de URL uit Vite (standaard `http://localhost:5173`).

## Scripts
- `npm run dev` — development server
- `npm run build` — typecheck + production build
- `npm run preview` — preview van build
- `npm run lint` — ESLint
- `npm run format` — Prettier formatter
- `npm run test` — Vitest unit tests

## Controls
- **Desktop**: `Space`, `ArrowUp`, muisklik = flap
- **Mobiel**: tap = flap
- `P` = pause/unpause
- Restart knop in Game Over scherm

## Architectuur (kort)
- `src/engine/loop.ts`: centrale game loop met dt-clamp.
- `src/engine/input.ts`: input aggregatie + consume API.
- `src/game/game.ts`: state machine en game logica.
- `src/game/renderer.ts`: alle Canvas rendering (achtergrond, pipes, speler, particles).
- `src/game/*`: losse pure modules voor collision, scoring, difficulty, pipe generation.
- `src/ui/overlay.ts`: HTML UI overlays (score, prompts, game over).

## Deploy naar GitHub Pages
Deze repo bevat een workflow (`.github/workflows/deploy-pages.yml`) die automatisch deployt vanaf `main`.

1. Push naar GitHub.
2. Zet in GitHub **Settings → Pages → Build and deployment**: Source = **GitHub Actions**.
3. Push naar `main` (of start workflow handmatig via Actions tab).
4. De workflow bouwt met:
   ```bash
   VITE_BASE_PATH=/<repo-naam>/ npm run build
   ```
   Zo klopt de base path voor Pages.

## Opmerkingen
- Deze game gebruikt alleen eigen, eenvoudige vector/cartoon rendering via Canvas API.
- Geschikt als statische site (bijv. GitHub Pages).
