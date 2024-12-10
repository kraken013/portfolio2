import { writable } from "svelte/store";
import { supabase } from "../supabase";

export interface PageView {
  path: string;
  timestamp: Date;
  user_agent: string;
  visitor_id: string;
}

export interface DailyStats {
  date: string;
  views: number;
}

function getOrSetVisitorId(): string {
  const visitorIdKey = "visitor_id";
  let visitorId = localStorage.getItem(visitorIdKey);

  if (!visitorId) {
    visitorId = crypto.randomUUID(); // Génère un identifiant unique
    localStorage.setItem(visitorIdKey, visitorId);
  }

  return visitorId;
}

function createStatsStore() {
  const { subscribe, set } = writable({
    totalVisits: 0,
    uniqueVisitors: 0,
    dailyUniqueVisitors: 0,
    dailyStats: [] as DailyStats[],
    popularPages: [] as { path: string; views: number }[],
    recentVisits: [] as PageView[],
  });

  return {
    subscribe,

    async recordPageView(path: string) {
      const pageView = {
        path,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        visitor_id: getOrSetVisitorId(), // Ajout de l'identifiant visiteur
      };

      const { error } = await supabase.from("page_views").insert([pageView]);

      if (error) throw error;

      await statsStore.loadStats();
    },

    async loadStats() {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Get total visits
      const { count: totalVisits, error: totalVisitsError } = await supabase
        .from("page_views")
        .select("*", { count: "exact" });

      if (totalVisitsError) throw totalVisitsError;
      // console.log("Total Visits:", totalVisits);

      // Get total unique visitors
      const { data: uniqueVisitorsData, error: uniqueVisitorsError } =
        await supabase.from("page_views").select("visitor_id", {
          count: "exact",
          ...({ distinct: "visitor_id" } as unknown as { count?: "exact" }),
        });
      if (uniqueVisitorsError) throw uniqueVisitorsError;

      const uniqueVisitors = uniqueVisitorsData?.length || 0;
      // console.log("Unique Visitors:", uniqueVisitors);

      // Get daily unique visitors (last 24h)
      const { data: dailyUniqueVisitorsData, error: dailyUniqueVisitorsError } =
        await supabase
          .from("page_views")
          .select("visitor_id", {
            count: "exact",
            ...({ distinct: "visitor_id" } as unknown as { count?: "exact" }),
          })
          .gte("timestamp", oneDayAgo.toISOString());
      if (dailyUniqueVisitorsError) throw dailyUniqueVisitorsError;

      const dailyUniqueVisitors = dailyUniqueVisitorsData?.length || 0;
      // console.log("Daily Unique Visitors:", dailyUniqueVisitors);

      // Get daily stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData, error: dailyDataError } = await supabase
        .from("page_views")
        .select("timestamp")
        .gte("timestamp", thirtyDaysAgo.toISOString());

      if (dailyDataError) throw dailyDataError;

      // console.log("Daily Data:", dailyData);

      const dailyStats = dailyData?.reduce((acc, view) => {
        const date = new Date(view.timestamp).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get popular pages
      const { data: pageViews, error: pageViewsError } = await supabase
        .from("page_views")
        .select("path");

      if (pageViewsError) throw pageViewsError;
      // console.log("Page Views:", pageViews);

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
      const { data: recentVisits, error: recentVisitsError } = await supabase
        .from("page_views")
        .select("*")
        .gte("timestamp", oneDayAgo.toISOString())
        .order("timestamp", { ascending: false });

      if (recentVisitsError) throw recentVisitsError;

      // console.log("Recent Visits:", recentVisits);

      set({
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitors || 0, // Total unique visitors
        dailyUniqueVisitors: dailyUniqueVisitors || 0, // Daily unique visitors
        dailyStats: Object.entries(dailyStats || {}).map(([date, views]) => ({
          date,
          views,
        })),
        popularPages,
        recentVisits:
          recentVisits?.map((visit) => ({
            ...visit,
            timestamp: new Date(visit.timestamp),
          })) || [],
      });
    },
  };
}

export const statsStore = createStatsStore();
