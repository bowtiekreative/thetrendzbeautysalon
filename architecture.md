# The Trendz Beauty Salon — Architecture

## WordPress Configuration
- **Site URL:** https://thetrendzbeautysalon.com
- **WordPress Address:** http://thetrendzbeautysalon.com (HTTP in WP config, HTTPS served)
- **Front page:** Static page (ID 409, "Home-2")
- **Blog page:** "Blog" (ID 1585)
- **Timezone:** UTC (GMT+0)
- **REST API:** Fully accessible with public read permissions
- **Admin username:** User ID 1 exists (author of all content) — `/wp/v2/users` blocked by LiteSpeed firewall (403)

## Registered Post Types

| Type | Slug | Description | Count |
|------|------|-------------|-------|
| Posts | `post` | Standard blog posts | 15 |
| Pages | `page` | Static pages | 14 |
| Media | `attachment` | Image/video uploads | 290 |
| Navigation | `nav_menu_item` | Menu items | Protected |
| Patterns | `wp_block` | Reusable blocks | Active |
| Templates | `wp_template` | Block/FTE templates | Active |
| Template Parts | `wp_template_part` | Template parts | Active |
| Global Styles | `wp_global_styles` | Global style config | Active |
| Navigation Menus | `wp_navigation` | Block editor menus | Active |
| Font Families | `wp_font_family` | Custom font families | Active |
| Font Faces | `wp_font_face` | Custom font face files | Active |
| **Service** | `service` | **Custom — salon services** | **16** |
| **Pricing** | `pricing` | **Custom — service prices** | **43** |
| My Templates | `elementor_library` | Elementor saved templates | 3 |
| Custom Code | `elementor_snippet` | Elementor code snippets | Active |
| RM Content Editor | `rm_content_editor` | RankMath content editor | Active |

## Taxonomy

### Categories (7)
| ID | Name | Slug | Post Count |
|----|------|------|-----------|
| 1 | Uncategorized | uncategorized | 0 |
| 40 | Policy | policy | 3 |
| 41 | Offers | offers | 0 |
| 42 | B&A | ba | 9 |
| 43 | News | news | 1 |
| 53 | chickenroad | chickenroad | 1 |
| 54 | 1 | 1 | 1 |

### Tags (12)
All tags have **0** post count (unused or removed):
business, consult, desgin, develop, HTML, icon, keyboard, kit, Popular, tech, usability, ux

## Detected Plugins

| Plugin | Namespace | Purpose |
|--------|-----------|---------|
| **Elementor** (v4.1.3) | `elementor/v1` | Page builder |
| **Elementor Pro** (v4.1.1) | `elementor-pro/v1` | Pro widgets, theme builder |
| **Happy Elementor Addons** (v3.22.0) | `happy/v1` | Extra Elementor widgets |
| **Contact Form 7** (v6.1.6) | `contact-form-7/v1` | Contact forms |
| **Rank Math SEO** | `rankmath/v1` | SEO meta, redirection, schema |
| **LiteSpeed Cache** | `litespeed/v1`, `litespeed/v3` | Caching, CDN, image optimization |
| **WP All Import** | `wp-all-import/v1` | Data import |
| **Meta Box** | `meta-box/v1` | Custom fields |
| **MB Blocks** | `mb-blocks/v1` | Meta Box blocks |
| **MB Relationships** | `mb-relationships/v1` | Post relationships |
| **Mailchimp for WP** | `mc4wp/v1` | Email marketing |
| **Hostinger Tools** | `hostinger-tools-plugin/v1` | Hosting utilities |
| **Elementor One** (Cloud) | `elementor-one/v1` | Elementor Cloud features |
| **WPCode** | (via wpcode shortcodes) | Code snippets |
| **WP Site Health** | `wp-site-health/v1` | Core health checks |
| **WP Block Editor** | `wp-block-editor/v1` | Block editor support |

## REST API Namespaces
```
oembed/1.0, contact-form-7/v1, litespeed/v1, litespeed/v3,
rankmath/v1, rankmath/v1/setupWizard, wp-all-import/v1,
elementor-one/v1, mc4wp/v1, elementor/v1, elementor-pro/v1,
happy/v1, hostinger-tools-plugin/v1,
rankmath/v1/ca, rankmath/v1/an, rankmath/v1/in, rankmath/v1/status,
elementor/v1/documents, elementor-ai/v1, elementor/v1/feedback,
mbb, mb-blocks/v1, mb-relationships/v1, meta-box/v1, mbv, mbfs, mcp,
wp/v2, wp-site-health/v1, wp-block-editor/v1, wp-abilities/v1
```

## Frontend Pages (14)

| ID | Slug | Title | Notes |
|----|------|-------|-------|
| 409 | home-2 | Home | Front page, hero + sections |
| 413 | about | About | Owner bio, mission/vision |
| 612 | services-new | Service | 3-column service grid, paginated |
| 982 | pricing-2 | Pricing | Price tables + booking form |
| 416 | offers | Offers | Special offers |
| 417 | portfolio-01 | Portfolio | Portfolio gallery |
| 31 | gallery | Gallery | Photo gallery |
| 30 | reviews | Reviews | Testimonial carousel |
| 29 | contact-us | Contact Us | Contact form + info cards |
| 27 | policy | Policy | Business policies |
| 1585 | blog | Blog | Blog archive |
| 1588 | ba-care-2 | B&A Care | Before/After care guides |
| 1925 | courses | Courses | Academy info + educator bio |
| 418 | pricing | Pricing | (Draft/alternate pricing page) |

## Theme Structure
- **Theme:** Termico (custom, v7.0)
- **Template hierarchy:** Standard WordPress + Elementor theme builder
- **Header:** Elementor Pro Theme Builder (sticky)
- **Footer:** Elementor Pro Theme Builder
- **Post templates:** Elementor single post template

## Security
- `/wp/v2/users` endpoint blocked by LiteSpeed firewall (403 Forbidden)
- Public REST API read access granted to all other endpoints
- Contact Form 7 with Google reCAPTCHA likely (not visible from API)
- LiteSpeed cache security rules enforced