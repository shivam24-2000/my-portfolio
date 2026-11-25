# Shivam Singhal — Portfolio

> A calm, editorial, evidence-first portfolio for a backend software engineer: Java, Spring Boot and microservices handling ~1M requests/day, owned end to end.

**Live:** [shivam-singhal.vercel.app](https://shivam-singhal.vercel.app/)

---

## Features

| Feature | Description |
|---|---|
| **Light & dark themes** | Soft, low-contrast palettes (warm paper / charcoal) with a toggle, saved preference and a gentle cross-fade on switch |
| **Impact panel** | Hero card styled like a production health dashboard, with KPIs that count up on scroll |
| **Hero canvas** | Data "packets" travel along a faint background grid, tinted with the theme accent |
| **Case studies** | Problem → approach → result write-ups with animated SVG architecture diagrams |
| **Experience timeline** | Timeline that fills as you scroll |
| **Tech marquee** | Two seamless, opposite-direction scrolling rows of the stack |
| **Card spotlight** | Subtle cursor-following highlight on cards |
| **Scroll progress bar** | Thin accent bar at the top of the viewport |
| **Copy email** | One-click copy with a toast confirmation |
| **Accessible by default** | Semantic markup, keyboard-friendly nav, and all motion disabled under `prefers-reduced-motion` |

---

## Sections

1. **Hero** — Headline, summary, impact panel, tech marquee
2. **Selected work** — Problems owned end to end (scale, fault tolerance, data layer, production support, audits)
3. **How I operate** — Lifecycle ownership, designing for failure, measuring before optimising, raising the team's bar
4. **Experience** — Bank of America, Incedo Inc., VIT Vellore
5. **Projects** — ColdEmailAgent, NexCode AI, SmartCart
6. **Toolkit** — Languages, frameworks, data, infra, practices
7. **Contact** — Copy email, résumé and social links

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | Semantic HTML5 |
| **Styling** | Vanilla CSS with custom-property design tokens for theming |
| **Interactivity** | Vanilla JavaScript (ES modules) — no frameworks |
| **Graphics** | Canvas 2D (hero) and inline SVG/SMIL (diagrams) |
| **Fonts** | Geist, Geist Mono, Instrument Serif (Google Fonts) |
| **Icons** | Font Awesome 6, Devicon |
| **Build** | Vite |
| **Hosting** | Vercel |

---

## Project Structure

```
my-portfolio/
├── public/
│   ├── favicon.svg
│   └── resume.pdf
├── src/
│   ├── style.css     # Design tokens, light/dark themes, components, animations
│   └── main.js       # Theme toggle, nav, reveal/count-up, hero canvas, marquee, spotlight
├── index.html        # Single-page entry point
└── package.json
```

---

## Running Locally

```bash
git clone https://github.com/shivam24-2000/my-portfolio.git
cd my-portfolio
npm install
npm run dev       # http://localhost:5173
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

---

## Contact

- **Email:** [shivamsinghal24@gmail.com](mailto:shivamsinghal24@gmail.com)
- **LinkedIn:** [/in/shivam-singhal-538369191](https://www.linkedin.com/in/shivam-singhal-538369191/)
- **GitHub:** [@shivam24-2000](https://github.com/shivam24-2000)
