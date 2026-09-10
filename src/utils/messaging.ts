import { Message } from '../types/index';

export async function sendMessage<R = any>(message: Message): Promise<R> {
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
