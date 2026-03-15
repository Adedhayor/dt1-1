# DirecTokunbo — Deployment to Existing Repo

> **Repo:** https://github.com/Adedhayor/dt1-1
> **Live site:** www.directokunbo.com
> **Current state:** Live site is the OLD version. New redesigned version is local only.
> **Deploy method:** The repo already has `.github/workflows/deploy.yml` that builds with Vite and deploys to GitHub Pages on push to `main`.

---

## PRE-FLIGHT: Security Checks

Run these before touching git:

```bash
# 1. No placeholder phone numbers
grep -rn "800 000 0000\|8000000000" index.html inventory.html car-detail.html
# Must return NOTHING. If it returns results, fix them first.

# 2. Web3Forms key is set (not placeholder)
grep -n "access_key" index.html
# Should show: value="f8b0819d-070f-49d8-bcde-42ad48ab9872"
# NOT: value="YOUR_WEB3FORMS_ACCESS_KEY"

# 3. No .env or secrets files
ls -la .env .env.* 2>/dev/null
# Should return "No such file"

# 4. .gitignore exists and covers essentials
cat .gitignore
# Must include: node_modules/, dist/, .DS_Store, .env

# 5. Video file size check
ls -lh assets/videos/hero-bg.mp4 2>/dev/null
# If > 50MB, use Git LFS (see below). If < 50MB, fine to commit directly.
```

---

## STEP 1 — Prepare the Repo Locally

```bash
# Navigate to your project directory
cd /path/to/your/directokunbo-project

# Clone the existing repo into a temp location to get the git history
git clone https://github.com/Adedhayor/dt1-1.git temp-dt1

# Copy the .git directory from the clone into your working project
cp -r temp-dt1/.git ./.git

# Clean up the temp clone
rm -rf temp-dt1

# Verify you're connected to the right remote
git remote -v
# Should show: origin  https://github.com/Adedhayor/dt1-1.git
```

**OR** if your project is already a git repo pointing elsewhere:
```bash
git remote set-url origin https://github.com/Adedhayor/dt1-1.git
git remote -v
# Verify it shows the correct URL
```

---

## STEP 2 — Handle the Video File

Check the size:
```bash
ls -lh assets/videos/hero-bg.mp4
```

**If under 50MB:** No action needed, it'll commit normally.

**If over 50MB:** Use Git LFS:
```bash
# Install LFS if not already
git lfs install

# Track video files
git lfs track "*.mp4"

# This creates .gitattributes — make sure it gets committed
git add .gitattributes
```

---

## STEP 3 — Verify the Build Works

```bash
npm install
npm run build

# Check the output
ls dist/
# Should contain: index.html, inventory.html, car-detail.html, assets/

# Quick sanity check — preview locally
npm run preview
# Visit http://localhost:4173 — confirm site works
```

---

## STEP 4 — Verify the Deploy Workflow

Check that `.github/workflows/deploy.yml` exists and is correct:

```bash
cat .github/workflows/deploy.yml
```

It should look like this (or similar):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

If `car-detail.html` is new and Vite isn't configured to include it, verify `vite.config.js` handles multi-page:

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                inventory: resolve(__dirname, 'inventory.html'),
                carDetail: resolve(__dirname, 'car-detail.html'),
            },
        },
    },
});
```

**This is important.** If `car-detail.html` isn't listed in `rollupOptions.input`, Vite won't include it in the build and it'll 404 in production.

Also verify `public/CNAME` contains the right domain:
```bash
cat public/CNAME
```
Should say: `www.directokunbo.com`

If the file doesn't exist, create it:
```bash
mkdir -p public
echo "www.directokunbo.com" > public/CNAME
```

The CNAME file is what tells GitHub Pages to serve from your custom domain. **Keep it** — it's needed for GitHub Pages.

---

## STEP 5 — Commit and Push

```bash
# Stage everything
git add -A

# Review what's being committed
git status

# Check no secrets or junk in the staging area
git diff --cached --stat
# Look for anything unexpected — .env files, node_modules, etc.

# Commit
git commit -m "Redesign: auction-focused layout, WhatsApp CTAs, real images, contact form integration

- New auction card design with CIF pricing, grade ratings, countdown timers
- Category tabs with filtering (All, SUV, Sedan, Pickup, Van, Electric, Salvage)
- Hero section with search panel and live auction ticker
- Trust strip, stats section, pricing breakdown, testimonials
- WhatsApp-linked Place Bid buttons (+234 803 675 8830)
- Floating WhatsApp button on all pages
- Web3Forms contact form integration
- Car detail page (car-detail.html)
- Real vehicle images from Chinese auction sources
- Topbar with live auction count"

# Push to main — this triggers the GitHub Actions deploy
git push origin main --force
```

> **Using `--force`** because the new codebase is a complete rewrite. The old repo history gets overwritten. This is fine — the old version is the one we're replacing.

---

## STEP 6 — Monitor the Deploy

1. Go to https://github.com/Adedhayor/dt1-1/actions
2. Watch the "Deploy to GitHub Pages" workflow run.
3. It should take ~1-2 minutes.
4. If it fails, click into the failed run to see the error log. Common issues:
   - **npm install fails:** Missing `package.json` or wrong Node version. Add `NODE_VERSION` env to the workflow.
   - **Build fails:** Vite can't find an input file. Check `rollupOptions.input` in `vite.config.js`.
   - **CNAME missing:** The custom domain stops working. Ensure `public/CNAME` is committed.

---

## STEP 7 — Verify Live Site

After the deploy succeeds (green check in Actions):

```
✅  https://www.directokunbo.com              — homepage loads with new design
✅  https://www.directokunbo.com/inventory.html — inventory page works
✅  https://www.directokunbo.com/car-detail.html — detail page works
✅  All 6 featured listing images visible
✅  WhatsApp float button present
✅  "Place Bid" opens WhatsApp with pre-filled message
✅  Contact form submits (test with real email)
✅  Phone number shows +234 803 675 8830
✅  Hero video plays (or poster shows)
✅  FAQ accordion works
✅  Mobile responsive — test on actual phone
```

---

## IF SOMETHING BREAKS

**Site goes down after push:**
- Check GitHub Actions for build errors.
- If the build failed, the old version remains live (GitHub Pages keeps the last successful deploy).
- Fix the issue locally, commit, push again.

**Custom domain stops working:**
- Check that `public/CNAME` contains `www.directokunbo.com`.
- Go to repo → Settings → Pages → verify the custom domain is set.
- DNS may need 5-10 minutes to propagate after a redeploy.

**Images missing in production but work locally:**
- Vite may not be copying assets correctly. Check that image paths in HTML use relative paths (`assets/images/...`) not absolute paths (`/assets/images/...`).
- Verify the images are committed: `git ls-files assets/images/`.

**Car detail page 404s:**
- `vite.config.js` needs `rollupOptions.input` to include `car-detail.html` (see Step 4).
