import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminKPI {
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
}

export interface RecentActivity {
  id: string;
  type: 'signup' | 'review' | 'profile_update' | 'verification';
  user: string;
  role?: string;
  action?: string;
  time: string;
}

export const useAdminKPIs = () => {
  return useQuery({
    queryKey: ["admin-kpis"],
    queryFn: async () => {
      // Get provider count and stats
      const providersRes = await (supabase as any)
        .from("provider_profiles")
        .select(`
          id,
          rating,
          created_at
        `);
      if (providersRes.error) throw providersRes.error;

      // Get customer count
      const customersRes = await (supabase as any)
        .from("profiles")
        .select("id")
        .eq("role", "customer");
      if (customersRes.error) throw customersRes.error;

      // Get review stats
      const reviewsRes = await (supabase as any)
        .from("reviews")
        .select("rating");
      if (reviewsRes.error) throw reviewsRes.error;

      // Calculate statistics
      const providers = providersRes.data || [];
      const customers = customersRes.data || [];
      const reviews = reviewsRes.data || [];
      
      const avgRating = reviews.length > 0
        ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

      // Calculate weekly changes (this is simplified - in production you'd compare with last week's data)
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const newProviders = providers.filter((p: any) => 
        new Date(p.created_at) > weekAgo
      ).length;

      const kpis: AdminKPI[] = [
        {
          label: "Total Providers",
          value: providers.length,
          change: newProviders,
          changeLabel: `+${newProviders} this week`
        },
        {
          label: "Total Customers",
          value: customers.length,
          change: 0, // You'd calculate this from historical data
          changeLabel: "this week"
        },
        {
          label: "Average Rating",
          value: avgRating,
          change: 0,
          changeLabel: "this month"
        }
      ];

      return kpis;
    },
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      // Get recent profile creations
      const signupsRes = await (supabase as any)
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (signupsRes.error) throw signupsRes.error;

      // Get recent reviews
      const reviewsRes = await (supabase as any)
        .from("reviews")
        .select(`
          *,
          profiles!reviews_client_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (reviewsRes.error) throw reviewsRes.error;

      // Combine and sort activities
      const activities: RecentActivity[] = [
        ...(signupsRes.data || []).map((p: any) => ({
          id: p.user_id,
          type: 'signup',
          user: p.full_name,
          role: p.role,
          time: new Date(p.created_at).toISOString()
        })),
        ...(reviewsRes.data || []).map((r: any) => ({
          id: r.id,
          type: 'review',
          user: r.profiles?.full_name || 'Unknown User',
          action: 'left a review',
          time: new Date(r.created_at).toISOString()
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
       .slice(0, 10)
       .map(activity => ({
         ...activity,
         time: formatTimeAgo(new Date(activity.time))
       }));

      return activities;
    }
  });
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}