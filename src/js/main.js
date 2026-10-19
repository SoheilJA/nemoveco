// Nemo — main bundle entry (classic script, works over file:// too)
import { initPartials } from './partials.js'
import { initTheme } from './theme.js'
import { initPreloader } from './preloader.js'
import { initTransitions } from './transitions.js'
import { initSmoothScroll } from './smooth-scroll.js'
import { initCursor } from './cursor.js'
import { initAnimations } from './animations.js'
import { initUI } from './ui.js'

function boot() {
  try {
    initPartials() // header + footer + menus (before theme wiring)
    initTheme()
    initPreloader()
    initTransitions()
    initSmoothScroll()
    initCursor()
    initAnimations()
    initUI()
    // anime.js micro-interaction: gentle pop on theme knob handled in theme.js
    document.documentElement.classList.add('booted')
  } catch (err) {
    // fail-safe: never leave content invisible
    console.error('[nemo]', err)
    document.documentElement.classList.add('revealed', 'booted')
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true })
} else {
  boot()
}
