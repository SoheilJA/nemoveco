// UI components: testimonial slider (drag + autoplay + progress),
// client-side forms with animated success state, blog filters.
import { gsap } from 'gsap'
import { $, $$, reducedMotion } from './util.js'

/* -------------------------------------------------------------------------- */
/* Testimonials slider                                                        */
/* -------------------------------------------------------------------------- */
function initTestimonials() {
  const root = $('[data-testimonials]')
  if (!root) return
  const viewport = $('.t-viewport', root)
  const track = $('.t-track', root)
  const slides = $$('.t-slide', track)
  if (!viewport || !track || !slides.length) return

  let index = 0
  let autoplayTimer = null
  let progressTween = null
  const isRTL = true

  const offsetFor = (i) => i * viewport.clientWidth * (isRTL ? 1 : -1)
  const maxIndex = slides.length - 1

  const goTo = (i, animate = true) => {
    index = (i + slides.length) % slides.length
    const offset = offsetFor(index)
    if (animate && !reducedMotion()) {
      gsap.to(track, { x: offset, duration: 0.75, ease: 'power3.inOut' })
    } else {
      gsap.set(track, { x: offset })
    }
    updateDots()
    restartAutoplay()
  }

  const updateDots = () => {
    $$('.t-dot', root).forEach((d, i) => {
      d.classList.toggle('is-on', i === index)
      d.setAttribute('aria-current', String(i === index))
    })
    $$('.t-counter', root).forEach((c) => (c.textContent = `${index + 1} / ${slides.length}`))
  }

  const restartAutoplay = () => {
    clearInterval(autoplayTimer)
    progressTween?.kill()
    const bar = $('.t-progress-bar', root)
    if (bar) gsap.set(bar, { scaleX: 0 })
    if (reducedMotion() || slides.length < 2) return
    autoplayTimer = setInterval(() => goTo(index + 1), 6500)
    if (bar) {
      progressTween = gsap.to(bar, { scaleX: 1, duration: 6.5, ease: 'none' })
    }
  }

  /* drag (pointer events, RTL aware) */
  let startX = 0
  let baseX = 0
  let dragging = false
  let pointerId = null

  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragging = true
    pointerId = e.pointerId
    startX = e.clientX
    baseX = gsap.getProperty(track, 'x')
    track.classList.add('is-dragging')
    viewport.setPointerCapture(e.pointerId)
    clearInterval(autoplayTimer)
    progressTween?.kill()
  })
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pointerId) return
    const dx = e.clientX - startX
    gsap.set(track, { x: baseX + dx * 0.85 })
  })
  const endDrag = (e) => {
    if (!dragging) return
    dragging = false
    track.classList.remove('is-dragging')
    const dx = e.clientX - startX
    const w = viewport.clientWidth
    if (Math.abs(dx) > w * 0.18) {
      // in RTL, dragging right (positive dx) moves forward
      goTo(index + (dx > 0 ? 1 : -1))
    } else {
      goTo(index)
    }
  }
  viewport.addEventListener('pointerup', endDrag)
  viewport.addEventListener('pointercancel', endDrag)

  /* controls */
  $('.t-next', root)?.addEventListener('click', () => goTo(index + 1))
  $('.t-prev', root)?.addEventListener('click', () => goTo(index - 1))
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index + 1) // RTL: left = next
    if (e.key === 'ArrowRight') goTo(index - 1)
  })

  /* pause on hover / focus */
  root.addEventListener('pointerenter', () => {
    clearInterval(autoplayTimer)
    progressTween?.pause()
  })
  root.addEventListener('pointerleave', restartAutoplay)
  root.addEventListener('focusin', () => clearInterval(autoplayTimer))

  /* dots */
  $$('.t-dot', root).forEach((d, i) => d.addEventListener('click', () => goTo(i)))

  /* resize */
  window.addEventListener('resize', () => goTo(index, false))

  goTo(0, false)
}

/* -------------------------------------------------------------------------- */
/* Forms (UI only — no backend)                                               */
/* -------------------------------------------------------------------------- */
const toLatinDigits = (s) =>
  s
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

const PHONE_RE = /^(\+?98|0098|0)?9\d{9}$/

function validateField(input) {
  const wrap = input.closest('[data-field]')
  const value = input.value.trim()
  let ok = true
  let msg = ''

  if (input.required && !value) {
    ok = false
    msg = input.dataset.msgRequired || 'این فیلد الزامی است.'
  } else if (value && input.dataset.type === 'phone') {
    const normalized = toLatinDigits(value).replace(/[\s\-()]/g, '')
    if (!PHONE_RE.test(normalized)) {
      ok = false
      msg = input.dataset.msgInvalid || 'شماره تماس معتبر وارد کنید.'
    }
  } else if (value && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    ok = false
    msg = input.dataset.msgInvalid || 'ایمیل معتبر وارد کنید.'
  }

  if (wrap) {
    wrap.classList.toggle('field-invalid', !ok)
    const m = wrap.querySelector('.field-msg')
    if (m) m.textContent = ok ? '' : msg
    input.setAttribute('aria-invalid', String(!ok))
  }
  return ok
}

function initForms() {
  $$('form[data-form]').forEach((form) => {
    const success = form.querySelector('.form-success')
    const button = form.querySelector('button[type="submit"]')

    form.setAttribute('novalidate', '')

    /* prefill topic from ?topic= query (e.g. solutions «درخواست مشاوره» CTAs) */
    const subjectSelect = form.querySelector('select[name="subject"]')
    if (subjectSelect) {
      const topic = new URLSearchParams(location.search).get('topic')
      if (topic && subjectSelect.querySelector(`option[value="${CSS.escape(topic)}"]`)) {
        subjectSelect.value = topic
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const inputs = $$('input, textarea, select', form)
      const results = inputs.map(validateField)
      const allValid = results.every(Boolean)

      if (!allValid) {
        const firstBad = inputs[results.indexOf(false)]
        firstBad?.focus()
        if (!reducedMotion()) {
          gsap.fromTo(form, { x: 0 }, { x: -8, duration: 0.07, repeat: 5, yoyo: true, ease: 'none', clearProps: 'x' })
        }
        return
      }

      // simulated async submit → animated success state
      if (button) {
        button.disabled = true
        button.dataset.label = button.innerHTML
        button.innerHTML = '<span class="inline-flex items-center gap-2 opacity-80">در حال ثبت …</span>'
      }

      setTimeout(() => {
        success?.classList.add('show')
        if (!reducedMotion() && success) {
          gsap.fromTo(success, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'back.out(1.6)' })
        }
        form.reset()

        setTimeout(() => {
          success?.classList.remove('show')
          if (button) {
            button.disabled = false
            if (button.dataset.label) button.innerHTML = button.dataset.label
          }
        }, 4200)
      }, 900)
    })

    $$('input, textarea, select', form).forEach((input) => {
      input.addEventListener('blur', () => validateField(input))
      input.addEventListener('input', () => {
        const wrap = input.closest('[data-field]')
        if (wrap?.classList.contains('field-invalid')) validateField(input)
      })
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Blog filters + search (blog.html)                                          */
/* -------------------------------------------------------------------------- */
function initBlogFilters() {
  const root = $('[data-blog]')
  if (!root) return
  const cards = $$('.blog-card', root)
  const chips = $$('[data-blog-cat]', root)
  const search = $('[data-blog-search]', root)
  const empty = $('[data-blog-empty]', root)
  let cat = 'all'

  const apply = () => {
    const q = (search?.value || '').trim()
    let visible = 0
    cards.forEach((card) => {
      const inCat = cat === 'all' || card.dataset.category === cat
      const inSearch = !q || (card.dataset.search || '').includes(q) || card.textContent.includes(q)
      const show = inCat && inSearch
      card.hidden = !show
      if (show) {
        visible++
        if (!reducedMotion()) gsap.fromTo(card, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
      }
    })
    if (empty) empty.hidden = visible > 0
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      cat = chip.dataset.blogCat
      chips.forEach((c) => {
        c.classList.toggle('is-on', c === chip)
        c.setAttribute('aria-pressed', String(c === chip))
      })
      apply()
    })
  })
  search?.addEventListener('input', apply)
}

export function initUI() {
  initTestimonials()
  initForms()
  initBlogFilters()
}
