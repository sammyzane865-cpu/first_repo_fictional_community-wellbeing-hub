/* =============================================================
   Community Wellbeing Hub — action.js
   ① Mobile nav
   ② Skip link
   ③ Accordion (services page)
   ④ Wizard multi-step booking
   ⑤ Visual calendar date-picker
   ⑥ Real-time slot availability
   ⑦ Per-field inline validation
   ⑧ Feedback modal (all forms)
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── ① MOBILE NAV ──────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', open);
    });
    navMenu.querySelectorAll('.nav-link').forEach(link =>
      link.addEventListener('click', () => {
        setTimeout(() => {
         navMenu.classList.remove('active');
         navToggle.setAttribute('aria-expanded', 'false');
        },50);
     })
    );
  }

  /* ─── ② SKIP LINK ───────────────────────────────────────── */
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById('mainContent');
      if (target) { target.setAttribute('tabindex','-1'); target.focus(); target.removeAttribute('tabindex'); }
    });
  }

  /* ─── ③ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      const bodyId  = btn.getAttribute('aria-controls');
      const body    = document.getElementById(bodyId);
      const chevron = btn.querySelector('.accordion-chevron');

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        body.classList.add('accordion-body--closed');
        if (chevron) chevron.style.transform = '';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        body.classList.remove('accordion-body--closed');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });

    // Set initial chevron state for open panels
    if (btn.getAttribute('aria-expanded') === 'true') {
      const chevron = btn.querySelector('.accordion-chevron');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  });

  /* ─── ④ WIZARD ──────────────────────────────────────────── */
  let currentStep = 1;
  const totalSteps = 3;

  function showStep(n) {
    for (let i = 1; i <= totalSteps; i++) {
      const panel = document.getElementById('step-' + i);
      const prog  = document.getElementById('prog-' + i);
      if (!panel) continue;
      panel.classList.toggle('active', i === n);
      if (prog) {
        prog.classList.toggle('active',    i === n);
        prog.classList.toggle('completed', i < n);
      }
    }
    currentStep = n;
    // Scroll form into view
    const fc = document.querySelector('.form-container');
    if (fc) fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function populateReview() {
    const name    = document.getElementById('fullName');
    const email   = document.getElementById('email');
    const phone   = document.getElementById('phone');
    const service = document.getElementById('serviceType');
    const date    = document.getElementById('preferredDate');
    const time    = document.getElementById('preferredTime');
    const notes   = document.getElementById('message');

    if (document.getElementById('rev-name'))    document.getElementById('rev-name').textContent    = name?.value    || '—';
    if (document.getElementById('rev-email'))   document.getElementById('rev-email').textContent   = email?.value   || '—';
    if (document.getElementById('rev-phone'))   document.getElementById('rev-phone').textContent   = phone?.value   || '—';
    if (document.getElementById('rev-service')) document.getElementById('rev-service').textContent = service?.options[service.selectedIndex]?.text || '—';
    if (document.getElementById('rev-date'))    document.getElementById('rev-date').textContent    = date?.value
      ? new Date(date.value).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
      : '—';
    if (document.getElementById('rev-time'))    document.getElementById('rev-time').textContent    = time?.options[time.selectedIndex]?.text?.split(' —')[0] || '—';

    const notesRow = document.getElementById('rev-notes-row');
    const notesEl  = document.getElementById('rev-notes');
    if (notesRow && notesEl) {
      if (notes?.value?.trim()) {
        notesEl.textContent  = notes.value.trim();
        notesRow.style.display = 'flex';
      } else {
        notesRow.style.display = 'none';
      }
    }
  }

  const next1 = document.getElementById('next-1');
  const next2 = document.getElementById('next-2');
  const back2 = document.getElementById('back-2');
  const back3 = document.getElementById('back-3');

  if (next1) next1.addEventListener('click', () => {
    const ok = ['fullName','email','phone'].map(id => validateField(id)).every(Boolean);
    if (ok) showStep(2);
  });

  if (next2) next2.addEventListener('click', () => {
    const ok = ['serviceType','preferredDate','preferredTime'].map(id => validateField(id)).every(Boolean);
    if (ok) { populateReview(); showStep(3); }
  });

  if (back2) back2.addEventListener('click', () => showStep(1));
  if (back3) back3.addEventListener('click', () => showStep(2));

  /* ─── ⑤ VISUAL CALENDAR ─────────────────────────────────── */
  const calGrid      = document.getElementById('calGrid');
  const calMonthLbl  = document.getElementById('cal-month-label');
  const calPrev      = document.getElementById('cal-prev');
  const calNext      = document.getElementById('cal-next');

  if (calGrid) {
    let viewYear, viewMonth;
    const today = new Date();
    today.setHours(0,0,0,0);
    viewYear  = today.getFullYear();
    viewMonth = today.getMonth();

    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

    function renderCalendar() {
      calGrid.innerHTML = '';
      calMonthLbl.textContent = MONTHS[viewMonth] + ' ' + viewYear;

      const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      // Empty cells before the 1st
      for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.className = 'cal-cell cal-empty';
        calGrid.appendChild(blank);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(viewYear, viewMonth, d);
        cellDate.setHours(0,0,0,0);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.textContent = d;
        cell.className = 'cal-cell';
        cell.setAttribute('aria-label',
          cellDate.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));

        const isPast   = cellDate < today;
        const isSunday = cellDate.getDay() === 0;

        if (isPast || isSunday) {
          cell.classList.add('cal-disabled');
          cell.disabled = true;
          cell.setAttribute('aria-disabled','true');
          if (isSunday) cell.setAttribute('title','Closed on Sundays');
          if (isPast)   cell.setAttribute('title','Date has passed');
        } else {
          // Check if this cell is selected
          const hiddenDate = document.getElementById('preferredDate');
          if (hiddenDate && hiddenDate.value) {
            const sel = new Date(hiddenDate.value);
            sel.setHours(0,0,0,0);
            if (cellDate.getTime() === sel.getTime()) cell.classList.add('cal-selected');
          }
          if (cellDate.getTime() === today.getTime()) cell.classList.add('cal-today');

          cell.addEventListener('click', () => {
            const hiddenDate = document.getElementById('preferredDate');
            if (hiddenDate) {
              // Format as YYYY-MM-DD
              const y = cellDate.getFullYear();
              const m = String(cellDate.getMonth()+1).padStart(2,'0');
              const dd = String(cellDate.getDate()).padStart(2,'0');
              hiddenDate.value = `${y}-${m}-${dd}`;
            }
            renderCalendar(); // re-render to show selection
            validateField('preferredDate');
            populateSlots(hiddenDate ? hiddenDate.value : null);
          });
        }

        calGrid.appendChild(cell);
      }

      // Prev month button disabled if we're in current month
      if (calPrev) calPrev.disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
    }

    if (calPrev) calPrev.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
    });

    if (calNext) calNext.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
    });

    renderCalendar();
  }

  /* ─── ⑥ SLOT AVAILABILITY ───────────────────────────────── */
  const statusLabel = { available: 'Available', limited: 'Limited spaces', full: 'Fully booked' };

  const slotData = {
    1: { morning:{label:'Morning (8am – 12pm)',status:'available'}, afternoon:{label:'Afternoon (12pm – 4pm)',status:'limited'}, evening:{label:'Evening (4pm – 8pm)',status:'available'} },
    2: { morning:{label:'Morning (8am – 12pm)',status:'limited'},   afternoon:{label:'Afternoon (12pm – 4pm)',status:'full'},    evening:{label:'Evening (4pm – 8pm)',status:'available'} },
    3: { morning:{label:'Morning (8am – 12pm)',status:'available'}, afternoon:{label:'Afternoon (12pm – 4pm)',status:'available'},evening:{label:'Evening (4pm – 8pm)',status:'limited'}   },
    4: { morning:{label:'Morning (8am – 12pm)',status:'full'},      afternoon:{label:'Afternoon (12pm – 4pm)',status:'available'},evening:{label:'Evening (4pm – 8pm)',status:'full'}      },
    5: { morning:{label:'Morning (8am – 12pm)',status:'available'}, afternoon:{label:'Afternoon (12pm – 4pm)',status:'limited'}, evening:{label:'Evening (4pm – 8pm)',status:'available'} },
    6: { morning:{label:'Morning (8am – 12pm)',status:'available'}, afternoon:{label:'Afternoon (12pm – 4pm)',status:'available'},evening:{label:'Evening (4pm – 8pm)',status:'full'}      },
  };

  function populateSlots(dateValue) {
    const timeSelect = document.getElementById('preferredTime');
    const slotPanel  = document.getElementById('slotPanel');
    if (!timeSelect) return;

    timeSelect.innerHTML = '';
    timeSelect.disabled  = true;
    if (slotPanel) slotPanel.style.display = 'none';
    clearState('grp-preferredTime');

    if (!dateValue) { timeSelect.innerHTML = '<option value="">-- Choose a date first --</option>'; return; }

    const dayNum = new Date(dateValue).getDay();
    const slots  = slotData[dayNum];

    if (!slots) { timeSelect.innerHTML = '<option value="">Closed this day</option>'; return; }

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '-- Select a time slot --';
    timeSelect.appendChild(placeholder);

    if (slotPanel) { slotPanel.innerHTML = ''; slotPanel.style.display = 'grid'; }

    let hasAvailable = false;
    Object.entries(slots).forEach(([key, slot]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = slot.status === 'full' ? `${slot.label} — Fully booked` : `${slot.label} — ${statusLabel[slot.status]}`;
      if (slot.status === 'full') opt.disabled = true;
      else hasAvailable = true;
      timeSelect.appendChild(opt);

      if (slotPanel) {
        const card = document.createElement('div');
        card.className = `slot-card slot-card-${slot.status}`;
        card.setAttribute('aria-label', `${slot.label}: ${statusLabel[slot.status]}`);
        card.innerHTML = `
          <span class="slot-card-time">${slot.label.split(' (')[0]}</span>
          <span class="slot-card-hours">${slot.label.match(/\((.+)\)/)?.[1] || ''}</span>
          <span class="slot-card-status slot-status-${slot.status}">${statusLabel[slot.status]}</span>`;
        if (slot.status !== 'full') {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => {
            timeSelect.value = key;
            document.querySelectorAll('.slot-card').forEach(c => c.classList.remove('slot-card-selected'));
            card.classList.add('slot-card-selected');
            validateField('preferredTime');
          });
        }
        slotPanel.appendChild(card);
      }
    });

    if (hasAvailable) timeSelect.disabled = false;
    else timeSelect.innerHTML = '<option value="">No slots available on this date</option>';
  }

  /* ─── ⑦ VALIDATION ──────────────────────────────────────── */
  function setValid(groupId) {
    const grp = document.getElementById(groupId);
    if (!grp) return;
    grp.classList.remove('field-invalid');
    grp.classList.add('field-valid');
    const errEl = grp.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
  }

  function setInvalid(groupId, message) {
    const grp = document.getElementById(groupId);
    if (!grp) return;
    grp.classList.remove('field-valid');
    grp.classList.add('field-invalid');
    const errEl = grp.querySelector('.field-error');
    if (errEl) errEl.textContent = message;
  }

  function clearState(groupId) {
    const grp = document.getElementById(groupId);
    if (!grp) return;
    grp.classList.remove('field-valid','field-invalid');
    const errEl = grp.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
  }

  function validateField(id) {
    const el  = document.getElementById(id);
    if (!el) return true;
    const val = el.value.trim();
    const grpId = 'grp-' + id;

    if (id === 'fullName' || id === 'contactName') {
      if (!val)          { setInvalid(grpId,'Please enter your full name.'); return false; }
      if (val.length < 2){ setInvalid(grpId,'Name must be at least 2 characters.'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'email' || id === 'contactEmail') {
      if (!val) { setInvalid(grpId,'Please enter your email address.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setInvalid(grpId,'Please enter a valid email (e.g. name@example.com).'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'phone') {
      if (!val) { setInvalid(grpId,'Please enter your phone number.'); return false; }
      if (val.replace(/\D/g,'').length < 7) { setInvalid(grpId,'Please enter a valid phone number (at least 7 digits).'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'serviceType') {
      if (!val) { setInvalid(grpId,'Please select a service type.'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'preferredDate') {
      if (!val) { setInvalid(grpId,'Please choose a date from the calendar.'); return false; }
      const chosen = new Date(val); chosen.setHours(0,0,0,0);
      const today2 = new Date();    today2.setHours(0,0,0,0);
      if (chosen < today2) { setInvalid(grpId,'Date cannot be in the past.'); return false; }
      if (chosen.getDay() === 0) { setInvalid(grpId,'We are closed on Sundays.'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'preferredTime') {
      if (!val) { setInvalid(grpId,'Please select an available time slot.'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'contactSubject') {
      if (!val) { setInvalid(grpId,'Please enter a subject.'); return false; }
      setValid(grpId); return true;
    }
    if (id === 'contactMessage') {
      if (!val)           { setInvalid(grpId,'Please write your message.'); return false; }
      if (val.length < 10){ setInvalid(grpId,'Message too short — please add a bit more detail (min 10 characters).'); return false; }
      setValid(grpId); return true;
    }
    return true;
  }

  function attachBlurValidation(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => { if (el.value.trim()) validateField(id); });
      el.addEventListener('input', () => {
        const grp = document.getElementById('grp-' + id);
        if (grp && grp.classList.contains('field-invalid')) validateField(id);
      });
    });
  }

  /* ─── ⑧ MODAL ───────────────────────────────────────────── */
  function generateRef() {
    return 'WH-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  }

  function showModal({ title, body, refLabel }) {
    const overlay = document.getElementById('feedbackOverlay');
    if (!overlay) return;
    document.getElementById('feedbackTitle').textContent    = title;
    document.getElementById('feedbackBody').textContent     = body;
    document.getElementById('feedbackRef').textContent      = generateRef();
    document.getElementById('feedbackRefLabel').textContent = refLabel || 'Reference number';
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    const closeBtn = overlay.querySelector('.feedback-close-btn');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
  }

  window.closeFeedbackModal = function () {
    const overlay = document.getElementById('feedbackOverlay');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  const overlayEl = document.getElementById('feedbackOverlay');
  if (overlayEl) {
    overlayEl.addEventListener('click', e => { if (e.target === overlayEl) window.closeFeedbackModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeFeedbackModal(); });
  }

  /* ─── BOOKING FORM ──────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    attachBlurValidation(['fullName','email','phone','serviceType','preferredTime']);

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      // Consent checkbox
      const consent = document.getElementById('consentCheck');
      const consentErr = document.getElementById('err-consent');
      if (consent && !consent.checked) {
        if (consentErr) consentErr.textContent = 'Please confirm your details are correct before submitting.';
        return;
      }
      if (consentErr) consentErr.textContent = '';

      const service = document.getElementById('serviceType');
      const date    = document.getElementById('preferredDate');
      const time    = document.getElementById('preferredTime');
      const serviceName = service?.options[service.selectedIndex]?.text || 'your service';
      const dateStr = date?.value
        ? new Date(date.value).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
        : 'your date';
      const timeStr = time?.options[time.selectedIndex]?.text?.split(' —')[0] || '';

      showModal({
        title:    'Booking confirmed!',
        body:     `Thank you! We've received your booking for ${serviceName} on ${dateStr} (${timeStr}). We'll be in touch within 24 hours.`,
        refLabel: 'Booking reference',
      });

      bookingForm.reset();
      ['fullName','email','phone','serviceType','preferredDate','preferredTime']
        .forEach(id => clearState('grp-' + id));
      const ts = document.getElementById('preferredTime');
      if (ts) { ts.innerHTML = '<option value="">-- Choose a date first --</option>'; ts.disabled = true; }
      const sp = document.getElementById('slotPanel');
      if (sp) sp.style.display = 'none';
      const hd = document.getElementById('preferredDate');
      if (hd) hd.value = '';
      if (calGrid) renderCalendarAfterReset();
      showStep(1);
    });

    function renderCalendarAfterReset() {
      // Re-render calendar without selection
      const today2 = new Date(); today2.setHours(0,0,0,0);
      const calGridEl = document.getElementById('calGrid');
      if (calGridEl) calGridEl.querySelectorAll('.cal-selected').forEach(c => c.classList.remove('cal-selected'));
    }
  }

  /* ─── CONTACT FORM ──────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactFields = ['contactName','contactEmail','contactSubject','contactMessage'];
    attachBlurValidation(contactFields);
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const results = contactFields.map(id => validateField(id));
      if (!results.every(Boolean)) {
        const first = contactForm.querySelector('.field-invalid input, .field-invalid textarea');
        if (first) first.focus();
        return;
      }
      const nameInput = document.getElementById('contactName');
      const firstName = nameInput ? nameInput.value.trim().split(' ')[0] : 'there';
      showModal({
        title:    `Message sent, ${firstName}!`,
        body:     `Thanks for getting in touch. A member of our team will reply within 24 hours.`,
        refLabel: 'Message reference',
      });
      contactForm.reset();
      contactFields.forEach(id => clearState('grp-' + id));
    });
  }

  /* ─── NEWSLETTER FORM ───────────────────────────────────── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showModal({
        title:    "You're subscribed!",
        body:     "Welcome! You'll receive our latest news, events, and wellness tips straight to your inbox.",
        refLabel: 'Subscriber reference',
      });
      newsletterForm.reset();
    });
  }

});

