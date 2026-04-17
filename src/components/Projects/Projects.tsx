'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { professionalProjects, personalProjects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function Projects() {
  return (
    <section className="projects" id="work">
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
