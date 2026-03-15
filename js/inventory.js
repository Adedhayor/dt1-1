/**
 * DirecTokunbo - Inventory Page
 * Generates listing cards in the auction card format.
 */

// ===== SEEDED PRNG =====
function seededRandom(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = seededRandom(42);

const ITEMS_PER_PAGE = 12;

const baseModels = [
    { make: 'Toyota',        model: 'Highlander XSE',      image: 'assets/images/toyota-highlander.jpg', cat: 'suv',     grade: 4, engine: '2.4L Turbo I4', transmission: 'Automatic', fuel: 'Petrol', drive: 'AWD', color: 'Pearl White', interior: 'Black Leather', features: ['Sunroof', 'Apple CarPlay', 'Blind Spot Monitor', 'Heated Seats'] },
    { make: 'Lexus',         model: 'RX 350 F-Sport',      image: 'assets/images/lexus-rx.jpg',          cat: 'suv',     grade: 5, engine: '3.5L V6',      transmission: 'Automatic', fuel: 'Petrol', drive: 'AWD', color: 'Sonic Titanium', interior: 'Red Leather',   features: ['Mark Levinson Audio', 'HUD', 'Adaptive Cruise', '360° Camera'] },
    { make: 'BMW',           model: 'X5 xDrive40i',        image: 'assets/images/bmw-x5.jpg',            cat: 'suv',     grade: 4, engine: '3.0L TwinPower', transmission: 'Automatic', fuel: 'Petrol', drive: 'xDrive AWD', color: 'Alpine White', interior: 'Cognac Leather', features: ['Panoramic Roof', 'Harman Kardon', 'Active Suspension', 'Night Vision'] },
    { make: 'Mercedes-Benz', model: 'GLE 450 4MATIC',      image: 'assets/images/mercedes-gle.jpg',      cat: 'suv',     grade: 5, engine: '3.0L EQ Boost', transmission: 'Automatic', fuel: 'Mild Hybrid', drive: '4MATIC AWD', color: 'Obsidian Black', interior: 'Nappa Leather', features: ['MBUX Display', 'Burmester Audio', 'Air Suspension', '360° Camera'] },
    { make: 'Audi',          model: 'Q7 55 TFSI quattro',  image: 'assets/images/audi-q7.jpg',           cat: 'suv',     grade: 4, engine: '3.0L TFSI V6',  transmission: 'Tiptronic',  fuel: 'Petrol', drive: 'quattro AWD', color: 'Glacier White', interior: 'Valcona Leather', features: ['Virtual Cockpit', 'Bang & Olufsen', 'Air Suspension', 'Massage Seats'] },
    { make: 'Land Rover',    model: 'Defender 110 SE',     image: 'assets/images/land-rover-defender.jpg', cat: 'suv',   grade: 5, engine: '3.0L MHEV I6',  transmission: 'Automatic', fuel: 'Mild Hybrid', drive: 'AWD', color: 'Pangea Green', interior: 'Ebony Leather', features: ['Terrain Response', 'Meridian Audio', 'Wade Sensing', 'ClearSight Mirror'] },
    { make: 'Toyota',        model: 'Camry XSE V6',        image: 'assets/images/inventory-5.jpg',       cat: 'sedan',   grade: 4, engine: '3.5L V6',      transmission: 'Automatic', fuel: 'Petrol', drive: 'FWD', color: 'Midnight Black', interior: 'Black SofTex', features: ['JBL Audio', 'Head-Up Display', 'Wireless Charging', 'Safety Sense 2.5'] },
    { make: 'Honda',         model: 'Accord Sport 2.0T',   image: 'assets/images/inventory-6.jpg',       cat: 'sedan',   grade: 3, engine: '2.0L Turbo',   transmission: 'Automatic', fuel: 'Petrol', drive: 'FWD', color: 'Sonic Gray', interior: 'Black Leather', features: ['Honda Sensing', 'Wireless CarPlay', 'Bose Audio', 'Sport Mode'] },
    { make: 'Mercedes-Benz', model: 'C300 4MATIC',         image: 'assets/images/inventory-7.jpg',       cat: 'sedan',   grade: 5, engine: '2.0L Turbo I4', transmission: 'Automatic', fuel: 'Petrol', drive: '4MATIC AWD', color: 'Polar White', interior: 'Artico Leather', features: ['MBUX Infotainment', 'Burmester Surround', 'PRE-SAFE', 'AMG Line'] },
    { make: 'BMW',           model: '3 Series 330i',       image: 'assets/images/inventory-8.jpg',       cat: 'sedan',   grade: 4, engine: '2.0L TwinPower', transmission: 'Automatic', fuel: 'Petrol', drive: 'RWD', color: 'Portimao Blue', interior: 'SensaTec',     features: ['Curved Display', 'Parking Assistant', 'M Sport Package', 'ConnectedDrive'] },
    { make: 'Nissan',        model: 'Patrol Platinum V8',  image: 'assets/images/inventory-9.jpg',       cat: 'suv',     grade: 4, engine: '5.6L V8',      transmission: 'Automatic', fuel: 'Petrol', drive: '4WD', color: 'Hermosa Blue', interior: 'Semi-Aniline Leather', features: ['Bose Audio Premium', 'Around View Monitor', 'Hydraulic Body Motion', 'Tri-Zone Climate'] },
    { make: 'BYD',           model: 'Atto 3 EV',           image: 'assets/images/inventory-3.jpg',       cat: 'electric', grade: 5, engine: '150kW Motor',  transmission: 'Single Speed', fuel: 'Electric', drive: 'FWD', color: 'Surf Blue', interior: 'Vegan Leather', features: ['V2L Technology', 'DiLink OS', 'ADAS Suite', 'Rotating Center Console'] },
    { make: 'Toyota',        model: 'Hiace High Roof',     image: 'assets/images/inventory-4.jpg',       cat: 'van',     grade: 3, engine: '2.8L Diesel',  transmission: 'Automatic', fuel: 'Diesel', drive: 'RWD', color: 'White', interior: 'Fabric', features: ['Dual A/C', 'Power Sliding Door', 'Reversing Camera', 'Multi-Info Display'] },
    { make: 'Mitsubishi',    model: 'L200 Triton 4WD',     image: 'assets/images/inventory-4.jpg',       cat: 'truck',   grade: 4, engine: '2.4L DiD MIVEC', transmission: 'Automatic', fuel: 'Diesel', drive: '4WD', color: 'Graphite Grey', interior: 'Fabric/Leather', features: ['Super Select 4WD', 'Rockford Fosgate', 'Smartphone Link', 'Forward Collision Mitigation'] },
    { make: 'Lexus',         model: 'LX 600 VIP',          image: 'assets/images/lexus-rx.jpg',          cat: 'suv',     grade: 5, engine: '3.5L Twin Turbo V6', transmission: 'Automatic', fuel: 'Petrol', drive: '4WD', color: 'Sonic Quartz', interior: 'Semi-Aniline Leather', features: ['VIP 4-Seat Config', 'Mark Levinson 25-speaker', 'Multi-Terrain Select', 'Cool Box'] },
    { make: 'Geely',         model: 'Coolray Premium',     image: 'assets/images/inventory-3.jpg',       cat: 'suv',     grade: 4, engine: '1.5L Turbo',   transmission: 'DCT',        fuel: 'Petrol', drive: 'FWD', color: 'Aurora Blue', interior: 'Leather', features: ['10.25" Infotainment', 'AEB', 'Lane Assist', 'Ventilated Seats'] },
];

const locations = ['Shenzhen, China', 'Beijing, China', 'Shanghai, China', 'Guangzhou, China', 'Tianjin, China', 'Chengdu, China'];
const conditions = [
    { label: 'Clean Title', cls: 'condition-clean' },
    { label: 'Clean Title', cls: 'condition-clean' },
    { label: 'Clean Title', cls: 'condition-clean' },
    { label: 'Minor Damage', cls: 'condition-minor' },
    { label: 'Rebuildable', cls: 'condition-damaged' },
];
const badgePool = ['Hot', 'New', 'Deal', '', '', '', '', ''];
const specsPool = ['AWD', '4WD', 'RWD', 'Automatic', 'Petrol', 'Diesel', 'Hybrid', 'V6', 'V8', 'Turbo', '4MATIC', 'xDrive', 'quattro', 'Sunroof', 'Leather'];

const rnd = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const fmtPrice = (n) => '₦' + n.toLocaleString();

function buildStars(grade) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += i <= grade ? '★' : '<span class="grade-empty">★</span>';
    }
    return s;
}

function genSpecs(count = 3) {
    const out = [];
    while (out.length < count) {
        const s = pick(specsPool);
        if (!out.includes(s)) out.push(s);
    }
    return out;
}

function generateInventory(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const base = baseModels[i % baseModels.length];
        const year = rnd(2020, 2025);
        const mileage = rnd(2000, 75000);
        const bidBase = rnd(12000000, 75000000);
        const bid = Math.round(bidBase / 500000) * 500000;
        const cif = Math.round((bid * rnd(108, 118) / 100) / 500000) * 500000;
        const lot = 'DT-' + String(4000 + i + 1).padStart(5, '0');
        const cond = pick(conditions);
        const badge = pick(badgePool);
        const hoursLeft = rnd(6, 200);

        data.push({
            id: i + 1,
            lot,
            make: base.make,
            model: base.model,
            year,
            image: base.image,
            cat: base.cat,
            grade: base.grade,
            mileage: mileage.toLocaleString() + ' km',
            location: pick(locations),
            bid,
            cif,
            cond,
            badge,
            hoursLeft,
            specs: genSpecs(3),
            engine: base.engine,
            transmission: base.transmission,
            fuel: base.fuel,
            drive: base.drive,
            color: base.color,
            interior: base.interior,
            features: base.features,
        });
    }
    return data;
}

const ALL_INVENTORY = generateInventory(96);

// ===== URL PARAM FILTERING =====
function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type') || params.get('cat') || '';
  const makeParam = (params.get('make') || params.get('q') || '').toLowerCase();
  const priceParam = params.get('price') || '';
  const sortParam = params.get('sort') || '';

  let data = [...ALL_INVENTORY];

  if (typeParam) {
    data = data.filter(c => c.cat === typeParam.toLowerCase());
  }
  if (makeParam) {
    data = data.filter(c =>
      c.make.toLowerCase().includes(makeParam) ||
      c.model.toLowerCase().includes(makeParam)
    );
  }
  if (priceParam) {
    const ranges = {
      '0-20m':   [0,         20000000],
      '20m-40m': [20000000,  40000000],
      '40m-60m': [40000000,  60000000],
      '60m+':    [60000000,  Infinity],
      '0-5m':    [0,          5000000],
      '5m-15m':  [5000000,   15000000],
      '15m-30m': [15000000,  30000000],
      '30m-50m': [30000000,  50000000],
      '50m+':    [50000000,  Infinity],
    };
    const range = ranges[priceParam];
    if (range) data = data.filter(c => c.bid >= range[0] && c.bid < range[1]);
  }

  // Pre-fill filter selects to match URL
  const typeSelect = document.getElementById('filterType');
  const makeSelect = document.getElementById('filterMake');
  const priceSelect = document.getElementById('filterPrice');
  if (typeSelect && typeParam) typeSelect.value = typeParam;
  if (makeSelect && makeParam) makeSelect.value = makeParam;
  if (priceSelect && priceParam) priceSelect.value = priceParam;

  // Category tab highlight
  if (typeParam) {
    document.querySelectorAll('.cat-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.cat === typeParam);
    });
  }

  return data;
}

let currentPage = 1;
let filteredData = applyUrlParams();

function renderCards(page) {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const slice = filteredData.slice(start, start + ITEMS_PER_PAGE);

    if (slice.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--color-text-muted)">No vehicles match your filters.</div>`;
        return;
    }

    grid.innerHTML = slice.map(car => {
        const badgeHtml = car.badge ? `<span class="listing-badge badge-${car.badge.toLowerCase()}">${car.badge}</span>` : '';
        const stars = buildStars(car.grade);

        return `
        <article class="listing-card" data-cat="${car.cat}">
            <div class="listing-img">
                <a href="car-detail.html?id=${car.id}" class="listing-card-link">
                <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                </a>
                <span class="listing-lot">LOT #${car.lot}</span>
                ${badgeHtml}
                <button class="listing-watch" aria-label="Watch listing">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
            </div>
            <div class="listing-body">
                <div class="listing-grade">
                    <span class="grade-stars">${stars}</span>
                    <span class="grade-label">Grade ${car.grade} / 5</span>
                </div>
                <h3 class="listing-title"><a href="car-detail.html?id=${car.id}" style="color:inherit;text-decoration:none;">${car.year} ${car.make} ${car.model}</a></h3>
                <div class="listing-specs">
                    ${car.specs.map(s => `<span>${s}</span>`).join('')}
                    <span>${car.mileage}</span>
                </div>
                <div class="listing-meta">
                    <span class="listing-origin">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${car.location}
                    </span>
                    <span class="condition-badge ${car.cond.cls}">${car.cond.label}</span>
                </div>
                <div class="listing-pricing">
                    <div class="price-block">
                        <span class="price-label">Current Bid</span>
                        <span class="price-amount">${fmtPrice(car.bid)}</span>
                    </div>
                    <div class="price-block price-cif">
                        <span class="price-label">Est. CIF Lagos</span>
                        <span class="price-amount-muted">${fmtPrice(car.cif)}</span>
                    </div>
                </div>
                <div class="listing-timer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span class="auction-timer" data-hours="${car.hoursLeft}"></span>
                    <span class="timer-label">remaining</span>
                </div>
                <div class="listing-actions">
                    <a href="https://wa.me/2348121779861?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (LOT #${car.lot}) listed at ${fmtPrice(car.bid)}. Please share more details.`)}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">Place Bid</a>
                    <a href="car-detail.html?id=${car.id}" class="btn btn-outline btn-sm">Details</a>
                </div>
            </div>
        </article>`;
    }).join('');

    // Wire up watch buttons
    grid.querySelectorAll('.listing-watch, .listing-watch-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.listing-card');
            const isActive = !this.classList.contains('active');
            card?.querySelectorAll('.listing-watch, .listing-watch-btn').forEach(b => b.classList.toggle('active', isActive));
        });
    });

    // Init timers
    grid.querySelectorAll('.auction-timer[data-hours]').forEach(el => {
        const hoursLeft = parseFloat(el.dataset.hours);
        const end = Date.now() + hoursLeft * 3600 * 1000;
        el.dataset.end = end;
        updateTimer(el, end);
    });
}

function updateTimer(el, end) {
    const msLeft = end - Date.now();
    if (msLeft <= 0) { el.textContent = 'Ended'; return; }
    const totalMins = Math.floor(msLeft / 60000);
    const days = Math.floor(totalMins / 1440);
    const hrs = Math.floor((totalMins % 1440) / 60);
    const mins = totalMins % 60;
    if (days > 0) el.textContent = `${days}d ${String(hrs).padStart(2,'0')}h ${String(mins).padStart(2,'0')}m`;
    else if (hrs > 0) el.textContent = `${String(hrs).padStart(2,'0')}h ${String(mins).padStart(2,'0')}m`;
    else el.textContent = `${String(mins).padStart(2,'0')}m`;
    const timerRow = el.closest('.listing-timer');
    if (timerRow && totalMins < 120) timerRow.classList.add('listing-timer-urgent');
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    const total = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    container.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.disabled = currentPage === 1;
    prev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
    prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; refresh(); } });
    container.appendChild(prev);

    const maxPages = Math.min(total, 7);
    let startP = Math.max(1, currentPage - 3);
    let endP = Math.min(total, startP + maxPages - 1);
    if (endP - startP < maxPages - 1) startP = Math.max(1, endP - maxPages + 1);

    for (let i = startP; i <= endP; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-num' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => { currentPage = i; refresh(); });
        container.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.disabled = currentPage === total;
    next.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
    next.addEventListener('click', () => { if (currentPage < total) { currentPage++; refresh(); } });
    container.appendChild(next);
}

function updateCount() {
    const el = document.getElementById('resultsCount');
    if (!el) return;
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);
    el.textContent = filteredData.length
        ? `Showing ${start}–${end} of ${filteredData.length} Vehicles`
        : 'No vehicles found';
}

function refresh() {
    renderCards(currentPage);
    renderPagination();
    updateCount();
    const section = document.querySelector('.inventory-section');
    if (section) window.scrollTo({ top: section.offsetTop - 120, behavior: 'smooth' });
}

// Global timer tick
setInterval(() => {
    document.querySelectorAll('.auction-timer[data-end]').forEach(el => {
        updateTimer(el, parseFloat(el.dataset.end));
    });
}, 60000);

document.addEventListener('DOMContentLoaded', () => {
    // Category tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const cat = this.dataset.cat;
            filteredData = cat === 'all' ? [...ALL_INVENTORY] : ALL_INVENTORY.filter(c => c.cat === cat);
            currentPage = 1;
            refresh();
        });
    });

    // Search / filter
    document.getElementById('applyFilters')?.addEventListener('click', () => {
        const type = document.getElementById('filterType')?.value;
        const make = document.getElementById('filterMake')?.value.toLowerCase();
        const price = document.getElementById('filterPrice')?.value;

        filteredData = ALL_INVENTORY.filter(car => {
            if (type && car.cat !== type) return false;
            if (make && !car.make.toLowerCase().includes(make)) return false;
            if (price) {
                const b = car.bid;
                if (price === '0-20m' && b >= 20000000) return false;
                if (price === '20m-40m' && (b < 20000000 || b >= 40000000)) return false;
                if (price === '40m-60m' && (b < 40000000 || b >= 60000000)) return false;
                if (price === '60m+' && b < 60000000) return false;
            }
            return true;
        });
        currentPage = 1;
        refresh();
    });

    // Sort
    const originalOrder = [...ALL_INVENTORY];
    document.getElementById('sortBy')?.addEventListener('change', function () {
        const val = this.value;
        if (val === 'featured') {
            filteredData = filteredData.sort((a, b) => originalOrder.indexOf(a) - originalOrder.indexOf(b));
        } else if (val === 'price-asc') {
            filteredData = [...filteredData].sort((a, b) => a.bid - b.bid);
        } else if (val === 'price-desc') {
            filteredData = [...filteredData].sort((a, b) => b.bid - a.bid);
        } else if (val === 'year-desc') {
            filteredData = [...filteredData].sort((a, b) => b.year - a.year);
        } else if (val === 'mileage-asc') {
            filteredData = [...filteredData].sort((a, b) => parseInt(a.mileage) - parseInt(b.mileage));
        }
        currentPage = 1;
        refresh();
    });

    // View toggle
    const invGrid = document.getElementById('inventoryGrid');
    document.getElementById('gridView')?.addEventListener('click', () => {
        invGrid?.classList.remove('list-view');
        document.getElementById('gridView')?.classList.add('active');
        document.getElementById('listView')?.classList.remove('active');
    });
    document.getElementById('listView')?.addEventListener('click', () => {
        invGrid?.classList.add('list-view');
        document.getElementById('listView')?.classList.add('active');
        document.getElementById('gridView')?.classList.remove('active');
    });

    refresh();
});
