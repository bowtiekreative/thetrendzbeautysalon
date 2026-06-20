// The Trendz Beauty Salon — Express + EJS server.
// Resilient boot: bind the port first, then init the DB with retries. Never
// process.exit() on DB failure (avoids 503 crash-loops on shared hosts).
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const data = require('./src/data');
const content = require('./src/content');
const apiRouter = require('./src/api');
const { query } = require('./src/db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SITE = content.site;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

// Security headers + CSP. Opened up for Google Maps (frame) and inline styles.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(morgan('tiny'));

// Static assets with long cache + cache-busting via ?v=<mtime>.
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '30d', immutable: true }));
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), { maxAge: '30d', immutable: true }));

// asset() appends ?v=<file mtime> so deploys invalidate cached css/js immediately.
const assetVersionCache = {};
function asset(rel) {
  const file = path.join(__dirname, 'public', rel.replace(/^\//, ''));
  if (!assetVersionCache[file]) {
    try { assetVersionCache[file] = Math.floor(fs.statSync(file).mtimeMs); }
    catch { assetVersionCache[file] = Date.now(); }
  }
  return `/static/${rel.replace(/^\//, '')}?v=${assetVersionCache[file]}`;
}

const img = (file) => (file ? `/images/${file}` : '');
const absUrl = (p) => `${SITE.url}${p.startsWith('/') ? p : '/' + p}`;

// Make common helpers available to every view.
app.use((req, res, next) => {
  res.locals.site = SITE;
  res.locals.nav = content.nav;
  res.locals.asset = asset;
  res.locals.img = img;
  res.locals.absUrl = absUrl;
  res.locals.path = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.canonical = absUrl(req.path === '/' ? '/' : req.path.replace(/\/$/, ''));
  res.locals.ogImage = absUrl(img(SITE.ogImage));
  res.locals.jsonld = [localBusinessSchema()];
  res.locals.breadcrumbs = null;
  next();
});

// ---- JSON-LD builders ----
function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: absUrl(img(SITE.ogImage)),
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: 'Calgary, Alberta',
    sameAs: Object.values(SITE.social),
  };
}
function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.href) })),
  };
}

// Build a render context with per-route SEO.
function seo(title, description, extra = {}) {
  return { pageTitle: `${title} | ${SITE.name}`, metaDescription: description, ...extra };
}

// ---------- Routes ----------
app.get('/healthz', async (req, res) => {
  let db = false;
  try { await query('SELECT 1'); db = true; } catch (_) { db = false; }
  res.json({ status: 'ok', db, dbReady: data.isDbReady(), counts: await data.counts(), uptime: process.uptime() });
});

app.get('/', async (req, res, next) => {
  try {
    const [services, testimonials, faqs] = await Promise.all([data.getServices(), data.getTestimonials(), data.getFaqs()]);
    const jsonld = [localBusinessSchema(), {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }];
    res.render('home', {
      ...seo(SITE.tagline, SITE.description),
      home: content.home, services: services.slice(0, 6), testimonials, faqs, jsonld,
    });
  } catch (e) { next(e); }
});

app.get('/about', (req, res) => {
  res.render('about', {
    ...seo('About Us', 'Meet Michellaine Sleigh and learn the story, mission, and vision behind The Trendz Beauty Salon in Calgary.'),
    about: content.about,
    breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }],
    jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }])],
  });
});

app.get('/services', async (req, res, next) => {
  try {
    const services = await data.getServices();
    res.render('services', {
      ...seo('Services', 'Explore our full range of beauty and body treatments — permanent makeup, facials, waxing, body sculpting, fat freezing and more.'),
      services,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }])],
    });
  } catch (e) { next(e); }
});

app.get('/services/:slug', async (req, res, next) => {
  try {
    const service = await data.getService(req.params.slug);
    if (!service) return next();
    const all = await data.getServices();
    const crumbs = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: service.title, href: `/services/${service.slug}` }];
    res.render('service-detail', {
      ...seo(service.title, service.excerpt, { ogImage: service.image ? absUrl(img(service.image)) : res.locals.ogImage }),
      service, related: all.filter((s) => s.slug !== service.slug).slice(0, 3),
      breadcrumbs: crumbs,
      jsonld: [
        localBusinessSchema(),
        breadcrumbSchema(crumbs),
        { '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.excerpt, provider: { '@type': 'HealthAndBeautyBusiness', name: SITE.name }, areaServed: 'Calgary, Alberta' },
      ],
    });
  } catch (e) { next(e); }
});

app.get('/pricing', async (req, res, next) => {
  try {
    res.render('pricing', {
      ...seo('Pricing', 'Transparent, competitive pricing for all treatments at The Trendz Beauty Salon, with discounts on multi-session packages.'),
      pricing: await data.getPricing(),
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }])],
    });
  } catch (e) { next(e); }
});

app.get('/courses', (req, res) => {
  res.render('courses', {
    ...seo('Courses — The Trendz Beauty Academy', 'Train with The Trendz Beauty Academy. Online, blended, and 1:1 in-person certification programs across body contouring, permanent makeup, nails, facials and more.'),
    academy: content.academy,
    breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Courses', href: '/courses' }],
    jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Courses', href: '/courses' }])],
  });
});

app.get('/before-after-care', async (req, res, next) => {
  try {
    res.render('bacare', {
      ...seo('Before & After Care', 'Preparation and aftercare guides for tattoo, microneedling, booty lifting, and fat freezing treatments at The Trendz Beauty Salon.'),
      guides: await data.getBacare(),
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Before & After Care', href: '/before-after-care' }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Before & After Care', href: '/before-after-care' }])],
    });
  } catch (e) { next(e); }
});

app.get('/before-after-care/:slug', async (req, res, next) => {
  try {
    const guide = await data.getBacareItem(req.params.slug);
    if (!guide) return next();
    const crumbs = [{ name: 'Home', href: '/' }, { name: 'Before & After Care', href: '/before-after-care' }, { name: guide.title, href: `/before-after-care/${guide.slug}` }];
    res.render('bacare-detail', {
      ...seo(guide.title, `${guide.title} guide — instructions from The Trendz Beauty Salon.`),
      guide, breadcrumbs: crumbs,
      jsonld: [localBusinessSchema(), breadcrumbSchema(crumbs)],
    });
  } catch (e) { next(e); }
});

app.get('/offers', (req, res) => {
  res.render('offers', {
    ...seo('Offers', 'Limited-time offers, seasonal specials and exclusive promotions from The Trendz Beauty Salon.'),
    offers: content.offers,
    breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Offers', href: '/offers' }],
    jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Offers', href: '/offers' }])],
  });
});

app.get('/reviews', async (req, res, next) => {
  try {
    res.render('reviews', {
      ...seo('Reviews', 'Read glowing testimonials from clients of The Trendz Beauty Salon in Calgary.'),
      testimonials: await data.getTestimonials(),
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Reviews', href: '/reviews' }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Reviews', href: '/reviews' }])],
    });
  } catch (e) { next(e); }
});

app.get('/contact', async (req, res, next) => {
  try {
    res.render('contact', {
      ...seo('Contact Us', `Book an appointment at The Trendz Beauty Salon. Call ${SITE.phone} or send us a message.`),
      services: await data.getServices(), sent: req.query.sent === '1',
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }])],
    });
  } catch (e) { next(e); }
});

// Contact / booking form submission.
app.use(express.urlencoded({ extended: true }));
app.post('/contact', async (req, res) => {
  const { name, email, phone, service, message, website } = req.body || {};
  if (website) return res.redirect('/contact?sent=1'); // honeypot
  try {
    await query('INSERT INTO enquiries (name, email, phone, service, message, source) VALUES (?,?,?,?,?,?)',
      [name || '', email || '', phone || '', service || '', message || '', 'contact']);
  } catch (e) { console.error('enquiry save failed:', e.message); }
  res.redirect('/contact?sent=1');
});

// Legal pages from extracted WordPress posts.
function policyRoute(routePath, slug, title) {
  app.get(routePath, (req, res, next) => {
    const p = content.policies[slug];
    if (!p) return next();
    res.render('policy', {
      ...seo(title, `${title} — The Trendz Beauty Salon.`),
      title, body: p.content,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: title, href: routePath }],
      jsonld: [localBusinessSchema(), breadcrumbSchema([{ name: 'Home', href: '/' }, { name: title, href: routePath }])],
    });
  });
}
policyRoute('/privacy-policy', 'privacy-policy', 'Privacy Policy');
policyRoute('/terms', 'terms-of-conditions', 'Terms of Service');
policyRoute('/booking-policy', 'booking-policy', 'Booking Policy');

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
});

// sitemap.xml — static routes + every service + every care guide.
app.get('/sitemap.xml', async (req, res) => {
  const staticPaths = ['/', '/about', '/services', '/pricing', '/courses', '/before-after-care', '/offers', '/reviews', '/contact', '/privacy-policy', '/terms', '/booking-policy'];
  let urls = [...staticPaths];
  try { (await data.getServices()).forEach((s) => urls.push(`/services/${s.slug}`)); } catch (_) {}
  try { (await data.getBacare()).forEach((b) => urls.push(`/before-after-care/${b.slug}`)); } catch (_) {}
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${absUrl(u)}</loc></url>`).join('\n')}\n</urlset>\n`;
  res.type('application/xml').send(body);
});

// Content API.
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { ...seo('Page Not Found', 'The page you are looking for could not be found.') });
});

// Error handler — never crash the process.
app.use((err, req, res, next) => {
  console.error('Request error:', err);
  res.status(500).render('404', { ...seo('Something Went Wrong', 'An unexpected error occurred.'), error: true });
});

// ---- Resilient boot ----
const server = app.listen(PORT, () => console.log(`Trendz site listening on :${PORT}`));

(async function initDb(attempt = 1) {
  const { init } = require('./src/seed');
  try {
    const r = await init();
    data.setDbReady(true);
    console.log('DB ready. Seed:', r);
  } catch (e) {
    const delay = Math.min(30000, 2000 * attempt);
    console.error(`DB init failed (attempt ${attempt}): ${e.message}. Retrying in ${delay}ms`);
    setTimeout(() => initDb(attempt + 1), delay);
  }
})();

module.exports = server;
