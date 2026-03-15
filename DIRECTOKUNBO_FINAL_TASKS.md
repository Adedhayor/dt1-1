# DirecTokunbo — Final Task List

> **Run all tasks in order. Commit after each phase.**

---

## PHASE 0 — Download Real Vehicle Images from Guazi (Chinese Auction Site)

### Task 0.1 — Download car images from en.guazi.com

**Job:** Replace all placeholder/missing car images with real Chinese auction vehicle photos from Guazi (en.guazi.com).

Run this script from the project root:

```bash
#!/bin/bash
# Download real vehicle images from Guazi (Chinese auction site)
# These are actual auction listing photos — perfect for DirecTokunbo

mkdir -p assets/images

# Toyota Highlander (listing 1)
curl -L -o assets/images/toyota-highlander.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x5a875129f0144cb2b3134a4c16c86f041773574748.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Lexus RX / luxury sedan — use the Jaguar XFL (premium sedan, similar vibe)
curl -L -o assets/images/lexus-rx.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206xca201a0e896e46d388c6f3a9eb0cb4e41773390287.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Mercedes GLE — use the VW Teramont X (large SUV, similar class)
curl -L -o assets/images/mercedes-gle.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206xb57c8017cbff4f479010a989d7d1978b1772594710.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# BMW X5 — use the BMW 3 Series (real BMW from Guazi)
curl -L -o assets/images/bmw-x5.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x70ba26271834458798e326977cdb956b1773586702.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Audi Q7 — use the Audi Q5 (real Audi from Guazi)
curl -L -o assets/images/audi-q7.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x43d1c52bead24bac8f336778f59269e51773584953.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Land Rover Defender — use the Lynk & Co 01 (Chinese SUV, similar profile)
curl -L -o assets/images/land-rover-defender.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206xf33e7e5a937c43cf98860f8bed31eb441773563628.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Extra inventory images for the inventory page generator
curl -L -o assets/images/inventory-1.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x849be9e02b3e4cafa0c6d83405cf88411772873009.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-2.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206xafa7dc2af721428ea2f892dc990867aa1773200065.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-3.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x837e649eea4c44cbaba51d589be8a0281773455482.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-4.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x4ea22072bd4344b9b3f6a813372ebb6c1773584625.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Additional variety for inventory.js generator
curl -L -o assets/images/inventory-5.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206xc33894137c914de3b3b22d7a9528531f1773587644.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-6.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x5d94a8dc025c4099a5ff718b90a067b81773582354.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-7.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x2a4df4f96e7d459aba9a8497d24c3ac31773586132.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-8.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x01cd896ab30449428414a7d9b338df611773554878.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

curl -L -o assets/images/inventory-9.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp7206x58d414733b14448b9841825ea5f3fbff1773582301.jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80"

# Cargo ship / logistics image for How It Works section
curl -L -o assets/images/cargo-ship.jpg \
  "https://global-image-pub.guazistatic-global.com/qnbdp1066xa8b6fd7105474e70b12b950d47d90f051768459090.webp"

echo "✅ Downloaded all images. Verify with: ls -la assets/images/"
```

After running, verify all files are non-zero size:
```bash
ls -la assets/images/*.jpg
```

If any download fails (403/404), replace that URL with a different one from the Guazi auction page at `https://en.guazi.com/auction/auction-list/sealed/` — the image URL pattern is always `https://global-image-pub.guazistatic-global.com/qnbdp7206x[hash].jpg?x-bce-process=image/resize,m_fill,w_750,h_500/format,f_jpg/quality,q_80`.

### Task 0.2 — Copy hero video into project

```bash
cp "/Users/Adedayo/Desktop/Antigrvy/hero-background-backup.mp4" assets/videos/hero-bg.mp4
```

Verify the video source in `index.html` matches:
```html
<source src="assets/videos/hero-bg.mp4" type="video/mp4">
```

---

## PHASE 1 — Fix Placeholder Data

### Task 1.1 — Insert Web3Forms access key

**Files:** `index.html`

```
Find:    value="YOUR_WEB3FORMS_ACCESS_KEY"
Replace: value="f8b0819d-070f-49d8-bcde-42ad48ab9872"
```

### Task 1.2 — Replace all placeholder phone numbers

**Files:** `index.html`, `inventory.html`, `car-detail.html`

Only number to use: **+234 803 675 8830**

Search and replace across ALL three files:

```
Find:    href="tel:+2348000000000"
Replace: href="tel:+2348036758830"

Find:    href="https://wa.me/2348000000000"
Replace: href="https://wa.me/2348036758830"

Find:    +234 800 000 0000
Replace: +234 803 675 8830
```

This covers the topbar links, contact info float, and any other instances.

### Task 1.3 — Fix contact info float beside form

**Files:** `index.html`

In the contact section (around line 972-977), the contact info card beside the form shows placeholder data. Update the phone info item to:

```html
<div>
    <strong>Call / WhatsApp</strong>
    <span><a href="tel:+2348036758830">+234 803 675 8830</a></span>
</div>
```

### Task 1.4 — Fix phone input placeholder

**Files:** `index.html`

```
Find:    placeholder="+234 800 000 0000"
Replace: placeholder="+234 803 000 0000"
```

### Task 1.5 — Verify: search all files for any remaining placeholders

Run:
```bash
grep -rn "800 000 0000\|8000000000\|YOUR_WEB3FORMS\|YOUR_ACCESS_KEY" index.html inventory.html car-detail.html
```
Should return zero results.

---

## PHASE 2 — Fix Invisible Listing Cards

The desktop and mobile screenshots show that listing cards 5 (Audi Q7) and 6 (Land Rover Defender) have nearly invisible images — they render as solid black. After Phase 0 downloads new images, this should be resolved. But also add defensive CSS.

### Task 2.1 — Add image error fallback

**Files:** `css/auction.css` (or `css/style.css`), `js/main.js`

Add CSS fallback for broken images:
```css
.listing-img {
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%);
  overflow: hidden;
}
```

Add JS error handler in `main.js` (or whichever JS runs on all pages):
```js
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG' && e.target.closest('.listing-img')) {
    e.target.style.display = 'none';
  }
}, true);
```

### Task 2.2 — Verify all 6 featured listing card images are visible

After downloading images and running `npm run dev`, visually check that all 6 cards in the "Active Auctions" section show their images on both desktop and mobile. None should appear as black boxes.

---

## PHASE 3 — Section-by-Section Verification

Open `localhost:5173/index.html` and scroll the full page. Verify each section renders. For any that DON'T render, inspect in dev tools for `display: none`, `height: 0`, `opacity: 0`, or missing CSS.

Checklist (desktop + mobile):

1. **Topbar** — phone, WhatsApp, "48 Auctions Live", NGN ₦ (desktop only, ok to hide on mobile)
2. **Header** — logo, search bar, nav links, "Get Started" CTA
3. **Category tabs** — 7 tabs, horizontally scrollable on mobile
4. **Hero** — video background (or poster fallback), left copy, right search panel
5. **Auction ticker** — marquee scrolling live bids
6. **Trust strip** — 4 stats row
7. **Featured listings** — 6 cards, all images visible, WhatsApp links working
8. **Stats section** — 4 stat items
9. **How It Works** — 4 step cards (01–04)
10. **Pricing Breakdown** — dark card with line items, gold total
11. **Why Us** — 6 feature cards
12. **Testimonials** — 3 cards with star ratings
13. **FAQ** — accordion expands/collapses on click
14. **Contact** — form left, image card right, real phone number showing
15. **CTA Banner** — gold banner
16. **Footer** — brand, links, socials
17. **WhatsApp float** — bottom-right on all pages

For any broken section, fix in `css/auction.css`. Common issues:
- Missing `display: grid` or `display: flex` on container
- Zero height from collapsed content
- `overflow: hidden` on a parent clipping children
- Missing background making section invisible against dark page

---

## PHASE 4 — Inventory & Car Detail Pages

### Task 4.1 — Verify inventory.html renders

Open `localhost:5173/inventory.html`. Check:
- Cards generated by `inventory.js` display correctly
- Images show (inventory.js references `assets/images/` — verify the filenames match what was downloaded)
- Pagination works
- Sort dropdown works

If `inventory.js` references image filenames that don't exist after the download, update the `baseModels` array image paths to match the actual files:
```js
const baseModels = [
    { make: 'Lexus', model: 'RX 350', image: 'assets/images/lexus-rx.jpg' },
    { make: 'BMW', model: 'X5 xDrive40i', image: 'assets/images/bmw-x5.jpg' },
    { make: 'Audi', model: 'Q7 Premium', image: 'assets/images/audi-q7.jpg' },
    { make: 'Land Rover', model: 'Defender 110', image: 'assets/images/land-rover-defender.jpg' },
    { make: 'Mercedes-Benz', model: 'GLE 450', image: 'assets/images/mercedes-gle.jpg' },
    { make: 'Toyota', model: 'Highlander', image: 'assets/images/toyota-highlander.jpg' },
    { make: 'Nissan', model: 'Patrol Platinum', image: 'assets/images/inventory-3.jpg' },
    { make: 'Mercedes-Benz', model: 'C300', image: 'assets/images/inventory-4.jpg' },
    { make: 'Toyota', model: 'Camry', image: 'assets/images/inventory-2.jpg' },
];
```

### Task 4.2 — Verify car-detail.html renders

Open `localhost:5173/car-detail.html`. Check:
- Page loads without console errors
- `css/car-detail.css` exists and is linked
- If `car-detail.css` doesn't exist, create a minimal one so the page doesn't break

---

## PHASE 5 — Interactivity

### Task 5.1 — Wire category tab filtering on homepage

**Files:** `js/main.js` (or `js/auction.js` if that file exists)

The `.cat-tab` buttons have `data-cat` attributes. Each `.listing-card` has a matching `data-cat`. Wire them:

```js
const catTabs = document.querySelectorAll('.cat-tab');
const listingCards = document.querySelectorAll('.listing-card');

catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    catTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    listingCards.forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});
```

### Task 5.2 — Make auction timers count down

Each `.auction-timer` has `data-hours`. On page load, start a countdown:

```js
document.querySelectorAll('.auction-timer').forEach(timer => {
  const hours = parseInt(timer.dataset.hours);
  const endTime = Date.now() + hours * 3600000;

  function update() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      timer.textContent = 'Ended';
      const timerWrap = timer.closest('.listing-timer');
      if (timerWrap) timerWrap.classList.add('listing-timer-ended');
      return;
    }
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor((remaining % 86400000) / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    timer.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;

    if (remaining < 86400000) {
      timer.closest('.listing-timer')?.classList.add('listing-timer-urgent');
    }
  }

  update();
  setInterval(update, 60000);
});
```

### Task 5.3 — Make listing card images clickable to detail page

Wrap each `.listing-img` content in an anchor:
```html
<a href="car-detail.html?lot=DT-04291" class="listing-img">
  <img ...>
  <span class="listing-lot">...</span>
  ...
</a>
```

Change `.listing-img` from `<div>` to `<a>` for each of the 6 featured cards. Add `display: block` to `.listing-img` in CSS if needed to preserve layout.

### Task 5.4 — Wire header search

The form already has `action="inventory.html"` and `method="get"`. In `inventory.js`, add at the top of the `DOMContentLoaded` handler:

```js
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');
// ... then filter inventoryData where make/model includes searchQuery
```

---

## Final Verification

```bash
# Check no placeholder data remains
grep -rn "800 000 0000\|8000000000\|YOUR_WEB3FORMS\|YOUR_ACCESS_KEY" *.html

# Check all referenced images exist
for img in assets/images/toyota-highlander.jpg assets/images/lexus-rx.jpg \
  assets/images/mercedes-gle.jpg assets/images/bmw-x5.jpg \
  assets/images/audi-q7.jpg assets/images/land-rover-defender.jpg \
  assets/images/inventory-1.jpg assets/images/inventory-2.jpg \
  assets/images/inventory-3.jpg assets/images/inventory-4.jpg; do
  [ -f "$img" ] && echo "✅ $img" || echo "❌ MISSING: $img"
done

# Check video exists
[ -f "assets/videos/hero-bg.mp4" ] && echo "✅ Hero video" || echo "❌ Hero video missing"
```

Visual checklist:
- [ ] All 6 homepage listing cards show real car photos (no black boxes)
- [ ] Hero video plays or poster image shows
- [ ] Phone `+234 803 675 8830` everywhere, no `800 000 0000`
- [ ] Contact form key is `f8b0819d-070f-49d8-bcde-42ad48ab9872`
- [ ] Category tabs filter cards on click
- [ ] Auction timers count down
- [ ] All sections visible on both desktop and mobile
- [ ] WhatsApp float on all pages
- [ ] No console errors
