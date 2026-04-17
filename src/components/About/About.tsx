'use client'
import React from 'react'
import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { num: '2', suffix: '+', label: 'Years experience', accent: false },
  { num: '4',  suffix: '',  label: 'Live projects',   accent: false },
  { num: '3',  suffix: '',  label: 'Companies',       accent: false },
  { num: 'OPEN', suffix: '', label: 'To new roles',   accent: true  },
]

const fadeLeft  = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' as const } } }
const fadeRight = { hidden: { opacity: 0, x:  20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' as const } } }
const stagger   = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

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
          I&apos;m a <strong>Software Engineer based in Kathmandu, Nepal</strong> with 2+ years of
          experience building and shipping web and mobile applications. I specialise in{' '}
          <strong>React, React Native</strong>, and <strong>Next.js</strong>.
          <br /><br />
          At <span className="about-text__accent">Amnil Technologies</span>, I engineer features
          for the Ncell App — one of Nepal&apos;s most used mobile applications. Before that, I built
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
