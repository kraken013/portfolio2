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

export interface DailyUniqueVisitorsStats {
  date: string;
  uniqueVisitors: number;
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
    dailyUniqueVisitorsStats: [] as DailyUniqueVisitorsStats[], // Ajouté pour les statistiques des visiteurs uniques
  });

  return {
    subscribe,

    async recordPageView(path: string) {
      const visitorId = getOrSetVisitorId();
      const timestamp = new Date().toISOString();

      // Vérifier si une vue de page avec le même visitor_id et path existe déjà dans les 30 dernières minutes
      const { data: existingPageView, error: checkError } = await supabase
        .from("page_views")
        .select("id")
        .eq("visitor_id", visitorId)
        .eq("path", path)
        .gte(
          "timestamp",
          new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
        )
        .limit(1);

      if (checkError) throw checkError;

      // Si une vue existe déjà dans la période des 30 dernières minutes, on la considère comme un doublon
      if (existingPageView?.length > 0) {
        console.log(
          "Duplicate page view detected within the last 30 minutes, skipping insert."
        );
        return;
      }

      // Si aucune vue n'existe, on peut enregistrer la nouvelle vue de page
      const pageView = {
        path,
        timestamp,
        user_agent: navigator.userAgent,
        visitor_id: visitorId,
      };

      const { error } = await supabase.from("page_views").insert([pageView]);

      if (error) throw error;

      // Après avoir enregistré, on recharge les statistiques
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

      // Get total unique visitors
      const { data: uniqueVisitorsData, error: uniqueVisitorsError } =
        await supabase.from("page_views").select("visitor_id", {
          count: "exact",
          ...({ distinct: "visitor_id" } as unknown as { count?: "exact" }),
        });
      if (uniqueVisitorsError) throw uniqueVisitorsError;

      const uniqueVisitors = uniqueVisitorsData?.length || 0;

      // Get daily unique visitors (last 24h)
      const { data: dailyUniqueVisitorsData, error: dailyUniqueVisitorsError } =
        await supabase
          .from("page_views")
          .select("visitor_id")
          .gte("timestamp", oneDayAgo.toISOString());

      if (dailyUniqueVisitorsError) throw dailyUniqueVisitorsError;

      // Enlever les doublons en utilisant un Set pour `visitor_id`
      const uniqueVisitorsInLast24Hours = new Set(
        dailyUniqueVisitorsData?.map((view) => view.visitor_id)
      );
      const dailyUniqueVisitors = uniqueVisitorsInLast24Hours.size || 0;

      // Get daily stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData, error: dailyDataError } = await supabase
        .from("page_views")
        .select("timestamp, visitor_id")
        .gte("timestamp", thirtyDaysAgo.toISOString());

      if (dailyDataError) throw dailyDataError;

      // Organiser les données des visiteurs uniques par jour
      const uniqueVisitorsPerDay = dailyData?.reduce((acc, view) => {
        const date = new Date(view.timestamp).toISOString().split("T")[0]; // On extrait la date au format YYYY-MM-DD
        acc[date] = acc[date] || new Set();
        acc[date].add(view.visitor_id); // Ajouter visitor_id pour garantir l'unicité
        return acc;
      }, {} as Record<string, Set<string>>);

      // Convertir les Sets en nombre de visiteurs uniques pour chaque jour
      const dailyUniqueVisitorsStats = Object.entries(
        uniqueVisitorsPerDay || {}
      ).map(([date, visitorIds]) => ({
        date,
        uniqueVisitors: visitorIds.size,
      }));

      // Préparer les statistiques de visites quotidiennes sous forme d'un tableau de {date, views}
      const dailyStats = dailyData?.reduce((acc, view) => {
        const date = new Date(view.timestamp).toISOString().split("T")[0]; // On extrait la date au format YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convertir dailyStats en tableau de type DailyStats[]
      const dailyStatsArray: DailyStats[] = Object.entries(
        dailyStats || {}
      ).map(([date, views]) => ({
        date,
        views,
      }));

      // Get popular pages
      const { data: pageViews, error: pageViewsError } = await supabase
        .from("page_views")
        .select("path");

      if (pageViewsError) throw pageViewsError;

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

      // Mettre à jour le store avec toutes les données calculées
      set({
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitors || 0, // Total unique visitors
        dailyUniqueVisitors: dailyUniqueVisitors || 0, // Daily unique visitors
        dailyStats: dailyStatsArray, // Utilisation de dailyStatsArray ici
        popularPages,
        recentVisits:
          recentVisits?.map((visit) => ({
            ...visit,
            timestamp: new Date(visit.timestamp),
          })) || [],
        dailyUniqueVisitorsStats, // Ajouter ces données pour les graphiques
      });
    },
  };
}

export const statsStore = createStatsStore();
