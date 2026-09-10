import { Provider } from '../lib/types';

export interface SessionData {
  hour: number;
  activityLevel: number;
}

export const SessionHeatmapProvider: Provider<SessionData[]> = {
  id: 'sessionHeatmap',
  name: 'Session Heatmap',
  getData: async () => {
    // Generate mock data representing 24 hours
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activityLevel: Math.random() * 100,
    }));
  },
  refresh: async () => {},
};
