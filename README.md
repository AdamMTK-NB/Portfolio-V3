# Adam Maatouk's Portfolio (V3)

A responsive, single-page portfolio built with React and TypeScript. Features dark mode, a project carousel, GitHub contributions calendar, and optional background music.

## Features

- **Hero & intro** — Name, tagline, and CTAs (LinkedIn, email)
- **Social links** — LinkedIn, Discord, GitHub, Email with tooltips
- **Career** — Resume download and “So Far” section
- **Experience** — Work / Education tabs with timeline (e.g. Athena AI, Concordia, Maisonneuve)
- **Skills** — Grid of tech links with [Skill Icons](https://skillicons.dev)
- **Projects** — Carousel of featured projects (Sortify, Better Call Saul AI, Shadow Realm, Virtual Art Gallery) with images, tech stack, and links
- **GitHub contributions** — Lazy-loaded calendar via `react-github-calendar`
- **Dark mode** — Toggle with persistence in `localStorage`
- **Optional music** — Background jazz track with play/pause in the header
- **Responsive** — Mobile-first CSS with breakpoints for desktop (1440px), tablet (1024px), and phones (600px)
- **Sticky header** — Navbar stays visible on scroll with logo reveal

## Tech stack

- **React** 19
- **TypeScript**
- **Vite** 7
- **CSS** — Custom styles, no UI framework; dark mode via `.dark` on `<html>`
- **Font** — [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- **GitHub calendar** — [react-github-calendar](https://github.com/grubersjoe/react-github-calendar)

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/AdamMTK-NB/Portfolio-V3.git
   cd Portfolio-V3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (e.g. `http://localhost:5173`).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start Vite dev server      |
| `npm run build`| TypeScript check + build   |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                 |

## Project structure

```
Portfolio-V3/
├── public/           # Static assets (hero.svg, images, Adam_Maatouk_Resume.pdf, jazz.mp3, etc.)
├── src/
│   ├── App.tsx       # Main app, sections, state (dark mode, music, projects, experience)
│   ├── App.css       # Layout, components, responsive, dark mode
│   ├── main.tsx      # Entry point, React root
│   ├── index.css     # Global styles, dark mode body overlay
│   ├── consoleEasterEgg.ts
│   ├── GitHubCalendarSection.tsx  # Lazy-loaded GitHub calendar
│   ├── utils/
│   │   ├── playClickSfx.ts
│   │   └── lockClickSound.ts
├── api/
│   └── github-contributions.ts  # Serverless API for private contributions (Vercel)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Customization

- **Content** — Edit `SKILLS`, `PROJECTS`, and experience copy in `src/App.tsx`.
- **Resume** — File is `public/Adam_Maatouk_Resume.pdf` (linked from the Career section).
- **Music** — Replace `public/jazz.mp3` or change `MUSIC_SRC` in `App.tsx`.
- **GitHub calendar** — Username is set in `src/GitHubCalendarSection.tsx`. To show **private contributions**, deploy to Vercel and add a `GITHUB_TOKEN` environment variable (GitHub Personal Access Token with `read:user` scope). The `api/github-contributions.ts` serverless function will fetch contributions via GitHub GraphQL, including private commits. Without the token, the calendar shows public contributions only (via `react-github-calendar`).

## License

Copyright © 2026 Adam Maatouk. All rights reserved.
