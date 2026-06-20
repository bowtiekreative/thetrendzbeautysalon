# The Trendz Beauty Salon — Complete CSS & Brand Analysis

## Theme
- **WordPress Theme:** Termico (v7.0) — custom theme
- **Page Builder:** Elementor v4.1.3 + Elementor Pro v4.1.1

## Loaded Stylesheets (in order)

### Theme Styles
| File | Purpose |
|------|---------|
| `bootstrap.min.css` | Grid/layout framework |
| `owl.carousel.min.css` | Carousel/slider for testimonials & gallery |
| `animate.min.css` | Scroll-triggered CSS animations |
| `meanmenu.css` | Mobile responsive menu |
| `fontawesome.pro.min.css` | Font Awesome Pro icons |
| `flaticon.css` | Flaticon icon set |
| `pe-icon-7-stroke.css` | Pe icon set (7-stroke) |
| `material-design-iconic-font.min.css` | Material Design icons |
| `themify-icons.css` | Themify icon set |
| `termico-core.css` | Main theme core styles |
| `termico-unit.css` | Theme unit styles |
| `style.css` | Main WordPress theme stylesheet |
| `responsive.css` | Responsive breakpoints |
| `termico-custom.css` | Custom theme overrides |

### Plugin Styles
| File | Plugin |
|------|--------|
| `contact-form-7/.../styles.css` | Contact Form 7 |
| `bdevs-element.css` | BDVS Element (Elementor widgets) |
| `happy-elementor-addons/...` | Happy Elementor Addons |
| `elementor/.../frontend.min.css` | Elementor |
| `elementor/.../widget-*.min.css` | Elementor widgets |
| `elementor-pro/...` | Elementor Pro (nav menu, popup, sticky, motion-fx) |

### Google Fonts Loaded
- `roboto.css` — Sans-serif fallback
- `robotoslab.css` — Slab serif
- `domine.css` — Primary heading serif
- `rubik.css` — Navigation & buttons
- `tirodevanagarisanskrit.css` — Decorative/featured

### Font Awesome
- Font Awesome 5 Free (Solid, Brands)
- Font Awesome 5 Pro

## Color Palette (from computed styles)

| Color | RGB | Usage |
|-------|-----|-------|
| `#BF73BA` | `rgb(191,115,186)` | Primary accent — buttons, active nav links, icons |
| `#C06CAC` | `rgb(192,108,172)` | Secondary accent — hover states |
| `#FF6576` | `rgb(255,101,118)` | Button hover / alternate accent |
| `#343434` | `rgb(52,52,52)` | Dark text headings |
| `#555555` | `rgb(85,85,85)` | Body text |
| `#6A6560` | `rgb(106,101,96)` | Muted text |
| `#69727D` | `rgb(105,114,125)` | Grey text / captions |
| `#FFFFFF` | `rgb(255,255,255)` | White backgrounds, text on dark |
| `#2A2A2A` | `rgb(42,42,42)` | Dark section backgrounds |
| `#272727` | `rgb(39,39,39)` | Header/footer background |
| `#000000` | `rgb(0,0,0)` | Dark overlays |
| `#333333` | `rgb(51,55,61)` | Dark grey |
| `#54595F` | `rgb(84,89,95)` | Elementor default text |
| `#282828` | `rgb(40,40,40)` | Very dark grey |

## Typography Details

### Font Stack
```css
/* Headings */
font-family: 'Domine', serif;

/* Navigation */
font-family: 'Rubik', sans-serif;

/* Body text */
font-family: 'Open Sans', sans-serif;

/* Fallback */
font-family: 'Roboto', sans-serif;
```

### Font Sizes Detected
- 0px — hidden elements / screen-reader only
- 12px — small labels
- 13px — meta text
- 14px — small body, footer text
- 15px — body text
- 16px — default body
- 20px — sub-headings
- 22.4px — medium headings
- 25px — section headings
- 30px — large headings
- 55px — hero main heading

## Animation Libraries
1. **Animate.css** — CSS animations triggered on scroll
2. **Owl Carousel** — Slider/carousel animations
3. **Elementor Motion FX** — Parallax, mouse tracking, and scroll effects
4. **Magnific Popup** — Lightbox animations for images

## Responsive Breakpoints
- Desktop-first design via Bootstrap
- Mobile menu uses MeanMenu plugin
- Responsive.css for custom breakpoints

## Elementor Global Settings
- The site uses Elementor's theme builder
- Header built with Elementor Pro (theme builder)
- Page content built with Elementor widgets
- Custom CSS in post-specific Elementor CSS files (e.g., `post-16.css`, `post-409.css`, `post-1556.css`)

## Icons Used
- **Font Awesome:** Social media, UI icons (search, bars, close)
- **Flaticon:** Custom service/feature icons
- **Pe-icon-7-stroke:** Minimalist UI icons
- **Themify Icons:** Additional icon set
- **Material Design Icons:** Modern icon style
- **Font Awesome 5 Pro:** Premium icons

## Notable CSS Patterns
- Dark section overlays with rgba or gradient
- Lavender accent color consistently applied to:
  - `.elementor-button` (primary CTA)
  - Navigation active states
  - Icon circles on contact cards
  - Links and "READ MORE" text
- Serif headings on dark backgrounds for contrast
- Alternating background sections (white ↔ dark charcoal)
- Card-based layouts with image + overlay + text