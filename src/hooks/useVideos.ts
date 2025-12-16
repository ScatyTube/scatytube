import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SortOption = "views" | "rating" | "recent" | "comments" | "favorites";

interface UseVideosOptions {
  sort?: SortOption;
  category?: string;
  search?: string;
  limit?: number;
  userId?: string;
}

export const useVideos = (options: UseVideosOptions = {}) => {
  const { sort = "recent", category, search, limit = 20, userId } = options;

  return useQuery({
    queryKey: ["videos", sort, category, search, limit, userId],
    queryFn: async () => {
      let query = supabase
        .from("videos")
        .select(`
          *,
          profiles!videos_user_id_fkey (username, avatar_url)
        `);

      if (category) {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (userId) {
        query = query.eq("user_id", userId);
      }

      // Sort based on option
      switch (sort) {
        case "views":
          query = query.order("views_count", { ascending: false });
          break;
        case "rating":
          query = query.order("likes_count", { ascending: false });
          break;
        case "comments":
          query = query.order("comments_count", { ascending: false });
          break;
        case "favorites":
          query = query.order("likes_count", { ascending: false });
          break;
        case "recent":
        default:
          query = query.order("created_at", { ascending: false });
      }

      query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;

      // Get ratings for each video
      const videosWithRatings = await Promise.all(
        (data || []).map(async (video) => {
          const { data: ratingData } = await supabase.rpc("get_video_rating", {
            video_uuid: video.id,
          });
          return {
            ...video,
            rating: ratingData || 0,
          };
        })
      );

      return videosWithRatings;
    },
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles!videos_user_id_fkey (id, username, avatar_url, subscribers_count)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: ratingData } = await supabase.rpc("get_video_rating", {
        video_uuid: id,
      });

      return { ...data, rating: ratingData || 0 };
    },
    enabled: !!id,
  });
};

export const useFavoriteVideos = (userId: string) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          video_id,
          videos (
            *,
            profiles!videos_user_id_fkey (username, avatar_url)
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data?.map((f) => f.videos).filter(Boolean) || [];
    },
    enabled: !!userId,
  });
};
