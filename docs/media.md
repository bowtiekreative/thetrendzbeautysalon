# The Trendz Beauty Salon — Media Inventory

## Overview
- **Total media items:** 290
- **Storage:** ~128 MB
- **All files downloaded to:** `/opt/data/thetrendzbeautysalon/images/`

## Media Summary
| Metric | Value |
|--------|-------|
| Total files | 290 |
| Download status | 289/290 downloaded initially, 1 fixed via URL encoding |
| Failed | 0 |
| Location | `images/` directory |

## File Naming Convention
Files are saved as: `{media_id}-{slug}.{ext}`

Example: `1522-featured-image.png`

## Featured Images
Many posts and pages use a shared featured image (ID 1522 — "Untitled 1662x900 800x433").
The most frequently used media items serve as thumbnails for services and posts.

## Media Types
Based on MIME types in the API:
- image/jpeg — most photographs
- image/png — graphics, logos, icons
- image/webp — modern format images
- image/gif — animations (if any)

## Image Dimensions (examples)
- Full-size uploads vary from small icons to large hero images (up to ~2000px wide)
- Various WordPress thumbnail sizes generated automatically

## Usage Context
- Service cards (grid thumbnails)
- Hero/header background images
- Gallery page images
- Blog/post featured images
- Logo and brand graphics
- Before/after treatment photos

## Manifest
A complete JSON manifest of all downloaded media is available at:
`/opt/data/thetrendzbeautysalon/media_manifest.json`

Each entry includes: id, filename, title, alt text, source URL, mime type, dimensions (width/height), date, and caption.