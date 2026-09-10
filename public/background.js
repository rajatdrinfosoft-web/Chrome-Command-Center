// Background script for Chrome Extension
console.log("Chrome Command Center background service worker started.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_HISTORY') {
    chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
      sendResponse({ success: true, data: historyItems });
    });
    return true; // Keep the message channel open for async response
  }
});
