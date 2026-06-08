'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '@/data/projects'
import ProjectCard from './ProjectCard'
import './ProjectCarousel3D.css'

/* ── Constants ────────────────────────────────────────────── */
const CARD_W    = 270
const CARD_H    = 420
const RADIUS    = 530
const CAMERA_Z  = 1080
const LERP      = 0.072        // approach speed
const DECAY     = 0.86         // momentum damping per frame

interface Props {
  projects: Project[]
  onCardClick: (p: Project) => void
}

export default function ProjectCarousel3D({ projects, onCardClick }: Props) {
  const mountRef   = useRef<HTMLDivElement>(null)
  const goToRef    = useRef<(i: number) => void>(() => {})
  const [activeIdx, setActiveIdx] = useState(0)
  const [ready, setReady]         = useState(false)

  /* Stable card host elements (one div per project card) */
  const hostsRef = useRef<HTMLDivElement[]>([])
  useEffect(() => {
    hostsRef.current = projects.map(() => {
      const el = document.createElement('div')
      el.style.cssText = `width:${CARD_W}px;height:${CARD_H}px;`
      return el
    })
    setReady(true)
    return () => { hostsRef.current = [] }
  }, [projects])

  /* ── Three.js init ──────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !mountRef.current) return
    const mount = mountRef.current
    let rafId: number

    /* Mutable loop state – shared between handlers & RAF */
    const S = {
      cur: 0,      // current scene rotation (radians)
      tgt: 0,      // target rotation
      vel: 0,      // momentum velocity
      dragging: false,
      dragX0: 0,   // pointer X at drag start (for click vs drag)
      dragX: 0,    // last pointer X
      snapping: false,
    }

    let cleanupFn: () => void

    ;(async () => {
      const THREE = await import('three')
      const { CSS3DRenderer, CSS3DObject } = await import(
        'three/addons/renderers/CSS3DRenderer.js'
      )

      const W = mount.clientWidth
      const H = mount.clientHeight
      const N = projects.length
      const step = (2 * Math.PI) / N   // radians between cards

      /* Scene */
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 1, 10000)
      camera.position.z = CAMERA_Z

      /* Renderer */
      const renderer = new CSS3DRenderer()
      renderer.setSize(W, H)
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.top = '0'
      renderer.domElement.style.left = '0'
      mount.appendChild(renderer.domElement)

      /* Place cards on cylinder */
      hostsRef.current.forEach((el, i) => {
        const obj  = new CSS3DObject(el)
        const ang  = i * step
        obj.position.set(
          Math.sin(ang) * RADIUS,
          0,
          Math.cos(ang) * RADIUS,
        )
        obj.rotation.y = ang
        scene.add(obj)
      })

      /* Snap: align to nearest card */
      const snap = () => {
        const nearest = Math.round(S.tgt / step) * step
        S.tgt = nearest
        S.vel = 0
        S.snapping = true
      }

      /* External navigate */
      goToRef.current = (i: number) => {
        /* Find the shortest rotation to card i */
        const target = -i * step
        const raw    = target - S.tgt
        const turns  = Math.round(raw / (2 * Math.PI))
        S.tgt = S.tgt + raw - turns * (2 * Math.PI)
        S.vel = 0
        S.snapping = true
      }

      /* ── Pointer handlers ────────────────────────────────── */
      const onDown = (e: PointerEvent) => {
        S.dragging = true
        S.dragX0   = e.clientX
        S.dragX    = e.clientX
        S.vel      = 0
        S.snapping = false
        mount.setPointerCapture(e.pointerId)
      }

      const onMove = (e: PointerEvent) => {
        if (!S.dragging) return
        const dx    = e.clientX - S.dragX
        S.dragX     = e.clientX
        const delta = -(dx / W) * Math.PI * 2.4
        S.tgt      += delta
        S.vel       = delta           // raw frame velocity
        e.preventDefault()
      }

      const onUp = (e: PointerEvent) => {
        if (!S.dragging) return
        S.dragging = false
        if (Math.abs(e.clientX - S.dragX0) < 8) {
          /* It was a click – let the React onClick on the card fire */
          snap()
        } else {
          /* Apply a little momentum then snap */
          snap()
        }
      }

      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        S.tgt += (e.deltaY > 0 ? 1 : -1) * step
        snap()
      }

      mount.addEventListener('pointerdown',  onDown)
      mount.addEventListener('pointermove',  onMove, { passive: false })
      mount.addEventListener('pointerup',    onUp)
      mount.addEventListener('wheel',        onWheel, { passive: false })

      /* ── RAF loop ────────────────────────────────────────── */
      const animate = () => {
        rafId = requestAnimationFrame(animate)

        if (S.dragging) {
          /* Follow cursor exactly */
          S.cur = S.tgt
        } else {
          /* Apply decaying momentum */
          if (!S.snapping && Math.abs(S.vel) > 0.0003) {
            S.tgt += S.vel
            S.vel *= DECAY
            if (Math.abs(S.vel) < 0.0003) snap()
          }
          /* Smooth lerp toward target */
          const diff = S.tgt - S.cur
          if (Math.abs(diff) < 0.00015) {
            S.cur = S.tgt
            S.snapping = false
          } else {
            S.cur += diff * LERP
          }
        }

        scene.rotation.y = S.cur

        /* Per-card visual state */
        hostsRef.current.forEach((el, i) => {
          let off = (i * step + S.cur) % (2 * Math.PI)
          if (off >  Math.PI) off -= 2 * Math.PI
          if (off < -Math.PI) off += 2 * Math.PI
          const abs = Math.abs(off)

          const opacity = abs < 0.12   ? 1
                        : abs < step   ? 0.58
                        : abs < step*2 ? 0.22
                        : 0.06

          el.style.opacity    = String(opacity)
          el.style.transition = S.dragging
            ? 'opacity 0.05s'
            : 'opacity 0.35s ease'
        })

        /* Active index for dots / name */
        const raw  = ((-S.cur % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const idx  = Math.round(raw / step) % N
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
        mount.removeEventListener('wheel',       onWheel)
        window.removeEventListener('resize',     onResize)
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)

      }
    })()

    return () => cleanupFn?.()
  }, [ready, projects])

  /* Arrows */
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
      {/* Three.js mounts here */}
      <div ref={mountRef} className="csl3d-mount" />

      {/* React portals render card JSX into Three.js host divs */}
      {ready && hostsRef.current.map((el, i) =>
        createPortal(
          <ProjectCard project={projects[i]} onClick={onCardClick} />,
          el,
          projects[i].id,
        )
      )}

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

      {/* Footer: project name + dots */}
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
