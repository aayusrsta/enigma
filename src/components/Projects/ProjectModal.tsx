'use client'
import React, { useEffect, useState, useCallback } from 'react'
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
  const displayUrl = url.startsWith('/') ? `aayu.com.np${url}` : url.replace(/^https?:\/\//, '')
  return (
    <div className="modal-browser">
      <div className="modal-browser-bar">
        <div className="modal-browser-dot" />
        <div className="modal-browser-dot" />
        <div className="modal-browser-dot" />
        <div className="modal-browser-url">
          <span>{displayUrl}</span>
        </div>
      </div>
      <iframe
        className="modal-browser-iframe"
        src={url}
        title="Project preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
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

function InternalPlaceholder() {
  return (
    <div className="modal-placeholder">
      <div className="modal-placeholder-icon">&#128274;</div>
      <div className="modal-placeholder-title">Internal Application</div>
      <div className="modal-placeholder-text">
        This is a private web application built for a client. Screenshots are not publicly available.
      </div>
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
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

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
              {project.previewType === 'internal' && <InternalPlaceholder />}
              {project.previewType === 'wip' && <WipPlaceholder />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
