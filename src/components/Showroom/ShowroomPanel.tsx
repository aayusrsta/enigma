'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data/projects'

interface Props {
  project: Project
  index: number
  total: number
  shot: number
  onPrev: () => void
  onNext: () => void
  onOpen: () => void
}

function StoreLink({ href, label, kind }: { href: string; label: string; kind: 'play' | 'apple' | 'web' | 'admin' }) {
  const icon = {
    play: <path d="M5 3.5v17l9-8.5zM5 3.5l12 6.8-3 2.2M5 20.5l12-6.8-3-2.2M17 10.3l2.6 1.5c.6.4.6.9 0 1.3L17 14.6" />,
    apple: <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.4-.9-2.5-3.8zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.6 1.3-.6.6-1.1 1.6-.9 2.6.9.1 1.9-.5 2.6-1.2z" />,
    web: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
    admin: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 9h16M9 9v11" /></>,
  }[kind]
  return (
    <a className="store-link" href={href} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      {label}
    </a>
  )
}

/** The text side of the showroom: what's on the device right now, and how to get it. */
export default function ShowroomPanel({ project: p, index, total, shot, onPrev, onNext, onOpen }: Props) {
  const shots = p.screenshots?.length ?? 0
  return (
    <aside className="showroom-panel" style={{ '--accent': p.color } as React.CSSProperties}>
      <div className="panel-top">
        <span className="panel-index">
          <b>{String(index + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
        </span>
        <span className={`panel-kind panel-kind--${p.kind}`}>{p.kind === 'work' ? 'CLIENT WORK' : 'PERSONAL'}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.id}
          className="panel-body"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] } }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.2 } }}
        >
          <div className="panel-client">
            {p.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="panel-icon" src={p.icon} alt="" width={40} height={40} />
            )}
            <div>
              <div className="panel-client__name">{p.client}</div>
              <div className="panel-client__year">{p.year}</div>
            </div>
          </div>

          <h3 className="panel-name">{p.name}</h3>
          <p className="panel-desc">{p.desc}</p>

          <div className="panel-tags">
            {p.tags.map(t => <span key={t}>{t}</span>)}
          </div>

          <div className="panel-links">
            {p.appLinks?.android && <StoreLink href={p.appLinks.android} label="Google Play" kind="play" />}
            {p.appLinks?.ios && <StoreLink href={p.appLinks.ios} label="App Store" kind="apple" />}
            {p.appLinks?.web && <StoreLink href={p.appLinks.web} label="Open live" kind="web" />}
            {p.appLinks?.admin && <StoreLink href={p.appLinks.admin} label="Admin" kind="admin" />}
            {!p.appLinks && <span className="panel-private">{p.inProgress ? 'In development' : 'Internal — not public'}</span>}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="panel-foot">
        <button className="panel-arrow" onClick={onPrev} aria-label="Previous project">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className="panel-progress" aria-hidden="true">
          {Array.from({ length: Math.max(shots, 1) }, (_, i) => (
            <span key={`${p.id}-${i}`} className={i === shot % Math.max(shots, 1) ? 'is-on' : ''} />
          ))}
        </div>
        <button className="panel-arrow" onClick={onNext} aria-label="Next project">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <button className="panel-open" onClick={onOpen}>
          Case details <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  )
}
