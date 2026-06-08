'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import './ProjectCarousel3D.css'

const CARD_W   = 270
const CARD_H   = 420
const RADIUS   = 530
const CAMERA_Z = 1080
const LERP     = 0.08
const DECAY    = 0.87

interface Props {
  projects: Project[]
  onCardClick: (p: Project) => void
}

export default function ProjectCarousel3D({ projects, onCardClick }: Props) {
  const mountRef  = useRef<HTMLDivElement>(null)
  const goToRef   = useRef<(i: number) => void>(() => {})
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    let rafId: number
    let cleanupFn: () => void

    // Create one host div + one React root per card
    const hosts: HTMLDivElement[] = []
    const roots: Root[]           = []

    projects.forEach((p, i) => {
      const el = document.createElement('div')
      el.style.cssText = `width:${CARD_W}px;height:${CARD_H}px;cursor:pointer;`
      hosts.push(el)

      // Independent React root — survives being moved by CSS3DRenderer
      const root = createRoot(el)
      root.render(
        <ProjectCard project={p} onClick={onCardClick} />
      )
      roots.push(root)
    })

    ;(async () => {
      const THREE = await import('three')
      const { CSS3DRenderer, CSS3DObject } = await import(
        'three/addons/renderers/CSS3DRenderer.js'
      )

      const N    = projects.length
      const step = (2 * Math.PI) / N
      const W    = mount.clientWidth
      const H    = mount.clientHeight

      /* Scene + Camera */
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 1, 10000)
      camera.position.z = CAMERA_Z

      /* CSS3DRenderer */
      const renderer = new CSS3DRenderer()
      renderer.setSize(W, H)
      renderer.domElement.style.cssText =
        'position:absolute;top:0;left:0;overflow:visible;'
      mount.appendChild(renderer.domElement)

      /* Place cards on the cylinder */
      const objects: InstanceType<typeof CSS3DObject>[] = []
      hosts.forEach((el, i) => {
        const obj  = new CSS3DObject(el)
        const ang  = i * step
        obj.position.set(
          Math.sin(ang) * RADIUS,
          0,
          Math.cos(ang) * RADIUS,
        )
        obj.rotation.y = ang
        scene.add(obj)
        objects.push(obj)
      })

      /* ── Loop state ──────────────────────────────────────── */
      const S = {
        cur: 0, tgt: 0, vel: 0,
        dragging: false, dragX0: 0, dragX: 0,
      }

      const snap = () => {
        S.tgt = Math.round(S.tgt / step) * step
        S.vel = 0
      }

      goToRef.current = (i: number) => {
        const raw   = -i * step - S.tgt
        const turns = Math.round(raw / (2 * Math.PI))
        S.tgt      += raw - turns * (2 * Math.PI)
        S.vel       = 0
      }

      /* ── Pointer handlers (drag-only, no scroll) ─────────── */
      const onDown = (e: PointerEvent) => {
        S.dragging = true
        S.dragX0 = S.dragX = e.clientX
        S.vel = 0
        mount.setPointerCapture(e.pointerId)
        mount.style.cursor = 'grabbing'
      }

      const onMove = (e: PointerEvent) => {
        if (!S.dragging) return
        const dx    = e.clientX - S.dragX
        S.dragX     = e.clientX
        const delta = -(dx / W) * Math.PI * 2.4
        S.tgt      += delta
        S.vel       = delta
        e.preventDefault()
      }

      const onUp = (e: PointerEvent) => {
        if (!S.dragging) return
        S.dragging         = false
        mount.style.cursor = 'grab'
        snap()
      }

      mount.addEventListener('pointerdown', onDown)
      mount.addEventListener('pointermove', onMove, { passive: false })
      mount.addEventListener('pointerup',   onUp)

      /* ── RAF loop ────────────────────────────────────────── */
      const animate = () => {
        rafId = requestAnimationFrame(animate)

        if (S.dragging) {
          S.cur = S.tgt
        } else {
          const diff = S.tgt - S.cur
          if (Math.abs(diff) < 0.0001) {
            S.cur = S.tgt
          } else {
            S.cur += diff * LERP
          }
        }

        scene.rotation.y = S.cur

        /* Per-card opacity */
        hosts.forEach((el, i) => {
          let off = (i * step + S.cur) % (2 * Math.PI)
          if (off >  Math.PI) off -= 2 * Math.PI
          if (off < -Math.PI) off += 2 * Math.PI
          const abs = Math.abs(off)

          el.style.opacity = String(
            abs < 0.12   ? 1
            : abs < step ? 0.55
            : abs < step * 2 ? 0.2
            : 0.05
          )
        })

        /* Active index */
        const raw = ((-S.cur % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const idx = Math.round(raw / step) % N
        setActiveIdx(prev => prev !== idx ? idx : prev)

        renderer.render(scene, camera)
      }
      animate()

      /* Resize */
      const onResize = () => {
        const W = mount.clientWidth, H = mount.clientHeight
        camera.aspect = W / H
        camera.updateProjectionMatrix()
        renderer.setSize(W, H)
      }
      window.addEventListener('resize', onResize)

      cleanupFn = () => {
        cancelAnimationFrame(rafId)
        mount.removeEventListener('pointerdown', onDown)
        mount.removeEventListener('pointermove', onMove)
        mount.removeEventListener('pointerup',   onUp)
        window.removeEventListener('resize',     onResize)
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        // Unmount independent React roots
        roots.forEach(r => { try { r.unmount() } catch {} })
      }
    })()

    return () => cleanupFn?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  const N    = projects.length
  const prev = useCallback(() => goToRef.current((activeIdx - 1 + N) % N), [activeIdx, N])
  const next = useCallback(() => goToRef.current((activeIdx + 1) % N), [activeIdx, N])

  /* Keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [prev, next])

  return (
    <div className="csl3d-wrapper">
      <div ref={mountRef} className="csl3d-mount" />

      {/* Depth vignettes */}
      <div className="csl3d-vignette csl3d-vignette--left" />
      <div className="csl3d-vignette csl3d-vignette--right" />

      {/* Arrows */}
      <button className="csl-arrow csl-arrow--left"  onClick={prev} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="csl-arrow csl-arrow--right" onClick={next} aria-label="Next">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Name + dots */}
      <div className="csl3d-footer">
        <p className="csl3d-name">{projects[activeIdx]?.name}</p>
        <div className="csl-dots">
          {projects.map((p, i) => (
            <button
              key={p.id}
              className={`csl-dot${i === activeIdx ? ' csl-dot--active' : ''}`}
              onClick={() => goToRef.current(i)}
              aria-label={`Go to ${p.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
