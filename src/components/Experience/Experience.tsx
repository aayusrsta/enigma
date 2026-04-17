'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { experience } from '@/data/experience'
import './Experience.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function Experience() {
  return (
    <section className="experience section--alt" id="experience">
      <motion.div
        className="sec-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-num">05</span>
        <span className="sec-label">// EXPERIENCE</span>
        <div className="sec-rule" />
      </motion.div>

      <div>
        {experience.map((item, i) => (
          <motion.div
            key={i}
            className="exp-row"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="exp-period">{item.period}</div>
            <div>
              <div className="exp-role">{item.role}</div>
              <div className="exp-company">{item.company}</div>
              <ul className="exp-bullets">
                {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
            <div className="exp-tags">
              {item.tags.map(t => <span key={t} className="exp-tag">{t}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
