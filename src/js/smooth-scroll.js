// Lightweight local inertia smooth-scroll (desktop, fine pointer, motion allowed).
// Wheel input is lerped in a rAF loop; native scrolling stays intact for
// keyboard / scrollbar / touch. Gracefully disabled when reduced-motion is set.
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clamp, lerp } from './util.js'

let locked = false
let active = false
let current = 0
let target = 0
let raf = null

/** Lock custom scrolling (menus, modals) */
export function lockScroll(v) {
  locked = v
}

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const doc = document.documentElement
  current = window.scrollY
  target = current
  active = true

  const tick = () => {
    current = lerp(current, target, 0.16)
    if (Math.abs(current - target) < 0.5) {
      current = target
      window.scrollTo(0, current)
      raf = null
      return
    }
    window.scrollTo(0, current)
    raf = requestAnimationFrame(tick)
  }

  const onWheel = (e) => {
    if (locked || e.ctrlKey || e.defaultPrevented) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // horizontal intent
    if (document.documentElement.classList.contains('menu-open')) return
    const max = doc.scrollHeight - window.innerHeight
    if (max <= 0) return
    e.preventDefault()
    target = clamp(target + e.deltaY, 0, max)
    if (!raf) raf = requestAnimationFrame(tick)
  }

  // keep in sync with native scrolling (keyboard, scrollbar drag, anchors)
  window.addEventListener(
    'scroll',
    () => {
      if (!raf) current = target = window.scrollY
    },
    { passive: true },
  )

  window.addEventListener('wheel', onWheel, { passive: false })

  // smooth same-page anchor navigation
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || e.defaultPrevented) return
    const id = a.getAttribute('href').slice(1)
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    locked = true
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    target = top
    current = window.scrollY
    if (!raf) raf = requestAnimationFrame(tick)
    // let ScrollTrigger know we moved programmatically
    setTimeout(() => {
      locked = false
      ScrollTrigger.refresh(false)
    }, 900)
  })

  return () => {
    // disable hook (unused by default)
    active = false
  }
}
