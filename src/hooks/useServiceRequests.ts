import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useServiceRequests = (userId: string, userType: "client" | "provider") => {
  return useQuery({
    queryKey: ["service-requests", userId, userType],
    queryFn: async () => {
      const column = userType === "client" ? "client_id" : "provider_id";
      
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          client:profiles!service_requests_client_id_fkey(
            full_name,
            avatar_url,
            phone
          ),
          provider:profiles!service_requests_provider_id_fkey(
            full_name,
            avatar_url,
            phone
          )
        `)
        .eq(column, userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(request => ({
        ...request,
        client: Array.isArray(request.client) ? request.client[0] : request.client,
        provider: Array.isArray(request.provider) ? request.provider[0] : request.provider
      }));
    },
    enabled: !!userId,
  });
};

export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: {
      client_id: string;
      provider_id: string;
      title: string;
      description: string;
      media_urls?: string[];
    }) => {
      const { data, error } = await supabase
        .from("service_requests")
        .insert(requestData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};

export const useUpdateServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: {
      id: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
};
