'use client'
import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { mobileProjects, webProjects, type Kind, type Platform, type Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectCarousel3D from './ProjectCarousel3D'
import ProjectModal from './ProjectModal'
import ShowroomPanel from '../Showroom/ShowroomPanel'
import '../Showroom/Showroom.css'
import './Projects.css'

const DeviceStage = dynamic(() => import('../Showroom/DeviceStage'), { ssr: false })

const platforms: { id: Platform; label: string; sub: string; list: Project[] }[] = [
  { id: 'mobile', label: 'Mobile apps', sub: 'iOS · Android', list: mobileProjects },
  { id: 'web', label: 'Web apps', sub: 'Browser · PWA', list: webProjects },
]

const kinds: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Client work' },
  { id: 'personal', label: 'Personal' },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const cardVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const SHOT_MS = 3400

// Phones get the grid instead of the 3D ring.
const PHONE_QUERY = '(max-width: 768px)'
const subscribePhone = (cb: () => void) => {
  const mq = window.matchMedia(PHONE_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const useIsPhone = () =>
  useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false)

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10.5 5h3" />
    </svg>
  )
}

function LaptopGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4.5" width="16" height="11" rx="1.6" />
      <path d="M2 19h20l-1.5-2.5h-17z" />
    </svg>
  )
}

export default function Projects() {
  const [platform, setPlatform] = useState<Platform>('mobile')
  const [kind, setKind] = useState<'all' | Kind>('all')
  const [index, setIndex] = useState(0)
  const [shot, setShot] = useState(0)
  const [dir, setDir] = useState(1)
  const [selected, setSelected] = useState<Project | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useIsPhone()

  const listFor = useCallback(
    (p: Platform) => platforms.find(x => x.id === p)!.list.filter(x => kind === 'all' || x.kind === kind),
    [kind],
  )
  const list = useMemo(() => listFor(platform), [listFor, platform])
  const other = useMemo(() => listFor(platform === 'mobile' ? 'web' : 'mobile'), [listFor, platform])
  const project = list[Math.min(index, list.length - 1)]

  const goTo = useCallback((i: number, direction?: number) => {
    setIndex(cur => {
      const n = list.length
      const next = ((i % n) + n) % n
      setDir(direction ?? (next >= cur ? 1 : -1))
      return next
    })
    setShot(0)
  }, [list.length])

  const choosePlatform = useCallback((p: Platform) => {
    const next = platforms.find(x => x.id === p)!.list
    setKind(k => (k !== 'all' && !next.some(x => x.kind === k) ? 'all' : k))
    setPlatform(p)
    setIndex(0)
    setShot(0)
    setDir(1)
  }, [])

  const chooseKind = (k: 'all' | Kind) => {
    setKind(k)
    setIndex(0)
    setShot(0)
  }

  // Phones cycle through their screenshots like someone scrolling the app.
  useEffect(() => {
    const count = project?.screenshots?.length ?? 0
    if (count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setDir(1)
      setShot(s => (s + 1) % count)
    }, SHOT_MS)
    return () => clearInterval(id)
  }, [project])

  const showGrid = isExpanded || isMobile
  const all = platforms.find(x => x.id === platform)!.list
  const kindCount = (k: 'all' | Kind) => all.filter(x => k === 'all' || x.kind === k).length
  const counts = { mobile: listFor('mobile').length, web: listFor('web').length }

  return (
    <>
      <section className="projects" id="work">
        <motion.header
          className="work-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="work-eyebrow">{`// SELECTED WORK — ${mobileProjects.length + webProjects.length} PRODUCTS`}</span>
          <h2 className="work-title">
            Shipped to <em>pockets</em> and <em>browsers.</em>
          </h2>
          <p className="work-lede">
            Pick a device. Every app runs on the hardware it was built for — banking, telecom, cinema
            and health apps in the phone, full-stack products on the laptop.
          </p>
        </motion.header>

        {/* ── Showroom ───────────────────────────────────── */}
        <div className="showroom">
          <DeviceStage
            platform={platform}
            project={project}
            parked={other[0]}
            shot={shot}
            dir={dir}
            onSelectPlatform={choosePlatform}
            onOpenProject={() => project && setSelected(project)}
          />

          <div className="device-switch" role="tablist" aria-label="Project category">
            {platforms.map(p => (
              <button
                key={p.id}
                role="tab"
                aria-selected={platform === p.id}
                className={`device-switch__btn${platform === p.id ? ' is-active' : ''}`}
                onClick={() => choosePlatform(p.id)}
              >
                {platform === p.id && (
                  <motion.span layoutId="device-switch-pill" className="device-switch__pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                )}
                <span className="device-switch__icon">{p.id === 'mobile' ? <PhoneGlyph /> : <LaptopGlyph />}</span>
                <span className="device-switch__text">
                  <span className="device-switch__label">{p.label}</span>
                  <span className="device-switch__sub">{p.sub}</span>
                </span>
                <span className="device-switch__count">{String(counts[p.id]).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          {project && (
            <ShowroomPanel
              project={project}
              index={Math.min(index, list.length - 1)}
              total={list.length}
              shot={shot}
              onPrev={() => goTo(index - 1, -1)}
              onNext={() => goTo(index + 1, 1)}
              onOpen={() => setSelected(project)}
            />
          )}

          <div className="showroom-hint" aria-hidden="true">
            DRAG TO SPIN · TAP THE {platform === 'mobile' ? 'LAPTOP' : 'PHONE'} TO SWITCH
          </div>
        </div>

        {/* ── Filters + ring ──────────────────────────────── */}
        <div className="proj-header">
          <div className="kind-filter" role="tablist" aria-label="Filter projects">
            {kinds.map(k => (
              <button
                key={k.id}
                role="tab"
                aria-selected={kind === k.id}
                disabled={kindCount(k.id) === 0}
                className={`kind-filter__btn${kind === k.id ? ' is-active' : ''}`}
                onClick={() => chooseKind(k.id)}
              >
                {kind === k.id && (
                  <motion.span layoutId="kind-pill" className="kind-filter__pill"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }} />
                )}
                <span>{k.label}</span>
                <span className="kind-filter__count">{kindCount(k.id)}</span>
              </button>
            ))}
          </div>

          {!isMobile && (
            <button
              className={`proj-expand-btn${isExpanded ? ' proj-expand-btn--active' : ''}`}
              onClick={() => setIsExpanded(e => !e)}
            >
              {isExpanded ? (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="9" />
                  </svg>
                  Ring
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Grid
                </>
              )}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.p key="empty" className="proj-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Nothing here yet — try another filter.
            </motion.p>
          ) : showGrid ? (
            <motion.div
              key={`grid-${platform}-${kind}`}
              className="proj-grid"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              {list.map((p, i) => (
                <motion.div key={p.id} variants={cardVariant} onMouseEnter={() => !isMobile && goTo(i)}>
                  <ProjectCard project={p} onClick={setSelected} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`ring-${platform}-${kind}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
            >
              <ProjectCarousel3D
                projects={list}
                onCardClick={setSelected}
                activeIndex={Math.min(index, list.length - 1)}
                onActiveChange={i => goTo(i)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
