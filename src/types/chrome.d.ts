declare const chrome: {
  runtime?: {
    sendMessage: (message: unknown, callback: (response?: { success?: boolean; data?: any; error?: string }) => void) => void;
    lastError?: { message?: string };
  };
};
