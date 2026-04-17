# Portfolio Redesign — Design Spec
**Date:** 2026-04-15  
**Owner:** Aayu Shrestha  
**Target URL:** aayu.com.np  
**Source repo:** github.com/aayusrsta/enigma

---

## Overview

Rebuild Aayu Shrestha's personal portfolio from a vanilla HTML/CSS/JS site into a modern React (Vite + TypeScript) single-page application. The new site reflects his current experience level (Software Engineer, 2+ years, React/React Native/Next.js specialist) with a premium dark aesthetic inspired by killianherzer.com.

---

## Design Identity

**Theme:** "Silent Precision" — matte black terminal aesthetic with high-contrast white text and teal neon accents.

**Color tokens:**
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080808` | Page background |
| `--s1` | `#0d0d0d` | Alternate section bg |
| `--s2` | `#111111` | Card/surface bg |
| `--border` | `#1e1e1e` | Dividers, card borders |
| `--border2` | `#2a2a2a` | Hover borders |
| `--text` | `#ffffff` | Primary text |
| `--text2` | `#b0b0b0` | Secondary/body text |
| `--text3` | `#555555` | Muted labels |
| `--text4` | `#333333` | Near-invisible chrome |
| `--accent` | `#5eead4` | Neon teal — all glows |

**Typography:**
- Display: `Inter` 900 weight, tight letter-spacing (`-0.04em`)
- UI chrome: `Space Mono` — nav, tags, labels, section numbers
- Body: `Inter` 300–400 weight

**Grain texture:** SVG `feTurbulence` noise filter at 4% opacity overlaid `position:fixed` — gives the black background a matte, non-digital feel.

---

## Visual Effects

| Effect | Implementation |
|---|---|
| Custom cursor | Teal dot + lagging ring, expands on hover |
| Hero scan line | CSS `animation` sweeping top→bottom, teal glow |
| Corner brackets | Absolute-positioned `::before/after` divs, teal tint |
| Glitch on name | CSS `@keyframes` on `::before/::after` pseudo-elements, fires every ~4s |
| Neon CTA glow | `box-shadow` outer + inner bloom on `.btn-neon`, intensifies on hover |
| Section num glow | `text-shadow` on teal `01`, `02`… labels |
| Project card 3D tilt | JS `mousemove` → `perspective(900px) rotateY rotateX` |
| Card crawl line | `width: 0 → 100%` transition on `::after`, teal glow |
| Card corner bracket | `width/height: 0 → 32px` on hover, teal glow |
| Experience row neon sweep | `width: 0 → 100%` on `::before` border-top, fires on hover |
| Skill chip hover | Border → teal tint, subtle box-shadow bloom |
| Scroll reveals | `IntersectionObserver` → `.in` class, fade + translateY(24px) |
| Stagger reveals | Children animate in sequence with `transition-delay` increments |
| Left/right reveals | `translateX(±20px)` variant for about section |
| Marquee | CSS `animation: marquee` infinite on a doubled string |

---

## Sections & Content

### Nav (fixed, backdrop-blur)
- Left: `AAYU.COM.NP` in Space Mono, teal dot on the period
- Center: `WORK · ABOUT · EXPERIENCE · CONTACT` links
- Right: pulsing teal dot + `OPEN TO WORK` / `KTM, NEPAL`

### Hero (100vh, justify-content: flex-end)
- Eyebrow: `Software Engineer · React / React Native / Next.js` — teal, glowing
- Name: `AAYU` (solid white) + `SHRESTHA` (white text-stroke outline, glowing)
- Glitch animation on name — CSS only, fires every ~4s
- Description: Space Mono, `#b0b0b0`, key words in teal
- Actions: `[ VIEW WORK ]` neon button + `GET IN TOUCH →` ghost link — inline row below description
- Corner brackets (4 corners), scan line, subtle grid, two glow orbs
- Coords: `LAT 27.7172° N / LON 85.3240° E / KTM_NPL` — bottom-right, very muted

### `01 // PROFESSIONAL WORK` — 6 cards in 2-col grid
1. **Ncell App** — React Native, Redux, Firebase, Deep Linking
2. **Interpreter Booking** — Next.js, Node.js, GraphQL, WebSocket, FCM
3. **Pixel Revive** — React.js, RTK Query, Redux Toolkit, AI/ML
4. **Nepal In Data** — HTML, CSS, JavaScript, Data Viz
5. **Global Chautari** — React Native, Redux, Node.js *(tech stack TBC by user)*
6. **Flowzen ProcessMaker** — React, Node.js, SDK *(in-progress styling: dashed border, muted palette, `◉ LIVE` badge)*

Each card: neon dot, project number, name, description, tech tags, `↗` arrow on hover, neon crawl line bottom, corner bracket top-right.

### `02 // PERSONAL PROJECTS` — 2 cards
1. **E-Commerce Dashboard** — Next.js 16, TypeScript, Zustand, Tailwind
2. **This Portfolio** — React, Framer Motion, Vite, TypeScript

### `03 // ABOUT` — 2-col layout
- Left: paragraph bio (Inter 300, `#b0b0b0`), key terms bolded white, company name in teal
- Right: 2×2 stat grid — `2+` Years, `4` Live Projects, `3` Companies, `OPEN` (teal)

### `04 // TECH STACK` — 3-col grid
- Frontend: React.js, Next.js, TypeScript, Redux Toolkit, React Query, Tailwind CSS, JavaScript, Axios
- Mobile: React Native, Deep Linking, iOS Deploy, Play Store, App Signing, Firebase
- Backend & Cloud: Node.js, Express.js, GraphQL, WebSocket, MongoDB, Docker, RabbitMQ, REST API

### `05 // EXPERIENCE` — table layout
| Period | Role | Company | Bullets |
|---|---|---|---|
| 2024–Present | Software Engineer | Amnil Technologies | Ncell App features, deep linking, Auto Renewal, Referral, OTP auth |
| 2023–2024 | React Developer | Smart Solutions Technology | Next.js apps, Redux Toolkit, WebSocket+GraphQL chat, React Native |
| Jan–May 2023 | React Native Intern | Amnil Technologies | E-commerce demo, Redux Saga, Axios |

Hover: neon teal line sweeps across top border of each row.

### Contact
- Left: eyebrow + `LET'S / TALK` (TALK in teal text-stroke outline with glow) + email + LinkedIn/GitHub/CV links
- Right: monospace contact card (name, location, phone, stack)

### Footer
`AAYU SHRESTHA © 2025` · `BUILT IN REACT + FRAMER MOTION` · `KATHMANDU, NEPAL`

---

## Project Links (to be filled by user)

| Project | URL |
|---|---|
| Ncell App | `#` — user to provide App Store / Play Store link |
| Interpreter Booking | `#` — user to provide live URL or GitHub |
| Pixel Revive | `#` — user to provide live URL or GitHub |
| Nepal In Data | `#` — user to provide live URL |
| Global Chautari | `#` — user to provide App Store / Play Store / website |
| Flowzen ProcessMaker | `#` — coming soon |
| E-Commerce Dashboard | `#` — user to provide GitHub repo URL |
| LinkedIn | `https://linkedin.com/in/aayu-shrestha-50546113a` ✓ |
| GitHub | `https://github.com/aayusrsta` ✓ |
| Email | `mailto:aayu.srsta@gmail.com` ✓ |
| CV PDF | `/aayu-shrestha-cv.pdf` — to be added to `public/` folder |

---

## Tech Stack (build)

| Concern | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | Fast builds, no SSR needed for a portfolio |
| Animations | Framer Motion | Scroll reveals, stagger, page transitions |
| Styling | Plain CSS (CSS variables) | Zero runtime overhead, matches the existing design tokens |
| Fonts | Google Fonts — Inter + Space Mono | Already used in mockup, proven pairing |
| Routing | Single page, anchor scroll | No page changes needed |
| Deployment | Netlify (recommended) or GitHub Pages | Connect to `aayusrsta/enigma` repo, auto-deploy on push |

---

## File Structure

```
src/
  components/
    Nav.tsx
    Hero.tsx
    Projects.tsx          # contains ProfessionalProjects + PersonalProjects
    ProjectCard.tsx
    About.tsx
    Stack.tsx
    Experience.tsx
    Contact.tsx
    Footer.tsx
    Cursor.tsx            # custom cursor
  hooks/
    useScrollReveal.ts    # IntersectionObserver hook
  data/
    projects.ts           # all project data + links
    experience.ts
    stack.ts
  styles/
    globals.css           # CSS variables, reset, grain, cursor, scrollbar
    nav.css
    hero.css
    projects.css
    about.css
    stack.css
    experience.css
    contact.css
  App.tsx
  main.tsx
public/
  aayu-shrestha-cv.pdf   # CV file to add
```

---

## Deployment Plan

1. Build: `vite build` → outputs to `dist/`
2. Connect `aayusrsta/enigma` repo to **Netlify** (drag-and-drop or GitHub integration)
3. Set build command: `npm run build`, publish dir: `dist`
4. Add custom domain `aayu.com.np` in Netlify → update DNS CNAME to Netlify's URL
5. Netlify handles HTTPS automatically via Let's Encrypt

---

## Out of Scope

- Backend / contact form submission (email link only)
- CMS or dynamic content
- Blog section
- Dark/light mode toggle
- i18n / Nepali language version
