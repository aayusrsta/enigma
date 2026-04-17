import { useRef } from 'react'
import type { MouseEvent } from 'react'

export function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 6}deg) translateZ(6px)`
    card.style.transition = 'transform 0.05s'
  }

  const onMouseLeave = () => {
    const card = ref.current
    if (!card) return
    card.style.transition = 'transform 0.4s ease'
    card.style.transform = 'none'
  }

  return { ref, onMouseMove, onMouseLeave }
}
