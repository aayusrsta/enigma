import type * as T from 'three'
import type { Platform, Project } from '@/data/projects'
import { buildLaptop, buildPhone, type Device } from './devices'
import { ScreenDisplay } from './screen'

export interface StageCallbacks {
  onSelectPlatform: (p: Platform) => void
  onOpenProject: () => void
}

export interface StageApi {
  setPlatform: (p: Platform) => void
  /** Shows a project on its device; `shot` picks the screenshot, `dir` the slide direction. */
  show: (p: Project | undefined, shot: number, dir: number) => void
  dispose: () => void
}

/** Width/height of the phone's glass at its default height. */
const PHONE_ASPECT = 0.73 / 1.59
const HALF_FOV = Math.tan((17.5 * Math.PI) / 180)

interface Pose {
  x: number; y: number; z: number
  ry: number; scale: number
  /** 1 = in focus, 0 = parked in the background. */
  active: number
  lid: number
}

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))

function radialTexture(THREE: typeof import('three'), inner: string, outer: string, size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Floor grid that fades out from the centre, matching the hero's grid. */
function floorTexture(THREE: typeof import('three')) {
  const size = 1024
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const cells = 24
  g.strokeStyle = 'rgba(255,255,255,0.06)'
  g.lineWidth = 2
  for (let i = 0; i <= cells; i++) {
    const p = (i / cells) * size
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, size); g.stroke()
    g.beginPath(); g.moveTo(0, p); g.lineTo(size, p); g.stroke()
  }
  g.globalCompositeOperation = 'destination-in'
  const fade = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  fade.addColorStop(0, 'rgba(0,0,0,1)')
  fade.addColorStop(0.55, 'rgba(0,0,0,0.5)')
  fade.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = fade
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export async function createStage(mount: HTMLElement, cb: StageCallbacks): Promise<StageApi> {
  const THREE = await import('three')
  const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js')
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
  if (document.fonts?.ready) await document.fonts.ready

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.domElement.className = 'stage-canvas'
  mount.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.environmentIntensity = 0.55

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60)

  /* Lights: a soft key with shadows, and a rim light that takes the project's colour. */
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(2.5, 6, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -6
  key.shadow.camera.right = 6
  key.shadow.camera.top = 6
  key.shadow.camera.bottom = -6
  key.shadow.radius = 6
  key.shadow.bias = -0.0005
  scene.add(key)
  const rim = new THREE.PointLight(0xffffff, 18, 12, 1.6)
  rim.position.set(-2.5, 2.6, -2)
  scene.add(rim)
  scene.add(new THREE.AmbientLight(0xffffff, 0.15))

  /* Floor: grid, a coloured pool of light, and real shadows. */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 22),
    new THREE.MeshBasicMaterial({ map: floorTexture(THREE), transparent: true, depthWrite: false }),
  )
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  const poolMat = new THREE.MeshBasicMaterial({
    map: radialTexture(THREE, 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35,
  })
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), poolMat)
  pool.rotation.x = -Math.PI / 2
  pool.position.y = 0.002
  scene.add(pool)

  const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), new THREE.ShadowMaterial({ opacity: 0.5 }))
  shadowCatcher.rotation.x = -Math.PI / 2
  shadowCatcher.position.y = 0.003
  shadowCatcher.receiveShadow = true
  scene.add(shadowCatcher)

  // Glow behind the focused device, tinted to the project.
  const haloMat = new THREE.SpriteMaterial({
    map: radialTexture(THREE, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.28,
  })
  const halo = new THREE.Sprite(haloMat)
  halo.scale.set(5.5, 5.5, 1)
  scene.add(halo)

  /* Devices */
  // Full-resolution screens: 4K for the laptop on large displays, 2K on phones and tablets.
  const maxTex = renderer.capabilities.maxTextureSize
  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const smallDevice = Math.min(window.screen.width, window.screen.height) < 820
  let phoneK = 1
  let phoneKTarget = 1
  const phoneScreen = new ScreenDisplay(THREE, renderer, {
    kind: 'phone',
    aspect: PHONE_ASPECT,
    maxWidth: Math.min(maxTex, 1440),
    anisotropy,
    onAspect: a => { phoneKTarget = PHONE_ASPECT / a },
  })
  const laptopScreen = new ScreenDisplay(THREE, renderer, {
    kind: 'laptop',
    aspect: 1.6,
    maxWidth: Math.min(maxTex, smallDevice ? 2048 : 3840),
    anisotropy,
  })
  const phone = buildPhone(THREE, RoundedBoxGeometry, phoneScreen.material)
  const laptop = buildLaptop(THREE, RoundedBoxGeometry, laptopScreen.material)
  scene.add(phone.group, laptop.group)

  const devices: Record<Platform, { d: Device; pose: Pose; screen: ScreenDisplay; lift: number }> = {
    mobile: { d: phone, screen: phoneScreen, lift: 0, pose: { x: 0, y: -1.2, z: 0, ry: 0, scale: 0.6, active: 0, lid: 0 } },
    web: { d: laptop, screen: laptopScreen, lift: 0, pose: { x: 0, y: -1.2, z: 0, ry: 0, scale: 0.6, active: 0, lid: Math.PI / 2 } },
  }

  let platform: Platform = 'mobile'
  let entered = false
  /** Recomputed on resize so the devices always fit beside (or above) the panel. */
  const layout = { wide: true, camZ: 6.4, aspect: 1.6, centerNdc: -0.4, phoneScale: 1.4, laptopScale: 1 }
  const accent = new THREE.Color(0xffffff)
  const accentTarget = new THREE.Color(0xffffff)

  /** Half the visible width of the scene at depth z. */
  const halfWidthAt = (z: number) => (layout.camZ - z) * HALF_FOV * layout.aspect
  const halfHeightAt = (z: number) => (layout.camZ - z) * HALF_FOV

  /** Where each device should be for the current platform and screen size. */
  function target(which: Platform): Pose {
    const focused = which === platform
    const { wide } = layout
    if (which === 'mobile') {
      const z = focused ? 0.6 : -3
      const scale = focused ? layout.phoneScale : 1
      const x = focused
        ? layout.centerNdc * halfWidthAt(z)
        : wide ? layout.centerNdc * halfWidthAt(0.6) - 3.6 : halfWidthAt(z) * 0.55
      return { x, y: 0.03 + phone.halfHeight * scale, z, ry: focused ? 0.22 : wide ? 0.55 : -0.5, scale, active: focused ? 1 : 0, lid: 0 }
    }
    const z = focused ? 0.25 : -3.6
    const x = focused
      ? layout.centerNdc * halfWidthAt(z)
      : wide ? layout.centerNdc * halfWidthAt(0.6) - 2.1 : halfWidthAt(z) * 0.6
    return focused
      ? { x, y: 0, z, ry: wide ? 0.3 : 0.12, scale: layout.laptopScale, active: 1, lid: -0.24 }
      : { x, y: 0, z, ry: wide ? 0.6 : -0.6, scale: 0.9, active: 0, lid: 1.25 }
  }

  /* Sizing */
  const resize = () => {
    const w = mount.clientWidth
    const h = mount.clientHeight
    if (!w || !h) return
    const wide = w >= 900
    renderer.setSize(w, h, false)
    const aspect = w / h
    // Far enough back that a laptop (2.75 wide) always fits the width.
    const camZ = Math.max(wide ? 6.4 : 6.8, 1.75 / (HALF_FOV * aspect) + 0.25)
    camera.aspect = aspect
    camera.position.set(0, 1.85, camZ)
    camera.lookAt(0, 1.3, 0)
    camera.updateProjectionMatrix()

    // On wide screens the panel covers the right; centre the device in what's left.
    const panelPx = wide ? Math.min(410, w * 0.38) + 56 : 0
    const freeFrac = 1 - panelPx / w
    Object.assign(layout, { wide, camZ, aspect, centerNdc: wide ? -1 + freeFrac : 0 })
    const freeHalf = halfWidthAt(0.25) * freeFrac
    layout.laptopScale = Math.min(0.95, (freeHalf * 2 * 0.8) / 2.75)
    // The phone is sized by height, leaving room for the switch above it.
    layout.phoneScale = Math.min(1.45, (halfHeightAt(0.6) * 2 * (wide ? 0.66 : 0.7)) / 1.66, (freeHalf * 2 * 0.7) / 0.8)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(mount)
  resize()

  /* Pointer: tilt toward the cursor, drag to spin, click to open or switch. */
  const pointer = { x: 0, y: 0, down: false, startX: 0, lastX: 0, spin: 0, spinVel: 0, moved: 0 }
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()

  const hitDevice = (e: PointerEvent): Platform | null => {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hits = ray.intersectObjects([phone.group, laptop.group], true)
    if (!hits.length) return null
    let o: T.Object3D | null = hits[0].object
    while (o) {
      if (o === phone.group) return 'mobile'
      if (o === laptop.group) return 'web'
      o = o.parent
    }
    return null
  }

  const onMove = (e: PointerEvent) => {
    const r = mount.getBoundingClientRect()
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
    if (pointer.down) {
      const dx = e.clientX - pointer.lastX
      pointer.lastX = e.clientX
      pointer.moved += Math.abs(dx)
      pointer.spin += dx * 0.012
      pointer.spinVel = dx * 0.012
    } else if (e.pointerType === 'mouse') {
      const hit = hitDevice(e)
      mount.dataset.hover = hit ? (hit === platform ? 'focus' : 'other') : ''
      for (const k of ['mobile', 'web'] as Platform[]) devices[k].lift = hit === k && k !== platform ? 1 : 0
    }
  }
  const onDown = (e: PointerEvent) => {
    pointer.down = true
    pointer.startX = pointer.lastX = e.clientX
    pointer.moved = 0
  }
  const onUp = (e: PointerEvent) => {
    if (!pointer.down) return
    pointer.down = false
    if (pointer.moved < 6) {
      const hit = hitDevice(e)
      if (hit && hit !== platform) cb.onSelectPlatform(hit)
      else if (hit === platform) cb.onOpenProject()
    }
  }
  const onLeave = () => {
    pointer.x = pointer.y = 0
    mount.dataset.hover = ''
    devices.mobile.lift = devices.web.lift = 0
  }
  mount.addEventListener('pointermove', onMove)
  mount.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  mount.addEventListener('pointerleave', onLeave)

  /* Render only while on screen. */
  let visible = false
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) {
      entered = true
      start()
    }
  }, { threshold: 0.05 })
  io.observe(mount)

  const timer = new THREE.Timer()
  let raf = 0
  let running = false
  let time = 0

  function apply(which: Platform, dt: number) {
    const entry = devices[which]
    if (which === 'mobile') {
      phoneK = damp(phoneK, phoneKTarget, 5, dt)
      phone.setHeight?.(phoneK)
    }
    const goal = entered ? target(which) : entry.pose
    const p = entry.pose
    const k = reduceMotion ? 30 : 4.2
    p.x = damp(p.x, goal.x, k, dt)
    p.y = damp(p.y, goal.y + entry.lift * 0.12, k, dt)
    p.z = damp(p.z, goal.z, k, dt)
    p.scale = damp(p.scale, goal.scale, k, dt)
    p.active = damp(p.active, goal.active, 5, dt)
    p.lid = damp(p.lid, goal.lid, reduceMotion ? 30 : 2.6, dt)

    const focused = which === platform
    const float = focused && !reduceMotion && which === 'mobile' ? Math.sin(time * 1.3) * 0.035 : 0
    const tiltY = focused ? pointer.x * 0.28 + pointer.spin : 0
    const tiltX = focused ? pointer.y * 0.1 : 0
    p.ry = damp(p.ry, goal.ry + tiltY, focused ? 6 : k, dt)

    const g = entry.d.group
    g.position.set(p.x, p.y + float, p.z)
    g.scale.setScalar(p.scale)
    g.rotation.set(damp(g.rotation.x, tiltX, 6, dt), p.ry, 0)
    if (entry.d.lid) entry.d.lid.rotation.x = p.lid

    entry.screen.dim = 0.22 + 0.78 * p.active
    for (const m of entry.d.frames) m.envMapIntensity = 0.45 + 0.75 * p.active
  }

  function frame(now?: number) {
    raf = requestAnimationFrame(frame)
    timer.update(now)
    const dt = Math.min(timer.getDelta(), 1 / 20)
    time += dt

    // Let a spin coast, then spring back to facing the viewer.
    if (!pointer.down) {
      pointer.spin += pointer.spinVel
      pointer.spinVel *= 0.9
      pointer.spin = damp(pointer.spin, 0, 2.2, dt)
    }

    apply('mobile', dt)
    apply('web', dt)

    const f = devices[platform].pose
    accent.lerp(accentTarget, 1 - Math.exp(-3 * dt))
    rim.color.copy(accent)
    poolMat.color.copy(accent)
    haloMat.color.copy(accent)
    pool.position.x = damp(pool.position.x, f.x, 4, dt)
    pool.position.z = damp(pool.position.z, f.z, 4, dt)
    halo.position.set(f.x - 0.1, platform === 'mobile' ? 1.1 : 1.0, f.z - 1.2)
    rim.position.set(f.x - 2.2, 2.6, f.z - 1.8)

    phoneScreen.update(dt)
    laptopScreen.update(dt)
    renderer.render(scene, camera)

    if (!visible) stop()
  }
  function start() {
    if (running) return
    running = true
    timer.reset()
    frame()
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }
  const onVisibility = () => (document.hidden ? stop() : visible && start())
  document.addEventListener('visibilitychange', onVisibility)

  return {
    setPlatform(p) {
      platform = p
      mount.dataset.platform = p
    },
    show(project, shot, dir) {
      if (!project) return
      accentTarget.set(project.color)
      devices[project.platform].screen.show(project, shot, dir)
    },
    dispose() {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      mount.removeEventListener('pointerleave', onLeave)
      phoneScreen.dispose()
      laptopScreen.dispose()
      scene.traverse(o => {
        const mesh = o as T.Mesh
        mesh.geometry?.dispose()
        const mat = mesh.material as T.Material | T.Material[] | undefined
        ;(Array.isArray(mat) ? mat : mat ? [mat] : []).forEach(m => m.dispose())
      })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
