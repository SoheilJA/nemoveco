// Shared header + footer, injected into every page as a partial (no framework).
// Includes: topbar, sticky glass nav (shrinks on scroll), theme toggle,
// mega menu «راهکارهای نمو», full-screen mobile menu, rich footer.
import { icons, logoSprout, $, $$ } from './util.js'

const NAV = [
  { href: 'index.html', label: 'خانه', page: 'index' },
  { href: 'solutions.html', label: 'راهکارهای نمو', page: 'solutions', mega: true },
  { href: 'academy.html', label: 'آکادمی نمو', page: 'academy' },
  { href: 'blog.html', label: 'وبلاگ', page: 'blog' },
  { href: 'products.html', label: 'محصولات', page: 'products' },
  { href: 'about.html', label: 'درباره ما', page: 'about' },
  { href: 'contact.html', label: 'تماس با ما', page: 'contact' },
]

const MEGA = [
  {
    title: 'کارهای اختصاصی',
    links: [
      { t: 'مشاوره فروش و بازاریابی', h: 'solutions.html#svc-sales-marketing' },
      { t: 'خدمات مشاوره CRM و نرم‌افزار فروش', h: 'solutions.html#svc-crm' },
      { t: 'خدمات عارضه‌یابی فروش', h: 'solutions.html#svc-sales-diag' },
      { t: 'خدمات مشاوره توسعه بازار', h: 'solutions.html#svc-market-dev' },
      { t: 'خدمات تحقیقات بازار', h: 'solutions.html#svc-research' },
    ],
  },
  {
    title: 'مشاوره کسب و کار',
    links: [
      { t: 'خدمات عارضه‌یابی کسب‌وکار', h: 'solutions.html#svc-biz-diag' },
      { t: 'سرویس تدوین و استقرار فرآیندهای کسب‌وکار', h: 'solutions.html#svc-process' },
    ],
  },
  {
    title: 'خدمات مشاوره منابع انسانی',
    links: [
      { t: 'بسته آموزشی تیم حرفه ای T۸', h: 'solutions.html#svc-t8' },
      { t: 'تحلیل تناسب شغل با شخصیت', h: 'solutions.html#svc-fit' },
      { t: 'جذب نیروی شایسته کارشناس', h: 'solutions.html#svc-hire' },
    ],
  },
]

const RECENT_POSTS = [
  { t: 'تعهدنامه استخدامی با ترک تشریفات', d: 'شهریور ۲, ۱۴۰۲', h: 'blog.html' },
  { t: 'نمایشگاه های تخصصی توسعه کسب و کار', d: 'مرداد ۳۱, ۱۴۰۳', h: 'blog.html' },
  { t: 'انواع روش کسب درآمد از برگزاری وبینار', d: 'شهریور ۱, ۱۴۰۳', h: 'blog.html' },
]

/* -------------------------------------------------------------------------- */
/* Header markup                                                              */
/* -------------------------------------------------------------------------- */
function headerHTML(currentPage) {
  const navLinks = NAV.map((item) => {
    const active = item.page === currentPage
    if (item.mega) {
      return `
      <div class="mega-root">
        <button type="button" class="nav-btn group ${active ? 'is-active' : ''}" aria-expanded="false" aria-haspopup="true" data-mega-trigger>
          <span>راهکارهای نمو</span>
          <span class="text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5" data-mega-chevron>${icons.chevron}</span>
        </button>
      </div>`
    }
    return `<a href="${item.href}" class="nav-btn ${active ? 'is-active' : ''}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`
  }).join('\n')

  const megaCols = MEGA.map((col) => `
    <div class="space-y-3.5">
      <h3 class="text-sm font-extrabold text-gold">${col.title}</h3>
      <ul class="space-y-2.5">
        ${col.links.map((l) => `<li><a class="mega-link text-[0.95rem] text-ink-soft" href="${l.h}">${l.t}</a></li>`).join('')}
      </ul>
    </div>`).join('\n')

  return `
  <div class="topbar hidden lg:block border-b border-line/60">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between py-2 text-[0.8rem] text-ink-faint">
      <div class="flex items-center gap-6">
        <a href="tel:+985138470048" class="flex items-center gap-2 hover:text-gold transition-colors">${icons.phone}<span>۰۵۱۳۸۴۷۰۰۴۸</span></a>
        <a href="mailto:nemov.eco@gmail.com" class="flex items-center gap-2 hover:text-gold transition-colors">${icons.mail}<span class="latin">nemov.eco@gmail.com</span></a>
      </div>
      <a href="account.html" class="flex items-center gap-2 hover:text-gold transition-colors">${icons.user}<span>حساب کاربری من</span></a>
    </div>
  </div>

  <div class="nav-shell sticky top-0 z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between gap-4 py-3.5 nav-inner">
        <a href="index.html" class="brand flex items-center gap-3" aria-label="نمو — صفحه اصلی">
          <span class="h-11 w-11 shrink-0">${logoSprout('h-11 w-11')}</span>
          <span class="brand-wordmark leading-tight">
            <span class="block text-2xl font-black text-gradient-gold">نِمُو</span>
            <span class="block text-[0.66rem] font-semibold text-ink-faint">شرکت مشاوره مدیریت کسب و کار نمو</span>
          </span>
        </a>

        <nav class="hidden lg:flex items-center gap-0.5" aria-label="منوی اصلی">
          ${navLinks}
        </nav>

        <div class="flex items-center gap-2.5">
          <button id="theme-toggle" type="button" class="theme-toggle relative flex h-10 w-[4.4rem] items-center rounded-full border border-glassline bg-surface2 px-1 backdrop-blur-md" aria-label="تغییر حالت روشن و تاریک">
            <span class="theme-knob absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-600 dark:to-zinc-800 shadow-sm transition-[inset-inline-start] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] start-1 dark:start-[calc(100%-2.25rem)]">
              <span class="absolute inset-0 grid place-items-center text-zinc-900 dark:hidden">${icons.sun}</span>
              <span class="absolute inset-0 hidden place-items-center text-zinc-50 dark:grid">${icons.moon}</span>
            </span>
          </button>
          <a href="contact.html" class="btn-gold shimmer hidden !py-2.5 !px-5 text-sm md:inline-flex">شروع تغییر</a>
          <button id="menu-open" type="button" class="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-glassline bg-surface2 text-ink" aria-label="باز کردن منو" aria-controls="mobile-menu">
            ${icons.menu}
          </button>
        </div>
      </div>
    </div>

    <div class="mega-panel" data-mega-panel>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div class="glass rounded-3xl p-6 lg:p-8">
          <div class="grid gap-8 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(260px,0.9fr)]">
            ${megaCols}
            <div class="conic-border relative rounded-2xl bg-deep p-6 text-ondeep overflow-hidden">
              <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" aria-hidden="true"></div>
              <p class="text-sm font-black text-gold-soft">نگاه ۳۶۰ درجه به رشد</p>
              <p class="mt-3 text-sm text-ondeep-soft leading-8">از سیستم فروش تا منابع انسانی؛ راهکار اختصاصی کسب‌وکار شما، همراهی تا نتیجه.</p>
              <a href="solutions.html" class="btn-gold shimmer mt-5 !px-5 !py-2 text-sm">مشاهده همه راهکارها ${icons.arrowStart}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
}

/* -------------------------------------------------------------------------- */
/* Mobile menu markup                                                         */
/* -------------------------------------------------------------------------- */
function mobileMenuHTML(currentPage) {
  const simple = (item) => `
    <a href="${item.href}" class="m-link block rounded-2xl px-4 py-3.5 text-lg font-bold ${item.page === currentPage ? 'text-gold bg-surface2' : 'text-ink'}" ${item.page === currentPage ? 'aria-current="page"' : ''} style="--i:2">${item.label}</a>`

  const megaGroups = MEGA.map((g, gi) => `
    <div style="--i:${2 + gi}">
      <p class="px-4 pt-4 pb-1 text-xs font-bold text-gold">${g.title}</p>
      <div class="grid grid-cols-1 gap-1">
        ${g.links.map((l) => `<a href="${l.h}" class="block rounded-xl px-4 py-2 text-sm text-ink-soft hover:text-gold transition-colors">${l.t}</a>`).join('')}
      </div>
    </div>`).join('')

  return `
  <div class="mobile-menu lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="منوی موبایل">
    <div class="flex items-center justify-between px-5 py-4 border-b border-line">
      <span class="flex items-center gap-2.5">
        <span class="h-9 w-9">${logoSprout('h-9 w-9')}</span>
        <span class="text-xl font-black text-gradient-gold">نِمُو</span>
      </span>
      <button type="button" class="mobile-menu-close flex h-10 w-10 items-center justify-center rounded-full border border-glassline text-ink" aria-label="بستن منو">${icons.close}</button>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-5 space-y-1.5" aria-label="منوی موبایل">
      <a href="index.html" class="m-link block rounded-2xl px-4 py-3.5 text-lg font-bold ${currentPage === 'index' ? 'text-gold bg-surface2' : 'text-ink'}" ${currentPage === 'index' ? 'aria-current="page"' : ''} style="--i:0">خانه</a>

      <details class="m-link group rounded-2xl" style="--i:1">
        <summary class="flex cursor-pointer list-none items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-bold text-ink">
          <span>راهکارهای نمو</span>
          <span class="text-ink-faint transition-transform duration-300 group-open:rotate-180">${icons.chevron}</span>
        </summary>
        <div class="pb-2">${megaGroups}</div>
      </details>

      ${NAV.filter((n) => !n.mega && n.page !== 'index').map(simple).join('')}
    </nav>

    <div class="m-link border-t border-line px-5 py-4 space-y-3" style="--i:6">
      <a href="account.html" class="btn-ghost w-full !py-2.5 text-sm">${icons.user} حساب کاربری من</a>
      <div class="flex items-center justify-between text-sm text-ink-faint">
        <a href="tel:+985138470048" class="flex items-center gap-1.5 hover:text-gold transition-colors">${icons.phone}<span>۰۵۱۳۸۴۷۰۰۴۸</span></a>
        <a href="mailto:nemov.eco@gmail.com" class="flex items-center gap-1.5 hover:text-gold transition-colors">${icons.mail}<span class="latin text-xs">nemov.eco@gmail.com</span></a>
      </div>
    </div>
  </div>`
}

/* -------------------------------------------------------------------------- */
/* Footer markup                                                              */
/* -------------------------------------------------------------------------- */
function footerHTML() {
  const quick = [
    { t: 'خانه', h: 'index.html' },
    { t: 'راهکارهای نمو', h: 'solutions.html' },
    { t: 'سرویس‌های تخصصی', h: 'departments.html' },
    { t: 'پروژه‌ها', h: 'projects.html' },
    { t: 'آکادمی نمو', h: 'academy.html' },
    { t: 'وبلاگ', h: 'blog.html' },
    { t: 'محصولات', h: 'products.html' },
    { t: 'حساب کاربری من', h: 'account.html' },
  ]
  return `
  <footer class="relative overflow-hidden bg-deep text-ondeep">
    <div class="absolute -top-32 start-1/4 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true"></div>
    <div class="absolute -bottom-40 end-0 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div class="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr]">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="h-12 w-12">${logoSprout('h-12 w-12')}</span>
            <div class="leading-tight">
              <p class="text-2xl font-black text-gold-soft">نِمُو</p>
              <p class="text-xs text-ondeep-soft">شریک رشد کسب‌وکار شما</p>
            </div>
          </div>
          <p class="max-w-sm text-sm leading-8 text-ondeep-soft">نمو | شریک رشد کسب‌وکار شما از فروش تا منابع انسانی؛ با نگاه ۳۶۰ درجه به توسعه واقعی.</p>
          <div class="flex gap-3">
            <a href="tel:+985138470048" class="flex h-10 w-10 items-center justify-center rounded-full border border-deepline text-ondeep-soft hover:text-gold-soft hover:border-gold/40 transition-colors" aria-label="تماس تلفنی">${icons.phone}</a>
            <a href="mailto:nemov.eco@gmail.com" class="flex h-10 w-10 items-center justify-center rounded-full border border-deepline text-ondeep-soft hover:text-gold-soft hover:border-gold/40 transition-colors" aria-label="ایمیل">${icons.mail}</a>
            <a href="https://www.instagram.com/nemoveco/" target="_blank" rel="noopener" class="flex h-10 w-10 items-center justify-center rounded-full border border-deepline text-ondeep-soft hover:text-gold-soft hover:border-gold/40 transition-colors" aria-label="اینستگرام نمو">${icons.instagram}</a>
          </div>
        </div>

        <nav aria-label="پیوندهای فوتر">
          <h3 class="text-sm font-extrabold text-gold-soft mb-4">دسترسی سریع</h3>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            ${quick.map((q) => `<li><a href="${q.h}" class="text-ondeep-soft hover:text-gold-soft transition-colors">${q.t}</a></li>`).join('')}
          </ul>
        </nav>

        <div>
          <h3 class="text-sm font-extrabold text-gold-soft mb-4">مطالب اخیر</h3>
          <ul class="space-y-4 text-sm">
            ${RECENT_POSTS.map((p) => `
            <li>
              <a href="${p.h}" class="block text-ondeep-soft hover:text-gold-soft transition-colors leading-7">${p.t}</a>
              <span class="text-xs text-ondeep-soft/60">${p.d}</span>
            </li>`).join('')}
          </ul>
        </div>

        <div class="space-y-5">
          <h3 class="text-sm font-extrabold text-gold-soft mb-4">مجوزها</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="badge-tile glass-soft rounded-2xl flex flex-col items-center justify-center gap-2 p-3 text-center" role="img" aria-label="نماد اعتماد الکترونیکی">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--n-gold-soft)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4.5 5v6c0 5 3.2 8.7 7.5 11 4.3-2.3 7.5-6 7.5-11V5L12 2Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/></svg>
              <span class="text-[0.68rem] leading-5 text-ondeep-soft">نماد اعتماد الکترونیکی</span>
            </div>
            <div class="badge-tile glass-soft rounded-2xl flex flex-col items-center justify-center gap-2 p-3 text-center" role="img" aria-label="مجوز کسب‌وکار اینترنتی">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--n-gold-soft)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/><path d="M12 11.5v2"/></svg>
              <span class="text-[0.68rem] leading-5 text-ondeep-soft">مجوز کسب‌وکار اینترنتی</span>
            </div>
          </div>
          <address class="not-italic text-xs leading-6 text-ondeep-soft/80 flex items-start gap-2">
            <span class="mt-0.5 shrink-0 text-gold-soft">${icons.pin}</span>
            <span>مشهد، خیابان احمد آباد، ناصر خسرو ۱۹، کوچه ۱۹/۳، پلاک ۲۲</span>
          </address>
        </div>
      </div>

      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-deepline pt-6 text-xs text-ondeep-soft/70 sm:flex-row">
        <p>© طراحی و توسعه توسط تیم نمو</p>
        <div class="flex items-center gap-5">
          <a href="contact.html" class="hover:text-gold-soft transition-colors">تماس با ما</a>
          <a href="about.html" class="hover:text-gold-soft transition-colors">درباره ما</a>
        </div>
      </div>
    </div>
  </footer>`
}

/* -------------------------------------------------------------------------- */
/* Injection + behaviors                                                      */
/* -------------------------------------------------------------------------- */
export function initPartials() {
  const page = document.body.dataset.page || ''
  const headerHost = $('#site-header')
  const footerHost = $('#site-footer')

  if (headerHost) {
    headerHost.outerHTML = `<header id="site-header" class="relative z-40">${headerHTML(page)}</header>`
  }
  if (footerHost) {
    footerHost.outerHTML = footerHTML()
  }
  document.body.insertAdjacentHTML('beforeend', mobileMenuHTML(page))

  /* --- sticky header state --- */
  const shell = $('.nav-shell')
  const onScroll = () => {
    const y = window.scrollY
    shell?.classList.toggle('is-scrolled', y > 28)
    const topbar = $('.topbar')
    if (topbar && y > 40) topbar.style.height = '0'
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* --- mega menu --- */
  const trigger = $('[data-mega-trigger]')
  const panel = $('[data-mega-panel]')
  const chevron = $('[data-mega-chevron]')
  let megaOpen = false
  let hoverTimer = null

  const setMega = (open) => {
    megaOpen = open
    panel?.classList.toggle('open', open)
    trigger?.setAttribute('aria-expanded', String(open))
    if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : ''
  }
  if (trigger && panel) {
    const root = trigger.closest('.mega-root')
    root.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        clearTimeout(hoverTimer)
        hoverTimer = setTimeout(() => setMega(true), 110)
      }
    })
    root.addEventListener('pointerleave', () => {
      clearTimeout(hoverTimer)
      hoverTimer = setTimeout(() => setMega(false), 160)
    })
    trigger.addEventListener('click', () => setMega(!megaOpen))
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMega(true)
        panel.querySelector('a')?.focus()
      }
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaOpen) {
        setMega(false)
        trigger.focus()
      }
    })
    document.addEventListener('click', (e) => {
      if (megaOpen && !panel.contains(e.target) && !trigger.contains(e.target)) setMega(false)
    })
    panel.addEventListener('focusout', (e) => {
      if (!panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) setMega(false)
    })
  }

  /* --- mobile menu --- */
  const openBtn = $('#menu-open')
  const menu = $('#mobile-menu')
  const closeBtn = $('.mobile-menu-close')
  let lastFocused = null

  const setMenu = (open) => {
    document.documentElement.classList.toggle('menu-open', open)
    openBtn?.setAttribute('aria-expanded', String(open))
    if (open) {
      lastFocused = document.activeElement
      closeBtn?.focus()
    } else {
      lastFocused?.focus?.()
    }
  }
  openBtn?.addEventListener('click', () => setMenu(true))
  closeBtn?.addEventListener('click', () => setMenu(false))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) setMenu(false)
  })
  // close after choosing a link that navigates
  menu?.addEventListener('click', (e) => {
    const a = e.target.closest('a')
    if (a && a.getAttribute('href')?.endsWith('.html')) setMenu(false)
  })
  // simple focus trap while open
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !document.documentElement.classList.contains('menu-open') || !menu) return
    const focusables = $$('a[href], button, summary, input', menu).filter((el) => el.offsetParent !== null)
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  })
}
