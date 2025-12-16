import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, ThumbsUp, ThumbsDown, MessageSquare, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import { useVideo, useVideos } from "@/hooks/useVideos";
import { useComments, useAddComment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, useToggleSubscription } from "@/hooks/useProfiles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { data: video, isLoading: videoLoading } = useVideo(id || "");
  const { data: comments } = useComments(id || "");
  const { data: relatedVideos } = useVideos({ limit: 5 });
  const addComment = useAddComment();

  const { data: subscription } = useSubscription(
    user?.id || "",
    video?.profiles?.id || ""
  );
  const toggleSubscription = useToggleSubscription();

  const rateVideo = useMutation({
    mutationFn: async (rating: number) => {
      if (!user || !id) throw new Error("Must be logged in");
      
      const { data: existing } = await supabase
        .from("video_ratings")
        .select("id")
        .eq("video_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("video_ratings")
          .update({ rating })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("video_ratings")
          .insert({ video_id: id, user_id: user.id, rating });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", id] });
      toast.success("Rating saved!");
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error("Must be logged in");
      
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("video_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ video_id: id, user_id: user.id });
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (added) => {
      toast.success(added ? "Added to favorites!" : "Removed from favorites");
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!comment.trim()) return;

    addComment.mutate(
      { videoId: id!, content: comment, userId: user.id },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Comment posted!");
        },
        onError: () => {
          toast.error("Failed to post comment");
        },
      }
    );
  };

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }
    if (!video?.profiles?.id) return;

    toggleSubscription.mutate({
      subscriberId: user.id,
      channelId: video.profiles.id,
      isSubscribed: !!subscription,
    });
  };

  if (videoLoading) {
    return (
      <Layout>
        <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
          Video not found
        </div>
      </Layout>
    );
  }

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    return views.toLocaleString();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Main Video */}
          <div className="flex-1">
            <div className="border border-border rounded">
              <div className="box-header-2007">{video.title}</div>
              <div className="bg-card p-2">
                {/* Video Player */}
                <div className="bg-black aspect-video flex items-center justify-center">
                  {video.video_url ? (
                    <video
                      src={video.video_url}
                      controls
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={video.thumbnail_url || "https://picsum.photos/seed/default/640/360"}
                      alt={video.title}
                      className="max-w-full max-h-full"
                    />
                  )}
                </div>

                {/* Video Info */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {formatViews(video.views_count)} views
                      </span>
                      <span>Added: {formatDate(video.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite.mutate()}
                        className="btn-2007 flex items-center gap-1 text-[10px]"
                        disabled={!user}
                      >
                        <Heart size={10} /> Favorite
                      </button>
                      <button className="btn-2007 flex items-center gap-1 text-[10px]">
                        <ThumbsUp size={10} />
                      </button>
                      <button className="btn-2007 flex items-center gap-1 text-[10px]">
                        <ThumbsDown size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px]">Rate this video:</span>
                    <StarRating
                      rating={video.rating}
                      interactive={!!user}
                      onRate={(r) => rateVideo.mutate(r)}
                    />
                  </div>

                  <p className="text-[11px] mt-4">{video.description}</p>

                  {/* Channel Info */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <img
                        src={video.profiles?.avatar_url || "https://picsum.photos/seed/avatar/40/40"}
                        alt={video.profiles?.username}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <Link
                          to={`/channel/${video.profiles?.id}`}
                          className="link-2007 font-bold text-[12px]"
                        >
                          {video.profiles?.username}
                        </Link>
                        <p className="text-[10px] text-muted-foreground">
                          {video.profiles?.subscribers_count || 0} subscribers
                        </p>
                      </div>
                    </div>
                    {user && user.id !== video.profiles?.id && (
                      <button
                        onClick={handleSubscribe}
                        className={subscription ? "btn-2007" : "btn-2007-blue"}
                      >
                        {subscription ? "Unsubscribe" : "Subscribe"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="border border-border rounded mt-4">
              <div className="box-header-2007 flex items-center gap-1">
                <MessageSquare size={12} />
                Comments ({comments?.length || 0})
              </div>
              <div className="bg-card p-2">
                {user && (
                  <form onSubmit={handleCommentSubmit} className="mb-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full border border-border p-2 text-[11px] bg-background resize-none"
                      rows={3}
                    />
                    <button type="submit" className="btn-2007-blue mt-2">
                      Post Comment
                    </button>
                  </form>
                )}

                {comments && comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="border-b border-border pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="link-2007 text-[11px] font-bold">
                            {c.profiles?.username}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(c.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] mt-1">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0">
            <div className="border border-border rounded">
              <div className="box-header-2007">Related Videos</div>
              <div className="bg-card p-2">
                {relatedVideos?.filter((v) => v.id !== id).slice(0, 5).map((v) => (
                  <Link
                    key={v.id}
                    to={`/watch/${v.id}`}
                    className="block mb-2 last:mb-0"
                  >
                    <img
                      src={v.thumbnail_url || "https://picsum.photos/seed/default/120/90"}
                      alt={v.title}
                      className="w-full border border-border"
                    />
                    <p className="text-[10px] link-2007 mt-1 truncate">{v.title}</p>
                    <p className="text-[9px] text-muted-foreground">
                      {formatViews(v.views_count)} views
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
