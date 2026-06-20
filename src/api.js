// Token-protected content API for live edits without redeploy.
// Mint a key with admin username/password (env ADMIN_USER / ADMIN_PASSWORD).
// Using the API flips meta content_source = 'api' so the seeder stops clobbering edits.
const crypto = require('crypto');
const express = require('express');
const { query, queryOne } = require('./db');
const { setMeta } = require('./seed');

const router = express.Router();
router.use(express.json({ limit: '1mb' }));

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

async function markApiOwned() {
  await setMeta('content_source', 'api');
}

// POST /api/keys  { username, password, label } -> mints a token (shown once)
router.post('/keys', async (req, res) => {
  const { username, password, label } = req.body || {};
  if (
    !process.env.ADMIN_USER ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  await query('INSERT INTO api_keys (token_hash, label) VALUES (?, ?)', [sha256(token), label || 'api key']);
  res.json({ token, note: 'Store this token securely — it will not be shown again.' });
});

// Bearer-token auth for all routes below.
async function auth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  const row = await queryOne('SELECT id FROM api_keys WHERE token_hash = ?', [sha256(token)]);
  if (!row) return res.status(401).json({ error: 'Invalid token' });
  next();
}

router.get('/services', async (req, res) => {
  res.json(await query('SELECT * FROM services ORDER BY sort'));
});

router.put('/services/:slug', auth, async (req, res) => {
  const { title, excerpt, content, image, price_from } = req.body || {};
  const existing = await queryOne('SELECT id FROM services WHERE slug = ?', [req.params.slug]);
  if (!existing) return res.status(404).json({ error: 'Service not found' });
  await query(
    'UPDATE services SET title = COALESCE(?, title), excerpt = COALESCE(?, excerpt), content = COALESCE(?, content), image = COALESCE(?, image), price_from = COALESCE(?, price_from) WHERE slug = ?',
    [title ?? null, excerpt ?? null, content ?? null, image ?? null, price_from ?? null, req.params.slug]
  );
  await markApiOwned();
  res.json(await queryOne('SELECT * FROM services WHERE slug = ?', [req.params.slug]));
});

router.get('/testimonials', async (req, res) => {
  res.json(await query('SELECT * FROM testimonials ORDER BY sort'));
});

router.post('/testimonials', auth, async (req, res) => {
  const { name, service, text } = req.body || {};
  if (!name || !text) return res.status(400).json({ error: 'name and text are required' });
  const row = await queryOne('SELECT COALESCE(MAX(sort), -1) + 1 AS s FROM testimonials');
  const r = await query('INSERT INTO testimonials (name, service, text, sort) VALUES (?,?,?,?)', [name, service || '', text, row.s]);
  await markApiOwned();
  res.status(201).json(await queryOne('SELECT * FROM testimonials WHERE id = ?', [r.insertId]));
});

router.delete('/testimonials/:id', auth, async (req, res) => {
  await query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  await markApiOwned();
  res.json({ deleted: true });
});

router.get('/faqs', async (req, res) => {
  res.json(await query('SELECT * FROM faqs ORDER BY sort'));
});

module.exports = router;
