import React from 'react'
import './Nav.css'

const links = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">AAYU<b>.</b>COM<b>.NP</b></div>
      <div className="nav-links">
        {links.map(l => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </div>
      <div className="nav-status">
        <div className="nav-ping" />
        <span>OPEN TO WORK</span>
      </div>
    </nav>
  )
}
