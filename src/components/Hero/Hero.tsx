'use client'
import React from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-scan" />
      <div className="hero-corner hero-corner--tl" />
      <div className="hero-corner hero-corner--tr" />
      <div className="hero-corner hero-corner--bl" />
      <div className="hero-corner hero-corner--br" />
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
          <span className="hero-name__glitch" data-text="AAYU">AAYU</span>
          <br />
          <span className="hero-name__ghost">SHRESTHA</span>
        </h1>

        <div className="hero-body">
          <p className="hero-desc">
            Building <span className="hero-desc__accent">production-grade</span> web &amp; mobile apps.<br />
            React · React Native · Next.js · TypeScript<br />
            <span className="hero-desc__dim">Currently @ Amnil Technologies — Kathmandu</span>
          </p>
          <div className="hero-actions">
            <a className="btn-neon" href="#work">[ VIEW WORK ]</a>
            <a className="btn-ghost" href="#contact">GET IN TOUCH →</a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
