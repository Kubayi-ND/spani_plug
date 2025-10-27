import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  status: "unread" | "read";
  related_id: string | null;
  related_type: string | null;
  metadata: Record<string, any>;
  created_at: string;
  read_at: string | null;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Setup realtime subscriptions
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            if (payload.eventType === "INSERT") {
              const notification = payload.new as Notification;
              toast(notification.title, {
                description: notification.message,
                duration: 5000,
                className: `notification-${notification.type}`,
              });
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);

  // Fetch notifications with pagination and filtering
  const fetchNotifications = async (params: {
    page?: number;
    limit?: number;
    status?: "read" | "unread" | "all";
  } = {}) => {
    const { page = 1, limit = 10, status = "all" } = params;
    const offset = (page - 1) * limit;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { notifications: [], total: 0 };

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      notifications: data as Notification[],
      total: count || 0,
    };
  };

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ 
          status: "read", 
          read_at: new Date().toISOString() 
        })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .update({ status: "read", read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("status", "unread");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  // Delete a notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  // Delete multiple notifications
  const deleteMultiple = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .in("id", notificationIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Selected notifications deleted");
    },
  });

  // Get unread count
  const getUnreadCount = () => {
    return notificationsData?.notifications.filter(
      (n) => n.status === "unread"
    ).length || 0;
  };

  return {
    notifications: notificationsData?.notifications || [],
    totalCount: notificationsData?.total || 0,
    unreadCount: getUnreadCount(),
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    deleteMultiple: deleteMultiple.mutate,
    fetchNotifications,
  };
};
