# 🏛️ Prestige Estates — Luxury Real Estate Website

A premium, full-featured real estate website with admin dashboard, built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks. No dependencies.

---

## 🌟 Features

### Public Website
- **Luxury Loading Screen** with progress bar
- **Custom Gold Cursor** with magnetic lag effect
- **Scroll Progress Indicator**
- **Cinematic Hero Section** with particle effects & parallax
- **Animated Statistics** counters (Intersection Observer)
- **Layouts & Plots** page with search & filter system
- **Layout Detail Modal** with full specs
- **Services Page** — Interior Design + Construction
- **Masonry Gallery** with category filters & lightbox
- **Contact Page** with validated form & FAQ accordion
- **Testimonials Slider** with autoplay
- **Crew Members Grid** — all 15 members
- **Floating WhatsApp & Call buttons**
- **Back to Top button**
- **Dark luxury theme** with Glassmorphism cards
- **Fully responsive** — mobile-first design
- **SEO optimized** — meta tags, schema markup, sitemap

### Admin Dashboard
- **Secure login** (admin / admin123)
- **8-hour session** with localStorage
- **Layout Management** — Add, Edit, Delete layouts with full details
- **Gallery Management** — Add/remove images by category
- **Crew Management** — Add/edit/delete team members
- **Testimonials** — Add/delete client reviews
- **Contact Info** — Update phone, WhatsApp, email, address (reflects everywhere instantly)
- **Statistics** — Update homepage counter numbers

---

## 📁 Folder Structure

```
Luxury-Real-Estate/
├── index.html          # Homepage
├── layouts.html        # Layouts & Plots
├── services.html       # Services
├── gallery.html        # Project Gallery
├── contact.html        # Contact Page
├── admin.html          # Admin Dashboard
├── css/
│   ├── style.css       # Main styles + design system
│   ├── animations.css  # All animations & keyframes
│   ├── admin.css       # Admin-specific styles
│   └── responsive.css  # Media queries
├── js/
│   ├── main.js         # Core: loader, cursor, navbar, etc.
│   ├── animations.js   # Scroll animations, slider, ripple
│   ├── layouts.js      # Layouts page: render, filter, modal
│   ├── gallery.js      # Gallery: masonry, filter, lightbox
│   ├── admin.js        # Admin dashboard logic
│   ├── storage.js      # LocalStorage CRUD utilities
│   └── validation.js   # Form validation
├── data/
│   └── sample-data.json  # Default seed data
├── sitemap.xml
├── robots.txt
└── README.md
```

---

## 🚀 Deployment

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub
2. Upload all files maintaining the folder structure
3. Go to **Settings → Pages**
4. Set source to **main branch, / (root)**
5. Your site will be live at `https://yourusername.github.io/repo-name/`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire `Luxury-Real-Estate` folder
3. Instant deployment — no configuration needed

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In the project folder: `vercel --prod`
3. Follow prompts for free deployment

### Option 4: Traditional Web Hosting

1. Connect via FTP (FileZilla, etc.)
2. Upload all files to your `public_html` or `www` folder
3. Update `sitemap.xml` with your actual domain

---

## ⚙️ Configuration

### Update Domain in sitemap.xml
Replace `https://yourdomain.com` with your actual domain.

### Customize Company Info
Option A — Via Admin Panel:
1. Open `admin.html`
2. Login: admin / admin123
3. Go to **Contact Info** and update all details
4. Go to **Statistics** and update counter values

Option B — In `data/sample-data.json`:
Edit the `company` object with your real info.

### Change Admin Credentials
In `js/admin.js`, find:
```javascript
if (user === 'admin' && pass === 'admin123')
```
Replace with your desired credentials.

> ⚠️ For production, implement server-side auth instead of client-side checks.

---

## 🎨 Design Customization

### Color Palette (css/style.css)
```css
:root {
  --bg-primary: #0A0A0A;       /* Main background */
  --bg-secondary: #111827;     /* Section background */
  --gold: #D4AF37;             /* Primary accent */
  --gold-light: #E6C87A;       /* Light gold */
  --gold-dark: #b8942e;        /* Dark gold */
}
```

### Typography
Fonts loaded from Google Fonts:
- **Headings**: Playfair Display
- **Body**: Poppins

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

> **Note:** Custom cursor disabled on mobile/touch devices automatically.

---

## 📊 Performance

- **Images**: Lazy loaded with `loading="lazy"`
- **Animations**: Hardware-accelerated with `will-change`
- **Fonts**: Preloaded via Google Fonts CDN
- **CSS**: Variables for instant theming
- **JS**: ES6 modules for code splitting
- **Scrolling**: Passive event listeners throughout

---

## 🔒 Security

- XSS prevention via `sanitize()` function in storage.js
- Input sanitization on all admin form submissions
- Admin route protection via session check
- No inline scripts on public pages
- `noindex` meta tag on admin page

---

## 📞 Default Sample Data

The site seeds with sample data on first load:
- **4 Layout ventures** (Golden Meadows, Silver Palms, Royal Heritage, Emerald Greens)
- **15 Crew members** with photos and roles
- **9 Gallery images** across all categories
- **4 Client testimonials**

All data is stored in `localStorage` and editable via the admin panel.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (Variables, Grid, Flexbox) |
| Logic | Vanilla ES6+ JavaScript (Modules) |
| Storage | Browser LocalStorage |
| Fonts | Google Fonts CDN |
| Images | Unsplash (demo) |
| Animations | CSS Keyframes + Intersection Observer |

---

## 📄 License

This project is created for Prestige Estates. All rights reserved.

---

*Built with excellence. Designed for luxury.*
