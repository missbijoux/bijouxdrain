// bijouxdrain background service worker.
// Clicking the toolbar icon toggles the overlay on the active Throne tab.

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "BIJOUX_TOGGLE" }).catch(() => {
    // No content script on this tab (not throne.com/bijoux) — ignore.
  });
});
