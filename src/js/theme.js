// Light / dark theme system — persisted in localStorage, follows OS by default.
// The anti-flash bootstrap already ran inline in <head>.
import { emit, $ } from './util.js'

const KEY = 'nemo-theme'

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function apply(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a131c' : '#f6f1e6')
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(KEY, next)
  } catch { /* storage unavailable — still toggle in-session */ }
  apply(next)
  emit('nemo:themechange', { theme: next })
  // little pop on the toggle knob
  const knob = $('.theme-knob')
  if (knob) {
    knob.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.35)' },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    )
  }
}

export function initTheme() {
  // sync with OS changes when the user has not made an explicit choice
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', (e) => {
    let saved = null
    try { saved = localStorage.getItem(KEY) } catch { /* noop */ }
    if (!saved) {
      apply(e.matches ? 'dark' : 'light')
      emit('nemo:themechange', { theme: getTheme() })
    }
  })

  // header toggle button (header is injected by partials before this runs)
  const btn = $('#theme-toggle')
  if (btn) {
    btn.addEventListener('click', toggleTheme)
    btn.setAttribute('aria-pressed', String(getTheme() === 'dark'))
  }
  document.addEventListener('nemo:themechange', () => {
    btn?.setAttribute('aria-pressed', String(getTheme() === 'dark'))
  })
}
