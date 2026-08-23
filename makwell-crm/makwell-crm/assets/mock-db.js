/* =======================================================================
   MAKWELL CRM — Data Access Layer
   -----------------------------------------------------------------------
   This module is the ONLY place that touches "the database". Every
   function here returns a Promise, mirroring how a real Firestore call
   behaves, so that swapping MOCK_MODE for a real Firebase project later
   means changing this file only — no CRM screen code needs to change.

   TO GO LIVE WITH REAL FIREBASE:
   1. Fill in FIREBASE_CONFIG below with your project's config.
   2. Set MOCK_MODE = false.
   3. Implement the marked TODOs using the Firebase v9 modular SDK
      (firebase/app, firebase/auth, firebase/firestore).
   Every function signature and return shape should stay the same, so
   the rest of the CRM keeps working unmodified.
   ======================================================================= */

const MOCK_MODE = true;

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// -----------------------------------------------------------------------
// In-memory mock store. Resets on page reload — this is a Phase 1
// prototype for exercising the data model and screens, not a database.
// -----------------------------------------------------------------------
const _mock = {
  users: [
    { id: 'u1', name: 'Anita Rao', email: 'anita.rao@makwell.in', role: 'Super Admin', status: 'Active', createdAt: '2026-01-12' },
    { id: 'u2', name: 'Suresh Patil', email: 'suresh.patil@makwell.in', role: 'Warehouse', status: 'Active', createdAt: '2026-02-03' },
    { id: 'u3', name: 'Ramesh Kulkarni', email: 'ramesh.k@makwell.in', role: 'Service Center', status: 'Active', createdAt: '2026-02-18' },
    { id: 'u4', name: 'Vinod Naik', email: 'vinod.naik@makwell.in', role: 'Technician', status: 'Active', createdAt: '2026-03-01' },
    { id: 'u5', name: 'Deepa Traders', email: 'deepa.traders@example.com', role: 'Dealer', status: 'Active', createdAt: '2026-03-14' },
    { id: 'u6', name: 'Faisal Shaikh', email: 'faisal.shaikh@makwell.in', role: 'Warehouse', status: 'Inactive', createdAt: '2026-01-29' }
  ],

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

  products: [
    { id: 'p1', categoryId: 'c-tv', model: 'MW-TV43-FHD', name: '43" Full HD LED', status: 'Active', attrs: { screenSize: '43"', resolution: 'Full HD' } },
    { id: 'p2', categoryId: 'c-tv', model: 'MW-TV55-4K', name: '55" 4K Smart LED', status: 'Active', attrs: { screenSize: '55"', resolution: '4K' } },
    { id: 'p3', categoryId: 'c-wm', model: 'MW-WM72-SA', name: '7.2kg Semi-Automatic', status: 'Active', attrs: { capacity: '7.2', type: 'Semi-Automatic' } },
    { id: 'p4', categoryId: 'c-wm', model: 'MW-WM80-FA', name: '8kg Fully Automatic', status: 'Active', attrs: { capacity: '8', type: 'Fully Automatic' } },
    { id: 'p5', categoryId: 'c-stb', model: 'MW-STB5-KVA', name: '5kVA Voltage Stabilizer', status: 'Active', attrs: { capacity: '5', inputRange: '90V–290V' } }
  ],

  serials: [
    { id: 's1', productId: 'p1', serial: 'MW43FHD00019217', status: 'Sold', dealer: 'Deepa Traders', createdAt: '2026-05-02' },
    { id: 's2', productId: 'p3', serial: 'MW72SA00028841', status: 'Registered', dealer: 'Deepa Traders', createdAt: '2026-05-10' },
    { id: 's3', productId: 'p5', serial: 'MWSTB5K00003345', status: 'In Stock', dealer: '', createdAt: '2026-06-01' }
  ],

  customers: [
    { id: 'cu1', name: 'Prakash Hegde', phone: '9741122334', email: 'prakash.h@example.com', city: 'Hubli', district: 'Dharwad', dealer: 'Deepa Traders', status: 'Active', createdAt: '2026-05-02' },
    { id: 'cu2', name: 'Meera Joshi', phone: '9880099112', email: '', city: 'Belagavi', district: 'Belagavi', dealer: 'Deepa Traders', status: 'Active', createdAt: '2026-05-11' }
  ],

  serviceCenters: [
    { id: 'sc1', name: 'Hubli Service Center', district: 'Dharwad', state: 'Karnataka', phone: '9900011111', status: 'Active', userId: 'u3' },
    { id: 'sc2', name: 'Belagavi Service Center', district: 'Belagavi', state: 'Karnataka', phone: '9900022222', status: 'Active' },
    { id: 'sc3', name: 'Bengaluru Urban Service Center', district: 'Bengaluru Urban', state: 'Karnataka', phone: '9900033333', status: 'Active' }
  ],

  technicians: [
    { id: 't1', name: 'Vinod Naik', centerId: 'sc1', phone: '9900044444', skills: 'TV, Washing Machine', status: 'Active', userId: 'u4' },
    { id: 't2', name: 'Ganesh Patil', centerId: 'sc1', phone: '9900055555', skills: 'Stabilizer, Iron Box', status: 'Active' },
    { id: 't3', name: 'Iqbal Shaikh', centerId: 'sc2', phone: '9900066666', skills: 'TV, Sound System', status: 'Active' }
  ],

  serviceRequests: [
    {
      id: 'sr1', requestNumber: 'PE-KA-SR-260810-0001', type: 'Service',
      customerId: 'cu1', productId: 'p1', serialId: 's1',
      complaint: 'No display, power light blinking.', district: 'Dharwad',
      centerId: 'sc1', technicianId: 't1',
      status: 'Technician Visit',
      scheduledDate: '2026-08-14', scheduledSlot: 'Morning (9–12)',
      diagnosis: { notes: '', spareParts: '', estimatedCost: '' },
      installation: { isInstallation: false, installDate: '', notes: '' },
      internalNotes: [{ text: 'Customer confirmed availability for Thu morning.', by: 'Ramesh Kulkarni', at: '2026-08-11' }],
      createdAt: '2026-08-10', updatedAt: '2026-08-11'
    },
    {
      id: 'sr2', requestNumber: 'PE-KA-SR-260815-0007', type: 'Warranty',
      customerId: 'cu2', productId: 'p3', serialId: 's2',
      complaint: 'Drum not spinning, loud noise during wash cycle.', district: 'Belagavi',
      centerId: 'sc2', technicianId: '',
      status: 'Assigned',
      scheduledDate: '', scheduledSlot: '',
      diagnosis: { notes: '', spareParts: '', estimatedCost: '' },
      installation: { isInstallation: false, installDate: '', notes: '' },
      internalNotes: [],
      createdAt: '2026-08-15', updatedAt: '2026-08-15'
    }
  ],

  spareParts: [
    { id: 'sp1', name: 'Capacitor 450V', partNumber: 'CAP-450', categoryId: 'c-wm', unitCost: 120, status: 'Active' },
    { id: 'sp2', name: 'Wash Motor Assembly', partNumber: 'MOT-WASH-01', categoryId: 'c-wm', unitCost: 1450, status: 'Active' },
    { id: 'sp3', name: 'Spin Motor Assembly', partNumber: 'MOT-SPIN-01', categoryId: 'c-wm', unitCost: 980, status: 'Active' },
    { id: 'sp4', name: 'TV Power Supply Board', partNumber: 'PSB-TV-01', categoryId: 'c-tv', unitCost: 650, status: 'Active' },
    { id: 'sp5', name: 'Remote Control (Universal)', partNumber: 'REM-UNI-01', categoryId: 'c-tv', unitCost: 180, status: 'Active' },
    { id: 'sp6', name: 'Stabilizer Relay', partNumber: 'REL-STB-01', categoryId: 'c-stb', unitCost: 210, status: 'Active' },
    { id: 'sp7', name: 'Iron Heating Element', partNumber: 'HTE-IB-01', categoryId: 'c-ib', unitCost: 150, status: 'Active' }
  ],

  // locationKey format: 'warehouse' | 'sc:<serviceCenterId>' | 't:<technicianId>'
  stockLevels: [
    { locationKey: 'warehouse', partId: 'sp1', quantity: 40 },
    { locationKey: 'warehouse', partId: 'sp2', quantity: 12 },
    { locationKey: 'warehouse', partId: 'sp3', quantity: 15 },
    { locationKey: 'warehouse', partId: 'sp4', quantity: 20 },
    { locationKey: 'warehouse', partId: 'sp5', quantity: 60 },
    { locationKey: 'warehouse', partId: 'sp6', quantity: 25 },
    { locationKey: 'warehouse', partId: 'sp7', quantity: 30 },
    { locationKey: 'sc:sc1', partId: 'sp1', quantity: 5 },
    { locationKey: 't:t1', partId: 'sp1', quantity: 2 }
  ],

  stockMovements: [
    { id: 'sm1', partId: 'sp1', fromKey: '', toKey: 'sc:sc1', quantity: 5, type: 'Dispatch', reference: '', notes: 'Initial stocking', by: 'Anita Rao', createdAt: '2026-08-01' },
    { id: 'sm2', partId: 'sp1', fromKey: 'sc:sc1', toKey: 't:t1', quantity: 2, type: 'Transfer', reference: '', notes: 'Handed to technician for field jobs', by: 'Ramesh Kulkarni', createdAt: '2026-08-05' }
  ],

  spareRequests: [
    {
      id: 'req1', requestNumber: 'PE-KA-SPR-260812-0001',
      partId: 'sp3', quantity: 1,
      requestedByType: 'Technician', requestedById: 't1',
      serviceRequestId: 'sr2',
      status: 'Requested',
      createdAt: '2026-08-12', updatedAt: '2026-08-12'
    }
  ],

  estimates: [
    {
      id: 'est1', estimateNumber: 'PE-KA-EST-260812-0001',
      serviceRequestId: 'sr2', customerId: 'cu2',
      items: [{ description: 'Spin Motor Assembly', qty: 1, unitCost: 980 }],
      laborCharge: 400,
      status: 'Sent',
      createdAt: '2026-08-12', updatedAt: '2026-08-12'
    }
  ],

  invoices: [],
  payments: [],

  localPurchases: [
    {
      id: 'lp1', requestNumber: 'PE-KA-LP-260813-0001',
      serviceRequestId: 'sr1', purchasedByType: 'Technician', purchasedById: 't1',
      partDescription: 'HDMI Cable (1.5m)', amount: 180, reason: 'Not in warehouse or center stock, needed same-day.',
      status: 'Requested', createdAt: '2026-08-13', updatedAt: '2026-08-13'
    }
  ],

  rma: [
    {
      id: 'rma1', rmaNumber: 'PE-KA-RMA-260814-0001',
      serviceRequestId: 'sr1', customerId: 'cu1', productId: 'p1', serialId: 's1',
      reason: 'Panel completely dead after power surge — technician assessed board-level repair as uneconomical.',
      status: 'Requested', resolutionType: '',
      inspection: { condition: '', findings: '', recommendedResolution: '' },
      replacement: { newSerialId: '', dispatchedAt: '' },
      refund: { amount: 0, method: '', processedAt: '' },
      createdAt: '2026-08-14', updatedAt: '2026-08-14'
    }
  ],

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
    { entityType: 'Local Purchase', thresholdAmount: 500, active: true }
  ],

  approvals: []
};

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

  // ---- Auth (mock) --------------------------------------------------
  auth: {
    // TODO(live): replace with firebase/auth signInWithEmailAndPassword
    async signIn(email, role) {
      if (!MOCK_MODE) { /* TODO: real Firebase auth */ }
      const user = _mock.users.find(u => u.email.toLowerCase() === email.toLowerCase())
        || { id: _id('u'), name: email.split('@')[0], email, role, status: 'Active' };
      return _delay({ ...user, role: role || user.role });
    }
  },

  // ---- Users & Roles --------------------------------------------------
  users: {
    async list() { return _delay([..._mock.users]); },
    async add(user) {
      const rec = { id: _id('u'), status: 'Active', createdAt: new Date().toISOString().slice(0, 10), ...user };
      _mock.users.push(rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const u = _mock.users.find(x => x.id === id);
      if (u) u.status = status;
      return _delay(u);
    }
  },

  // ---- Product Categories ---------------------------------------------
  categories: {
    async list() { return _delay([..._mock.categories]); },
    async add(name) {
      const rec = { id: _id('c-'), name, status: 'Active', createdAt: new Date().toISOString().slice(0, 10), attributes: [] };
      _mock.categories.push(rec);
      _mock.warrantyRules.push({ categoryId: rec.id, components: [{ name: 'Full Product', years: 1 }] });
      return _delay(rec);
    },
    async get(id) { return _delay(_mock.categories.find(c => c.id === id) || null); },
    async setStatus(id, status) {
      const c = _mock.categories.find(x => x.id === id);
      if (c) c.status = status;
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const s = _mock.serials.find(x => x.id === id);
      if (s) s.status = status;
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const s = _mock.serviceCenters.find(x => x.id === id);
      if (s) s.status = status;
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const t = _mock.technicians.find(x => x.id === id);
      if (t) t.status = status;
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
      db._notify('Service Request Created', rec.customerId, { requestNumber: rec.requestNumber }, 'Service', rec.id);
      return _delay(rec);
    },

    async assign(id, { centerId, technicianId }) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      r.centerId = centerId; r.technicianId = technicianId || '';
      if (r.status === 'Request Received') r.status = 'Assigned';
      r.updatedAt = new Date().toISOString().slice(0, 10);
      return _delay(r);
    },

    async schedule(id, { date, slot }) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      r.scheduledDate = date; r.scheduledSlot = slot;
      if (SERVICE_STATUS_STEPS.indexOf(r.status) < SERVICE_STATUS_STEPS.indexOf('Scheduled')) r.status = 'Scheduled';
      r.updatedAt = new Date().toISOString().slice(0, 10);
      return _delay(r);
    },

    async setStatus(id, status) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) {
        r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10);
        db._notify('Service Status Updated', r.customerId, { requestNumber: r.requestNumber, status }, 'Service', r.id);
      }
      return _delay(r);
    },

    async setDiagnosis(id, diagnosis) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) { r.diagnosis = { ...r.diagnosis, ...diagnosis }; r.updatedAt = new Date().toISOString().slice(0, 10); }
      return _delay(r);
    },

    async setInstallation(id, installation) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) { r.installation = { ...r.installation, ...installation }; r.updatedAt = new Date().toISOString().slice(0, 10); }
      return _delay(r);
    },

    async addNote(id, text, by) {
      const r = _mock.serviceRequests.find(x => x.id === id);
      if (r) r.internalNotes.push({ text, by, at: new Date().toISOString().slice(0, 10) });
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const p = _mock.spareParts.find(x => x.id === id);
      if (p) p.status = status;
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
    _adjust(locationKey, partId, delta) {
      let row = _mock.stockLevels.find(s => s.locationKey === locationKey && s.partId === partId);
      if (!row) { row = { locationKey, partId, quantity: 0 }; _mock.stockLevels.push(row); }
      row.quantity += delta;
      if (row.quantity < 0) row.quantity = 0;
      return row;
    },
    async receive({ toKey, partId, quantity, notes, by }) {
      db.stock._adjust(toKey, partId, quantity);
      const rec = { id: _id('sm'), partId, fromKey: '', toKey, quantity, type: 'Receipt', reference: '', notes: notes || '', by: by || '', createdAt: new Date().toISOString().slice(0, 10) };
      _mock.stockMovements.push(rec);
      return _delay(rec);
    },
    async transfer({ fromKey, toKey, partId, quantity, notes, by, type, reference }) {
      const available = _mock.stockLevels.find(s => s.locationKey === fromKey && s.partId === partId);
      if (!available || available.quantity < quantity) return _delay({ error: 'Insufficient stock at source location.' });
      db.stock._adjust(fromKey, partId, -quantity);
      db.stock._adjust(toKey, partId, quantity);
      const rec = { id: _id('sm'), partId, fromKey, toKey, quantity, type: type || 'Transfer', reference: reference || '', notes: notes || '', by: by || '', createdAt: new Date().toISOString().slice(0, 10) };
      _mock.stockMovements.push(rec);
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const r = _mock.spareRequests.find(x => x.id === id);
      if (r) { r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10); }
      return _delay(r);
    },
    async dispatch(id, by) {
      const r = _mock.spareRequests.find(x => x.id === id);
      if (!r) return _delay(null);
      const toKey = r.requestedByType === 'Technician' ? `t:${r.requestedById}` : `sc:${r.requestedById}`;
      const result = await db.stock.transfer({ fromKey: 'warehouse', toKey, partId: r.partId, quantity: r.quantity, notes: `Spare request ${r.requestNumber}`, by, type: 'Dispatch', reference: r.requestNumber });
      if (result && result.error) return _delay(result);
      r.status = 'Dispatched'; r.updatedAt = new Date().toISOString().slice(0, 10);
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const e = _mock.estimates.find(x => x.id === id);
      if (e) { e.status = status; e.updatedAt = new Date().toISOString().slice(0, 10); }
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
      const inv = _mock.invoices.find(i => i.id === invoiceId);
      if (inv) {
        inv.amountPaid = Math.round((inv.amountPaid + amount) * 100) / 100;
        const { total } = db._calcTotals(inv.items, inv.laborCharge);
        inv.status = inv.amountPaid >= total ? 'Paid' : (inv.amountPaid > 0 ? 'Partially Paid' : 'Unpaid');
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const l = _mock.localPurchases.find(x => x.id === id);
      if (l) { l.status = status; l.updatedAt = new Date().toISOString().slice(0, 10); }
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
      return _delay(rec);
    },
    async setStatus(id, status) {
      const r = _mock.rma.find(x => x.id === id);
      if (r) { r.status = status; r.updatedAt = new Date().toISOString().slice(0, 10); }
      return _delay(r);
    },
    async setInspection(id, inspection) {
      const r = _mock.rma.find(x => x.id === id);
      if (r) {
        r.inspection = { ...r.inspection, ...inspection };
        r.resolutionType = inspection.recommendedResolution || r.resolutionType;
        if (r.status === 'Product Received') r.status = 'Inspected';
        r.updatedAt = new Date().toISOString().slice(0, 10);
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
      db._notify('RMA Resolved', r.customerId, { rmaNumber: r.rmaNumber, resolutionType: 'Replacement — a new unit is on its way' }, 'RMA', r.id);
      return _delay(r);
    },
    async resolveRefund(id, amount, method) {
      const r = _mock.rma.find(x => x.id === id);
      if (!r) return _delay(null);
      if (r.serialId) await db.serials.setStatus(r.serialId, 'RMA Returned');
      r.refund = { amount, method, processedAt: new Date().toISOString().slice(0, 10) };
      r.status = 'Resolved'; r.updatedAt = new Date().toISOString().slice(0, 10);
      db._notify('RMA Resolved', r.customerId, { rmaNumber: r.rmaNumber, resolutionType: `Refund of ₹${amount.toFixed(2)} via ${method}` }, 'RMA', r.id);
      return _delay(r);
    },
    async resolveEscalation(id, newServiceRequestId) {
      const r = _mock.rma.find(x => x.id === id);
      if (!r) return _delay(null);
      r.escalatedServiceRequestId = newServiceRequestId;
      r.status = 'Resolved'; r.updatedAt = new Date().toISOString().slice(0, 10);
      return _delay(r);
    }
  },

  // ---- Communication: notification engine ---------------------------------
  // _notify is called internally by other modules on lifecycle events.
  // It looks up active templates matching the event, renders {{placeholders}},
  // and logs the result as a "sent" message (no real gateway — Phase 1 stub).
  _renderTemplate(body, vars) {
    return body.replace(/\{\{(\w+)\}\}/g, (m, key) => (vars[key] !== undefined ? vars[key] : m));
  },
  _notify(event, customerId, vars, relatedType, relatedId) {
    const customer = _mock.customers.find(c => c.id === customerId);
    const templates = _mock.templates.filter(t => t.event === event && t.status === 'Active');
    const mergedVars = { customerName: customer ? customer.name : 'Customer', ...vars };
    templates.forEach(t => {
      const rec = {
        id: _id('msg'), customerId, channel: t.channel, templateId: t.id,
        body: db._renderTemplate(t.body, mergedVars),
        relatedType, relatedId, status: 'Sent', sentBy: 'System',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      _mock.messages.push(rec);
    });
    return templates.length;
  },

  // ---- Notification Templates ----------------------------------------------
  templates: {
    async list() { return _delay([..._mock.templates]); },
    async add(tpl) {
      const rec = { id: _id('tpl'), status: 'Active', ...tpl };
      _mock.templates.push(rec);
      return _delay(rec);
    },
    async setStatus(id, status) {
      const t = _mock.templates.find(x => x.id === id);
      if (t) t.status = status;
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
      return _delay(rec);
    }
  },

  // ---- SLA: turnaround targets and computed status per request ---------------
  sla: {
    async listRules() { return _delay([..._mock.slaRules]); },
    async setRule(type, maxDays) {
      const r = _mock.slaRules.find(x => x.type === type);
      if (r) r.maxDays = maxDays;
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
      await db.service.addNote(serviceRequestId, `SLA Escalation (${level}): ${reason}`, by || 'System');
      return _delay(rec);
    },
    async setStatus(id, status) {
      const e = _mock.escalations.find(x => x.id === id);
      if (e) { e.status = status; if (status === 'Resolved') e.resolvedAt = new Date().toISOString().slice(0, 10); }
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
      return _delay(rec);
    },

    async decide(id, decision, by, comment) {
      const a = _mock.approvals.find(x => x.id === id);
      if (!a || a.status !== 'Pending') return _delay(a || null);
      a.status = decision; a.decidedBy = by; a.decidedAt = new Date().toISOString().slice(0, 10); a.comment = comment || '';

      if (decision === 'Approved') {
        if (a.entityType === 'RMA Refund') {
          await db.rma.resolveRefund(a.entityId, a.amount, a.meta.method || 'Bank Transfer');
        } else if (a.entityType === 'Local Purchase') {
          await db.localPurchases.setStatus(a.entityId, 'Approved');
        }
      } else if (decision === 'Rejected') {
        if (a.entityType === 'Local Purchase') {
          await db.localPurchases.setStatus(a.entityId, 'Rejected');
        }
        // RMA Refund rejection leaves the RMA at 'Inspected' so the service team can choose a different resolution.
      }
      return _delay(a);
    }
  }
};
