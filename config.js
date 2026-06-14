// bijouxdrain — configuration
// Edit this file to brand the experience and plug in your real data.
// Nothing here automates payment: each "gift" is a link the client taps,
// which opens Throne's real checkout where THEY complete the purchase.

window.BIJOUX_CONFIG = {
  // ---- Branding ----
  brand: {
    name: "bijouxdrain",
    creator: "Bijoux",
    // Throne profile, used for the header link / fallback.
    throneProfileUrl: "https://throne.com/bijoux",
    tagline: "every tap is a gift you choose to send 💝",
    // Optional logo/avatar shown in the header (local path or URL).
    logo: "assets/images/logo.png",
    // Theme colors.
    colors: {
      primary: "#ff2d8b",
      primaryDark: "#c01e68",
      accent: "#ff8ec9",
      bg: "#1a0b14",
      card: "#2a1320",
    },
  },

  // ---- Gift items ----
  // Each item links to its REAL Throne page. The client taps -> Throne opens
  // in a new tab -> they confirm the real purchase in Throne's own UI.
  // Replace these placeholders with your actual Throne item links.
  items: [
    {
      title: "Placeholder Gift A",
      emoji: "💎",
      price: "$10",
      // The real Throne URL for this specific item / cart link.
      throneUrl: "https://throne.com/bijoux",
    },
    {
      title: "Placeholder Gift B",
      emoji: "🌸",
      price: "$25",
      throneUrl: "https://throne.com/bijoux",
    },
    {
      title: "Placeholder Gift C",
      emoji: "👑",
      price: "$50",
      throneUrl: "https://throne.com/bijoux",
    },
  ],

  // ---- Pop-up images ----
  // Two ways to supply images. The app tries `endpoint` first; if empty or it
  // fails, it falls back to the `local` list below.
  images: {
    // OPTION 1 (recommended if you already use Railway): an endpoint that
    // returns JSON like { "url": "https://.../pic.jpg" } on each GET.
    // e.g. "https://your-app.up.railway.app/api/random-image"
    endpoint: "",

    // OPTION 2: bundle images in assets/images and list them here.
    local: [
      // "assets/images/pic1.jpg",
      // "assets/images/pic2.jpg",
    ],

    // How often a new pop-up image appears (ms) and max on screen at once.
    spawnIntervalMs: 1500,
    maxOnScreen: 12,
  },
};
