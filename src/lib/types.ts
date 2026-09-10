export interface Widget {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSize: 'small' | 'medium' | 'large';
}

export interface Provider<T> {
  id: string;
  name: string;
  getData: () => Promise<T>;
  refresh: () => Promise<void>;
}
