# DirecTokunbo — Security Audit & Deployment Plan

---

## PART 1: SECURITY AUDIT

### Credential Scan Results

| Item | File(s) | Risk Level | Action |
|------|---------|------------|--------|
| Web3Forms key `f8b0819d-070f-49d8-bcde-42ad48ab9872` | `index.html` | **SAFE** — client-side key by design. Web3Forms restricts by domain, not by key secrecy. This is how every Web3Forms integration works. | No action. |
| Phone `+234 803 675 8830` | All 3 HTML files | **SAFE** — intentionally public business contact info. | No action. |
| WhatsApp link to `wa.me/2348036758830` | All 3 HTML files + WhatsApp float | **SAFE** — public business number. | No action. |
| Email `trade@directokunbo.com` | `index.html` (contact info, may be Cloudflare-obfuscated) | **SAFE** — public business email. | No action. |
| Social media profile links | Footer of all pages | **SAFE** — public profiles. | No action. |
| `GITHUB_TOKEN` in deploy.yml | `.github/workflows/deploy.yml` | **SAFE** — `${{ secrets.GITHUB_TOKEN }}` is auto-provided by GitHub Actions, never hardcoded. | Remove entire file (switching to Cloudflare). |

### Remaining Placeholder Leak (MUST FIX)

One placeholder phone number survives in `car-detail.html`:

```
Line 22-24 (topbar):  href="tel:+2348000000000" and href="https://wa.me/2348000000000"
Line 179 (WhatsApp CTA): href="https://wa.me/2348000000000"
```

**Fix:** Run the same find/replace from the previous task list on `car-detail.html`:
```bash
sed -i '' 's|tel:+2348000000000|tel:+2348036758830|g' car-detail.html
sed -i '' 's|wa.me/2348000000000|wa.me/2348036758830|g' car-detail.html
sed -i '' 's|+234 800 000 0000|+234 803 675 8830|g' car-detail.html
```

### Files That Must NOT Be Committed

Create or verify `.gitignore` at the project root:

```gitignore
# Dependencies
node_modules/

# Build output (Cloudflare builds from source)
dist/

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Environment (shouldn't exist, but just in case)
.env
.env.local
.env.*

# Logs
*.log
npm-debug.log*
```

### Files to REMOVE Before First Push

| File | Reason |
|------|--------|
| `public/CNAME` | GitHub Pages artifact. Cloudflare handles custom domains differently — this file will cause build warnings. |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow. Not needed with Cloudflare Pages (it does its own builds). |
| `.github/` (entire directory) | If `deploy.yml` is the only file in there, remove the whole directory. |

### Pre-Push Verification Script

Run this before your first `git push`:

```bash
#!/bin/bash
echo "=== SECURITY AUDIT ==="

# Check for placeholder data
echo ""
echo "🔍 Checking for placeholder phone numbers..."
PLACEHOLDERS=$(grep -rn "8000000000\|800 000 0000\|YOUR_WEB3FORMS\|YOUR_ACCESS_KEY" *.html)
if [ -z "$PLACEHOLDERS" ]; then
  echo "  ✅ No placeholders found"
else
  echo "  ❌ PLACEHOLDERS FOUND:"
  echo "$PLACEHOLDERS"
  exit 1
fi

# Check for accidental secrets
echo ""
echo "🔍 Checking for accidental secrets..."
SECRETS=$(grep -rn "password\|secret_key\|api_key\|private_key\|token" --include="*.js" --include="*.html" --include="*.css" -i | grep -v "GITHUB_TOKEN\|access_key.*f8b0819d\|csrf_token\|node_modules")
if [ -z "$SECRETS" ]; then
  echo "  ✅ No accidental secrets"
else
  echo "  ⚠️  Review these matches manually:"
  echo "$SECRETS"
fi

# Check .gitignore exists
echo ""
echo "🔍 Checking .gitignore..."
if [ -f ".gitignore" ]; then
  echo "  ✅ .gitignore exists"
  grep -q "node_modules" .gitignore && echo "  ✅ node_modules ignored" || echo "  ❌ node_modules NOT in .gitignore"
  grep -q "dist" .gitignore && echo "  ✅ dist ignored" || echo "  ❌ dist NOT in .gitignore"
  grep -q ".env" .gitignore && echo "  ✅ .env ignored" || echo "  ❌ .env NOT in .gitignore"
else
  echo "  ❌ .gitignore MISSING — create it before pushing"
  exit 1
fi

# Check for large files
echo ""
echo "🔍 Checking for large files (>10MB)..."
LARGE=$(find . -not -path './node_modules/*' -not -path './.git/*' -size +10M -type f)
if [ -z "$LARGE" ]; then
  echo "  ✅ No large files"
else
  echo "  ⚠️  Large files found (consider Git LFS or CDN):"
  echo "$LARGE"
fi

# Check CNAME removed
echo ""
echo "🔍 Checking for GitHub Pages artifacts..."
[ -f "public/CNAME" ] && echo "  ❌ public/CNAME still exists — remove it" || echo "  ✅ No CNAME file"
[ -f ".github/workflows/deploy.yml" ] && echo "  ❌ GitHub Actions deploy still exists — remove it" || echo "  ✅ No GH Pages workflow"

echo ""
echo "=== AUDIT COMPLETE ==="
```

### About the Hero Video

The video file (`hero-bg.mp4`) could be 5-50MB+. Options:

1. **Commit it directly** — fine for now if it's under ~25MB. GitHub allows up to 100MB per file.
2. **Use Git LFS** — if the video is large. Run `git lfs track "*.mp4"` before committing.
3. **Host on a CDN** — upload to Cloudflare R2, Bunny CDN, or even a public S3 bucket, and reference the URL in the HTML. Best for performance.

**Recommendation for now:** Commit directly if under 25MB. Revisit later if the repo gets bloated.

---

## PART 2: DEPLOYMENT PLAN — GitHub + Cloudflare Pages

### Step 1 — Prepare the Repo

Claude Code tasks:

```bash
# 1. Remove GitHub Pages artifacts
rm -f public/CNAME
rm -rf .github/

# 2. Create/update .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
.env
.env.*
*.log
npm-debug.log*
EOF

# 3. Verify vite.config.js has correct base path
# For Cloudflare Pages, base should be '/'
cat vite.config.js
# Should show: base: '/'
# If it shows anything else, fix it.

# 4. Test the build locally
npm install
npm run build

# Verify dist/ was created and contains the site
ls dist/
# Should show: index.html, inventory.html, car-detail.html, assets/
```

### Step 2 — Initialize Git & Push to GitHub

```bash
# If not already a git repo:
git init
git add .
git commit -m "Initial commit: DirecTokunbo auction site"

# Create a new repo on GitHub (public or private — your choice)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/directokunbo.git
git branch -M main
git push -u origin main
```

> **Note:** Replace `YOUR_USERNAME` with your actual GitHub username. You can also create the repo via GitHub CLI: `gh repo create directokunbo --public --source=. --push`

### Step 3 — Connect Cloudflare Pages

This is done in the Cloudflare dashboard, NOT via Claude Code:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare to access your GitHub account.
3. Select the `directokunbo` repository.
4. Configure the build:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
   - **Node version:** Add environment variable `NODE_VERSION` = `18` (or `20`)
5. Click **Save and Deploy**.
6. Cloudflare will build and deploy. First deploy takes ~2 minutes.
7. Your site will be live at `https://directokunbo.pages.dev` (temporary URL).

### Step 4 — Configure Custom Domain

Still in Cloudflare dashboard:

1. In **Pages** → your project → **Custom domains** → **Set up a custom domain**.
2. Enter `www.directokunbo.com`.
3. Cloudflare will prompt you to add a CNAME record:
   - **Type:** CNAME
   - **Name:** `www`
   - **Target:** `directokunbo.pages.dev`
4. If `directokunbo.com` is already on Cloudflare DNS, the record is added automatically. If the domain is with a different registrar, you'll need to either:
   - **Transfer DNS to Cloudflare** (recommended) — change nameservers at your registrar to Cloudflare's.
   - **Add a CNAME record** at your current DNS provider pointing `www` to `directokunbo.pages.dev`.
5. For the **apex domain** (`directokunbo.com` without www):
   - Add a CNAME record for `@` pointing to `directokunbo.pages.dev`.
   - Cloudflare handles CNAME flattening at the apex automatically.
6. SSL is automatic — Cloudflare issues a certificate within minutes.

### Step 5 — Verify Deployment

After Cloudflare finishes building:

1. Visit `https://directokunbo.pages.dev` — confirm the site loads.
2. Visit `https://www.directokunbo.com` — confirm custom domain works.
3. Visit `https://directokunbo.com` — confirm apex domain redirects or loads.
4. Test all pages: `/`, `/inventory.html`, `/car-detail.html`.
5. Test the contact form submission.
6. Test WhatsApp links on mobile.

### Step 6 — Set Up Auto-Deploy

This is already done by default. Every time you push to `main`, Cloudflare rebuilds and deploys automatically. Typical deploy time: 30-60 seconds.

To preview branches before merging:
- Push to any branch other than `main`.
- Cloudflare auto-generates a preview URL like `https://abc123.directokunbo.pages.dev`.
- Review it, then merge to `main` to go live.

---

## PART 3: POST-DEPLOY CHECKLIST

- [ ] `https://www.directokunbo.com` loads correctly
- [ ] `https://directokunbo.com` redirects to www (or loads directly)
- [ ] SSL padlock shows in browser
- [ ] Contact form submits successfully (test with a real email)
- [ ] WhatsApp links open correctly on mobile
- [ ] All images load (no broken images)
- [ ] Hero video plays
- [ ] Page speed: run [PageSpeed Insights](https://pagespeed.web.dev/) — aim for 80+ on mobile
- [ ] Old GitHub Pages deployment is disabled (if it was active)
  - Go to GitHub repo → Settings → Pages → set source to "None"

---

## PART 4: OPTIONAL — Cloudflare Optimizations

After the site is live, enable these in Cloudflare dashboard for free:

1. **Auto Minify** — Dashboard → Speed → Optimization → enable for JS, CSS, HTML.
2. **Brotli compression** — usually on by default.
3. **Browser cache TTL** — set to 4 hours for static assets.
4. **Always Use HTTPS** — Dashboard → SSL/TLS → Edge Certificates → toggle on.
5. **HSTS** — enable if you want to enforce HTTPS strictly.
6. **Redirect www ↔ apex** — Dashboard → Rules → Redirect Rules → create a rule to redirect `directokunbo.com` to `www.directokunbo.com` (or vice versa — pick one canonical URL).
