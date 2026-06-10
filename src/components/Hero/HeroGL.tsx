'use client'
import { useEffect, useRef } from 'react'
import './HeroGL.css'

/* ─────────────────────────── GLSL ─────────────────────────── */
const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;       // world-space
  uniform float uMouseRadius;
  uniform float uMouseStr;
  uniform float uAmplitude;

  varying float vElev;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.55;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p  = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    /* Layered FBM noise */
    float n = fbm(pos.xy * 0.65 + uTime * 0.055) * 0.7
            + fbm(pos.xy * 1.3  + uTime * 0.08 ) * 0.2
            + fbm(pos.xy * 2.6  + uTime * 0.04 ) * 0.1;

    /* Mouse Gaussian bump */
    vec2  d    = pos.xy - uMouse;
    float dist = length(d);
    float bump = exp(-dist * dist / (uMouseRadius * uMouseRadius)) * uMouseStr;

    pos.z  = (n * 2.0 - 1.0) * uAmplitude + bump;
    vElev  = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform float uAmplitude;
  varying float vElev;
  varying vec2  vUv;

  void main() {
    float t = clamp((vElev / uAmplitude) * 0.5 + 0.5, 0.0, 1.0);
    t = pow(t, 2.2);

    vec3 deep = vec3(0.031, 0.031, 0.033);
    vec3 mid  = vec3(0.07,  0.07,  0.08 );
    vec3 peak = vec3(0.18,  0.18,  0.22 );

    vec3 col = mix(deep, mid,  smoothstep(0.0, 0.5, t));
        col  = mix(col,  peak, smoothstep(0.4, 1.0, t));

    // Glowing rim on bottom edge — sweeps in as horizon arc when plane tilts on scroll
    float edgeGlow = 1.0 - smoothstep(0.0, 0.05, vUv.y);
    col = mix(col, vec3(1.1, 1.1, 1.35), edgeGlow);  // >1.0 forces strong bloom

    gl_FragColor = vec4(col, 1.0);
  }
`

/* ──────────────────────────────────────────────────────────── */
interface Props { onReady?: () => void }

export default function HeroGL({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf: number
    let cleanupFn: (() => void) | undefined

    ;(async () => {
      const THREE = await import('three')

      /* ── Renderer ──────────────────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const W = canvas.clientWidth
      const H = canvas.clientHeight
      renderer.setSize(W, H, false)

      /* ── Post-processing (bloom) ───────────────────────────── */
      const { EffectComposer }   = await import('three/addons/postprocessing/EffectComposer.js')
      const { RenderPass }       = await import('three/addons/postprocessing/RenderPass.js')
      const { UnrealBloomPass }  = await import('three/addons/postprocessing/UnrealBloomPass.js')
      const { OutputPass }       = await import('three/addons/postprocessing/OutputPass.js')

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
      camera.position.set(0, 0, 3)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(W, H),
        0.28,   // strength
        0.6,    // radius
        0.05,   // threshold — glow starts early
      )
      composer.addPass(bloom)
      composer.addPass(new OutputPass())

      /* ── Geometry + material ───────────────────────────────── */
      const isMobile = W < 768
      const segs = isMobile ? [50, 30] : [110, 65]
      const geo  = new THREE.PlaneGeometry(9, 6, segs[0], segs[1])

      const uniforms = {
        uTime:        { value: 0 },
        uMouse:       { value: new THREE.Vector2(99, 99) },   // start off-screen
        uMouseRadius: { value: 0.85 },
        uMouseStr:    { value: 0 },
        uAmplitude:   { value: 0 },   // starts 0, ramps up
      }

      const mat  = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
      const mesh = new THREE.Mesh(geo, mat)
      scene.add(mesh)

      /* ── Mouse → world-space ───────────────────────────────── */
      const plane  = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) // z=0 plane
      const ray    = new THREE.Raycaster()
      const ndc    = new THREE.Vector2()
      const target = new THREE.Vector3()

      let targetStr = 0

      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        ndc.set(
          (e.clientX - rect.left)  / rect.width  * 2 - 1,
          -((e.clientY - rect.top) / rect.height * 2 - 1),
        )
        ray.setFromCamera(ndc, camera)
        ray.ray.intersectPlane(plane, target)
        uniforms.uMouse.value.set(target.x, target.y)
        targetStr = 1
      }
      const onMouseLeave = () => { targetStr = 0 }

      canvas.addEventListener('mousemove',  onMouseMove, { passive: true })
      canvas.addEventListener('mouseleave', onMouseLeave)

      /* ── Scroll → camera tilt ──────────────────────────────── */
      let scrollRatio = 0
      const onScroll = () => {
        scrollRatio = Math.min(window.scrollY / (window.innerHeight * 0.75), 1)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      /* ── Intro ramp (0 → target amplitude over ~1.8 s) ─────── */
      const TARGET_AMP = 0.38
      onReady?.()

      /* ── RAF loop ──────────────────────────────────────────── */
      let t = 0
      let introT = 0

      const animate = () => {
        raf = requestAnimationFrame(animate)
        t += 0.01

        // Ease amplitude in on load
        introT = Math.min(introT + 0.006, 1)
        const amp = TARGET_AMP * (introT < 1 ? introT * introT * (3 - 2 * introT) : 1)
        uniforms.uAmplitude.value = amp
        uniforms.uTime.value      = t

        // Mouse strength lerp
        uniforms.uMouseStr.value += (targetStr * amp * 1.1 - uniforms.uMouseStr.value) * 0.06

        // Negative rotation → bottom edge tilts TOWARD camera → sweeps into viewport
        mesh.rotation.x = -scrollRatio * 0.72
        mesh.position.y  =  scrollRatio * 0.55   // shift up so bottom edge stays in frame

        composer.render()
      }
      animate()

      /* ── Resize ────────────────────────────────────────────── */
      const observer = new ResizeObserver(() => {
        const W = canvas.clientWidth
        const H = canvas.clientHeight
        renderer.setSize(W, H, false)
        composer.setSize(W, H)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      })
      observer.observe(canvas)

      cleanupFn = () => {
        cancelAnimationFrame(raf)
        canvas.removeEventListener('mousemove',  onMouseMove)
        canvas.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('scroll', onScroll)
        observer.disconnect()
        geo.dispose()
        mat.dispose()
        renderer.dispose()
      }
    })()

    return () => cleanupFn?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="hero-gl" />
}
