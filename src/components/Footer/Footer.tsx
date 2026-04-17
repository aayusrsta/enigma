import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__item">AAYU SHRESTHA © {new Date().getFullYear()}</span>
      <span className="footer__item">BUILT IN NEXT.JS + FRAMER MOTION</span>
      <span className="footer__item">KATHMANDU, NEPAL</span>
    </footer>
  )
}
