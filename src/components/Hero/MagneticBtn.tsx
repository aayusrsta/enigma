'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  href?: string
  strength?: number
}

export default function MagneticBtn({ children, className, href, strength = 0.35 }: Props) {
  const ref   = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) * strength
    const y = (e.clientY - r.top  - r.height / 2) * strength
    setPos({ x, y })
  }
  const onLeave = () => setPos({ x: 0, y: 0 })

  const Tag = href ? 'a' : 'span'

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: 'inline-block' }}>
      <motion.div
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
      >
        <Tag className={className} href={href}>{children}</Tag>
      </motion.div>
    </div>
  )
}
