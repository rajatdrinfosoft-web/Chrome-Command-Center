declare const chrome: {
  runtime?: {
    id?: string;
    sendMessage: (message: unknown, callback: (response?: { success?: boolean; data?: any; error?: string }) => void) => void;
    lastError?: { message?: string };
  };
  bookmarks?: any;
  tabs?: any;
  history?: any;
  sessions?: any;
};
