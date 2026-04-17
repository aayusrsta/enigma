import React from 'react'
import './Marquee.css'

const items = [
  'React.js', 'React Native', 'Next.js', 'TypeScript',
  'Node.js', 'GraphQL', 'Redux Toolkit', 'Firebase',
  'Tailwind CSS', 'WebSocket',
]

export default function Marquee() {
  const all = [...items, ...items]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {all.map((item, i) => (
          <React.Fragment key={i}>
            <span className="marquee-item">{item}</span>
            <em className="marquee-sep">✦</em>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
