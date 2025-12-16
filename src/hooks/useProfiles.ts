import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useChannels = (limit = 20) => {
  return useQuery({
    queryKey: ["channels", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("subscribers_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: { username?: string; bio?: string; avatar_url?: string } }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
    },
  });
};

export const useSubscription = (subscriberId: string, channelId: string) => {
  return useQuery({
    queryKey: ["subscription", subscriberId, channelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("subscriber_id", subscriberId)
        .eq("channel_id", channelId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!subscriberId && !!channelId,
  });
};

export const useToggleSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriberId, channelId, isSubscribed }: { subscriberId: string; channelId: string; isSubscribed: boolean }) => {
      if (isSubscribed) {
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("subscriber_id", subscriberId)
          .eq("channel_id", channelId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert({ subscriber_id: subscriberId, channel_id: channelId });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscription", variables.subscriberId, variables.channelId] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};
