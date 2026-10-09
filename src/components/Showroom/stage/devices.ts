import type * as T from 'three'

type Three = typeof import('three')
type RoundedBoxCtor = typeof import('three/addons/geometries/RoundedBoxGeometry.js').RoundedBoxGeometry

/** A flat rounded rectangle whose UVs run 0..1 across it, for screens and glass. */
export function roundedRect(THREE: Three, w: number, h: number, r: number, segments = 10) {
  const s = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const geo = new THREE.ShapeGeometry(s, segments)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h)
  }
  uv.needsUpdate = true
  return geo
}

export interface Device {
  group: T.Group
  /** Everything that moves together; the group itself carries the layout transform. */
  body: T.Group
  frames: T.MeshPhysicalMaterial[]
  /** Hinge for the laptop lid (absent on the phone). */
  lid?: T.Group
  /** Phone only: stretch the body vertically (1 = default shape). */
  setHeight?: (k: number) => void
  /** Half the device's current height, for standing it on the floor. */
  halfHeight: number
}

function frameMaterial(THREE: Three, color: number) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.92,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.1,
  })
}

const glassMaterial = (THREE: Three) =>
  new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0.2, roughness: 0.08, clearcoat: 1 })

/** iPhone-like slab: titanium frame, glass front, dynamic island, camera bump. */
export function buildPhone(THREE: Three, RoundedBox: RoundedBoxCtor, screen: T.Material): Device {
  const group = new THREE.Group()
  const body = new THREE.Group()
  group.add(body)

  const W = 0.8, H = 1.66, D = 0.088
  const frame = frameMaterial(THREE, 0x3b3d44)
  const shell = new THREE.Mesh(new RoundedBox(W, H, D, 6, 0.115), frame)
  shell.castShadow = true
  body.add(shell)

  const glass = new THREE.Mesh(roundedRect(THREE, W - 0.024, H - 0.024, 0.104), glassMaterial(THREE))
  glass.position.z = D / 2 + 0.0004
  body.add(glass)

  const display = new THREE.Mesh(roundedRect(THREE, W - 0.07, H - 0.07, 0.086), screen)
  display.position.z = D / 2 + 0.0008
  body.add(display)

  const island = new THREE.Mesh(roundedRect(THREE, 0.2, 0.058, 0.029), new THREE.MeshBasicMaterial({ color: 0x000000 }))
  island.position.set(0, H / 2 - 0.095, D / 2 + 0.0012)
  body.add(island)

  // Side buttons: action + volume on the left, power on the right.
  const btnMat = frame
  // Parts that follow the top edge when the phone changes height, with their base y.
  const anchored: [T.Object3D, number][] = [[island, island.position.y]]
  const btn = (h: number, y: number, side: 1 | -1) => {
    const b = new THREE.Mesh(new RoundedBox(0.014, h, 0.03, 2, 0.006), btnMat)
    b.position.set(side * (W / 2 + 0.004), y, 0)
    body.add(b)
    anchored.push([b, y])
  }
  btn(0.07, 0.48, -1)
  btn(0.13, 0.32, -1)
  btn(0.13, 0.15, -1)
  btn(0.2, 0.3, 1)

  // Camera plateau and lenses on the back.
  const plateau = new THREE.Mesh(new RoundedBox(0.34, 0.34, 0.022, 3, 0.07), frameMaterial(THREE, 0x2c2e33))
  plateau.position.set(-0.17, H / 2 - 0.25, -D / 2 - 0.008)
  body.add(plateau)
  anchored.push([plateau, plateau.position.y])
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0c, metalness: 0.5, roughness: 0.05, clearcoat: 1 })
  const ringMat = frameMaterial(THREE, 0x55585f)
  ;[[-0.075, 0.075], [-0.075, -0.075], [0.075, 0]].forEach(([dx, dy]) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.026, 32), ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(plateau.position.x + dx, plateau.position.y + dy, -D / 2 - 0.022)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.004, 32), lensMat)
    lens.rotation.x = Math.PI / 2
    lens.position.set(ring.position.x, ring.position.y, -D / 2 - 0.036)
    body.add(ring, lens)
    anchored.push([ring, ring.position.y], [lens, lens.position.y])
  })

  const device: Device = {
    group,
    body,
    frames: [frame],
    halfHeight: H / 2,
    // Taller or shorter glass to match the app's screenshots (16:9 vs 19.5:9).
    // Shell, glass and screen stretch; buttons, island and cameras keep their
    // size and stay pinned to the top edge.
    setHeight(k: number) {
      shell.scale.y = glass.scale.y = display.scale.y = k
      const shift = (H / 2) * (k - 1)
      for (const [o, y] of anchored) o.position.y = y + shift
      island.visible = k > 0.9
      device.halfHeight = (H / 2) * k
    },
  }
  return device
}

/** Keys drawn once onto the deck: a function row, four letter rows, and a bottom row with the space bar. */
function keyboardTexture(THREE: Three) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 400
  const g = c.getContext('2d')!
  g.fillStyle = '#26282d'
  g.fillRect(0, 0, c.width, c.height)
  const gap = 9
  const left = 20
  const usable = c.width - left * 2
  const rows: { h: number; units: number[] }[] = [
    { h: 30, units: Array(14).fill(1) },
    { h: 52, units: Array(14).fill(1) },
    { h: 52, units: [1.5, ...Array(12).fill(1), 1.5] },
    { h: 52, units: [1.8, ...Array(11).fill(1), 2.2] },
    { h: 52, units: [2.4, ...Array(10).fill(1), 2.6] },
    { h: 52, units: [1, 1, 1, 1.3, 5.6, 1.3, 1, 1, 1] },
  ]
  let y = 18
  for (const row of rows) {
    const total = row.units.reduce((a, b) => a + b, 0)
    const unit = (usable - gap * (row.units.length - 1)) / total
    let x = left
    for (const u of row.units) {
      const w = unit * u
      g.fillStyle = '#0f1012'
      g.beginPath()
      g.roundRect(x, y, w, row.h, 7)
      g.fill()
      g.fillStyle = 'rgba(255,255,255,0.04)'
      g.fillRect(x + 5, y + 3, w - 10, 2)
      x += w + gap
    }
    y += row.h + gap
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** MacBook-like laptop with a lid on a hinge, so it can open and close. */
export function buildLaptop(THREE: Three, RoundedBox: RoundedBoxCtor, screen: T.Material): Device {
  const group = new THREE.Group()
  const body = new THREE.Group()
  group.add(body)

  const W = 2.7, D = 1.86, T = 0.06
  const frame = frameMaterial(THREE, 0x44464d)

  const base = new THREE.Mesh(new RoundedBox(W, T, D, 4, 0.028), frame)
  base.position.y = T / 2
  base.castShadow = true
  body.add(base)

  const deck = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.34, 0.86),
    new THREE.MeshStandardMaterial({ map: keyboardTexture(THREE), roughness: 0.7, metalness: 0.2 }),
  )
  deck.rotation.x = -Math.PI / 2
  deck.position.set(0, T + 0.0006, -0.34)
  body.add(deck)

  const pad = new THREE.Mesh(
    roundedRect(THREE, 1.0, 0.6, 0.05),
    new THREE.MeshPhysicalMaterial({ color: 0x3a3c42, metalness: 0.6, roughness: 0.25, clearcoat: 0.8 }),
  )
  pad.rotation.x = -Math.PI / 2
  pad.position.set(0, T + 0.0006, 0.47)
  body.add(pad)

  // Lid: pivots on the back edge. rotation.x = 0 is upright; PI/2 is shut.
  const lid = new THREE.Group()
  lid.position.set(0, T, -D / 2 + 0.02)
  body.add(lid)

  const LH = 1.78, LT = 0.034
  const shell = new THREE.Mesh(new RoundedBox(W, LH, LT, 4, 0.016), frame)
  shell.position.set(0, LH / 2, -LT / 2)
  shell.castShadow = true
  lid.add(shell)

  const bezel = new THREE.Mesh(roundedRect(THREE, W - 0.03, LH - 0.03, 0.06), glassMaterial(THREE))
  bezel.position.set(0, LH / 2, 0.0006)
  lid.add(bezel)

  const SW = 2.5, SH = SW / 1.6
  const display = new THREE.Mesh(roundedRect(THREE, SW, SH, 0.03), screen)
  display.position.set(0, LH / 2 + 0.02, 0.0012)
  lid.add(display)

  const notch = new THREE.Mesh(roundedRect(THREE, 0.24, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0x000000 }))
  notch.position.set(0, LH / 2 + 0.02 + SH / 2 - 0.02, 0.0016)
  lid.add(notch)

  // A faint glowing logo on the back of the lid, seen when it's shut or turned.
  const logo = new THREE.Mesh(
    new THREE.CircleGeometry(0.11, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 }),
  )
  logo.position.set(0, LH / 2, -LT - 0.0008)
  logo.rotation.y = Math.PI
  lid.add(logo)

  return { group, body, frames: [frame], lid, halfHeight: 0 }
}
