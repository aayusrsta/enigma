'use client'
import { useEffect, useRef } from 'react'
import './HeroGL.css'

interface Props { onReady?: () => void }

const COUNT   = 180
const SPEED   = 0.00045
const CONNECT = 1.8   // world-unit distance to draw a line

export default function HeroGL({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf: number

    // Use plain import() — no async/await wrapper that can silently eat errors
    import('three').then((THREE) => {
      const W = window.innerWidth
      const H = window.innerHeight

      /* ── Renderer ─────────────────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
      renderer.setClearColor(0x080808)
      renderer.setSize(W, H, false)
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100)
      camera.position.z = 4.5

      /* ── Particle positions + velocities ─────────────────── */
      const pos  = new Float32Array(COUNT * 3)
      const vel  = new Float32Array(COUNT * 3)

      for (let i = 0; i < COUNT; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 10
        pos[i*3+1] = (Math.random() - 0.5) * 6
        pos[i*3+2] = (Math.random() - 0.5) * 2
        vel[i*3]   = (Math.random() - 0.5) * SPEED
        vel[i*3+1] = (Math.random() - 0.5) * SPEED
        vel[i*3+2] = 0
      }

      /* ── THREE.Points ─────────────────────────────────────── */
      const pGeo = new THREE.BufferGeometry()
      const pAttr = new THREE.BufferAttribute(pos, 3)
      pGeo.setAttribute('position', pAttr)

      const pMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xbbbbdd,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
      })
      scene.add(new THREE.Points(pGeo, pMat))

      /* ── Connection lines (LineSegments updated each frame) ── */
      const maxLines = COUNT * COUNT
      const linePos  = new Float32Array(maxLines * 6)
      const lGeo = new THREE.BufferGeometry()
      const lAttr = new THREE.BufferAttribute(linePos, 3)
      lAttr.setUsage(THREE.DynamicDrawUsage)
      lGeo.setAttribute('position', lAttr)

      const lMat = new THREE.LineBasicMaterial({
        color: 0x8888aa,
        transparent: true,
        opacity: 0.25,
      })
      const lines = new THREE.LineSegments(lGeo, lMat)
      scene.add(lines)

      /* ── Mouse ────────────────────────────────────────────── */
      const mouse = { x: 0, y: 0 }
      const onMove = (e: MouseEvent) => {
        mouse.x =  (e.clientX / window.innerWidth  - 0.5)
        mouse.y = -(e.clientY / window.innerHeight - 0.5)
      }
      window.addEventListener('mousemove', onMove, { passive: true })

      onReady?.()

      /* ── Scroll ───────────────────────────────────────────── */
      let scroll = 0
      const onScroll = () => {
        scroll = Math.min(window.scrollY / window.innerHeight, 1)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      /* ── RAF loop ─────────────────────────────────────────── */
      const animate = () => {
        raf = requestAnimationFrame(animate)

        // Drift
        for (let i = 0; i < COUNT; i++) {
          pos[i*3]   += vel[i*3]
          pos[i*3+1] += vel[i*3+1]
          if (pos[i*3]   >  5) pos[i*3]   = -5
          if (pos[i*3]   < -5) pos[i*3]   =  5
          if (pos[i*3+1] >  3) pos[i*3+1] = -3
          if (pos[i*3+1] < -3) pos[i*3+1] =  3
        }
        pAttr.needsUpdate = true

        // Connection lines
        let lineIdx = 0
        for (let a = 0; a < COUNT; a++) {
          for (let b = a + 1; b < COUNT; b++) {
            const dx = pos[a*3] - pos[b*3]
            const dy = pos[a*3+1] - pos[b*3+1]
            if (dx*dx + dy*dy < CONNECT * CONNECT) {
              linePos[lineIdx++] = pos[a*3]
              linePos[lineIdx++] = pos[a*3+1]
              linePos[lineIdx++] = pos[a*3+2]
              linePos[lineIdx++] = pos[b*3]
              linePos[lineIdx++] = pos[b*3+1]
              linePos[lineIdx++] = pos[b*3+2]
            }
          }
        }
        lGeo.setDrawRange(0, lineIdx / 3)
        lAttr.needsUpdate = true

        // Camera parallax + scroll fade-up
        camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.04
        camera.position.z  = 4.5 - scroll * 1.5

        renderer.render(scene, camera)
      }
      animate()

      /* ── Resize ───────────────────────────────────────────── */
      const onResize = () => {
        const W = window.innerWidth, H = window.innerHeight
        renderer.setSize(W, H, false)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

    }).catch(e => console.error('[HeroGL] Three.js failed:', e))

    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="hero-gl" />
}
