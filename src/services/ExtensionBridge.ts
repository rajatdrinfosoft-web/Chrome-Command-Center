export interface ExtensionMessage {
  type: string;
  [key: string]: any;
}

export class ExtensionBridge {
  static isExtensionAvailable(): boolean {
    return typeof chrome !== 'undefined' && Boolean(chrome.runtime && chrome.runtime.id);
  }

  static async send<R = any>(message: ExtensionMessage): Promise<R> {
    if (!this.isExtensionAvailable() || !chrome.runtime.sendMessage) {
      return [] as unknown as R;
    }
    
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response?.success === false) {
            reject(new Error(response.error || 'Extension request failed'));
          } else {
            resolve(response?.data !== undefined ? response.data : response);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Bookmarks
  static async getBookmarks(): Promise<any[]> {
    if (typeof chrome !== 'undefined' && chrome.bookmarks && chrome.bookmarks.getTree) {
      return new Promise((resolve) => {
        chrome.bookmarks.getTree((tree) => resolve(tree || []));
      });
    }
    return this.send({ type: 'GET_BOOKMARKS' });
  }

  static async createBookmark(title: string, url: string, parentId?: string): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.bookmarks && chrome.bookmarks.create) {
      return new Promise((resolve) => {
        chrome.bookmarks.create({ title, url, parentId }, resolve);
      });
    }
    return this.send({ type: 'CREATE_BOOKMARK', title, url, parentId });
  }

  static async removeBookmark(id: string): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.bookmarks && chrome.bookmarks.remove) {
      return new Promise((resolve) => {
        chrome.bookmarks.remove(id, () => resolve(true));
      });
    }
    const res = await this.send({ type: 'REMOVE_BOOKMARK', id });
    return Boolean(res);
  }

  // Tabs
  static async getTabs(): Promise<any[]> {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      return new Promise((resolve) => {
        chrome.tabs.query({}, (tabs) => resolve(tabs || []));
      });
    }
    return this.send({ type: 'GET_TABS' });
  }

  static async createTab(url?: string, active = true): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      return new Promise((resolve) => {
        chrome.tabs.create({ url, active }, resolve);
      });
    }
    return this.send({ type: 'CREATE_TAB', url, active });
  }

  static async closeTab(tabId: number): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.remove) {
      return new Promise((resolve) => {
        chrome.tabs.remove(tabId, () => resolve(true));
      });
    }
    const res = await this.send({ type: 'CLOSE_TAB', tabId });
    return Boolean(res);
  }

  static async activateTab(tabId: number): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.update) {
      return new Promise((resolve) => {
        chrome.tabs.update(tabId, { active: true }, resolve);
      });
    }
    return this.send({ type: 'ACTIVATE_TAB', tabId });
  }

  // History
  static async getHistory(query = '', maxResults = 100, startTime = 0): Promise<any[]> {
    if (typeof chrome !== 'undefined' && chrome.history && chrome.history.search) {
      return new Promise((resolve) => {
        chrome.history.search({ text: query, maxResults, startTime }, (items) => resolve(items || []));
      });
    }
    return this.send({ type: 'GET_HISTORY', query, maxResults, startTime });
  }

  static async deleteHistoryUrl(url: string): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.history && chrome.history.deleteUrl) {
      return new Promise((resolve) => {
        chrome.history.deleteUrl({ url }, () => resolve(true));
      });
    }
    const res = await this.send({ type: 'DELETE_HISTORY', url });
    return Boolean(res);
  }

  static async clearHistory(): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.history && chrome.history.deleteAll) {
      return new Promise((resolve) => {
        chrome.history.deleteAll(() => resolve(true));
      });
    }
    const res = await this.send({ type: 'CLEAR_HISTORY' });
    return Boolean(res);
  }

  // Sessions
  static async getRecentlyClosed(maxResults = 25): Promise<any[]> {
    if (typeof chrome !== 'undefined' && chrome.sessions && chrome.sessions.getRecentlyClosed) {
      return new Promise((resolve) => {
        chrome.sessions.getRecentlyClosed({ maxResults }, (items) => resolve(items || []));
      });
    }
    return this.send({ type: 'GET_RECENTLY_CLOSED', maxResults });
  }

  static async restoreSession(sessionId: string): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.sessions && chrome.sessions.restore) {
      return new Promise((resolve) => {
        chrome.sessions.restore(sessionId, resolve);
      });
    }
    return this.send({ type: 'RESTORE_SESSION', sessionId });
  }
}

