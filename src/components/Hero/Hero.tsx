'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticBtn from './MagneticBtn'
import './Hero.css'

const HeroGL = dynamic(() => import('./HeroGL'), { ssr: false })

/* ── Text scramble hook ───────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function useScramble(target: string, delay = 600) {
  const [text, setText] = useState(target)

  useEffect(() => {
    let frame = 0
    const t = setTimeout(() => {
      const iid = setInterval(() => {
        setText(
          target.split('').map((ch, i) =>
            frame / 2 >= i ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
          ).join('')
        )
        frame++
        if (frame > target.length * 2 + 4) clearInterval(iid)
      }, 40)
    }, delay)
    return () => { clearTimeout(t) }
  }, [target, delay])

  return text
}

export default function Hero() {
  const [glReady, setGlReady] = useState(false)
  const aayu     = useScramble('AAYU',     400)
  const shrestha = useScramble('SHRESTHA', 700)

  return (
    <section className={`hero${glReady ? ' hero--gl' : ''}`}>
      <HeroGL onReady={() => setGlReady(true)} />

      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-scan" />

      <div className="hero-coords">
        LAT 27.7172° N<br />LON 85.3240° E<br />——————<br />KTM_NPL
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="hero-eyebrow">
          Software Engineer · React / React Native / Next.js
        </div>

        <h1 className="hero-name">
          <span className="hero-name__glitch" data-text="AAYU">{aayu}</span>
          <br />
          <span className="hero-name__ghost">{shrestha}</span>
        </h1>

        <div className="hero-body">
          <p className="hero-desc">
            Building <span className="hero-desc__accent">production-grade</span> web &amp; mobile apps.<br />
            React · React Native · Next.js · TypeScript<br />
            <span className="hero-desc__dim">Currently @ Amnil Technologies — Kathmandu</span>
          </p>
          <div className="hero-actions">
            <MagneticBtn className="btn-neon" href="#work">[ VIEW WORK ]</MagneticBtn>
            <MagneticBtn className="btn-ghost" href="#contact">GET IN TOUCH →</MagneticBtn>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
