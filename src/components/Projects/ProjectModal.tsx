'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data/projects'
import './ProjectModal.css'

interface Props {
  project: Project | null
  onClose: () => void
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function BrowserPreview({ url }: { url: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fullUrl = url.startsWith('/') ? `https://aayu.com.np${url}` : url
  const displayUrl = fullUrl.replace(/^https?:\/\//, '')

  const checkIfBlocked = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      // Same-origin: we can read contentDocument — check if it's actually empty (blocked)
      const doc = iframe.contentDocument
      if (!doc || doc.body.innerHTML.trim() === '') {
        setStatus('blocked')
      } else {
        setStatus('loaded')
      }
    } catch {
      // Cross-origin SecurityError means the page DID load (just can't read it) → show it
      setStatus('loaded')
    }
  }, [])

  const handleLoad = useCallback(() => {
    // Give browser 300ms to render content before checking
    timerRef.current = setTimeout(checkIfBlocked, 300)
  }, [checkIfBlocked])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div className="modal-browser">
      <div className="modal-browser-bar">
        <div className="modal-browser-dot" />
        <div className="modal-browser-dot" />
        <div className="modal-browser-dot" />
        <div className="modal-browser-url"><span>{displayUrl}</span></div>
        <a href={fullUrl} target="_blank" rel="noopener noreferrer"
          style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'var(--text4)',
                   textDecoration: 'none', letterSpacing: '0.08em', whiteSpace: 'nowrap',
                   padding: '2px 8px', border: '1px solid var(--border2)', flexShrink: 0 }}>
          OPEN ↗
        </a>
      </div>

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex' }}>
        {status === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', background: '#0a0a0a',
                        gap: 12, zIndex: 2 }}>
            <div style={{ width: 24, height: 24, border: '2px solid var(--border2)',
                          borderTopColor: 'var(--text3)', borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text4)', letterSpacing: '0.1em' }}>
              LOADING PREVIEW
            </span>
          </div>
        )}

        {status === 'blocked' && (
          <div className="modal-placeholder" style={{ flex: 1 }}>
            <div className="modal-placeholder-icon">🔗</div>
            <div className="modal-placeholder-title">Preview Unavailable</div>
            <div className="modal-placeholder-text">
              This site doesn&apos;t allow embedding. Open it directly instead.
            </div>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer"
              style={{ marginTop: 16, padding: '8px 20px', background: 'var(--text)',
                       color: '#000', fontSize: '0.7rem', letterSpacing: '0.1em',
                       textDecoration: 'none', fontWeight: 700 }}>
              OPEN SITE ↗
            </a>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="modal-browser-iframe"
          src={fullUrl}
          title="Project preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={handleLoad}
          style={{ opacity: status === 'loaded' ? 1 : 0,
                   transition: 'opacity 0.3s',
                   display: status === 'blocked' ? 'none' : 'block' }}
        />
      </div>
    </div>
  )
}

function MobilePreview({ screenshots, color }: { screenshots: string[]; color: string }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + screenshots.length) % screenshots.length)
  const next = () => setCurrent(i => (i + 1) % screenshots.length)

  return (
    <div className="modal-phone-wrap">
      <div style={{ position: 'relative', width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="modal-phone">
          <div className="modal-phone-notch">
            <div className="modal-phone-notch-bar" />
          </div>
          <div className="modal-phone-screen" style={{ borderTop: `2px solid ${color}22` }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={screenshots[current]}
                alt={`Screenshot ${current + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
          </div>
          <div className="modal-phone-home">
            <div className="modal-phone-home-bar" />
          </div>
        </div>
        {screenshots.length > 1 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {screenshots.map((_, i) => (
              <button
                key={i}
                className={`modal-shot-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Screenshot ${i + 1}`}
              />
            ))}
          </div>
        )}
        {screenshots.length > 1 && (
          <>
            <button className="modal-shot-nav modal-shot-nav--prev" onClick={prev}>&#8249;</button>
            <button className="modal-shot-nav modal-shot-nav--next" onClick={next}>&#8250;</button>
          </>
        )}
      </div>
    </div>
  )
}

function InternalPlaceholder({ appLinks, isPrivate = false }: { appLinks?: { web?: string }; isPrivate?: boolean }) {
  return (
    <div className="modal-placeholder">
      <div className="modal-placeholder-icon">{isPrivate ? '🔒' : '🔗'}</div>
      <div className="modal-placeholder-title">
        {isPrivate ? 'Private Application' : 'Live Preview'}
      </div>
      <div className="modal-placeholder-text">
        {isPrivate
          ? 'This application requires authentication. Open it directly to use it.'
          : 'Click below to open the live site in a new tab.'}
      </div>
      {appLinks?.web && (
        <a href={appLinks.web} target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 16, padding: '8px 20px', background: 'var(--text)',
                   color: '#000', fontSize: '0.7rem', letterSpacing: '0.1em',
                   textDecoration: 'none', fontWeight: 700 }}>
          {isPrivate ? 'OPEN APP ↗' : 'OPEN SITE ↗'}
        </a>
      )}
    </div>
  )
}

function WipPlaceholder() {
  return (
    <div className="modal-placeholder">
      <div className="modal-placeholder-icon">&#9881;&#65039;</div>
      <div className="modal-placeholder-title">In Development</div>
      <div className="modal-placeholder-text">
        This project is actively being built. Check back soon.
      </div>
    </div>
  )
}

export default function ProjectModal({ project, onClose }: Props) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!project) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey, project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ '--modal-color-rgb': hexToRgb(project.color) } as React.CSSProperties}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>

            {/* LEFT: info */}
            <div className="modal-info">
              <div className="modal-num">{project.num}</div>
              <div className="modal-name">{project.name}</div>
              <div className="modal-color-bar" style={{ background: project.color, boxShadow: `0 0 12px ${project.color}66` }} />

              <div className="modal-meta">
                {project.year && <div>YEAR &nbsp;&nbsp;&nbsp;<span>{project.year}</span></div>}
                {project.role && <div>ROLE &nbsp;&nbsp;&nbsp;<span>{project.role}</span></div>}
              </div>

              <p className="modal-desc">{project.desc}</p>

              <div className="modal-tags">
                {project.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
              </div>

              <div className="modal-links">
                {project.appLinks?.web && (
                  <a className="modal-link modal-link--primary" href={project.appLinks.web} target="_blank" rel="noopener noreferrer">
                    OPEN WEB APP <span>&#x2197;</span>
                  </a>
                )}
                {project.appLinks?.android && (
                  <a className="modal-link" href={project.appLinks.android} target="_blank" rel="noopener noreferrer">
                    GOOGLE PLAY <span>&#x2197;</span>
                  </a>
                )}
                {project.appLinks?.ios && (
                  <a className="modal-link" href={project.appLinks.ios} target="_blank" rel="noopener noreferrer">
                    APP STORE <span>&#x2197;</span>
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT: preview */}
            <div className="modal-preview">
              {project.previewType === 'web' && project.previewUrl && (
                <BrowserPreview url={project.previewUrl} />
              )}
              {project.previewType === 'mobile' && project.screenshots && (
                <MobilePreview screenshots={project.screenshots} color={project.color} />
              )}
              {project.previewType === 'internal' && (
                <InternalPlaceholder
                  appLinks={project.appLinks}
                  isPrivate={project.id === 'love-melodies-studio' || project.id === 'interpreter' || project.id === 'pixel-revive'}
                />
              )}
              {project.previewType === 'wip' && <WipPlaceholder />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
