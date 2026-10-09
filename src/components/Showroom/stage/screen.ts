import type * as T from 'three'
import type { Project } from '@/data/projects'

type Three = typeof import('three')
export type ScreenKind = 'phone' | 'laptop'

/* ── Splash for projects without screenshots ─────────────────────────── */

const imageCache = new Map<string, Promise<HTMLImageElement | null>>()

/** Loads once per URL; a missing image resolves to null. */
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  let p = imageCache.get(src)
  if (!p) {
    p = new Promise(resolve => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = src
    })
    imageCache.set(src, p)
  }
  return p
}

function fontFamily(variable: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  return v ? `${v}, ${fallback}` : fallback
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + (amount < 0 ? c : 255 - c) * amount)))
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`
}

/**
 * A designed screen for projects without screenshots: the app's colour, its
 * icon (or monogram), name and owner, over skeleton rows that read as UI.
 * Drawn in layout units (w × h) on a canvas `scale` times larger.
 */
async function paintSplash(g: CanvasRenderingContext2D, w: number, h: number, p: Project, kind: ScreenKind) {
  const title = fontFamily('--font-title', 'Poppins, sans-serif')
  const mono = fontFamily('--font-mono', 'monospace')
  const bg = g.createLinearGradient(0, 0, w * 0.4, h)
  bg.addColorStop(0, shade(p.color, -0.35))
  bg.addColorStop(0.55, shade(p.color, -0.82))
  bg.addColorStop(1, '#060608')
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)

  g.strokeStyle = 'rgba(255,255,255,0.045)'
  g.lineWidth = 1
  const step = kind === 'phone' ? 36 : 48
  for (let x = 0; x < w; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke() }
  for (let y = 0; y < h; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke() }

  let top = 0
  if (kind === 'laptop') {
    g.fillStyle = 'rgba(0,0,0,0.45)'
    g.fillRect(0, 0, w, 54)
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath(); g.arc(28 + i * 22, 27, 7, 0, Math.PI * 2); g.fill()
    })
    g.fillStyle = 'rgba(255,255,255,0.08)'
    g.beginPath(); g.roundRect(w * 0.3, 14, w * 0.4, 26, 13); g.fill()
    g.fillStyle = 'rgba(255,255,255,0.55)'
    g.font = `500 14px ${mono}`
    g.textAlign = 'center'
    g.fillText(p.url.startsWith('http') ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${p.id}.internal`, w / 2, 32)
    top = 54
  }

  const cx = w / 2
  const iconSize = kind === 'phone' ? 150 : 132
  const iconY = kind === 'phone' ? h * 0.24 : top + (h - top) * 0.2
  const icon = p.icon ? await loadImage(p.icon) : null
  g.save()
  g.beginPath()
  g.roundRect(cx - iconSize / 2, iconY, iconSize, iconSize, iconSize * 0.24)
  g.closePath()
  g.shadowColor = 'rgba(0,0,0,0.5)'
  g.shadowBlur = 40
  g.fillStyle = p.color
  g.fill()
  g.shadowBlur = 0
  g.clip()
  if (icon) {
    g.imageSmoothingQuality = 'high'
    g.drawImage(icon, cx - iconSize / 2, iconY, iconSize, iconSize)
  } else {
    const grad = g.createLinearGradient(cx - iconSize / 2, iconY, cx + iconSize / 2, iconY + iconSize)
    grad.addColorStop(0, shade(p.color, 0.25))
    grad.addColorStop(1, shade(p.color, -0.3))
    g.fillStyle = grad
    g.fillRect(cx - iconSize / 2, iconY, iconSize, iconSize)
    g.fillStyle = '#fff'
    g.font = `800 ${iconSize * 0.42}px ${title}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const initials = p.name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase()
    g.fillText(initials, cx, iconY + iconSize / 2 + 4)
    g.textBaseline = 'alphabetic'
  }
  g.restore()

  g.textAlign = 'center'
  g.fillStyle = '#ffffff'
  g.font = `700 ${kind === 'phone' ? 46 : 52}px ${title}`
  g.fillText(p.name, cx, iconY + iconSize + 76)
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `400 ${kind === 'phone' ? 18 : 17}px ${mono}`
  g.fillText(p.client.toUpperCase(), cx, iconY + iconSize + 112)

  const rowsTop = iconY + iconSize + 160
  const rowW = kind === 'phone' ? w - 80 : w * 0.46
  const left = cx - rowW / 2
  if (p.id.includes('rocketchat')) {
    const bubbles: [number, number, boolean][] = [[0.62, 58, false], [0.48, 58, true], [0.7, 84, false], [0.4, 58, true]]
    let y = rowsTop
    for (const [frac, bh, mine] of bubbles) {
      const bw = rowW * frac
      g.fillStyle = mine ? p.color : 'rgba(255,255,255,0.1)'
      g.beginPath(); g.roundRect(mine ? left + rowW - bw : left, y, bw, bh, 22); g.fill()
      y += bh + 18
    }
  } else {
    let y = rowsTop
    for (let i = 0; i < (kind === 'phone' ? 4 : 3); i++) {
      g.fillStyle = 'rgba(255,255,255,0.06)'
      g.beginPath(); g.roundRect(left, y, rowW, 70, 18); g.fill()
      g.fillStyle = 'rgba(255,255,255,0.12)'
      g.beginPath(); g.roundRect(left + 18, y + 18, 34, 34, 10); g.fill()
      g.fillStyle = 'rgba(255,255,255,0.14)'
      g.beginPath(); g.roundRect(left + 68, y + 20, rowW * (0.5 - i * 0.07), 12, 6); g.fill()
      g.fillStyle = 'rgba(255,255,255,0.07)'
      g.beginPath(); g.roundRect(left + 68, y + 40, rowW * (0.32 + i * 0.05), 10, 5); g.fill()
      y += 86
    }
  }

  const badge = p.inProgress ? 'IN DEVELOPMENT' : p.url === '#' ? 'INTERNAL APP' : ''
  if (badge) {
    g.font = `700 15px ${mono}`
    const bw = g.measureText(badge).width + 36
    const by = h - (kind === 'phone' ? 120 : 70)
    g.fillStyle = 'rgba(0,0,0,0.45)'
    g.strokeStyle = 'rgba(255,255,255,0.25)'
    g.beginPath(); g.roundRect(cx - bw / 2, by, bw, 34, 17); g.fill(); g.stroke()
    g.fillStyle = 'rgba(255,255,255,0.85)'
    g.fillText(badge, cx, by + 22)
  }
}

/* ── Screen material ─────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Two images and a progress value. The phone slides the next screen in
// like an app switch; the laptop does a soft zoom-fade. Each image carries
// its own cover-fit transform (scale.xy, offset.zw) so nothing is stretched.
const fragmentShader = /* glsl */ `
  uniform sampler2D mapA;
  uniform sampler2D mapB;
  uniform vec4 uvA;
  uniform vec4 uvB;
  uniform float progress;
  uniform float slide;
  uniform float dir;
  uniform float dim;
  varying vec2 vUv;

  vec4 sampleCover(sampler2D map, vec4 t, vec2 uv) {
    return texture2D(map, clamp(uv, 0.0, 1.0) * t.xy + t.zw);
  }

  void main() {
    float p = progress;
    vec4 c;
    if (slide > 0.5) {
      // dir > 0: next screen rises from the bottom; dir < 0: drops from the top.
      float y = dir > 0.0 ? vUv.y : 1.0 - vUv.y;
      vec2 uvNext = vec2(vUv.x, dir > 0.0 ? vUv.y + 1.0 - p : vUv.y - 1.0 + p);
      vec2 uvPrev = vec2(vUv.x, dir > 0.0 ? vUv.y - p * 0.25 : vUv.y + p * 0.25);
      if (y < p) {
        c = sampleCover(mapB, uvB, uvNext);
      } else {
        c = sampleCover(mapA, uvA, uvPrev);
        float shadow = smoothstep(0.0, 0.05, y - p);
        c.rgb *= (1.0 - 0.45 * p) * mix(0.5, 1.0, shadow);
      }
    } else {
      vec4 a = sampleCover(mapA, uvA, vUv);
      vec2 zoomed = (vUv - 0.5) / (1.05 - 0.05 * p) + 0.5;
      vec4 b = sampleCover(mapB, uvB, zoomed);
      c = mix(a, b, p);
    }
    gl_FragColor = vec4(c.rgb * dim, 1.0);
    #include <colorspace_fragment>
  }
`

interface Entry {
  tex: T.Texture
  aspect: number
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export interface ScreenOptions {
  kind: ScreenKind
  /** Width/height of the screen surface; for the phone, the default it morphs from. */
  aspect: number
  /** Largest texture width to upload (source images are downscaled above this). */
  maxWidth: number
  anisotropy: number
  /** Called when a new image wants a different screen shape (phone only). */
  onAspect?: (aspect: number) => void
}

/**
 * One device screen. Every screenshot becomes its own GPU texture at full
 * resolution (up to `maxWidth`), with mipmaps and maximum anisotropy so it
 * stays sharp at an angle. Transitions run in the shader, so nothing is
 * redrawn on the CPU per frame.
 */
export class ScreenDisplay {
  readonly material: T.ShaderMaterial
  private readonly cache = new Map<string, Promise<Entry | null>>()
  private readonly order: string[] = []
  private current: Entry
  private next: Entry | null = null
  private t = 1
  private token = 0
  private screenAspect: number

  constructor(private readonly THREE: Three, private readonly renderer: T.WebGLRenderer, private readonly opts: ScreenOptions) {
    const black = new THREE.DataTexture(new Uint8Array([6, 6, 8, 255]), 1, 1)
    black.colorSpace = THREE.SRGBColorSpace
    black.needsUpdate = true
    this.current = { tex: black, aspect: opts.aspect }
    this.screenAspect = opts.aspect
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        mapA: { value: black },
        mapB: { value: black },
        uvA: { value: new THREE.Vector4(1, 1, 0, 0) },
        uvB: { value: new THREE.Vector4(1, 1, 0, 0) },
        progress: { value: 0 },
        slide: { value: opts.kind === 'phone' ? 1 : 0 },
        dir: { value: 1 },
        dim: { value: 1 },
      },
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  }

  set dim(v: number) {
    this.material.uniforms.dim.value = v
  }

  /** Cover-fit, top-anchored: fills the screen, crops overflow, keeps status bars. */
  private cover(imageAspect: number, out: T.Vector4) {
    const s = this.screenAspect
    if (imageAspect > s) {
      const sx = s / imageAspect
      out.set(sx, 1, (1 - sx) / 2, 0)
    } else {
      const sy = imageAspect / s
      out.set(1, sy, 0, 1 - sy)
    }
  }

  private prepare(tex: T.Texture) {
    const THREE = this.THREE
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = this.opts.anisotropy
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    tex.needsUpdate = true
    // Upload now so the first frame of the transition doesn't stall.
    this.renderer.initTexture(tex)
    return tex
  }

  private async loadPhoto(src: string): Promise<Entry | null> {
    const THREE = this.THREE
    try {
      const blob = await (await fetch(src)).blob()
      let bmp = await createImageBitmap(blob)
      const aspect = bmp.width / bmp.height
      const opts: ImageBitmapOptions = { imageOrientation: 'flipY' }
      if (bmp.width > this.opts.maxWidth) {
        Object.assign(opts, {
          resizeWidth: this.opts.maxWidth,
          resizeHeight: Math.round(this.opts.maxWidth / aspect),
          resizeQuality: 'high',
        })
      }
      const flipped = await createImageBitmap(bmp, opts)
      bmp.close()
      bmp = flipped
      const tex = new THREE.Texture(bmp)
      tex.flipY = false
      return { tex: this.prepare(tex), aspect }
    } catch {
      // Older Safari: fall back to a plain image element.
      const img = await loadImage(src)
      if (!img) return null
      return { tex: this.prepare(new THREE.Texture(img)), aspect: img.naturalWidth / img.naturalHeight }
    }
  }

  private async loadSplash(p: Project): Promise<Entry> {
    const THREE = this.THREE
    const [w, h] = this.opts.kind === 'phone' ? [560, Math.round(560 / this.opts.aspect)] : [1440, 900]
    const scale = this.opts.kind === 'phone' ? 2.4 : 2.4
    const c = document.createElement('canvas')
    c.width = Math.round(w * scale)
    c.height = Math.round(h * scale)
    const g = c.getContext('2d')!
    g.scale(scale, scale)
    await paintSplash(g, w, h, p, this.opts.kind)
    return { tex: this.prepare(new THREE.CanvasTexture(c)), aspect: w / h }
  }

  private get(key: string, load: () => Promise<Entry | null>) {
    let e = this.cache.get(key)
    if (!e) {
      e = load()
      this.cache.set(key, e)
    }
    const i = this.order.indexOf(key)
    if (i >= 0) this.order.splice(i, 1)
    this.order.push(key)
    this.evict()
    return e
  }

  /** Keeps GPU memory bounded: drop the least recently used textures not on screen. */
  private evict() {
    const limit = this.opts.kind === 'phone' ? 8 : 4
    while (this.order.length > limit) {
      const key = this.order.shift()!
      const e = this.cache.get(key)
      this.cache.delete(key)
      e?.then(entry => {
        if (entry && entry !== this.current && entry !== this.next) entry.tex.dispose()
      })
    }
  }

  /** Shows a project's screenshot (or splash); stale calls are dropped. */
  async show(p: Project | undefined, shot = 0, dir = 1) {
    if (!p) return
    const token = ++this.token
    const src = p.screenshots?.length ? p.screenshots[shot % p.screenshots.length] : undefined
    const entry = src
      ? await this.get(src, () => this.loadPhoto(src))
      : await this.get(`splash:${p.id}`, () => this.loadSplash(p))
    if (token !== this.token || !entry || entry === this.current) return

    // The phone reshapes to the image so it fills the glass exactly.
    if (this.opts.kind === 'phone') {
      this.screenAspect = Math.min(0.6, Math.max(0.43, entry.aspect))
      this.opts.onAspect?.(this.screenAspect)
    }
    // A transition already running finishes instantly before the next begins.
    if (this.next) this.settle()
    const u = this.material.uniforms
    this.cover(this.current.aspect, u.uvA.value)
    this.cover(entry.aspect, u.uvB.value)
    u.mapB.value = entry.tex
    u.dir.value = dir
    u.progress.value = 0
    this.next = entry
    this.t = 0
  }

  private settle() {
    if (!this.next) return
    const u = this.material.uniforms
    this.current = this.next
    this.next = null
    u.mapA.value = this.current.tex
    u.uvA.value.copy(u.uvB.value)
    u.progress.value = 0
  }

  update(dt: number) {
    if (!this.next) return
    this.t = Math.min(1, this.t + dt / (this.opts.kind === 'phone' ? 0.6 : 0.7))
    this.material.uniforms.progress.value = ease(this.t)
    if (this.t >= 1) this.settle()
  }

  dispose() {
    this.token++
    this.cache.forEach(e => e.then(entry => entry?.tex.dispose()))
    this.cache.clear()
    this.material.dispose()
  }
}
