import React from 'react'
import { shippedFor } from '@/data/projects'
import './Clients.css'

/** Apps live in the stores, scrolling under the hero: proof before the portfolio. */
export default function Clients() {
  const items = [...shippedFor, ...shippedFor]
  return (
    <section className="clients" aria-label="Apps shipped for clients">
      <div className="clients-label">
        <span className="clients-dot" />
        LIVE IN THE APP STORES
      </div>
      <div className="clients-track-wrap">
        <div className="clients-track">
          {items.map((p, i) => (
            <a key={`${p.id}-${i}`} className="client" href="#work" aria-hidden={i >= shippedFor.length}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.icon} alt="" width={36} height={36} loading="lazy" />
              <span className="client-text">
                <span className="client-app">{p.name}</span>
                <span className="client-owner">{p.client}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
