'use client'
import React from 'react'
import { motion } from 'framer-motion'
import './Contact.css'

export default function Contact() {
  return (
    <motion.div
      className="contact"
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div>
        <div className="contact-eyebrow">Available for work</div>
        <h2 className="contact-heading">
          <span className="contact-heading__solid">LET&apos;S</span>
          <span className="contact-heading__outline">TALK</span>
        </h2>
        <a className="contact-email" href="mailto:aayu.srsta@gmail.com">
          aayu.srsta@gmail.com
        </a>
        <div className="contact-links">
          <a
            className="contact-link"
            href="https://linkedin.com/in/aayu-shrestha-50546113a"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn — aayu-shrestha
          </a>
          <a
            className="contact-link"
            href="https://github.com/aayusrsta"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub — aayusrsta
          </a>
          <a className="contact-link" href="/aayu-shrestha-cv.pdf" target="_blank" rel="noopener noreferrer">
            Download CV — PDF
          </a>
        </div>
      </div>

      <div className="contact-note">
        SOFTWARE ENGINEER<br />
        KATHMANDU, NEPAL<br />
        +977-9843816795<br />
        ——————————————<br />
        REACT · REACT NATIVE<br />
        NEXT.JS · TYPESCRIPT<br />
        NODE.JS · GRAPHQL
      </div>
    </motion.div>
  )
}
