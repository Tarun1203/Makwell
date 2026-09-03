// MakWell — shared behavior across pages
document.addEventListener('DOMContentLoaded', async () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Dark mode: default to system preference, in-memory only for this session
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
    });
  }

  // Mobile nav
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
    mainNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') mainNav.classList.remove('open');
    });
  }

  // Mark active nav link based on current page filename
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main a[data-page]').forEach(a => {
    if (a.getAttribute('data-page') === path) a.classList.add('active');
  });

  // Product category tabs (products page)
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });
  }

  // Everything below reads the shared catalog — wait for bootstrap (mock mode
  // resolves this immediately; live mode waits for Firestore to hydrate first).
  if (window.db) await db.ready;

  // District dropdown (contact page), built from the single canonical list
  // in mock-db.js — not hand-typed here, so it can never drift out of sync
  // with whatever the CRM and Service Hub routing use.
  const districtSelect = document.getElementById('ct_district');
  if (districtSelect && window.KARNATAKA_DIVISIONS) {
    const current = districtSelect.value;
    districtSelect.innerHTML = '<option value="">Select…</option>' + KARNATAKA_DIVISIONS.map(div => `
      <optgroup label="${div.name}">${div.districts.map(d => `<option>${d}</option>`).join('')}</optgroup>
    `).join('');
    if (current) districtSelect.value = current;
  }

  // Product -> Model dependent dropdown (contact page), backed by the shared CRM catalog
  const productSelect = document.getElementById('ct_product');
  const modelSelect = document.getElementById('ct_model');
  let populateModels = () => {};
  let categoriesLoaded = [];
  if (productSelect && modelSelect && window.db) {
    db.categories.list().then(categories => {
      categoriesLoaded = categories;
      const current = productSelect.value;
      productSelect.innerHTML = '<option value="">Select…</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      if (current) productSelect.value = current;
    });
    populateModels = async (categoryId) => {
      if (!categoryId) {
        modelSelect.innerHTML = '<option value="">Select a product first…</option>';
        modelSelect.disabled = true;
        return;
      }
      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Loading…</option>';
      const products = await db.products.listByCategory(categoryId);
      modelSelect.innerHTML = '<option value="">Select…</option>' + products.map(p => `<option value="${p.id}">${p.name} (${p.model})</option>`).join('');
    };
    productSelect.addEventListener('change', () => populateModels(productSelect.value));
  }

  // Reason toggle (contact page: general / service / dealer)
  // Serial number lookup (Book a Repair) — checks the public lookup index
  // as they type, so they know before submitting whether it's recognized.
  const serialInput = document.getElementById('ct_serial');
  const serialStatus = document.getElementById('ct_serial_status');
  if (serialInput && serialStatus && window.db) {
    let lookupTimer;
    serialInput.addEventListener('input', () => {
      clearTimeout(lookupTimer);
      const value = serialInput.value.trim();
      if (!value) { serialStatus.textContent = ''; return; }
      serialStatus.textContent = 'Checking…';
      serialStatus.style.color = 'var(--text-mute)';
      lookupTimer = setTimeout(async () => {
        const result = await db.serials.publicLookup(value);
        if (result.found) {
          serialStatus.textContent = '✓ Found — this matches a product on file.';
          serialStatus.style.color = 'var(--green)';
        } else {
          serialStatus.textContent = "Not found yet — that's fine, we'll verify it when we review your request.";
          serialStatus.style.color = 'var(--text-mute)';
        }
      }, 500);
    });
  }

  const reasonBtns = document.querySelectorAll('.reason-btn');
  const reasonField = document.getElementById('ct_reason');
  const serviceFields = document.getElementById('serviceOnlyFields');
  if (reasonBtns.length) {
    const applyReason = (btn) => {
      reasonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (reasonField) reasonField.value = btn.dataset.reason;
      if (serviceFields) serviceFields.style.display = btn.dataset.reason === 'Service Request' ? 'block' : 'none';
    };
    reasonBtns.forEach(btn => btn.addEventListener('click', () => applyReason(btn)));

    // Preselect from ?reason=service / ?reason=dealer / ?reason=general
    const params = new URLSearchParams(location.search);
    const wanted = params.get('reason');
    const map = { service: 'Service Request', dealer: 'Dealer / Partner Enquiry', general: 'General Enquiry' };
    if (wanted && map[wanted]) {
      const match = Array.from(reasonBtns).find(b => b.dataset.reason === map[wanted]);
      if (match) applyReason(match);
    }
    const productParam = params.get('product');
    if (productParam && productSelect && window.db) {
      db.categories.list().then(categories => {
        const match = categories.find(c => c.name.toLowerCase() === decodeURIComponent(productParam).toLowerCase());
        if (match) { productSelect.value = match.id; populateModels(match.id); }
      });
    }
  }

  // Contact form: real submission into the shared CRM data layer.
  // Creates/finds a Customer by phone, logs a Website Lead, and — for
  // Service Request enquiries — creates an actual Service Hub record.
  const contactForm = document.getElementById('contactForm');
  if (contactForm && window.db) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(el => {
        const wrap = el.closest('.field');
        const filled = el.value && el.value.trim() !== '';
        if (!filled) { valid = false; wrap.classList.add('has-error'); }
        else { wrap.classList.remove('has-error'); }
      });
      if (!valid) return;

      const submitBtn = contactForm.querySelector('button[type=submit]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const reason = document.getElementById('ct_reason').value;
      const categoryId = document.getElementById('ct_product').value;
      const productId = document.getElementById('ct_model') ? document.getElementById('ct_model').value : '';
      const district = document.getElementById('ct_district') ? document.getElementById('ct_district').value : '';
      const serialEl = document.getElementById('ct_serial');
      const serialNumber = serialEl ? serialEl.value.trim() : '';

      const lead = await db.websiteLeads.add({
        name: document.getElementById('ct_name').value.trim(),
        phone: document.getElementById('ct_mobile').value.trim(),
        reason, categoryId, productId, district, serialNumber,
        message: document.getElementById('ct_message').value.trim()
      });

      const shell = document.getElementById('contactFormShell');
      let extra = '';
      let refNumber = '';
      if (lead.serviceRequestId) {
        const sr = await db.service.get(lead.serviceRequestId);
        refNumber = sr.requestNumber;
      } else {
        refNumber = lead.leadNumber;
      }
      if (refNumber) {
        extra = `<div class="id-pill" style="display:inline-block; margin-top:14px; background:var(--navy); color:var(--on-navy); font-family:'IBM Plex Mono'; font-size:15px; padding:10px 18px; border-radius:8px;">${refNumber}</div><p style="color:var(--text-soft); font-size:12.5px; margin-top:10px;">Save this reference — our team will reach out shortly.</p>`;
      }
      shell.innerHTML = `
        <div class="success-box">
          <div class="check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h3 style="font-size:18px;">Message sent</h3>
          <p style="color:var(--text-soft); font-size:14px; margin-top:8px;">Thanks for reaching out — our team will get back to you shortly, usually within a working day.</p>
          ${extra}
        </div>`;
    });
  }

  // Generic form validation + mock submit (for any other form using this pattern)
  document.querySelectorAll('form[data-mock-submit]:not(#contactForm)').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(el => {
        const wrap = el.closest('.field');
        const filled = el.type === 'file' ? true : el.value && el.value.trim() !== '';
        if (!filled) { valid = false; wrap.classList.add('has-error'); }
        else { wrap.classList.remove('has-error'); }
      });
      if (!valid) return;
      const shellId = form.dataset.mockSubmit;
      const shell = document.getElementById(shellId);
      if (!shell) return;
      shell.innerHTML = `
        <div class="success-box">
          <div class="check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h3 style="font-size:18px;">Message sent</h3>
          <p style="color:var(--text-soft); font-size:14px; margin-top:8px;">Thanks for reaching out — our team will get back to you shortly, usually within a working day.</p>
        </div>`;
    });
  });
});
