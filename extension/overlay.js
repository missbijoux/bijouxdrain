// bijouxdrain overlay content script (runs on throne.com/bijoux only).
//
// Design principles (intentional — keep them):
//  - Ambient only: floating images are click-through (pointer-events:none) and
//    never sit over / capture clicks meant for Throne. No clickjacking.
//  - No automation: gift buttons are explicit taps that open the real Throne
//    item. Nothing auto-adds, auto-checks-out, or auto-pays.
//  - Non-trapping: a visible close button always works; tab close, Escape,
//    back, and right-click are never blocked.

(function () {
  "use strict";

  const cfg = window.BIJOUX_CONFIG || {};
  const brand = cfg.brand || {};
  const imgCfg = cfg.images || {};
  const ovCfg = cfg.overlay || {};
  const colors = brand.colors || {};

  const IMG_OPACITY = typeof ovCfg.imageOpacity === "number" ? ovCfg.imageOpacity : 0.8;
  const CONSENT_KEY = "bjx_consent_ok";
  const POS_KEY = "bjx_panel_pos";

  let imagesPaused = true; // stays paused until consent accepted
  let imageTimer = null;
  let totalCents = 0;
  let giftCount = 0;

  // ---- Root container ----
  const overlay = document.createElement("div");
  overlay.id = "bjx-overlay";
  document.documentElement.appendChild(overlay);

  // ---- Helpers ----
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

  // ---- Control / brand panel ----
  let meterTotalEl, meterCountEl;

  function buildPanel() {
    const panel = document.createElement("div");
    panel.className = "bjx-panel";

    const head = document.createElement("div");
    head.className = "bjx-panel-head";

    const title = document.createElement("div");
    title.className = "bjx-title";
    title.textContent = brand.name || "bijouxdrain";

    const btns = document.createElement("div");
    btns.className = "bjx-head-btns";

    const pauseBtn = document.createElement("button");
    pauseBtn.className = "bjx-iconbtn";
    pauseBtn.title = "Pause / resume images";
    pauseBtn.textContent = "⏸";
    pauseBtn.onclick = () => {
      imagesPaused = !imagesPaused;
      pauseBtn.textContent = imagesPaused ? "▶" : "⏸";
    };

    const closeBtn = document.createElement("button");
    closeBtn.className = "bjx-iconbtn";
    closeBtn.title = "Close overlay";
    closeBtn.textContent = "✕";
    closeBtn.onclick = hideOverlay;

    btns.appendChild(pauseBtn);
    btns.appendChild(closeBtn);
    head.appendChild(title);
    head.appendChild(btns);
    panel.appendChild(head);

    // Meter
    const meter = document.createElement("div");
    meter.className = "bjx-meter";
    meterTotalEl = document.createElement("div");
    meterTotalEl.className = "bjx-meter-total";
    meterTotalEl.textContent = "$0";
    meterCountEl = document.createElement("div");
    meterCountEl.className = "bjx-meter-sub";
    meterCountEl.textContent = "0 gift(s) · you choose every one 💝";
    meter.appendChild(meterTotalEl);
    meter.appendChild(meterCountEl);
    panel.appendChild(meter);

    // Gift list
    if (ovCfg.showGiftPanel !== false) {
      const gifts = document.createElement("div");
      gifts.className = "bjx-gifts";
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      items.forEach((item) => {
        const a = document.createElement("a");
        a.className = "bjx-gift";
        a.href = item.throneUrl || brand.throneProfileUrl || "#";
        a.target = "_blank";
        a.rel = "noopener";

        const name = document.createElement("span");
        name.className = "bjx-gift-name";
        name.textContent = (item.emoji ? item.emoji + " " : "") + (item.title || "Gift");

        const price = document.createElement("span");
        price.className = "bjx-gift-price";
        price.textContent = item.price || "";

        a.appendChild(name);
        a.appendChild(price);
        a.addEventListener("click", () => {
          totalCents += parsePriceToCents(item.price);
          giftCount += 1;
          renderMeter();
        });
        gifts.appendChild(a);
      });
      panel.appendChild(gifts);
    }

    overlay.appendChild(panel);

    restorePanelPosition(panel);
    makeDraggable(panel, head);
  }

  // ---- Draggable panel (remembers position) ----
  function restorePanelPosition(panel) {
    try {
      const saved = JSON.parse(localStorage.getItem(POS_KEY) || "null");
      if (saved && typeof saved.left === "number" && typeof saved.top === "number") {
        const left = Math.max(0, Math.min(saved.left, window.innerWidth - 60));
        const top = Math.max(0, Math.min(saved.top, window.innerHeight - 40));
        panel.style.left = left + "px";
        panel.style.top = top + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
      }
    } catch (e) {
      /* ignore bad saved value */
    }
  }

  function makeDraggable(panel, handle) {
    let startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false;

    handle.addEventListener("mousedown", (e) => {
      // Don't start a drag when clicking the header buttons.
      if (e.target.closest("button")) return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + "px";
      panel.style.top = rect.top + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      e.preventDefault();
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    function onMove(e) {
      if (!dragging) return;
      let nl = origLeft + (e.clientX - startX);
      let nt = origTop + (e.clientY - startY);
      nl = Math.max(0, Math.min(nl, window.innerWidth - panel.offsetWidth));
      nt = Math.max(0, Math.min(nt, window.innerHeight - panel.offsetHeight));
      panel.style.left = nl + "px";
      panel.style.top = nt + "px";
    }

    function onUp() {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      try {
        localStorage.setItem(
          POS_KEY,
          JSON.stringify({ left: parseFloat(panel.style.left), top: parseFloat(panel.style.top) })
        );
      } catch (e) {
        /* ignore storage errors */
      }
    }
  }

  function renderMeter() {
    if (meterTotalEl) meterTotalEl.textContent = formatMoney(totalCents);
    if (meterCountEl) meterCountEl.textContent = giftCount + " gift(s) · you choose every one 💝";
  }

  // ---- Consent bar ----
  function showConsent() {
    if (localStorage.getItem(CONSENT_KEY) === "1") {
      startImages();
      return;
    }
    const bar = document.createElement("div");
    bar.className = "bjx-consent";

    const text = document.createElement("span");
    text.innerHTML =
      "<strong>bijouxdrain</strong> — 18+ consensual experience. Nothing is automatic; you choose and confirm every gift on Throne, and you can close this overlay any time.";

    const ok = document.createElement("button");
    ok.className = "bjx-btn bjx-btn-primary";
    ok.textContent = "I'm 18+ — start";
    ok.onclick = () => {
      localStorage.setItem(CONSENT_KEY, "1");
      bar.remove();
      startImages();
    };

    const no = document.createElement("button");
    no.className = "bjx-btn bjx-btn-ghost";
    no.textContent = "Close";
    no.onclick = hideOverlay;

    bar.appendChild(text);
    bar.appendChild(ok);
    bar.appendChild(no);
    overlay.appendChild(bar);
  }

  // ---- Images ----
  async function nextImageUrl() {
    if (imgCfg.endpoint) {
      try {
        const res = await fetch(imgCfg.endpoint, { cache: "no-store" });
        const data = await res.json();
        if (data && data.url) {
          return data.url.startsWith("http")
            ? data.url
            : imgCfg.endpoint.replace(/\/api\/.*$/, "") + data.url;
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
    if (imagesPaused) return;
    const max = imgCfg.maxOnScreen || 12;
    const existing = overlay.querySelectorAll(".bjx-img");
    if (existing.length >= max) existing[0].remove();

    const url = await nextImageUrl();
    if (!url) return;

    const img = document.createElement("img");
    img.className = "bjx-img";
    img.src = url;
    img.alt = "";
    img.style.opacity = "0";
    img.style.left = Math.random() * Math.max(0, window.innerWidth - 440) + "px";
    img.style.top = Math.random() * Math.max(0, window.innerHeight - 440) + "px";
    img.onerror = () => img.remove();

    overlay.appendChild(img);
    requestAnimationFrame(() => {
      img.classList.add("bjx-show");
      img.style.opacity = String(IMG_OPACITY);
    });

    setTimeout(() => {
      img.style.opacity = "0";
      img.classList.remove("bjx-show");
      setTimeout(() => img.remove(), 600);
    }, 5000);
  }

  function startImages() {
    imagesPaused = false;
    const interval = imgCfg.spawnIntervalMs || 1500;
    if (imageTimer) clearInterval(imageTimer);
    spawnImage();
    imageTimer = setInterval(spawnImage, interval);
  }

  function clearImages() {
    if (imageTimer) clearInterval(imageTimer);
    imageTimer = null;
    overlay.querySelectorAll(".bjx-img").forEach((i) => i.remove());
  }

  // ---- Show / hide ----
  let reopenPill = null;

  function hideOverlay() {
    clearImages();
    imagesPaused = true;
    overlay.classList.add("bjx-hidden");

    if (!reopenPill) {
      reopenPill = document.createElement("button");
      reopenPill.className = "bjx-reopen";
      reopenPill.textContent = "💝 bijouxdrain";
      reopenPill.onclick = showOverlay;
      document.documentElement.appendChild(reopenPill);
    }
    reopenPill.style.display = "block";
  }

  function showOverlay() {
    overlay.classList.remove("bjx-hidden");
    if (reopenPill) reopenPill.style.display = "none";
    if (localStorage.getItem(CONSENT_KEY) === "1") startImages();
  }

  function toggleOverlay() {
    if (overlay.classList.contains("bjx-hidden")) showOverlay();
    else hideOverlay();
  }

  // Toolbar icon toggles the overlay.
  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg && msg.type === "BIJOUX_TOGGLE") toggleOverlay();
    });
  }

  // ---- Init ----
  buildPanel();
  renderMeter();
  if (ovCfg.autoStart === false) {
    hideOverlay();
  } else {
    showConsent();
  }
})();
