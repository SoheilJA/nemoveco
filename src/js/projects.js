// Projects page bundle: data array, rendering, live filters (GSAP Flip),
// search, industry dropdown, accessible modal, graceful "more" state.
// NOTE FOR THE OWNER: add the remaining 12 collaboration projects to the
// PROJECTS array below — cards, filters, search and counter «۱۸ تجربه همکاری»
// will pick them up automatically.
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $$, $, toFa, reducedMotion } from './util.js'

gsap.registerPlugin(Flip, ScrollTrigger)

/* -------------------------------------------------------------------------- */
/* Data — 6 of 18 collaborations provided; add the rest here                   */
/* -------------------------------------------------------------------------- */
const PROJECTS = [
  {
    id: 'gohar-zafaran',
    title: 'گوهر زعفران',
    industry: 'صادرات و صنایع غذایی',
    client: 'شرکت صادراتی گوهر زعفران',
    year: 'همکاری ۱۴۰۴',
    summary: 'عارضه‌یابی ۳۶۰ درجه فروش و منابع انسانی',
    tags: ['عارضه‌یابی فروش', 'منابع انسانی'],
    category: 'خصوصی',
    text: 'جهت شروع پروژه توسعه بازار شرکت صادراتی گوهر زعفران، عارضه یابی ۳۶۰ درجه سیستم فروش و سیستم منابع انسانی انجام شد. براساس گزارش تحلیلی ارائه شده، فاز اجرایی پروژه در حال برنامه ریزی است. (تابستان و پاییز ۱۴۰۴)',
    mono: 'گ',
  },
  {
    id: 'noor-center',
    title: 'نور سنتر',
    industry: 'نور و روشنایی',
    client: 'مرکز پخش نورسنتر',
    year: 'همکاری ۱۴۰۴',
    summary: 'از عارضه‌یابی تا طراحی پورسانت و پایش فروش',
    tags: ['توسعه بازار', 'پورسانت فروش', 'جذب نیرو'],
    category: 'خصوصی',
    text: 'در مرحله اول همکاری با مرکز پخش نورسنتر، ارائه دهنده محصولات نور و روشنایی، پروژه توسعه بازار این مجموعه با عارضه یابی ۳۶۰ درجه سیستم فروش و سیستم منابع انسانی آغاز شد. در مرحله اجرایی این پروژه، براساس گزارش تحلیلی ارائه شده، خدمات تدوین الگوی پورسانت فروش، برگزاری جلسات پایش فروش و جذب و استخدام نیروی شایسته تعریف شد. (تابستان و پاییز ۱۴۰۴)',
    mono: 'ن',
  },
  {
    id: 'atlas-jahan',
    title: 'اطلس جهان قشم',
    industry: 'لوازم خانگی',
    client: 'گروه لوازم خانگی اطلس جهان قشم',
    year: 'همکاری ۱۴۰۴',
    summary: 'عارضه‌یابی سیستم فروش و جذب نیروی شایسته',
    tags: ['عارضه‌یابی فروش', 'منابع انسانی', 'جذب نیرو'],
    category: 'خصوصی',
    text: 'پروژه همکاری با گروه لوازم خانگی اطلس جهان قشم، نماینده الکترواستیل در مشهد، با اجرای عارضه یابی ۳۶۰ درجه سیستم فروش و سیستم منابع انسانی همراه بود. بعد از ارائه گزارش تحلیلی روند اجرایی پروژه توسعه بازار با جذب نیروی شایسته آغاز شد. (پاییز ۱۴۰۴)',
    mono: 'ا',
  },
  {
    id: 'sabz-pooshesh',
    title: 'شرکت سبز پوشش',
    industry: 'ابزار و ماشین‌آلات کشاورزی',
    client: 'شرکت سبز پوشش',
    year: 'همکاری از ۱۴۰۳',
    summary: 'ساماندهی فروش و استقرار نرم‌افزار با رویکرد CRM',
    tags: ['سیستم فروش', 'CRM', 'توسعه بازار'],
    category: 'خصوصی',
    text: 'پروژه ارائه خدمات مشاوره فروش بازاریابی و خدمات مشاوره CRM و نرم افزار فروش برای شرکت سبز پوشش، مرکز پخش ابزار، ماشین آلات باغبانی و کشاورزی با ارائه خدمات حرفه‌ای چون هدفگذاری تا محاسبه پورسانت فروش، پایش فرآیند فروش و استقرار نرم افزار فروش با رویکرد CRM همراه بوده است. همچنین استراتژی و فرآیند اجرایی شرکت در نمایشگاه نیز توسط تیم توسعه بازار برنامه ریزی و پشتیبانی شد. (از سال ۱۴۰۳ تا به اکنون)',
    mono: 'س',
  },
  {
    id: 'payam-keyhan',
    title: 'هلدینگ پیام کیهان توس',
    industry: 'هلدینگ کسب‌وکار',
    client: 'هلدینگ پیام کیهان توس',
    year: 'همکاری از ۱۴۰۳',
    summary: 'طراحی سیستم فروش و مدیریت منابع انسانی',
    tags: ['سیستم فروش', 'منابع انسانی', 'فرآیندهای شغلی'],
    category: 'خصوصی',
    text: 'پروژه همکاری با هلدینگ پیام کیهان توس با ارائه خدمات سیستم مدیریت منابع انسانی و سیستم فروش که به صورت کاملا سفارشی سازی شده بود. عارضه یابی ۳۶۰ درجه، سازماندهی سیستم مدیریت، تدوین چارت سازمانی، جذب و استخدام نیروی شایسته، تدوین فرآیندهای شغلی، تدوین پروفایل‌های اختصاصی شغلی و برنامه‌ریزی و اجرای آموزش های مورد نیاز ریز سرویس‌های ویژه ارائه شده در این پروژه بوده است. در ادامه روند اجرایی پروژه، پشتیبانی منظم فرآیندهای تعریف شده برای سیستم فروش و سیستم منابع انسانی در حال انجام است. (از سال ۱۴۰۳ تا اکنون)',
    mono: 'پ',
  },
  {
    id: 'noavaran',
    title: 'کلینیک نوآوران زیبایی',
    industry: 'خدمات سلامت و زیبایی',
    client: 'کلینیک نوآوران زیبایی',
    year: 'همکاری از ۱۴۰۲',
    summary: 'سازماندهی فروش، منابع انسانی و آموزش تیم',
    tags: ['سیستم فروش', 'منابع انسانی', 'آموزش'],
    category: 'خصوصی',
    text: 'پروژه همکاری با کلینیک نوآوران زیبایی که ارائه خدمات توسعه بازار، توسعه منابع انسانی و آموزش مدیران و کارکنان به صورت کاملا سفارشی سازی شده بوده است. عارضه یابی ۳۶۰ درجه، سازماندهی سیستم فروش، تدوین چارت سازمانی، جذب و استخدام نیروی شایسته، تدوین شناسنامه شغلی، تدوین فرآیندهای شغلی و آموزش مهارت های نرم مدیران و کارکنان سرویس های ویژه نمو در این پروژه بوده است. (از سال ۱۴۰۲ تا به اکنون)',
    mono: 'ک',
  },
]

const INDUSTRIES = [...new Set(PROJECTS.map((p) => p.industry))]

/* -------------------------------------------------------------------------- */
/* Card rendering                                                             */
/* -------------------------------------------------------------------------- */
function cardHTML(p) {
  return `
  <article class="project-card glass rounded-3xl p-6 flex flex-col gap-5" data-category="${p.category}" data-industry="${p.industry}" data-search="${(p.title + ' ' + p.client + ' ' + p.summary + ' ' + p.tags.join(' ')).replace(/"/g, '')}">
    <div class="project-cover relative h-36 rounded-2xl overflow-hidden bg-gradient-to-bl from-gold/25 via-pearl to-emerald/20 grid place-items-center">
      <svg class="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 200 120" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M20 110C60 60 40 70 90 40 130 16 120 60 170 30" stroke="var(--n-gold)" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="90" cy="40" r="3.5" fill="var(--n-gold-soft)"/>
        <circle cx="170" cy="30" r="2.6" fill="var(--n-emerald)"/>
        <circle cx="20" cy="110" r="2.6" fill="var(--n-emerald)"/>
        <circle cx="132" cy="22" r="1.8" fill="var(--n-gold)"/>
        <circle cx="60" cy="88" r="1.8" fill="var(--n-gold)"/>
      </svg>
      <span class="relative grid h-16 w-16 place-items-center rounded-2xl bg-deep text-2xl font-black text-gold-soft shadow-deep">${p.mono}</span>
      <span class="absolute top-3 start-3 rounded-full bg-deep/80 px-3 py-1 text-[0.7rem] font-bold text-gold-soft backdrop-blur-sm">${p.year}</span>
    </div>
    <div class="space-y-2">
      <h3 class="text-xl font-extrabold">${p.title}</h3>
      <p class="text-sm text-ink-faint">${p.industry} — ${p.client}</p>
      <p class="text-sm text-ink-soft leading-7">${p.summary}</p>
    </div>
    <div class="flex flex-wrap gap-2" aria-label="نقش نمو در این پروژه">
      ${p.tags.map((t) => `<span class="rounded-full border border-glassline bg-surface2 px-3 py-1 text-[0.72rem] font-semibold text-gold">${t}</span>`).join('')}
    </div>
    <button type="button" class="btn-ghost mt-auto !py-2.5 text-sm justify-self-start magnetic" data-project-modal="${p.id}">
      شرح همکاری و اطلاعات …
    </button>
  </article>`
}

/* -------------------------------------------------------------------------- */
/* Modal (accessible, focus-trapped, ESC)                                     */
/* -------------------------------------------------------------------------- */
function initModal() {
  const modal = $('#project-modal')
  if (!modal) return
  const dialog = modal.querySelector('.project-dialog')
  const body = modal.querySelector('.project-dialog-body')
  let lastFocus = null

  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const open = (p) => {
    lastFocus = document.activeElement
    body.innerHTML = `
      <div class="space-y-5">
        <div class="flex flex-wrap items-center gap-3">
          <span class="grid h-14 w-14 place-items-center rounded-2xl bg-deep text-xl font-black text-gold-soft">${p.mono}</span>
          <div>
            <h3 class="text-2xl font-extrabold" id="project-modal-title">${p.title}</h3>
            <p class="text-sm text-ink-faint">${p.industry} — ${p.client} — ${p.year}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          ${p.tags.map((t) => `<span class="rounded-full border border-glassline bg-surface2 px-3 py-1 text-[0.72rem] font-semibold text-gold">${t}</span>`).join('')}
        </div>
        <p class="text-ink-soft leading-9">${p.text}</p>
        <a href="contact.html" class="btn-gold shimmer !py-2.5 !px-6 text-sm">درخواست مشاوره مشابه</a>
      </div>`
    modal.classList.add('open')
    document.documentElement.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
    modal.setAttribute('aria-hidden', 'false')
    if (!reducedMotion()) {
      gsap.fromTo(dialog, { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
    }
    dialog.querySelector(FOCUSABLE)?.focus()
  }

  const close = () => {
    if (!modal.classList.contains('open')) return
    const done = () => {
      modal.classList.remove('open')
      document.documentElement.classList.remove('modal-open')
      document.body.style.overflow = ''
      modal.setAttribute('aria-hidden', 'true')
      body.innerHTML = ''
      lastFocus?.focus?.()
    }
    if (!reducedMotion()) {
      gsap.to(dialog, { y: 24, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done })
    } else done()
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project-modal]')
    if (trigger) {
      const p = PROJECTS.find((x) => x.id === trigger.dataset.projectModal)
      if (p) open(p)
      return
    }
    if (e.target.closest('[data-modal-close]')) close()
    if (e.target === modal) close()
  })

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
    if (e.key === 'Tab') {
      const items = $$(FOCUSABLE, dialog).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Filters + search + Flip animations                                         */
/* -------------------------------------------------------------------------- */
function initFilters() {
  const grid = $('#projects-grid')
  if (!grid) return
  grid.innerHTML = PROJECTS.map(cardHTML).join('')

  // reveal cards on scroll
  if (!reducedMotion()) {
    gsap.from('.project-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    })
  }

  let cat = 'all'
  let query = ''
  let industry = 'all'

  const apply = () => {
    const state = Flip.getState('.project-card')
    let visible = 0
    grid.querySelectorAll('.project-card').forEach((card) => {
      const p = PROJECTS.find((x) => x.id === card.querySelector('[data-project-modal]').dataset.projectModal)
      const ok =
        (cat === 'all' || p.category === cat) &&
        (industry === 'all' || p.industry === industry) &&
        (!query || card.dataset.search.includes(query) || card.textContent.includes(query))
      card.style.display = ok ? '' : 'none'
      if (ok) visible++
    })
    const empty = $('#projects-empty')
    if (empty) empty.hidden = visible > 0
    // «۱۸ تجربه همکاری» — total comes from the data-total attribute (owner-editable).
    // While filtering it shows «N از ۱۸ تجربه همکاری».
    const counter = $('#projects-count')
    if (counter) {
      const total = parseInt(counter.dataset.total || String(PROJECTS.length), 10)
      const allVisible = visible === PROJECTS.length
      counter.textContent = allVisible ? `${toFa(total)} تجربه همکاری` : `${toFa(visible)} از ${toFa(total)} تجربه همکاری`
    }
    if (!reducedMotion()) {
      Flip.from(state, {
        duration: 0.55,
        ease: 'power2.inOut',
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
      })
    }
  }

  $$('[data-cat]').forEach((chip) => {
    chip.addEventListener('click', () => {
      cat = chip.dataset.cat
      $$('[data-cat]').forEach((c) => {
        c.classList.toggle('is-on', c === chip)
        c.setAttribute('aria-pressed', String(c === chip))
      })
      apply()
    })
  })

  const search = $('#projects-search')
  search?.addEventListener('input', () => {
    query = search.value.trim()
    apply()
  })

  const select = $('#projects-industry')
  if (select) {
    select.innerHTML = `<option value="all" selected>همه حوزه‌های همکاری</option>` +
      INDUSTRIES.map((i) => `<option value="${i}">${i}</option>`).join('')
    select.addEventListener('change', () => {
      industry = select.value
      apply()
    })
  }

  apply()
}

/* -------------------------------------------------------------------------- */
/* "More projects" — graceful placeholder (no invented data)                  */
/* -------------------------------------------------------------------------- */
function initMore() {
  const btn = $('#projects-more')
  const panel = $('#projects-more-panel')
  if (!btn || !panel) return
  btn.addEventListener('click', () => {
    btn.disabled = true
    panel.hidden = false
    if (!reducedMotion()) {
      gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.7, ease: 'power3.out' })
      gsap.from(panel.children, { y: 14, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' })
    }
  })
}

/* auto-boot (separate classic-script bundle) */
function boot() {
  try {
    initFilters()
    initModal()
    initMore()
  } catch (err) {
    console.error('[nemo projects]', err)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true })
} else {
  boot()
}
