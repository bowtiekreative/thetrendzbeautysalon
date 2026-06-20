# The Trendz Beauty Salon

A modern, fast, accessible rebuild of [thetrendzbeautysalon.com](https://thetrendzbeautysalon.com) —
the original WordPress/Elementor site re-engineered as a server-rendered Node.js
application. **Content is kept faithful to the original**; the stack is rebuilt
for speed, SEO, accessibility, and easy self-service editing.

The Trendz Beauty Salon is a Calgary-based beauty & wellness studio operated by
**Michellaine Tashina Helen Sleigh** in **Falconridge, Calgary, Alberta**,
offering permanent makeup, facials, waxing, body sculpting, fat freezing,
microblading, and more — plus **The Trendz Beauty Academy** training programs.

## Stack

- **Express + EJS** — server-rendered HTML (great for SEO, fast, simple).
- **MySQL via `mysql2`** — pure-JS driver (installs cleanly on restricted shared hosts; no native addons).
- **`src/content.js`** — the single source of truth for all site content, seeded into MySQL on boot.
- **Content API** (`/api`) — token-protected live editing without a redeploy.
- **Helmet + compression + morgan** — security headers, gzip, request logging.

## Project layout

```
server.js            Express app — routes, SEO, JSON-LD, sitemap, resilient boot
app.js               Hostinger fallback entrypoint (require server.js)
src/
  content.js         Single source of truth (verbatim site content)
  db.js              MySQL pool + query helpers (localhost -> 127.0.0.1 fix)
  schema.sql         Tables (InnoDB, utf8mb4)
  seed.js            Version-gated seeding from content.js
  data.js            Data access with graceful fallback to content.js
  api.js             Token-protected content API
views/               EJS templates + shared partials
public/
  css/styles.css     Design system (purple #BF73BA, Domine + Open Sans)
  js/main.js         Nav, accessible sliders, FAQ accordion
  images/            All media from the original site
docs/                Content-API guide, brand overview, architecture, styles
```

## Local development

```bash
npm install
cp .env.example .env      # set DB + admin credentials
npm run seed              # create tables + load content into MySQL
npm run dev               # http://localhost:3000
```

The app is **resilient by design**: it binds the HTTP port first, then connects
to MySQL with retries, and falls back to `src/content.js` if the DB is
unavailable — so it never enters a 503 crash-loop. Check `/healthz` for DB
status and content counts.

## Editing content

- **Bulk / structural changes** — edit `src/content.js`, bump `contentVersion`,
  redeploy. The seeder re-applies on next boot.
- **Live edits (no redeploy)** — use the [Content API](docs/CONTENT-API.md).
  Once the API is used, the seeder stops overwriting live edits (`npm run seed`
  forces a full reset).

## What was improved

- ⚡ **Performance** — no WordPress/Elementor/jQuery bloat; server-rendered HTML, gzip, long-cached assets with mtime cache-busting.
- 🔍 **SEO** — unique titles/descriptions per route, canonical + Open Graph + Twitter cards, JSON-LD (`HealthAndBeautyBusiness`, `BreadcrumbList`, `FAQPage`, `Service`), `robots.txt`, generated `sitemap.xml`.
- ♿ **Accessibility (WCAG)** — semantic landmarks, skip link, visible focus outlines, zoom not disabled, carousels with Pause/Play controls honoring `prefers-reduced-motion`, ARIA on toggles, alt text.
- 📱 **Responsive** — mobile-first, drawer nav, single-column grids, full-width buttons on small screens.
- ✏️ **Self-service editing** — content API + version-gated seeding.

## Deployment notes (Hostinger / shared hosts)

- Use `DB_HOST=127.0.0.1` (not `localhost`) — Node resolves `localhost` to IPv6 `::1` but the DB user is usually granted on IPv4. `db.js` rewrites this automatically.
- Both `server.js` and `app.js` entrypoints are provided.
- Static assets are long-cached with `?v=<mtime>` cache-busting, so deploys show up immediately.
- A `Dockerfile` is included for containerized deploys.

## Reference docs

- [`docs/CONTENT-API.md`](docs/CONTENT-API.md) — live editing API
- [`docs/BRAND-OVERVIEW.md`](docs/BRAND-OVERVIEW.md) — colors, fonts, business info
- [`docs/architecture.md`](docs/architecture.md) — original WordPress structure
- [`docs/styles.md`](docs/styles.md) — original CSS/brand analysis
