export interface Provider<T> {
  id: string;
  name: string;
  status: 'idle' | 'loading' | 'error' | 'ready';
  permissions: string[];
  error?: string;

  initialize(): Promise<void>;
  getData(): Promise<T>;
  refresh(): Promise<void>;
  subscribe(callback: (data: T) => void): () => void;
  cleanup(): Promise<void>;
}
