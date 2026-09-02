/* =======================================================================
   MAKWELL CRM — app shell: session, routing, sidebar, and Phase 1 screens
   ======================================================================= */

// ---------- Session ----------
// Populated in the DOMContentLoaded handler below from db.auth.onReady() —
// the actual verified Firebase session, not anything guessable from the URL.
const SESSION = { uid: null, name: null, email: null, role: null };

// ---------- Icons ----------
const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  customers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  category: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  product: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  serial: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="10" rx="1"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="11" y1="7" x2="11" y2="17"/><line x1="15" y1="7" x2="15" y2="17"/></svg>`,
  warranty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a5.5 5.5 0 0111 0"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
  chevron: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  service: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 10-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 005.4-5.4z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V6l7-4 7 4v15"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 10-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 005.4-5.4z"/></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  part: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 10-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 005.4-5.4z"/></svg>`,
  warehouse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V10l9-6 9 6v11"/><path d="M3 21h18"/><rect x="9" y="13" width="6" height="8"/></svg>`,
  move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
  pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="6" height="6" rx="1"/><rect x="16" y="7" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M8 10h8M12 13v3M5 13v3M19 13v3"/></svg>`,
  estimate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`,
  invoice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>`,
  receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>`,
  rma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="7" y1="13" x2="15" y2="13"/><line x1="7" y1="16" x2="12" y2="16"/></svg>`,
  message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  approvals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`
};

// ---------- Sidebar nav per role ----------
const NAV_BY_ROLE = {
  'Super Admin': [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Customers', route: '/customers', icon: 'customers' },
    { label: 'Categories', route: '/categories', icon: 'category' },
    { label: 'Products & Models', route: '/products', icon: 'product' },
    { label: 'Serial / Batch', route: '/serials', icon: 'serial' },
    { label: 'Warranty Rules', route: '/warranty', icon: 'warranty' },
    { label: 'Service Hub', route: '/service', icon: 'service' },
    { label: 'Scheduling', route: '/scheduling', icon: 'calendar' },
    { label: 'Service Centers', route: '/service-centers', icon: 'building' },
    { label: 'Technicians', route: '/technicians', icon: 'wrench' },
    { label: 'Spare Parts', route: '/spare-parts', icon: 'part' },
    { label: 'Warehouse Stock', route: '/warehouse', icon: 'warehouse' },
    { label: 'Stock Movement', route: '/stock-movements', icon: 'move' },
    { label: 'Spare Requests', route: '/spare-requests', icon: 'pipeline' },
    { label: 'Estimates', route: '/estimates', icon: 'estimate' },
    { label: 'Invoices', route: '/invoices', icon: 'invoice' },
    { label: 'Local Purchase', route: '/local-purchases', icon: 'receipt' },
    { label: 'RMA & Replacement', route: '/rma', icon: 'rma' },
    { label: 'Templates', route: '/templates', icon: 'template' },
    { label: 'Communication Log', route: '/messages', icon: 'message' },
    { label: 'Reports & Analytics', route: '/reports', icon: 'reports' },
    { label: 'Website Leads', route: '/website-leads', icon: 'globe' },
    { label: 'SLA & Escalation', route: '/sla', icon: 'alert' },
    { label: 'Approvals', route: '/approvals', icon: 'approvals' },
    { label: 'Users & Roles', route: '/users', icon: 'users' }
  ],
  'Warehouse': [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Serial / Batch', route: '/serials', icon: 'serial' },
    { label: 'Spare Parts', route: '/spare-parts', icon: 'part' },
    { label: 'Warehouse Stock', route: '/warehouse', icon: 'warehouse' },
    { label: 'Stock Movement', route: '/stock-movements', icon: 'move' },
    { label: 'Spare Requests', route: '/spare-requests', icon: 'pipeline' },
    { label: 'Profile', route: '/profile', icon: 'profile' }
  ],
  'Service Center': [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Service Hub', route: '/service', icon: 'service' },
    { label: 'Scheduling', route: '/scheduling', icon: 'calendar' },
    { label: 'Technicians', route: '/technicians', icon: 'wrench' },
    { label: 'Center Stock', route: '/my-stock', icon: 'warehouse' },
    { label: 'Spare Requests', route: '/spare-requests', icon: 'pipeline' },
    { label: 'Estimates', route: '/estimates', icon: 'estimate' },
    { label: 'Invoices', route: '/invoices', icon: 'invoice' },
    { label: 'Local Purchase', route: '/local-purchases', icon: 'receipt' },
    { label: 'RMA & Replacement', route: '/rma', icon: 'rma' },
    { label: 'Communication Log', route: '/messages', icon: 'message' },
    { label: 'Website Leads', route: '/website-leads', icon: 'globe' },
    { label: 'SLA & Escalation', route: '/sla', icon: 'alert' },
    { label: 'Profile', route: '/profile', icon: 'profile' }
  ],
  'Technician': [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'My Jobs', route: '/service', icon: 'service' },
    { label: 'My Spare Bag', route: '/my-stock', icon: 'warehouse' },
    { label: 'Spare Requests', route: '/spare-requests', icon: 'pipeline' },
    { label: 'Local Purchase', route: '/local-purchases', icon: 'receipt' },
    { label: 'RMA & Replacement', route: '/rma', icon: 'rma' },
    { label: 'Profile', route: '/profile', icon: 'profile' }
  ],
  'Dealer': [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Customers', route: '/customers', icon: 'customers' },
    { label: 'Sales & Orders', route: '#', icon: 'product', disabled: true, note: 'Phase 3' },
    { label: 'Profile', route: '/profile', icon: 'profile' }
  ]
};

function renderSidebar() {
  const nav = NAV_BY_ROLE[SESSION.role] || NAV_BY_ROLE['Dealer'];
  document.getElementById('sidebarRole').textContent = SESSION.role ? SESSION.role + ' console' : 'Loading…';
  document.getElementById('sidebarNav').innerHTML = nav.map(item => {
    if (item.disabled) {
      return `<a class="nav-link disabled" title="Coming in ${item.note}">${ICONS[item.icon]}<span>${item.label}</span><span style="margin-left:auto; font-size:10px;">${item.note}</span></a>`;
    }
    return `<a href="#${item.route}" class="nav-link" data-route="${item.route}">${ICONS[item.icon]}<span>${item.label}</span></a>`;
  }).join('');

  document.getElementById('userName').textContent = SESSION.name;
  document.getElementById('userRole').textContent = SESSION.email;
  document.getElementById('userAvatar').textContent = (SESSION.name || '?').trim().charAt(0).toUpperCase();
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link[data-route]').forEach(a => {
    a.classList.toggle('active', path.startsWith(a.dataset.route));
  });
}

// ---------- Modal helpers ----------
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');
function openModal(html) {
  modalBody.innerHTML = html;
  modalBackdrop.classList.remove('hidden');
}
function closeModal() {
  modalBackdrop.classList.add('hidden');
  modalBody.innerHTML = '';
}
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

function validateModalForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(el => {
    const wrap = el.closest('.field');
    if (!el.value || !el.value.trim()) { valid = false; wrap.classList.add('has-error'); }
    else wrap.classList.remove('has-error');
  });
  return valid;
}

// ---------- Router ----------
const routes = {};
function route(path, fn) { routes[path] = fn; }
const dynamicRoutes = [];
function dynroute(pattern, fn) { dynamicRoutes.push({ pattern, fn }); }

function matchRoute(path) {
  if (routes[path]) return { fn: routes[path], params: {} };
  const parts = path.split('/').filter(Boolean);
  for (const d of dynamicRoutes) {
    const dparts = d.pattern.split('/').filter(Boolean);
    if (dparts.length !== parts.length) continue;
    let ok = true, p = {};
    for (let i = 0; i < dparts.length; i++) {
      if (dparts[i].startsWith(':')) p[dparts[i].slice(1)] = decodeURIComponent(parts[i]);
      else if (dparts[i] !== parts[i]) { ok = false; break; }
    }
    if (ok) return { fn: d.fn, params: p };
  }
  return null;
}

const pageEl = document.getElementById('page');
const titleEl = document.getElementById('topbarTitle');
async function render() {
  const path = (location.hash.slice(1) || '/dashboard').split('?')[0];
  updateActiveNav(path);
  const m = matchRoute(path);
  if (!m) { pageEl.innerHTML = `<div class="empty-state"><p>Page not found.</p></div>`; return; }
  pageEl.innerHTML = `<div class="empty-state"><p>Loading…</p></div>`;
  await m.fn(m.params);
}
window.addEventListener('hashchange', render);

// ---------- Shared UI bits ----------
function pill(text, tone) { return `<span class="pill pill-${tone}">${text}</span>`; }
function statusPill(status) {
  const map = { Active: 'green', Inactive: 'gray', 'In Stock': 'blue', Sold: 'amber', Registered: 'green', 'Pending Approval': 'amber', Rejected: 'red' };
  return pill(status, map[status] || 'gray');
}
function fmtDate(d) { return d || '—'; }

// =======================================================================
// DASHBOARD
// =======================================================================
route('/dashboard', async () => {
  titleEl.textContent = 'Dashboard';
  const [customers, products, categories, serials, users, requests, spareRequests, invoices, rmas] = await Promise.all([
    db.customers.list(), db.products.list(), db.categories.list(), db.serials.list(), db.users.list(), db.service.list(), db.spareRequests.list(), db.invoices.list(), db.rma.list()
  ]);
  const openRequests = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
  const pendingSpareRequests = spareRequests.filter(r => r.status === 'Requested' || r.status === 'Approved');
  const unpaidInvoices = invoices.filter(i => i.status !== 'Paid');
  const outstandingTotal = unpaidInvoices.reduce((sum, i) => { const t = calcTotals(i.items, i.laborCharge); return sum + (t.total - i.amountPaid); }, 0);
  const openRmas = rmas.filter(r => r.status !== 'Closed');
  const breachedSlaCount = openRequests.filter(r => db.sla.computeStatus(r).status === 'Breached').length;
  const pendingApprovals = await db.approvals.listPending();
  const isAdmin = SESSION.role === 'Super Admin';
  pageEl.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Welcome back, ${SESSION.name.split(' ')[0]}</h2>
        <p>${SESSION.role} console — MakWell CRM, Phase 1 + 2 (Foundation, Service)</p>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-card"><div class="lbl">Customers</div><strong>${customers.length}</strong></div>
      <div class="stat-card"><div class="lbl">Open Service Requests</div><strong>${openRequests.length}</strong></div>
      <div class="stat-card"><div class="lbl">Pending Spare Requests</div><strong>${pendingSpareRequests.length}</strong></div>
      <div class="stat-card"><div class="lbl">Outstanding Balance</div><strong>${money(outstandingTotal)}</strong></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Phase scope so far</h3></div>
      <p style="font-size:13.5px; color:var(--text-soft); line-height:1.7;">
        Foundation: auth &amp; roles, users, customers, product categories, products &amp; models with dynamic attributes, serial/batch records, warranty rules. Service: Service Hub, district-based routing, technician assignment, scheduling, visit/diagnosis, installation tracking. Inventory: spare parts master, warehouse &amp; field stock, transfers, request-to-dispatch pipeline. Finance: estimates, invoices with GST, payment tracking, local purchase reimbursements. RMA &amp; Replacement: inspection-driven replacement, refund, or escalation back to service. Communication: templates and an auto-triggered log across Service, Finance and RMA, plus manual sends. Reports &amp; Analytics: revenue, resolution time, stock value and RMA rate, computed live from everything above. The rest arrive in later phases — sidebar items for those still show a "Coming in Phase N" tag where relevant.
      </p>
    </div>
    ${breachedSlaCount > 0 ? `<div class="note" style="border-color:var(--red-soft); background:var(--red-soft); color:var(--red); margin-bottom:12px;">${breachedSlaCount} open service request${breachedSlaCount !== 1 ? 's have' : ' has'} breached its SLA target. <a href="#/sla" style="color:var(--red); font-weight:600;">View SLA &amp; Escalation →</a></div>` : ''}
    ${pendingApprovals.length > 0 ? `<div class="note" style="margin-bottom:20px;">${pendingApprovals.length} approval${pendingApprovals.length !== 1 ? 's' : ''} awaiting sign-off. <a href="#/approvals" style="color:var(--accent-text); font-weight:600;">Go to Approvals →</a></div>` : ''}
    ${openRmas.length ? `
    <div class="panel">
      <div class="panel-head"><h3>Open RMA requests</h3><a href="#/rma" class="btn btn-ghost btn-sm">View RMA &amp; Replacement</a></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>RMA No.</th><th>Resolution</th><th>Status</th></tr></thead>
        <tbody>${openRmas.slice(0, 5).map(r => `<tr style="cursor:pointer" data-goto="/rma/${r.id}"><td class="cell-mono cell-strong">${r.rmaNumber}</td><td>${r.resolutionType || '—'}</td><td>${rmaStatusPill(r.status)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>` : ''}
    ${openRequests.length ? `
    <div class="panel">
      <div class="panel-head"><h3>Open service requests</h3><a href="#/service" class="btn btn-ghost btn-sm">View Service Hub</a></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Request No.</th><th>Type</th><th>District</th><th>Status</th></tr></thead>
        <tbody>
          ${openRequests.slice(0, 5).map(r => `<tr style="cursor:pointer" data-goto="/service/${r.id}"><td class="cell-mono cell-strong">${r.requestNumber}</td><td><span class="role-badge">${r.type}</span></td><td>${r.district}</td><td>${statusPill2(r.status)}</td></tr>`).join('')}
        </tbody>
      </table></div>
    </div>` : ''}
    ${isAdmin ? `
    <div class="panel">
      <div class="panel-head"><h3>Recently added users</h3></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>
          ${users.slice(-5).reverse().map(u => `<tr><td class="cell-strong">${u.name}</td><td class="cell-mono">${u.email}</td><td><span class="role-badge">${u.role}</span></td><td>${statusPill(u.status)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''}
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
});

// =======================================================================
// PROFILE (non-admin roles)
// =======================================================================
route('/profile', async () => {
  titleEl.textContent = 'Profile';
  pageEl.innerHTML = `
    <div class="page-head"><div><h2>Your profile</h2><p>Account details for this session</p></div></div>
    <div class="panel" style="max-width:480px;">
      <div class="field"><label>Name</label><input value="${SESSION.name}" disabled></div>
      <div class="field"><label>Email</label><input value="${SESSION.email}" disabled></div>
      <div class="field"><label>Role</label><input value="${SESSION.role}" disabled></div>
      <p class="hint">Editable profile settings and password management arrive with full Firebase Auth in a later pass.</p>
    </div>
  `;
});

// =======================================================================
// CUSTOMERS
// =======================================================================
route('/customers', async () => {
  titleEl.textContent = 'Customers';
  const customers = await db.customers.list();
  renderCustomersList(customers, '');
});

function renderCustomersList(customers, query) {
  const q = query.trim().toLowerCase();
  const filtered = q ? customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)) : customers;
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Customers</h2><p>${customers.length} total · permanent Customer ID, phone used for search &amp; duplicate detection</p></div>
      <button class="btn btn-primary" id="btnAddCustomer">${ICONS.plus} Add Customer</button>
    </div>
    <div class="toolbar">
      <div class="search">${ICONS.search}<input id="customerSearch" placeholder="Search by name or phone…" value="${query}"></div>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Phone</th><th>City / District</th><th>Dealer</th><th>Status</th><th>Added</th></tr></thead>
        <tbody>
          ${filtered.map(c => `
            <tr style="cursor:pointer" data-goto="/customers/${c.id}">
              <td class="cell-strong">${c.name}</td>
              <td class="cell-mono">${c.phone}</td>
              <td>${c.city}${c.district ? ', ' + c.district : ''}</td>
              <td>${c.dealer || '—'}</td>
              <td>${statusPill(c.status)}</td>
              <td class="cell-mono">${fmtDate(c.createdAt)}</td>
            </tr>`).join('') || `<tr><td colspan="6" class="table-empty">No customers match "${query}".</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => {
    tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto);
  });
  document.getElementById('customerSearch').addEventListener('input', (e) => renderCustomersList(customers, e.target.value));
  document.getElementById('btnAddCustomer').addEventListener('click', () => openAddCustomerModal());
}

async function openAddCustomerModal() {
  openModal(`
    <div class="modal-head"><h3>Add Customer</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="customerForm" novalidate>
      <div class="form-row">
        <div class="field" data-field="name"><label>Customer Name <span class="req">*</span></label><input id="cf_name" required><div class="error">Required.</div></div>
        <div class="field" data-field="phone"><label>Mobile <span class="req">*</span></label><input id="cf_phone" required placeholder="10-digit mobile"><div class="error">Required.</div></div>
      </div>
      <div id="dupeWarning"></div>
      <div class="form-row">
        <div class="field"><label>City</label><input id="cf_city"></div>
        <div class="field"><label>District</label><input id="cf_district"></div>
      </div>
      <div class="field"><label>Dealer</label><input id="cf_dealer" placeholder="Dealer name (optional)"></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Customer</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);

  const phoneInput = document.getElementById('cf_phone');
  phoneInput.addEventListener('blur', async () => {
    const val = phoneInput.value.trim();
    if (!val) return;
    const matches = await db.customers.findByPhone(val);
    const box = document.getElementById('dupeWarning');
    box.innerHTML = matches.length
      ? `<div class="note" style="border-color:var(--red-soft); background:var(--red-soft); color:var(--red); margin-bottom:16px;">Possible duplicate: ${matches.map(m => m.name).join(', ')} already uses this number.</div>`
      : '';
  });

  document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    await db.customers.add({
      name: document.getElementById('cf_name').value.trim(),
      phone: document.getElementById('cf_phone').value.trim(),
      city: document.getElementById('cf_city').value.trim(),
      district: document.getElementById('cf_district').value.trim(),
      dealer: document.getElementById('cf_dealer').value.trim(),
      email: ''
    });
    closeModal();
    render();
  });
}

dynroute('/customers/:id', async (p) => {
  await renderCustomer360(p.id, 'overview');
});

async function renderCustomer360(id, activeTab) {
  const c = await db.customers.get(id);
  titleEl.textContent = 'Customer 360';
  if (!c) { pageEl.innerHTML = `<div class="empty-state"><p>Customer not found.</p></div>`; return; }
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'service', label: 'Service History' },
    { id: 'finance', label: 'Finance' },
    { id: 'rma', label: 'RMA' },
    { id: 'communication', label: 'Communication' }
  ];

  pageEl.innerHTML = `
    <div class="crumb"><a href="#/customers">Customers</a> / ${c.name}</div>
    <div class="page-head">
      <div><h2>${c.name}</h2><p class="cell-mono" style="color:var(--text-soft);">Customer ID: ${c.id}</p></div>
      ${statusPill(c.status)}
    </div>
    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
    <div id="custTabContent"></div>
  `;
  await renderCustomerTab(activeTab, c, canManage);
  pageEl.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => renderCustomer360(id, btn.dataset.tab)));
}

async function renderCustomerTab(tab, c, canManage) {
  const el = document.getElementById('custTabContent');
  if (tab === 'overview') {
    el.innerHTML = `
      <div class="panel" style="max-width:520px;">
        <div class="panel-head"><h3>Overview</h3></div>
        <table class="data" style="min-width:0;">
          <tbody>
            <tr><td style="color:var(--text-soft); width:40%;">Phone</td><td class="cell-mono">${c.phone}</td></tr>
            <tr><td style="color:var(--text-soft);">Email</td><td>${c.email || '—'}</td></tr>
            <tr><td style="color:var(--text-soft);">City</td><td>${c.city || '—'}</td></tr>
            <tr><td style="color:var(--text-soft);">District</td><td>${c.district || '—'}</td></tr>
            <tr><td style="color:var(--text-soft);">Dealer</td><td>${c.dealer || '—'}</td></tr>
            <tr><td style="color:var(--text-soft);">Added</td><td class="cell-mono">${fmtDate(c.createdAt)}</td></tr>
          </tbody>
        </table>
      </div>`;
  } else if (tab === 'service') {
    const requests = (await db.service.list()).filter(r => r.customerId === c.id);
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Service history (${requests.length})</h3></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Request No.</th><th>Type</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>${requests.map(r => `<tr style="cursor:pointer" data-goto="/service/${r.id}"><td class="cell-mono cell-strong">${r.requestNumber}</td><td><span class="role-badge">${r.type}</span></td><td>${statusPill2(r.status)}</td><td class="cell-mono">${r.createdAt}</td></tr>`).join('') || `<tr><td colspan="4" class="table-empty">No service history yet.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    el.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  } else if (tab === 'finance') {
    const [estimates, invoices] = await Promise.all([db.estimates.list(), db.invoices.list()]);
    const myEstimates = estimates.filter(e => e.customerId === c.id);
    const myInvoices = invoices.filter(i => i.customerId === c.id);
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Estimates (${myEstimates.length})</h3></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estimate No.</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>${myEstimates.map(e => { const t = calcTotals(e.items, e.laborCharge); return `<tr style="cursor:pointer" data-goto="/estimates/${e.id}"><td class="cell-mono cell-strong">${e.estimateNumber}</td><td class="cell-mono">${money(t.total)}</td><td>${financeStatusPill(e.status)}</td></tr>`; }).join('') || `<tr><td colspan="3" class="table-empty">No estimates yet.</td></tr>`}</tbody>
        </table></div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Invoices (${myInvoices.length})</h3></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Invoice No.</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
          <tbody>${myInvoices.map(i => { const t = calcTotals(i.items, i.laborCharge); return `<tr style="cursor:pointer" data-goto="/invoices/${i.id}"><td class="cell-mono cell-strong">${i.invoiceNumber}</td><td class="cell-mono">${money(t.total)}</td><td class="cell-mono">${money(i.amountPaid)}</td><td>${financeStatusPill(i.status)}</td></tr>`; }).join('') || `<tr><td colspan="4" class="table-empty">No invoices yet.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    el.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  } else if (tab === 'rma') {
    const rmas = (await db.rma.list()).filter(r => r.customerId === c.id);
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>RMA history (${rmas.length})</h3></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>RMA No.</th><th>Resolution</th><th>Status</th></tr></thead>
          <tbody>${rmas.map(r => `<tr style="cursor:pointer" data-goto="/rma/${r.id}"><td class="cell-mono cell-strong">${r.rmaNumber}</td><td>${r.resolutionType || '—'}</td><td>${rmaStatusPill(r.status)}</td></tr>`).join('') || `<tr><td colspan="3" class="table-empty">No RMA history.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    el.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  } else if (tab === 'communication') {
    const messages = await db.messages.listByCustomer(c.id);
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Communication (${messages.length})</h3>${canManage ? `<button class="btn btn-primary btn-sm" id="btnSendFromCustomer">${ICONS.plus} Send Message</button>` : ''}</div>
        ${messages.map(m => `
          <div style="padding:10px 0; border-bottom:1px dashed var(--border-soft);">
            <div style="display:flex; justify-content:space-between; gap:10px;">
              <span>${channelPill(m.channel)}</span>
              <span class="hint">${m.createdAt} · ${m.sentBy}</span>
            </div>
            <p style="font-size:13.5px; margin-top:6px;">${m.body}</p>
          </div>`).join('') || '<p class="hint">No messages sent yet.</p>'}
      </div>`;
    const sendBtn = document.getElementById('btnSendFromCustomer');
    if (sendBtn) sendBtn.addEventListener('click', async () => {
      const customers = await db.customers.list();
      openSendMessageModal(customers, () => renderCustomer360(c.id, 'communication'), c.id);
    });
  }
}

// =======================================================================
// CATEGORIES
// =======================================================================
route('/categories', async () => {
  titleEl.textContent = 'Product Categories';
  const [categories, products] = await Promise.all([db.categories.list(), db.products.list()]);
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Product Categories</h2><p>Super Admin can add categories without touching the website or CRM code.</p></div>
      <button class="btn btn-primary" id="btnAddCategory">${ICONS.plus} Add Category</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Category</th><th># Products</th><th>Status</th><th>Added</th><th></th></tr></thead>
        <tbody>
          ${categories.map(c => `
            <tr style="cursor:pointer" data-goto="/categories/${c.id}">
              <td class="cell-strong">${c.name}</td>
              <td>${products.filter(p => p.categoryId === c.id).length}</td>
              <td>${statusPill(c.status)}</td>
              <td class="cell-mono">${fmtDate(c.createdAt)}</td>
              <td>${ICONS.chevron}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  document.getElementById('btnAddCategory').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Add Category</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="catForm" novalidate>
        <div class="field" data-field="name"><label>Category Name <span class="req">*</span></label><input id="cat_name" required placeholder="e.g. Air Cooler"><div class="error">Required.</div></div>
        <p class="hint">New categories start with no dynamic attributes and a default 1-year full-product warranty — both editable from the category page after creation.</p>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Category</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('catForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.categories.add(document.getElementById('cat_name').value.trim());
      closeModal();
      render();
    });
  });
});

dynroute('/categories/:id', async (p) => {
  titleEl.textContent = 'Category';
  const [cat, products, rule] = await Promise.all([db.categories.get(p.id), db.products.listByCategory(p.id), db.warranty.getRule(p.id)]);
  if (!cat) { pageEl.innerHTML = `<div class="empty-state"><p>Category not found.</p></div>`; return; }
  pageEl.innerHTML = `
    <div class="crumb"><a href="#/categories">Categories</a> / ${cat.name}</div>
    <div class="page-head"><div><h2>${cat.name}</h2><p>${products.length} product${products.length !== 1 ? 's' : ''} · ${statusPill(cat.status)}</p></div></div>

    <div class="panel">
      <div class="panel-head"><h3>Dynamic attributes</h3></div>
      ${cat.attributes.length ? `
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Label</th><th>Key</th><th>Type</th><th>Options</th></tr></thead>
          <tbody>${cat.attributes.map(a => `<tr><td class="cell-strong">${a.label}</td><td class="cell-mono">${a.key}</td><td>${a.type}</td><td>${a.options ? a.options.join(', ') : '—'}</td></tr>`).join('')}</tbody>
        </table></div>` : `<p class="hint">No attributes defined yet — products in this category use only name and model.</p>`}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Warranty rule</h3></div>
      ${rule && rule.components.length ? rule.components.map(c => `
        <div class="warranty-row"><span class="name">${c.name}</span><span class="cell-mono">${c.years} year${c.years !== 1 ? 's' : ''}</span></div>
      `).join('') : `<p class="hint">No warranty rule set.</p>`}
      <p class="hint" style="margin-top:10px;">Component-level warranty (e.g. Washing Machine's separate spin/wash motor cover) is managed from Warranty Rules.</p>
      <a href="#/warranty" class="btn btn-ghost btn-sm" style="margin-top:10px;">Edit in Warranty Rules →</a>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Products in this category</h3><a href="#/products" class="btn btn-ghost btn-sm">View all products</a></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Model</th><th>Name</th><th>Status</th></tr></thead>
        <tbody>${products.map(pr => `<tr><td class="cell-mono">${pr.model}</td><td>${pr.name}</td><td>${statusPill(pr.status)}</td></tr>`).join('') || `<tr><td colspan="3" class="table-empty">No products yet.</td></tr>`}</tbody>
      </table></div>
    </div>
  `;
});

// =======================================================================
// PRODUCTS & MODELS
// =======================================================================
route('/products', async () => {
  titleEl.textContent = 'Products & Models';
  const [products, categories] = await Promise.all([db.products.list(), db.categories.list()]);
  renderProductsList(products, categories, '');
});

function renderProductsList(products, categories, filterCat) {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
  const filtered = filterCat ? products.filter(p => p.categoryId === filterCat) : products;
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Products &amp; Models</h2><p>${products.length} models across ${categories.length} categories</p></div>
      <button class="btn btn-primary" id="btnAddProduct">${ICONS.plus} Add Product</button>
    </div>
    <div class="tabs">
      <button class="tab-btn2 ${!filterCat ? 'active' : ''}" data-cat="">All</button>
      ${categories.map(c => `<button class="tab-btn2 ${filterCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>`).join('')}
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Model</th><th>Name</th><th>Category</th><th>Attributes</th><th>Status</th></tr></thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td class="cell-mono cell-strong">${p.model}</td>
              <td>${p.name}</td>
              <td><span class="role-badge">${catMap[p.categoryId] || '—'}</span></td>
              <td style="font-size:12px; color:var(--text-soft);">${Object.entries(p.attrs || {}).map(([k, v]) => `${k}: ${v}`).join(' · ') || '—'}</td>
              <td>${statusPill(p.status)}</td>
            </tr>`).join('') || `<tr><td colspan="5" class="table-empty">No products in this category yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => renderProductsList(products, categories, btn.dataset.cat));
  });
  document.getElementById('btnAddProduct').addEventListener('click', () => openAddProductModal(categories));
}

function openAddProductModal(categories) {
  openModal(`
    <div class="modal-head"><h3>Add Product</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="productForm" novalidate>
      <div class="field" data-field="categoryId">
        <label>Category <span class="req">*</span></label>
        <select id="pf_category" required>
          <option value="">Select…</option>
          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <div class="error">Required.</div>
      </div>
      <div class="form-row">
        <div class="field" data-field="model"><label>Model No. <span class="req">*</span></label><input id="pf_model" required placeholder="e.g. MW-TV50-4K"><div class="error">Required.</div></div>
        <div class="field" data-field="name"><label>Display Name <span class="req">*</span></label><input id="pf_name" required placeholder="e.g. 50&quot; 4K Smart LED"><div class="error">Required.</div></div>
      </div>
      <div id="pf_attrs"><p class="hint">Select a category to load its attributes.</p></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Product</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);

  document.getElementById('pf_category').addEventListener('change', async (e) => {
    const cat = categories.find(c => c.id === e.target.value);
    const box = document.getElementById('pf_attrs');
    if (!cat || !cat.attributes.length) { box.innerHTML = `<p class="hint">This category has no dynamic attributes.</p>`; return; }
    box.innerHTML = cat.attributes.map(a => {
      if (a.type === 'select') {
        return `<div class="field"><label>${a.label}</label><select data-attr="${a.key}"><option value="">Select…</option>${a.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`;
      }
      return `<div class="field"><label>${a.label}</label><input data-attr="${a.key}" type="${a.type === 'number' ? 'number' : 'text'}"></div>`;
    }).join('');
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const attrs = {};
    document.querySelectorAll('#pf_attrs [data-attr]').forEach(el => { if (el.value) attrs[el.dataset.attr] = el.value; });
    await db.products.add({
      categoryId: document.getElementById('pf_category').value,
      model: document.getElementById('pf_model').value.trim(),
      name: document.getElementById('pf_name').value.trim(),
      attrs
    });
    closeModal();
    render();
  });
}

// =======================================================================
// SERIAL / BATCH
// =======================================================================
route('/serials', async () => {
  titleEl.textContent = 'Serial / Batch';
  const [serials, products] = await Promise.all([db.serials.list(), db.products.list()]);
  renderSerialsList(serials, products);
});

function renderSerialsList(serials, products) {
  const prodMap = Object.fromEntries(products.map(p => [p.id, p]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Serial / Batch</h2><p>Serial numbers are captured at sale, registration, installation or service — there's no separate master import.</p></div>
      <button class="btn btn-primary" id="btnAddSerial">${ICONS.plus} Add Serial</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Serial No.</th><th>Product</th><th>Model</th><th>Status</th><th>Dealer</th><th>Added</th></tr></thead>
        <tbody>
          ${serials.map(s => {
            const p = prodMap[s.productId];
            return `<tr>
              <td class="cell-mono cell-strong">${s.serial}</td>
              <td>${p ? p.name : '—'}</td>
              <td class="cell-mono">${p ? p.model : '—'}</td>
              <td>${statusPill(s.status)}</td>
              <td>${s.dealer || '—'}</td>
              <td class="cell-mono">${fmtDate(s.createdAt)}</td>
            </tr>`;
          }).join('') || `<tr><td colspan="6" class="table-empty">No serial records yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnAddSerial').addEventListener('click', () => openAddSerialModal(products));
}

function openAddSerialModal(products) {
  openModal(`
    <div class="modal-head"><h3>Add Serial</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="serialForm" novalidate>
      <div class="field" data-field="productId">
        <label>Product <span class="req">*</span></label>
        <select id="sf_product" required>
          <option value="">Select…</option>
          ${products.map(p => `<option value="${p.id}">${p.name} (${p.model})</option>`).join('')}
        </select>
        <div class="error">Required.</div>
      </div>
      <div class="field" data-field="serial"><label>Serial Number <span class="req">*</span></label><input id="sf_serial" required placeholder="e.g. MW50UHD00019488"><div class="error">Required.</div></div>
      <div class="form-row">
        <div class="field"><label>Status</label>
          <select id="sf_status"><option>In Stock</option><option>Sold</option><option>Registered</option></select>
        </div>
        <div class="field"><label>Dealer</label><input id="sf_dealer" placeholder="Optional"></div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Serial</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  document.getElementById('serialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const existing = await db.serials.findBySerial(document.getElementById('sf_serial').value.trim());
    if (existing) {
      const wrap = document.getElementById('sf_serial').closest('.field');
      wrap.classList.add('has-error');
      wrap.querySelector('.error').textContent = 'This serial number already exists.';
      return;
    }
    await db.serials.add({
      productId: document.getElementById('sf_product').value,
      serial: document.getElementById('sf_serial').value.trim(),
      status: document.getElementById('sf_status').value,
      dealer: document.getElementById('sf_dealer').value.trim()
    });
    closeModal();
    render();
  });
}

// =======================================================================
// WARRANTY RULES
// =======================================================================
route('/warranty', async () => {
  titleEl.textContent = 'Warranty Rules';
  const [categories, rules] = await Promise.all([db.categories.list(), db.warranty.listRules()]);
  const ruleMap = Object.fromEntries(rules.map(r => [r.categoryId, r]));
  pageEl.innerHTML = `
    <div class="page-head"><div><h2>Warranty Rules</h2><p>Component-level coverage per category — e.g. Washing Machine's separate wash-motor and spin-motor terms.</p></div></div>
    ${categories.map(c => {
      const rule = ruleMap[c.id] || { components: [] };
      return `
      <div class="panel" data-cat-panel="${c.id}">
        <div class="panel-head"><h3>${c.name}</h3><button class="btn btn-ghost btn-sm" data-addcomp="${c.id}">${ICONS.plus} Add component</button></div>
        <div data-rows="${c.id}">
          ${rule.components.map((comp, i) => `
            <div class="warranty-row" data-row="${i}">
              <input class="name" style="border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);" value="${comp.name}" data-comp-name>
              <input type="number" min="0" value="${comp.years}" data-comp-years> yrs
              <button type="button" class="attr-remove" data-remove="${i}">${ICONS.trash}</button>
            </div>`).join('') || '<p class="hint">No components set — add one below.</p>'}
        </div>
        <div class="modal-foot" style="justify-content:flex-start; margin-top:14px;">
          <button class="btn btn-primary btn-sm" data-save="${c.id}">Save changes</button>
        </div>
      </div>`;
    }).join('')}
  `;

  pageEl.querySelectorAll('[data-addcomp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.addcomp;
      const rows = pageEl.querySelector(`[data-rows="${catId}"]`);
      const i = rows.children.length;
      const div = document.createElement('div');
      div.className = 'warranty-row';
      div.dataset.row = i;
      div.innerHTML = `
        <input class="name" style="border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);" placeholder="Component name" data-comp-name>
        <input type="number" min="0" value="1" data-comp-years> yrs
        <button type="button" class="attr-remove" data-remove="${i}">${ICONS.trash}</button>`;
      rows.appendChild(div);
      div.querySelector('[data-remove]').addEventListener('click', () => div.remove());
    });
  });
  pageEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => e.target.closest('.warranty-row').remove());
  });
  pageEl.querySelectorAll('[data-save]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catId = btn.dataset.save;
      const rows = pageEl.querySelectorAll(`[data-rows="${catId}"] .warranty-row`);
      const components = Array.from(rows).map(r => ({
        name: r.querySelector('[data-comp-name]').value.trim() || 'Full Product',
        years: parseInt(r.querySelector('[data-comp-years]').value, 10) || 1
      }));
      await db.warranty.setRule(catId, components);
      btn.textContent = 'Saved ✓';
      setTimeout(() => btn.textContent = 'Save changes', 1500);
    });
  });
});

// =======================================================================
// SERVICE HUB
// =======================================================================
route('/service', async () => {
  titleEl.textContent = SESSION.role === 'Technician' ? 'My Jobs' : 'Service Hub';
  const [requests, customers, products, centers, technicians] = await Promise.all([
    db.service.list(), db.customers.list(), db.products.list(), db.serviceCenters.list(), db.technicians.list()
  ]);

  let scoped = requests;
  let scopeNote = '';
  if (SESSION.role === 'Service Center') {
    const myCenter = await db.serviceCenters.byUser(SESSION.uid);
    if (myCenter) { scoped = requests.filter(r => r.centerId === myCenter.id); scopeNote = `Showing requests routed to ${myCenter.name}.`; }
  } else if (SESSION.role === 'Technician') {
    const myTech = await db.technicians.byUser(SESSION.uid);
    if (myTech) { scoped = requests.filter(r => r.technicianId === myTech.id); scopeNote = `Showing jobs assigned to you.`; }
  }

  renderServiceList(scoped, { customers, products, centers, technicians }, '', scopeNote);
});

function renderServiceList(requests, ctx, statusFilter, scopeNote) {
  const custMap = Object.fromEntries(ctx.customers.map(c => [c.id, c]));
  const prodMap = Object.fromEntries(ctx.products.map(p => [p.id, p]));
  const centerMap = Object.fromEntries(ctx.centers.map(c => [c.id, c]));
  const filtered = statusFilter ? requests.filter(r => r.status === statusFilter) : requests;
  const canCreate = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>${SESSION.role === 'Technician' ? 'My Jobs' : 'Service Hub'}</h2><p>${scopeNote || 'One request record covers service, installation, warranty and out-of-warranty work.'}</p></div>
      ${canCreate ? `<button class="btn btn-primary" id="btnAddRequest">${ICONS.plus} New Request</button>` : ''}
    </div>
    <div class="tabs">
      <button class="tab-btn2 ${!statusFilter ? 'active' : ''}" data-status="">All (${requests.length})</button>
      ${SERVICE_STATUS_STEPS.map(s => `<button class="tab-btn2 ${statusFilter === s ? 'active' : ''}" data-status="${s}">${s} (${requests.filter(r => r.status === s).length})</button>`).join('')}
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Request No.</th><th>Type</th><th>Customer</th><th>Product</th><th>District</th><th>Center</th><th>Status</th><th>SLA</th></tr></thead>
        <tbody>
          ${filtered.map(r => {
            const c = custMap[r.customerId], p = prodMap[r.productId], center = centerMap[r.centerId];
            const sla = db.sla.computeStatus(r);
            return `<tr style="cursor:pointer" data-goto="/service/${r.id}">
              <td class="cell-mono cell-strong">${r.requestNumber}</td>
              <td><span class="role-badge">${r.type}</span></td>
              <td>${c ? c.name : '—'}</td>
              <td>${p ? p.name : '—'}</td>
              <td>${r.district}</td>
              <td>${center ? center.name : '<span class="pill pill-amber">Unassigned</span>'}</td>
              <td>${statusPill2(r.status)}</td>
              <td>${slaPill(sla.status)}</td>
            </tr>`;
          }).join('') || `<tr><td colspan="8" class="table-empty">No requests${statusFilter ? ' with status "' + statusFilter + '"' : ''} yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  pageEl.querySelectorAll('[data-status]').forEach(btn => btn.addEventListener('click', () => renderServiceList(requests, ctx, btn.dataset.status, scopeNote)));
  const addBtn = document.getElementById('btnAddRequest');
  if (addBtn) addBtn.addEventListener('click', () => openAddRequestModal(ctx));
}

function statusPill2(status) {
  const map = { 'Request Received': 'gray', 'Assigned': 'blue', 'Scheduled': 'blue', 'Technician Visit': 'amber', 'Spare Required': 'amber', 'Repair': 'amber', 'Completed': 'green', 'Closed': 'green' };
  return pill(status, map[status] || 'gray');
}
function slaPill(status) {
  const map = { 'On Track': 'green', 'At Risk': 'amber', 'Breached': 'red', 'Met': 'green', 'Closed Late': 'red' };
  return pill(status, map[status] || 'gray');
}

function openAddRequestModal(ctx) {
  openModal(`
    <div class="modal-head"><h3>New Service Request</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="requestForm" novalidate>
      <div class="form-row">
        <div class="field" data-field="customerId">
          <label>Customer <span class="req">*</span></label>
          <select id="rf_customer" required><option value="">Select…</option>${ctx.customers.map(c => `<option value="${c.id}">${c.name} — ${c.phone}</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field" data-field="type">
          <label>Type</label>
          <select id="rf_type"><option>Service</option><option>Installation</option><option>Warranty</option><option>Out-of-Warranty</option></select>
        </div>
      </div>
      <div class="field" data-field="productId">
        <label>Product <span class="req">*</span></label>
        <select id="rf_product" required><option value="">Select…</option>${ctx.products.map(p => `<option value="${p.id}">${p.name} (${p.model})</option>`).join('')}</select>
        <div class="error">Required.</div>
      </div>
      <div class="field" data-field="district">
        <label>District <span class="req">*</span></label>
        <select id="rf_district" required><option value="">Select…</option>${KARNATAKA_DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select>
        <div class="error">Required. Used for routing to the nearest service center.</div>
      </div>
      <div class="field" data-field="complaint">
        <label>Complaint <span class="req">*</span></label>
        <textarea id="rf_complaint" rows="3" required placeholder="What's wrong with the product?"></textarea>
        <div class="error">Required.</div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Request</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const req = await db.service.add({
      customerId: document.getElementById('rf_customer').value,
      type: document.getElementById('rf_type').value,
      productId: document.getElementById('rf_product').value,
      district: document.getElementById('rf_district').value,
      source: SESSION.role,
      complaint: document.getElementById('rf_complaint').value.trim()
    });
    closeModal();
    location.hash = '#/service/' + req.id;
  });
}

dynroute('/service/:id', async (p) => {
  await renderServiceDetail(p.id, 'overview');
});

async function renderServiceDetail(id, activeTab) {
  titleEl.textContent = 'Service Request';
  const [r, centers] = await Promise.all([db.service.get(id), db.serviceCenters.list()]);
  if (!r) { pageEl.innerHTML = `<div class="empty-state"><p>Request not found.</p></div>`; return; }
  const [customer, product, technicians] = await Promise.all([
    db.customers.get(r.customerId), db.products.list().then(ps => ps.find(x => x.id === r.productId)),
    r.centerId ? db.technicians.listByCenter(r.centerId) : Promise.resolve([])
  ]);
  const center = centers.find(c => c.id === r.centerId);
  const technician = technicians.find(t => t.id === r.technicianId) || (await db.technicians.list()).find(t => t.id === r.technicianId);
  const stepIndex = SERVICE_STATUS_STEPS.indexOf(r.status);
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'diagnosis', label: 'Visit & Diagnosis' },
    { id: 'installation', label: 'Installation' },
    { id: 'notes', label: `Internal Notes (${r.internalNotes.length})` }
  ];

  const sla = db.sla.computeStatus(r);
  const escalations = await db.escalations.listByRequest(r.id);
  const openEscalation = escalations.find(e => e.status !== 'Resolved');

  pageEl.innerHTML = `
    <div class="crumb"><a href="#/service">${SESSION.role === 'Technician' ? 'My Jobs' : 'Service Hub'}</a> / ${r.requestNumber}</div>
    <div class="page-head">
      <div>
        <h2 class="cell-mono">${r.requestNumber}</h2>
        <p><span class="role-badge">${r.type}</span> · ${customer ? customer.name : '—'} · ${product ? product.name : '—'} · ${r.district} district</p>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">${slaPill(sla.status)}${statusPill2(r.status)}</div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Progress</h3></div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${SERVICE_STATUS_STEPS.map((s, i) => `
          <span class="pill ${i <= stepIndex ? (i === stepIndex ? 'pill-blue' : 'pill-green') : 'pill-gray'}">${i < stepIndex ? '✓ ' : ''}${s}</span>
        `).join('')}
      </div>
      ${canManage ? `
      <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <label style="font-size:12.5px; color:var(--text-soft);">Move to:</label>
        <select id="statusSelect">${SERVICE_STATUS_STEPS.map(s => `<option ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
        <button class="btn btn-primary btn-sm" id="btnUpdateStatus">Update status</button>
      </div>` : ''}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>SLA</h3>${slaPill(sla.status)}</div>
      <div class="form-row">
        <div><p class="hint" style="margin-bottom:6px;">Target</p><p class="cell-strong">${sla.maxDays} day${sla.maxDays !== 1 ? 's' : ''} for ${r.type}</p></div>
        <div><p class="hint" style="margin-bottom:6px;">${r.status === 'Closed' || r.status === 'Completed' ? 'Took' : 'Due by'}</p><p class="cell-strong">${r.status === 'Closed' || r.status === 'Completed' ? sla.daysElapsed + ' days' : sla.dueDate}</p></div>
      </div>
      ${openEscalation ? `<div class="note" style="margin-top:12px; border-color:var(--red-soft); background:var(--red-soft); color:var(--red);">Open escalation: ${openEscalation.reason}</div>` : ''}
      ${canManage && (sla.status === 'Breached' || sla.status === 'At Risk') && !openEscalation ? `<button class="btn btn-danger btn-sm" id="btnEscalate" style="margin-top:12px;">Escalate</button>` : ''}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Routing &amp; scheduling</h3></div>
      <div class="form-row">
        <div>
          <p class="hint" style="margin-bottom:6px;">Service Center</p>
          <p class="cell-strong">${center ? center.name : 'Not yet assigned'}</p>
          ${center ? `<p class="hint">${center.phone}</p>` : ''}
        </div>
        <div>
          <p class="hint" style="margin-bottom:6px;">Technician</p>
          <p class="cell-strong">${technician ? technician.name : 'Not yet assigned'}</p>
          ${technician ? `<p class="hint">${technician.phone} · ${technician.skills}</p>` : ''}
        </div>
      </div>
      <div class="form-row" style="margin-top:10px;">
        <div><p class="hint" style="margin-bottom:6px;">Scheduled date</p><p class="cell-strong">${r.scheduledDate || 'Not scheduled'}${r.scheduledSlot ? ' · ' + r.scheduledSlot : ''}</p></div>
      </div>
      ${canManage ? `<button class="btn btn-ghost btn-sm" id="btnAssign" style="margin-top:12px;">Assign / Reschedule</button>` : ''}
    </div>

    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
    <div id="tabContent"></div>
  `;

  renderServiceTab(activeTab, r, { customer, product, canManage });

  pageEl.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => renderServiceDetail(id, btn.dataset.tab));
  });

  const statusBtn = document.getElementById('btnUpdateStatus');
  if (statusBtn) statusBtn.addEventListener('click', async () => {
    await db.service.setStatus(r.id, document.getElementById('statusSelect').value);
    renderServiceDetail(id, activeTab);
  });

  const assignBtn = document.getElementById('btnAssign');
  if (assignBtn) assignBtn.addEventListener('click', () => openAssignModal(r, centers, () => renderServiceDetail(id, activeTab)));

  const escalateBtn = document.getElementById('btnEscalate');
  if (escalateBtn) escalateBtn.addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Escalate ${r.requestNumber}</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="escForm" novalidate>
        <div class="note" style="margin-bottom:16px;">This is ${sla.status === 'Breached' ? 'past' : 'approaching'} its ${sla.maxDays}-day SLA target for ${r.type}. Logs to internal notes and the escalation log.</div>
        <div class="field" data-field="reason"><label>Reason <span class="req">*</span></label><textarea id="esc_reason" rows="3" required placeholder="Why is this stuck, and what's needed to move it forward?"></textarea><div class="error">Required.</div></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Escalate</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('escForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.escalations.add({
        serviceRequestId: r.id, level: sla.status === 'Breached' ? 'Breach' : 'Warning',
        reason: document.getElementById('esc_reason').value.trim(), by: SESSION.name
      });
      closeModal();
      renderServiceDetail(id, activeTab);
    });
  });
}

function renderServiceTab(tab, r, ctx) {
  const el = document.getElementById('tabContent');
  if (tab === 'overview') {
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Complaint</h3></div>
        <p style="font-size:13.5px; color:var(--text-soft); line-height:1.7;">${r.complaint}</p>
        <div class="divider"></div>
        <div class="form-row">
          <div><p class="hint">Customer</p><p class="cell-strong">${ctx.customer ? ctx.customer.name : '—'}</p><p class="hint cell-mono">${ctx.customer ? ctx.customer.phone : ''}</p></div>
          <div><p class="hint">Product</p><p class="cell-strong">${ctx.product ? ctx.product.name : '—'}</p><p class="hint cell-mono">${ctx.product ? ctx.product.model : ''}</p></div>
        </div>
      </div>`;
  } else if (tab === 'diagnosis') {
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Visit &amp; diagnosis</h3></div>
        <form id="diagForm">
          <div class="field"><label>Diagnosis notes</label><textarea id="dg_notes" rows="3">${r.diagnosis.notes || ''}</textarea></div>
          <div class="form-row">
            <div class="field"><label>Spare parts needed</label><input id="dg_parts" value="${r.diagnosis.spareParts || ''}" placeholder="e.g. Capacitor 450V"></div>
            <div class="field"><label>Estimated cost (₹)</label><input id="dg_cost" type="number" value="${r.diagnosis.estimatedCost || ''}"></div>
          </div>
          ${ctx.canManage ? `<button type="submit" class="btn btn-primary btn-sm">Save diagnosis</button>` : ''}
        </form>
      </div>`;
    const form = document.getElementById('diagForm');
    if (ctx.canManage) form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await db.service.setDiagnosis(r.id, {
        notes: document.getElementById('dg_notes').value.trim(),
        spareParts: document.getElementById('dg_parts').value.trim(),
        estimatedCost: document.getElementById('dg_cost').value
      });
      const btn = form.querySelector('button');
      btn.textContent = 'Saved ✓'; setTimeout(() => btn.textContent = 'Save diagnosis', 1400);
    });
  } else if (tab === 'installation') {
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Installation</h3></div>
        <form id="installForm">
          <div class="field" style="flex-direction:row; align-items:center; gap:8px;">
            <input type="checkbox" id="in_flag" ${r.installation.isInstallation ? 'checked' : ''} style="width:16px; height:16px;">
            <label style="margin:0;" for="in_flag">This request includes installation</label>
          </div>
          <div class="form-row">
            <div class="field"><label>Install date</label><input id="in_date" type="date" value="${r.installation.installDate || ''}"></div>
          </div>
          <div class="field"><label>Installation notes</label><textarea id="in_notes" rows="3">${r.installation.notes || ''}</textarea></div>
          ${ctx.canManage ? `<button type="submit" class="btn btn-primary btn-sm">Save installation</button>` : ''}
        </form>
      </div>`;
    const form = document.getElementById('installForm');
    if (ctx.canManage) form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await db.service.setInstallation(r.id, {
        isInstallation: document.getElementById('in_flag').checked,
        installDate: document.getElementById('in_date').value,
        notes: document.getElementById('in_notes').value.trim()
      });
      const btn = form.querySelector('button');
      btn.textContent = 'Saved ✓'; setTimeout(() => btn.textContent = 'Save installation', 1400);
    });
  } else if (tab === 'notes') {
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Internal notes</h3></div>
        <p class="hint" style="margin-bottom:14px;">Internal only — never shown to the customer on the public tracking page.</p>
        ${r.internalNotes.slice().reverse().map(n => `
          <div style="padding:10px 0; border-bottom:1px dashed var(--border-soft);">
            <p style="font-size:13.5px;">${n.text}</p>
            <p class="hint" style="margin-top:4px;">${n.by} · ${n.at}</p>
          </div>`).join('') || '<p class="hint">No notes yet.</p>'}
        <form id="noteForm" style="margin-top:14px;">
          <div class="field"><textarea id="note_text" rows="2" placeholder="Add an internal note…"></textarea></div>
          <button type="submit" class="btn btn-ghost btn-sm">Add note</button>
        </form>
      </div>`;
    document.getElementById('noteForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = document.getElementById('note_text').value.trim();
      if (!val) return;
      await db.service.addNote(r.id, val, SESSION.name);
      renderServiceTab('notes', await db.service.get(r.id), ctx);
    });
  }
}

function openAssignModal(r, centers, onDone) {
  openModal(`
    <div class="modal-head"><h3>Assign / Reschedule</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="assignForm">
      <div class="field">
        <label>Service Center</label>
        <select id="as_center">
          <option value="">Unassigned</option>
          ${centers.map(c => `<option value="${c.id}" ${c.id === r.centerId ? 'selected' : ''}>${c.name} — ${c.district}</option>`).join('')}
        </select>
        <div class="hint">Routing is by district — the request's district is ${r.district}.</div>
      </div>
      <div class="field">
        <label>Technician</label>
        <select id="as_tech"><option value="">Select a center first</option></select>
      </div>
      <div class="divider"></div>
      <div class="form-row">
        <div class="field"><label>Scheduled date</label><input id="as_date" type="date" value="${r.scheduledDate || ''}"></div>
        <div class="field"><label>Slot</label>
          <select id="as_slot">
            <option value="">Select…</option>
            ${['Morning (9–12)', 'Afternoon (12–4)', 'Evening (4–7)'].map(s => `<option ${r.scheduledSlot === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);

  const centerSelect = document.getElementById('as_center');
  const techSelect = document.getElementById('as_tech');
  const loadTechs = async () => {
    if (!centerSelect.value) { techSelect.innerHTML = '<option value="">Select a center first</option>'; return; }
    const techs = await db.technicians.listByCenter(centerSelect.value);
    techSelect.innerHTML = '<option value="">Unassigned</option>' + techs.map(t => `<option value="${t.id}" ${t.id === r.technicianId ? 'selected' : ''}>${t.name} — ${t.skills}</option>`).join('');
  };
  centerSelect.addEventListener('change', loadTechs);
  loadTechs();

  document.getElementById('assignForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await db.service.assign(r.id, { centerId: centerSelect.value, technicianId: techSelect.value });
    const date = document.getElementById('as_date').value, slot = document.getElementById('as_slot').value;
    if (date) await db.service.schedule(r.id, { date, slot });
    closeModal();
    onDone();
  });
}

// =======================================================================
// SCHEDULING
// =======================================================================
route('/scheduling', async () => {
  titleEl.textContent = 'Scheduling';
  const [requests, customers, products, centers] = await Promise.all([
    db.service.list(), db.customers.list(), db.products.list(), db.serviceCenters.list()
  ]);
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const prodMap = Object.fromEntries(products.map(p => [p.id, p]));
  const centerMap = Object.fromEntries(centers.map(c => [c.id, c]));

  const scheduled = requests.filter(r => r.scheduledDate).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const unscheduled = requests.filter(r => !r.scheduledDate && r.status !== 'Closed' && r.status !== 'Completed');

  const groups = {};
  scheduled.forEach(r => { (groups[r.scheduledDate] = groups[r.scheduledDate] || []).push(r); });

  pageEl.innerHTML = `
    <div class="page-head"><div><h2>Scheduling</h2><p>Requests grouped by scheduled visit date.</p></div></div>

    ${Object.keys(groups).length ? Object.keys(groups).map(date => `
      <div class="panel">
        <div class="panel-head"><h3>${date}</h3></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Request No.</th><th>Slot</th><th>Customer</th><th>Product</th><th>Center</th><th>Status</th></tr></thead>
          <tbody>
            ${groups[date].map(r => `
              <tr style="cursor:pointer" data-goto="/service/${r.id}">
                <td class="cell-mono cell-strong">${r.requestNumber}</td>
                <td>${r.scheduledSlot || '—'}</td>
                <td>${custMap[r.customerId] ? custMap[r.customerId].name : '—'}</td>
                <td>${prodMap[r.productId] ? prodMap[r.productId].name : '—'}</td>
                <td>${centerMap[r.centerId] ? centerMap[r.centerId].name : '—'}</td>
                <td>${statusPill2(r.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
    `).join('') : '<div class="panel"><p class="hint">Nothing scheduled yet.</p></div>'}

    <div class="panel">
      <div class="panel-head"><h3>Awaiting a schedule (${unscheduled.length})</h3></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Request No.</th><th>Customer</th><th>District</th><th>Center</th><th>Status</th></tr></thead>
        <tbody>
          ${unscheduled.map(r => `
            <tr style="cursor:pointer" data-goto="/service/${r.id}">
              <td class="cell-mono cell-strong">${r.requestNumber}</td>
              <td>${custMap[r.customerId] ? custMap[r.customerId].name : '—'}</td>
              <td>${r.district}</td>
              <td>${centerMap[r.centerId] ? centerMap[r.centerId].name : '<span class="pill pill-amber">Unassigned</span>'}</td>
              <td>${statusPill2(r.status)}</td>
            </tr>`).join('') || `<tr><td colspan="5" class="table-empty">Everything open is scheduled.</td></tr>`}
        </tbody>
      </table></div>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
});

// =======================================================================
// SERVICE CENTERS
// =======================================================================
route('/service-centers', async () => {
  titleEl.textContent = 'Service Centers';
  const [centers, technicians, requests] = await Promise.all([db.serviceCenters.list(), db.technicians.list(), db.service.list()]);
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Service Centers</h2><p>${centers.length} centers · routing target for service requests by district</p></div>
      <button class="btn btn-primary" id="btnAddCenter">${ICONS.plus} Add Service Center</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Center</th><th>District</th><th>Phone</th><th>Technicians</th><th>Open Requests</th><th>Status</th></tr></thead>
        <tbody>
          ${centers.map(c => `
            <tr>
              <td class="cell-strong">${c.name}</td>
              <td>${c.district}</td>
              <td class="cell-mono">${c.phone}</td>
              <td>${technicians.filter(t => t.centerId === c.id).length}</td>
              <td>${requests.filter(r => r.centerId === c.id && r.status !== 'Closed' && r.status !== 'Completed').length}</td>
              <td>${statusPill(c.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnAddCenter').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Add Service Center</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="centerForm" novalidate>
        <div class="field" data-field="name"><label>Center Name <span class="req">*</span></label><input id="sc_name" required><div class="error">Required.</div></div>
        <div class="form-row">
          <div class="field" data-field="district"><label>District <span class="req">*</span></label><select id="sc_district" required><option value="">Select…</option>${KARNATAKA_DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select><div class="error">Required.</div></div>
          <div class="field" data-field="phone"><label>Phone <span class="req">*</span></label><input id="sc_phone" required><div class="error">Required.</div></div>
        </div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Center</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('centerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.serviceCenters.add({
        name: document.getElementById('sc_name').value.trim(),
        district: document.getElementById('sc_district').value,
        state: 'Karnataka',
        phone: document.getElementById('sc_phone').value.trim()
      });
      closeModal();
      render();
    });
  });
});

// =======================================================================
// TECHNICIANS
// =======================================================================
route('/technicians', async () => {
  titleEl.textContent = 'Technicians';
  const [technicians, centers, requests] = await Promise.all([db.technicians.list(), db.serviceCenters.list(), db.service.list()]);
  const centerMap = Object.fromEntries(centers.map(c => [c.id, c]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Technicians</h2><p>${technicians.length} technicians across ${centers.length} centers</p></div>
      <button class="btn btn-primary" id="btnAddTech">${ICONS.plus} Add Technician</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Center</th><th>Phone</th><th>Skills</th><th>Active Jobs</th><th>Status</th></tr></thead>
        <tbody>
          ${technicians.map(t => `
            <tr>
              <td class="cell-strong">${t.name}</td>
              <td>${centerMap[t.centerId] ? centerMap[t.centerId].name : '—'}</td>
              <td class="cell-mono">${t.phone}</td>
              <td>${t.skills}</td>
              <td>${requests.filter(r => r.technicianId === t.id && r.status !== 'Closed' && r.status !== 'Completed').length}</td>
              <td>${statusPill(t.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnAddTech').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Add Technician</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="techForm" novalidate>
        <div class="field" data-field="name"><label>Name <span class="req">*</span></label><input id="tf_name" required><div class="error">Required.</div></div>
        <div class="form-row">
          <div class="field" data-field="centerId"><label>Service Center <span class="req">*</span></label><select id="tf_center" required><option value="">Select…</option>${centers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select><div class="error">Required.</div></div>
          <div class="field" data-field="phone"><label>Phone <span class="req">*</span></label><input id="tf_phone" required><div class="error">Required.</div></div>
        </div>
        <div class="field"><label>Skills</label><input id="tf_skills" placeholder="e.g. TV, Washing Machine"></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Technician</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('techForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.technicians.add({
        name: document.getElementById('tf_name').value.trim(),
        centerId: document.getElementById('tf_center').value,
        phone: document.getElementById('tf_phone').value.trim(),
        skills: document.getElementById('tf_skills').value.trim()
      });
      closeModal();
      render();
    });
  });
});

// =======================================================================
// INVENTORY — shared helpers
// =======================================================================
async function locationOptions() {
  const [centers, technicians] = await Promise.all([db.serviceCenters.list(), db.technicians.list()]);
  const opts = [{ key: 'warehouse', label: 'Central Warehouse' }];
  centers.filter(c => c.status === 'Active').forEach(c => opts.push({ key: `sc:${c.id}`, label: `${c.name} (Service Center)` }));
  technicians.filter(t => t.status === 'Active').forEach(t => opts.push({ key: `t:${t.id}`, label: `${t.name} (Technician)` }));
  return opts;
}
function locLabel(key, opts) {
  const o = opts.find(x => x.key === key);
  return o ? o.label : (key || '—');
}

// =======================================================================
// SPARE PARTS (master)
// =======================================================================
route('/spare-parts', async () => {
  titleEl.textContent = 'Spare Parts';
  const [parts, levels] = await Promise.all([db.spareParts.list(), db.stock.allLevels()]);
  const totalByPart = {};
  levels.forEach(l => { totalByPart[l.partId] = (totalByPart[l.partId] || 0) + l.quantity; });
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Spare Parts</h2><p>${parts.length} parts in the master list · total stock across all locations</p></div>
      <button class="btn btn-primary" id="btnAddPart">${ICONS.plus} Add Spare Part</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Part</th><th>Part No.</th><th>Category</th><th>Unit Cost</th><th>Total Stock</th><th>Status</th></tr></thead>
        <tbody>
          ${parts.map(p => `
            <tr>
              <td class="cell-strong">${p.name}</td>
              <td class="cell-mono">${p.partNumber}</td>
              <td><span class="role-badge">${(CATEGORY_NAME_CACHE[p.categoryId]) || p.categoryId}</span></td>
              <td class="cell-mono">₹${p.unitCost}</td>
              <td>${totalByPart[p.id] || 0}</td>
              <td>${statusPill(p.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnAddPart').addEventListener('click', async () => {
    const categories = await db.categories.list();
    openModal(`
      <div class="modal-head"><h3>Add Spare Part</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="partForm" novalidate>
        <div class="form-row">
          <div class="field" data-field="name"><label>Part Name <span class="req">*</span></label><input id="pf_name" required><div class="error">Required.</div></div>
          <div class="field" data-field="partNumber"><label>Part Number <span class="req">*</span></label><input id="pf_number" required placeholder="e.g. CAP-450"><div class="error">Required.</div></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Category</label><select id="pf_cat"><option value="">Unlinked</option>${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
          <div class="field"><label>Unit Cost (₹)</label><input id="pf_cost" type="number" min="0" value="0"></div>
        </div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Part</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('partForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.spareParts.add({
        name: document.getElementById('pf_name').value.trim(),
        partNumber: document.getElementById('pf_number').value.trim(),
        categoryId: document.getElementById('pf_cat').value,
        unitCost: parseFloat(document.getElementById('pf_cost').value) || 0
      });
      closeModal();
      render();
    });
  });
});
let CATEGORY_NAME_CACHE = {};

// =======================================================================
// WAREHOUSE STOCK (central)
// =======================================================================
route('/warehouse', async () => {
  titleEl.textContent = 'Warehouse Stock';
  await renderStockLocation('warehouse', 'Central Warehouse', true);
});

route('/my-stock', async () => {
  let locKey = '', label = 'My Stock';
  if (SESSION.role === 'Service Center') {
    const c = await db.serviceCenters.byUser(SESSION.uid);
    if (c) { locKey = `sc:${c.id}`; label = c.name; }
  } else if (SESSION.role === 'Technician') {
    const t = await db.technicians.byUser(SESSION.uid);
    if (t) { locKey = `t:${t.id}`; label = `${t.name}'s Spare Bag`; }
  }
  titleEl.textContent = label;
  if (!locKey) { pageEl.innerHTML = `<div class="empty-state"><p>No linked location for this demo user.</p></div>`; return; }
  await renderStockLocation(locKey, label, false);
});

async function renderStockLocation(locKey, label, canReceive) {
  const [levels, parts] = await Promise.all([db.stock.levelsByLocation(locKey), db.spareParts.list()]);
  const partMap = Object.fromEntries(parts.map(p => [p.id, p]));
  const rows = levels.filter(l => l.quantity > 0 || canReceive);
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>${label}</h2><p>Current stock on hand${canReceive ? ' · receive new stock from suppliers here' : ''}</p></div>
      ${canReceive ? `<button class="btn btn-primary" id="btnReceive">${ICONS.plus} Receive Stock</button>` : ''}
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Part</th><th>Part No.</th><th>Quantity</th><th>Est. Value</th></tr></thead>
        <tbody>
          ${rows.map(l => {
            const p = partMap[l.partId];
            return `<tr>
              <td class="cell-strong">${p ? p.name : l.partId}</td>
              <td class="cell-mono">${p ? p.partNumber : '—'}</td>
              <td>${l.quantity <= 3 && l.quantity > 0 ? pill('Low: ' + l.quantity, 'amber') : (l.quantity === 0 ? pill('0', 'gray') : l.quantity)}</td>
              <td class="cell-mono">₹${p ? (p.unitCost * l.quantity).toLocaleString('en-IN') : 0}</td>
            </tr>`;
          }).join('') || `<tr><td colspan="4" class="table-empty">No stock recorded here yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  const receiveBtn = document.getElementById('btnReceive');
  if (receiveBtn) receiveBtn.addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Receive Stock</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="receiveForm" novalidate>
        <div class="field" data-field="partId"><label>Part <span class="req">*</span></label>
          <select id="rc_part" required><option value="">Select…</option>${parts.map(p => `<option value="${p.id}">${p.name} (${p.partNumber})</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field" data-field="quantity"><label>Quantity <span class="req">*</span></label><input id="rc_qty" type="number" min="1" required><div class="error">Required.</div></div>
        <div class="field"><label>Notes</label><input id="rc_notes" placeholder="e.g. Supplier invoice #, batch ref"></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Receive</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('receiveForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.stock.receive({
        toKey: locKey,
        partId: document.getElementById('rc_part').value,
        quantity: parseInt(document.getElementById('rc_qty').value, 10),
        notes: document.getElementById('rc_notes').value.trim(),
        by: SESSION.name
      });
      closeModal();
      render();
    });
  });
}

// =======================================================================
// STOCK MOVEMENT
// =======================================================================
route('/stock-movements', async () => {
  titleEl.textContent = 'Stock Movement';
  const [movements, parts, opts] = await Promise.all([db.stockMovements.list(), db.spareParts.list(), locationOptions()]);
  const partMap = Object.fromEntries(parts.map(p => [p.id, p]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Stock Movement</h2><p>Every transfer, dispatch and receipt across warehouse, service centers and technicians.</p></div>
      <button class="btn btn-primary" id="btnNewTransfer">${ICONS.plus} New Transfer</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Date</th><th>Part</th><th>From</th><th>To</th><th>Qty</th><th>Type</th><th>By</th></tr></thead>
        <tbody>
          ${movements.map(m => `
            <tr>
              <td class="cell-mono">${m.createdAt}</td>
              <td class="cell-strong">${partMap[m.partId] ? partMap[m.partId].name : m.partId}</td>
              <td>${m.fromKey ? locLabel(m.fromKey, opts) : '<span class="hint">Supplier</span>'}</td>
              <td>${locLabel(m.toKey, opts)}</td>
              <td>${m.quantity}</td>
              <td><span class="role-badge">${m.type}</span></td>
              <td class="hint">${m.by || '—'}</td>
            </tr>`).join('') || `<tr><td colspan="7" class="table-empty">No stock movements yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnNewTransfer').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>New Transfer</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="transferForm" novalidate>
        <div class="form-row">
          <div class="field" data-field="fromKey"><label>From <span class="req">*</span></label>
            <select id="tf_from" required>${opts.map(o => `<option value="${o.key}">${o.label}</option>`).join('')}</select>
            <div class="error">Required.</div>
          </div>
          <div class="field" data-field="toKey"><label>To <span class="req">*</span></label>
            <select id="tf_to" required>${opts.map(o => `<option value="${o.key}" ${o.key === 'sc:sc1' ? 'selected' : ''}>${o.label}</option>`).join('')}</select>
            <div class="error">Required.</div>
          </div>
        </div>
        <div class="form-row">
          <div class="field" data-field="partId"><label>Part <span class="req">*</span></label>
            <select id="tf_part" required><option value="">Select…</option>${parts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <div class="error">Required.</div>
          </div>
          <div class="field" data-field="quantity"><label>Quantity <span class="req">*</span></label><input id="tf_qty" type="number" min="1" required><div class="error">Required.</div></div>
        </div>
        <div id="transferError"></div>
        <div class="field"><label>Notes</label><input id="tf_notes" placeholder="Optional"></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Transfer</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('transferForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      const fromKey = document.getElementById('tf_from').value, toKey = document.getElementById('tf_to').value;
      if (fromKey === toKey) {
        document.getElementById('transferError').innerHTML = `<div class="note" style="border-color:var(--red-soft); background:var(--red-soft); color:var(--red); margin-bottom:14px;">Source and destination can't be the same.</div>`;
        return;
      }
      const result = await db.stock.transfer({
        fromKey, toKey,
        partId: document.getElementById('tf_part').value,
        quantity: parseInt(document.getElementById('tf_qty').value, 10),
        notes: document.getElementById('tf_notes').value.trim(),
        by: SESSION.name
      });
      if (result && result.error) {
        document.getElementById('transferError').innerHTML = `<div class="note" style="border-color:var(--red-soft); background:var(--red-soft); color:var(--red); margin-bottom:14px;">${result.error}</div>`;
        return;
      }
      closeModal();
      render();
    });
  });
});

// =======================================================================
// SPARE REQUEST PIPELINE
// =======================================================================
route('/spare-requests', async () => {
  titleEl.textContent = 'Spare Requests';
  const [requests, parts, centers, technicians, serviceReqs] = await Promise.all([
    db.spareRequests.list(), db.spareParts.list(), db.serviceCenters.list(), db.technicians.list(), db.service.list()
  ]);
  const partMap = Object.fromEntries(parts.map(p => [p.id, p]));
  const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));

  let scoped = requests;
  let canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Warehouse';
  let myRequesterType = '', myRequesterId = '';
  if (SESSION.role === 'Service Center') {
    const c = await db.serviceCenters.byUser(SESSION.uid);
    if (c) { myRequesterType = 'Service Center'; myRequesterId = c.id; scoped = requests.filter(r => r.requestedByType === 'Service Center' && r.requestedById === c.id); }
  } else if (SESSION.role === 'Technician') {
    const t = await db.technicians.byUser(SESSION.uid);
    if (t) { myRequesterType = 'Technician'; myRequesterId = t.id; scoped = requests.filter(r => r.requestedByType === 'Technician' && r.requestedById === t.id); }
  }
  const requesterName = (type, id) => {
    if (type === 'Technician') { const t = technicians.find(x => x.id === id); return t ? t.name : id; }
    const c = centers.find(x => x.id === id); return c ? c.name : id;
  };

  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Spare Requests</h2><p>${canManage ? 'Requests raised by technicians and service centers, dispatched from the warehouse.' : 'Your requests for spare parts.'}</p></div>
      <button class="btn btn-primary" id="btnNewRequest">${ICONS.plus} New Request</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Request No.</th><th>Part</th><th>Qty</th><th>Requested By</th><th>Linked Job</th><th>Status</th>${canManage ? '<th></th>' : ''}</tr></thead>
        <tbody>
          ${scoped.map(r => `
            <tr>
              <td class="cell-mono cell-strong">${r.requestNumber}</td>
              <td>${partMap[r.partId] ? partMap[r.partId].name : r.partId}</td>
              <td>${r.quantity}</td>
              <td>${requesterName(r.requestedByType, r.requestedById)} <span class="hint">(${r.requestedByType})</span></td>
              <td>${r.serviceRequestId && srMap[r.serviceRequestId] ? `<a href="#/service/${r.serviceRequestId}" class="cell-mono">${srMap[r.serviceRequestId].requestNumber}</a>` : '—'}</td>
              <td>${spareStatusPill(r.status)}</td>
              ${canManage ? `<td>${spareActionButtons(r)}</td>` : ''}
            </tr>`).join('') || `<tr><td colspan="${canManage ? 7 : 6}" class="table-empty">No spare requests yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnNewRequest').addEventListener('click', () => openNewSpareRequestModal(parts, centers, technicians, serviceReqs, myRequesterType, myRequesterId));

  pageEl.querySelectorAll('[data-approve]').forEach(btn => btn.addEventListener('click', async () => {
    await db.spareRequests.setStatus(btn.dataset.approve, 'Approved'); render();
  }));
  pageEl.querySelectorAll('[data-dispatch]').forEach(btn => btn.addEventListener('click', async () => {
    const result = await db.spareRequests.dispatch(btn.dataset.dispatch, SESSION.name);
    if (result && result.error) { alert(result.error); return; }
    render();
  }));
  pageEl.querySelectorAll('[data-received]').forEach(btn => btn.addEventListener('click', async () => {
    await db.spareRequests.setStatus(btn.dataset.received, 'Received'); render();
  }));
});

function spareStatusPill(status) {
  const map = { Requested: 'gray', Approved: 'blue', Dispatched: 'amber', Received: 'green' };
  return pill(status, map[status] || 'gray');
}
function spareActionButtons(r) {
  if (r.status === 'Requested') return `<button class="btn btn-ghost btn-sm" data-approve="${r.id}">Approve</button>`;
  if (r.status === 'Approved') return `<button class="btn btn-ghost btn-sm" data-dispatch="${r.id}">Dispatch</button>`;
  if (r.status === 'Dispatched') return `<button class="btn btn-ghost btn-sm" data-received="${r.id}">Mark Received</button>`;
  return '';
}

function openNewSpareRequestModal(parts, centers, technicians, serviceReqs, myType, myId) {
  const isSelfService = myType && myId;
  openModal(`
    <div class="modal-head"><h3>New Spare Request</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="sprForm" novalidate>
      ${isSelfService ? '' : `
      <div class="form-row">
        <div class="field" data-field="requestedByType"><label>Requester Type <span class="req">*</span></label>
          <select id="sr_type" required><option value="Technician">Technician</option><option value="Service Center">Service Center</option></select>
        </div>
        <div class="field" data-field="requestedById"><label>Requester <span class="req">*</span></label><select id="sr_id" required></select><div class="error">Required.</div></div>
      </div>`}
      <div class="form-row">
        <div class="field" data-field="partId"><label>Part <span class="req">*</span></label>
          <select id="sr_part" required><option value="">Select…</option>${parts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field" data-field="quantity"><label>Quantity <span class="req">*</span></label><input id="sr_qty" type="number" min="1" value="1" required><div class="error">Required.</div></div>
      </div>
      <div class="field"><label>Link to a service request (optional)</label>
        <select id="sr_link"><option value="">None</option>${serviceReqs.map(s => `<option value="${s.id}">${s.requestNumber}</option>`).join('')}</select>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit Request</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);

  if (!isSelfService) {
    const typeSel = document.getElementById('sr_type');
    const idSel = document.getElementById('sr_id');
    const populateRequesters = () => {
      const list = typeSel.value === 'Technician' ? technicians : centers;
      idSel.innerHTML = '<option value="">Select…</option>' + list.filter(x => x.status === 'Active').map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    };
    typeSel.addEventListener('change', populateRequesters);
    populateRequesters();
  }

  document.getElementById('sprForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    await db.spareRequests.add({
      partId: document.getElementById('sr_part').value,
      quantity: parseInt(document.getElementById('sr_qty').value, 10),
      requestedByType: isSelfService ? myType : document.getElementById('sr_type').value,
      requestedById: isSelfService ? myId : document.getElementById('sr_id').value,
      serviceRequestId: document.getElementById('sr_link').value
    });
    closeModal();
    render();
  });
}

// =======================================================================
// FINANCE — shared helpers
// =======================================================================
function calcTotals(items, laborCharge) {
  const itemsTotal = items.reduce((sum, i) => sum + (i.qty * i.unitCost), 0);
  const subtotal = itemsTotal + (laborCharge || 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, total };
}
function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function lineItemRow(item, idx) {
  return `<div class="warranty-row" data-item-row="${idx}" style="gap:8px;">
    <input placeholder="Description" value="${item.description || ''}" data-item-desc style="flex:2; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);">
    <input type="number" min="1" value="${item.qty || 1}" data-item-qty style="width:56px; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);" title="Qty">
    <input type="number" min="0" value="${item.unitCost || 0}" data-item-cost style="width:90px; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);" title="Unit cost (₹)">
    <button type="button" class="attr-remove" data-item-remove="${idx}">${ICONS.trash}</button>
  </div>`;
}

function wireLineItemsEditor(containerId, laborInputId, totalsElId, initialItems, initialLabor) {
  const container = document.getElementById(containerId);
  let items = initialItems && initialItems.length ? initialItems.map(i => ({ ...i })) : [{ description: '', qty: 1, unitCost: 0 }];

  function redraw() {
    container.innerHTML = items.map((it, i) => lineItemRow(it, i)).join('');
    container.querySelectorAll('[data-item-remove]').forEach(btn => btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.itemRemove, 10);
      items.splice(i, 1);
      if (!items.length) items = [{ description: '', qty: 1, unitCost: 0 }];
      redraw();
    }));
    container.querySelectorAll('[data-item-row]').forEach(row => {
      const i = parseInt(row.dataset.itemRow, 10);
      row.querySelector('[data-item-desc]').addEventListener('input', (e) => { items[i].description = e.target.value; });
      row.querySelector('[data-item-qty]').addEventListener('input', (e) => { items[i].qty = parseFloat(e.target.value) || 0; updateTotals(); });
      row.querySelector('[data-item-cost]').addEventListener('input', (e) => { items[i].unitCost = parseFloat(e.target.value) || 0; updateTotals(); });
    });
    updateTotals();
  }
  function updateTotals() {
    const labor = parseFloat(document.getElementById(laborInputId).value) || 0;
    const t = calcTotals(items, labor);
    document.getElementById(totalsElId).innerHTML = `
      <div class="warranty-row"><span class="name">Subtotal</span><span class="cell-mono">${money(t.subtotal)}</span></div>
      <div class="warranty-row"><span class="name">GST (18%)</span><span class="cell-mono">${money(t.tax)}</span></div>
      <div class="warranty-row"><span class="name" style="font-weight:700;">Total</span><span class="cell-mono cell-strong">${money(t.total)}</span></div>
    `;
  }
  document.getElementById(laborInputId).addEventListener('input', updateTotals);
  redraw();
  return { getItems: () => items.filter(i => i.description.trim()), getLabor: () => parseFloat(document.getElementById(laborInputId).value) || 0 };
}

// =======================================================================
// ESTIMATES
// =======================================================================
route('/estimates', async () => {
  titleEl.textContent = 'Estimates';
  const [estimates, customers, serviceReqs] = await Promise.all([db.estimates.list(), db.customers.list(), db.service.list()]);
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Estimates</h2><p>Customer-approved cost estimate before paid repair work begins.</p></div>
      <button class="btn btn-primary" id="btnNewEstimate">${ICONS.plus} New Estimate</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Estimate No.</th><th>Customer</th><th>Linked Job</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          ${estimates.map(e => {
            const t = calcTotals(e.items, e.laborCharge);
            return `<tr style="cursor:pointer" data-goto="/estimates/${e.id}">
              <td class="cell-mono cell-strong">${e.estimateNumber}</td>
              <td>${custMap[e.customerId] ? custMap[e.customerId].name : '—'}</td>
              <td>${e.serviceRequestId && srMap[e.serviceRequestId] ? srMap[e.serviceRequestId].requestNumber : '—'}</td>
              <td class="cell-mono">${money(t.total)}</td>
              <td>${financeStatusPill(e.status)}</td>
            </tr>`;
          }).join('') || `<tr><td colspan="5" class="table-empty">No estimates yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  document.getElementById('btnNewEstimate').addEventListener('click', () => openEstimateModal(customers, serviceReqs));
});

function financeStatusPill(status) {
  const map = { Draft: 'gray', Sent: 'blue', Approved: 'green', Rejected: 'red', Unpaid: 'amber', 'Partially Paid': 'blue', Paid: 'green', Requested: 'gray', Reimbursed: 'green' };
  return pill(status, map[status] || 'gray');
}

function openEstimateModal(customers, serviceReqs, prefill) {
  openModal(`
    <div class="modal-head"><h3>New Estimate</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="estForm" novalidate>
      <div class="form-row">
        <div class="field" data-field="customerId"><label>Customer <span class="req">*</span></label>
          <select id="ef_customer" required>${customers.map(c => `<option value="${c.id}" ${prefill && prefill.customerId === c.id ? 'selected' : ''}>${c.name} — ${c.phone}</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field"><label>Linked service request</label>
          <select id="ef_sr"><option value="">None</option>${serviceReqs.map(s => `<option value="${s.id}" ${prefill && prefill.serviceRequestId === s.id ? 'selected' : ''}>${s.requestNumber}</option>`).join('')}</select>
        </div>
      </div>
      <label style="font-size:12.5px; font-weight:600; color:var(--accent-text); display:block; margin-bottom:8px;">Line items</label>
      <div id="ef_items"></div>
      <button type="button" class="btn btn-ghost btn-sm" id="ef_addItem" style="margin:6px 0 16px;">${ICONS.plus} Add line item</button>
      <div class="field"><label>Labor charge (₹)</label><input type="number" id="ef_labor" min="0" value="${prefill && prefill.laborCharge || 0}"></div>
      <div class="divider"></div>
      <div id="ef_totals"></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Estimate</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  const editor = wireLineItemsEditor('ef_items', 'ef_labor', 'ef_totals', prefill ? prefill.items : null, prefill ? prefill.laborCharge : 0);
  document.getElementById('ef_addItem').addEventListener('click', () => {
    editor.getItems(); // no-op read to keep pattern consistent
    const container = document.getElementById('ef_items');
    const currentRows = container.querySelectorAll('[data-item-row]').length;
    container.insertAdjacentHTML('beforeend', lineItemRow({ description: '', qty: 1, unitCost: 0 }, currentRows));
    wireFreshRow(container, currentRows, 'ef_labor', 'ef_totals');
  });

  document.getElementById('estForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const items = Array.from(document.querySelectorAll('#ef_items [data-item-row]')).map(row => ({
      description: row.querySelector('[data-item-desc]').value.trim(),
      qty: parseFloat(row.querySelector('[data-item-qty]').value) || 0,
      unitCost: parseFloat(row.querySelector('[data-item-cost]').value) || 0
    })).filter(i => i.description);
    await db.estimates.add({
      customerId: document.getElementById('ef_customer').value,
      serviceRequestId: document.getElementById('ef_sr').value,
      items, laborCharge: parseFloat(document.getElementById('ef_labor').value) || 0
    });
    closeModal();
    render();
  });
}

// Simplified helper: re-attach listeners to a freshly appended row (used by "Add line item" button)
function wireFreshRow(container, idx, laborInputId, totalsElId) {
  const row = container.querySelector(`[data-item-row="${idx}"]`);
  const recalc = () => {
    const items = Array.from(container.querySelectorAll('[data-item-row]')).map(r => ({
      qty: parseFloat(r.querySelector('[data-item-qty]').value) || 0,
      unitCost: parseFloat(r.querySelector('[data-item-cost]').value) || 0
    }));
    const labor = parseFloat(document.getElementById(laborInputId).value) || 0;
    const t = calcTotals(items, labor);
    document.getElementById(totalsElId).innerHTML = `
      <div class="warranty-row"><span class="name">Subtotal</span><span class="cell-mono">${money(t.subtotal)}</span></div>
      <div class="warranty-row"><span class="name">GST (18%)</span><span class="cell-mono">${money(t.tax)}</span></div>
      <div class="warranty-row"><span class="name" style="font-weight:700;">Total</span><span class="cell-mono cell-strong">${money(t.total)}</span></div>
    `;
  };
  row.querySelector('[data-item-qty]').addEventListener('input', recalc);
  row.querySelector('[data-item-cost]').addEventListener('input', recalc);
  row.querySelector('[data-item-remove]').addEventListener('click', () => { row.remove(); recalc(); });
  recalc();
}

dynroute('/estimates/:id', async (p) => {
  titleEl.textContent = 'Estimate';
  const [e, customers, serviceReqs, invoices] = await Promise.all([db.estimates.get(p.id), db.customers.list(), db.service.list(), db.invoices.list()]);
  if (!e) { pageEl.innerHTML = `<div class="empty-state"><p>Estimate not found.</p></div>`; return; }
  const customer = customers.find(c => c.id === e.customerId);
  const sr = serviceReqs.find(s => s.id === e.serviceRequestId);
  const t = calcTotals(e.items, e.laborCharge);
  const existingInvoice = invoices.find(i => i.estimateId === e.id);
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  pageEl.innerHTML = `
    <div class="crumb"><a href="#/estimates">Estimates</a> / ${e.estimateNumber}</div>
    <div class="page-head">
      <div><h2 class="cell-mono">${e.estimateNumber}</h2><p>${customer ? customer.name : '—'}${sr ? ' · ' + sr.requestNumber : ''}</p></div>
      ${financeStatusPill(e.status)}
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Line items</h3></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Description</th><th>Qty</th><th>Unit Cost</th><th>Amount</th></tr></thead>
        <tbody>${e.items.map(i => `<tr><td>${i.description}</td><td>${i.qty}</td><td class="cell-mono">${money(i.unitCost)}</td><td class="cell-mono">${money(i.qty * i.unitCost)}</td></tr>`).join('')}</tbody>
      </table></div>
      <div style="max-width:280px; margin-left:auto; margin-top:14px;">
        <div class="warranty-row"><span class="name">Labor charge</span><span class="cell-mono">${money(e.laborCharge)}</span></div>
        <div class="warranty-row"><span class="name">Subtotal</span><span class="cell-mono">${money(t.subtotal)}</span></div>
        <div class="warranty-row"><span class="name">GST (18%)</span><span class="cell-mono">${money(t.tax)}</span></div>
        <div class="warranty-row"><span class="name" style="font-weight:700;">Total</span><span class="cell-mono cell-strong">${money(t.total)}</span></div>
      </div>
    </div>
    ${canManage ? `
    <div class="panel">
      <div class="panel-head"><h3>Actions</h3></div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${e.status === 'Draft' ? `<button class="btn btn-ghost btn-sm" data-setstatus="Sent">Mark as Sent to customer</button>` : ''}
        ${e.status === 'Sent' ? `<button class="btn btn-ghost btn-sm" data-setstatus="Approved">Customer Approved</button><button class="btn btn-danger btn-sm" data-setstatus="Rejected">Customer Rejected</button>` : ''}
        ${e.status === 'Approved' && !existingInvoice ? `<button class="btn btn-primary btn-sm" id="btnConvert">Convert to Invoice</button>` : ''}
        ${existingInvoice ? `<a href="#/invoices/${existingInvoice.id}" class="btn btn-ghost btn-sm">View Invoice ${existingInvoice.invoiceNumber} →</a>` : ''}
      </div>
    </div>` : ''}
  `;
  pageEl.querySelectorAll('[data-setstatus]').forEach(btn => btn.addEventListener('click', async () => {
    await db.estimates.setStatus(e.id, btn.dataset.setstatus);
    location.hash = '#/estimates/' + e.id;
    render();
  }));
  const convertBtn = document.getElementById('btnConvert');
  if (convertBtn) convertBtn.addEventListener('click', async () => {
    const inv = await db.invoices.fromEstimate(e.id);
    location.hash = '#/invoices/' + inv.id;
  });
});

// =======================================================================
// INVOICES
// =======================================================================
route('/invoices', async () => {
  titleEl.textContent = 'Invoices';
  const [invoices, customers, serviceReqs] = await Promise.all([db.invoices.list(), db.customers.list(), db.service.list()]);
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Invoices</h2><p>Billed amount, payments received, and balance due per job.</p></div>
      <button class="btn btn-primary" id="btnNewInvoice">${ICONS.plus} New Invoice</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Invoice No.</th><th>Customer</th><th>Linked Job</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
        <tbody>
          ${invoices.map(inv => {
            const t = calcTotals(inv.items, inv.laborCharge);
            return `<tr style="cursor:pointer" data-goto="/invoices/${inv.id}">
              <td class="cell-mono cell-strong">${inv.invoiceNumber}</td>
              <td>${custMap[inv.customerId] ? custMap[inv.customerId].name : '—'}</td>
              <td>${inv.serviceRequestId && srMap[inv.serviceRequestId] ? srMap[inv.serviceRequestId].requestNumber : '—'}</td>
              <td class="cell-mono">${money(t.total)}</td>
              <td class="cell-mono">${money(inv.amountPaid)}</td>
              <td>${financeStatusPill(inv.status)}</td>
            </tr>`;
          }).join('') || `<tr><td colspan="6" class="table-empty">No invoices yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  document.getElementById('btnNewInvoice').addEventListener('click', () => openInvoiceModal(customers, serviceReqs));
});

function openInvoiceModal(customers, serviceReqs) {
  openModal(`
    <div class="modal-head"><h3>New Invoice</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="invForm" novalidate>
      <div class="form-row">
        <div class="field" data-field="customerId"><label>Customer <span class="req">*</span></label>
          <select id="if_customer" required>${customers.map(c => `<option value="${c.id}">${c.name} — ${c.phone}</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field"><label>Linked service request</label>
          <select id="if_sr"><option value="">None</option>${serviceReqs.map(s => `<option value="${s.id}">${s.requestNumber}</option>`).join('')}</select>
        </div>
      </div>
      <label style="font-size:12.5px; font-weight:600; color:var(--accent-text); display:block; margin-bottom:8px;">Line items</label>
      <div id="if_items"></div>
      <button type="button" class="btn btn-ghost btn-sm" id="if_addItem" style="margin:6px 0 16px;">${ICONS.plus} Add line item</button>
      <div class="field"><label>Labor charge (₹)</label><input type="number" id="if_labor" min="0" value="0"></div>
      <div class="divider"></div>
      <div id="if_totals"></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Invoice</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  wireLineItemsEditor('if_items', 'if_labor', 'if_totals', null, 0);
  document.getElementById('if_addItem').addEventListener('click', () => {
    const container = document.getElementById('if_items');
    const currentRows = container.querySelectorAll('[data-item-row]').length;
    container.insertAdjacentHTML('beforeend', lineItemRow({ description: '', qty: 1, unitCost: 0 }, currentRows));
    wireFreshRow(container, currentRows, 'if_labor', 'if_totals');
  });
  document.getElementById('invForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const items = Array.from(document.querySelectorAll('#if_items [data-item-row]')).map(row => ({
      description: row.querySelector('[data-item-desc]').value.trim(),
      qty: parseFloat(row.querySelector('[data-item-qty]').value) || 0,
      unitCost: parseFloat(row.querySelector('[data-item-cost]').value) || 0
    })).filter(i => i.description);
    const inv = await db.invoices.add({
      customerId: document.getElementById('if_customer').value,
      serviceRequestId: document.getElementById('if_sr').value,
      items, laborCharge: parseFloat(document.getElementById('if_labor').value) || 0
    });
    closeModal();
    location.hash = '#/invoices/' + inv.id;
  });
}

dynroute('/invoices/:id', async (p) => {
  titleEl.textContent = 'Invoice';
  const [inv, customers, serviceReqs, payments] = await Promise.all([db.invoices.get(p.id), db.customers.list(), db.service.list(), db.payments.listByInvoice(p.id)]);
  if (!inv) { pageEl.innerHTML = `<div class="empty-state"><p>Invoice not found.</p></div>`; return; }
  const customer = customers.find(c => c.id === inv.customerId);
  const sr = serviceReqs.find(s => s.id === inv.serviceRequestId);
  const t = calcTotals(inv.items, inv.laborCharge);
  const balance = Math.round((t.total - inv.amountPaid) * 100) / 100;
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  pageEl.innerHTML = `
    <div class="crumb"><a href="#/invoices">Invoices</a> / ${inv.invoiceNumber}</div>
    <div class="page-head">
      <div><h2 class="cell-mono">${inv.invoiceNumber}</h2><p>${customer ? customer.name : '—'}${sr ? ' · ' + sr.requestNumber : ''}</p></div>
      ${financeStatusPill(inv.status)}
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Line items</h3></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Description</th><th>Qty</th><th>Unit Cost</th><th>Amount</th></tr></thead>
        <tbody>${inv.items.map(i => `<tr><td>${i.description}</td><td>${i.qty}</td><td class="cell-mono">${money(i.unitCost)}</td><td class="cell-mono">${money(i.qty * i.unitCost)}</td></tr>`).join('')}</tbody>
      </table></div>
      <div style="max-width:280px; margin-left:auto; margin-top:14px;">
        <div class="warranty-row"><span class="name">Labor charge</span><span class="cell-mono">${money(inv.laborCharge)}</span></div>
        <div class="warranty-row"><span class="name">Subtotal</span><span class="cell-mono">${money(t.subtotal)}</span></div>
        <div class="warranty-row"><span class="name">GST (18%)</span><span class="cell-mono">${money(t.tax)}</span></div>
        <div class="warranty-row"><span class="name" style="font-weight:700;">Total</span><span class="cell-mono cell-strong">${money(t.total)}</span></div>
        <div class="warranty-row"><span class="name">Paid</span><span class="cell-mono">${money(inv.amountPaid)}</span></div>
        <div class="warranty-row"><span class="name" style="font-weight:700; color:${balance > 0 ? 'var(--red)' : 'var(--green)'};">Balance due</span><span class="cell-mono cell-strong" style="color:${balance > 0 ? 'var(--red)' : 'var(--green)'};">${money(balance)}</span></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Payment history</h3>${canManage && balance > 0 ? `<button class="btn btn-primary btn-sm" id="btnRecordPayment">${ICONS.plus} Record Payment</button>` : ''}</div>
      ${payments.length ? `<div class="table-wrap"><table class="data">
        <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th><th>Received by</th></tr></thead>
        <tbody>${payments.map(p => `<tr><td class="cell-mono">${p.createdAt}</td><td class="cell-mono">${money(p.amount)}</td><td><span class="role-badge">${p.method}</span></td><td class="cell-mono">${p.reference || '—'}</td><td>${p.receivedBy}</td></tr>`).join('')}</tbody>
      </table></div>` : `<p class="hint">No payments recorded yet.</p>`}
    </div>
  `;
  const payBtn = document.getElementById('btnRecordPayment');
  if (payBtn) payBtn.addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Record Payment</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="payForm" novalidate>
        <div class="note" style="margin-bottom:18px;">Balance due: ${money(balance)}</div>
        <div class="form-row">
          <div class="field" data-field="amount"><label>Amount (₹) <span class="req">*</span></label><input id="pf_amount" type="number" min="0.01" max="${balance}" step="0.01" value="${balance}" required><div class="error">Required.</div></div>
          <div class="field"><label>Method</label><select id="pf_method"><option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option></select></div>
        </div>
        <div class="field"><label>Reference</label><input id="pf_ref" placeholder="Transaction ID, cheque no., etc. (optional)"></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Record Payment</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('payForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.payments.add({
        invoiceId: inv.id,
        amount: parseFloat(document.getElementById('pf_amount').value),
        method: document.getElementById('pf_method').value,
        reference: document.getElementById('pf_ref').value.trim(),
        receivedBy: SESSION.name
      });
      closeModal();
      location.hash = '#/invoices/' + inv.id;
      render();
    });
  });
});

// =======================================================================
// LOCAL PURCHASE
// =======================================================================
route('/local-purchases', async () => {
  titleEl.textContent = 'Local Purchase';
  const [purchases, serviceReqs, technicians, centers] = await Promise.all([db.localPurchases.list(), db.service.list(), db.technicians.list(), db.serviceCenters.list()]);
  const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Warehouse';
  const pendingApprovals = await db.approvals.list();
  const pendingLpIds = new Set(pendingApprovals.filter(a => a.entityType === 'Local Purchase' && a.status === 'Pending').map(a => a.entityId));

  let scoped = purchases;
  let myType = '', myId = '';
  if (SESSION.role === 'Technician') {
    const t = await db.technicians.byUser(SESSION.uid);
    if (t) { myType = 'Technician'; myId = t.id; scoped = purchases.filter(l => l.purchasedByType === 'Technician' && l.purchasedById === t.id); }
  } else if (SESSION.role === 'Service Center') {
    const c = await db.serviceCenters.byUser(SESSION.uid);
    if (c) { myType = 'Service Center'; myId = c.id; scoped = purchases.filter(l => l.purchasedByType === 'Service Center' && l.purchasedById === c.id); }
  }
  const requesterName = (type, id) => {
    if (type === 'Technician') { const t = technicians.find(x => x.id === id); return t ? t.name : id; }
    const c = centers.find(x => x.id === id); return c ? c.name : id;
  };

  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Local Purchase</h2><p>${canManage ? "Field reimbursement requests when a part isn't in warehouse or center stock." : 'Your local purchase reimbursement requests.'}</p></div>
      <button class="btn btn-primary" id="btnNewLP">${ICONS.plus} New Request</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Request No.</th><th>Item</th><th>Amount</th><th>Requested By</th><th>Linked Job</th><th>Status</th>${canManage ? '<th></th>' : ''}</tr></thead>
        <tbody>
          ${scoped.map(l => `
            <tr>
              <td class="cell-mono cell-strong">${l.requestNumber}</td>
              <td>${l.partDescription}</td>
              <td class="cell-mono">${money(l.amount)}</td>
              <td>${requesterName(l.purchasedByType, l.purchasedById)} <span class="hint">(${l.purchasedByType})</span></td>
              <td>${l.serviceRequestId && srMap[l.serviceRequestId] ? `<a href="#/service/${l.serviceRequestId}" class="cell-mono">${srMap[l.serviceRequestId].requestNumber}</a>` : '—'}</td>
              <td>${pendingLpIds.has(l.id) ? pill('Pending Approval', 'amber') : financeStatusPill(l.status)}</td>
              ${canManage ? `<td>${pendingLpIds.has(l.id) ? `<a href="#/approvals" class="btn btn-ghost btn-sm">Review →</a>` : lpActionButtons(l)}</td>` : ''}
            </tr>`).join('') || `<tr><td colspan="${canManage ? 7 : 6}" class="table-empty">No local purchase requests yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('btnNewLP').addEventListener('click', () => openLocalPurchaseModal(serviceReqs, technicians, centers, myType, myId));
  pageEl.querySelectorAll('[data-approve-lp]').forEach(btn => btn.addEventListener('click', async () => {
    const l = purchases.find(x => x.id === btn.dataset.approveLp);
    if (db.approvals.requiresApproval('Local Purchase', l.amount)) {
      await db.approvals.request({
        entityType: 'Local Purchase', entityId: l.id, amount: l.amount,
        description: l.partDescription, requestedBy: SESSION.name
      });
    } else {
      await db.localPurchases.setStatus(l.id, 'Approved');
    }
    render();
  }));
  pageEl.querySelectorAll('[data-reimburse-lp]').forEach(btn => btn.addEventListener('click', async () => { await db.localPurchases.setStatus(btn.dataset.reimburseLp, 'Reimbursed'); render(); }));
});

function lpActionButtons(l) {
  if (l.status === 'Requested') return `<button class="btn btn-ghost btn-sm" data-approve-lp="${l.id}">Approve</button>`;
  if (l.status === 'Approved') return `<button class="btn btn-ghost btn-sm" data-reimburse-lp="${l.id}">Mark Reimbursed</button>`;
  return '';
}

function openLocalPurchaseModal(serviceReqs, technicians, centers, myType, myId) {
  const isSelfService = myType && myId;
  openModal(`
    <div class="modal-head"><h3>New Local Purchase Request</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="lpForm" novalidate>
      ${isSelfService ? '' : `
      <div class="form-row">
        <div class="field" data-field="purchasedByType"><label>Requester Type <span class="req">*</span></label>
          <select id="lp_type" required><option value="Technician">Technician</option><option value="Service Center">Service Center</option></select>
        </div>
        <div class="field" data-field="purchasedById"><label>Requester <span class="req">*</span></label><select id="lp_id" required></select><div class="error">Required.</div></div>
      </div>`}
      <div class="field" data-field="partDescription"><label>Item purchased <span class="req">*</span></label><input id="lp_desc" required placeholder="e.g. HDMI cable, screws, adhesive"><div class="error">Required.</div></div>
      <div class="form-row">
        <div class="field" data-field="amount"><label>Amount (₹) <span class="req">*</span></label><input id="lp_amount" type="number" min="1" required><div class="error">Required.</div></div>
        <div class="field"><label>Linked service request</label><select id="lp_sr"><option value="">None</option>${serviceReqs.map(s => `<option value="${s.id}">${s.requestNumber}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Reason</label><textarea id="lp_reason" rows="2" placeholder="Why a local purchase instead of dispatched stock?"></textarea></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit Request</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  if (!isSelfService) {
    const typeSel = document.getElementById('lp_type');
    const idSel = document.getElementById('lp_id');
    const populate = () => {
      const list = typeSel.value === 'Technician' ? technicians : centers;
      idSel.innerHTML = '<option value="">Select…</option>' + list.filter(x => x.status === 'Active').map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    };
    typeSel.addEventListener('change', populate);
    populate();
  }
  document.getElementById('lpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    await db.localPurchases.add({
      purchasedByType: isSelfService ? myType : document.getElementById('lp_type').value,
      purchasedById: isSelfService ? myId : document.getElementById('lp_id').value,
      partDescription: document.getElementById('lp_desc').value.trim(),
      amount: parseFloat(document.getElementById('lp_amount').value),
      serviceRequestId: document.getElementById('lp_sr').value,
      reason: document.getElementById('lp_reason').value.trim()
    });
    closeModal();
    render();
  });
}

// =======================================================================
// RMA & REPLACEMENT
// =======================================================================
route('/rma', async () => {
  titleEl.textContent = 'RMA & Replacement';
  const [rmas, customers, products, serviceReqs] = await Promise.all([
    db.rma.list(), db.customers.list(), db.products.list(), db.service.list()
  ]);
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const prodMap = Object.fromEntries(products.map(p => [p.id, p]));
  const canCreate = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center' || SESSION.role === 'Technician';

  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>RMA &amp; Replacement</h2><p>For repairs that aren't economical — inspect, then replace, refund, or escalate back to service.</p></div>
      ${canCreate ? `<button class="btn btn-primary" id="btnNewRMA">${ICONS.plus} New RMA</button>` : ''}
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>RMA No.</th><th>Customer</th><th>Product</th><th>Resolution</th><th>Status</th></tr></thead>
        <tbody>
          ${rmas.map(r => `
            <tr style="cursor:pointer" data-goto="/rma/${r.id}">
              <td class="cell-mono cell-strong">${r.rmaNumber}</td>
              <td>${custMap[r.customerId] ? custMap[r.customerId].name : '—'}</td>
              <td>${prodMap[r.productId] ? prodMap[r.productId].name : '—'}</td>
              <td>${r.resolutionType ? `<span class="role-badge">${r.resolutionType}</span>` : '—'}</td>
              <td>${rmaStatusPill(r.status)}</td>
            </tr>`).join('') || `<tr><td colspan="5" class="table-empty">No RMA requests yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  const addBtn = document.getElementById('btnNewRMA');
  if (addBtn) addBtn.addEventListener('click', () => openNewRmaModal(customers, products, serviceReqs));
});

function rmaStatusPill(status) {
  const map = { Requested: 'gray', Approved: 'blue', 'Product Received': 'blue', Inspected: 'amber', Resolved: 'green', Closed: 'green' };
  return pill(status, map[status] || 'gray');
}

function openNewRmaModal(customers, products, serviceReqs) {
  openModal(`
    <div class="modal-head"><h3>New RMA Request</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="rmaForm" novalidate>
      <div class="form-row">
        <div class="field" data-field="customerId"><label>Customer <span class="req">*</span></label>
          <select id="rf_customer" required><option value="">Select…</option>${customers.map(c => `<option value="${c.id}">${c.name} — ${c.phone}</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
        <div class="field" data-field="productId"><label>Product <span class="req">*</span></label>
          <select id="rf_product" required><option value="">Select…</option>${products.map(p => `<option value="${p.id}">${p.name} (${p.model})</option>`).join('')}</select>
          <div class="error">Required.</div>
        </div>
      </div>
      <div class="form-row">
        <div class="field"><label>Serial number</label><select id="rf_serial"><option value="">Select product first</option></select></div>
        <div class="field"><label>Linked service request</label><select id="rf_sr"><option value="">None</option>${serviceReqs.map(s => `<option value="${s.id}">${s.requestNumber}</option>`).join('')}</select></div>
      </div>
      <div class="field" data-field="reason"><label>Reason <span class="req">*</span></label><textarea id="rf_reason" rows="3" required placeholder="Why is repair not viable?"></textarea><div class="error">Required.</div></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit RMA Request</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  document.getElementById('rf_product').addEventListener('change', async (e) => {
    const serials = await db.serials.listByProduct(e.target.value);
    document.getElementById('rf_serial').innerHTML = '<option value="">None / unknown</option>' + serials.map(s => `<option value="${s.id}">${s.serial} (${s.status})</option>`).join('');
  });
  document.getElementById('rmaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    const rma = await db.rma.add({
      customerId: document.getElementById('rf_customer').value,
      productId: document.getElementById('rf_product').value,
      serialId: document.getElementById('rf_serial').value,
      serviceRequestId: document.getElementById('rf_sr').value,
      reason: document.getElementById('rf_reason').value.trim()
    });
    closeModal();
    location.hash = '#/rma/' + rma.id;
  });
}

dynroute('/rma/:id', async (p) => {
  await renderRmaDetail(p.id, 'overview');
});

async function renderRmaDetail(id, activeTab) {
  titleEl.textContent = 'RMA';
  const r = await db.rma.get(id);
  if (!r) { pageEl.innerHTML = `<div class="empty-state"><p>RMA not found.</p></div>`; return; }
  const [customer, products, serial, serviceReqs] = await Promise.all([
    db.customers.get(r.customerId), db.products.list(), r.serialId ? db.serials.get(r.serialId) : Promise.resolve(null), db.service.list()
  ]);
  const product = products.find(x => x.id === r.productId);
  const sr = serviceReqs.find(x => x.id === r.serviceRequestId);
  const stepIndex = RMA_STATUS_STEPS.indexOf(r.status);
  const canManage = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'resolution', label: 'Resolution' }
  ];

  pageEl.innerHTML = `
    <div class="crumb"><a href="#/rma">RMA &amp; Replacement</a> / ${r.rmaNumber}</div>
    <div class="page-head">
      <div>
        <h2 class="cell-mono">${r.rmaNumber}</h2>
        <p>${customer ? customer.name : '—'} · ${product ? product.name : '—'}${serial ? ' · ' + serial.serial : ''}${sr ? ' · ' + sr.requestNumber : ''}</p>
      </div>
      ${rmaStatusPill(r.status)}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Progress</h3></div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${RMA_STATUS_STEPS.map((s, i) => `<span class="pill ${i <= stepIndex ? (i === stepIndex ? 'pill-blue' : 'pill-green') : 'pill-gray'}">${i < stepIndex ? '✓ ' : ''}${s}</span>`).join('')}
      </div>
      ${canManage ? `
      <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap;">
        ${r.status === 'Requested' ? `<button class="btn btn-primary btn-sm" data-advance="Approved">Approve RMA</button>` : ''}
        ${r.status === 'Approved' ? `<button class="btn btn-primary btn-sm" data-advance="Product Received">Mark Product Received</button>` : ''}
        ${r.status === 'Resolved' ? `<button class="btn btn-primary btn-sm" data-advance="Closed">Close RMA</button>` : ''}
        ${r.status === 'Product Received' ? `<p class="hint">Complete the Inspection tab to move this forward.</p>` : ''}
      </div>` : ''}
    </div>

    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
    <div id="rmaTabContent"></div>
  `;

  await renderRmaTab(activeTab, r, { customer, product, serial, canManage });
  pageEl.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => renderRmaDetail(id, btn.dataset.tab)));
  pageEl.querySelectorAll('[data-advance]').forEach(btn => btn.addEventListener('click', async () => {
    await db.rma.setStatus(r.id, btn.dataset.advance);
    renderRmaDetail(id, activeTab);
  }));
}

async function renderRmaTab(tab, r, ctx) {
  const el = document.getElementById('rmaTabContent');
  if (tab === 'overview') {
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Reason for return</h3></div>
        <p style="font-size:13.5px; color:var(--text-soft); line-height:1.7;">${r.reason}</p>
      </div>`;
  } else if (tab === 'inspection') {
    const disabled = !ctx.canManage || (r.status !== 'Product Received' && r.status !== 'Inspected');
    el.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h3>Inspection</h3></div>
        ${r.status === 'Requested' || r.status === 'Approved' ? `<p class="hint">Mark the product as received before recording an inspection.</p>` : ''}
        <form id="inspForm">
          <div class="field"><label>Condition on arrival</label><textarea id="in_condition" rows="2" ${disabled ? 'disabled' : ''}>${r.inspection.condition || ''}</textarea></div>
          <div class="field"><label>Findings</label><textarea id="in_findings" rows="3" ${disabled ? 'disabled' : ''}>${r.inspection.findings || ''}</textarea></div>
          <div class="field"><label>Recommended resolution</label>
            <select id="in_resolution" ${disabled ? 'disabled' : ''}>
              <option value="">Select…</option>
              ${RESOLUTION_TYPES.map(t => `<option ${r.resolutionType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          ${!disabled ? `<button type="submit" class="btn btn-primary btn-sm">Save Inspection</button>` : ''}
        </form>
      </div>`;
    const form = document.getElementById('inspForm');
    if (!disabled) form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await db.rma.setInspection(r.id, {
        condition: document.getElementById('in_condition').value.trim(),
        findings: document.getElementById('in_findings').value.trim(),
        recommendedResolution: document.getElementById('in_resolution').value
      });
      renderRmaDetail(r.id, 'inspection');
    });
  } else if (tab === 'resolution') {
    if (!r.resolutionType) {
      el.innerHTML = `<div class="panel"><p class="hint">Complete the Inspection tab and choose a recommended resolution first.</p></div>`;
      return;
    }
    if (r.status === 'Resolved' || r.status === 'Closed') {
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>${r.resolutionType} — completed</h3></div>
          ${r.resolutionType === 'Replacement' ? `<p class="hint">Replacement dispatched ${r.replacement.dispatchedAt}. New serial ID: <span class="cell-mono">${r.replacement.newSerialId}</span></p>` : ''}
          ${r.resolutionType === 'Refund' ? `<p class="hint">Refund of ${money(r.refund.amount)} via ${r.refund.method}, processed ${r.refund.processedAt}.</p>` : ''}
          ${r.resolutionType === 'Repair Escalation' ? `<p class="hint">Escalated to a new service request.${r.escalatedServiceRequestId ? ` <a href="#/service/${r.escalatedServiceRequestId}">View job →</a>` : ''}</p>` : ''}
        </div>`;
      return;
    }
    if (!ctx.canManage) { el.innerHTML = `<div class="panel"><p class="hint">Awaiting resolution from the service team.</p></div>`; return; }

    const pendingApprovals = await db.approvals.listByEntity('RMA Refund', r.id);
    const openApproval = pendingApprovals.find(a => a.status === 'Pending');
    if (r.resolutionType === 'Refund' && openApproval) {
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>Refund pending approval</h3>${pill('Pending', 'amber')}</div>
          <p class="hint">${openApproval.approvalNumber} · ${money(openApproval.amount)} via ${openApproval.meta.method} · requested by ${openApproval.requestedBy}</p>
          <p class="hint" style="margin-top:8px;">This refund exceeds the auto-approval threshold and needs sign-off in Approvals before it's processed.</p>
          <a href="#/approvals" class="btn btn-ghost btn-sm" style="margin-top:12px;">Go to Approvals →</a>
        </div>`;
      return;
    }

    if (r.resolutionType === 'Replacement') {
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>Dispatch replacement</h3></div>
          <div class="field"><label>Available serial for ${ctx.product ? ctx.product.name : 'this product'}</label><select id="rs_serial"><option value="">Loading…</option></select></div>
          <button class="btn btn-primary btn-sm" id="btnDispatchReplacement">Dispatch Replacement</button>
        </div>`;
      db.serials.listAvailable(r.productId).then(avail => {
        const sel = document.getElementById('rs_serial');
        sel.innerHTML = avail.length ? avail.map(s => `<option value="${s.id}">${s.serial}</option>`).join('') : '<option value="">No stock available — check Serial/Batch</option>';
      });
      document.getElementById('btnDispatchReplacement').addEventListener('click', async () => {
        const serialId = document.getElementById('rs_serial').value;
        if (!serialId) return;
        await db.rma.resolveReplacement(r.id, serialId, SESSION.name);
        renderRmaDetail(r.id, 'resolution');
      });
    } else if (r.resolutionType === 'Refund') {
      const rules = await db.approvals.listRules();
      const refundRule = rules.find(x => x.entityType === 'RMA Refund');
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>Process refund</h3></div>
          ${refundRule && refundRule.active ? `<p class="hint" style="margin-bottom:14px;">Refunds of ${money(refundRule.thresholdAmount)} or more require Approvals sign-off before processing.</p>` : ''}
          <form id="refundForm">
            <div class="form-row">
              <div class="field"><label>Amount (₹)</label><input type="number" id="rf_amt" min="1" required></div>
              <div class="field"><label>Method</label><select id="rf_method"><option>Bank Transfer</option><option>UPI</option><option>Cash</option></select></div>
            </div>
            <div id="rf_note"></div>
            <button type="submit" class="btn btn-primary btn-sm">Process Refund</button>
          </form>
        </div>`;
      document.getElementById('refundForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amt = parseFloat(document.getElementById('rf_amt').value);
        const method = document.getElementById('rf_method').value;
        if (!amt) return;
        if (db.approvals.requiresApproval('RMA Refund', amt)) {
          await db.approvals.request({
            entityType: 'RMA Refund', entityId: r.id, amount: amt,
            description: `Refund for ${r.rmaNumber}`, requestedBy: SESSION.name, meta: { method }
          });
        } else {
          await db.rma.resolveRefund(r.id, amt, method);
        }
        renderRmaDetail(r.id, 'resolution');
      });
    } else if (r.resolutionType === 'Repair Escalation') {
      el.innerHTML = `
        <div class="panel">
          <div class="panel-head"><h3>Escalate to a new service request</h3></div>
          <p class="hint" style="margin-bottom:14px;">Opens a fresh service job for this customer and product, referencing this RMA's findings.</p>
          <button class="btn btn-primary btn-sm" id="btnEscalate">Create Service Request</button>
        </div>`;
      document.getElementById('btnEscalate').addEventListener('click', async () => {
        const newSr = await db.service.add({
          customerId: r.customerId, productId: r.productId, type: 'Out-of-Warranty',
          district: (await db.customers.get(r.customerId)).district || '', source: SESSION.role,
          complaint: `Escalated from RMA ${r.rmaNumber}: ${r.inspection.findings || r.reason}`
        });
        await db.rma.resolveEscalation(r.id, newSr.id);
        renderRmaDetail(r.id, 'resolution');
      });
    }
  }
}

// =======================================================================
// NOTIFICATION TEMPLATES
// =======================================================================
route('/templates', async () => {
  titleEl.textContent = 'Templates';
  const templates = await db.templates.list();
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Notification Templates</h2><p>Triggered automatically on key events — service updates, invoices, payments, RMA outcomes.</p></div>
      <button class="btn btn-primary" id="btnAddTemplate">${ICONS.plus} Add Template</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Event</th><th>Channel</th><th>Preview</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${templates.map(t => `
            <tr>
              <td class="cell-strong">${t.name}</td>
              <td><span class="role-badge">${t.event}</span></td>
              <td>${channelPill(t.channel)}</td>
              <td style="max-width:320px; font-size:12.5px; color:var(--text-soft);">${t.body}</td>
              <td>${statusPill(t.status)}</td>
              <td><button class="btn btn-ghost btn-sm" data-toggle-tpl="${t.id}">${t.status === 'Active' ? 'Disable' : 'Enable'}</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('[data-toggle-tpl]').forEach(btn => btn.addEventListener('click', async () => {
    const t = templates.find(x => x.id === btn.dataset.toggleTpl);
    await db.templates.setStatus(t.id, t.status === 'Active' ? 'Inactive' : 'Active');
    render();
  }));
  document.getElementById('btnAddTemplate').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Add Template</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="tplForm" novalidate>
        <div class="field" data-field="name"><label>Template Name <span class="req">*</span></label><input id="tf_name" required><div class="error">Required.</div></div>
        <div class="form-row">
          <div class="field" data-field="event"><label>Event <span class="req">*</span></label>
            <select id="tf_event" required>
              <option>Service Request Created</option><option>Service Status Updated</option><option>Invoice Generated</option><option>Payment Received</option><option>RMA Resolved</option>
            </select>
          </div>
          <div class="field"><label>Channel</label><select id="tf_channel"><option>SMS</option><option>WhatsApp</option><option>Email</option></select></div>
        </div>
        <div class="field" data-field="body"><label>Message Body <span class="req">*</span></label>
          <textarea id="tf_body" rows="3" required placeholder="Hi {{customerName}}, ..."></textarea>
          <div class="hint">Available placeholders depend on event: {{customerName}}, {{requestNumber}}, {{status}}, {{invoiceNumber}}, {{amount}}, {{rmaNumber}}, {{resolutionType}}.</div>
          <div class="error">Required.</div>
        </div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Template</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('tplForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.templates.add({
        name: document.getElementById('tf_name').value.trim(),
        event: document.getElementById('tf_event').value,
        channel: document.getElementById('tf_channel').value,
        body: document.getElementById('tf_body').value.trim()
      });
      closeModal();
      render();
    });
  });
});

function channelPill(channel) {
  const map = { SMS: 'blue', WhatsApp: 'green', Email: 'amber' };
  return pill(channel, map[channel] || 'gray');
}

// =======================================================================
// COMMUNICATION LOG
// =======================================================================
route('/messages', async () => {
  titleEl.textContent = 'Communication Log';
  const [messages, customers] = await Promise.all([db.messages.list(), db.customers.list()]);
  renderMessagesList(messages, customers, '');
});

function renderMessagesList(messages, customers, channelFilter) {
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const filtered = channelFilter ? messages.filter(m => m.channel === channelFilter) : messages;
  const canSend = SESSION.role === 'Super Admin' || SESSION.role === 'Service Center';
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Communication Log</h2><p>${messages.length} messages sent — auto-triggered from Service, Finance and RMA, plus manual sends.</p></div>
      ${canSend ? `<button class="btn btn-primary" id="btnSendMessage">${ICONS.plus} Send Message</button>` : ''}
    </div>
    <div class="tabs">
      <button class="tab-btn2 ${!channelFilter ? 'active' : ''}" data-channel="">All</button>
      <button class="tab-btn2 ${channelFilter === 'SMS' ? 'active' : ''}" data-channel="SMS">SMS</button>
      <button class="tab-btn2 ${channelFilter === 'WhatsApp' ? 'active' : ''}" data-channel="WhatsApp">WhatsApp</button>
      <button class="tab-btn2 ${channelFilter === 'Email' ? 'active' : ''}" data-channel="Email">Email</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Date</th><th>Customer</th><th>Channel</th><th>Message</th><th>Related</th><th>Sent By</th></tr></thead>
        <tbody>
          ${filtered.map(m => `
            <tr>
              <td class="cell-mono">${m.createdAt}</td>
              <td class="cell-strong">${custMap[m.customerId] ? custMap[m.customerId].name : '—'}</td>
              <td>${channelPill(m.channel)}</td>
              <td style="max-width:360px; font-size:12.5px; color:var(--text-soft);">${m.body}</td>
              <td>${m.relatedType !== 'Manual' && m.relatedId ? `<span class="role-badge">${m.relatedType}</span>` : '<span class="hint">Manual</span>'}</td>
              <td class="hint">${m.sentBy}</td>
            </tr>`).join('') || `<tr><td colspan="6" class="table-empty">No messages${channelFilter ? ' on ' + channelFilter : ''} yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('[data-channel]').forEach(btn => btn.addEventListener('click', () => renderMessagesList(messages, customers, btn.dataset.channel)));
  const sendBtn = document.getElementById('btnSendMessage');
  if (sendBtn) sendBtn.addEventListener('click', () => openSendMessageModal(customers, () => render()));
}

async function openSendMessageModal(customers, onDone, prefillCustomerId) {
  const templates = await db.templates.list();
  const activeTemplates = templates.filter(t => t.status === 'Active');
  openModal(`
    <div class="modal-head"><h3>Send Message</h3><button class="modal-close" id="mClose">✕</button></div>
    <form id="msgForm" novalidate>
      <div class="field" data-field="customerId"><label>Customer <span class="req">*</span></label>
        <select id="mf_customer" required>${customers.map(c => `<option value="${c.id}" ${prefillCustomerId === c.id ? 'selected' : ''}>${c.name} — ${c.phone}</option>`).join('')}</select>
        <div class="error">Required.</div>
      </div>
      <div class="form-row">
        <div class="field"><label>Channel</label><select id="mf_channel"><option>SMS</option><option>WhatsApp</option><option>Email</option></select></div>
        <div class="field"><label>Use a template</label><select id="mf_template"><option value="">Freeform message</option>${activeTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
      </div>
      <div class="field" data-field="body"><label>Message <span class="req">*</span></label><textarea id="mf_body" rows="3" required placeholder="Type a message, or pick a template above"></textarea><div class="error">Required.</div></div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Send</button>
      </div>
    </form>
  `);
  document.getElementById('mClose').addEventListener('click', closeModal);
  document.getElementById('mCancel').addEventListener('click', closeModal);
  const customerSel = document.getElementById('mf_customer');
  const templateSel = document.getElementById('mf_template');
  const bodyEl = document.getElementById('mf_body');
  const channelSel = document.getElementById('mf_channel');
  const applyTemplatePreview = () => {
    const tpl = activeTemplates.find(t => t.id === templateSel.value);
    if (!tpl) return;
    const customer = customers.find(c => c.id === customerSel.value);
    bodyEl.value = tpl.body.replace(/\{\{customerName\}\}/g, customer ? customer.name : '{{customerName}}').replace(/\{\{\w+\}\}/g, '…');
    channelSel.value = tpl.channel;
  };
  templateSel.addEventListener('change', applyTemplatePreview);
  customerSel.addEventListener('change', applyTemplatePreview);
  document.getElementById('msgForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateModalForm(e.target)) return;
    await db.messages.send({
      customerId: customerSel.value,
      channel: channelSel.value,
      templateId: templateSel.value || '',
      freeformBody: bodyEl.value.trim(),
      relatedType: 'Manual',
      sentBy: SESSION.name
    });
    closeModal();
    onDone();
  });
}

// =======================================================================
// REPORTS & ANALYTICS
// =======================================================================
function barChart(data, opts) {
  opts = opts || {};
  const entries = Object.entries(data);
  if (!entries.length) return `<p class="hint">No data yet.</p>`;
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return `<div class="barchart">
    ${entries.sort((a, b) => b[1] - a[1]).map(([label, value]) => `
      <div class="barchart-row">
        <span class="blabel">${label}</span>
        <div class="btrack"><div class="bfill" style="width:${Math.round((value / max) * 100)}%;"></div></div>
        <span class="bvalue">${opts.money ? money(value) : value}</span>
      </div>
    `).join('')}
  </div>`;
}

route('/reports', async () => {
  titleEl.textContent = 'Reports & Analytics';
  await renderReportsTab('overview');
});

async function renderReportsTab(tab) {
  const [svc, fin, inv, rma, comm] = await Promise.all([
    db.reports.serviceStats(), db.reports.financeStats(), db.reports.inventoryStats(), db.reports.rmaStats(), db.reports.communicationStats()
  ]);
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'service', label: 'Service' },
    { id: 'finance', label: 'Finance' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'rma', label: 'RMA' }
  ];

  let body = '';
  if (tab === 'overview') {
    body = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="lbl">Revenue Collected</div><strong>${money(fin.totalRevenue)}</strong><div class="sub">${fin.invoiceCount} invoice${fin.invoiceCount !== 1 ? 's' : ''}</div></div>
        <div class="kpi-card"><div class="lbl">Outstanding Balance</div><strong>${money(fin.outstanding)}</strong></div>
        <div class="kpi-card"><div class="lbl">Avg. Resolution Time</div><strong>${svc.avgResolutionDays} day${svc.avgResolutionDays !== 1 ? 's' : ''}</strong><div class="sub">${svc.closedCount} closed job${svc.closedCount !== 1 ? 's' : ''}</div></div>
        <div class="kpi-card"><div class="lbl">RMA Resolution Rate</div><strong>${rma.resolutionRate}%</strong><div class="sub">${rma.resolved} of ${rma.totalRma}</div></div>
      </div>
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Open Service Requests</div><strong>${svc.openRequests}</strong></div>
        <div class="stat-card"><div class="lbl">Stock Value on Hand</div><strong>${money(inv.totalStockValue)}</strong></div>
        <div class="stat-card"><div class="lbl">Local Purchase Spend</div><strong>${money(fin.localPurchaseSpend)}</strong></div>
        <div class="stat-card"><div class="lbl">Messages Sent</div><strong>${comm.totalMessages}</strong></div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Service requests by status</h3></div>
        ${barChart(svc.byStatus)}
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Revenue by product category</h3></div>
        ${barChart(fin.byCategory, { money: true })}
      </div>`;
  } else if (tab === 'service') {
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Total Requests</div><strong>${svc.totalRequests}</strong></div>
        <div class="stat-card"><div class="lbl">Open</div><strong>${svc.openRequests}</strong></div>
        <div class="stat-card"><div class="lbl">Closed</div><strong>${svc.closedCount}</strong></div>
        <div class="stat-card"><div class="lbl">Avg. Resolution</div><strong>${svc.avgResolutionDays}d</strong></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>By status</h3></div>${barChart(svc.byStatus)}</div>
      <div class="panel"><div class="panel-head"><h3>By type</h3></div>${barChart(svc.byType)}</div>
      <div class="panel"><div class="panel-head"><h3>By district</h3></div>${barChart(svc.byDistrict)}</div>`;
  } else if (tab === 'finance') {
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Revenue Collected</div><strong>${money(fin.totalRevenue)}</strong></div>
        <div class="stat-card"><div class="lbl">Outstanding</div><strong>${money(fin.outstanding)}</strong></div>
        <div class="stat-card"><div class="lbl">Invoices</div><strong>${fin.invoiceCount}</strong></div>
        <div class="stat-card"><div class="lbl">Local Purchase Spend</div><strong>${money(fin.localPurchaseSpend)}</strong></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Payments by method</h3></div>${barChart(fin.byMethod, { money: true })}</div>
      <div class="panel"><div class="panel-head"><h3>Billed revenue by product category</h3></div>${barChart(fin.byCategory, { money: true })}</div>
      <p class="hint">"Billed" reflects invoice totals including unpaid balances; "Revenue Collected" above reflects actual payments received.</p>`;
  } else if (tab === 'inventory') {
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Stock Value</div><strong>${money(inv.totalStockValue)}</strong></div>
        <div class="stat-card"><div class="lbl">Stock Movements</div><strong>${inv.totalMovements}</strong></div>
        <div class="stat-card"><div class="lbl">Pending Spare Requests</div><strong>${inv.pendingSpareRequests}</strong></div>
        <div class="stat-card"><div class="lbl">Low-Stock Alerts</div><strong>${inv.lowStock.length}</strong></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Stock value by location</h3></div>${barChart(inv.byLocationValue, { money: true })}</div>
      <div class="panel">
        <div class="panel-head"><h3>Low stock (≤3 units)</h3></div>
        ${inv.lowStock.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Part</th><th>Location</th><th>Quantity</th></tr></thead><tbody>
          ${inv.lowStock.map(l => `<tr><td class="cell-strong">${l.partName}</td><td class="cell-mono">${l.locationKey}</td><td>${pill(l.quantity, 'amber')}</td></tr>`).join('')}
        </tbody></table></div>` : `<p class="hint">Nothing running low.</p>`}
      </div>`;
  } else if (tab === 'rma') {
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Total RMAs</div><strong>${rma.totalRma}</strong></div>
        <div class="stat-card"><div class="lbl">Resolved</div><strong>${rma.resolved}</strong></div>
        <div class="stat-card"><div class="lbl">Resolution Rate</div><strong>${rma.resolutionRate}%</strong></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>By resolution type</h3></div>${barChart(rma.byResolution)}</div>`;
  }

  pageEl.innerHTML = `
    <div class="page-head"><div><h2>Reports &amp; Analytics</h2><p>Computed across Service, Finance, Inventory, RMA and Communication.</p></div></div>
    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${tab === t.id ? 'active' : ''}" data-rtab="${t.id}">${t.label}</button>`).join('')}</div>
    ${body}
  `;
  pageEl.querySelectorAll('[data-rtab]').forEach(btn => btn.addEventListener('click', () => renderReportsTab(btn.dataset.rtab)));
}

// =======================================================================
// WEBSITE LEADS
// =======================================================================
route('/website-leads', async () => {
  titleEl.textContent = 'Website Leads';
  const [leads, customers, serviceReqs] = await Promise.all([db.websiteLeads.list(), db.customers.list(), db.service.list()]);
  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Website Leads</h2><p>Every submission from the public site's Contact form — General Enquiry, Book a Repair, and Become a Partner.</p></div>
    </div>
    <div class="note" style="margin-bottom:18px;">Service Request submissions automatically create a real Service Hub record and trigger the "Request Received" notification — no manual re-entry.</div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Date</th><th>Reference No.</th><th>Name</th><th>Phone</th><th>Reason</th><th>Customer</th><th>Linked Job</th><th>Message</th></tr></thead>
        <tbody>
          ${leads.map(l => `
            <tr>
              <td class="cell-mono">${l.createdAt}</td>
              <td class="cell-mono cell-strong">${l.leadNumber || '—'}</td>
              <td class="cell-strong">${l.name}</td>
              <td class="cell-mono">${l.phone}</td>
              <td><span class="role-badge">${l.reason}</span></td>
              <td>${custMap[l.customerId] ? `<a href="#/customers/${l.customerId}">${custMap[l.customerId].name}</a>` : '—'}</td>
              <td>${l.serviceRequestId && srMap[l.serviceRequestId] ? `<a href="#/service/${l.serviceRequestId}" class="cell-mono">${srMap[l.serviceRequestId].requestNumber}</a>` : '—'}</td>
              <td style="max-width:280px; font-size:12.5px; color:var(--text-soft);">${l.message || '—'}</td>
            </tr>`).join('') || `<tr><td colspan="8" class="table-empty">No website submissions yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
});

// =======================================================================
// SLA & ESCALATION
// =======================================================================
route('/sla', async () => {
  titleEl.textContent = 'SLA & Escalation';
  await renderSlaTab('status');
});

async function renderSlaTab(tab) {
  const canManageRules = SESSION.role === 'Super Admin';
  const tabs = [
    { id: 'status', label: 'SLA Status' },
    { id: 'rules', label: 'Rules' },
    { id: 'escalations', label: 'Escalation Log' }
  ].filter(t => t.id !== 'rules' || canManageRules);

  let body = '';
  if (tab === 'status') {
    const [requests, customers] = await Promise.all([db.sla.listWithStatus(), db.customers.list()]);
    const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
    const open = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
    const order = { 'Breached': 0, 'At Risk': 1, 'On Track': 2 };
    open.sort((a, b) => (order[a.sla.status] ?? 9) - (order[b.sla.status] ?? 9));
    const breachedCount = open.filter(r => r.sla.status === 'Breached').length;
    const atRiskCount = open.filter(r => r.sla.status === 'At Risk').length;
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Open Requests</div><strong>${open.length}</strong></div>
        <div class="stat-card"><div class="lbl">Breached</div><strong style="color:var(--red);">${breachedCount}</strong></div>
        <div class="stat-card"><div class="lbl">At Risk</div><strong style="color:var(--amber);">${atRiskCount}</strong></div>
        <div class="stat-card"><div class="lbl">On Track</div><strong style="color:var(--green);">${open.length - breachedCount - atRiskCount}</strong></div>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Request No.</th><th>Type</th><th>Customer</th><th>Status</th><th>Due</th><th>SLA</th></tr></thead>
          <tbody>
            ${open.map(r => `
              <tr style="cursor:pointer" data-goto="/service/${r.id}">
                <td class="cell-mono cell-strong">${r.requestNumber}</td>
                <td><span class="role-badge">${r.type}</span></td>
                <td>${custMap[r.customerId] ? custMap[r.customerId].name : '—'}</td>
                <td>${statusPill2(r.status)}</td>
                <td class="cell-mono">${r.sla.dueDate}</td>
                <td>${slaPill(r.sla.status)}</td>
              </tr>`).join('') || `<tr><td colspan="6" class="table-empty">No open requests.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  } else if (tab === 'rules') {
    const rules = await db.sla.listRules();
    body = `
      <div class="panel">
        <div class="panel-head"><h3>Turnaround targets</h3></div>
        <p class="hint" style="margin-bottom:16px;">Maximum days from request creation to Closed before a job is flagged Breached.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Request Type</th><th>Max Days</th><th></th></tr></thead>
          <tbody>
            ${rules.map(r => `
              <tr>
                <td class="cell-strong">${r.type}</td>
                <td><input type="number" min="1" value="${r.maxDays}" data-rule-input="${r.type}" style="width:70px; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);"></td>
                <td><button class="btn btn-primary btn-sm" data-save-rule="${r.type}">Save</button></td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>`;
  } else if (tab === 'escalations') {
    const [escalations, serviceReqs] = await Promise.all([db.escalations.list(), db.service.list()]);
    const srMap = Object.fromEntries(serviceReqs.map(r => [r.id, r]));
    body = `
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Date</th><th>Request</th><th>Level</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${escalations.map(e => `
              <tr>
                <td class="cell-mono">${e.createdAt}</td>
                <td>${srMap[e.serviceRequestId] ? `<a href="#/service/${e.serviceRequestId}" class="cell-mono cell-strong">${srMap[e.serviceRequestId].requestNumber}</a>` : '—'}</td>
                <td>${pill(e.level, e.level === 'Breach' ? 'red' : 'amber')}</td>
                <td style="max-width:320px; font-size:12.5px; color:var(--text-soft);">${e.reason}</td>
                <td>${pill(e.status, e.status === 'Resolved' ? 'green' : (e.status === 'Acknowledged' ? 'blue' : 'gray'))}</td>
                <td>
                  ${e.status === 'Open' ? `<button class="btn btn-ghost btn-sm" data-ack="${e.id}">Acknowledge</button>` : ''}
                  ${e.status === 'Acknowledged' ? `<button class="btn btn-ghost btn-sm" data-resolve="${e.id}">Resolve</button>` : ''}
                </td>
              </tr>`).join('') || `<tr><td colspan="6" class="table-empty">No escalations logged.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  pageEl.innerHTML = `
    <div class="page-head"><div><h2>SLA &amp; Escalation</h2><p>Turnaround targets and overdue-job tracking across Service Hub.</p></div></div>
    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${tab === t.id ? 'active' : ''}" data-stab="${t.id}">${t.label}</button>`).join('')}</div>
    ${body}
  `;
  pageEl.querySelectorAll('[data-stab]').forEach(btn => btn.addEventListener('click', () => renderSlaTab(btn.dataset.stab)));
  pageEl.querySelectorAll('tr[data-goto]').forEach(tr => tr.addEventListener('click', () => location.hash = '#' + tr.dataset.goto));
  pageEl.querySelectorAll('[data-save-rule]').forEach(btn => btn.addEventListener('click', async () => {
    const type = btn.dataset.saveRule;
    const input = pageEl.querySelector(`[data-rule-input="${type}"]`);
    await db.sla.setRule(type, parseInt(input.value, 10) || 1);
    btn.textContent = 'Saved ✓';
    setTimeout(() => btn.textContent = 'Save', 1200);
  }));
  pageEl.querySelectorAll('[data-ack]').forEach(btn => btn.addEventListener('click', async () => {
    await db.escalations.setStatus(btn.dataset.ack, 'Acknowledged');
    renderSlaTab('escalations');
  }));
  pageEl.querySelectorAll('[data-resolve]').forEach(btn => btn.addEventListener('click', async () => {
    await db.escalations.setStatus(btn.dataset.resolve, 'Resolved');
    renderSlaTab('escalations');
  }));
}

// =======================================================================
// APPROVALS
// =======================================================================
route('/approvals', async () => {
  titleEl.textContent = 'Approvals';
  await renderApprovalsTab('queue');
});

async function renderApprovalsTab(tab) {
  const tabs = [
    { id: 'queue', label: 'Queue' },
    { id: 'history', label: 'History' },
    { id: 'rules', label: 'Rules' }
  ];

  let body = '';
  if (tab === 'queue') {
    const pending = await db.approvals.listPending();
    body = `
      <div class="stat-row">
        <div class="stat-card"><div class="lbl">Awaiting Decision</div><strong>${pending.length}</strong></div>
      </div>
      ${pending.length ? pending.map(a => `
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3 class="cell-mono">${a.approvalNumber}</h3>
              <p class="hint" style="margin-top:4px;">${a.entityType} · requested by ${a.requestedBy} on ${a.createdAt}</p>
            </div>
            ${a.entityType === 'New User Account' ? pill('New Account', 'blue') : `<strong style="font-family:'Archivo Expanded'; font-size:18px;">${money(a.amount)}</strong>`}
          </div>
          <p style="font-size:13.5px; color:var(--text-soft);">${a.description}</p>
          ${a.meta && a.meta.method ? `<p class="hint" style="margin-top:6px;">Method: ${a.meta.method}</p>` : ''}
          <form data-decide-form="${a.id}" style="margin-top:14px;">
            <div class="field"><label>Comment</label><textarea rows="2" data-decide-comment placeholder="Optional note for the record"></textarea></div>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-primary btn-sm" data-decide="${a.id}" data-decision="Approved">Approve</button>
              <button type="button" class="btn btn-danger btn-sm" data-decide="${a.id}" data-decision="Rejected">Reject</button>
            </div>
          </form>
        </div>
      `).join('') : `<div class="panel"><p class="hint">Nothing waiting on a decision.</p></div>`}
    `;
  } else if (tab === 'history') {
    const all = await db.approvals.list();
    const decided = all.filter(a => a.status !== 'Pending');
    body = `
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Approval No.</th><th>Type</th><th>Amount</th><th>Requested By</th><th>Decision</th><th>Decided By</th><th>Comment</th></tr></thead>
          <tbody>
            ${decided.map(a => `
              <tr>
                <td class="cell-mono cell-strong">${a.approvalNumber}</td>
                <td><span class="role-badge">${a.entityType}</span></td>
                <td class="cell-mono">${a.entityType === 'New User Account' ? '—' : money(a.amount)}</td>
                <td>${a.requestedBy}</td>
                <td>${pill(a.status, a.status === 'Approved' ? 'green' : 'red')}</td>
                <td>${a.decidedBy} <span class="hint">(${a.decidedAt})</span></td>
                <td style="max-width:240px; font-size:12.5px; color:var(--text-soft);">${a.comment || '—'}</td>
              </tr>`).join('') || `<tr><td colspan="7" class="table-empty">No decisions yet.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  } else if (tab === 'rules') {
    const rules = await db.approvals.listRules();
    body = `
      <div class="panel">
        <div class="panel-head"><h3>Approval thresholds</h3></div>
        <p class="hint" style="margin-bottom:16px;">Actions at or above the threshold are routed through this queue instead of executing immediately.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Action</th><th>Threshold (₹)</th><th>Active</th><th></th></tr></thead>
          <tbody>
            ${rules.map(r => `
              <tr>
                <td class="cell-strong">${r.entityType}</td>
                <td><input type="number" min="0" value="${r.thresholdAmount}" data-threshold-input="${r.entityType}" style="width:100px; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:13.5px; background:var(--surface); color:var(--text);"></td>
                <td><input type="checkbox" ${r.active ? 'checked' : ''} data-active-input="${r.entityType}" style="width:16px; height:16px;"></td>
                <td><button class="btn btn-primary btn-sm" data-save-approval-rule="${r.entityType}">Save</button></td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>`;
  }

  pageEl.innerHTML = `
    <div class="page-head"><div><h2>Approvals</h2><p>Sign-off queue for refunds and reimbursements above their configured threshold.</p></div></div>
    <div class="tabs">${tabs.map(t => `<button class="tab-btn2 ${tab === t.id ? 'active' : ''}" data-atab="${t.id}">${t.label}</button>`).join('')}</div>
    ${body}
  `;
  pageEl.querySelectorAll('[data-atab]').forEach(btn => btn.addEventListener('click', () => renderApprovalsTab(btn.dataset.atab)));
  pageEl.querySelectorAll('[data-decide]').forEach(btn => btn.addEventListener('click', async () => {
    const id = btn.dataset.decide;
    const decision = btn.dataset.decision;
    const form = pageEl.querySelector(`[data-decide-form="${id}"]`);
    const comment = form.querySelector('[data-decide-comment]').value.trim();
    await db.approvals.decide(id, decision, SESSION.name, comment);
    renderApprovalsTab('queue');
  }));
  pageEl.querySelectorAll('[data-save-approval-rule]').forEach(btn => btn.addEventListener('click', async () => {
    const type = btn.dataset.saveApprovalRule;
    const thresholdInput = pageEl.querySelector(`[data-threshold-input="${type}"]`);
    const activeInput = pageEl.querySelector(`[data-active-input="${type}"]`);
    await db.approvals.setRule(type, { thresholdAmount: parseFloat(thresholdInput.value) || 0, active: activeInput.checked });
    btn.textContent = 'Saved ✓';
    setTimeout(() => btn.textContent = 'Save', 1200);
  }));
}

// =======================================================================
// USERS & ROLES
// =======================================================================
route('/users', async () => {
  titleEl.textContent = 'Users & Roles';
  const users = await db.users.list();
  renderUsersList(users);
});

function renderUsersList(users) {
  pageEl.innerHTML = `
    <div class="page-head">
      <div><h2>Users &amp; Roles</h2><p>${users.length} users · Super Admin, Warehouse, Service Center, Technician, Dealer</p></div>
      <button class="btn btn-primary" id="btnAddUser">${ICONS.plus} Add User</button>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Added</th><th></th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td class="cell-strong">${u.name}</td>
              <td class="cell-mono">${u.email}</td>
              <td><span class="role-badge">${u.role}</span></td>
              <td>${statusPill(u.status)}</td>
              <td class="cell-mono">${fmtDate(u.createdAt)}</td>
              <td><button class="btn btn-ghost btn-sm" data-toggle="${u.id}">${u.status === 'Active' ? 'Deactivate' : 'Activate'}</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  pageEl.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const u = users.find(x => x.id === btn.dataset.toggle);
      await db.users.setStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active');
      const fresh = await db.users.list();
      renderUsersList(fresh);
    });
  });
  document.getElementById('btnAddUser').addEventListener('click', () => {
    openModal(`
      <div class="modal-head"><h3>Add User</h3><button class="modal-close" id="mClose">✕</button></div>
      <form id="userForm" novalidate>
        <div class="field" data-field="name"><label>Name <span class="req">*</span></label><input id="uf_name" required><div class="error">Required.</div></div>
        <div class="field" data-field="email"><label>Email <span class="req">*</span></label><input id="uf_email" type="email" required><div class="error">Required.</div></div>
        <div class="field"><label>Role</label>
          <select id="uf_role">
            <option>Super Admin</option><option>Warehouse</option><option>Service Center</option><option>Technician</option><option>Dealer</option>
          </select>
        </div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="mCancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add User</button>
        </div>
      </form>
    `);
    document.getElementById('mClose').addEventListener('click', closeModal);
    document.getElementById('mCancel').addEventListener('click', closeModal);
    document.getElementById('userForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateModalForm(e.target)) return;
      await db.users.add({
        name: document.getElementById('uf_name').value.trim(),
        email: document.getElementById('uf_email').value.trim(),
        role: document.getElementById('uf_role').value
      });
      closeModal();
      render();
    });
  });
}

// =======================================================================
// INIT
// =======================================================================
document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar(); // safe before db.ready — reads only SESSION and static nav config, no db calls

  // Theme: default to system preference
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  document.getElementById('themeToggle').addEventListener('click', () => {
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // Mobile sidebar toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('signOutLink').addEventListener('click', async (e) => {
    e.preventDefault();
    await db.ready;
    await db.auth.signOut();
    location.href = 'login.html';
  });

  // Everything below touches db — wait for bootstrap (resolves once Firebase
  // confirms whether there's a session, and if so, hydrates `_mock`).
  await db.ready;

  // The only source of truth for who's signed in — never anything from the
  // URL. If there's no real Firebase session, there's nothing to show.
  const liveUser = await db.auth.onReady();
  if (liveUser) {
    SESSION.uid = liveUser.id; SESSION.name = liveUser.name; SESSION.email = liveUser.email; SESSION.role = liveUser.role;
    renderSidebar(); // re-render now that SESSION reflects the verified profile
  } else {
    location.href = 'login.html';
    return;
  }

  db.categories.list().then(cats => { CATEGORY_NAME_CACHE = Object.fromEntries(cats.map(c => [c.id, c.name])); });
  render();
});
