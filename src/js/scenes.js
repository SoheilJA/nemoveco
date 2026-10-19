// Scene manager — lazy init (IntersectionObserver), pause off-screen,
// static SVG fallback for reduced-motion / no WebGL / low-power devices.
import { initHeroScene, initOrbScene, webglOK } from './hero-scene.js'
import { $$, reducedMotion } from './util.js'

const LOW_POWER = (navigator.hardwareConcurrency || 8) <= 2 && navigator.maxTouchPoints > 0

export function initScenes() {
  if (reducedMotion() || !webglOK() || LOW_POWER) {
    $$('.scene-wrap').forEach((w) => w.classList.add('scene-off'))
    return
  }

  $$('canvas[data-scene]').forEach((canvas) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !canvas.dataset.init) {
            canvas.dataset.init = '1'
            try {
              const kind = canvas.dataset.scene
              canvas._nemoInstance = kind === 'hero' ? initHeroScene(canvas) : initOrbScene(canvas)
            } catch (err) {
              console.warn('[nemo] scene skipped:', err)
              canvas.closest('.scene-wrap')?.classList.add('scene-off')
            }
          } else if (canvas.dataset.init) {
            canvas._nemoInstance?.setPaused(!entry.isIntersecting)
          }
        })
      },
      { rootMargin: '160px' },
    )
    io.observe(canvas)
  })
}

/* auto-boot (separate classic-script bundle) */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScenes, { once: true })
} else {
  initScenes()
}
