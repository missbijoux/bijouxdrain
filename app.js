// bijouxdrain — app logic
// Design principles (intentional, do not "optimize" away):
//  - No payment is ever automated. A gift = opening Throne in a new tab where
//    the user completes the real purchase themselves.
//  - The user is never trapped: no fullscreen lock, no blocked tab close,
//    no disabled keys. A Stop button and normal tab-close always work.

(function () {
  "use strict";

  const cfg = window.BIJOUX_CONFIG || {};
  const brand = cfg.brand || {};
  const colors = brand.colors || {};

  // Apply theme colors from config.
  const root = document.documentElement.style;
  if (colors.primary) root.setProperty("--primary", colors.primary);
  if (colors.primaryDark) root.setProperty("--primary-dark", colors.primaryDark);
  if (colors.accent) root.setProperty("--accent", colors.accent);
  if (colors.bg) root.setProperty("--bg", colors.bg);
  if (colors.card) root.setProperty("--card", colors.card);

  // ---- Elements ----
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const consentCheck = document.getElementById("consent-check");
  const enterBtn = document.getElementById("enter-btn");
  const stopBtn = document.getElementById("stop-btn");
  const resetBtn = document.getElementById("reset-btn");
  const itemsEl = document.getElementById("items");
  const meterTotal = document.getElementById("meter-total");
  const meterCount = document.getElementById("meter-count");
  const imageLayer = document.getElementById("image-layer");

  document.getElementById("gate-tagline").textContent = brand.tagline || "";
  document.getElementById("brand-name").textContent = brand.creator || brand.name || "";
  const throneLink = document.getElementById("brand-throne");
  if (brand.throneProfileUrl) throneLink.href = brand.throneProfileUrl;

  const logo = document.getElementById("brand-logo");
  if (brand.logo) {
    logo.src = brand.logo;
    logo.hidden = false;
    logo.onerror = () => { logo.hidden = true; };
  }

  // ---- Consent gate ----
  consentCheck.addEventListener("change", () => {
    enterBtn.disabled = !consentCheck.checked;
  });

  enterBtn.addEventListener("click", () => {
    if (!consentCheck.checked) return;
    gate.classList.add("hidden");
    app.classList.remove("hidden");
    startImages();
  });

  // ---- Generosity meter (counts only taps the user makes) ----
  let totalCents = 0;
  let giftCount = 0;

  function parsePriceToCents(price) {
    if (!price) return 0;
    const n = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }

  function formatMoney(cents) {
    return "$" + (cents / 100).toLocaleString(undefined, {
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  function renderMeter() {
    meterTotal.textContent = formatMoney(totalCents);
    meterCount.textContent = String(giftCount);
  }

  resetBtn.addEventListener("click", () => {
    totalCents = 0;
    giftCount = 0;
    renderMeter();
  });

  // ---- Items ----
  function renderItems() {
    const items = Array.isArray(cfg.items) ? cfg.items : [];
    itemsEl.innerHTML = "";

    if (items.length === 0) {
      itemsEl.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No items configured yet — add them in <code>config.js</code>.</p>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const emoji = document.createElement("div");
      emoji.className = "item-emoji";
      emoji.textContent = item.emoji || "🎁";

      const title = document.createElement("div");
      title.className = "item-title";
      title.textContent = item.title || "Gift";

      const price = document.createElement("div");
      price.className = "item-price";
      price.textContent = item.price || "";

      // One tap = open the REAL Throne page in a new tab. The user completes
      // the actual purchase there. We intentionally do not automate checkout.
      const btn = document.createElement("a");
      btn.className = "btn btn-primary";
      btn.textContent = "Send this gift 💝";
      btn.href = item.throneUrl || brand.throneProfileUrl || "#";
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.addEventListener("click", () => {
        totalCents += parsePriceToCents(item.price);
        giftCount += 1;
        renderMeter();
      });

      card.appendChild(emoji);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(btn);
      itemsEl.appendChild(card);
    });
  }

  // ---- Pop-up images (decorative, never block interaction) ----
  const imgCfg = cfg.images || {};
  let imageTimer = null;

  async function nextImageUrl() {
    if (imgCfg.endpoint) {
      try {
        const res = await fetch(imgCfg.endpoint, { cache: "no-store" });
        const data = await res.json();
        if (data && data.url) {
          return data.url.startsWith("http") ? data.url : imgCfg.endpoint.replace(/\/api\/.*$/, "") + data.url;
        }
      } catch (e) {
        // fall through to local list
      }
    }
    const local = Array.isArray(imgCfg.local) ? imgCfg.local : [];
    if (local.length > 0) return local[Math.floor(Math.random() * local.length)];
    return null;
  }

  async function spawnImage() {
    const max = imgCfg.maxOnScreen || 12;
    const existing = imageLayer.querySelectorAll(".pop-img");
    if (existing.length >= max) {
      existing[0].remove();
    }

    const url = await nextImageUrl();
    if (!url) return;

    const img = document.createElement("img");
    img.className = "pop-img";
    img.src = url;
    img.alt = "";
    img.style.left = Math.random() * Math.max(0, window.innerWidth - 440) + "px";
    img.style.top = Math.random() * Math.max(0, window.innerHeight - 440) + "px";
    img.onerror = () => img.remove();

    imageLayer.appendChild(img);
    requestAnimationFrame(() => img.classList.add("show"));

    setTimeout(() => {
      img.classList.remove("show");
      setTimeout(() => img.remove(), 600);
    }, 5000);
  }

  function startImages() {
    const interval = imgCfg.spawnIntervalMs || 1500;
    spawnImage();
    imageTimer = setInterval(spawnImage, interval);
  }

  function stopImages() {
    if (imageTimer) clearInterval(imageTimer);
    imageTimer = null;
    imageLayer.querySelectorAll(".pop-img").forEach((i) => i.remove());
  }

  // ---- Stop & Exit (always available, instant) ----
  stopBtn.addEventListener("click", () => {
    stopImages();
    app.classList.add("hidden");
    gate.classList.remove("hidden");
    consentCheck.checked = false;
    enterBtn.disabled = true;
  });

  // ---- Init ----
  renderItems();
  renderMeter();
})();
