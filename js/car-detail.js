/**
 * DirecTokunbo - Car Detail Page
 * Loads vehicle data from shared inventory and populates the detail page.
 */

// ===== SHARED INVENTORY DATA (mirrors inventory.js) =====
const baseModels = [
    { make: 'Toyota',        model: 'Highlander XSE',      image: 'assets/images/toyota-highlander.jpg', cat: 'suv',     grade: 4, engine: '2.4L Turbo I4', transmission: 'Automatic', fuel: 'Petrol', drive: 'AWD', color: 'Pearl White', interior: 'Black Leather', features: ['Sunroof', 'Apple CarPlay', 'Blind Spot Monitor', 'Heated Seats'] },
    { make: 'Lexus',         model: 'RX 350 F-Sport',      image: 'assets/images/lexus-rx.jpg',          cat: 'suv',     grade: 5, engine: '3.5L V6',      transmission: 'Automatic', fuel: 'Petrol', drive: 'AWD', color: 'Sonic Titanium', interior: 'Red Leather',   features: ['Mark Levinson Audio', 'HUD', 'Adaptive Cruise', '360° Camera'] },
    { make: 'BMW',           model: 'X5 xDrive40i',        image: 'assets/images/bmw-x5.jpg',            cat: 'suv',     grade: 4, engine: '3.0L TwinPower', transmission: 'Automatic', fuel: 'Petrol', drive: 'xDrive AWD', color: 'Alpine White', interior: 'Cognac Leather', features: ['Panoramic Roof', 'Harman Kardon', 'Active Suspension', 'Night Vision'] },
    { make: 'Mercedes-Benz', model: 'GLE 450 4MATIC',      image: 'assets/images/mercedes-gle.jpg',      cat: 'suv',     grade: 5, engine: '3.0L EQ Boost', transmission: 'Automatic', fuel: 'Mild Hybrid', drive: '4MATIC AWD', color: 'Obsidian Black', interior: 'Nappa Leather', features: ['MBUX Display', 'Burmester Audio', 'Air Suspension', '360° Camera'] },
    { make: 'Audi',          model: 'Q7 55 TFSI quattro',  image: 'assets/images/audi-q7.jpg',           cat: 'suv',     grade: 4, engine: '3.0L TFSI V6',  transmission: 'Tiptronic',  fuel: 'Petrol', drive: 'quattro AWD', color: 'Glacier White', interior: 'Valcona Leather', features: ['Virtual Cockpit', 'Bang & Olufsen', 'Air Suspension', 'Massage Seats'] },
    { make: 'Land Rover',    model: 'Defender 110 SE',     image: 'assets/images/land-rover-defender.jpg', cat: 'suv',   grade: 5, engine: '3.0L MHEV I6',  transmission: 'Automatic', fuel: 'Mild Hybrid', drive: 'AWD', color: 'Pangea Green', interior: 'Ebony Leather', features: ['Terrain Response', 'Meridian Audio', 'Wade Sensing', 'ClearSight Mirror'] },
    { make: 'Toyota',        model: 'Camry XSE V6',        image: 'assets/images/toyota-highlander.jpg', cat: 'sedan',   grade: 4, engine: '3.5L V6',      transmission: 'Automatic', fuel: 'Petrol', drive: 'FWD', color: 'Midnight Black', interior: 'Black SofTex', features: ['JBL Audio', 'Head-Up Display', 'Wireless Charging', 'Safety Sense 2.5'] },
    { make: 'Honda',         model: 'Accord Sport 2.0T',   image: 'assets/images/inventory-4.jpg',       cat: 'sedan',   grade: 3, engine: '2.0L Turbo',   transmission: 'Automatic', fuel: 'Petrol', drive: 'FWD', color: 'Sonic Gray', interior: 'Black Leather', features: ['Honda Sensing', 'Wireless CarPlay', 'Bose Audio', 'Sport Mode'] },
    { make: 'Mercedes-Benz', model: 'C300 4MATIC',         image: 'assets/images/mercedes-gle.jpg',      cat: 'sedan',   grade: 5, engine: '2.0L Turbo I4', transmission: 'Automatic', fuel: 'Petrol', drive: '4MATIC AWD', color: 'Polar White', interior: 'Artico Leather', features: ['MBUX Infotainment', 'Burmester Surround', 'PRE-SAFE', 'AMG Line'] },
    { make: 'BMW',           model: '3 Series 330i',       image: 'assets/images/bmw-x5.jpg',            cat: 'sedan',   grade: 4, engine: '2.0L TwinPower', transmission: 'Automatic', fuel: 'Petrol', drive: 'RWD', color: 'Portimao Blue', interior: 'SensaTec',     features: ['Curved Display', 'Parking Assistant', 'M Sport Package', 'ConnectedDrive'] },
    { make: 'Nissan',        model: 'Patrol Platinum V8',  image: 'assets/images/inventory-3.jpg',       cat: 'suv',     grade: 4, engine: '5.6L V8',      transmission: 'Automatic', fuel: 'Petrol', drive: '4WD', color: 'Hermosa Blue', interior: 'Semi-Aniline Leather', features: ['Bose Audio Premium', 'Around View Monitor', 'Hydraulic Body Motion', 'Tri-Zone Climate'] },
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

const rnd = (min, max, seed) => {
    // Seeded random for consistent results given same ID
    const x = Math.sin(seed + min + max) * 10000;
    return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
};
const seededPick = (arr, seed) => arr[rnd(0, arr.length - 1, seed)];

function getVehicleById(id) {
    const i = id - 1;
    const base = baseModels[i % baseModels.length];
    const seed = id * 137.5;
    const year = 2020 + (id % 6);
    const mileage = 2000 + ((id * 1847) % 73001);
    const bidBase = 12000000 + ((id * 2341789) % 63000001);
    const bid = Math.round(bidBase / 500000) * 500000;
    const cif = Math.round((bid * (108 + (id % 10)) / 100) / 500000) * 500000;
    const hoursLeft = 6 + ((id * 37) % 195);

    return {
        id,
        lot: 'DT-' + String(4000 + i + 1).padStart(5, '0'),
        make: base.make,
        model: base.model,
        year,
        image: base.image,
        cat: base.cat,
        grade: base.grade,
        mileage: mileage.toLocaleString() + ' km',
        location: seededPick(locations, seed),
        bid,
        cif,
        cond: seededPick(conditions, seed + 1),
        badge: ['Hot', 'New', 'Deal', '', '', ''][id % 6],
        hoursLeft,
        engine: base.engine,
        transmission: base.transmission,
        fuel: base.fuel,
        drive: base.drive,
        color: base.color,
        interior: base.interior,
        features: base.features,
    };
}

const fmtPrice = (n) => '₦' + n.toLocaleString();

function buildStars(grade) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += i <= grade ? '★' : '<span class="grade-empty">★</span>';
    }
    return s;
}

function updateTimer(el, hoursLeft) {
    const end = Date.now() + hoursLeft * 3600 * 1000;
    function tick() {
        const ms = end - Date.now();
        if (ms <= 0) { el.textContent = 'Ended'; return; }
        const d = Math.floor(ms / 86400000);
        const h = Math.floor((ms % 86400000) / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        el.textContent = d > 0 ? `${d}d ${h}h ${String(m).padStart(2,'0')}m` : `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
        setTimeout(tick, 1000);
    }
    tick();
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    const car = getVehicleById(id);

    // Page title
    document.title = `${car.year} ${car.make} ${car.model} — DirecTokunbo`;
    document.getElementById('pageTitle').textContent = `${car.year} ${car.make} ${car.model} — DirecTokunbo`;

    // Breadcrumb
    document.getElementById('breadcrumbCar').textContent = `${car.year} ${car.make} ${car.model}`;

    // Main image
    document.getElementById('mainImage').src = car.image;
    document.getElementById('mainImage').alt = `${car.year} ${car.make} ${car.model}`;

    // Thumbnails (use available images as gallery simulation)
    const thumbImages = [car.image, 'assets/images/inventory-1.jpg', 'assets/images/inventory-2.jpg', 'assets/images/inventory-3.jpg'];
    const thumbContainer = document.getElementById('thumbGallery');
    thumbImages.forEach((src, idx) => {
        const div = document.createElement('div');
        div.className = 'detail-thumb' + (idx === 0 ? ' active' : '');
        div.innerHTML = `<img src="${src}" alt="View ${idx + 1}" loading="lazy">`;
        div.addEventListener('click', () => {
            document.getElementById('mainImage').src = src;
            thumbContainer.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
            div.classList.add('active');
        });
        thumbContainer.appendChild(div);
    });

    // Badges
    document.getElementById('detailLot').textContent = `LOT #${car.lot}`;
    const badgeEl = document.getElementById('detailBadge');
    if (car.badge) {
        badgeEl.textContent = car.badge;
        badgeEl.className = `listing-badge badge-${car.badge.toLowerCase()}`;
        badgeEl.style.display = '';
    }

    // Grade
    document.getElementById('detailStars').innerHTML = buildStars(car.grade);
    document.getElementById('detailGradeLabel').textContent = `Grade ${car.grade} / 5`;
    document.getElementById('crStars').innerHTML = buildStars(car.grade);
    document.getElementById('crGradeLabel').textContent = `Grade ${car.grade} / 5`;

    // Title
    document.getElementById('detailTitle').textContent = `${car.year} ${car.make} ${car.model}`;

    // Wire Place Bid button to WhatsApp
    const bidBtn = document.querySelector('.detail-bid-btn');
    if (bidBtn) {
        bidBtn.href = `https://wa.me/2348036758830?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (LOT #${car.lot}) listed at ${fmtPrice(car.bid)} CIF Lagos. Please share more details.`)}`;
        bidBtn.target = '_blank';
        bidBtn.rel = 'noopener noreferrer';
    }
    document.getElementById('detailSubtitle').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${car.location}
        <span style="opacity:0.4">•</span>
        <span class="condition-badge ${car.cond.cls}">${car.cond.label}</span>
    `;

    // Timer
    const timerEl = document.getElementById('detailTimer');
    updateTimer(timerEl, car.hoursLeft);

    // Pricing
    const customs = Math.round(car.cif * 0.20 / 500000) * 500000;
    const total = car.cif + customs;
    document.getElementById('dpBid').textContent = fmtPrice(car.bid);
    document.getElementById('dpCif').textContent = fmtPrice(car.cif);
    document.getElementById('dpCustoms').textContent = `~${fmtPrice(customs)}`;
    document.getElementById('dpTotal').textContent = `~${fmtPrice(total)}`;

    // Specs table
    document.getElementById('specMake').textContent = car.make;
    document.getElementById('specModel').textContent = car.model;
    document.getElementById('specYear').textContent = car.year;
    document.getElementById('specEngine').textContent = car.engine;
    document.getElementById('specTransmission').textContent = car.transmission;
    document.getElementById('specFuel').textContent = car.fuel;
    document.getElementById('specDrive').textContent = car.drive;
    document.getElementById('specMileage').textContent = car.mileage;
    document.getElementById('specColor').textContent = car.color;
    document.getElementById('specInterior').textContent = car.interior;
    document.getElementById('specLocation').textContent = car.location;
    document.getElementById('specCondition').textContent = car.cond.label;
    document.getElementById('specLot').textContent = `#${car.lot}`;

    // Features
    const featList = document.getElementById('featuresList');
    car.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featList.appendChild(li);
    });

    // Watch button
    const watchBtn = document.querySelector('.detail-watch');
    watchBtn?.addEventListener('click', () => watchBtn.classList.toggle('active'));

    // Current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Header scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.pageYOffset > 60);
    }, { passive: true });

    // Mobile nav
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            mainNav?.classList.toggle('active');
        });
    }
});
