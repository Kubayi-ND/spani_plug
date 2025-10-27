import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  serviceStats: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
  };
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  monthlyStats: {
    month: string;
    providers: number;
    customers: number;
    services: number;
  }[];
}

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      // Get service request stats
      const servicesRes = await (supabase as any)
        .from("service_requests")
        .select(`
          id,
          status,
          created_at
        `);
      if (servicesRes.error) throw servicesRes.error;

      // Get rating distribution
      const ratingsRes = await (supabase as any)
        .from("reviews")
        .select("rating");
      if (ratingsRes.error) throw ratingsRes.error;

      // Get monthly signups
      const signupsRes = await (supabase as any)
        .from("profiles")
        .select(`
          id,
          role,
          created_at
        `);
      if (signupsRes.error) throw signupsRes.error;

      const services = servicesRes.data || [];
      const ratings = ratingsRes.data || [];
      const signups = signupsRes.data || [];

      // Calculate service stats
      const serviceStats = {
        total: services.length,
        completed: services.filter((s: any) => s.status === "completed").length,
        inProgress: services.filter((s: any) => s.status === "in_progress").length,
        cancelled: services.filter((s: any) => s.status === "cancelled").length,
      };

      // Calculate rating distribution
      const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
        rating: i + 1,
        count: ratings.filter((r: any) => Math.round(r.rating) === i + 1).length,
      }));

      // Calculate monthly stats for the last 6 months
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM format
      }).reverse();

      const monthlyStats = months.map(month => {
        const startDate = new Date(month);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

        return {
          month: new Date(month).toLocaleString('default', { month: 'short', year: '2-digit' }),
          providers: signups.filter((s: any) => 
            s.role === "provider" &&
            new Date(s.created_at) >= startDate &&
            new Date(s.created_at) <= endDate
          ).length,
          customers: signups.filter((s: any) => 
            s.role === "customer" &&
            new Date(s.created_at) >= startDate &&
            new Date(s.created_at) <= endDate
          ).length,
          services: services.filter((s: any) =>
            new Date(s.created_at) >= startDate &&
            new Date(s.created_at) <= endDate
          ).length,
        };
      });

      return {
        serviceStats,
        ratingDistribution,
        monthlyStats,
      };
    },
  });
};