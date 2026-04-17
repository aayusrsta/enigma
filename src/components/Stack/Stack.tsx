'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { stack } from '@/data/stack'
import './Stack.css'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }

export default function Stack() {
  return (
    <section className="stack" id="stack">
      <motion.div
        className="sec-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-num">04</span>
        <span className="sec-label">// TECH STACK</span>
        <div className="sec-rule" />
      </motion.div>

      <motion.div
        className="stack-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {stack.map(group => (
          <motion.div key={group.label} className="stack-col" variants={fadeUp}>
            <div className="stack-col__head">{group.label}</div>
            <div className="chips">
              {group.skills.map(skill => (
                <span key={skill} className="chip">{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
