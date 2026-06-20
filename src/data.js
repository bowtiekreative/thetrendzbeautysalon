// Data access with graceful fallback to content.js when the DB isn't ready.
// Keeps the site rendering even during a cold boot or DB hiccup (no 503 loops).
const { query } = require('./db');
const content = require('./content');

let dbReady = false;
function setDbReady(v) { dbReady = v; }
function isDbReady() { return dbReady; }

async function getServices() {
  if (dbReady) {
    try {
      const rows = await query('SELECT slug, title, excerpt, content, image, price_from AS priceFrom FROM services ORDER BY sort');
      if (rows.length) return rows;
    } catch (_) { /* fall through */ }
  }
  return content.services;
}

async function getService(slug) {
  const all = await getServices();
  return all.find((s) => s.slug === slug) || null;
}

async function getPricing() {
  if (dbReady) {
    try {
      const cats = await query('SELECT id, category FROM pricing_categories ORDER BY sort');
      if (cats.length) {
        const items = await query('SELECT category_id, service, price FROM pricing_items ORDER BY sort');
        return cats.map((c) => ({
          category: c.category,
          items: items.filter((i) => i.category_id === c.id).map((i) => [i.service, i.price]),
        }));
      }
    } catch (_) { /* fall through */ }
  }
  return content.pricing;
}

async function getTestimonials() {
  if (dbReady) {
    try {
      const rows = await query('SELECT name, service, text FROM testimonials ORDER BY sort');
      if (rows.length) return rows;
    } catch (_) { /* fall through */ }
  }
  return content.testimonials;
}

async function getFaqs() {
  if (dbReady) {
    try {
      const rows = await query('SELECT question AS q, answer AS a FROM faqs ORDER BY sort');
      if (rows.length) return rows;
    } catch (_) { /* fall through */ }
  }
  return content.faqs;
}

async function getBacare() {
  if (dbReady) {
    try {
      const rows = await query('SELECT slug, title, bullets FROM bacare ORDER BY sort');
      if (rows.length) return rows.map((r) => ({ slug: r.slug, title: r.title, bullets: JSON.parse(r.bullets || '[]') }));
    } catch (_) { /* fall through */ }
  }
  return content.bacare;
}

async function getBacareItem(slug) {
  const all = await getBacare();
  return all.find((b) => b.slug === slug) || null;
}

async function counts() {
  const out = {};
  for (const [k, fn] of Object.entries({ services: getServices, pricing: getPricing, testimonials: getTestimonials, bacare: getBacare })) {
    try { out[k] = (await fn()).length; } catch { out[k] = null; }
  }
  return out;
}

module.exports = {
  content, setDbReady, isDbReady,
  getServices, getService, getPricing, getTestimonials, getFaqs, getBacare, getBacareItem, counts,
};
