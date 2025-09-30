// src/background.ts
chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({
    windowId: chrome.windows.WINDOW_ID_CURRENT as number,
  });
});
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "openSidePanel") {
    chrome.sidePanel.open({ windowId: sender?.tab?.windowId as number });
  }
});

// (Optional) If you previously had a popup, force-disable it at runtime:
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({ popup: "" });
});
