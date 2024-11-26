import { writable } from 'svelte/store';
import { supabase } from '../supabase';

export interface PageView {
  path: string;
  timestamp: Date;
  userAgent: string;
}

export interface DailyStats {
  date: string;
  views: number;
}

function createStatsStore() {
  const { subscribe, set } = writable({
    totalVisits: 0,
    dailyStats: [] as DailyStats[],
    popularPages: [] as { path: string; views: number }[],
    recentVisits: [] as PageView[]
  });

  return {
    subscribe,

    async recordPageView(path: string) {
      const pageView = {
        path,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      const { error } = await supabase
        .from('page_views')
        .insert([pageView]);

      if (error) throw error;

      this.loadStats();
    },

    async loadStats() {
      // Get total visits
      const { count: totalVisits } = await supabase
        .from('page_views')
        .select('*', { count: 'exact' });

      // Get daily stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData } = await supabase
        .from('page_views')
        .select('timestamp')
        .gte('timestamp', thirtyDaysAgo.toISOString());

      const dailyStats = dailyData?.reduce((acc, view) => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get popular pages
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('path');

      const popularPages = Object.entries(
        pageViews?.reduce((acc, view) => {
          acc[view.path] = (acc[view.path] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      )
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Get recent visits (last 24h)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: recentVisits } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', oneDayAgo.toISOString())
        .order('timestamp', { ascending: false });

      set({
        totalVisits: totalVisits || 0,
        dailyStats: Object.entries(dailyStats || {}).map(([date, views]) => ({
          date,
          views
        })),
        popularPages,
        recentVisits: recentVisits?.map(visit => ({
          ...visit,
          timestamp: new Date(visit.timestamp)
        })) || []
      });
    }
  };
}

export const statsStore = createStatsStore();