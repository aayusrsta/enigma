'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import './ProjectCarousel.css'

interface Props {
  projects: Project[]
  onCardClick: (p: Project) => void
}

const RADIUS = 420

export default function ProjectCarousel({ projects, onCardClick }: Props) {
  const [active, setActive] = useState(0)
  const N = projects.length
  const angleStep = 360 / N

  // Reset when project list changes (tab switch)
  useEffect(() => { setActive(0) }, [projects])

  const prev = useCallback(() => setActive(i => (i - 1 + N) % N), [N])
  const next = useCallback(() => setActive(i => (i + 1) % N), [N])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  return (
    <div className="csl-scene">
      {/* Side fade vignettes */}
      <div className="csl-vignette csl-vignette--left" />
      <div className="csl-vignette csl-vignette--right" />

      {/* 3D rotating ring */}
      <div
        className="csl-track"
        style={{ transform: `rotateY(${-active * angleStep}deg)` }}
      >
        {projects.map((p, i) => {
          const offset = ((i - active) % N + N) % N
          const isActive = offset === 0
          const isAdjacent = offset === 1 || offset === N - 1
          return (
            <div
              key={p.id}
              className={`csl-item${isActive ? ' csl-item--active' : ''}`}
              style={{
                transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`,
                opacity: isActive ? 1 : isAdjacent ? 0.55 : 0.2,
                filter: isActive ? 'none' : 'blur(0.5px)',
              }}
            >
              <ProjectCard project={p} onClick={onCardClick} />
            </div>
          )
        })}
      </div>

      {/* Prev arrow */}
      <button className="csl-arrow csl-arrow--left" onClick={prev} aria-label="Previous project">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button className="csl-arrow csl-arrow--right" onClick={next} aria-label="Next project">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="csl-dots">
        {projects.map((p, i) => (
          <button
            key={p.id}
            className={`csl-dot${i === active ? ' csl-dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Go to ${p.name}`}
          />
        ))}
      </div>
    </div>
  )
}
