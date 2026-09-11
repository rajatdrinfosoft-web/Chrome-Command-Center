// Background script for Chrome Extension
console.log("Chrome Command Center background service worker started.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      // History
      case 'GET_HISTORY': {
        const text = message.query || '';
        const maxResults = message.maxResults || 100;
        chrome.history.search({ text, maxResults, startTime: message.startTime || 0 }, (historyItems) => {
          sendResponse({ success: true, data: historyItems });
        });
        return true;
      }
      case 'DELETE_HISTORY': {
        if (message.url) {
          chrome.history.deleteUrl({ url: message.url }, () => {
            sendResponse({ success: true });
          });
          return true;
        }
        sendResponse({ success: false, error: 'URL required' });
        return false;
      }
      case 'CLEAR_HISTORY': {
        chrome.history.deleteAll(() => {
          sendResponse({ success: true });
        });
        return true;
      }

      // Bookmarks
      case 'GET_BOOKMARKS': {
        chrome.bookmarks.getTree((tree) => {
          sendResponse({ success: true, data: tree });
        });
        return true;
      }
      case 'CREATE_BOOKMARK': {
        chrome.bookmarks.create({
          parentId: message.parentId,
          title: message.title,
          url: message.url
        }, (bookmark) => {
          sendResponse({ success: true, data: bookmark });
        });
        return true;
      }
      case 'REMOVE_BOOKMARK': {
        if (message.id) {
          chrome.bookmarks.remove(message.id, () => {
            sendResponse({ success: true });
          });
          return true;
        }
        sendResponse({ success: false, error: 'Bookmark ID required' });
        return false;
      }

      // Tabs
      case 'GET_TABS': {
        chrome.tabs.query({}, (tabs) => {
          sendResponse({ success: true, data: tabs });
        });
        return true;
      }
      case 'CREATE_TAB': {
        chrome.tabs.create({ url: message.url, active: message.active ?? true }, (tab) => {
          sendResponse({ success: true, data: tab });
        });
        return true;
      }
      case 'CLOSE_TAB': {
        if (message.tabId) {
          chrome.tabs.remove(message.tabId, () => {
            sendResponse({ success: true });
          });
          return true;
        }
        sendResponse({ success: false, error: 'Tab ID required' });
        return false;
      }
      case 'ACTIVATE_TAB': {
        if (message.tabId) {
          chrome.tabs.update(message.tabId, { active: true }, (tab) => {
            if (tab && tab.windowId) {
              chrome.windows.update(tab.windowId, { focused: true });
            }
            sendResponse({ success: true, data: tab });
          });
          return true;
        }
        sendResponse({ success: false, error: 'Tab ID required' });
        return false;
      }

      // Sessions / Recently Closed
      case 'GET_RECENTLY_CLOSED': {
        if (chrome.sessions && chrome.sessions.getRecentlyClosed) {
          chrome.sessions.getRecentlyClosed({ maxResults: message.maxResults || 25 }, (sessions) => {
            sendResponse({ success: true, data: sessions });
          });
          return true;
        }
        sendResponse({ success: true, data: [] });
        return false;
      }
      case 'RESTORE_SESSION': {
        if (chrome.sessions && chrome.sessions.restore) {
          chrome.sessions.restore(message.sessionId, (restoredSession) => {
            sendResponse({ success: true, data: restoredSession });
          });
          return true;
        }
        sendResponse({ success: false, error: 'Sessions API not available' });
        return false;
      }

      // Extensions
      case 'GET_EXTENSIONS': {
        if (chrome.management && chrome.management.getAll) {
          chrome.management.getAll((extensions) => {
            sendResponse({ success: true, data: extensions });
          });
          return true;
        }
        sendResponse({ success: true, data: [] });
        return false;
      }

      default:
        sendResponse({ success: false, error: `Unknown message type: ${message.type}` });
        return false;
    }
  } catch (err) {
    sendResponse({ success: false, error: err?.message || 'Internal error' });
    return false;
  }
});
