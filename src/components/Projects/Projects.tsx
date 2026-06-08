'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { professionalProjects, personalProjects, type Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import './Projects.css'

const tabs = [
  { id: 'professional', label: 'Professional', projects: professionalProjects },
  { id: 'personal',     label: 'Personal',     projects: personalProjects },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const cardVariant = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function Projects() {
  const [selected, setSelected]   = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<'professional' | 'personal'>('professional')

  const activeProjects = tabs.find(t => t.id === activeTab)?.projects ?? []

  return (
    <>
      <section className="projects" id="work">

        {/* ── iOS-style glassy tab bar ──────────────────── */}
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

        {/* ── Tab content with slide transition ────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="proj-grid"
            variants={stagger}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4,0,0.2,1], staggerChildren: 0.07 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
          >
            {activeProjects.map(p => (
              <motion.div key={p.id} variants={cardVariant}>
                <ProjectCard project={p} onClick={setSelected} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
