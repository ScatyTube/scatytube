import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useChannels } from "@/hooks/useProfiles";
import { useVideos } from "@/hooks/useVideos";
import { useComments } from "@/hooks/useComments";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Community = () => {
  const { data: channels } = useChannels(10);
  const { data: recentVideos } = useVideos({ sort: "recent", limit: 5 });
  const { data: discussedVideos } = useVideos({ sort: "comments", limit: 5 });

  // Get recent activity (comments)
  const { data: recentComments } = useQuery({
    queryKey: ["recent-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles!comments_user_id_fkey (username),
          videos!comments_video_id_fkey (title)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Main Content */}
          <div className="flex-1">
            {/* Recent Activity */}
            <div className="border border-border rounded mb-4">
              <div className="box-header-2007">Recent Activity</div>
              <div className="bg-card p-2">
                {recentComments && recentComments.length > 0 ? (
                  <div className="space-y-2">
                    {recentComments.map((comment) => (
                      <div key={comment.id} className="border-b border-border pb-2 last:border-0">
                        <p className="text-[11px]">
                          <span className="link-2007 font-bold">
                            {comment.profiles?.username}
                          </span>
                          {" commented on "}
                          <Link
                            to={`/watch/${comment.video_id}`}
                            className="link-2007"
                          >
                            {comment.videos?.title}
                          </Link>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          "{comment.content.substring(0, 100)}..."
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-4">
                    No recent activity yet.
                  </p>
                )}
              </div>
            </div>

            {/* Most Discussed */}
            <div className="border border-border rounded">
              <div className="box-header-2007">Most Discussed Videos</div>
              <div className="bg-card p-2">
                {discussedVideos && discussedVideos.length > 0 ? (
                  discussedVideos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/watch/${video.id}`}
                      className="flex gap-2 py-2 border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <img
                        src={video.thumbnail_url || "https://picsum.photos/seed/default/80/60"}
                        alt={video.title}
                        className="w-20 h-15 object-cover border border-border"
                      />
                      <div>
                        <p className="link-2007 text-[11px] font-bold truncate">
                          {video.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {video.comments_count || 0} comments
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-4">
                    No videos yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[250px] flex-shrink-0">
            {/* Active Members */}
            <div className="border border-border rounded mb-4">
              <div className="box-header-2007">Active Members</div>
              <div className="bg-card p-2">
                {channels && channels.length > 0 ? (
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <Link
                        key={channel.id}
                        to={`/channel/${channel.id}`}
                        className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded"
                      >
                        <img
                          src={channel.avatar_url || "https://picsum.photos/seed/avatar/30/30"}
                          alt={channel.username}
                          className="w-8 h-8 rounded border border-border"
                        />
                        <div>
                          <p className="link-2007 text-[11px] font-bold">
                            {channel.username}
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            {channel.subscribers_count || 0} subscribers
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-4">
                    No members yet.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="border border-border rounded">
              <div className="box-header-2007">Recent Uploads</div>
              <div className="bg-card p-2">
                {recentVideos && recentVideos.length > 0 ? (
                  recentVideos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/watch/${video.id}`}
                      className="block mb-2 last:mb-0"
                    >
                      <img
                        src={video.thumbnail_url || "https://picsum.photos/seed/default/120/90"}
                        alt={video.title}
                        className="w-full border border-border"
                      />
                      <p className="text-[10px] link-2007 mt-1 truncate">
                        {video.title}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-4">
                    No videos yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
