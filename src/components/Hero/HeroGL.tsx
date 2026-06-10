'use client'
import { useEffect, useRef } from 'react'
import './HeroGL.css'

const VERT = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseStr;
  uniform float uAmplitude;
  varying float vElev;
  varying vec2  vUv;

  float hash(vec2 p){
    return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
  }
  float vnoise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    vec2 u=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.,a=.55;
    mat2 m=mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){v+=a*vnoise(p);p=m*p;a*=.5;}
    return v;
  }

  void main(){
    vUv = uv;
    vec3 pos = position;
    float n = fbm(pos.xy*.7+uTime*.05)*.65
            + fbm(pos.xy*1.4+uTime*.08)*.22
            + fbm(pos.xy*2.8+uTime*.04)*.13;
    vec2 d = pos.xy - uMouse;
    float bump = exp(-dot(d,d)*0.7) * uMouseStr;
    pos.z = (n*2.-1.) * uAmplitude + bump;
    vElev = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
  }
`

const FRAG = /* glsl */`
  uniform float uAmplitude;
  varying float vElev;
  varying vec2  vUv;

  void main(){
    float t = clamp((vElev/uAmplitude)*.5+.5, 0., 1.);
    t = pow(t, 1.8);

    vec3 deep = vec3(0.04, 0.04, 0.05);
    vec3 mid  = vec3(0.16, 0.16, 0.20);
    vec3 peak = vec3(0.55, 0.55, 0.68);   // bright — clearly visible

    vec3 col = mix(deep, mid,  smoothstep(0.0, 0.55, t));
        col  = mix(col,  peak, smoothstep(0.45, 1.0, t));

    // Glowing bottom-edge rim — becomes the curved horizon arc on scroll
    float rim = 1. - smoothstep(0., 0.06, vUv.y);
    col = mix(col, vec3(1.0, 1.0, 1.2), rim);

    gl_FragColor = vec4(col, 1.);
  }
`

interface Props { onReady?: () => void }

export default function HeroGL({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf: number
    let cleanupFn: (() => void) | undefined

    ;(async () => {
      try {
        const THREE = await import('three')

        const W = canvas.clientWidth  || window.innerWidth
        const H = canvas.clientHeight || window.innerHeight

        /* ── Renderer ─────────────────────────────────────── */
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          powerPreference: 'high-performance',
        })
        renderer.setClearColor(0x080808)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(W, H, false)

        /* ── Scene + Camera ───────────────────────────────── */
        const scene  = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
        camera.position.z = 3

        /* ── Geometry + shader ───────────────────────────── */
        const isMobile = W < 768
        const [sw, sh] = isMobile ? [48, 28] : [100, 60]
        const geo = new THREE.PlaneGeometry(9, 6, sw, sh)

        const uniforms = {
          uTime:      { value: 0 },
          uMouse:     { value: new THREE.Vector2(99, 99) },
          uMouseStr:  { value: 0 },
          uAmplitude: { value: 0 },
        }
        const mat  = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
        const mesh = new THREE.Mesh(geo, mat)
        scene.add(mesh)

        onReady?.()

        /* ── Mouse ────────────────────────────────────────── */
        const ray    = new THREE.Raycaster()
        const ndc    = new THREE.Vector2()
        const plane  = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        const target = new THREE.Vector3()
        let targetStr = 0

        const onMouseMove = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect()
          ndc.set((e.clientX-r.left)/r.width*2-1, -((e.clientY-r.top)/r.height*2-1))
          ray.setFromCamera(ndc, camera)
          ray.ray.intersectPlane(plane, target)
          uniforms.uMouse.value.set(target.x, target.y)
          targetStr = 1
        }
        const onMouseLeave = () => { targetStr = 0 }
        canvas.addEventListener('mousemove',  onMouseMove, { passive: true })
        canvas.addEventListener('mouseleave', onMouseLeave)

        /* ── Scroll ───────────────────────────────────────── */
        let scrollRatio = 0
        const onScroll = () => {
          scrollRatio = Math.min(window.scrollY / (window.innerHeight * 0.75), 1)
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        /* ── Animate ──────────────────────────────────────── */
        const TARGET_AMP = 0.42
        let t = 0, introT = 0

        const animate = () => {
          raf = requestAnimationFrame(animate)
          t += 0.01
          introT = Math.min(introT + 0.005, 1)
          uniforms.uAmplitude.value = TARGET_AMP * introT * introT * (3 - 2 * introT)
          uniforms.uTime.value      = t
          uniforms.uMouseStr.value += (targetStr * uniforms.uAmplitude.value * 1.0 - uniforms.uMouseStr.value) * 0.06

          // Scroll: negative rotation → bottom edge tilts toward camera
          mesh.rotation.x = -scrollRatio * 0.72
          mesh.position.y =  scrollRatio * 0.55

          renderer.render(scene, camera)
        }
        animate()

        /* ── Resize ───────────────────────────────────────── */
        const onResize = () => {
          const W = canvas.clientWidth, H = canvas.clientHeight
          renderer.setSize(W, H, false)
          camera.aspect = W / H
          camera.updateProjectionMatrix()
        }
        const ro = new ResizeObserver(onResize)
        ro.observe(canvas)

        cleanupFn = () => {
          cancelAnimationFrame(raf)
          canvas.removeEventListener('mousemove',  onMouseMove)
          canvas.removeEventListener('mouseleave', onMouseLeave)
          window.removeEventListener('scroll', onScroll)
          ro.disconnect()
          geo.dispose(); mat.dispose(); renderer.dispose()
        }
      } catch (err) {
        console.error('[HeroGL]', err)
      }
    })()

    return () => cleanupFn?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="hero-gl" />
}
