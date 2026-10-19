// Page preloader — the Nemo sprout draws itself, then the curtain lifts.
import { gsap } from 'gsap'
import { $, reducedMotion } from './util.js'

export function initPreloader() {
  const pre = $('.preloader')
  if (!pre) return
  const started = performance.now()

  const finish = () => {
    if (!pre || !pre.isConnected) return
    if (reducedMotion()) {
      pre.remove()
      document.documentElement.classList.add('revealed')
      return
    }
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(pre.querySelectorAll('.preloader-logo > *'), { scale: 0.9, opacity: 0, duration: 0.32, stagger: 0.05, ease: 'power2.in' }, 0)
      .to(pre, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 0.28)
      .call(() => {
        pre.remove()
        document.documentElement.classList.add('revealed')
      })
  }

  const ready = () => {
    // keep the sprout on screen at least ~1.1s for the draw animation
    const wait = Math.max(0, 1100 - (performance.now() - started))
    setTimeout(finish, wait)
  }

  if (document.readyState === 'complete') ready()
  else window.addEventListener('load', ready, { once: true })

  // extra safety net (CSS also auto-fades it at 9s)
  setTimeout(() => {
    pre?.remove()
    document.documentElement.classList.add('revealed')
  }, 10000)
}
