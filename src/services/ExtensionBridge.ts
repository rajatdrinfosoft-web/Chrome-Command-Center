import { Message } from '../types/index';

export class ExtensionBridge {
  static async send<R = any>(message: Message): Promise<R> {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
      console.warn('Chrome runtime not available, mocking response.');
      return [] as R;
    }
    
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response?.success === false) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });
    });
  }
}
