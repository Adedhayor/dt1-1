# DirecTokunbo — Patch Tasks v3

> **What this covers:** Fixing the ~2 invisible listing card images, replacing placeholder phone/form data, pointing to the correct hero video, and remaining polish.
>
> **Run `npm run dev` after each task to verify.**

---

## PHASE 0 — Data Fixes (2 minutes)

### Task 0.1 — Insert Web3Forms access key

**Files:** `index.html`

Find the contact form hidden input:
```html
<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
```
Replace with:
```html
<input type="hidden" name="access_key" value="f8b0819d-070f-49d8-bcde-42ad48ab9872">
```

### Task 0.2 — Replace all placeholder phone numbers

**Files:** `index.html`, `inventory.html`, `car-detail.html`

Use ONLY this number: **+234 803 675 8830**

Find and replace across ALL three files:

| Find | Replace with |
|------|-------------|
| `href="tel:+2348000000000"` | `href="tel:+2348036758830"` |
| `href="https://wa.me/2348000000000"` | `href="https://wa.me/2348036758830"` |
| `+234 800 000 0000` (all display text instances) | `+234 803 675 8830` |

Also update the **contact info float** beside the form in `index.html` (around line 974-977). The current code shows:
```html
<strong>Call / WhatsApp</strong>
<span>+234 800 000 0000</span>
```
Replace with:
```html
<strong>Call / WhatsApp</strong>
<span><a href="tel:+2348036758830">+234 803 675 8830</a></span>
```

And fix the phone input placeholder in the contact form:
```
Find:    placeholder="+234 800 000 0000"
Replace: placeholder="+234 803 000 0000"
```

### Task 0.3 — Fix hero background video path

**Files:** `index.html`

The hero video source currently points to:
```html
<source src="assets/videos/hero-bg.mp4" type="video/mp4">
```

The actual video file is at the project root or needs to be copied:
1. Copy the video file from `/Users/Adedayo/Desktop/Antigrvy/hero-background-backup.mp4` into `assets/videos/hero-bg.mp4` (or `assets/videos/hero-background.mp4` — use whichever filename the HTML references).
2. If the file is already in the project under a different name, update the `<source src="...">` to match.
3. Also update the `poster` attribute to point to a valid poster image: verify `assets/images/inventory-1.jpg` exists. If not, swap to an image that does exist.

---

## PHASE 1 — Fix Invisible Listing Cards (The Actual Bug)

The Audi Q7 (#5) and Land Rover Defender (#6) listing cards in the Active Auctions grid appear nearly invisible — their image areas render as solid black. This is because the image files are either missing (404) or the images themselves are too dark against the dark card background.

### Task 1.1 — Identify which listing images are missing

**Instructions:**
1. Open a terminal in the project root.
2. Run this check:
   ```bash
   ls -la assets/images/audi-q7.jpg
   ls -la assets/images/land-rover-defender.jpg
   ls -la assets/images/lexus-rx.jpg
   ls -la assets/images/toyota-highlander.jpg
   ls -la assets/images/mercedes-gle.jpg
   ls -la assets/images/bmw-x5.jpg
   ls -la assets/images/inventory-1.jpg
   ls -la assets/images/inventory-2.jpg
   ls -la assets/images/inventory-3.jpg
   ls -la assets/images/inventory-4.jpg
   ```
3. Note which files exist and which return "No such file or directory".

### Task 1.2 — Fix missing images

Based on the results of Task 1.1:

**Option A — If `audi-q7.jpg` and/or `land-rover-defender.jpg` don't exist:**
1. Either source replacement images and add them to `assets/images/`, OR
2. Swap the `src` attributes in the HTML to point to images that DO exist. For example, if `inventory-3.jpg` and `inventory-4.jpg` exist, use those as temporary stand-ins:
   - In `index.html`, listing 5 (Audi Q7): change `src="assets/images/audi-q7.jpg"` to an image file that exists.
   - In `index.html`, listing 6 (Land Rover Defender): change `src="assets/images/land-rover-defender.jpg"` to an image file that exists.

**Option B — If the files exist but are extremely dark images:**
1. The images may be legitimate but too dark to see against the `#1a1a1a` card background.
2. Add a subtle gradient overlay to ALL `.listing-img` containers to ensure the image is always distinguishable from the background:
   ```css
   .listing-img::after {
     content: '';
     position: absolute;
     inset: 0;
     background: linear-gradient(
       180deg,
       transparent 40%,
       rgba(0, 0, 0, 0.3) 100%
     );
     pointer-events: none;
     z-index: 1;
   }
   ```
   This adds a bottom-fade that improves contrast for lot numbers and badges without making bright images look washed out.

### Task 1.3 — Add image error fallback for all listing cards

**Files:** `css/auction.css`

**Job:** Prevent broken images from rendering as invisible black boxes.

Add this CSS:
```css
/* Fallback for broken/missing images */
.listing-img {
  position: relative;
  background: var(--color-bg-elevated);
  overflow: hidden;
}

.listing-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* If image fails to load, show a car icon placeholder */
.listing-img img[src=""],
.listing-img img:not([src]) {
  display: none;
}
```

And add a global JS error handler in `js/main.js` (or whichever JS file runs on all pages):
```js
// Image error fallback — replace broken images with a placeholder background
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG' && e.target.closest('.listing-img')) {
    e.target.style.display = 'none';
    e.target.closest('.listing-img').style.background =
      'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)';
  }
}, true);
```

---

## PHASE 2 — Verify All Sections Render

After fixing the image issue, scroll through the entire `index.html` page on both desktop (1440px) and mobile (375px) and verify each section is visible.

### Task 2.1 — Check these sections exist and render (desktop + mobile):

1. **Topbar** — utility bar at the very top (phone, WhatsApp, "48 Auctions Live", NGN ₦). Should be visible on desktop, can be hidden on mobile.
2. **Header** — logo, search bar, nav links, "Get Started" button.
3. **Category tabs** — "All Vehicles", "SUV / 4WD", "Sedan", etc. Horizontally scrollable on mobile.
4. **Hero** — background video/poster, left-side copy with title/trust list/CTAs, right-side search panel.
5. **Auction ticker** — horizontally scrolling marquee of live bid updates.
6. **Trust strip** — 4 stats in a row ("2,000+ Vehicles Imported", "45–75 days", etc.).
7. **Featured listings** — 6 listing cards in a 3-column grid (desktop) / single column (mobile). ALL 6 should have visible images.
8. **Stats section** — 4 stat items (500K+, 2K+, 48hr, 98%).
9. **How It Works** — 4 step cards numbered 01–04.
10. **Pricing Breakdown** — dark card with line items and gold total.
11. **Why Us** — 6 feature cards in a grid.
12. **Testimonials** — 3 testimonial cards with star ratings.
13. **FAQ** — accordion items, expandable on click.
14. **Contact** — form (left) + image card with contact info (right).
15. **CTA Banner** — gold gradient banner with CTAs.
16. **Footer** — brand, link columns, social icons, bottom bar.
17. **WhatsApp float** — green circle, bottom-right corner.

For any section that is NOT rendering:
- Inspect it in dev tools.
- Check for `display: none`, `height: 0`, `opacity: 0`, or `overflow: hidden`.
- Fix the CSS in `auction.css`.
- If a section is missing from the CSS entirely (no styles defined), add the styles following the design patterns already established in the file.

### Task 2.2 — Verify inventory.html renders

Open `localhost:5173/inventory.html` and check:
1. Topbar, header, category tabs render.
2. The inventory grid shows listing cards generated by `inventory.js`.
3. Pagination works.
4. Sort dropdown works.

If `inventory.js` still generates old-style `.car-card` elements that don't match the new `.listing-card` design, update the card template in the `renderInventory()` function to match the new card structure from `index.html`.

### Task 2.3 — Verify car-detail.html renders

Open `localhost:5173/car-detail.html` and check that the page loads without errors. It uses `css/car-detail.css` — verify this file exists. If it doesn't exist, create a minimal stylesheet so the page doesn't break.

---

## PHASE 3 — Remaining Improvements

### Task 3.1 — Make category tab filtering work on homepage

**Files:** `js/main.js` (or `js/auction.js` if that exists)

The `.cat-tab` buttons have `data-cat` attributes. Each `.listing-card` has a matching `data-cat` attribute. Wire them up:

1. On click: add `.active` to clicked tab, remove from all others.
2. Filter: if `data-cat="all"`, show all `.listing-card` elements. Otherwise, hide cards that don't match.
3. Use `display: none` / `display: ''` or a class toggle for show/hide.

### Task 3.2 — Make auction timers count down

**Files:** `js/main.js` (or `js/auction.js`)

Each `.auction-timer` has `data-hours`. On page load:
1. Calculate end time per timer: `Date.now() + (parseInt(hours) * 3600000)`.
2. Update the display text every 60 seconds with the remaining `Xd Xh Xm` format.
3. When < 24 hours: add `.listing-timer-urgent` class to the parent `.listing-timer`.
4. When 0: show "Ended" and disable the Place Bid link.

### Task 3.3 — Make listing cards clickable to car-detail page

Each listing card should navigate to `car-detail.html?lot=DT-XXXXX` when clicked (except when clicking the Place Bid or Watch buttons).

Simplest approach: wrap the `.listing-img` in an `<a>` tag:
```html
<a href="car-detail.html?lot=DT-04291" class="listing-img-link">
  <div class="listing-img">...</div>
</a>
```
Or add a JS click handler on `.listing-card` with `e.target` checks to exclude buttons.

### Task 3.4 — Wire header search to inventory page filtering

The header `<form>` already has `action="inventory.html"` and `method="get"`, so submitting sends `?q=searchterm`. In `inventory.js`, read the `q` param and filter results where `car.make` or `car.model` includes the search string (case-insensitive).

---

## Quick Verification Checklist

After all tasks:

- [ ] All 6 featured listing cards show visible images on both desktop and mobile
- [ ] Phone number `+234 803 675 8830` everywhere (no `800 000 0000` remaining)
- [ ] Contact info float shows `+234 803 675 8830` with working tel: link
- [ ] Hero video plays (or poster image shows if video hasn't loaded yet)
- [ ] Contact form has access key `f8b0819d-070f-49d8-bcde-42ad48ab9872`
- [ ] WhatsApp float button visible on all 3 pages
- [ ] All "Place Bid" links open WhatsApp with pre-filled message
- [ ] No console errors in browser dev tools
- [ ] Search `800 000 0000` and `8000000000` across all files returns zero results
