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
      title: "Bowing in Admiration",
      emoji: "👑",
      price: "$10",
      // The real Throne URL for this specific item / cart link.
      throneUrl: "https://throne.com/bijoux/item/7fb537fc-28d3-4037-833c-95dbe88493f9",
    },
    {
      title: "Just Saying Hi",
      emoji: "🌸",
      price: "$25",
      throneUrl: "https://throne.com/bijoux/item/e08c08a5-baac-4b11-9085-db59396c65c8",
    },
    {
      title: "Expensive Coffee",
      emoji: "☕️",
      price: "$20",
      throneUrl: "https://throne.com/bijoux/item/c3ff8e2e-4f28-467a-aad8-cb1d18b2f939",
    },
    {
      title: "Girls Date",
      emoji: "🍿",
      price: "$25",
      throneUrl: "https://throne.com/bijoux/item/efbf83f6-a7eb-41f7-9a7d-9f4faba4df1e",
    },
    {
      title: "New Panties",
      emoji: "🐱",
      price: "$30",
      throneUrl: "https://throne.com/bijoux/item/f4b7f575-f8c7-4273-8955-88b419e80283",
    },
    {
      title: "Spoil My Pets",
      emoji: "🐶",
      price: "$50",
      throneUrl: "https://throne.com/bijoux/item/ed3395ed-7d03-4605-9c17-127effea0afa",
    },
    {
      title: "More Panties Shopping",
      emoji: "💕",
      price: "$60",
      throneUrl: "https://throne.com/bijoux/item/517bb38c-618b-4af3-a8bc-970e2f3b05e0",
    },
    {
      title: "Cute Craft Supplies",
      emoji: "🧑‍🎨",
      price: "$75",
      throneUrl: "https://throne.com/bijoux/item/3298d2ca-fa3f-487d-a631-ed529537abb2",
    },
    {
      title: "Brunch with Friends",
      emoji: "🥗",
      price: "$100",
      throneUrl: "https://throne.com/bijoux/item/ef1d8d86-9747-4ba4-a69c-2e39c0ee77b2",
    },
    {
      title: "New Pair of Shoes",
      emoji: "👠",
      price: "$125",
      throneUrl: "https://throne.com/bijoux/item/60e88c65-a144-4518-a6d2-863252782c13",
    },
    {
      title: "Makeup Shopping Trip",
      emoji: "💅",
      price: "$140",
      throneUrl: "https://throne.com/bijoux/item/f44e14a0-cbbb-4a2e-b03c-3f5c7ea07436",
    },
    {
      title: "2x Concert Tickets",
      emoji: "🎵",
      price: "$175",
      throneUrl: "https://throne.com/bijoux/item/1fc7da86-38b2-4779-868e-b53c8cbbfce0",
    },
    {
      title: "Picnic Date",
      emoji: "🥗",
      price: "$200",
      throneUrl: "https://throne.com/bijoux/item/910ad1cf-bc6e-484f-a198-f76f8478c1c7",
    },
      {
      title: "Girls' Spa Time",
      emoji: "💅",
      price: "$225",
      throneUrl: "https://throne.com/bijoux/item/5943ad6c-fac1-4252-abaf-f980d0bae7b4",
    },
      {
      title: "Hot Girl House Party",
      emoji: "🏡",
      price: "$275",
      throneUrl: "https://throne.com/bijoux/item/b321fa30-1ab7-447f-8073-9272b735157d",
    },
      {
      title: "Hot Club Night",
      emoji: "👠",
      price: "$350",
      throneUrl: "https://throne.com/bijoux/item/a0f1b1f1-42e3-400b-9563-fa2ad12b6f29",
    },
      {
      title: "Photoshoot",
      emoji: "📷",
      price: "$500",
      throneUrl: "https://throne.com/bijoux/item/a296d31e-6b17-4d39-8835-67f4c3dd3a6b",
    },
      {
      title: "Luxury Shopping",
      emoji: "👑",
      price: "$750",
      throneUrl: "https://throne.com/bijoux/item/b82ea5af-ed2a-4a02-af8c-4436e6585832",
    },
      {
      title: "Miami Vacation",
      emoji: "💦",
      price: "$1000",
      throneUrl: "https://throne.com/bijoux/item/33b30870-ce6b-4e47-8313-b59e950dd582",
    },
      {
      title: "Mirrorless Vlog Camera",
      emoji: "💕",
      price: "$1080",
      throneUrl: "https://throne.com/products/p/goody/74568a56-a588-45a8-80bf-42e0aba74a9a?size=n_60_n",
    },
  ],

  // ---- Pop-up images ----
  // Two ways to supply images. The app tries `endpoint` first; if empty or it
  // fails, it falls back to the `local` list below.
  images: {
    // OPTION 1 (recommended if you already use Railway): an endpoint that
    // returns JSON like { "url": "https://.../pic.jpg" } on each GET.
    // e.g. "https://your-app.up.railway.app/api/random-image"
    endpoint: "https://bijoux-pics-production.up.railway.app/api/random-image",

    // OPTION 2: bundle images in assets/images and list them here.
    local: [
      // "assets/images/pic1.jpg",
      // "assets/images/pic2.jpg",
    ],

    // How often a new pop-up image appears (ms) and max on screen at once.
    spawnIntervalMs: 1500,
    maxOnScreen: 12,
  },

  // ---- Overlay (Chrome extension only) ----
  // Controls how the experience is layered over throne.com/bijoux.
  overlay: {
    // Transparency of the floating images (0 = invisible, 1 = solid).
    // Lower = you see more of the Throne page underneath.
    imageOpacity: 0.55,
    // Start the overlay automatically when you open throne.com/bijoux?
    // (You can always toggle it with the toolbar icon.)
    autoStart: true,
    // Show the gift menu panel in the overlay.
    showGiftPanel: true,
  },
};
