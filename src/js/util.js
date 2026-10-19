// Shared helpers
export const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert latin digits to Persian digits */
export const toFa = (v) => String(v).replace(/[0-9]/g, (d) => FA_DIGITS[+d])

/** Format number with Persian thousand separators */
export const faNum = (n) => toFa(Number(n).toLocaleString('en-US')).replace(/,/g, '٬')

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const $ = (s, c = document) => c.querySelector(s)
export const $$ = (s, c = document) => Array.from(c.querySelectorAll(s))

/** Dispatch app-level events */
export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }))

/** Inline SVG icons — consistent hand-drawn stroke style (no icon CDN) */
export const icons = {
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6.5 9 6.2 9-6.2"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`,
  menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>`,
  close: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  arrowStart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6"/></svg>`,
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`,
  pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>`,
  sprout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-8"/><path d="M12 13C12 9 9 6.5 4.5 6.5 4.5 11 7.5 13 12 13Z"/><path d="M12 10c0-3.2 2.4-5 6.5-5C18.5 8.6 16.4 10 12 10Z"/></svg>`,
}

/** The Nemo sprout logo (used in header, footer, preloader) */
export const logoSprout = (cls = '') => `<svg class="${cls}" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="nemo-sprout-grad" x1="0" y1="48" x2="40" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="var(--n-gold-deep)"/>
      <stop offset="0.55" stop-color="var(--n-gold)"/>
      <stop offset="1" stop-color="var(--n-emerald)"/>
    </linearGradient>
  </defs>
  <path d="M24 44c0-10 0-14 .5-19" stroke="url(#nemo-sprout-grad)" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M24.5 25c-.8-6.6-5.6-11-13.5-11.2C11.6 22.2 16.6 25.7 24.5 25Z" fill="url(#nemo-sprout-grad)" fill-opacity="0.22" stroke="url(#nemo-sprout-grad)" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M25.5 21c.6-5 4-7.8 10-7.8-.4 6.4-3.6 8.4-10 7.8Z" fill="url(#nemo-sprout-grad)" fill-opacity="0.22" stroke="url(#nemo-sprout-grad)" stroke-width="2.2" stroke-linejoin="round"/>
  <circle cx="25" cy="6.5" r="2.6" fill="var(--n-gold-soft)"/>
</svg>`
