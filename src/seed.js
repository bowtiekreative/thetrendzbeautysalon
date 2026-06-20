// Seed MySQL from src/content.js (single source of truth).
// Version-gated: re-seeds only when contentVersion changes, UNLESS the content
// API has taken over (meta content_source = 'api'), so live edits aren't clobbered.
// `npm run seed` forces a full reset regardless.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool, query, queryOne } = require('./db');
const content = require('./content');

async function applySchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = sql
    .split(/;\s*[\r\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const conn = await pool.getConnection();
  try {
    for (const stmt of statements) {
      await conn.query(stmt);
    }
  } finally {
    conn.release();
  }
}

async function getMeta(k) {
  const row = await queryOne('SELECT v FROM meta WHERE k = ?', [k]);
  return row ? row.v : null;
}
async function setMeta(k, v) {
  await query('INSERT INTO meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [k, v]);
}

async function reseed() {
  const tables = ['pricing_items', 'pricing_categories', 'services', 'testimonials', 'faqs', 'bacare'];
  for (const t of tables) await query(`DELETE FROM ${t}`);

  content.services.forEach((s, i) => i); // noop to keep linage clear
  for (let i = 0; i < content.services.length; i++) {
    const s = content.services[i];
    await query(
      'INSERT INTO services (slug, title, excerpt, content, image, price_from, sort) VALUES (?,?,?,?,?,?,?)',
      [s.slug, s.title, s.excerpt, s.content, s.image, s.priceFrom || '', i]
    );
  }

  for (let i = 0; i < content.pricing.length; i++) {
    const cat = content.pricing[i];
    const res = await query('INSERT INTO pricing_categories (category, sort) VALUES (?, ?)', [cat.category, i]);
    const catId = res.insertId;
    for (let j = 0; j < cat.items.length; j++) {
      const [service, price] = cat.items[j];
      await query('INSERT INTO pricing_items (category_id, service, price, sort) VALUES (?,?,?,?)', [catId, service, price, j]);
    }
  }

  for (let i = 0; i < content.testimonials.length; i++) {
    const t = content.testimonials[i];
    await query('INSERT INTO testimonials (name, service, text, sort) VALUES (?,?,?,?)', [t.name, t.service, t.text, i]);
  }

  for (let i = 0; i < content.faqs.length; i++) {
    const f = content.faqs[i];
    await query('INSERT INTO faqs (question, answer, sort) VALUES (?,?,?)', [f.q, f.a, i]);
  }

  for (let i = 0; i < content.bacare.length; i++) {
    const b = content.bacare[i];
    await query('INSERT INTO bacare (slug, title, bullets, sort) VALUES (?,?,?,?)', [b.slug, b.title, JSON.stringify(b.bullets), i]);
  }

  await setMeta('content_version', String(content.contentVersion));
}

// force = true: always reseed (npm run seed). Otherwise version-gated.
async function init({ force = false } = {}) {
  await applySchema();
  const source = await getMeta('content_source');
  const current = await getMeta('content_version');
  const target = String(content.contentVersion);

  if (force) {
    await reseed();
    await setMeta('content_source', 'seed');
    return { seeded: true, reason: 'forced' };
  }
  if (source === 'api') {
    return { seeded: false, reason: 'api-owned' };
  }
  if (current === target) {
    return { seeded: false, reason: 'up-to-date' };
  }
  await reseed();
  return { seeded: true, reason: current ? 'version-bump' : 'initial' };
}

module.exports = { init, applySchema, reseed, getMeta, setMeta };

// CLI: node src/seed.js  -> force reset
if (require.main === module) {
  init({ force: true })
    .then((r) => {
      console.log('Seed complete:', r);
      return pool.end();
    })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error('Seed failed:', e);
      process.exit(1);
    });
}
