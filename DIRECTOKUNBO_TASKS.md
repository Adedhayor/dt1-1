# DirecTokunbo — Claude Code Task List

> **Context:** This is a static Vite site (HTML/CSS/JS, no framework) for a Nigerian car import business sourcing vehicles from China. The site is deployed to GitHub Pages at `www.directokunbo.com`. The codebase consists of `index.html` (homepage), `inventory.html` (inventory page), `css/style.css`, `js/main.js`, and `js/inventory.js`.
>
> **Stack:** Vanilla HTML/CSS/JS, Vite for bundling, deployed via GitHub Actions to GitHub Pages.
>
> **Goal:** Execute every task below in order. Each task is a self-contained job. Commit after completing each phase.

---

## PHASE 1 — Lead Capture (Critical Path)

These tasks directly determine whether the site generates business or not. Nothing else matters until these work.

### Task 1.1 — Wire "Place Bid" and "Buy Now" buttons to WhatsApp

**Files:** `index.html`, `inventory.html`, `js/inventory.js`

**Job:** When a user clicks "Place Bid" or "Buy Now" on any car card, open WhatsApp with a pre-filled message containing the car details.

**Instructions:**
1. On `index.html`, find every `.card-actions` button pair inside each `<article class="car-card">`.
2. Replace each `<button class="btn btn-primary btn-sm">Place Bid</button>` with an `<a>` tag that links to `https://wa.me/2348036758830?text=` with a URL-encoded message like: `Hi, I'm interested in the [YEAR] [MAKE] [MODEL] ([PRICE]). Please share more details.`
3. Replace each `<button class="btn btn-outline btn-sm">Buy Now</button>` with an `<a>` tag linking to `https://wa.me/2348036758830?text=` with: `Hi, I'd like to buy the [YEAR] [MAKE] [MODEL] ([PRICE]). What are the next steps?`
4. In `js/inventory.js`, update the `cardHtml` template inside `renderInventory()` to use the same `<a>` pattern with dynamic car data interpolated into the WhatsApp URL. Use `encodeURIComponent()` for the message text.
5. Style the `<a>` tags identically to the existing buttons (they should still have `class="btn btn-primary btn-sm"` and `class="btn btn-outline btn-sm"`).
6. Ensure both `<a>` tags have `target="_blank"` and `rel="noopener noreferrer"`.

### Task 1.2 — Add floating WhatsApp button

**Files:** `index.html`, `inventory.html`, `css/style.css`

**Job:** Add a persistent floating WhatsApp button in the bottom-right corner of every page.

**Instructions:**
1. Add the following HTML just before `</body>` in both `index.html` and `inventory.html`:
   ```html
   <a href="https://wa.me/2348036758830?text=Hi%2C%20I%27m%20interested%20in%20importing%20a%20car.%20Can%20you%20help%3F"
      class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
     <svg viewBox="0 0 24 24" fill="currentColor">
       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
     </svg>
   </a>
   ```
2. Add CSS to `css/style.css`:
   - Fixed position, `bottom: 24px`, `right: 24px`, `z-index: 999`.
   - `width: 56px`, `height: 56px`, `border-radius: 50%`, `background: #25D366`, `color: white`.
   - Flex centered. SVG inside is `28px × 28px`.
   - Hover: `transform: scale(1.1)`, `box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4)`.
   - Add a subtle pulse animation on page load that plays twice then stops (draws attention without being annoying).

### Task 1.3 — Connect contact form to Web3Forms

**Files:** `index.html`, `js/main.js`

**Job:** Replace the fake `setTimeout` form submission with a real API call to Web3Forms (free, no-signup-needed email forwarding).

**Instructions:**
1. In `index.html`, add a hidden input to the contact form: `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">`. Leave the value as a placeholder — the site owner will replace it with their actual key from https://web3forms.com.
2. Add another hidden input: `<input type="hidden" name="subject" value="New DirecTokunbo Lead">`.
3. In `js/main.js`, replace the entire contact form `setTimeout` simulation block with a real `fetch` POST to `https://api.web3forms.com/submit`:
   - Collect form data with `new FormData(this)`.
   - Convert to JSON: `Object.fromEntries(formData)`.
   - POST with `Content-Type: application/json`.
   - On success (response.ok): show the existing success UI (green button, "Message Sent!"), then reset.
   - On failure: show an error state — button turns red, text says "Failed — Try Again", re-enable after 2 seconds.
4. Keep the loading spinner animation during the fetch.
5. Remove the `alert()` call — use the in-button feedback only.
6. Remove `console.log` statements related to form submission.

---

## PHASE 2 — Functional Integrity

These tasks fix features that exist visually but don't actually work.

### Task 2.1 — Parse URL search params on inventory page

**Files:** `js/inventory.js`

**Job:** When a user searches from the homepage (e.g., `inventory.html?type=suv&make=toyota&price=10m-20m`), the inventory page should filter results accordingly.

**Instructions:**
1. After `generateInventory()` is called, read URL params with `new URLSearchParams(window.location.search)`.
2. Filter `inventoryData` based on the params:
   - `type`: Not currently stored on inventory items — add a `type` field to the data generator. Map makes to types: Toyota Highlander → SUV, Mercedes C300 → Sedan, etc.
   - `make`: Match against `car.make.toLowerCase()`.
   - `price`: Parse the range strings (`0-5m` → 0 to 5000000, `5m-10m` → 5000000 to 10000000, `10m-20m` → 10000000 to 20000000, `20m+` → 20000000+) and filter.
3. Store the filtered data in a variable (e.g., `filteredData`) and use that for pagination and rendering instead of `inventoryData`.
4. Update the results count text to reflect filtered results.
5. If filters produce 0 results, show the existing empty state.

### Task 2.2 — Wire up sort dropdown

**Files:** `js/inventory.js`

**Job:** Make the "Sort by" dropdown actually sort the inventory.

**Instructions:**
1. Add an event listener on `#sortBy` select element.
2. On change, sort the `filteredData` (or `inventoryData` if no filters) array:
   - "Sort by: Featured" → default/original order.
   - "Price: Low to High" → sort by `car.price` ascending.
   - "Price: High to Low" → sort by `car.price` descending.
   - "Year: Newest" → sort by `car.year` descending.
   - "Mileage: Lowest" → sort by parsed mileage number ascending.
3. After sorting, reset `currentPage` to 1, re-render inventory and pagination.

### Task 2.3 — Make inventory data deterministic

**Files:** `js/inventory.js`

**Job:** Replace `Math.random()` with a seeded PRNG so the same cars appear on every page load.

**Instructions:**
1. Implement a simple seeded random function (mulberry32 or similar) at the top of `inventory.js`:
   ```js
   function seededRandom(seed) {
     return function() {
       seed |= 0; seed = seed + 0x6D2B79F5 | 0;
       var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
       t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
       return ((t ^ t >>> 14) >>> 0) / 4294967296;
     };
   }
   const rand = seededRandom(42);
   ```
2. Replace all instances of `Math.random()` in `randomItem()` and `randomInt()` with calls to `rand()`.
3. This ensures the same 120 cars generate every time, so users see consistent listings across visits.

### Task 2.4 — Differentiate "Import" and "Auction" nav links

**Files:** `index.html`, `inventory.html`

**Job:** The two nav items currently go to the same place. Differentiate them.

**Instructions:**
1. Change the nav structure:
   - "Import" → links to `inventory.html` (browse all vehicles).
   - "Auction" → links to `inventory.html?sort=ending` (could show auction-style listings). For now, just add a param that the inventory page can optionally read later.
   - OR: Simpler — rename "Import" to "Inventory" and "Auction" to "How It Works", linking to `#how-it-works` on `index.html`. This avoids two identical links.
2. Apply the same change in both `index.html` and `inventory.html` navigation, and in both footers.
3. Pick whichever option makes the nav feel like 3 distinct destinations. The current duplication signals "unfinished."

### Task 2.5 — Fix dead footer links

**Files:** `index.html`, `inventory.html`

**Job:** "Shipping Guide" and "Customs Info" links go to `#` (nowhere).

**Instructions:**
1. For now, change both links to point to `index.html#faqs` since the FAQ section covers shipping and customs questions.
2. Add a `title` attribute: `title="See our FAQ for shipping and customs details"`.
3. This is a temporary solution — real pages can be built later.

---

## PHASE 3 — Trust & Content

These tasks address the credibility gap that prevents conversion.

### Task 3.1 — Add a cost breakdown section

**Files:** `index.html`, `css/style.css`

**Job:** Add a visual cost breakdown between the "How It Works" and "Why Us" sections showing what total import cost looks like.

**Instructions:**
1. Create a new section with class `section pricing-breakdown` and id `pricing`.
2. Section badge: "Transparent Pricing". Title: "Know Exactly What You're Paying". Subtitle: "No hidden fees. Here's a real example of total import cost."
3. Create a single card (`.breakdown-card`) with a sample breakdown:
   - Vehicle Price (Auction): ₦25,000,000
   - Shipping (China → Lagos): ₦2,500,000
   - Customs Duty & Clearing: ₦3,200,000
   - DirecTokunbo Service Fee: ₦1,500,000
   - **Total Landed Cost: ₦32,200,000**
4. Style as a dark card with gold accent on the total line. Each line item is a flex row with label left, price right, and a subtle separator line between rows.
5. Add a small note below: "Actual costs vary by vehicle type, engine size, and current duty rates. Contact us for a personalized quote."
6. Add `data-animate="fade-up"` to the section elements.

### Task 3.2 — Add social proof / trust signals

**Files:** `index.html`, `css/style.css`

**Job:** Add a trust strip between the hero and inventory sections with key stats.

**Instructions:**
1. Create a section with class `trust-strip` — no section-header, just a horizontal row of 3-4 stats.
2. Stats to display:
   - "200+ Vehicles Imported" (or whatever number is real/aspirational)
   - "6-10 Week Delivery"
   - "₦0 Hidden Fees"
   - "24/7 WhatsApp Support"
3. Style as a narrow horizontal band with `background: var(--color-bg-elevated)`, `border-top` and `border-bottom` using `var(--color-border)`.
4. Each stat: large bold number/text on top, small muted label below. Centered. Flex row with even spacing.
5. Add `data-animate="fade-up"` attributes.

### Task 3.3 — Add 3 more FAQ questions

**Files:** `index.html`

**Job:** Add questions that address the biggest buyer objections.

**Instructions:**
1. Add these accordion items after the existing 5, following the exact same HTML pattern:
   - **"What happens if my car arrives damaged?"**
     Answer: "Every vehicle is insured during transit. If any damage occurs during shipping, our insurance covers repairs or replacement. We also conduct a thorough inspection at the Lagos port before handover and share photos with you. Your satisfaction is guaranteed."
   - **"What is the total cost beyond the listed price?"**
     Answer: "The listed price is the vehicle auction price. Additional costs include shipping (typically ₦2-3M depending on vehicle size), customs duty and clearing (varies by engine size and vehicle age), and our service fee. We provide a complete cost breakdown before you commit — no surprises."
   - **"Can I see the car's condition before buying?"**
     Answer: "Yes. Every vehicle comes with detailed inspection photos, a condition report, and where available, a video walkthrough. We can also arrange a live video call with our team on the ground in China so you can inspect the vehicle in real-time before bidding."
2. Add appropriate `data-delay` values (350, 400, 450) continuing the existing pattern.

### Task 3.4 — Fix brand name inconsistency

**Files:** `index.html`, `inventory.html`, `js/main.js`

**Job:** Standardize the brand name to "DirecTokunbo" everywhere (one T, capital T in Tokunbo).

**Instructions:**
1. Search all files for "DirectTokunbo" (two T's) and replace with "DirecTokunbo".
2. In `js/main.js`, the console log says "DirectTokunbo" — fix to "DirecTokunbo".
3. Also fix the console.log tagline from "Import quality cars from China to Nigeria" to "Import Quality Cars from China to Nigeria" (match the hero title casing).
4. Check `alt` attributes on logo images — standardize to `alt="DirecTokunbo"`.

---

## PHASE 4 — CSS & Visual Polish

### Task 4.1 — Clean up CSS duplication and specificity issues

**Files:** `css/style.css`

**Job:** Fix structural CSS issues without changing visual appearance.

**Instructions:**
1. Remove the duplicate `.car-card` rule block (there are two — one inside carousel section, one standalone). Merge into one.
2. Move the inventory page styles (`.inventory-toolbar`, `.pagination`, `.view-toggle`, `.page-num`, `.page-btn`, `.sort-select`, `.sort-wrapper`, `.inventory-grid`, `.empty-state`) OUT of the `@media (max-width: 991px)` block where they're incorrectly nested. These are global styles that should be at the root level, with only their responsive overrides inside media queries.
3. Remove all `!important` declarations from the pagination section at the bottom of the file. If specificity conflicts arise, increase specificity with a parent selector (e.g., `.pagination .page-num`) rather than using `!important`.
4. Remove the duplicate `FINAL POLISH` and `RESTORED` comment sections — integrate those styles into the canonical rule blocks.

### Task 4.2 — Fix contrast issue on subtle text

**Files:** `css/style.css`

**Job:** Ensure all text meets WCAG AA contrast ratio (4.5:1 for normal text).

**Instructions:**
1. Change `--color-text-subtle: #6b7280` to `--color-text-subtle: #8b919a`. This brings the contrast ratio from ~4.0:1 to ~5.2:1 against the `#0a0a0a` background.
2. Verify no other color variables fall below 4.5:1 ratio against their typical background.

### Task 4.3 — Add touch feedback on cards

**Files:** `css/style.css`

**Job:** Add `:active` state for car cards on touch devices.

**Instructions:**
1. Add this rule:
   ```css
   .car-card:active {
     transform: scale(0.98);
     transition-duration: 0.1s;
   }
   ```
2. This gives mobile users immediate feedback when tapping a card.

### Task 4.4 — Add badge style for "Deal" and "Sold"

**Files:** `css/style.css`

**Job:** The inventory generator creates "Deal" and "Sold" badges but there are no CSS classes for them.

**Instructions:**
1. Add:
   ```css
   .badge-deal {
     background: var(--color-primary);
     color: #000;
   }
   .badge-sold {
     background: var(--color-text-subtle);
     color: white;
     opacity: 0.8;
   }
   ```
2. For "Sold" cards, consider also adding a semi-transparent overlay on the card image to visually indicate unavailability. Add this rule:
   ```css
   .car-card:has(.badge-sold) .card-image::after {
     content: '';
     position: absolute;
     inset: 0;
     background: rgba(0, 0, 0, 0.5);
   }
   .car-card:has(.badge-sold) .card-actions .btn {
     pointer-events: none;
     opacity: 0.5;
   }
   ```

---

## PHASE 5 — Performance & Engineering

### Task 5.1 — Remove unused Motion One CDN

**Files:** `index.html`

**Job:** The Motion One library (~15KB) is loaded but never used. The site uses a custom IntersectionObserver instead.

**Instructions:**
1. Remove this line from `index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/motion@10.16.2/dist/motion.min.js"></script>
   ```
2. Verify the scroll animations still work (they use the custom observer in `main.js`, not Motion One).

### Task 5.2 — Add image error fallbacks

**Files:** `js/main.js`, `js/inventory.js`, `css/style.css`

**Job:** If a car image fails to load (404), show a fallback instead of a broken image icon.

**Instructions:**
1. In `css/style.css`, add a fallback background to `.card-image`:
   ```css
   .card-image {
     background: var(--color-bg-elevated);
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .card-image img[src=""],
   .card-image img:not([src]) {
     display: none;
   }
   ```
2. In `js/inventory.js`, add `onerror="this.style.display='none'"` to the `<img>` tag in the card template. Or better — add a global error handler at the bottom of `main.js`:
   ```js
   document.addEventListener('error', function(e) {
     if (e.target.tagName === 'IMG' && e.target.closest('.card-image')) {
       e.target.style.display = 'none';
     }
   }, true);
   ```

### Task 5.3 — Preload critical assets

**Files:** `index.html`, `inventory.html`

**Job:** Improve LCP by preloading the hero image and primary font.

**Instructions:**
1. In the `<head>` of `index.html`, add:
   ```html
   <link rel="preload" as="image" href="assets/images/hero-poster.jpg">
   <link rel="preload" as="font" type="font/woff2" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2" crossorigin>
   ```
2. In `inventory.html`, preload the hero poster similarly.
3. Note: The exact font URL may change — check the network tab for the actual woff2 file being loaded and use that.

### Task 5.4 — Remove console branding

**Files:** `js/main.js`

**Job:** Remove the styled console.log branding — it's noise in production.

**Instructions:**
1. Delete the entire "CONSOLE BRANDING" section:
   ```js
   console.log('%c 🚗 DirectTokunbo ', ...);
   console.log('Import quality cars from China to Nigeria');
   ```

### Task 5.5 — Properly integrate JS with Vite

**Files:** `index.html`, `inventory.html`, `js/main.js`, `js/inventory.js`

**Job:** Convert script tags to ES module imports so Vite can properly bundle, hash, and tree-shake.

**Instructions:**
1. In `index.html`, change `<script src="js/main.js"></script>` to `<script type="module" src="js/main.js"></script>`.
2. In `inventory.html`, change both script tags to `type="module"`. In `js/inventory.js`, if it needs anything from `main.js`, import it. Otherwise keep them separate — Vite will handle both as entry points.
3. Remove the Motion One `<script>` tag (per Task 5.1).
4. Test with `npm run dev` and `npm run build` to ensure both pages still work.

---

## PHASE 6 — Quick Wins & Micro-Fixes

### Task 6.1 — Fix favicon

**Files:** `index.html`, `inventory.html`

**Job:** The logo PNG is used as a favicon and will be illegible at small sizes.

**Instructions:**
1. For now, keep the PNG favicon but add a `sizes` attribute: `<link rel="icon" type="image/png" sizes="32x32" href="assets/images/logo.png">`.
2. Add a comment: `<!-- TODO: Create a simplified 32x32 favicon mark -->`.
3. This is a low-priority cosmetic fix — the real solution is creating a simplified icon, but that requires design work.

### Task 6.2 — Set current year dynamically (already works, verify)

**Files:** `js/main.js`

**Job:** Verify the `#currentYear` span is set on both pages.

**Instructions:**
1. Confirm that `js/main.js` (which runs on both pages) sets `$('#currentYear').textContent = new Date().getFullYear()`.
2. Confirm both HTML files have `<span id="currentYear">2026</span>` — the 2026 is a fallback if JS fails.
3. No changes needed if both are already correct.

### Task 6.3 — Add `rel="noopener noreferrer"` to all external links

**Files:** `index.html`, `inventory.html`

**Job:** Security best practice for all `target="_blank"` links.

**Instructions:**
1. Search both HTML files for `target="_blank"`.
2. Ensure every instance also has `rel="noopener noreferrer"`.
3. The social links in the footer already have this — verify no others are missing.

---

## Post-Completion Checklist

After all phases are done, run through this:

- [ ] `npm run dev` — both pages load without console errors
- [ ] `npm run build` — builds successfully to `dist/`
- [ ] All "Place Bid" / "Buy Now" buttons open WhatsApp with correct pre-filled text
- [ ] WhatsApp float button visible on both pages, links correctly
- [ ] Contact form shows loading state, handles success/failure (will fail until access_key is set — that's expected)
- [ ] Inventory page: searching from homepage with params filters results
- [ ] Inventory page: sort dropdown re-orders cards
- [ ] Inventory page: same cars appear on every page load (deterministic)
- [ ] No `!important` in CSS (except vendor-prefix edge cases)
- [ ] No unused JS libraries loaded
- [ ] Brand name is "DirecTokunbo" everywhere
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] No `console.log` statements in production code (except form error handling)
