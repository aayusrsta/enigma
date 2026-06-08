'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { professionalProjects, personalProjects, type Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectCarousel3D from './ProjectCarousel3D'
import ProjectModal from './ProjectModal'
import './Projects.css'

const tabs = [
  { id: 'professional', label: 'Professional', projects: professionalProjects },
  { id: 'personal',     label: 'Personal',     projects: personalProjects },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const cardVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function Projects() {
  const [selected, setSelected]   = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<'professional' | 'personal'>('professional')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)

  // Detect mobile — carousel disabled on touch screens
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const showGrid = isExpanded || isMobile

  const activeProjects = tabs.find(t => t.id === activeTab)?.projects ?? []

  return (
    <>
      <section className="projects" id="work">

        {/* ── Header row: tabs + expand toggle ─────────────── */}
        <div className="proj-header">
          <div className="proj-tabs-wrap">
            <div className="proj-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`proj-tab${activeTab === tab.id ? ' proj-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id as 'professional' | 'personal')}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="proj-tab-pill"
                      className="proj-tab-pill"
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  <span className="proj-tab-label">{tab.label}</span>
                  <span className="proj-tab-count">{tab.projects.length}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className={`proj-expand-btn${isExpanded ? ' proj-expand-btn--active' : ''}`}
            onClick={() => setIsExpanded(e => !e)}
          >
            {isExpanded ? (
              <>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="9" />
                </svg>
                Carousel
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                Expand
              </>
            )}
          </button>
        </div>

        {/* ── Content: carousel or grid ─────────────────────── */}
        <AnimatePresence mode="wait">
          {showGrid ? (
            <motion.div
              key={`grid-${activeTab}`}
              className="proj-grid"
              variants={stagger}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.07 } }}
              exit={{ opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.22 } }}
            >
              {activeProjects.map(p => (
                <motion.div key={p.id} variants={cardVariant}>
                  <ProjectCard project={p} onClick={setSelected} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`carousel-${activeTab}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
            >
                <ProjectCarousel3D
                key={activeTab}
                projects={activeProjects}
                onCardClick={setSelected}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
