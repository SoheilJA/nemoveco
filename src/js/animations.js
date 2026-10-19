// GSAP animation system: scroll reveals, word-splitting (local mini SplitText),
// counters, tilt, parallax, marquee, storytelling scrub, tabs, progress.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $$, $, reducedMotion, faNum } from './util.js'

gsap.registerPlugin(ScrollTrigger)

/* --- tiny local word splitter (RTL-safe: words only, no line measuring) --- */
export function splitWords(el) {
  if (el.dataset.splitDone) return el.querySelectorAll('.w-inner')
  const text = el.textContent.trim()
  const words = text.split(/\s+/)
  el.setAttribute('aria-label', text)
  el.innerHTML = words
    .map((w) => `<span class="w-outer inline-block overflow-hidden align-bottom"><span class="w-inner inline-block" aria-hidden="true">${w}</span></span>`)
    .join(' ')
  el.dataset.splitDone = '1'
  return el.querySelectorAll('.w-inner')
}

/* --- scroll reveals --- */
const REVEALS = {
  up: { y: 44 },
  down: { y: -30 },
  start: { x: 56 },
  end: { x: -56 },
  scale: { scale: 0.92 },
  fade: {},
  blur: { filter: 'blur(10px)', y: 20 },
}

function initReveals() {
  if (reducedMotion()) return
  $$('[data-reveal]').forEach((el) => {
    const type = REVEALS[el.dataset.reveal] ?? REVEALS.up
    gsap.from(el, {
      ...type,
      opacity: 0,
      duration: 1.05,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
  $$('[data-reveal-group]').forEach((group) => {
    const kids = group.querySelectorAll(':scope > *')
    if (!kids.length) return
    gsap.from(kids, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 86%', once: true },
    })
  })
  $$('[data-split]').forEach((el) => {
    const words = splitWords(el)
    if (!words.length || reducedMotion()) return
    gsap.from(words, {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.055,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })
}

/* --- animated counters (Persian digits) --- */
function initCounters() {
  $$('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.target || '0')
    const decimals = parseInt(el.dataset.decimals || '0', 10)
    const render = (v) => {
      el.textContent = decimals ? faNum(v.toFixed(decimals)) : faNum(Math.round(v))
    }
    if (reducedMotion()) {
      render(target)
      return
    }
    const obj = { v: 0 }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.9,
          ease: 'power2.out',
          onUpdate: () => render(obj.v),
        })
      },
    })
  })
}

/* --- live 3D tilt cards --- */
function initTilt() {
  if (reducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  $$('[data-tilt]').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power2.out' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power2.out' })
    const tz = gsap.quickTo(card, 'z', { duration: 0.55, ease: 'power2.out' })
    gsap.set(card, { transformPerspective: 950, transformOrigin: 'center' })
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      // in RTL the visual mapping stays physical — tilt toward the pointer
      ry(px * 10)
      rx(-py * 10)
      tz(18)
    })
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, z: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    })
  })
}

/* --- parallax --- */
function initParallax() {
  if (reducedMotion()) return
  $$('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax || '0.15')
    gsap.to(el, {
      yPercent: -depth * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    })
  })
}

/* --- marquee: duplicate items for a seamless loop --- */
function initMarquee() {
  $$('.marquee-track').forEach((track) => {
    if (track.dataset.cloned) return
    track.dataset.cloned = '1'
    // track may hold a single wrapper div (index.html) — clone its item children
    const hosts = [...track.children].every((c) => c.classList.contains('flex'))
      ? [...track.children]
      : [track]
    const source = hosts[0]
    const items = Array.from(source.children)
    if (items.length < 2) return
    const copies = items.map((n) => {
      const c = n.cloneNode(true)
      c.setAttribute('aria-hidden', 'true')
      return c
    })
    copies.forEach((c) => source.appendChild(c))
  })
}

/* --- storytelling: progressive line reveal + growing vine --- */
function initStory() {
  const story = $('[data-story]')
  if (!story) return
  const lines = $$('.story-line', story)
  const vine = $('.story-vine path', story)

  if (reducedMotion()) {
    lines.forEach((l) => (l.style.opacity = 1))
    if (vine) vine.style.strokeDashoffset = 0
    return
  }

  lines.forEach((line) => {
    gsap.fromTo(
      line,
      { opacity: 0.14, y: 26 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 78%', end: 'top 45%', scrub: 0.5 },
      },
    )
  })

  if (vine) {
    const len = vine.getTotalLength()
    vine.style.setProperty('--dash', len)
    gsap.fromTo(
      vine,
      { strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: story, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      },
    )
  }
}

/* --- scroll progress hairline --- */
function initScrollProgress() {
  const bar = $('.scroll-progress')
  if (!bar) return
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  })
}

/* --- progress rings --- */
function initRings() {
  $$('[data-ring]').forEach((svg) => {
    const circle = svg.querySelector('circle.ring-fg')
    if (!circle) return
    const c = 2 * Math.PI * circle.r.baseVal.value
    const pct = parseFloat(svg.dataset.ring || '100')
    circle.style.strokeDasharray = `${c}`
    circle.style.strokeDashoffset = `${c}`
    gsap.to(circle, {
      strokeDashoffset: c * (1 - pct / 100),
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: svg, start: 'top 88%', once: true },
    })
  })
}

/* --- interactive tabs (sales / HR systems on home) --- */
function initTabs() {
  const root = $('[data-tabs]')
  if (!root) return
  const tabs = $$('[data-tab]', root)
  const panels = $$('[data-panel]', root)
  if (!tabs.length || !panels.length) return

  const select = (name, animate = true) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      t.classList.toggle('is-on', on)
    })
    panels.forEach((p) => {
      const on = p.dataset.panel === name
      p.hidden = !on
      if (on && animate && !reducedMotion()) {
        const chips = p.querySelectorAll('.sys-chip')
        gsap.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        if (chips.length) {
          gsap.fromTo(chips, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.1 })
        }
      }
    })
  }

  tabs.forEach((t) => {
    t.addEventListener('click', () => select(t.dataset.tab))
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const i = tabs.indexOf(t)
        const dir = e.key === 'ArrowLeft' ? 1 : -1 // RTL: left arrow = next
        const next = tabs[(i + dir + tabs.length) % tabs.length]
        next.focus()
        select(next.dataset.tab)
      }
    })
  })
  select(tabs[0].dataset.tab, false)
}

/* --- hero intro (index) --- */
function initHeroIntro() {
  const hero = $('[data-hero-intro]')
  if (!hero || reducedMotion()) return
  const words = splitWords($('[data-hero-title]', hero) || hero)
  const tl = gsap.timeline({ delay: 0.15 })
  if (words.length) tl.from(words, { yPercent: 115, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06 }, 0)
  tl.from($('[data-hero-eyebrow]', hero), { opacity: 0, y: 14, duration: 0.7, ease: 'power2.out' }, 0.2)
  tl.from($('[data-hero-form]', hero), { opacity: 0, y: 34, duration: 1, ease: 'power3.out' }, 0.45)
  tl.from($('[data-hero-scroll]', hero), { opacity: 0, duration: 0.8 }, 1)
}

/* --- expandable service cards (native <details> + soft reveal) --- */
function initExpandables() {
  $$('details[data-svc]').forEach((d) => {
    const body = d.querySelector('.svc-body')
    if (!body) return
    d.addEventListener('toggle', () => {
      if (d.open && !reducedMotion()) {
        gsap.fromTo(body.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' })
      }
    })
  })
}

export function initAnimations() {
  ScrollTrigger.config({ ignoreMobileResize: true })
  initReveals()
  initCounters()
  initTilt()
  initParallax()
  initMarquee()
  initStory()
  initScrollProgress()
  initRings()
  initTabs()
  initHeroIntro()
  initExpandables()
  // final recalculation after webfonts settle
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
}
