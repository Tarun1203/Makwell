/* =======================================================================
   MAKWELL CRM — Data Access Layer (live Firestore, no mock mode)
   -----------------------------------------------------------------------
   Every db.X.method() below returns a Promise. `_mock` is kept as a fast
   local cache — most screens read it synchronously-feeling through these
   async wrappers — but it is a CACHE, not the source of truth: every
   mutation writes straight through to Firestore via _persistSet(), and
   on load, _bootstrap() hydrates `_mock` from whatever's actually in
   Firestore (or, on a genuinely fresh project, seeds Firestore with this
   file's starting configuration — see SEEDED ON FIRST RUN below).

   AUTHENTICATION: there's no auto-create-on-failed-sign-in fallback.
   db.auth.signIn(email, password) only succeeds against a real, already-
   existing account. Creating a new account is a separate, deliberate
   action — db.auth.createAccount(email, password, role, name) — used
   for initial setup and for onboarding staff by hand. See login.html
   for how that's surfaced, and the note there about not leaving it
   open to the public once your real staff are set up.

   SEEDED ON FIRST RUN (structural configuration, not sample records):
   the default product categories, warranty rules, SLA turnaround
   targets, approval thresholds, and notification templates. Everything
   else — users, customers, products, service requests, and so on —
   starts genuinely empty. Add your own through each screen's UI.

   ============================ GOING LIVE ================================
   1. Create a Firebase project → enable Authentication (Email/Password)
      and Firestore Database (production mode).
   2. Project settings → your web app's config → paste it into
      FIREBASE_CONFIG below.
   3. Deploy the starter security rules in firestore.rules (see that
      file's own comments — it's a reasonable starting point, not a
      hardened ruleset for every role/collection).
   4. Open login.html and use "Create an account" to make your first
      Super Admin — pick that role explicitly in the form. Each other
      staff member who needs to sign in does the same for themselves,
      choosing their own role. (Users & Roles inside the CRM adds a
      database record for someone — useful for e.g. linking a Service
      Center profile — but doesn't create sign-in credentials; only
      "Create an account" on the login page does that.)
   5. That first sign-in also seeds your empty Firestore project with
      the default categories, warranty rules, etc. described above.

   A DELIBERATE LIMIT: every collection is read in full into `_mock` on
   load (no server-side filtering/pagination), which is what keeps every
   screen's existing synchronous-feeling logic (SLA math, dashboard
   totals, dedup checks) working unchanged. Fine for the record counts a
   small operation produces; if any collection grows into the thousands,
   that collection's list()/bootstrap should move to paginated or
   `where()`-filtered Firestore queries instead of a full read.
   ======================================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut as fbSignOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCRqUdrKe2U2wF_4LI-6Yl7zdgmE5YhvQY",
  authDomain: "makwell-websiteandcrm.firebaseapp.com",
  projectId: "makwell-websiteandcrm",
  storageBucket: "makwell-websiteandcrm.firebasestorage.app",
  messagingSenderId: "673518655103",
  appId: "1:673518655103:web:1805d10de3c63eca23914a"
};

const _fbApp = initializeApp(FIREBASE_CONFIG);
const fsAuth = getAuth(_fbApp);
const fsDb = getFirestore(_fbApp);

// Every collection name this app uses — bootstrap iterates this list to
// seed or load each one. Keep in sync with the keys of `_mock` below.
const _COLLECTIONS = [
  'users', 'categories', 'warrantyRules', 'products', 'serials', 'customers',
  'serviceCenters', 'technicians', 'serviceRequests', 'spareParts', 'stockLevels',
  'stockMovements', 'spareRequests', 'estimates', 'invoices', 'payments',
  'localPurchases', 'rma', 'templates', 'messages', 'websiteLeads',
  'slaRules', 'escalations', 'approvalRules', 'approvals'
];

// ---- Generic persistence: every mutation writes straight through -----------
async function _persistSet(collectionName, id, data) {
  if (!id) return;
  try { await setDoc(doc(fsDb, collectionName, String(id)), data); }
  catch (err) { console.error(`[Firestore] write failed on ${collectionName}/${id}`, err); }
}

// -----------------------------------------------------------------------
// Local cache, hydrated from Firestore on load (see _bootstrap below).
// Only the entries under SEEDED ON FIRST RUN in the top comment are
// pre-populated here — everything else starts empty on purpose.
// -----------------------------------------------------------------------
const _mock = {
  // ---- Empty on purpose: real accounts, customers and business records
  // belong here, not sample data. Create your first account via
  // login.html's "Create an account" flow. ------------------------------
  users: [],

  // ---- Structural configuration: sensible starting defaults, fully
  // editable (or deletable) from the CRM once you're signed in. ---------
  categories: [
    { id: 'c-tv', name: 'Television', status: 'Active', createdAt: '2026-01-01',
      attributes: [
        { key: 'screenSize', label: 'Screen Size', type: 'select', options: ['32"', '43"', '50"', '55"', '65"'] },
        { key: 'resolution', label: 'Resolution', type: 'select', options: ['HD Ready', 'Full HD', '4K'] }
      ] },
    { id: 'c-wm', name: 'Washing Machine', status: 'Active', createdAt: '2026-01-01',
      attributes: [
        { key: 'capacity', label: 'Capacity (kg)', type: 'number' },
        { key: 'type', label: 'Type', type: 'select', options: ['Semi-Automatic', 'Fully Automatic'] }
      ] },
    { id: 'c-ib', name: 'Iron Box', status: 'Active', createdAt: '2026-01-01',
      attributes: [
        { key: 'wattage', label: 'Wattage (W)', type: 'number' },
        { key: 'type', label: 'Type', type: 'select', options: ['Dry', 'Steam'] }
      ] },
    { id: 'c-ss', name: 'Sound System', status: 'Active', createdAt: '2026-01-01',
      attributes: [
        { key: 'power', label: 'Power Output (W)', type: 'number' },
        { key: 'connectivity', label: 'Connectivity', type: 'text' }
      ] },
    { id: 'c-stb', name: 'Stabilizer', status: 'Active', createdAt: '2026-01-01',
      attributes: [
        { key: 'capacity', label: 'Capacity (kVA)', type: 'number' },
        { key: 'inputRange', label: 'Input Voltage Range', type: 'text' }
      ] }
  ],

  warrantyRules: [
    { categoryId: 'c-tv', components: [{ name: 'Full Product', years: 1 }] },
    { categoryId: 'c-wm', components: [{ name: 'Full Product', years: 1 }, { name: 'Spin Motor', years: 2 }, { name: 'Wash Motor', years: 5 }] },
    { categoryId: 'c-ib', components: [{ name: 'Full Product', years: 2 }] },
    { categoryId: 'c-ss', components: [{ name: 'Full Product', years: 1 }] },
    { categoryId: 'c-stb', components: [{ name: 'Full Product', years: 5 }] }
  ],

  // ---- Empty on purpose: add your real product catalog, serials,
  // customers, and every operational record through the CRM's own UI. ---
  products: [],
  serials: [],
  customers: [],
  serviceCenters: [],
  technicians: [],
  serviceRequests: [],
  spareParts: [],
  stockLevels: [],
  stockMovements: [],
  spareRequests: [],
  estimates: [],
  invoices: [],
  payments: [],
  localPurchases: [],
  rma: [],

  // ---- Structural configuration: default notification copy, editable
  // or replaceable from Templates once you're signed in. -----------------
  templates: [
    { id: 'tpl1', name: 'Service Request Received', event: 'Service Request Created', channel: 'SMS', body: 'Hi {{customerName}}, your service request {{requestNumber}} has been received. We\'ll update you shortly. - MakWell', status: 'Active' },
    { id: 'tpl2', name: 'Service Status Update', event: 'Service Status Updated', channel: 'WhatsApp', body: 'Hi {{customerName}}, your request {{requestNumber}} is now: {{status}}. - MakWell', status: 'Active' },
    { id: 'tpl3', name: 'Invoice Generated', event: 'Invoice Generated', channel: 'SMS', body: 'Hi {{customerName}}, invoice {{invoiceNumber}} for {{amount}} has been generated. - MakWell', status: 'Active' },
    { id: 'tpl4', name: 'Payment Received', event: 'Payment Received', channel: 'WhatsApp', body: 'Hi {{customerName}}, we\'ve received your payment of {{amount}} for {{invoiceNumber}}. Thank you! - MakWell', status: 'Active' },
    { id: 'tpl5', name: 'RMA Resolved', event: 'RMA Resolved', channel: 'SMS', body: 'Hi {{customerName}}, your RMA {{rmaNumber}} has been resolved: {{resolutionType}}. - MakWell', status: 'Active' },
    { id: 'tpl6', name: 'Service Request Received (Email)', event: 'Service Request Created', channel: 'Email', body: 'Dear {{customerName}}, thank you for reaching out. Your service request {{requestNumber}} has been logged and will be actioned shortly.', status: 'Inactive' }
  ],

  messages: [],
  websiteLeads: [],

  slaRules: [
    { type: 'Service', maxDays: 3 },
    { type: 'Installation', maxDays: 2 },
    { type: 'Warranty', maxDays: 5 },
    { type: 'Out-of-Warranty', maxDays: 5 }
  ],

  escalations: [],

  approvalRules: [
    { entityType: 'RMA Refund', thresholdAmount: 2000, active: true },
    { entityType: 'Local Purchase', thresholdAmount: 500, active: true },
    { entityType: 'New User Account', thresholdAmount: 0, active: true } // threshold 0 + amount 0 → always requires approval, reusing the same mechanism
  ],

  approvals: []
};


// ---- Bootstrap: seed Firestore on first run, or load real data every run after ----
// Exposed as db.ready — crm-app.js and the website's app.js both await this
// before rendering anything, so the UI never flashes stale/default data.
let _resolveReady;
const _readyPromise = new Promise(res => { _resolveReady = res; });
async function _bootstrap() {
  try {
    // A collection being empty is ambiguous on its own — it could mean
    // "never seeded" (fresh project) or "someone deliberately cleared it."
    // A single marker doc disambiguates: seed everything exactly once,
    // ever, and after that trust Firestore's emptiness as intentional.
    const markerRef = doc(fsDb, '_meta', 'bootstrap');
    const markerSnap = await getDoc(markerRef);

    if (!markerSnap.exists()) {
      // First run ever on this project: push every collection's default
      // data up as the seed, then record that seeding has happened.
      for (const name of _COLLECTIONS) {
        const defaults = _mock[name] || [];
        for (const rec of defaults) {
          if (rec && rec.id) await setDoc(doc(fsDb, name, String(rec.id)), rec);
        }
        // _mock[name] already holds the defaults — nothing further to do.
      }
      await setDoc(markerRef, { seeded: true, seededAt: new Date().toISOString() });
    } else {
      // Already seeded at some point (possibly since cleared out on purpose)
      // — load whatever's actually in Firestore now, empty or not.
      for (const name of _COLLECTIONS) {
        const snap = await getDocs(collection(fsDb, name));
        _mock[name] = snap.docs.map(d => d.data());
      }
    }
  } catch (err) {
    console.error('[Firestore] bootstrap failed — falling back to in-memory defaults for this session', err);
  }
  _resolveReady();
}

// The security rules require request.auth != null for every single read,
// including the very first one — so bootstrap can't just fire at module
// load. Instead, wait for Firebase to confirm whether there's a session at
// all: if there's a signed-in user (a fresh sign-in that just redirected
// here, or a persisted session from an earlier visit), hydrate `_mock`
// from Firestore. If not — e.g. sitting on the login page with nobody
// signed in yet — skip hydration entirely rather than attempting reads
// that are correctly going to be rejected.
let _unsubBootstrap = () => {}; // pre-declared no-op, in case the callback below fires synchronously before the real unsubscribe function is assigned
_unsubBootstrap = onAuthStateChanged(fsAuth, (user) => {
  _unsubBootstrap();
  if (user) _bootstrap();
  else _resolveReady();
});

const SERVICE_STATUS_STEPS = ['Request Received', 'Assigned', 'Scheduled', 'Technician Visit', 'Spare Required', 'Repair', 'Completed', 'Closed'];
const SERVICE_TYPE_CODES = { 'Service': 'SR', 'Installation': 'IN', 'Warranty': 'WR', 'Out-of-Warranty': 'OW' };
const SPARE_REQUEST_STEPS = ['Requested', 'Approved', 'Dispatched', 'Received'];
const GST_RATE = 0.18; // 18% GST on repair services/parts
const RMA_STATUS_STEPS = ['Requested', 'Approved', 'Product Received', 'Inspected', 'Resolved', 'Closed'];
const RESOLUTION_TYPES = ['Replacement', 'Refund', 'Repair Escalation'];
const SLA_AT_RISK_THRESHOLD = 0.7; // fraction of maxDays elapsed before flagging "At Risk"
const KARNATAKA_DISTRICTS = [
  'Bengaluru Urban', 'Bengaluru North', 'Bengaluru South', 'Chikkaballapur', 'Chitradurga', 'Davanagere', 'Kolar', 'Shivamogga', 'Tumakuru',
  'Mysuru', 'Mandya', 'Hassan', 'Kodagu', 'Chamarajanagar', 'Chikkamagaluru', 'Dakshina Kannada', 'Udupi',
  'Belagavi', 'Bagalkot', 'Vijayapura', 'Dharwad', 'Gadag', 'Haveri', 'Uttara Kannada',
  'Kalaburagi', 'Bidar', 'Raichur', 'Koppal', 'Yadgir', 'Ballari', 'Vijayanagara'
];

let _seq = 100; // mock id counter
const _id = (prefix) => `${prefix}${_seq++}`;
const _delay = (v) => new Promise((res) => setTimeout(() => res(v), 120)); // simulate network latency

// -----------------------------------------------------------------------
// Public data access API
// -----------------------------------------------------------------------
const db = {

  // Resolves once _mock is either seeded or loaded with real Firestore data.
  ready: _readyPromise,

  // ---- Auth --------------------------------------------------------------
  auth: {
    _profileFor(uid, email, snap, fallbackRole) {
      if (snap.exists()) return { id: uid, ...snap.data() };
      return { id: uid, name: email.split('@')[0], email, role: fallbackRole || 'Dealer', status: 'Active' };
    },

    // Sign in with an existing account only. Throws (doesn't silently
    // create anything) if the credentials don't match a real account —
    // use createAccount() below for actually provisioning a new one.
    // Also blocks anyone whose account isn't Active yet — e.g. still
    // waiting on the approval this same createAccount() call requested.
    async signIn(email, password) {
      const cred = await signInWithEmailAndPassword(fsAuth, email, password);
      const ref = doc(fsDb, 'users', cred.user.uid);
      const snap = await getDoc(ref);
      const profile = db.auth._profileFor(cred.user.uid, email, snap);
      if (profile.status !== 'Active') {
        await fbSignOut(fsAuth); // don't leave them signed in but blocked — force a clean retry later
        const err = new Error(profile.status === 'Pending Approval'
          ? 'Your account is waiting on approval from a Super Admin.'
          : 'Your account is not active. Contact your Super Admin.');
        err.code = profile.status === 'Pending Approval' ? 'app/pending-approval' : 'app/account-inactive';
        throw err;
      }
      return profile;
    },

    // Explicit, deliberate account creation — never triggered automatically
    // by a failed sign-in. The very first account ever created on a fresh
    // project auto-activates as Super Admin (nobody exists yet to approve
    // it). Every account after that goes to Pending Approval and shows up
    // in Approvals → Queue for a Super Admin to decide on — see
    // db.approvals.decide()'s "New User Account" branch below.
    async createAccount(email, password, role, name) {
      const cred = await createUserWithEmailAndPassword(fsAuth, email, password);

      // Check Firestore directly, not the local `_mock` cache — bootstrap
      // only hydrates that cache once someone's already authenticated, and
      // this is the exact moment that becomes true for a first-time signup,
      // so the cache can't be trusted yet to say whether anyone exists.
      const existingUsersSnap = await getDocs(collection(fsDb, 'users'));
      const isFirstEver = existingUsersSnap.empty;
      const needsApproval = !isFirstEver && db.approvals.requiresApproval('New User Account', 0);

      const profile = {
        name: name || email.split('@')[0], email,
        role: isFirstEver ? 'Super Admin' : (role || 'Dealer'),
        status: needsApproval ? 'Pending Approval' : 'Active',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      await setDoc(doc(fsDb, 'users', cred.user.uid), profile);
      _mock.users.push({ id: cred.user.uid, ...profile });

      if (needsApproval) {
        await db.approvals.request({
          entityType: 'New User Account', entityId: cred.user.uid, amount: 0,
          description: `${profile.name} (${email}) requesting ${profile.role} access`,
          requestedBy: profile.name
        });
        await fbSignOut(fsAuth); // they have a real Auth credential now, but no working session until approved
      }
      return { id: cred.user.uid, ...profile };
    },

    async signOut() {
      await fbSignOut(fsAuth);
    },

    // Resolves with the current Firebase user's CRM profile, or null if
    // signed out (or not yet Active — same effect from the app's point of
    // view). This is the single source of truth for who's signed in —
    // crm.html never trusts anything else.
    onReady() {
      return new Promise((resolve) => {
        onAuthStateChanged(fsAuth, async (user) => {
          if (!user) { resolve(null); return; }
          const snap = await getDoc(doc(fsDb, 'users', user.uid));
          const profile = db.auth._profileFor(user.uid, user.email, snap);
          resolve(profile.status === 'Active' ? profile : null);
        });
      });
    }
  },

  // ---- Users & Roles --------------------------------------------------
  users: {
    async list() { return _delay([..._mock.users]); },
    async add(user) {
      const rec = { id: _id('u'), status: 'Active', createdAt: new Date().toISOString().slice(0, 10), ...user };
      _mock.users.push(rec);
      await _persistSet('users', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const u = _mock.users.find(x => x.id === id);
      if (u) { u.status = status; await _persistSet('users', u.id, u); }
      return _delay(u);
    }
  },

  // ---- Product Categories ---------------------------------------------
  categories: {
    async list() { return _delay([..._mock.categories]); },
    async add(name) {
      const rec = { id: _id('c-'), name, status: 'Active', createdAt: new Date().toISOString().slice(0, 10), attributes: [] };
      _mock.categories.push(rec);
      const ruleRec = { categoryId: rec.id, components: [{ name: 'Full Product', years: 1 }] };
      _mock.warrantyRules.push(ruleRec);
      await Promise.all([
        _persistSet('categories', rec.id, rec),
        _persistSet('warrantyRules', ruleRec.categoryId, ruleRec)
      ]);
      return _delay(rec);
    },
    async get(id) { return _delay(_mock.categories.find(c => c.id === id) || null); },
    async setStatus(id, status) {
      const c = _mock.categories.find(x => x.id === id);
      if (c) { c.status = status; await _persistSet('categories', c.id, c); }
      return _delay(c);
    }
  },

  // ---- Products & Models -----------------------------------------------
  products: {
    async list() { return _delay([..._mock.products]); },
    async listByCategory(categoryId) { return _delay(_mock.products.filter(p => p.categoryId === categoryId)); },
    async add(product) {
      const rec = { id: _id('p'), status: 'Active', attrs: {}, ...product };
      _mock.products.push(rec);
      await _persistSet('products', rec.id, rec);
      return _delay(rec);
    }
  },

  // ---- Serial / Batch ---------------------------------------------------
  serials: {
    async list() { return _delay([..._mock.serials]); },
    async get(id) { return _delay(_mock.serials.find(s => s.id === id) || null); },
    async listByProduct(productId) { return _delay(_mock.serials.filter(s => s.productId === productId)); },
    async listAvailable(productId) { return _delay(_mock.serials.filter(s => s.productId === productId && s.status === 'In Stock')); },
    async add(serial) {
      const rec = { id: _id('s'), status: 'In Stock', dealer: '', createdAt: new Date().toISOString().slice(0, 10), ...serial };
      _mock.serials.push(rec);
      await _persistSet('serials', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const s = _mock.serials.find(x => x.id === id);
      if (s) { s.status = status; await _persistSet('serials', s.id, s); }
      return _delay(s);
    },
    async findBySerial(value) { return _delay(_mock.serials.find(s => s.serial.toLowerCase() === value.toLowerCase()) || null); }
  },

  // ---- Warranty rules ----------------------------------------------------
  warranty: {
    async getRule(categoryId) { return _delay(_mock.warrantyRules.find(r => r.categoryId === categoryId) || null); },
    async listRules() { return _delay([..._mock.warrantyRules]); },
    async setRule(categoryId, components) {
      let r = _mock.warrantyRules.find(x => x.categoryId === categoryId);
      if (r) r.components = components;
      else { r = { categoryId, components }; _mock.warrantyRules.push(r); }
      await _persistSet('warrantyRules', categoryId, r);
      return _delay(r);
    }
  },

  // ---- Customers -----------------------------------------------------
  customers: {
    async list() { return _delay([..._mock.customers]); },
    async get(id) { return _delay(_mock.customers.find(c => c.id === id) || null); },
    async findByPhone(phone) { return _delay(_mock.customers.filter(c => c.phone === phone)); },
    async add(customer) {
      const rec = { id: _id('cu'), status: 'Active', createdAt: new Date().toISOString().slice(0, 10), ...customer };
      _mock.customers.push(rec);
      await _persistSet('customers', rec.id, rec);
      return _delay(rec);
    }
  },

  // ---- Service Centers ---------------------------------------------------
  serviceCenters: {
    async list() { return _delay([..._mock.serviceCenters]); },
    async get(id) { return _delay(_mock.serviceCenters.find(s => s.id === id) || null); },
    async listByDistrict(district) { return _delay(_mock.serviceCenters.filter(s => s.district === district && s.status === 'Active')); },
    async byUser(userId) { return _delay(_mock.serviceCenters.find(s => s.userId === userId) || null); },
    async add(center) {
      const rec = { id: _id('sc'), status: 'Active', ...center };
      _mock.serviceCenters.push(rec);
      await _persistSet('serviceCenters', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const s = _mock.serviceCenters.find(x => x.id === id);
      if (s) { s.status = status; await _persistSet('serviceCenters', s.id, s); }
      return _delay(s);
    }
  },

  // ---- Technicians -----------------------------------------------------
  technicians: {
    async list() { return _delay([..._mock.technicians]); },
    async listByCenter(centerId) { return _delay(_mock.technicians.filter(t => t.centerId === centerId && t.status === 'Active')); },
    async byUser(userId) { return _delay(_mock.technicians.find(t => t.userId === userId) || null); },
    async add(tech) {
      const rec = { id: _id('t'), status: 'Active', ...tech };
      _mock.technicians.push(rec);
      await _persistSet('technicians', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const t = _mock.technicians.find(x => x.id === id);
      if (t) { t.status = status; await _persistSet('technicians', t.id, t); }
      return _delay(t);
    }
  },

  // ---- Service Requests (Service Hub, Scheduling, Visits, Diagnosis, Installation) ----
  service: {
    async list() { return _delay([..._mock.serviceRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.serviceRequests.find(r => r.id === id) || null); },
    async listByCenter(centerId) { return _delay(_mock.serviceRequests.filter(r => r.centerId === centerId)); },
    async listByTechnician(technicianId) { return _delay(_mock.serviceRequests.filter(r => r.technicianId === technicianId)); },

    async add(request) {
      const type = request.type || 'Service';
      const code = SERVICE_TYPE_CODES[type] || 'SR';
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.serviceRequests.filter(r => r.requestNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const requestNumber = `PE-KA-${code}-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`;
      const rec = {
        id: _id('sr'), requestNumber, type,
        centerId: '', technicianId: '', status: 'Request Received',
        scheduledDate: '', scheduledSlot: '',
        diagnosis: { notes: '', spareParts: '', estimatedCost: '' },
        installation: { isInstallation: type === 'Installation', installDate: '', notes: '' },
        internalNotes: [],
        createdAt: today.toISOString().slice(0, 10), updatedAt: today.toISOString().slice(0, 10),
        ...request
      };
      _mock.serviceRequests.push(rec);
      await _persistSet('serviceRequests', rec.id, rec);
      db._notify('Service Request Created', rec.customerId, { requestNumber: rec.requestNumber }, 'Service', rec.id);
      return _delay(rec);
    },

    async assign(id, { centerId, technicianId }) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      r.centerId = centerId; r.technicianId = technicianId || '';
      if (r.status === 'Request Received') r.status = 'Assigned';
      r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('serviceRequests', r.id, r);
      return _delay(r);
    },

    async schedule(id, { date, slot }) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      r.scheduledDate = date; r.scheduledSlot = slot;
      if (SERVICE_STATUS_STEPS.indexOf(r.status) < SERVICE_STATUS_STEPS.indexOf('Scheduled')) r.status = 'Scheduled';
      r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('serviceRequests', r.id, r);
      return _delay(r);
    },

    async setStatus(id, status) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) {
        r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10);
        await _persistSet('serviceRequests', r.id, r);
        db._notify('Service Status Updated', r.customerId, { requestNumber: r.requestNumber, status }, 'Service', r.id);
      }
      return _delay(r);
    },

    async setDiagnosis(id, diagnosis) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) { r.diagnosis = { ...r.diagnosis, ...diagnosis }; r.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('serviceRequests', r.id, r); }
      return _delay(r);
    },

    async setInstallation(id, installation) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) { r.installation = { ...r.installation, ...installation }; r.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('serviceRequests', r.id, r); }
      return _delay(r);
    },

    async addNote(id, text, by) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) { r.internalNotes.push({ text, by, at: new Date().toISOString().slice(0, 10) }); await _persistSet('serviceRequests', r.id, r); }
      return _delay(r);
    }
  },

  // ---- Spare Parts master ------------------------------------------------
  spareParts: {
    async list() { return _delay([..._mock.spareParts]); },
    async get(id) { return _delay(_mock.spareParts.find(p => p.id === id) || null); },
    async add(part) {
      const rec = { id: _id('sp'), status: 'Active', ...part };
      _mock.spareParts.push(rec);
      await _persistSet('spareParts', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const p = _mock.spareParts.find(x => x.id === id);
      if (p) { p.status = status; await _persistSet('spareParts', p.id, p); }
      return _delay(p);
    }
  },

  // ---- Stock levels & movements ------------------------------------------
  stock: {
    async allLevels() { return _delay([..._mock.stockLevels]); },
    async levelsByLocation(locationKey) { return _delay(_mock.stockLevels.filter(s => s.locationKey === locationKey)); },
    async getQuantity(locationKey, partId) {
      const row = _mock.stockLevels.find(s => s.locationKey === locationKey && s.partId === partId);
      return _delay(row ? row.quantity : 0);
    },
    async _adjust(locationKey, partId, delta) {
      let row = _mock.stockLevels.find(s => s.locationKey === locationKey && s.partId === partId);
      if (!row) { row = { locationKey, partId, quantity: 0 }; _mock.stockLevels.push(row); }
      row.quantity += delta;
      if (row.quantity < 0) row.quantity = 0;
      await _persistSet('stockLevels', `${locationKey}__${partId}`, row); // composite key, not stored on the record itself
      return row;
    },
    async receive({ toKey, partId, quantity, notes, by }) {
      await db.stock._adjust(toKey, partId, quantity);
      const rec = { id: _id('sm'), partId, fromKey: '', toKey, quantity, type: 'Receipt', reference: '', notes: notes || '', by: by || '', createdAt: new Date().toISOString().slice(0, 10) };
      _mock.stockMovements.push(rec);
      await _persistSet('stockMovements', rec.id, rec);
      return _delay(rec);
    },
    async transfer({ fromKey, toKey, partId, quantity, notes, by, type, reference }) {
      const available = _mock.stockLevels.find(s => s.locationKey === fromKey && s.partId === partId);
      if (!available || available.quantity < quantity) return _delay({ error: 'Insufficient stock at source location.' });
      await db.stock._adjust(fromKey, partId, -quantity);
      await db.stock._adjust(toKey, partId, quantity);
      const rec = { id: _id('sm'), partId, fromKey, toKey, quantity, type: type || 'Transfer', reference: reference || '', notes: notes || '', by: by || '', createdAt: new Date().toISOString().slice(0, 10) };
      _mock.stockMovements.push(rec);
      await _persistSet('stockMovements', rec.id, rec);
      return _delay(rec);
    }
  },

  stockMovements: {
    async list() { return _delay([..._mock.stockMovements].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); }
  },

  // ---- Spare Request pipeline (Technician/Service Center -> Warehouse) ----
  spareRequests: {
    async list() { return _delay([..._mock.spareRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.spareRequests.find(r => r.id === id) || null); },
    async listByRequester(type, id) { return _delay(_mock.spareRequests.filter(r => r.requestedByType === type && r.requestedById === id)); },
    async add(req) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.spareRequests.filter(r => r.requestNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const requestNumber = `PE-KA-SPR-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`;
      const rec = { id: _id('req'), requestNumber, status: 'Requested', createdAt: today.toISOString().slice(0, 10), updatedAt: today.toISOString().slice(0, 10), ...req };
      _mock.spareRequests.push(rec);
      await _persistSet('spareRequests', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const r = _mock.spareRequests.find(x => x.id === id);
      if (r) { r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('spareRequests', r.id, r); }
      return _delay(r);
    },
    async dispatch(id, by) {
      const r = _mock.spareRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      const toKey = r.requestedByType === 'Technician' ? `t:${r.requestedById}` : `sc:${r.requestedById}`;
      const result = await db.stock.transfer({ fromKey: 'warehouse', toKey, partId: r.partId, quantity: r.quantity, notes: `Spare request ${r.requestNumber}`, by, type: 'Dispatch', reference: r.requestNumber });
      if (result && result.error) return _delay(result);
      r.status = 'Dispatched'; r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('spareRequests', r.id, r);
      return _delay(r);
    }
  },

  // ---- Finance: helpers ---------------------------------------------------
  _calcTotals(items, laborCharge) {
    const itemsTotal = items.reduce((sum, i) => sum + (i.qty * i.unitCost), 0);
    const subtotal = itemsTotal + (laborCharge || 0);
    const tax = Math.round(subtotal * GST_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    return { subtotal, tax, total };
  },

  // ---- Estimates -----------------------------------------------------------
  estimates: {
    async list() { return _delay([..._mock.estimates].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.estimates.find(e => e.id === id) || null); },
    async listByServiceRequest(srId) { return _delay(_mock.estimates.filter(e => e.serviceRequestId === srId)); },
    async add({ serviceRequestId, customerId, items, laborCharge }) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.estimates.filter(e => e.estimateNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const rec = {
        id: _id('est'), estimateNumber: `PE-KA-EST-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`,
        serviceRequestId: serviceRequestId || '', customerId, items, laborCharge: laborCharge || 0,
        status: 'Draft', createdAt: today.toISOString().slice(0, 10), updatedAt: today.toISOString().slice(0, 10)
      };
      _mock.estimates.push(rec);
      await _persistSet('estimates', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const e = _mock.estimates.find(x => x.id === id);
      if (e) { e.status = status; e.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('estimates', e.id, e); }
      return _delay(e);
    }
  },

  // ---- Invoices -----------------------------------------------------------
  invoices: {
    async list() { return _delay([..._mock.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.invoices.find(i => i.id === id) || null); },
    async listByServiceRequest(srId) { return _delay(_mock.invoices.filter(i => i.serviceRequestId === srId)); },
    async add({ serviceRequestId, estimateId, customerId, items, laborCharge }) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.invoices.filter(i => i.invoiceNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const rec = {
        id: _id('inv'), invoiceNumber: `PE-KA-INV-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`,
        serviceRequestId: serviceRequestId || '', estimateId: estimateId || '', customerId, items, laborCharge: laborCharge || 0,
        amountPaid: 0, status: 'Unpaid', createdAt: today.toISOString().slice(0, 10)
      };
      _mock.invoices.push(rec);
      await _persistSet('invoices', rec.id, rec);
      const totals = db._calcTotals(rec.items, rec.laborCharge);
      db._notify('Invoice Generated', rec.customerId, { invoiceNumber: rec.invoiceNumber, amount: `₹${totals.total.toFixed(2)}` }, 'Invoice', rec.id);
      return _delay(rec);
    },
    async fromEstimate(estimateId) {
      const est = _mock.estimates.find(e => e.id === estimateId);
      if (!est) return _delay(null);
      const inv = await db.invoices.add({ serviceRequestId: est.serviceRequestId, estimateId: est.id, customerId: est.customerId, items: est.items, laborCharge: est.laborCharge });
      return _delay(inv);
    }
  },

  // ---- Payments -----------------------------------------------------------
  payments: {
    async listByInvoice(invoiceId) { return _delay(_mock.payments.filter(p => p.invoiceId === invoiceId)); },
    async add({ invoiceId, amount, method, reference, receivedBy }) {
      const rec = { id: _id('pay'), invoiceId, amount, method, reference: reference || '', receivedBy, createdAt: new Date().toISOString().slice(0, 10) };
      _mock.payments.push(rec);
      await _persistSet('payments', rec.id, rec);
      const inv = _mock.invoices.find(i => i.id === invoiceId);
      if (inv) {
        inv.amountPaid = Math.round((inv.amountPaid + amount) * 100) / 100;
        const { total } = db._calcTotals(inv.items, inv.laborCharge);
        inv.status = inv.amountPaid >= total ? 'Paid' : (inv.amountPaid > 0 ? 'Partially Paid' : 'Unpaid');
        await _persistSet('invoices', inv.id, inv);
        db._notify('Payment Received', inv.customerId, { invoiceNumber: inv.invoiceNumber, amount: `₹${amount.toFixed(2)}` }, 'Invoice', inv.id);
      }
      return _delay(rec);
    }
  },

  // ---- Local Purchase (field reimbursements) -------------------------------
  localPurchases: {
    async list() { return _delay([..._mock.localPurchases].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async listByRequester(type, id) { return _delay(_mock.localPurchases.filter(l => l.purchasedByType === type && l.purchasedById === id)); },
    async add({ serviceRequestId, purchasedByType, purchasedById, partDescription, amount, reason }) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.localPurchases.filter(l => l.requestNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const rec = {
        id: _id('lp'), requestNumber: `PE-KA-LP-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`,
        serviceRequestId: serviceRequestId || '', purchasedByType, purchasedById, partDescription, amount, reason: reason || '',
        status: 'Requested', createdAt: today.toISOString().slice(0, 10), updatedAt: today.toISOString().slice(0, 10)
      };
      _mock.localPurchases.push(rec);
      await _persistSet('localPurchases', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const l = _mock.localPurchases.find(x => x.id === id);
      if (l) { l.status = status; l.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('localPurchases', l.id, l); }
      return _delay(l);
    }
  },

  // ---- RMA & Replacement ----------------------------------------------------
  rma: {
    async list() { return _delay([..._mock.rma].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.rma.find(r => r.id === id) || null); },
    async listByCustomer(customerId) { return _delay(_mock.rma.filter(r => r.customerId === customerId)); },
    async add({ serviceRequestId, customerId, productId, serialId, reason }) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.rma.filter(r => r.rmaNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const rec = {
        id: _id('rma'), rmaNumber: `PE-KA-RMA-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`,
        serviceRequestId: serviceRequestId || '', customerId, productId, serialId: serialId || '', reason,
        status: 'Requested', resolutionType: '',
        inspection: { condition: '', findings: '', recommendedResolution: '' },
        replacement: { newSerialId: '', dispatchedAt: '' },
        refund: { amount: 0, method: '', processedAt: '' },
        createdAt: today.toISOString().slice(0, 10), updatedAt: today.toISOString().slice(0, 10)
      };
      _mock.rma.push(rec);
      await _persistSet('rma', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const r = _mock.rma.find(x => x.id === id);
      if (r) { r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10); await _persistSet('rma', r.id, r); }
      return _delay(r);
    },
    async setInspection(id, inspection) {
      const r = _mock.rma.find(x => x.id === id);
      if (r) {
        r.inspection = { ...r.inspection, ...inspection };
        r.resolutionType = inspection.recommendedResolution || r.resolutionType;
        if (r.status === 'Product Received') r.status = 'Inspected';
        r.updatedAt = new Date().toISOString().slice(0, 10);
        await _persistSet('rma', r.id, r);
      }
      return _delay(r);
    },
    async resolveReplacement(id, newSerialId, by) {
      const r = _mock.rma.find(x => x.id === id);
      if (!r) return _delay(null);
      if (r.serialId) await db.serials.setStatus(r.serialId, 'RMA Returned');
      await db.serials.setStatus(newSerialId, 'Dispatched (Replacement)');
      r.replacement = { newSerialId, dispatchedAt: new Date().toISOString().slice(0, 10) };
      r.status = 'Resolved'; r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('rma', r.id, r);
      db._notify('RMA Resolved', r.customerId, { rmaNumber: r.rmaNumber, resolutionType: 'Replacement — a new unit is on its way' }, 'RMA', r.id);
      return _delay(r);
    },
    async resolveRefund(id, amount, method) {
      const r = _mock.rma.find(x => x.id === id);
      if (!r) return _delay(null);
      if (r.serialId) await db.serials.setStatus(r.serialId, 'RMA Returned');
      r.refund = { amount, method, processedAt: new Date().toISOString().slice(0, 10) };
      r.status = 'Resolved'; r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('rma', r.id, r);
      db._notify('RMA Resolved', r.customerId, { rmaNumber: r.rmaNumber, resolutionType: `Refund of ₹${amount.toFixed(2)} via ${method}` }, 'RMA', r.id);
      return _delay(r);
    },
    async resolveEscalation(id, newServiceRequestId) {
      const r = _mock.rma.find(x => x.id === id);
      if (!r) return _delay(null);
      r.escalatedServiceRequestId = newServiceRequestId;
      r.status = 'Resolved'; r.updatedAt = new Date().toISOString().slice(0, 10);
      await _persistSet('rma', r.id, r);
      return _delay(r);
    }
  },

  // ---- Communication: notification engine ---------------------------------
  // _notify is called internally by other modules on lifecycle events.
  // It looks up active templates matching the event, renders {{placeholders}},
  // and logs the result as a "sent" message (no real gateway — Phase 1 stub).
  // Fire-and-forget by design (callers don't await it) — a failed/slow
  // notification write should never block the business action that triggered it.
  _renderTemplate(body, vars) {
    return body.replace(/\{\{(\w+)\}\}/g, (m, key) => (vars[key] !== undefined ? vars[key] : m));
  },
  async _notify(event, customerId, vars, relatedType, relatedId) {
    const customer = _mock.customers.find(c => c.id === customerId);
    const templates = _mock.templates.filter(t => t.event === event && t.status === 'Active');
    const mergedVars = { customerName: customer ? customer.name : 'Customer', ...vars };
    for (const t of templates) {
      const rec = {
        id: _id('msg'), customerId, channel: t.channel, templateId: t.id,
        body: db._renderTemplate(t.body, mergedVars),
        relatedType, relatedId, status: 'Sent', sentBy: 'System',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      _mock.messages.push(rec);
      await _persistSet('messages', rec.id, rec);
    }
    return templates.length;
  },

  // ---- Notification Templates ----------------------------------------------
  templates: {
    async list() { return _delay([..._mock.templates]); },
    async add(tpl) {
      const rec = { id: _id('tpl'), status: 'Active', ...tpl };
      _mock.templates.push(rec);
      await _persistSet('templates', rec.id, rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const t = _mock.templates.find(x => x.id === id);
      if (t) { t.status = status; await _persistSet('templates', t.id, t); }
      return _delay(t);
    }
  },

  // ---- Communication Log ----------------------------------------------------
  messages: {
    async list() { return _delay([..._mock.messages].reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async listByCustomer(customerId) { return _delay(_mock.messages.filter(m => m.customerId === customerId).reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async send({ customerId, channel, templateId, freeformBody, relatedType, relatedId, sentBy }) {
      let body = freeformBody || '';
      if (templateId) {
        const tpl = _mock.templates.find(t => t.id === templateId);
        const customer = _mock.customers.find(c => c.id === customerId);
        if (tpl) body = db._renderTemplate(tpl.body, { customerName: customer ? customer.name : 'Customer' });
      }
      const rec = {
        id: _id('msg'), customerId, channel, templateId: templateId || '',
        body, relatedType: relatedType || 'Manual', relatedId: relatedId || '',
        status: 'Sent', sentBy: sentBy || 'System', createdAt: new Date().toISOString().slice(0, 10)
      };
      _mock.messages.push(rec);
      await _persistSet('messages', rec.id, rec);
      return _delay(rec);
    }
  },

  // ---- Reports & Analytics: computed aggregations across all modules --------
  reports: {
    async serviceStats() {
      const requests = _mock.serviceRequests;
      const byStatus = {}; const byType = {}; const byDistrict = {};
      requests.forEach(r => {
        byStatus[r.status] = (byStatus[r.status] || 0) + 1;
        byType[r.type] = (byType[r.type] || 0) + 1;
        byDistrict[r.district] = (byDistrict[r.district] || 0) + 1;
      });
      const closed = requests.filter(r => r.status === 'Closed' && r.createdAt && r.updatedAt);
      let avgResolutionDays = 0;
      if (closed.length) {
        const totalDays = closed.reduce((sum, r) => {
          const d1 = new Date(r.createdAt), d2 = new Date(r.updatedAt);
          return sum + Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
        }, 0);
        avgResolutionDays = Math.round((totalDays / closed.length) * 10) / 10;
      }
      const openRequests = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed').length;
      return _delay({ byStatus, byType, byDistrict, avgResolutionDays, totalRequests: requests.length, openRequests, closedCount: closed.length });
    },

    async financeStats() {
      const invoices = _mock.invoices;
      let totalRevenue = 0, outstanding = 0;
      const byMethod = {};
      const byCategory = {};
      invoices.forEach(inv => {
        const t = db._calcTotals(inv.items, inv.laborCharge);
        totalRevenue += inv.amountPaid;
        outstanding += Math.max(0, t.total - inv.amountPaid);
      });
      _mock.payments.forEach(p => { byMethod[p.method] = (byMethod[p.method] || 0) + p.amount; });
      invoices.forEach(inv => {
        const sr = _mock.serviceRequests.find(s => s.id === inv.serviceRequestId);
        const product = sr ? _mock.products.find(p => p.id === sr.productId) : null;
        const cat = product ? _mock.categories.find(c => c.id === product.categoryId) : null;
        const catName = cat ? cat.name : 'Unlinked';
        const t = db._calcTotals(inv.items, inv.laborCharge);
        byCategory[catName] = (byCategory[catName] || 0) + t.total;
      });
      const localPurchaseSpend = _mock.localPurchases.reduce((sum, l) => sum + l.amount, 0);
      return _delay({
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        outstanding: Math.round(outstanding * 100) / 100,
        byMethod, byCategory, localPurchaseSpend,
        invoiceCount: invoices.length
      });
    },

    async inventoryStats() {
      let totalStockValue = 0;
      const byLocationValue = {};
      _mock.stockLevels.forEach(l => {
        const part = _mock.spareParts.find(p => p.id === l.partId);
        const value = part ? part.unitCost * l.quantity : 0;
        totalStockValue += value;
        byLocationValue[l.locationKey] = (byLocationValue[l.locationKey] || 0) + value;
      });
      const lowStock = _mock.stockLevels.filter(l => l.quantity > 0 && l.quantity <= 3).map(l => {
        const part = _mock.spareParts.find(p => p.id === l.partId);
        return { partName: part ? part.name : l.partId, locationKey: l.locationKey, quantity: l.quantity };
      });
      const pendingSpareRequests = _mock.spareRequests.filter(r => r.status === 'Requested' || r.status === 'Approved').length;
      return _delay({
        totalStockValue: Math.round(totalStockValue * 100) / 100,
        byLocationValue, lowStock, totalMovements: _mock.stockMovements.length, pendingSpareRequests
      });
    },

    async rmaStats() {
      const rmas = _mock.rma;
      const byResolution = {};
      rmas.forEach(r => { if (r.resolutionType) byResolution[r.resolutionType] = (byResolution[r.resolutionType] || 0) + 1; });
      const resolved = rmas.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;
      const resolutionRate = rmas.length ? Math.round((resolved / rmas.length) * 100) : 0;
      return _delay({ byResolution, resolutionRate, totalRma: rmas.length, resolved });
    },

    async communicationStats() {
      const byChannel = {};
      _mock.messages.forEach(m => { byChannel[m.channel] = (byChannel[m.channel] || 0) + 1; });
      return _delay({ byChannel, totalMessages: _mock.messages.length });
    }
  },

  // ---- Website Leads: every public-site Contact form submission -------------
  // Captures the raw inbound enquiry regardless of type. Service Request
  // submissions additionally create a real Service Hub record (see add()).
  websiteLeads: {
    async list() { return _delay([..._mock.websiteLeads].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async add({ name, phone, reason, categoryId, productId, district, message }) {
      // Dedup by phone, same rule the CRM's own Add Customer flow uses.
      let customer = _mock.customers.find(c => c.phone === phone);
      if (!customer) {
        customer = { id: _id('cu'), name, phone, email: '', city: '', district: district || '', dealer: '', status: 'Active', createdAt: new Date().toISOString().slice(0, 10) };
        _mock.customers.push(customer);
        await _persistSet('customers', customer.id, customer);
      }

      let serviceRequestId = '';
      if (reason === 'Service Request' && productId) {
        const sr = await db.service.add({
          customerId: customer.id, type: 'Service', productId,
          district: district || customer.district || '',
          complaint: message || 'Submitted via website contact form.'
        });
        serviceRequestId = sr.id;
      }

      const rec = {
        id: _id('lead'), name, phone, reason, categoryId: categoryId || '', productId: productId || '',
        district: district || '', message: message || '',
        customerId: customer.id, serviceRequestId,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      _mock.websiteLeads.push(rec);
      await _persistSet('websiteLeads', rec.id, rec);
      return _delay(rec);
    }
  },

  // ---- SLA: turnaround targets and computed status per request ---------------
  sla: {
    async listRules() { return _delay([..._mock.slaRules]); },
    async setRule(type, maxDays) {
      const r = _mock.slaRules.find(x => x.type === type);
      if (r) { r.maxDays = maxDays; await _persistSet('slaRules', r.type, r); }
      return _delay(r);
    },
    // Synchronous by design — pure computation on already-fetched data, no "network" needed.
    computeStatus(request) {
      const rule = _mock.slaRules.find(r => r.type === request.type) || { maxDays: 3 };
      const maxDays = rule.maxDays;
      const created = new Date(request.createdAt);
      const reference = (request.status === 'Closed' || request.status === 'Completed') ? new Date(request.updatedAt) : new Date();
      const daysElapsed = Math.max(0, (reference - created) / (1000 * 60 * 60 * 24));
      let status;
      if (request.status === 'Closed' || request.status === 'Completed') {
        status = daysElapsed > maxDays ? 'Closed Late' : 'Met';
      } else if (daysElapsed > maxDays) {
        status = 'Breached';
      } else if (daysElapsed >= maxDays * SLA_AT_RISK_THRESHOLD) {
        status = 'At Risk';
      } else {
        status = 'On Track';
      }
      const dueDate = new Date(created.getTime() + maxDays * 24 * 60 * 60 * 1000);
      return { status, daysElapsed: Math.round(daysElapsed * 10) / 10, maxDays, dueDate: dueDate.toISOString().slice(0, 10) };
    },
    async listWithStatus() {
      const withStatus = _mock.serviceRequests.map(r => ({ ...r, sla: db.sla.computeStatus(r) }));
      return _delay(withStatus);
    }
  },

  // ---- Escalations -------------------------------------------------------------
  escalations: {
    async list() { return _delay([..._mock.escalations].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async listByRequest(serviceRequestId) { return _delay(_mock.escalations.filter(e => e.serviceRequestId === serviceRequestId)); },
    async add({ serviceRequestId, level, reason, by }) {
      const rec = { id: _id('esc'), serviceRequestId, level, reason, status: 'Open', createdAt: new Date().toISOString().slice(0, 10), resolvedAt: '' };
      _mock.escalations.push(rec);
      await _persistSet('escalations', rec.id, rec);
      await db.service.addNote(serviceRequestId, `SLA Escalation (${level}): ${reason}`, by || 'System');
      return _delay(rec);
    },
    async setStatus(id, status) {
      const e = _mock.escalations.find(x => x.id === id);
      if (e) {
        e.status = status; if (status === 'Resolved') e.resolvedAt = new Date().toISOString().slice(0, 10);
        await _persistSet('escalations', e.id, e);
      }
      return _delay(e);
    }
  },

  // ---- Approvals: multi-step sign-off gate on big-ticket actions -------------
  // A qualifying action (above its entity type's threshold) doesn't execute
  // immediately — it creates a Pending approval instead. Only decide()
  // actually performs the gated effect (refund, reimbursement, etc.),
  // dispatched by entityType. Below-threshold actions are unaffected.
  approvals: {
    async listRules() { return _delay([..._mock.approvalRules]); },
    async setRule(entityType, { thresholdAmount, active }) {
      const r = _mock.approvalRules.find(x => x.entityType === entityType);
      if (r) {
        if (thresholdAmount !== undefined) r.thresholdAmount = thresholdAmount;
        if (active !== undefined) r.active = active;
        await _persistSet('approvalRules', r.entityType, r);
      }
      return _delay(r);
    },
    requiresApproval(entityType, amount) {
      const rule = _mock.approvalRules.find(r => r.entityType === entityType);
      return !!(rule && rule.active && amount >= rule.thresholdAmount);
    },

    async list() { return _delay([..._mock.approvals].sort((a, b) => b.createdAt.localeCompare(a.createdAt))); },
    async get(id) { return _delay(_mock.approvals.find(a => a.id === id) || null); },
    async listPending() { return _delay(_mock.approvals.filter(a => a.status === 'Pending')); },
    async listByEntity(entityType, entityId) { return _delay(_mock.approvals.filter(a => a.entityType === entityType && a.entityId === entityId)); },

    async request({ entityType, entityId, amount, description, requestedBy, meta }) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(2), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
      const seqToday = _mock.approvals.filter(a => a.approvalNumber.includes(`-${yy}${mm}${dd}-`)).length + 1;
      const rec = {
        id: _id('apr'), approvalNumber: `PE-KA-APR-${yy}${mm}${dd}-${String(seqToday).padStart(4, '0')}`,
        entityType, entityId, amount, description: description || '', requestedBy: requestedBy || 'System', meta: meta || {},
        status: 'Pending', decidedBy: '', decidedAt: '', comment: '',
        createdAt: today.toISOString().slice(0, 10)
      };
      _mock.approvals.push(rec);
      await _persistSet('approvals', rec.id, rec);
      return _delay(rec);
    },

    async decide(id, decision, by, comment) {
      const a = _mock.approvals.find(x => x.id === id);
      if (!a || a.status !== 'Pending') return _delay(a || null);
      a.status = decision; a.decidedBy = by; a.decidedAt = new Date().toISOString().slice(0, 10); a.comment = comment || '';
      await _persistSet('approvals', a.id, a);

      if (decision === 'Approved') {
        if (a.entityType === 'RMA Refund') {
          await db.rma.resolveRefund(a.entityId, a.amount, a.meta.method || 'Bank Transfer');
        } else if (a.entityType === 'Local Purchase') {
          await db.localPurchases.setStatus(a.entityId, 'Approved');
        } else if (a.entityType === 'New User Account') {
          await db.users.setStatus(a.entityId, 'Active');
        }
      } else if (decision === 'Rejected') {
        if (a.entityType === 'Local Purchase') {
          await db.localPurchases.setStatus(a.entityId, 'Rejected');
        } else if (a.entityType === 'New User Account') {
          await db.users.setStatus(a.entityId, 'Rejected'); // their Auth credential still exists, but signIn() blocks non-Active accounts
        }
        // RMA Refund rejection leaves the RMA at 'Inspected' so the service team can choose a different resolution.
      }
      return _delay(a);
    }
  }
};

// db.ready (set inline above, in the object literal) resolves once
// db.ready (set inline above, in the object literal) resolves once
// _bootstrap() has hydrated `_mock` from Firestore. Every entry point
// (crm-app.js's init, login.html, the website's app.js) awaits it before
// its first read — otherwise a load could momentarily render this file's
// hardcoded seed data before the real Firestore data arrives.

// This file is an ES module (required for the Firebase SDK's `import`
// statements), so none of the above is visible to the classic <script>
// files (crm-app.js, login.html's inline script, the website's app.js)
// unless explicitly bridged onto `window`. Keep this list in sync with
// whatever those files reference as bare globals.
window.db = db;
window.SERVICE_STATUS_STEPS = SERVICE_STATUS_STEPS;
window.RMA_STATUS_STEPS = RMA_STATUS_STEPS;
window.RESOLUTION_TYPES = RESOLUTION_TYPES;
window.KARNATAKA_DISTRICTS = KARNATAKA_DISTRICTS;
