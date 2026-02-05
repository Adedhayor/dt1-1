/**
 * DirecTokunbo - Inventory Management
 * Handles data rendering, pagination, and dynamic interactions for the Inventory Page.
 */

document.addEventListener('DOMContentLoaded', () => {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const paginationContainer = document.querySelector('.pagination');
    const resultsCount = document.querySelector('.results-count');

    if (!inventoryGrid) return;

    // --- Configuration ---
    const TARGET_COUNT = 120;
    const ITEMS_PER_PAGE = 40;

    // --- Data Sources (Verified Assets) ---
    const baseModels = [
        { make: 'Lexus', model: 'RX 350', image: 'assets/images/lexus-rx.jpg' },
        { make: 'Lexus', model: 'RX 450h', image: 'assets/images/lexus-rx.jpg' },
        { make: 'BMW', model: 'X5 xDrive40i', image: 'assets/images/bmw-x5.jpg' },
        { make: 'Audi', model: 'Q7 Premium', image: 'assets/images/audi-q7.jpg' },
        { make: 'Land Rover', model: 'Defender 110', image: 'assets/images/land-rover-defender.jpg' },
        { make: 'Mercedes-Benz', model: 'GLE 450', image: 'assets/images/mercedes-gle.jpg' },
        { make: 'Toyota', model: 'Highlander', image: 'assets/images/toyota-highlander.jpg' },
        { make: 'Nissan', model: 'Patrol Platinum', image: 'assets/images/inventory-3.jpg' },
        { make: 'Mercedes-Benz', model: 'C300', image: 'assets/images/inventory-4.jpg' }
    ];

    const locations = ['Shenzhen, China', 'Beijing, China', 'Shanghai, China', 'Guangzhou, China', 'Tianjin, China', 'Chengdu, China'];
    const specsPool = ['AWD', '4WD', 'RWD', 'Automatic', 'Petrol', 'Diesel', 'Hybrid', 'Turbo', 'V6', 'V8', 'Quattro', '4MATIC', 'xDrive'];
    const badges = ['Hot', 'New', 'Deal', 'Sold', '', '', '', '']; // Weighted empty

    // --- Helper Functions ---
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const formatPrice = (price) => '₦' + price.toLocaleString();

    // --- Generate Data ---
    const generateInventory = (count) => {
        const data = [];
        for (let i = 1; i <= count; i++) {
            const base = randomItem(baseModels);
            const year = randomInt(2020, 2025);

            // Price variance: Base approx 20M - 80M depending on "luxury" feel (randomized)
            const basePrice = 20000000;
            const price = Math.round((basePrice + randomInt(0, 60000000)) / 100000) * 100000; // Round to nearest 100k

            const mileage = randomInt(1000, 80000).toLocaleString() + ' km';

            // Pick 3 random specs
            const carSpecs = [];
            while (carSpecs.length < 3) {
                const s = randomItem(specsPool);
                if (!carSpecs.includes(s)) carSpecs.push(s);
            }

            data.push({
                id: i,
                make: base.make,
                model: base.model,
                year: year,
                price: price,
                location: randomItem(locations),
                mileage: mileage,
                specs: carSpecs,
                image: base.image,
                badge: randomItem(badges)
            });
        }
        return data;
    };

    const inventoryData = generateInventory(TARGET_COUNT);

    //State
    let currentPage = 1;

    // --- Render Functions ---
    function renderInventory(page = 1) {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedItems = inventoryData.slice(start, end);

        inventoryGrid.innerHTML = '';

        if (paginatedItems.length === 0) {
            inventoryGrid.innerHTML = `
                <div class="empty-state">
                    <p>No vehicles found matching your criteria.</p>
                </div>
            `;
            return;
        }

        paginatedItems.forEach(car => {
            const badgeHtml = car.badge ? `<span class="card-badge badge-${car.badge.toLowerCase()}">${car.badge}</span>` : '';

            const cardHtml = `
                <article class="car-card">
                    <div class="card-image">
                        <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                        ${badgeHtml}
                        <button class="card-favorite" aria-label="Add to favorites">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span class="meta-location">📍 ${car.location}</span>
                            <span class="meta-mileage">${car.mileage}</span>
                        </div>
                        <h3 class="card-title">${car.year} ${car.make} ${car.model}</h3>
                        <div class="card-specs">
                            ${car.specs.map(spec => `<span>${spec}</span>`).join('')}
                        </div>
                        <div class="card-price">
                            <div class="price-current">${formatPrice(car.price)}</div>
                            <div class="price-bid">Current Bid</div>
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-sm">Place Bid</button>
                            <button class="btn btn-outline btn-sm">Buy Now</button>
                        </div>
                    </div>
                </article>
            `;
            inventoryGrid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Update Results Count
        if (resultsCount) {
            resultsCount.textContent = `Showing ${start + 1}-${Math.min(end, inventoryData.length)} of ${inventoryData.length} Vehicles`;
        }

        attachFavoriteListeners();
    }

    function renderPagination() {
        const totalPages = Math.ceil(inventoryData.length / ITEMS_PER_PAGE);
        paginationContainer.innerHTML = '';

        // Prev
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>`;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePage();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            const pageNum = document.createElement('button');
            pageNum.className = `page-num ${i === currentPage ? 'active' : ''}`;
            pageNum.textContent = i;
            pageNum.addEventListener('click', () => {
                currentPage = i;
                updatePage();
            });
            paginationContainer.appendChild(pageNum);
        }

        // Next
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>`;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    function updatePage() {
        renderInventory(currentPage);
        renderPagination();
        window.scrollTo({ top: document.querySelector('.inventory-section').offsetTop - 100, behavior: 'smooth' });
    }

    function attachFavoriteListeners() {
        document.querySelectorAll('.card-favorite').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('active');
                if (this.classList.contains('active')) {
                    this.querySelector('svg').style.fill = 'currentColor';
                    this.style.color = 'var(--color-primary)';
                } else {
                    this.querySelector('svg').style.fill = 'none';
                    this.style.color = '';
                }
            });
        });
    }

    // Initialize
    renderInventory(currentPage);
    renderPagination();
});
