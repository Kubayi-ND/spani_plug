import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["customer-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: {
      user_id: string;
      full_name?: string;
      bio?: string;
      location?: string;
      phone?: string;
      avatar_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile", variables.user_id] });
    },
  });
};

export const useCustomerHistory = (customerId: string) => {
  return useQuery({
    queryKey: ["customer-history", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_history")
        .select("*")
        .eq("customer_id", customerId)
        .order("service_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });
};

export const useAddCustomerHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (historyData: {
      customer_id: string;
      service_name: string;
      service_provider_name: string;
      service_date: string;
    }) => {
      const { data, error } = await supabase
        .from("customer_history")
        .insert(historyData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-history", variables.customer_id] });
    },
  });
};
