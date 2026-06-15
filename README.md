# bijouxdrain

A branded, consensual "drain"-themed gifting experience for **Bijoux**.

It gives the immersive, dramatized feeling of a "drain" — pink UI, a rising
generosity counter, and floating pop-up images — while keeping the person fully
in control. **No payment is ever automated.** Each tap opens Throne's real
checkout, where the user completes the actual purchase themselves.

## Two ways to run it

- **Standalone webpage** (root files: `index.html`, etc.) — a self-contained page
  you can host and share.
- **Chrome extension overlay** (`extension/` folder) — lays the experience
  *on top of* the real `throne.com/bijoux` page, semi-transparently, so the
  visitor mainly sees Throne with Bijoux's images + gift menu floating over it.

Both share the same idea and safety rules. The extension is documented in its
own section below.

## How it works (webpage)

1. The visitor lands on a consent gate: 18+, explains they control every gift,
   and they can stop or leave any time. They must tick the box to enter.
2. Inside, they see Bijoux's gift items with a **"Send this gift 💝"** button.
3. Tapping a gift opens that item's **real Throne page in a new tab**, where the
   visitor completes the real purchase through Throne's own checkout.
4. The on-screen counter reflects gifts they *chose* to send. They can reset it.
5. A visible **Stop & Exit** button is always present, and closing the tab ends
   everything instantly. Nothing blocks leaving.

## What it intentionally does NOT do

- It does **not** auto-click, auto-checkout, or auto-submit any payment.
- It does **not** loop charges or charge anything without a person acting.
- It does **not** trap the user (no fullscreen lock, no blocked tab close, no
  disabled keys). These omissions are deliberate — please keep them that way.

This keeps the experience consensual per-purchase and avoids violating Throne's
terms of service / payment-processor rules.

## Setup

1. Edit **`config.js`**:
   - `brand` — name, creator, Throne profile URL, tagline, logo, colors.
   - `items` — for each gift, set `title`, `emoji`, `price`, and the real
     `throneUrl` for that specific item.
   - `images` — see below.
2. Open `index.html` in a browser to preview locally, or host it (see Hosting).

## Images

Two options, set in `config.js` under `images`:

- **Endpoint (recommended if you use Railway):** set `endpoint` to a URL that
  returns JSON like `{ "url": "https://.../pic.jpg" }` on each GET, e.g.
  `https://your-app.up.railway.app/api/random-image`. This matches the pattern
  you're already using.
- **Bundled:** drop image files into `assets/images/` and list their paths in
  `images.local`, e.g. `["assets/images/pic1.jpg", "assets/images/pic2.jpg"]`.

The app tries the endpoint first and falls back to the local list.

## Hosting

It's a static site (HTML/CSS/JS), so you can host it for free:

- **GitHub Pages:** push to the `missbijoux/bijouxdrain` repo, then enable Pages
  on the `main` branch in repo Settings.
- **Railway / Netlify / Vercel:** deploy as a static site.

## Project structure

```
bijouxdrain/
├── index.html      # consent gate + main UI
├── styles.css      # Bijoux pink theme
├── app.js          # rendering, gift link-out, pop-up images, counter, exit
├── config.js       # YOUR data: branding, items, image source
└── assets/images/  # optional bundled images + logo.png
```

## Chrome extension overlay (`extension/`)

This overlays the experience on the real `throne.com/bijoux` page.

### What it does

- Floats your `bijoux-pics` images semi-transparently over the page (you mainly
  see Throne underneath). Opacity is configurable.
- Shows a compact panel (top-right) with your branding, a generosity counter,
  and a gift menu. Tapping a gift opens that real Throne item.
- Toggle the whole overlay on/off with the toolbar icon, or the ✕ in the panel.

### What it intentionally does NOT do (keep it this way)

- The floating images are **click-through** (`pointer-events: none`) — they never
  sit over Throne's real buttons or capture clicks. **No clickjacking.**
- **No payment automation** — no auto add-to-cart, checkout, or pay.
- **Non-trapping** — closing the overlay, closing the tab, Escape, back, and
  right-click all work normally. Nothing is blocked.
- It only runs on `https://throne.com/bijoux` (see `manifest.json` matches).

### Configure

Edit `extension/config.js` (a copy of the webpage config, plus an `overlay`
block for `imageOpacity`, `autoStart`, and `showGiftPanel`). Set
`images.endpoint` to your `bijoux-pics` URL, same as the webpage.

> Note: the extension has its own `config.js`. If you change items/branding,
> update `extension/config.js` (the extension can't read files outside its folder).

### Load it in Chrome

1. Go to `chrome://extensions/` and toggle **Developer mode** ON (top right).
2. Click **Load unpacked** and select the `extension/` folder.
3. The bijouxdrain icon appears in the toolbar.
4. Open `https://throne.com/bijoux` — accept the consent bar, and the overlay
   starts. Click the toolbar icon any time to toggle it.

## A note on safety

This tool is for adults who consensually opt in, and it is built so that real
money only ever moves when the person makes a real, in-the-moment choice on
Throne. Please don't modify it to auto-charge, loop payments, or prevent users
from leaving — that would remove the consent this design depends on.
