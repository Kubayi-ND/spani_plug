import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useJobs = (skillFilter?: string) => {
  return useQuery({
    queryKey: ["jobs", skillFilter],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select(`
          *,
          profiles!jobs_client_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (skillFilter && skillFilter !== "all") {
        query = query.eq("skill_required", skillFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(job => ({
        ...job,
        client: Array.isArray(job.profiles) ? job.profiles[0] : job.profiles
      }));
    },
  });
};

export const useJob = (jobId?: string) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          profiles!jobs_client_id_fkey(
            full_name,
            avatar_url,
            phone
          )
        `)
        .eq("id", jobId)
        .single();

      if (error) throw error;

      return {
        ...data,
        client: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      };
    },
    enabled: !!jobId,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: {
      client_id: string;
      title: string;
      description: string;
      skill_required: string;
      location: string;
      budget_min?: number;
      budget_max?: number;
      images?: string[];
    }) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert([{
          ...jobData,
          skill_required: jobData.skill_required as any,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      title?: string;
      description?: string;
      status?: string;
      budget_min?: number;
      budget_max?: number;
    }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useMyJobs = (clientId: string) => {
  return useQuery({
    queryKey: ["my-jobs", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};
