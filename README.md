# goldnow

## Gifting landing page prototype

A static prototype for a GoldNow gold-gifting landing page — `index.html`, `styles.css`, and `script.js`. No build step — open `index.html` directly in a browser, or serve the folder with any static file server:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Sections

- Hero
- The problem (why gifts get forgotten)
- Why gold (5,000-year value story + gifting USPs)
- Occasions (consumer vs. business gifting, side by side)
- Getting started (interactive "send" and "receive" steppers — click a step to swap the phone mockup)
- CTA banner
- FAQ accordion

Fonts load from Google Fonts (Plus Jakarta Sans); everything else — icons, phone mockups, gold bar/coin illustrations — is plain CSS/SVG, no external assets or build tooling required.

### Files

- `index.html` — markup and content
- `styles.css` — all styling (design tokens, layout, components)
- `script.js` — the "send"/"receive" step-click interaction
