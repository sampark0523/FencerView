# fencerview

a web app for analyzing your fencing bouts with timestamped annotations

## what it does

- upload bout videos from your device
- play them back with a custom video player
- add timestamped notes with color-coded categories (offense, defense, timing, etc.)
- organize bouts in a library by competition
- see all your annotations on a timeline

## homepage

access the homepage and styles by clicking about in the top right corner of the screen.

## how to run it

install dependencies:
```bash
npm install
```

start the dev server:
```bash
npm run dev
```

build for production:
```bash
npm run build
```

## tech stack

- react + typescript
- vite for builds
- tailwind css for styling
- shadcn/ui components
- react router for navigation
- lucide icons

## how it works

videos are stored in browser memory using object URLs. annotations are managed through react context so they persist during your session. everything is mobile-optimized with a clean bottom nav.

the color scheme is dark mode with primary blue (hsl 217 91% 60%) and cyan accents.

## structure

- `/src/pages` - main app pages (home, library, review)
- `/src/components` - reusable components (video player, annotation dialog, etc.)
- `/src/contexts` - video context for state management
- `/src/index.css` - design tokens and global styles

## attributions

i used claude to generate starter code - we added comments afterwards to make sure what
was going on in the code.