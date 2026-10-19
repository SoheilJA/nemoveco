// Soft cursor follower + magnetic buttons — desktop with fine pointer only.
import { gsap } from 'gsap'
import { finePointer, reducedMotion, lerp } from './util.js'

export function initCursor() {
  if (!finePointer() || reducedMotion()) return

  const dot = document.createElement('div')
  const ring = document.createElement('div')
  dot.className = 'cursor-dot'
  ring.className = 'cursor-ring'
  document.body.append(dot, ring)
  document.documentElement.classList.add('has-cursor')

  let mx = window.innerWidth / 2
  let my = window.innerHeight / 2
  let dx = mx
  let dy = my
  let rx = mx
  let ry = my

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX
    my = e.clientY
  })
  window.addEventListener('pointerdown', () => ring.classList.add('is-active'))
  window.addEventListener('pointerup', () => ring.classList.remove('is-active'))
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = 0
    ring.style.opacity = 0
  })
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = ''
    ring.style.opacity = ''
  })

  gsap.ticker.add(() => {
    dx = lerp(dx, mx, 0.55)
    dy = lerp(dy, my, 0.55)
    rx = lerp(rx, mx, 0.16)
    ry = lerp(ry, my, 0.16)
    dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
  })

  /* interactive hover states */
  const HOVER = 'a, button, [data-tilt], input, textarea, select, summary, [role="button"]'
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER)) ring.classList.add('is-active')
  })
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER)) ring.classList.remove('is-active')
  })

  /* magnetic elements */
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 0.28
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const relX = (e.clientX - (r.left + r.width / 2)) * strength
      const relY = (e.clientY - (r.top + r.height / 2)) * strength
      gsap.to(el, { x: relX, y: relY, duration: 0.4, ease: 'power2.out' })
    })
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    })
  })
}
