// GSAP-based page transitions: a soft curtain sweeps in before navigating to
// another internal page. External links, tel:, mailto: and modifiers are left alone.
import { gsap } from 'gsap'
import { reducedMotion } from './util.js'

export function initTransitions() {
  if (reducedMotion()) return
  let curtain = null

  const ensureCurtain = () => {
    if (curtain && curtain.isConnected) return curtain
    curtain = document.createElement('div')
    curtain.className = 'page-curtain'
    curtain.innerHTML = '<span></span><span></span><span></span><span></span>'
    curtain.setAttribute('aria-hidden', 'true')
    document.body.appendChild(curtain)
    return curtain
  }

  const playOut = (cb) => {
    const c = ensureCurtain()
    c.style.visibility = 'visible'
    const spans = c.querySelectorAll('span')
    gsap
      .timeline({ onComplete: cb })
      .to(spans, { scaleY: 1, duration: 0.42, stagger: 0.055, ease: 'power3.inOut' })
      .to({}, { duration: 0.12 }) // brief hold, like a breath
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a')
    if (!a) return
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (a.target === '_blank' || a.hasAttribute('download')) return
    const href = a.getAttribute('href') || ''
    if (!href || href.startsWith('#')) return
    if (/^(mailto:|tel:|https?:)/i.test(href)) return

    let url
    try {
      url = new URL(href, location.href)
    } catch {
      return
    }
    if (url.origin !== location.origin) return
    if (url.pathname === location.pathname && url.hash) return // same-page anchor

    e.preventDefault()
    playOut(() => {
      location.href = url.href
    })
  })

  // entering a page (incl. bfcache restores): gentle fade-in of the main area
  const revealIn = () => {
    const main = document.querySelector('main')
    if (main && !reducedMotion()) {
      gsap.fromTo(main, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all' })
    }
  }
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      const c = document.querySelector('.page-curtain')
      if (c) c.style.visibility = 'hidden'
    }
    revealIn()
  })
}
