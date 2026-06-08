'use client'
import React from 'react'
import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { num: '3', suffix: '+', label: 'Years experience', accent: false },
  { num: '6', suffix: '',  label: 'Live projects',    accent: false },
  { num: '2', suffix: '',  label: 'Companies',        accent: false },
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
        <span className="sec-title">About</span>
        <div className="sec-rule" />
      </motion.div>

      <div className="about-grid">
        <motion.div
          className="about-text"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="about-chapter">
            <span className="about-chapter__num">I.</span>
            <p>
              Started as a curious kid in Kathmandu who couldn&apos;t stop asking{' '}
              <em>why does this work?</em> That one question rewired everything.
            </p>
          </div>

          <div className="about-chapter">
            <span className="about-chapter__num">II.</span>
            <p>
              Three years. Two companies. Six products shipped to real people.{' '}
              <strong>React, React Native, Next.js</strong> — the tools I reach for when
              something needs to be built right and built to last.
            </p>
          </div>

          <div className="about-chapter">
            <span className="about-chapter__num">III.</span>
            <p>
              At <span className="about-text__accent">Amnil Technologies</span>, I engineer
              the Ncell App — Nepal&apos;s largest telecom application, used by millions every
              day. Complexity hidden behind interfaces that just <em>work</em>.
            </p>
          </div>

          <div className="about-chapter">
            <span className="about-chapter__num">IV.</span>
            <p>
              Speed that doesn&apos;t feel fast. Design that doesn&apos;t look designed.{' '}
              <strong>Code that the next engineer won&apos;t dread reading at midnight.</strong>
            </p>
          </div>

          <p className="about-thanks">Thanks for stopping by.</p>

          <div className="about-sig">
            <span className="about-sig__first">Aayu</span>
            <span className="about-sig__last">S.</span>
          </div>
        </motion.div>

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
