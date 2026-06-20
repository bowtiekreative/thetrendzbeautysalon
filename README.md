# The Trendz Beauty Salon — Brand Overview

## About
The Trendz Beauty Salon is a Calgary-based beauty and wellness business operated by **Michellaine Tashina Helen Sleigh**, located in **Falconridge, Calgary, Alberta**. The salon offers a wide range of aesthetic and body sculpting services including permanent makeup, facials, waxing, fat freezing, microblading, lipo laser, cavitation, wood therapy, lymphatic drainage, and more. They also run **The Trendz Beauty Academy** offering online, blended, and 1:1 in-person training.

## Business Info
- **Email:** thetrendzsalon@gmail.com
- **Phone:** 403-714-3439
- **Location:** Falconridge, Calgary, Alberta
- **Website:** https://thetrendzbeautysalon.com
- **Social:** Facebook, Instagram (linked from site header)

## Brand Colors

| Usage          | Color Name         | Hex/RGB                          |
|----------------|--------------------|----------------------------------|
| Primary Accent | Lavender/Pink      | `#BF73BA` / `rgb(191, 115, 186)` |
| Dark Text      | Near Black         | `#343434` / `rgb(52, 52, 52)`    |
| Light Text     | Medium Grey        | `#6A6560` / `rgb(106, 101, 96)`  |
| Background     | White              | `#FFFFFF`                        |
| Dark BG        | Charcoal           | `#2A2A2A` / `rgb(42, 42, 42)`   |
| Header/Footer  | Dark Grey/Black    | `#272727` / `rgb(39, 39, 39)`    |
| Body Text      | Dark Grey          | `#555555` / `rgb(85, 85, 85)`    |
| Button Hover   | Rose/Pink          | `#FF6576` / `rgb(255, 101, 118)` |

## Fonts / Typography

| Usage              | Font Family                       | Type      |
|--------------------|-----------------------------------|-----------|
| Headings (serif)   | **Domine** (Google Font)          | Serif     |
| Body / Navigation  | **Open Sans** (Google Font)       | Sans-Serif|
| Navigation Menu    | **Rubik** (Google Font)           | Sans-Serif|
| Buttons / UI       | **Rubik**                         | Sans-Serif|
| Special (decorative)| **Tiro Devanagari Sanskrit**     | Serif     |
| Fallback           | **Roboto**                        | Sans-Serif|

- **Headings:** Domine, serif — conveys luxury and elegance
- **Body text:** Open Sans / Rubik — modern, clean readability
- **Navigation:** Uppercase, serif (Domine)
- **Font sizes:** 13px (small labels), 14-16px (body), 20-30px (subheadings), 55px (hero headings)

## Design System

### Layout
- Full-width, single-page scroll sections with alternating dark/light backgrounds
- Fixed header with sticky navigation (dark charcoal, ~272727)
- Hero sections use full-width background images with dark overlays
- Content max-width constrained via Bootstrap container classes

### Navigation
- 10-item horizontal menu: HOME, ABOUT, SERVICES, PRICING, COURSES, B&A CARE, OFFERS, PORTFOLIO, REVIEWS, CONTACT US
- Active page highlighted in lavender (#BF73BA)
- "BOOK NOW" CTA button in header (lavender background, dark text)
- Social icons (Facebook, Instagram) in header

### Buttons
- Primary: "BOOK NOW" — solid lavender (#BF73BA) with black text
- Secondary: "READ MORE" — text link style with lavender color
- "SCROLL" vertical text on hero left side
- All buttons use Rubik font

### Cards / Grids
- Service cards: 3-column grid with image, title (Domine serif), description, "READ MORE >>" link
- Pricing tables: two-column tables (Service | Price) grouped by category
- Contact info cards: 3-column with lavender icon circles
- Testimonials: carousel/slider (Owl Carousel)

### Animations
- Animate.css integration for scroll-triggered animations
- Owl Carousel for testimonial and gallery sliders
- Font Awesome icons for social and UI elements
- Motion effects (Elementor Pro Motion FX)
- Magnific Popup for lightbox

### Footer
- Dark background (#272727)
- Logo with "T" icon + "TRENDZ BEAUTY" text
- WPCode snippets for dynamic injection ([wpcode id="1775"], [wpcode id="1787"])

### Theme
- **Theme:** Termico (custom WordPress theme, v7.0)
- **Page Builder:** Elementor (v4.1.3) + Elementor Pro (v4.1.1)
- **Addons:** Happy Elementor Addons (v3.22.0)

## Site Structure
- Front page: static page (ID 409, "Home")
- Blog page: separate (ID 1585)
- 14 published pages total
- 15 published posts (prep/post-care guides, policies, blog)
- 16 services (custom post type)
- 43 pricing items (custom post type)
- 290 media attachments
- 7 categories, 12 tags