# Content API

The site renders from MySQL, which is seeded from `src/content.js`. The Content
API lets you make live edits (services, testimonials) **without a redeploy**.

> The first time you use a write endpoint, the app sets `meta.content_source = 'api'`.
> From then on the version-gated seeder **will not** overwrite your live edits.
> To deliberately reset everything back to `src/content.js`, run `npm run seed`.

## Authentication

1. **Mint a token** with the admin credentials from `.env` (`ADMIN_USER` / `ADMIN_PASSWORD`):

   ```bash
   curl -X POST https://thetrendzbeautysalon.com/api/keys \
     -H 'Content-Type: application/json' \
     -d '{"username":"admin","password":"YOUR_PASSWORD","label":"my laptop"}'
   ```

   Response (the token is shown **once** — store it safely):

   ```json
   { "token": "abc123…", "note": "Store this token securely — it will not be shown again." }
   ```

2. **Use the token** as a Bearer header on write endpoints:

   ```
   Authorization: Bearer abc123…
   ```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/keys` | admin creds | Mint a new API token |
| `GET` | `/api/services` | – | List all services |
| `PUT` | `/api/services/:slug` | ✓ | Update a service (`title`, `excerpt`, `content`, `image`, `price_from`) |
| `GET` | `/api/testimonials` | – | List testimonials |
| `POST` | `/api/testimonials` | ✓ | Add a testimonial (`name`, `service`, `text`) |
| `DELETE` | `/api/testimonials/:id` | ✓ | Remove a testimonial |
| `GET` | `/api/faqs` | – | List FAQs |

### Examples

Update a service description:

```bash
curl -X PUT https://thetrendzbeautysalon.com/api/services/microblading \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"excerpt":"Wake up with perfect brows every day."}'
```

Add a new review:

```bash
curl -X POST https://thetrendzbeautysalon.com/api/testimonials \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane D.","service":"Facials","text":"Absolutely loved my facial!"}'
```

Changes are live immediately — no redeploy needed.
