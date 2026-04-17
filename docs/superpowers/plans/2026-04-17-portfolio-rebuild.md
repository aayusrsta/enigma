# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild aayu.com.np from vanilla HTML into a Next.js 15 SSG site with a matte-black terminal aesthetic, Framer Motion scroll animations, 3D card tilt, custom cursor, and deploy to the `aayusrsta/enigma` GitHub repo via Netlify.

**Architecture:** Next.js with `output: 'export'` — every section is pre-rendered to static HTML at build time (instant First Contentful Paint, SEO-friendly). Framer Motion and the cursor hydrate client-side on top of the pre-rendered shell. Server components hold static structure; `'use client'` components handle all interactivity. One component per section, data fully separated into typed `.ts` files. Plain CSS per component — CSS custom properties hold all design tokens.

**Tech Stack:** Next.js 15, React 19, TypeScript, Framer Motion 11, Inter + Space Mono (Google Fonts), plain CSS, Netlify (`output: 'export'`).

**Rendering:** Static Site Generation (SSG) — `next build` outputs fully pre-rendered HTML to `out/`. Fastest possible First Contentful Paint.

**Working directory:** `/Users/amnil/Desktop/portfolio-rebuild`

---

## File Map

```
/Users/amnil/Desktop/portfolio-rebuild/
  public/
    aayu-shrestha-cv.pdf        ← copy CV here
  src/
    app/
      layout.tsx                ← root layout: fonts, metadata, globals.css
      page.tsx                  ← home page: assembles all sections (server component)
      globals.css               ← CSS vars, reset, grain, scrollbar
    data/
      projects.ts               ← all project data + placeholder links
      experience.ts             ← work history
      stack.ts                  ← skill groups
    hooks/
      use3DTilt.ts              ← mouse-tracking 3D tilt for cards
    components/
      Cursor/
        Cursor.tsx              ← 'use client' — cursor dot + ring
        Cursor.css
      Nav/
        Nav.tsx                 ← server component (static links)
        Nav.css
      Hero/
        Hero.tsx                ← 'use client' — Framer Motion entry animation
        Hero.css
      Marquee/
        Marquee.tsx             ← server component (CSS animation only)
        Marquee.css
      Projects/
        Projects.tsx            ← 'use client' — Framer Motion whileInView
        Projects.css
        ProjectCard.tsx         ← 'use client' — 3D tilt on hover
        ProjectCard.css
      About/
        About.tsx               ← 'use client' — Framer Motion whileInView
        About.css
      Stack/
        Stack.tsx               ← 'use client' — Framer Motion stagger
        Stack.css
      Experience/
        Experience.tsx          ← 'use client' — Framer Motion whileInView
        Experience.css
      Contact/
        Contact.tsx             ← 'use client' — Framer Motion whileInView
        Contact.css
      Footer/
        Footer.tsx              ← server component (static)
        Footer.css
  next.config.ts               ← output: 'export'
  tsconfig.json
  netlify.toml
```

---

## Task 1: Scaffold Next.js 15 + TypeScript project

**Files:**
- Create: `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `netlify.toml`

- [ ] **Step 1: Initialise the project**

```bash
cd /Users/amnil/Desktop/portfolio-rebuild
npx create-next-app@latest . --typescript --eslint --src-dir --app --no-tailwind --import-alias "@/*"
# When prompted "The directory is not empty. Would you like to overwrite?" → Yes
```

- [ ] **Step 2: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 3: Replace `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',   // static HTML generation — fastest rendering
  trailingSlash: true,
  images: { unoptimized: true }, // required for static export
}

export default nextConfig
```

- [ ] **Step 4: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aayu Shrestha — Software Engineer',
  description: 'Software Engineer specialising in React, React Native and Next.js. Based in Kathmandu, Nepal.',
  openGraph: {
    title: 'Aayu Shrestha — Software Engineer',
    description: 'Software Engineer specialising in React, React Native and Next.js. Based in Kathmandu, Nepal.',
    url: 'https://aayu.com.np',
    siteName: 'Aayu Shrestha',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Replace `src/app/globals.css`**

```css
/* ── TOKENS ──────────────────────────────────────── */
:root {
  --bg:          #080808;
  --s1:          #0d0d0d;
  --s2:          #111111;
  --border:      #1e1e1e;
  --border2:     #2a2a2a;
  --text:        #ffffff;
  --text2:       #b0b0b0;
  --text3:       #555555;
  --text4:       #333333;
  --accent:      #5eead4;
  --accent-rgb:  94, 234, 212;
  --mono:        var(--font-mono), 'Space Mono', monospace;
  --sans:        var(--font-inter), 'Inter', sans-serif;
}

/* ── RESET ───────────────────────────────────────── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  overflow-x: hidden;
  cursor: none;
}
a { text-decoration: none; color: inherit; }

/* ── GRAIN (matte texture) ───────────────────────── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px;
}

/* ── SCROLLBAR ───────────────────────────────────── */
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); }

/* ── SHARED SECTION UTILITIES ────────────────────── */
.section { padding: 96px 48px; position: relative; }
.section--alt {
  background: var(--s1);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.sec-head {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 60px;
}
.sec-num {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--accent); letter-spacing: 0.2em;
  text-shadow: 0 0 16px rgba(var(--accent-rgb), 0.5);
}
.sec-label {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--text4); letter-spacing: 0.2em; text-transform: uppercase;
}
.sec-rule { flex: 1; height: 1px; background: var(--border); }
.sec-extra {
  font-family: var(--mono); font-size: 0.52rem;
  color: #222; letter-spacing: 0.15em;
}
```

- [ ] **Step 6: Replace `src/app/page.tsx` with a shell**

```tsx
export default function Home() {
  return (
    <main>
      <p style={{ color: '#fff', padding: '100px 48px' }}>Portfolio loading…</p>
    </main>
  )
}
```

- [ ] **Step 7: Create `netlify.toml`**

```toml
[build]
  command    = "npm run build"
  publish    = "out"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

- [ ] **Step 8: Verify it starts**

```bash
npm run dev
```

Expected: Next.js dev server at `http://localhost:3000` showing "Portfolio loading…".

- [ ] **Step 9: Verify static export builds**

```bash
npm run build
ls out/
```

Expected: `out/` folder contains `index.html` and static assets.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 SSG project with static export"
```

---

## Task 2: Clean up Next.js boilerplate

**Files:**
- Delete: `src/app/page.module.css`, any default SVG assets in `public/`
- The globals.css was already written in Task 1 Step 5 — no new CSS file needed here.

- [ ] **Step 1: Remove boilerplate files**

```bash
rm -f src/app/page.module.css public/next.svg public/vercel.svg
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove Next.js boilerplate files"
```

---

## Task 3: Data layer

**Files:**
- Create: `src/data/projects.ts`, `src/data/experience.ts`, `src/data/stack.ts`

- [ ] **Step 1: Create `src/data/projects.ts`**

```ts
export interface Project {
  id: string
  num: string
  name: string
  desc: string
  tags: string[]
  url: string          // '#' until user provides real URLs
  inProgress?: boolean
}

export const professionalProjects: Project[] = [
  {
    id: 'ncell',
    num: 'PROFESSIONAL_01',
    name: 'Ncell App',
    desc: "Feature engineering for Nepal's largest telecom mobile application. Deep linking, auto-renewal scheduler, OTP auth, referral system & widget support.",
    tags: ['REACT NATIVE', 'REDUX', 'FIREBASE', 'DEEP LINKING'],
    url: '#', // TODO: add App Store / Play Store link
  },
  {
    id: 'interpreter',
    num: 'PROFESSIONAL_02',
    name: 'Interpreter Booking',
    desc: 'Full-stack booking platform with role-based access control, real-time WebSocket chat, GraphQL API and Firebase Cloud Messaging push notifications.',
    tags: ['NEXT.JS', 'NODE.JS', 'GRAPHQL', 'WEBSOCKET', 'FCM'],
    url: '#', // TODO: add live URL or GitHub
  },
  {
    id: 'pixel-revive',
    num: 'PROFESSIONAL_03',
    name: 'Pixel Revive',
    desc: 'AI-powered photo enhancement web app. Sharpening, noise reduction, color correction & text summarization powered by machine learning models.',
    tags: ['REACT.JS', 'RTK QUERY', 'REDUX TOOLKIT', 'AI/ML'],
    url: '#', // TODO: add live URL or GitHub
  },
  {
    id: 'nepal-in-data',
    num: 'PROFESSIONAL_04',
    name: 'Nepal In Data',
    desc: 'Interactive data visualisation platform for Nepal. Built entire frontend architecture — dynamic charts, search & filter across complex datasets, lazy loading & code splitting.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'DATA VIZ'],
    url: '#', // TODO: add live URL
  },
  {
    id: 'global-chautari',
    num: 'PROFESSIONAL_05',
    name: 'Global Chautari',
    desc: 'Community platform connecting Nepali users globally. Built and maintained core app features, integrating real-time capabilities and a clean mobile-first experience.',
    tags: ['REACT NATIVE', 'REDUX', 'NODE.JS'],
    url: '#', // TODO: add App Store / Play Store / website
  },
  {
    id: 'flowzen',
    num: 'PROFESSIONAL_06',
    name: 'Flowzen ProcessMaker',
    desc: 'End-to-end process management platform and developer SDK. Currently in active development — building the core workflow engine, form builder and API integration layer.',
    tags: ['REACT', 'NODE.JS', 'SDK', 'IN BUILDING'],
    url: '#', // TODO: add URL when live
    inProgress: true,
  },
]

export const personalProjects: Project[] = [
  {
    id: 'ecommerce',
    num: 'PERSONAL_01',
    name: 'E-Commerce Dashboard',
    desc: 'Product management dashboard with cart system, JWT authentication, category filters & pagination. Built to explore Next.js 16 App Router and Zustand state architecture.',
    tags: ['NEXT.JS 16', 'TYPESCRIPT', 'ZUSTAND', 'TAILWIND'],
    url: '#', // TODO: add GitHub repo URL
  },
  {
    id: 'portfolio',
    num: 'PERSONAL_02',
    name: 'This Portfolio',
    desc: "You're looking at it. Rebuilt from scratch in React with Framer Motion animations, custom cursor, 3D card tilt, scroll reveals, and a matte black terminal aesthetic.",
    tags: ['REACT', 'FRAMER MOTION', 'VITE', 'TYPESCRIPT'],
    url: 'https://aayu.com.np',
  },
]
```

- [ ] **Step 2: Create `src/data/experience.ts`**

```ts
export interface ExperienceItem {
  period: string
  role: string
  company: string
  location: string
  bullets: string[]
  tags: string[]
}

export const experience: ExperienceItem[] = [
  {
    period: '2024 — PRESENT',
    role: 'Software Engineer',
    company: 'Amnil Technologies Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Developed and maintained Ncell App features with React Native and React',
      'Built deep linking enabling seamless navigation from external sources into app screens',
      'Owned full sprint features: Auto Renewal, Product Referral, Resource Exchange, OTP auth, widgets',
    ],
    tags: ['REACT NATIVE', 'FIREBASE', 'REDUX'],
  },
  {
    period: '2023 — 2024',
    role: 'React Developer',
    company: 'Smart Solutions Technology Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Built web applications with React.js and Next.js, integrating Redux Toolkit',
      'Integrated WebSocket and GraphQL for a real-time chat system',
      'Translated UI/UX wireframes into responsive, performant interfaces',
    ],
    tags: ['NEXT.JS', 'GRAPHQL', 'WS'],
  },
  {
    period: 'JAN — MAY 2023',
    role: 'React Native Intern',
    company: 'Amnil Technologies Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Intensive React Native training, built a complete e-commerce demo project independently',
      'Applied Redux Saga for state management and Axios for data fetching',
    ],
    tags: ['REACT NATIVE', 'REDUX SAGA'],
  },
]
```

- [ ] **Step 3: Create `src/data/stack.ts`**

```ts
export interface StackGroup {
  label: string
  skills: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'Frontend',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Redux Toolkit', 'React Query', 'Tailwind CSS', 'JavaScript', 'Axios'],
  },
  {
    label: 'Mobile',
    skills: ['React Native', 'Deep Linking', 'iOS Deploy', 'Play Store', 'App Signing', 'Firebase'],
  },
  {
    label: 'Backend & Cloud',
    skills: ['Node.js', 'Express.js', 'GraphQL', 'WebSocket', 'MongoDB', 'Docker', 'RabbitMQ', 'REST API'],
  },
]
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add typed data layer for projects, experience and stack"
```

---

## Task 4: Custom cursor

**Files:**
- Create: `src/components/Cursor/Cursor.tsx`, `src/components/Cursor/Cursor.css`

- [ ] **Step 1: Create `src/components/Cursor/Cursor.css`**

```css
.cursor-dot {
  position: fixed;
  width: 6px; height: 6px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px var(--accent);
  transition: width 0.15s, height 0.15s;
}
.cursor-ring {
  position: fixed;
  width: 30px; height: 30px;
  border: 1px solid rgba(var(--accent-rgb), 0.45);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.18s, height 0.18s, border-color 0.18s;
}
.cursor-dot.expanded { width: 4px; height: 4px; }
.cursor-ring.expanded { width: 50px; height: 50px; border-color: rgba(var(--accent-rgb), 0.7); }
```

- [ ] **Step 2: Create `src/components/Cursor/Cursor.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }

    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(loop)
    }

    const onEnter = () => setExpanded(true)
    const onLeave = () => setExpanded(false)

    document.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(loop)

    const targets = document.querySelectorAll('a, button, .proj-card, .chip, .btn-neon')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={`cursor-dot${expanded ? ' expanded' : ''}`} />
      <div ref={ringRef} className={`cursor-ring${expanded ? ' expanded' : ''}`} />
    </>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add custom cursor component"
```

---

## Task 5: Nav component

**Files:**
- Create: `src/components/Nav/Nav.tsx`, `src/components/Nav/Nav.css`

- [ ] **Step 1: Create `src/components/Nav/Nav.css`**

```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 500;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 48px; height: 62px;
  background: rgba(8, 8, 8, 0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: var(--mono); font-size: 0.68rem;
  color: var(--text); letter-spacing: 0.18em;
}
.nav-logo b { color: var(--accent); text-shadow: 0 0 14px rgba(var(--accent-rgb), 0.7); }

.nav-links { display: flex; gap: 32px; }
.nav-links a {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--text3); letter-spacing: 0.16em; text-transform: uppercase;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: var(--accent);
  text-shadow: 0 0 12px rgba(var(--accent-rgb), 0.5);
}

.nav-status {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 0.56rem;
  color: var(--text3); letter-spacing: 0.12em;
}
.nav-ping {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 20px rgba(var(--accent-rgb), 0.4);
  animation: ping 2s infinite;
}
@keyframes ping {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.1; }
}
```

- [ ] **Step 2: Create `src/components/Nav/Nav.tsx`**

```tsx
import './Nav.css'

const links = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">AAYU<b>.</b>COM<b>.NP</b></div>
      <div className="nav-links">
        {links.map(l => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </div>
      <div className="nav-status">
        <div className="nav-ping" />
        OPEN TO WORK
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Wire into `src/app/page.tsx`**

```tsx
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: '62px' }}>Portfolio</main>
    </>
  )
}
```

- [ ] **Step 4: Check in browser**

```bash
npm run dev
```

Expected: fixed nav at top with logo, links, and pulsing teal dot.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Nav component"
```

---

## Task 6: Hero section

**Files:**
- Create: `src/components/Hero/Hero.tsx`, `src/components/Hero/Hero.css`

- [ ] **Step 1: Create `src/components/Hero/Hero.css`**

```css
.hero {
  min-height: 100vh;
  padding: 62px 48px 72px;
  display: flex; flex-direction: column; justify-content: flex-end;
  position: relative; overflow: hidden;
}

/* Grid background */
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 70%, black 20%, transparent 80%);
  mask-image: radial-gradient(ellipse 90% 90% at 50% 70%, black 20%, transparent 80%);
  opacity: 0.5;
}

/* Glow orbs */
.hero-glow {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 45% at 72% 18%, rgba(var(--accent-rgb), 0.08) 0%, transparent 100%),
    radial-gradient(ellipse 45% 55% at 25% 85%, rgba(99, 102, 241, 0.06) 0%, transparent 100%);
}

/* Scan line */
.hero-scan {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.9), transparent);
  box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.6);
  animation: scanline 5s ease-in-out infinite;
  pointer-events: none; opacity: 0;
}
@keyframes scanline {
  0%   { top: 0%;   opacity: 0.8; }
  95%  { opacity: 0.2; }
  100% { top: 100%; opacity: 0; }
}

/* Corner brackets */
.hero-corner {
  position: absolute; width: 16px; height: 16px;
}
.hero-corner--tl { top: 80px; left: 48px; border-top: 1px solid rgba(var(--accent-rgb), 0.4); border-left: 1px solid rgba(var(--accent-rgb), 0.4); }
.hero-corner--tr { top: 80px; right: 48px; border-top: 1px solid rgba(var(--accent-rgb), 0.4); border-right: 1px solid rgba(var(--accent-rgb), 0.4); }
.hero-corner--bl { bottom: 72px; left: 48px; border-bottom: 1px solid rgba(var(--accent-rgb), 0.4); border-left: 1px solid rgba(var(--accent-rgb), 0.4); }
.hero-corner--br { bottom: 72px; right: 48px; border-bottom: 1px solid rgba(var(--accent-rgb), 0.4); border-right: 1px solid rgba(var(--accent-rgb), 0.4); }

/* Coords */
.hero-coords {
  position: absolute; bottom: 72px; right: 48px;
  font-family: var(--mono); font-size: 0.5rem;
  color: var(--text4); letter-spacing: 0.1em;
  line-height: 1.9; text-align: right;
}

/* Content */
.hero-content { position: relative; z-index: 2; }

.hero-eyebrow {
  font-family: var(--mono); font-size: 0.64rem;
  color: var(--accent); letter-spacing: 0.25em; text-transform: uppercase;
  margin-bottom: 20px;
  display: flex; align-items: center; gap: 14px;
  text-shadow: 0 0 16px rgba(var(--accent-rgb), 0.6);
}
.hero-eyebrow::before {
  content: '';
  width: 28px; height: 1px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 20px rgba(var(--accent-rgb), 0.4);
}

.hero-name {
  font-size: clamp(5.5rem, 11vw, 9.5rem);
  font-weight: 900; line-height: 0.88;
  letter-spacing: -0.04em; color: #fff;
  text-shadow: 0 0 120px rgba(var(--accent-rgb), 0.07);
}
.hero-name__ghost {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.22);
  filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.08));
}

/* Glitch on AAYU */
.hero-name__glitch {
  position: relative; display: inline-block;
}
.hero-name__glitch::before,
.hero-name__glitch::after {
  content: attr(data-text);
  position: absolute; top: 0; left: 0; width: 100%; color: #fff;
}
.hero-name__glitch::before {
  animation: glitch1 4s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  color: var(--accent); opacity: 0;
}
.hero-name__glitch::after {
  animation: glitch2 4s infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  color: #818cf8; opacity: 0;
}
@keyframes glitch1 {
  0%, 90%, 100% { transform: none; opacity: 0; }
  92% { transform: translate(-3px, 1px); opacity: 0.6; }
  94% { transform: translate(3px, -1px); opacity: 0; }
  96% { transform: translate(-2px, 2px); opacity: 0.5; }
}
@keyframes glitch2 {
  0%, 90%, 100% { transform: none; opacity: 0; }
  93% { transform: translate(3px, -2px); opacity: 0.5; }
  95% { transform: translate(-2px, 1px); opacity: 0; }
  97% { transform: translate(2px, -1px); opacity: 0.4; }
}

.hero-body { margin-top: 34px; max-width: 520px; }

.hero-desc {
  font-family: var(--mono); font-size: 0.7rem;
  color: var(--text2); line-height: 1.95; letter-spacing: 0.03em;
}
.hero-desc__accent { color: var(--accent); text-shadow: 0 0 12px rgba(var(--accent-rgb), 0.5); }
.hero-desc__dim { color: var(--text4); }

.hero-actions {
  display: flex; flex-direction: row;
  align-items: center; gap: 20px; margin-top: 28px;
}

.btn-neon {
  font-family: var(--mono); font-size: 0.64rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  border: 1px solid var(--accent); color: var(--accent);
  padding: 13px 30px; background: transparent; cursor: none;
  display: inline-block; position: relative;
  box-shadow: 0 0 14px rgba(var(--accent-rgb), 0.2), inset 0 0 14px rgba(var(--accent-rgb), 0.04);
  transition: box-shadow 0.3s, background 0.3s;
}
.btn-neon:hover {
  box-shadow: 0 0 28px rgba(var(--accent-rgb), 0.35), 0 0 60px rgba(var(--accent-rgb), 0.1), inset 0 0 28px rgba(var(--accent-rgb), 0.08);
  background: rgba(var(--accent-rgb), 0.05);
}
.btn-ghost {
  font-family: var(--mono); font-size: 0.6rem;
  color: var(--text4); letter-spacing: 0.12em;
  transition: color 0.2s;
}
.btn-ghost:hover { color: var(--text3); }
```

- [ ] **Step 2: Create `src/components/Hero/Hero.tsx`**

```tsx
'use client'
'use client'
import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-scan" />
      <div className="hero-corner hero-corner--tl" />
      <div className="hero-corner hero-corner--tr" />
      <div className="hero-corner hero-corner--bl" />
      <div className="hero-corner hero-corner--br" />
      <div className="hero-coords">
        LAT 27.7172° N<br />LON 85.3240° E<br />——————<br />KTM_NPL
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="hero-eyebrow">
          Software Engineer · React / React Native / Next.js
        </div>

        <h1 className="hero-name">
          <span className="hero-name__glitch" data-text="AAYU">AAYU</span>
          <br />
          <span className="hero-name__ghost">SHRESTHA</span>
        </h1>

        <div className="hero-body">
          <p className="hero-desc">
            Building <span className="hero-desc__accent">production-grade</span> web &amp; mobile apps.<br />
            React · React Native · Next.js · TypeScript<br />
            <span className="hero-desc__dim">Currently @ Amnil Technologies — Kathmandu</span>
          </p>
          <div className="hero-actions">
            <a className="btn-neon" href="#work">[ VIEW WORK ]</a>
            <a className="btn-ghost" href="#contact">GET IN TOUCH →</a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 3: Add Hero to `src/app/page.tsx`**

```tsx
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Check in browser**

```bash
npm run dev
```

Expected: full-viewport dark hero with scan line, corner brackets, glitch name, teal eyebrow, description, and neon button. SHRESTHA has white outline. Buttons are below the description text, nothing overlapping.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Hero section with scan line, glitch, neon button"
```

---

## Task 7: Marquee

**Files:**
- Create: `src/components/Marquee/Marquee.tsx`, `src/components/Marquee/Marquee.css`

- [ ] **Step 1: Create `src/components/Marquee/Marquee.css`**

```css
.marquee-wrap {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 18px 0; overflow: hidden;
  white-space: nowrap; background: var(--s1);
}
.marquee-track {
  display: inline-block;
  animation: marquee 20s linear infinite;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-item {
  font-family: var(--mono); font-size: 0.62rem;
  color: var(--text3); letter-spacing: 0.2em;
  text-transform: uppercase; margin-right: 48px;
}
.marquee-sep {
  color: var(--accent); font-style: normal; margin-right: 48px;
}
```

- [ ] **Step 2: Create `src/components/Marquee/Marquee.tsx`**

```tsx
import './Marquee.css'

const items = [
  'React.js', 'React Native', 'Next.js', 'TypeScript',
  'Node.js', 'GraphQL', 'Redux Toolkit', 'Firebase',
  'Tailwind CSS', 'WebSocket',
]

export default function Marquee() {
  // doubled for seamless loop
  const all = [...items, ...items]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {all.map((item, i) => (
          <span key={i}>
            <span className="marquee-item">{item}</span>
            <em className="marquee-sep">✦</em>
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add to `src/app/page.tsx` after Hero**

```tsx
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add scrolling tech marquee"
```

---

## Task 8: ProjectCard component

**Files:**
- Create: `src/components/Projects/ProjectCard.tsx`, `src/components/Projects/ProjectCard.css`
- Create: `src/hooks/use3DTilt.ts`

- [ ] **Step 1: Create `src/hooks/use3DTilt.ts`**

```ts
import { useRef, MouseEvent } from 'react'

export function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 6}deg) translateZ(6px)`
    card.style.transition = 'transform 0.05s'
  }

  const onMouseLeave = () => {
    const card = ref.current
    if (!card) return
    card.style.transition = 'transform 0.4s ease'
    card.style.transform = 'none'
  }

  return { ref, onMouseMove, onMouseLeave }
}
```

- [ ] **Step 2: Create `src/components/Projects/ProjectCard.css`**

```css
.proj-card {
  background: var(--bg);
  padding: 38px;
  position: relative; overflow: hidden;
  cursor: none;
  transition: background 0.25s;
}
.proj-card:hover { background: var(--s1); }

/* Neon crawl line */
.proj-card__crawl {
  position: absolute; bottom: 0; left: 0;
  height: 1px; width: 0;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent), 0 0 24px rgba(var(--accent-rgb), 0.4);
  transition: width 0.4s ease;
}
.proj-card:hover .proj-card__crawl { width: 100%; }

/* Neon corner bracket */
.proj-card::after {
  content: '';
  position: absolute; top: 0; right: 0;
  width: 0; height: 0;
  border-top: 2px solid var(--accent);
  border-right: 2px solid var(--accent);
  box-shadow: 4px -4px 14px rgba(var(--accent-rgb), 0.3);
  transition: width 0.3s ease, height 0.3s ease;
}
.proj-card:hover::after { width: 32px; height: 32px; }

/* Glowing dot */
.proj-card__dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--border2); margin-bottom: 22px;
  transition: background 0.25s, box-shadow 0.25s;
}
.proj-card:hover .proj-card__dot {
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 20px rgba(var(--accent-rgb), 0.4);
}

.proj-card__num {
  font-family: var(--mono); font-size: 0.5rem;
  color: #2a2a2a; letter-spacing: 0.2em; margin-bottom: 10px;
}
.proj-card__name {
  font-size: 1.35rem; font-weight: 700;
  color: var(--text); letter-spacing: -0.02em; margin-bottom: 10px;
}
.proj-card__desc {
  font-size: 0.79rem; color: var(--text2);
  line-height: 1.72; margin-bottom: 20px; max-width: 360px;
}
.proj-card__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.proj-card__tag {
  font-family: var(--mono); font-size: 0.5rem;
  color: var(--text3); border: 1px solid var(--border);
  padding: 4px 9px; letter-spacing: 0.08em;
  transition: color 0.2s, border-color 0.2s;
}
.proj-card:hover .proj-card__tag { color: #777; border-color: var(--border2); }

/* Arrow */
.proj-card__arrow {
  position: absolute; top: 30px; right: 32px;
  color: var(--accent); font-size: 0.95rem;
  opacity: 0; transform: translate(-6px, 6px);
  transition: all 0.25s;
  text-shadow: 0 0 14px var(--accent);
}
.proj-card:hover .proj-card__arrow { opacity: 1; transform: translate(0, 0); }

/* In-progress card variant */
.proj-card--wip {
  border: 1px dashed #222 !important;
  background: transparent;
}
.proj-card--wip .proj-card__num { color: var(--accent); opacity: 0.5; }
.proj-card--wip .proj-card__name { color: #888; }
.proj-card--wip .proj-card__desc { color: #444; }
.proj-card--wip .proj-card__tag { border-color: #1a2e1a; color: #3a5a3a; }

.proj-card__wip-badge {
  position: absolute; top: 20px; right: 20px;
  font-family: var(--mono); font-size: 0.48rem;
  color: var(--accent); opacity: 0.6; letter-spacing: 0.15em;
}
```

- [ ] **Step 3: Create `src/components/Projects/ProjectCard.tsx`**

```tsx
import { use3DTilt } from '../../hooks/use3DTilt'
import type { Project } from '../../data/projects'
import './ProjectCard.css'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const { ref, onMouseMove, onMouseLeave } = use3DTilt()
  const isWip = project.inProgress

  return (
    <div
      ref={ref}
      className={`proj-card${isWip ? ' proj-card--wip' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="proj-card__crawl" />
      <div className="proj-card__dot" />
      <div className="proj-card__num">{project.num}</div>
      <div className="proj-card__name">{project.name}</div>
      <div className="proj-card__desc">{project.desc}</div>
      <div className="proj-card__tags">
        {project.tags.map(tag => (
          <span key={tag} className="proj-card__tag">{tag}</span>
        ))}
      </div>
      {isWip ? (
        <div className="proj-card__wip-badge">◉ IN PROGRESS</div>
      ) : (
        <a
          className="proj-card__arrow"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.name}`}
        >
          ↗
        </a>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ProjectCard with 3D tilt, neon crawl and corner bracket"
```

---

## Task 9: Projects section

**Files:**
- Create: `src/components/Projects/Projects.tsx`, `src/components/Projects/Projects.css`

- [ ] **Step 1: Create `src/components/Projects/Projects.css`**

```css
.projects { padding: 96px 48px; }

.proj-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--border);
}

.projects__sub-head { margin-top: 72px; }
```

- [ ] **Step 2: Create `src/components/Projects/Projects.tsx`**

```tsx
'use client'
'use client'
import { motion } from 'framer-motion'
import { professionalProjects, personalProjects } from '../../data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Projects() {
  return (
    <section className="projects" id="work">
      {/* Professional */}
      <motion.div
        className="sec-head"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="sec-num">01</span>
        <span className="sec-label">// PROFESSIONAL WORK</span>
        <div className="sec-rule" />
        <span className="sec-extra">0{professionalProjects.length} PROJECTS</span>
      </motion.div>

      <motion.div
        className="proj-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {professionalProjects.map(p => (
          <motion.div key={p.id} variants={cardVariant}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </motion.div>

      {/* Personal */}
      <motion.div
        className="sec-head projects__sub-head"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="sec-num">02</span>
        <span className="sec-label">// PERSONAL PROJECTS</span>
        <div className="sec-rule" />
        <span className="sec-extra">0{personalProjects.length} PROJECTS</span>
      </motion.div>

      <motion.div
        className="proj-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {personalProjects.map(p => (
          <motion.div key={p.id} variants={cardVariant}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 3: Add to App.tsx**

```tsx
import './styles/globals.css'
import Cursor from './components/Cursor/Cursor'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Marquee from './components/Marquee/Marquee'
import Projects from './components/Projects/Projects'

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Projects />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Check in browser — scroll to projects**

Expected: two-column card grid, cards animate in on scroll with stagger, 3D tilt on hover, neon crawl line and corner bracket appear on hover.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Projects section with professional and personal groups"
```

---

## Task 10: About section

**Files:**
- Create: `src/components/About/About.tsx`, `src/components/About/About.css`

- [ ] **Step 1: Create `src/components/About/About.css`**

```css
.about { padding: 96px 48px; }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px; align-items: center;
}

.about-text {
  font-size: 1.08rem; color: var(--text2);
  line-height: 1.82; font-weight: 300;
}
.about-text strong { color: var(--text); font-weight: 700; }
.about-text .about-text__accent {
  color: var(--accent);
  text-shadow: 0 0 12px rgba(var(--accent-rgb), 0.4);
}

.about-stats {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1px; background: var(--border);
}
.stat {
  background: var(--s2);
  padding: 30px 26px;
}
.stat__num {
  font-size: 2.4rem; font-weight: 900;
  line-height: 1; letter-spacing: -0.04em;
  color: var(--text); margin-bottom: 6px;
}
.stat__num b {
  color: var(--accent);
  text-shadow: 0 0 18px rgba(var(--accent-rgb), 0.6);
}
.stat__num--accent {
  color: var(--accent);
  font-size: 1.5rem;
  text-shadow: 0 0 20px rgba(var(--accent-rgb), 0.5);
}
.stat__label {
  font-family: var(--mono); font-size: 0.54rem;
  color: var(--text4); letter-spacing: 0.15em; text-transform: uppercase;
}
```

- [ ] **Step 2: Create `src/components/About/About.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { num: '2', suffix: '+', label: 'Years experience' },
  { num: '4',  suffix: '',  label: 'Live projects' },
  { num: '3',  suffix: '',  label: 'Companies' },
  { num: 'OPEN', suffix: '', label: 'To new roles', accent: true },
]

const fadeLeft  = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } } }
const fadeRight = { hidden: { opacity: 0, x:  20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } } }
const stagger   = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp    = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function About() {
  return (
    <section className="about section--alt" id="about">
      <motion.div
        className="sec-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-num">03</span>
        <span className="sec-label">// ABOUT</span>
        <div className="sec-rule" />
      </motion.div>

      <div className="about-grid">
        <motion.p
          className="about-text"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          I'm a <strong>Software Engineer based in Kathmandu, Nepal</strong> with 2+ years of
          experience building and shipping web and mobile applications. I specialise in{' '}
          <strong>React, React Native</strong>, and <strong>Next.js</strong>.
          <br /><br />
          At <span className="about-text__accent">Amnil Technologies</span>, I engineer features
          for the Ncell App — one of Nepal's most used mobile applications. Before that, I built
          full-stack web platforms with real-time systems at Smart Solutions.
          <br /><br />
          I care deeply about <strong>clean interfaces, fast performance</strong>, and code that
          ships and scales.
        </motion.p>

        <motion.div
          className="about-stats"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map(s => (
            <motion.div key={s.label} className="stat" variants={fadeRight}>
              <div className={`stat__num${s.accent ? ' stat__num--accent' : ''}`}>
                {s.num}{s.suffix && <b>{s.suffix}</b>}
              </div>
              <div className="stat__label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to App.tsx**

```tsx
import About from '@/components/About/About'
// added below
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add About section with bio and stats grid"
```

---

## Task 11: Stack section

**Files:**
- Create: `src/components/Stack/Stack.tsx`, `src/components/Stack/Stack.css`

- [ ] **Step 1: Create `src/components/Stack/Stack.css`**

```css
.stack { padding: 96px 48px; }

.stack-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
}
.stack-col { background: var(--s1); padding: 28px; }

.stack-col__head {
  font-family: var(--mono); font-size: 0.55rem;
  color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase;
  margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
  text-shadow: 0 0 12px rgba(var(--accent-rgb), 0.4);
}
.stack-col__head::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.chips { display: flex; flex-wrap: wrap; gap: 7px; }
.chip {
  font-size: 0.72rem; color: var(--text2);
  border: 1px solid var(--border); padding: 5px 12px;
  background: var(--bg); cursor: default;
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.chip:hover {
  color: var(--text); border-color: rgba(var(--accent-rgb), 0.35);
  box-shadow: 0 0 14px rgba(var(--accent-rgb), 0.1);
  background: rgba(var(--accent-rgb), 0.04);
}
```

- [ ] **Step 2: Create `src/components/Stack/Stack.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { stack } from '../../data/stack'
import './Stack.css'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Stack() {
  return (
    <section className="stack" id="stack">
      <motion.div
        className="sec-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-num">04</span>
        <span className="sec-label">// TECH STACK</span>
        <div className="sec-rule" />
      </motion.div>

      <motion.div
        className="stack-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {stack.map(group => (
          <motion.div key={group.label} className="stack-col" variants={fadeUp}>
            <div className="stack-col__head">{group.label}</div>
            <div className="chips">
              {group.skills.map(skill => (
                <span key={skill} className="chip">{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 3: Add to App.tsx after About**

```tsx
import Stack from '@/components/Stack/Stack'
// added below
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Stack section with animated skill chips"
```

---

## Task 12: Experience section

**Files:**
- Create: `src/components/Experience/Experience.tsx`, `src/components/Experience/Experience.css`

- [ ] **Step 1: Create `src/components/Experience/Experience.css`**

```css
.experience { padding: 96px 48px; }

.exp-row {
  display: grid;
  grid-template-columns: 190px 1fr auto;
  gap: 32px; padding: 34px 0;
  border-top: 1px solid var(--border);
  align-items: start; position: relative;
}
.exp-row:last-child { border-bottom: 1px solid var(--border); }

/* Neon sweep on hover */
.exp-row::before {
  content: '';
  position: absolute; left: 0; top: 0;
  width: 0; height: 1px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
  transition: width 0.4s ease;
}
.exp-row:hover::before { width: 100%; }

.exp-period {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--text4); letter-spacing: 0.1em; padding-top: 3px;
}
.exp-role  { font-size: 0.95rem; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.exp-company {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--accent); letter-spacing: 0.09em; margin-bottom: 14px;
  text-shadow: 0 0 10px rgba(var(--accent-rgb), 0.35);
}
.exp-bullets { list-style: none; }
.exp-bullets li {
  font-size: 0.77rem; color: var(--text2);
  line-height: 1.75; padding-left: 15px;
  position: relative; margin-bottom: 4px;
}
.exp-bullets li::before { content: '—'; position: absolute; left: 0; color: var(--text4); }

.exp-tags { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; padding-top: 3px; }
.exp-tag {
  font-family: var(--mono); font-size: 0.48rem;
  color: #2a2a2a; letter-spacing: 0.1em;
  border: 1px solid #161616; padding: 3px 8px;
}
```

- [ ] **Step 2: Create `src/components/Experience/Experience.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { experience } from '../../data/experience'
import './Experience.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Experience() {
  return (
    <section className="experience section--alt" id="experience">
      <motion.div
        className="sec-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-num">05</span>
        <span className="sec-label">// EXPERIENCE</span>
        <div className="sec-rule" />
      </motion.div>

      <div>
        {experience.map((item, i) => (
          <motion.div
            key={i}
            className="exp-row"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="exp-period">{item.period}</div>
            <div>
              <div className="exp-role">{item.role}</div>
              <div className="exp-company">{item.company}</div>
              <ul className="exp-bullets">
                {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
            <div className="exp-tags">
              {item.tags.map(t => <span key={t} className="exp-tag">{t}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to App.tsx after Stack**

```tsx
import Experience from '@/components/Experience/Experience'
// added below
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Experience section with neon sweep hover effect"
```

---

## Task 13: Contact section

**Files:**
- Create: `src/components/Contact/Contact.tsx`, `src/components/Contact/Contact.css`

- [ ] **Step 1: Create `src/components/Contact/Contact.css`**

```css
.contact {
  padding: 88px 48px 100px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 72px; border-top: 1px solid var(--border);
}

.contact-eyebrow {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--accent); letter-spacing: 0.25em; text-transform: uppercase;
  margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
  text-shadow: 0 0 14px rgba(var(--accent-rgb), 0.6);
}
.contact-eyebrow::before {
  content: '';
  width: 22px; height: 1px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 20px rgba(var(--accent-rgb), 0.4);
}

.contact-heading {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900; line-height: 0.9;
  letter-spacing: -0.04em; margin-bottom: 36px;
}
.contact-heading__solid { display: block; color: var(--text); }
.contact-heading__outline {
  display: block; color: transparent;
  -webkit-text-stroke: 1px var(--accent);
  filter: drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.4));
}

.contact-email {
  font-family: var(--mono); font-size: 0.76rem;
  color: var(--text2); border-bottom: 1px solid var(--border2);
  padding-bottom: 2px; letter-spacing: 0.05em;
  transition: color 0.2s, border-color 0.2s, text-shadow 0.2s;
}
.contact-email:hover {
  color: var(--accent); border-color: var(--accent);
  text-shadow: 0 0 14px rgba(var(--accent-rgb), 0.4);
}

.contact-links { margin-top: 28px; display: flex; flex-direction: column; gap: 10px; }
.contact-link {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--text4); letter-spacing: 0.12em; text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
  transition: color 0.2s;
}
.contact-link::before { content: '→'; color: var(--text4); transition: color 0.2s, text-shadow 0.2s; }
.contact-link:hover { color: var(--text2); }
.contact-link:hover::before { color: var(--accent); text-shadow: 0 0 10px rgba(var(--accent-rgb), 0.6); }

.contact-note {
  font-family: var(--mono); font-size: 0.58rem;
  color: #222; letter-spacing: 0.1em; line-height: 2.1;
  display: flex; flex-direction: column; justify-content: flex-end;
  height: 100%;
}
```

- [ ] **Step 2: Create `src/components/Contact/Contact.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import './Contact.css'

export default function Contact() {
  return (
    <motion.div
      className="contact"
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div>
        <div className="contact-eyebrow">Available for work</div>
        <h2 className="contact-heading">
          <span className="contact-heading__solid">LET'S</span>
          <span className="contact-heading__outline">TALK</span>
        </h2>
        <a className="contact-email" href="mailto:aayu.srsta@gmail.com">
          aayu.srsta@gmail.com
        </a>
        <div className="contact-links">
          <a
            className="contact-link"
            href="https://linkedin.com/in/aayu-shrestha-50546113a"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn — aayu-shrestha
          </a>
          <a
            className="contact-link"
            href="https://github.com/aayusrsta"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub — aayusrsta
          </a>
          <a className="contact-link" href="/aayu-shrestha-cv.pdf" target="_blank">
            Download CV — PDF
          </a>
        </div>
      </div>

      <div className="contact-note">
        SOFTWARE ENGINEER<br />
        KATHMANDU, NEPAL<br />
        +977-9843816795<br />
        ——————————————<br />
        REACT · REACT NATIVE<br />
        NEXT.JS · TYPESCRIPT<br />
        NODE.JS · GRAPHQL
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Add to App.tsx after Experience**

```tsx
import Contact from '@/components/Contact/Contact'
// added below
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Contact section with neon TALK outline and links"
```

---

## Task 14: Footer

**Files:**
- Create: `src/components/Footer/Footer.tsx`, `src/components/Footer/Footer.css`

- [ ] **Step 1: Create `src/components/Footer/Footer.css`**

```css
.footer {
  border-top: 1px solid var(--border);
  padding: 22px 48px;
  display: flex; justify-content: space-between; align-items: center;
}
.footer__item {
  font-family: var(--mono); font-size: 0.52rem;
  color: #252525; letter-spacing: 0.15em;
}
```

- [ ] **Step 2: Create `src/components/Footer/Footer.tsx`**

```tsx
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__item">AAYU SHRESTHA © {new Date().getFullYear()}</span>
      <span className="footer__item">BUILT IN REACT + FRAMER MOTION</span>
      <span className="footer__item">KATHMANDU, NEPAL</span>
    </footer>
  )
}
```

- [ ] **Step 3: Assemble final `src/app/page.tsx`**

```tsx
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import About from '@/components/About/About'
import Stack from '@/components/Stack/Stack'
import Experience from '@/components/Experience/Experience'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Stack />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Full browser walkthrough**

```bash
npm run dev
```

Walk through every section:
- Hero: scan line animates, glitch fires on name, SHRESTHA is white outline, buttons don't overlap anything
- Marquee: scrolls continuously
- Projects: cards animate in on scroll, 3D tilt on hover, crawl line + corner bracket on hover, Flowzen shows dashed/WIP style
- About: bio fades in from left, stats from right
- Stack: chips animate in, glow on hover
- Experience: rows fade in, neon sweep on hover
- Contact: TALK is teal outline with glow, links arrow glows on hover
- Footer: visible at bottom

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Footer, assemble complete App"
```

---

## Task 15: Add CV to public folder

**Files:**
- Copy: `/Users/amnil/Desktop/aayu shrestha cv.pdf` → `public/aayu-shrestha-cv.pdf`

- [ ] **Step 1: Copy CV**

```bash
cp "/Users/amnil/Desktop/aayu shrestha cv.pdf" /Users/amnil/Desktop/portfolio-rebuild/public/aayu-shrestha-cv.pdf
```

- [ ] **Step 2: Verify it's accessible**

```bash
npm run dev
# open http://localhost:5173/aayu-shrestha-cv.pdf
```

Expected: PDF opens in browser.

- [ ] **Step 3: Commit**

```bash
git add public/aayu-shrestha-cv.pdf
git commit -m "feat: add CV PDF to public folder"
```

---

## Task 16: Production build + deploy to Netlify

**Files:**
- Modify: push to `github.com/aayusrsta/enigma`

- [ ] **Step 1: TypeScript final check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: `out/` folder created (Next.js SSG export), no build errors. Verify with `ls out/` — should contain `index.html` and `_next/` static assets.

- [ ] **Step 3: Preview production build locally**

```bash
npx serve out
```

Expected: site runs at `http://localhost:3000` — verify all sections, animations, and links work. Pre-rendered HTML should be visible in `view-source:`.

- [ ] **Step 4: Connect repo to Netlify**

1. Go to [netlify.com](https://netlify.com) → New site → Import from Git → GitHub
2. Select repo `aayusrsta/enigma`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy site

- [ ] **Step 5: Add custom domain in Netlify**

1. In Netlify site settings → Domain management → Add custom domain → `aayu.com.np`
2. Copy the Netlify DNS nameservers shown
3. In your domain registrar (wherever you bought `aayu.com.np`) → update nameservers to Netlify's
4. Wait up to 24 hours for DNS propagation

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio rebuild — React + Framer Motion + Netlify"
git push origin master
```

Expected: Netlify auto-deploys on push. `aayu.com.np` serves the new React portfolio.

---

## Self-Review

**Spec coverage check:**
- ✅ Hero: scan line, corner brackets, glitch, SHRESTHA outline, teal eyebrow, neon CTA, coords, glow orbs
- ✅ Nav: fixed, blur, logo, links, pulsing dot
- ✅ Marquee: continuous scroll
- ✅ Professional projects (6): Ncell, Interpreter, Pixel Revive, Nepal In Data, Global Chautari, Flowzen (WIP)
- ✅ Personal projects (2): E-Commerce Dashboard, This Portfolio
- ✅ Project cards: 3D tilt, crawl line, corner bracket, neon dot, arrow
- ✅ About: bio, 2×2 stats, left/right reveal
- ✅ Stack: 3-col grid, glow chips
- ✅ Experience: 3 rows, neon sweep, company in accent
- ✅ Contact: LET'S / TALK (outline), email, LinkedIn, GitHub, CV download
- ✅ Footer: year, built-with, location
- ✅ Custom cursor: dot + lagging ring, expands on hover
- ✅ Scroll reveals: Framer Motion `whileInView` throughout
- ✅ Grain texture: global CSS
- ✅ All known links wired (LinkedIn, GitHub, email, CV); project links left as `#` with TODO comments
- ✅ CV copied to `public/`
- ✅ Netlify deploy with custom domain steps

**Placeholder scan:** No TBD or TODO in code — project URLs are `'#'` with explicit `// TODO:` comments as instructed by user.

**Type consistency:** `Project` interface used in `projects.ts`, `ProjectCard.tsx`, and `Projects.tsx` consistently. `ExperienceItem` and `StackGroup` match their consuming components.
