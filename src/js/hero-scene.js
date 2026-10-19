// Three.js hero scene — a luminous, growing "branch tree" of glowing nodes.
// GPU friendly: one Points cloud + one LineSegments, capped DPR, paused when
// off-screen, theme-aware colors, static SVG fallback when WebGL/reduced-motion.
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './util.js'

gsap.registerPlugin(ScrollTrigger)

const MAX_DPR = 1.75

function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

/* ---------- build the growth tree geometry ---------- */
function buildTree() {
  const pts = [] // [x,y,z, scale, order, seed]
  const segs = [] // [ax,ay,az, bx,by,bz, order]
  const orderMax = { v: 0 }

  const tmp = { x: 0, y: 0, z: 0 }

  function pushPoint(x, y, z, scale, order, seed) {
    pts.push(x, y, z, scale, order, seed)
  }

  function branch(x, y, z, dx, dy, dz, len, depth, order) {
    const steps = 7
    let px = x
    let py = y
    let pz = z
    const ex = x + dx * len
    const ey = y + dy * len
    const ez = z + dz * len
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      const nx = px + (ex - px) * 0.5
      const ny = py + (ey - py) * 0.5
      const nz = pz + (ez - pz) * 0.5
      // gentle organic jitter perpendicular to the branch
      const jx = (Math.random() - 0.5) * 0.22
      const jz = (Math.random() - 0.5) * 0.22
      px = px + (ex - px) / (steps - s + 1) + jx * 0.3
      py = py + (ey - py) / (steps - s + 1)
      pz = pz + (ez - pz) / (steps - s + 1) + jz * 0.3
      const o = order + t * 0.045
      orderMax.v = Math.max(orderMax.v, o)
      pushPoint(px, py, pz, 0.55 + Math.random() * 0.7, o, Math.random())
      tmp.x = px
      tmp.y = py
      tmp.z = pz
    }
    segs.push(x, y, z, ex, ey, ez, order)

    if (depth >= 5) {
      // glowing bud at the tip + tiny satellite leaves
      pushPoint(ex, ey, ez, 1.7 + Math.random() * 0.5, order + 0.05, Math.random())
      for (let k = 0; k < 3; k++) {
        pushPoint(
          ex + (Math.random() - 0.5) * 1.4,
          ey + Math.random() * 0.9,
          ez + (Math.random() - 0.5) * 1.4,
          0.5 + Math.random() * 0.4,
          order + 0.06,
          Math.random(),
        )
      }
      return
    }

    const splits = depth < 2 ? 3 : 2
    const spread = depth === 0 ? 0.42 : 0.55
    for (let k = 0; k < splits; k++) {
      const ax = Math.random() * Math.PI * 2
      const tilt = spread * (0.55 + Math.random() * 0.75)
      // rotate direction around random azimuth
      const ux = dx * Math.cos(tilt) - Math.sin(tilt) * Math.cos(ax)
      const uz = dz * Math.cos(tilt) - Math.sin(tilt) * Math.sin(ax)
      const uy = Math.max(0.18, dy * Math.cos(tilt) + Math.sin(tilt) * 0.5)
      const l = Math.hypot(ux, uy, uz)
      branch(ex, ey, ez, ux / l, uy / l, uz / l, len * (0.68 + Math.random() * 0.12), depth + 1, order + 0.13)
    }
  }

  branch(0, -8.4, 0, 0, 1, 0, 5.6, 0, 0.06)

  // ambient floating dust around the tree
  for (let i = 0; i < 260; i++) {
    const r = 6 + Math.random() * 9
    const a = Math.random() * Math.PI * 2
    pushPoint(
      Math.cos(a) * r * 0.9,
      -6 + Math.random() * 15,
      Math.sin(a) * r * 0.55,
      0.35 + Math.random() * 0.5,
      Math.random() * 0.9,
      Math.random(),
    )
  }

  return { pts, segs, orderMax: orderMax.v }
}

/* ---------- shaders ---------- */
const POINT_VERT = `
attribute float aScale;
attribute float aOrder;
attribute float aSeed;
uniform float uTime;
uniform float uGrowth;
uniform float uSize;
uniform float uPR;
varying float vMix;
varying float vAlpha;
void main() {
  float reveal = smoothstep(aOrder, aOrder + 0.22, uGrowth);
  vMix = fract(aSeed * 7.31);
  vec3 p = position;
  p.x += sin(uTime * 0.32 + aSeed * 12.0) * 0.16;
  p.y += cos(uTime * 0.26 + aSeed * 9.0) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * aScale * reveal * (0.85 + 0.3 * sin(uTime * 1.4 + aSeed * 20.0)) * uPR * (120.0 / -mv.z);
  vAlpha = reveal;
  gl_Position = projectionMatrix * mv;
}
`

const POINT_FRAG = `
precision mediump float;
varying float vMix;
varying float vAlpha;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.06, d);
  vec3 col = mix(uColorA, uColorB, vMix);
  gl_FragColor = vec4(col, a * vAlpha * uOpacity);
}
`

const THEMES = {
  light: {
    a: new THREE.Color('#a5781f'),
    b: new THREE.Color('#3d6a55'),
    line: new THREE.Color('#35594a'),
    blending: THREE.NormalBlending,
    opacity: 0.9,
    lineOpacity: 0.34,
  },
  dark: {
    a: new THREE.Color('#eccf8a'),
    b: new THREE.Color('#58b28c'),
    line: new THREE.Color('#caa14e'),
    blending: THREE.AdditiveBlending,
    opacity: 0.95,
    lineOpacity: 0.3,
  },
}

/* ---------- scene ---------- */
export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 1.4, 24)
  camera.lookAt(0, 0.5, 0)

  const group = new THREE.Group()
  group.rotation.y = -0.35
  scene.add(group)

  const { pts, segs } = buildTree()

  const gPoints = new THREE.BufferGeometry()
  const n = pts.length / 6
  const pos = new Float32Array(n * 3)
  const scale = new Float32Array(n)
  const order = new Float32Array(n)
  const seed = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    pos[i * 3] = pts[i * 6]
    pos[i * 3 + 1] = pts[i * 6 + 1]
    pos[i * 3 + 2] = pts[i * 6 + 2]
    scale[i] = pts[i * 6 + 3]
    order[i] = pts[i * 6 + 4]
    seed[i] = pts[i * 6 + 5]
  }
  gPoints.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  gPoints.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
  gPoints.setAttribute('aOrder', new THREE.BufferAttribute(order, 1))
  gPoints.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))

  const uniforms = {
    uTime: { value: 0 },
    uGrowth: { value: 0 },
    uSize: { value: 1.0 },
    uPR: { value: Math.min(window.devicePixelRatio || 1, MAX_DPR) },
    uColorA: { value: new THREE.Color('#eccf8a') },
    uColorB: { value: new THREE.Color('#58b28c') },
    uOpacity: { value: 0.95 },
  }
  const pointsMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  group.add(new THREE.Points(gPoints, pointsMat))

  // lines (branches), growth via drawRange
  const m = segs.length / 7
  const lpos = new Float32Array(m * 6)
  const lorder = new Float32Array(m)
  for (let i = 0; i < m; i++) {
    lpos[i * 6] = segs[i * 7]
    lpos[i * 6 + 1] = segs[i * 7 + 1]
    lpos[i * 6 + 2] = segs[i * 7 + 2]
    lpos[i * 6 + 3] = segs[i * 7 + 3]
    lpos[i * 6 + 4] = segs[i * 7 + 4]
    lpos[i * 6 + 5] = segs[i * 7 + 5]
    lorder[i] = segs[i * 7 + 6]
  }
  const gLines = new THREE.BufferGeometry()
  gLines.setAttribute('position', new THREE.BufferAttribute(lpos, 3))
  gLines.setAttribute('aOrder', new THREE.BufferAttribute(lorder, 1))
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xcaa14e,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const lines = new THREE.LineSegments(gLines, lineMat)
  // sort segments by growth order so drawRange reveals them naturally
  const segOrders = Array.from(lorder).map((o, i) => ({ o, i }))
  segOrders.sort((a, b) => a.o - b.o)
  const sortedLPos = new Float32Array(lpos.length)
  segOrders.forEach((s, rank) => {
    for (let k = 0; k < 6; k++) sortedLPos[rank * 6 + k] = lpos[s.i * 6 + k]
  })
  gLines.setAttribute('position', new THREE.BufferAttribute(sortedLPos, 3))
  const totalLineVerts = sortedLPos.length / 3
  group.add(lines)

  /* ---------- sizing ---------- */
  const resize = () => {
    const parent = canvas.parentElement
    const w = parent.clientWidth || 1
    const h = parent.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement)

  /* ---------- pointer parallax ---------- */
  let tx = 0
  let ty = 0
  const onPointer = (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2
    ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  /* ---------- scroll-driven growth ---------- */
  let growthBase = 0.42
  const growthObj = { v: 0 }
  gsap.to(growthObj, { v: growthBase, duration: 2.6, ease: 'power2.inOut', delay: 0.3 })

  const story = document.querySelector('[data-story]')
  if (story) {
    ScrollTrigger.create({
      trigger: story,
      start: 'top 80%',
      end: 'bottom 30%',
      scrub: 0.5,
      onUpdate: (self) => {
        growthBase = 0.42 + self.progress * 0.58
      },
    })
  }

  /* ---------- theme ---------- */
  const setTheme = (name) => {
    const t = THEMES[name] || THEMES.dark
    uniforms.uColorA.value.copy(t.a)
    uniforms.uColorB.value.copy(t.b)
    uniforms.uOpacity.value = t.opacity
    pointsMat.blending = t.blending
    pointsMat.needsUpdate = true
    lineMat.color.copy(t.line)
    lineMat.opacity = t.lineOpacity
    lineMat.blending = t.blending
    lineMat.needsUpdate = true
  }
  setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  window.addEventListener('nemo:themechange', (e) => setTheme(e.detail?.theme))

  /* ---------- render loop (pausable) ---------- */
  let paused = false
  let raf = null
  const clock = new THREE.Clock()

  const tick = () => {
    raf = null
    if (paused) return
    const t = clock.getElapsedTime()

    growthObj.v += (growthBase - growthObj.v) * 0.03
    uniforms.uTime.value = t
    uniforms.uGrowth.value = growthObj.v

    const visible = Math.floor((growthObj.v * totalLineVerts) / 2) * 2
    gLines.setDrawRange(0, visible)

    group.rotation.y = -0.35 + tx * 0.16 + Math.sin(t * 0.12) * 0.04
    group.rotation.x = ty * 0.06
    group.scale.y = 1 + Math.sin(t * 0.5) * 0.012 // breathing
    camera.position.z = 24 - growthObj.v * 2.2

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  const start = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const setPaused = (v) => {
    paused = v
    if (!v) start()
  }
  start()

  document.addEventListener('visibilitychange', () => setPaused(document.hidden))

  return { setPaused, resize }
}

/* ---------- orb scene (secondary accent — CTA sections) ---------- */
export function initOrbScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 13)

  const group = new THREE.Group()
  scene.add(group)

  // crystal core
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(2.4, 0),
    new THREE.MeshBasicMaterial({ color: 0xcaa14e, transparent: true, opacity: 0.1 }),
  )
  group.add(core)
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(2.4, 1)),
    new THREE.LineBasicMaterial({ color: 0xe8cd8c, transparent: true, opacity: 0.5 }),
  )
  group.add(wire)

  // orbiting glow points
  const COUNT = 360
  const pos = new Float32Array(COUNT * 3)
  const scale = new Float32Array(COUNT)
  const order = new Float32Array(COUNT)
  const seed = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    const ring = i % 3
    const a = Math.random() * Math.PI * 2
    const r = 3.1 + ring * 0.75 + Math.random() * 0.5
    pos[i * 3] = Math.cos(a) * r
    pos[i * 3 + 1] = (Math.random() - 0.5) * (1.1 + ring * 0.4)
    pos[i * 3 + 2] = Math.sin(a) * r
    scale[i] = 0.5 + Math.random() * 0.9
    order[i] = Math.random()
    seed[i] = Math.random()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
  g.setAttribute('aOrder', new THREE.BufferAttribute(order, 1))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  const uniforms = {
    uTime: { value: 0 },
    uGrowth: { value: 1 },
    uSize: { value: 0.8 },
    uPR: { value: Math.min(window.devicePixelRatio || 1, MAX_DPR) },
    uColorA: { value: new THREE.Color('#eccf8a') },
    uColorB: { value: new THREE.Color('#58b28c') },
    uOpacity: { value: 0.95 },
  }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  group.add(new THREE.Points(g, mat))

  const setTheme = (name) => {
    const t = THEMES[name] || THEMES.dark
    uniforms.uColorA.value.copy(t.a)
    uniforms.uColorB.value.copy(t.b)
    uniforms.uOpacity.value = t.opacity
    mat.blending = t.blending
    mat.needsUpdate = true
    wire.material.color.copy(t.line)
    wire.material.opacity = name === 'dark' ? 0.55 : 0.45
    core.material.opacity = name === 'dark' ? 0.12 : 0.08
  }
  setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  window.addEventListener('nemo:themechange', (e) => setTheme(e.detail?.theme))

  const resize = () => {
    const parent = canvas.parentElement
    const w = parent.clientWidth || 1
    const h = parent.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  new ResizeObserver(resize).observe(canvas.parentElement)

  let paused = false
  let raf = null
  const clock = new THREE.Clock()
  const tick = () => {
    raf = null
    if (paused) return
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t
    group.rotation.y = t * 0.22
    group.position.y = Math.sin(t * 0.7) * 0.5
    wire.rotation.x = Math.sin(t * 0.3) * 0.22
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  const start = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const setPaused = (v) => {
    paused = v
    if (!v) start()
  }
  start()
  document.addEventListener('visibilitychange', () => setPaused(document.hidden))

  return { setPaused, resize }
}

export { webglOK }
